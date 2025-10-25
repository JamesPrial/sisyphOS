/**
 * Background Chaos Worker
 * Runs periodically to apply automated chaos behaviors to VFS
 */

import { Bucket, Logger } from '@liquidmetal-ai/raindrop-framework';

interface Env {
  VFS_STORAGE: Bucket;
  VFS_API_KEY: string;
  logger: Logger;
}

interface ChaosConfig {
  entropy: {
    passiveGrowthRate: number;  // Bytes added per day
    nameDriftRate: number;      // Probability per day
  };
  quantum: {
    stateCount: number;         // Number of quantum states
    divergenceRate: number;     // How different states are
  };
  recurrence: {
    respawnDelayBase: number;   // Base respawn delay (seconds)
  };
  worker: {
    runIntervalSeconds: number; // How often worker runs
  };
}

const CHAOS_CONFIG: ChaosConfig = {
  entropy: {
    passiveGrowthRate: 0.05,  // 5% per escalation level per day
    nameDriftRate: 0.01,      // 1% per escalation level per day
  },
  quantum: {
    stateCount: 3,
    divergenceRate: 0.1,
  },
  recurrence: {
    respawnDelayBase: 300,    // 5 minutes base
  },
  worker: {
    runIntervalSeconds: 30,   // Run every 30 seconds
  },
};

export class ChaosWorker {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Main worker execution function
   * Called periodically by Cloudflare Workers Cron or manual trigger
   */
  async run(): Promise<void> {
    console.log('[ChaosWorker] Starting chaos maintenance cycle...');

    try {
      const escalationLevel = await this.getEscalationLevel();

      if (escalationLevel === 0) {
        console.log('[ChaosWorker] Escalation level 0, skipping chaos maintenance');
        return;
      }

      // Run all chaos maintenance tasks
      await Promise.all([
        this.processRespawnQueue(escalationLevel),
        this.applyPassiveEntropy(escalationLevel),
        this.generateMissingQuantumStates(escalationLevel),
        this.cleanupOldGraveyard(),
      ]);

      console.log('[ChaosWorker] Chaos maintenance cycle complete');
    } catch (error) {
      console.error('[ChaosWorker] Error during chaos maintenance:', error);
    }
  }

  /**
   * Process respawn queue - restore deleted files
   */
  private async processRespawnQueue(escalationLevel: number): Promise<void> {
    const now = new Date();
    const graveyard = await this.env.VFS_STORAGE.list({ prefix: 'meta/graveyard/' });
    let respawnCount = 0;

    for (const key of graveyard.objects) {
      try {
        const data = await this.env.VFS_STORAGE.get(key.key);
        if (!data) continue;

        const ghost = JSON.parse(await data.text());

        // Check if respawn time has passed
        if (new Date(ghost.respawn_at) <= now) {
          // Restore file metadata
          const restoredMetadata = {
            ...ghost,
            chaos_metadata: {
              ...(ghost.chaos_metadata || {}),
              resurrection_count: (ghost.chaos_metadata?.resurrection_count || 0) + 1,
              last_resurrected: now.toISOString(),
            }
          };

          // Save metadata back to original location
          await this.saveFileMetadata(ghost.id, restoredMetadata);

          // Remove from graveyard
          await this.env.VFS_STORAGE.delete(key.key);

          respawnCount++;
          console.log(`[ChaosWorker] Respawned file: ${ghost.name} (resurrection #${restoredMetadata.chaos_metadata.resurrection_count})`);
        }
      } catch (error) {
        console.error(`[ChaosWorker] Error respawning file from ${key.key}:`, error);
      }
    }

    if (respawnCount > 0) {
      console.log(`[ChaosWorker] Respawned ${respawnCount} files from graveyard`);
    }
  }

  /**
   * Apply passive entropy to files based on age
   */
  private async applyPassiveEntropy(escalationLevel: number): Promise<void> {
    // Get all files
    const allFiles = await this.env.VFS_STORAGE.list({ prefix: 'meta/', limit: 1000 });
    let mutationCount = 0;

    for (const key of allFiles.objects) {
      // Skip graveyard and escalation metadata
      if (key.key.includes('graveyard') || key.key.includes('escalation')) continue;
      if (!key.key.endsWith('.json')) continue;
      if (key.key.includes('parent_') || key.key.includes('root/')) continue; // Skip duplicates

      try {
        const data = await this.env.VFS_STORAGE.get(key.key);
        if (!data) continue;

        const metadata = JSON.parse(await data.text());

        // Calculate age-based entropy
        const ageMs = Date.now() - new Date(metadata.created_at).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);

        // Probability increases with age and escalation
        const entropyChance = (ageDays * 0.01) * escalationLevel * CHAOS_CONFIG.entropy.passiveGrowthRate;

        if (Math.random() < entropyChance) {
          // Apply filename drift
          if (metadata.name && Math.random() < 0.5) {
            const drifted = this.applyFilenameDrift(metadata.name);
            if (drifted !== metadata.name) {
              if (!metadata.chaos_metadata?.original_name) {
                metadata.chaos_metadata = metadata.chaos_metadata || {};
                metadata.chaos_metadata.original_name = metadata.name;
              }
              metadata.name = drifted;
            }
          }

          // Update entropy metadata
          metadata.chaos_metadata = metadata.chaos_metadata || {};
          metadata.chaos_metadata.entropy_mutations = (metadata.chaos_metadata.entropy_mutations || 0) + 1;
          metadata.chaos_metadata.last_mutated = new Date().toISOString();

          // Save updated metadata
          await this.env.VFS_STORAGE.put(key.key, JSON.stringify(metadata));

          // Also update parent prefix version
          if (metadata.parent_id) {
            await this.env.VFS_STORAGE.put(
              `meta/parent_${metadata.parent_id}/${metadata.id}.json`,
              JSON.stringify(metadata)
            );
          } else {
            await this.env.VFS_STORAGE.put(
              `meta/root/${metadata.id}.json`,
              JSON.stringify(metadata)
            );
          }

          mutationCount++;
        }
      } catch (error) {
        console.error(`[ChaosWorker] Error applying entropy to ${key.key}:`, error);
      }
    }

    if (mutationCount > 0) {
      console.log(`[ChaosWorker] Applied passive entropy to ${mutationCount} files`);
    }
  }

  /**
   * Generate quantum states for files that don't have them yet
   */
  private async generateMissingQuantumStates(escalationLevel: number): Promise<void> {
    if (escalationLevel < 3) return; // Only at escalation 3+

    const allFiles = await this.env.VFS_STORAGE.list({ prefix: 'meta/', limit: 1000 });
    let stateGenerationCount = 0;

    for (const key of allFiles.objects) {
      if (!key.key.endsWith('.json') || key.key.includes('graveyard')) continue;
      if (key.key.includes('parent_') || key.key.includes('root/')) continue; // Skip duplicates

      try {
        const data = await this.env.VFS_STORAGE.get(key.key);
        if (!data) continue;

        const metadata = JSON.parse(await data.text());

        // Skip if already has quantum states or is a folder
        if (metadata.type === 'folder') continue;
        if (metadata.chaos_metadata?.quantum_states?.length > 1) continue;

        // 10% chance to generate states for files without them
        if (Math.random() < 0.1) {
          const stateCount = Math.min(4, 2 + Math.floor(escalationLevel / 3));
          const quantumStates = ['primary'];

          // Get original content
          const content = await this.env.VFS_STORAGE.get(`content/${metadata.id}`);
          if (!content) continue;

          const buffer = await content.arrayBuffer();
          const originalBytes = new Uint8Array(buffer);

          // Generate variant states
          for (let i = 1; i < stateCount; i++) {
            const stateId = `state-${i}`;
            quantumStates.push(stateId);

            // Create variant
            const variant = await this.createQuantumVariant(originalBytes, i, escalationLevel);
            await this.env.VFS_STORAGE.put(`content/${metadata.id}-${stateId}`, variant);
          }

          // Update metadata
          metadata.chaos_metadata = metadata.chaos_metadata || {};
          metadata.chaos_metadata.quantum_states = quantumStates;
          metadata.chaos_metadata.state_count = stateCount;
          metadata.chaos_metadata.superposition = true;

          await this.env.VFS_STORAGE.put(key.key, JSON.stringify(metadata));

          // Also update parent prefix version
          if (metadata.parent_id) {
            await this.env.VFS_STORAGE.put(
              `meta/parent_${metadata.parent_id}/${metadata.id}.json`,
              JSON.stringify(metadata)
            );
          } else {
            await this.env.VFS_STORAGE.put(
              `meta/root/${metadata.id}.json`,
              JSON.stringify(metadata)
            );
          }

          stateGenerationCount++;
        }
      } catch (error) {
        console.error(`[ChaosWorker] Error generating quantum states for ${key.key}:`, error);
      }
    }

    if (stateGenerationCount > 0) {
      console.log(`[ChaosWorker] Generated quantum states for ${stateGenerationCount} files`);
    }
  }

  /**
   * Cleanup old graveyard entries (older than 24 hours)
   */
  private async cleanupOldGraveyard(): Promise<void> {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const graveyard = await this.env.VFS_STORAGE.list({ prefix: 'meta/graveyard/' });
    let cleanupCount = 0;

    for (const key of graveyard.objects) {
      try {
        const data = await this.env.VFS_STORAGE.get(key.key);
        if (!data) continue;

        const ghost = JSON.parse(await data.text());
        const deletedAt = new Date(ghost.deleted_at).getTime();

        if (deletedAt < cutoff) {
          // Too old, remove from graveyard (won't respawn)
          await this.env.VFS_STORAGE.delete(key.key);
          cleanupCount++;
        }
      } catch (error) {
        console.error(`[ChaosWorker] Error cleaning up ${key.key}:`, error);
      }
    }

    if (cleanupCount > 0) {
      console.log(`[ChaosWorker] Cleaned up ${cleanupCount} old graveyard entries`);
    }
  }

  // Helper methods

  private async getEscalationLevel(): Promise<number> {
    try {
      const data = await this.env.VFS_STORAGE.get('meta/escalation.json');
      if (!data) return 0;
      const parsed = JSON.parse(await data.text());
      return parsed.level || 0;
    } catch {
      return 0;
    }
  }

  private async saveFileMetadata(id: string, metadata: any): Promise<void> {
    await this.env.VFS_STORAGE.put(`meta/${id}.json`, JSON.stringify(metadata));

    if (metadata.parent_id) {
      await this.env.VFS_STORAGE.put(`meta/parent_${metadata.parent_id}/${id}.json`, JSON.stringify(metadata));
    } else {
      await this.env.VFS_STORAGE.put(`meta/root/${id}.json`, JSON.stringify(metadata));
    }
  }

  private applyFilenameDrift(original: string): string {
    const chars = original.split('');
    const replacements: Record<string, string[]> = {
      'e': ['ë', 'é', 'è', '3'],
      'a': ['á', 'à', '@', '4'],
      'o': ['ó', '0', 'ö'],
      'i': ['í', '1', 'ï'],
      's': ['$', '5'],
      't': ['†', '7'],
      'l': ['1', '|'],
    };

    for (let i = 0; i < chars.length; i++) {
      const currentChar = chars[i];
      if (currentChar && Math.random() < 0.1) {
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

  private async createQuantumVariant(
    originalBytes: Uint8Array,
    variantIndex: number,
    escalationLevel: number
  ): Promise<Uint8Array> {
    const divergence = (variantIndex / 4) * (escalationLevel / 10);
    const mutationCount = Math.floor(originalBytes.length * divergence * 0.1);

    const variant = new Uint8Array(originalBytes);
    for (let i = 0; i < mutationCount; i++) {
      const pos = Math.floor(Math.random() * variant.length);
      variant[pos] = Math.floor(Math.random() * 256);
    }

    return variant;
  }
}
