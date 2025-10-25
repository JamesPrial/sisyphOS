import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';

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
      if (path.match(/\/api\/files\/[^\/]+\/content/)) {
        return this.handleFileContent(request);
      } else if (path.startsWith('/api/files/search')) {
        return this.handleSearch(request);
      } else if (path.startsWith('/api/files')) {
        return this.handleFiles(request);
      } else if (path.startsWith('/api/folders')) {
        return this.handleFolders(request);
      } else if (path === '/api/tree') {
        return this.handleTree(request);
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

  // Helper: List entries by parent
  private async listByParent(parentId: string | null): Promise<FileEntry[]> {
    const prefix = parentId ? `meta/parent_${parentId}/` : `meta/root/`;
    const list = await this.env.VFS_STORAGE.list({ prefix });

    const entries: FileEntry[] = [];
    for (const obj of list.objects) {
      const entry = await this.getMeta(obj.key.replace('meta/', '').replace('.json', ''));
      if (entry) entries.push(entry);
    }

    return entries;
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
          return this.jsonResponse({ entry });
        } else {
          // List files in parent folder
          const parentId = url.searchParams.get('parent_id');
          const entries = await this.listByParent(parentId);
          return this.jsonResponse({ entries });
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

        // Store file content
        await this.env.VFS_STORAGE.put(`content/${id}`, file, {
          httpMetadata: { contentType: file.type }
        });

        // Store metadata
        const newEntry: FileEntry = {
          id,
          name: file.name,
          type: 'file',
          parent_id: parent,
          size: file.size,
          mime_type: file.type,
          created_at: now,
          modified_at: now,
        };

        await this.putMeta(newEntry);

        // Also store with parent prefix for efficient listing
        const parentKey = parent ? `meta/parent_${parent}/${id}.json` : `meta/root/${id}.json`;
        await this.env.VFS_STORAGE.put(parentKey, JSON.stringify(newEntry), {
          httpMetadata: { contentType: 'application/json' }
        });

        return this.jsonResponse({ entry: newEntry });

      case 'PUT':
        if (!fileId) {
          return this.jsonResponse({ error: 'File ID required' }, 400);
        }

        const body: any = await request.json();
        const entry = await this.getMeta(fileId);
        if (!entry) {
          return this.jsonResponse({ error: 'File not found' }, 404);
        }

        // Update metadata
        entry.name = body.name || entry.name;
        entry.modified_at = new Date().toISOString();
        await this.putMeta(entry);

        return this.jsonResponse({ entry });

      case 'DELETE':
        if (!fileId) {
          return this.jsonResponse({ error: 'File ID required' }, 400);
        }

        await this.deleteMeta(fileId);
        return this.jsonResponse({ success: true });

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
          parent_id: parent_id || null,
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

        return this.jsonResponse({ entry: newFolder });

      case 'DELETE':
        if (!folderId) {
          return this.jsonResponse({ error: 'Folder ID required' }, 400);
        }

        // Delete folder and all its contents recursively
        await this.deleteRecursive(folderId);
        return this.jsonResponse({ success: true });

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

    return this.jsonResponse({ results });
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
}
