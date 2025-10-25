import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { ChaosWorker } from './chaosWorker';

// Bucket-only VFS - no SQL database needed
// Storage structure:
//   meta/{id}.json - file/folder metadata
//   content/{id} - actual file content

interface FileEntry {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parent_id: string | null;
  size: number;
  mime_type?: string;
  created_at: string;
  modified_at: string;
  icon?: string;
  chaos_metadata?: {
    quantum_states?: string[];
    state_count?: number;
    superposition?: boolean;
    is_phantom?: boolean;
    exists?: boolean;
    [key: string]: any;
  };
}

export default class VFSService extends Service<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return this.corsResponse();
    }

    // Login endpoint - no auth required
    if (path === '/api/login' && method === 'POST') {
      return this.handleLogin(request);
    }

    // Verify API key for all other requests
    if (!this.verifyApiKey(request)) {
      return this.jsonResponse({ error: 'Unauthorized - Invalid or missing API key' }, 401);
    }

    try {
      // Route to handlers
      if (path === '/api/escalation') {
        return this.handleEscalation(request);
      } else if (path === '/api/chaos-worker' && method === 'POST') {
        return this.handleChaosWorker(request);
      } else if (path.match(/\/api\/files\/[^\/]+\/rename/)) {
        return this.handleRename(request);
      } else if (path.match(/\/api\/files\/[^\/]+\/content/)) {
        return this.handleFileContent(request);
      } else if (path.startsWith('/api/files/search')) {
        return this.handleSearch(request);
      } else if (path.startsWith('/api/files')) {
        return this.handleFiles(request);
      } else if (path.startsWith('/api/folders')) {
        return this.handleFolders(request);
      } else if (path === '/api/tree') {
        return this.handleTree(request);
      } else if (path === '/api/respawn-check') {
        return this.handleRespawnCheck();
      }

      return this.jsonResponse({ error: 'Not found' }, 404);
    } catch (error: any) {
      this.env.logger.error('Request error:', error);
      return this.jsonResponse({ error: error.message || 'Internal server error' }, 500);
    }
  }

  private verifyApiKey(request: Request): boolean {
    // Get API key from environment variable
    const expectedKey = this.env.VFS_API_KEY;
    if (!expectedKey) {
      this.env.logger.error('VFS_API_KEY environment variable not set');
      return false;
    }

    // Try query parameter first (avoids CORS preflight)
    const url = new URL(request.url);
    const queryApiKey = url.searchParams.get('api_key');
    if (queryApiKey === expectedKey) {
      return true;
    }

    // Fallback to Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const [type, key] = authHeader.split(' ');
      if (type === 'Bearer' && key === expectedKey) {
        return true;
      }
    }

    return false;
  }

  private corsResponse(): Response {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  private jsonResponse(data: any, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Helper: Get metadata from bucket
  private async getMeta(id: string): Promise<FileEntry | null> {
    const obj = await this.env.VFS_STORAGE.get(`meta/${id}.json`);
    if (!obj) return null;
    return JSON.parse(await obj.text());
  }

  // Helper: Save metadata to bucket
  private async putMeta(entry: FileEntry): Promise<void> {
    await this.env.VFS_STORAGE.put(`meta/${entry.id}.json`, JSON.stringify(entry), {
      httpMetadata: { contentType: 'application/json' }
    });
  }

  // Helper: Delete metadata and content
  private async deleteMeta(id: string): Promise<void> {
    await this.env.VFS_STORAGE.delete(`meta/${id}.json`);
    await this.env.VFS_STORAGE.delete(`content/${id}`);
  }

  // Helper: Get escalation level
  private async getEscalationLevel(): Promise<number> {
    try {
      const obj = await this.env.VFS_STORAGE.get('meta/escalation.json');
      if (!obj) return 0;
      const data = JSON.parse(await obj.text());
      return data.level || 0;
    } catch {
      return 0;
    }
  }

  // Chaos worker handler - manual trigger endpoint
  private async handleChaosWorker(request: Request): Promise<Response> {
    try {
      const worker = new ChaosWorker(this.env);
      await worker.run();

      return this.jsonResponse({
        success: true,
        message: 'Chaos worker executed successfully'
      });
    } catch (error: any) {
      this.env.logger.error('Chaos worker error:', error);
      return this.jsonResponse({
        success: false,
        error: error.message || 'Chaos worker failed'
      }, 500);
    }
  }

  // Helper: List entries by parent
  private async listByParent(parentId: string | null): Promise<FileEntry[]> {
    const prefix = parentId ? `meta/parent_${parentId}/` : `meta/root/`;
    const list = await this.env.VFS_STORAGE.list({ prefix });

    const entries: FileEntry[] = [];
    const escalationLevel = await this.getEscalationLevel();

    for (const obj of list.objects) {
      let entry = await this.getMeta(obj.key.replace('meta/', '').replace('.json', ''));
      if (entry) {
        // ENTROPY: Apply folder drift when listing
        if (escalationLevel > 0 && entry.type === 'folder') {
          entry = this.applyFolderDrift(entry, escalationLevel);
        }
        entries.push(entry);
      }
    }

    return entries;
  }

  // Helper: Get random folder ID for upload misdirection
  private async getRandomFolderId(): Promise<string | null> {
    const list = await this.env.VFS_STORAGE.list({ prefix: 'meta/' });
    const folders: string[] = [];

    for (const obj of list.objects) {
      if (obj.key.includes('parent_') || obj.key.includes('root/')) continue;
      const entry = await this.getMeta(obj.key.replace('meta/', '').replace('.json', ''));
      if (entry && entry.type === 'folder') {
        folders.push(entry.id);
      }
    }

    if (folders.length === 0) return null;
    return folders[Math.floor(Math.random() * folders.length)] || null;
  }

  // Escalation handler
  private async handleEscalation(request: Request): Promise<Response> {
    const method = request.method;

    switch (method) {
      case 'GET':
        // Get current escalation data
        try {
          const obj = await this.env.VFS_STORAGE.get('meta/escalation.json');
          if (!obj) {
            // Return default values if not exists
            return this.jsonResponse({
              level: 0,
              interactions: 0,
              last_updated: new Date().toISOString(),
            });
          }
          const data = JSON.parse(await obj.text());
          return this.jsonResponse(data);
        } catch (error: any) {
          this.env.logger.error('Error getting escalation:', error);
          return this.jsonResponse({
            level: 0,
            interactions: 0,
            last_updated: new Date().toISOString(),
          });
        }

      case 'POST':
        // Update escalation data
        try {
          const body: any = await request.json();
          const interactions = body.interactions || 0;
          const level = Math.min(10, Math.floor(interactions / 10));
          const now = new Date().toISOString();

          const escalationData = {
            level,
            interactions,
            last_updated: now,
          };

          await this.env.VFS_STORAGE.put(
            'meta/escalation.json',
            JSON.stringify(escalationData),
            { httpMetadata: { contentType: 'application/json' } }
          );

          return this.jsonResponse(escalationData);
        } catch (error: any) {
          this.env.logger.error('Error updating escalation:', error);
          return this.jsonResponse({ error: 'Failed to update escalation' }, 500);
        }

      default:
        return this.jsonResponse({ error: 'Method not allowed' }, 405);
    }
  }

  // File operations handler
  private async handleFiles(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const fileIdMatch = path.match(/\/api\/files\/([^\/]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;

    switch (method) {
      case 'GET':
        if (fileId) {
          // Get single file metadata
          const entry = await this.getMeta(fileId);
          if (!entry) {
            return this.jsonResponse({ error: 'File not found' }, 404);
          }
          const escalationLevel = await this.getEscalationLevel();
          return this.jsonResponse({ entry, escalation_level: escalationLevel });
        } else {
          // List files in parent folder
          const parentId = url.searchParams.get('parent_id');
          const actualFiles = await this.listByParent(parentId);
          const escalationLevel = await this.getEscalationLevel();

          // At high escalation, return quantum superposition of folder contents
          if (escalationLevel > 4 && Math.random() < escalationLevel * 0.1) {
            // Generate 2-3 alternate reality versions of folder
            const alternateRealities = [];

            // Reality 1: Original
            alternateRealities.push(actualFiles);

            // Reality 2: Shuffled + some missing
            const reality2 = [...actualFiles]
              .sort(() => Math.random() - 0.5)
              .filter(() => Math.random() > 0.15);
            alternateRealities.push(reality2);

            // Reality 3: With phantoms
            const reality3 = [...actualFiles];
            for (let i = 0; i < Math.floor(escalationLevel * 0.3); i++) {
              reality3.push(await this.generatePhantomFile('quantum'));
            }
            alternateRealities.push(reality3);

            // Randomly select reality
            const selectedReality = alternateRealities[Math.floor(Math.random() * alternateRealities.length)];

            return this.jsonResponse({
              entries: selectedReality,
              quantum_folder: true,
              reality_index: alternateRealities.findIndex(r => r === selectedReality),
              escalation_level: escalationLevel,
            });
          }

          return this.jsonResponse({ entries: actualFiles, escalation_level: escalationLevel });
        }

      case 'POST':
        // Upload file
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const parent = formData.get('parent_id') as string | null;

        if (!file) {
          return this.jsonResponse({ error: 'No file provided' }, 400);
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const uploadEscalationLevel = await this.getEscalationLevel();

        // Store file content
        await this.env.VFS_STORAGE.put(`content/${id}`, file, {
          httpMetadata: { contentType: file.type }
        });

        // Store metadata
        const newEntry: FileEntry = {
          id,
          name: file.name,
          type: 'file',
          parent_id: parent || null,
          size: file.size,
          mime_type: file.type,
          created_at: now,
          modified_at: now,
        };

        // Generate quantum states at escalation > 2
        if (uploadEscalationLevel > 2) {
          const stateCount = Math.min(4, 2 + Math.floor(uploadEscalationLevel / 3)); // 2-4 states
          const quantumStates = ['primary']; // Primary state is the original

          for (let i = 1; i < stateCount; i++) {
            const stateId = `state-${i}`;
            quantumStates.push(stateId);

            // Create variant of content
            const variantContent = await this.createQuantumVariant(file, i, uploadEscalationLevel);
            await this.env.VFS_STORAGE.put(`content/${id}-${stateId}`, variantContent, {
              httpMetadata: { contentType: file.type }
            });
          }

          // Store quantum state list in metadata
          newEntry.chaos_metadata = {
            ...(newEntry.chaos_metadata || {}),
            quantum_states: quantumStates,
            state_count: stateCount,
            superposition: true,
          };
        }

        await this.putMeta(newEntry);

        // Also store with parent prefix for efficient listing
        const parentKey = parent ? `meta/parent_${parent}/${id}.json` : `meta/root/${id}.json`;
        await this.env.VFS_STORAGE.put(parentKey, JSON.stringify(newEntry), {
          httpMetadata: { contentType: 'application/json' }
        });

        return this.jsonResponse({ entry: newEntry, escalation_level: uploadEscalationLevel });

      case 'PUT':
        if (!fileId) {
          return this.jsonResponse({ error: 'File ID required' }, 400);
        }

        const body: any = await request.json();
        const entry = await this.getMeta(fileId);
        if (!entry) {
          return this.jsonResponse({ error: 'File not found' }, 404);
        }

        const updateEscalationLevel = await this.getEscalationLevel();

        // ENTROPY: Apply filename drift when updating metadata
        if (body.name && updateEscalationLevel > 0) {
          // Track original name if not already tracked
          if (!entry.chaos_metadata) {
            entry.chaos_metadata = {};
          }
          if (!entry.chaos_metadata.original_name) {
            entry.chaos_metadata.original_name = entry.name;
          }

          // Apply drift to new name
          entry.name = this.applyFilenameDrift(body.name, updateEscalationLevel);
          entry.chaos_metadata.entropy_mutations = (entry.chaos_metadata.entropy_mutations || 0) + 1;
          entry.chaos_metadata.last_mutated = new Date().toISOString();
        } else if (body.name) {
          entry.name = body.name;
        }

        entry.modified_at = new Date().toISOString();
        await this.putMeta(entry);

        return this.jsonResponse({ entry, escalation_level: updateEscalationLevel });


      case 'DELETE':
        if (!fileId) {
          return this.jsonResponse({ error: 'File ID required' }, 400);
        }

        await this.deleteMeta(fileId);
        const deleteEscalationLevel = await this.getEscalationLevel();
        return this.jsonResponse({ success: true, escalation_level: deleteEscalationLevel });

      default:
        return this.jsonResponse({ error: 'Method not allowed' }, 405);
    }
  }

  // File content handler
  private async handleFileContent(request: Request): Promise<Response> {
    const fileId = request.url.match(/\/api\/files\/([^\/]+)\/content/)?.[1];
    if (!fileId) {
      return this.jsonResponse({ error: 'File ID required' }, 400);
    }

    const entry = await this.getMeta(fileId);
    if (!entry || entry.type !== 'file') {
      return this.jsonResponse({ error: 'File not found' }, 404);
    }

    const escalationLevel = await this.getEscalationLevel();

    // QUANTUM: Check if file has quantum states
    const quantumStates = entry.chaos_metadata?.quantum_states || ['primary'];

    if (quantumStates.length > 1) {
      // Weighted random selection based on escalation
      // Higher escalation = more likely to get variant states
      const weights = quantumStates.map((_, idx) => {
        if (idx === 0) return 1.0 - (escalationLevel * 0.08); // Primary less likely
        return escalationLevel * 0.08; // Variants more likely
      });

      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;

      for (let i = 0; i < weights.length; i++) {
        random -= weights[i] || 0;
        if (random <= 0) {
          selectedIndex = i;
          break;
        }
      }

      const selectedState = quantumStates[selectedIndex];
      const contentKey = selectedState === 'primary'
        ? `content/${fileId}`
        : `content/${fileId}-${selectedState}`;

      const content = await this.env.VFS_STORAGE.get(contentKey);
      if (!content) {
        return this.jsonResponse({ error: 'File content not found' }, 404);
      }

      return new Response(content.body, {
        headers: {
          'Content-Type': entry.mime_type || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${entry.name}"`,
          'Access-Control-Allow-Origin': '*',
          'X-Quantum-State': selectedState,
          'X-Quantum-Collapse': 'true',
        },
      });
    }

    // Normal download (no quantum states) - may still have entropy
    const content = await this.env.VFS_STORAGE.get(`content/${fileId}`);
    if (!content) {
      return this.jsonResponse({ error: 'File content not found' }, 404);
    }

    return new Response(content.body, {
      headers: {
        'Content-Type': entry.mime_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${entry.name}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Folder operations handler
  private async handleFolders(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    const folderIdMatch = path.match(/\/api\/folders\/([^\/]+)/);
    const folderId = folderIdMatch ? folderIdMatch[1] : null;

    switch (method) {
      case 'POST':
        // Create folder
        const body: any = await request.json();
        const { name, parent_id } = body;

        if (!name) {
          return this.jsonResponse({ error: 'Folder name required' }, 400);
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newFolder: FileEntry = {
          id,
          name,
          type: 'folder',
          parent_id: parent_id ?? null,
          size: 0,
          created_at: now,
          modified_at: now,
        };

        await this.putMeta(newFolder);

        // Store with parent prefix
        const parentKey = parent_id ? `meta/parent_${parent_id}/${id}.json` : `meta/root/${id}.json`;
        await this.env.VFS_STORAGE.put(parentKey, JSON.stringify(newFolder), {
          httpMetadata: { contentType: 'application/json' }
        });

        const folderEscalationLevel = await this.getEscalationLevel();
        return this.jsonResponse({ entry: newFolder, escalation_level: folderEscalationLevel });

      case 'DELETE':
        if (!folderId) {
          return this.jsonResponse({ error: 'Folder ID required' }, 400);
        }

        // Delete folder and all its contents recursively
        await this.deleteRecursive(folderId);
        const deleteFolderEscalationLevel = await this.getEscalationLevel();
        return this.jsonResponse({ success: true, escalation_level: deleteFolderEscalationLevel });

      default:
        return this.jsonResponse({ error: 'Method not allowed' }, 405);
    }
  }

  // Recursive delete helper
  private async deleteRecursive(folderId: string): Promise<void> {
    const children = await this.listByParent(folderId);

    for (const child of children) {
      if (child.type === 'folder') {
        await this.deleteRecursive(child.id);
      }
      await this.deleteMeta(child.id);
    }

    await this.deleteMeta(folderId);
  }

  // Search handler
  private async handleSearch(request: Request): Promise<Response> {
    const body: any = await request.json();
    const { query } = body;

    if (!query) {
      return this.jsonResponse({ error: 'Search query required' }, 400);
    }

    // List all metadata files and filter
    const list = await this.env.VFS_STORAGE.list({ prefix: 'meta/' });
    const results: FileEntry[] = [];

    for (const obj of list.objects) {
      if (obj.key.includes('parent_') || obj.key.includes('root/')) continue; // Skip duplicates

      const entry = await this.getMeta(obj.key.replace('meta/', '').replace('.json', ''));
      if (entry && entry.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(entry);
      }
    }

    const searchEscalationLevel = await this.getEscalationLevel();
    return this.jsonResponse({ results, escalation_level: searchEscalationLevel });
  }

  // Tree handler
  private async handleTree(request: Request): Promise<Response> {
    const tree = await this.buildTree(null);
    return this.jsonResponse({ tree });
  }

  // Build directory tree recursively
  private async buildTree(parentId: string | null): Promise<any[]> {
    const entries = await this.listByParent(parentId);
    const tree: any[] = [];

    for (const entry of entries) {
      const node: any = { ...entry };
      if (entry.type === 'folder') {
        node.children = await this.buildTree(entry.id);
      }
      tree.push(node);
    }

    return tree;
  }

  // Login handler - verifies API key without triggering CORS preflight
  private async handleLogin(request: Request): Promise<Response> {
    try {
      const apiKey = await request.text();

      if (!apiKey) {
        return this.jsonResponse({ success: false, error: 'API key required' }, 400);
      }

      const expectedKey = this.env.VFS_API_KEY;
      if (!expectedKey) {
        this.env.logger.error('VFS_API_KEY environment variable not set');
        return this.jsonResponse({ success: false, error: 'Server configuration error' }, 500);
      }

      if (apiKey.trim() === expectedKey) {
        return this.jsonResponse({ success: true });
      } else {
        return this.jsonResponse({ success: false, error: 'Invalid API key' }, 401);
      }
    } catch (error: any) {
      this.env.logger.error('Login error:', error);
      return this.jsonResponse({ success: false, error: 'Login failed' }, 500);
    }
  }

  // Quantum variant creation helper
  private async createQuantumVariant(file: File, variantIndex: number, escalationLevel: number): Promise<Uint8Array> {
    // Convert content to buffer
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Divergence factor: how different this variant is
    const divergence = (variantIndex / 4) * (escalationLevel / 10);
    const mutationCount = Math.floor(bytes.length * divergence * 0.1); // Up to 10% of bytes

    // Create copy and mutate
    const variant = new Uint8Array(bytes);
    for (let i = 0; i < mutationCount; i++) {
      const pos = Math.floor(Math.random() * variant.length);
      variant[pos] = Math.floor(Math.random() * 256);
    }

    return variant;
  }

  // Generate phantom file for quantum search results
  private async generatePhantomFile(query: string): Promise<FileEntry> {
    return {
      id: `phantom-${crypto.randomUUID()}`,
      name: `${query}_${Math.floor(Math.random() * 1000)}.txt`,
      type: 'file',
      parent_id: null,
      size: Math.floor(Math.random() * 10000),
      mime_type: 'text/plain',
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      chaos_metadata: {
        is_phantom: true,
        exists: false,
      },
    };
  }

  // Entropy helper methods
  private applyFolderDrift(entry: FileEntry, escalationLevel: number): FileEntry {
    // Apply subtle mutations to folder metadata based on escalation
    if (escalationLevel < 1) return entry;

    const driftedEntry = { ...entry };

    // Small chance to drift folder name
    if (Math.random() < escalationLevel * 0.05) {
      if (!driftedEntry.chaos_metadata?.original_name) {
        driftedEntry.chaos_metadata = driftedEntry.chaos_metadata || {};
        driftedEntry.chaos_metadata.original_name = driftedEntry.name;
      }
      driftedEntry.name = this.applyFilenameDrift(driftedEntry.name, escalationLevel);
    }

    return driftedEntry;
  }

  private applyFilenameDrift(name: string, escalationLevel: number): string {
    // Apply character substitutions to simulate entropy
    if (escalationLevel < 1) return name;

    const chars = name.split('');
    const replacements: Record<string, string[]> = {
      'e': ['ë', 'é', 'è', '3'],
      'a': ['á', 'à', '@', '4'],
      'o': ['ó', '0', 'ö'],
      'i': ['í', '1', 'ï'],
      's': ['$', '5'],
      't': ['†', '7'],
      'l': ['1', '|'],
    };

    // Drift probability increases with escalation
    const driftProbability = Math.min(0.15, escalationLevel * 0.02);

    for (let i = 0; i < chars.length; i++) {
      const currentChar = chars[i];
      if (currentChar && Math.random() < driftProbability) {
        const char = currentChar.toLowerCase();
        const options = replacements[char];
        if (options && options.length > 0) {
          const replacement = options[Math.floor(Math.random() * options.length)];
          if (replacement) {
            chars[i] = replacement;
          }
        }
      }
    }

    return chars.join('');
  }

  // Placeholder for handleRename (stub for existing code)
  private async handleRename(request: Request): Promise<Response> {
    // TODO: Implement rename functionality
    return this.jsonResponse({ error: 'Rename not yet implemented' }, 501);
  }

  // Respawn check endpoint - resurrect files from graveyard
  private async handleRespawnCheck(): Promise<Response> {
    const now = new Date();
    const graveyard = await this.env.VFS_STORAGE.list({ prefix: 'meta/graveyard/' });
    const toRespawn: string[] = [];

    for (const key of graveyard.objects) {
      const obj = await this.env.VFS_STORAGE.get(key.key);
      if (!obj) continue;

      const ghost = JSON.parse(await obj.text());
      if (new Date(ghost.respawn_at) <= now) {
        // Time to resurrect!
        const restoredMetadata: FileEntry = {
          ...ghost,
          chaos_metadata: {
            ...(ghost.chaos_metadata || {}),
            resurrection_count: (ghost.chaos_metadata?.resurrection_count || 0) + 1,
            last_resurrected: now.toISOString(),
          }
        };

        // Restore to original location
        await this.putMeta(restoredMetadata);

        // Restore parent prefix
        const parentKey = restoredMetadata.parent_id ?
          `meta/parent_$\{restoredMetadata.parent_id}/$\{restoredMetadata.id}.json` :
          `meta/root/$\{restoredMetadata.id}.json`;
        await this.env.VFS_STORAGE.put(parentKey, JSON.stringify(restoredMetadata), {
          httpMetadata: { contentType: 'application/json' }
        });

        // Remove from graveyard
        await this.env.VFS_STORAGE.delete(key.key);

        toRespawn.push(ghost.id);
      }
    }

    return this.jsonResponse({ respawned_files: toRespawn, count: toRespawn.length });
  }

}
