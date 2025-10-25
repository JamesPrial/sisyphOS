# Chaos Worker Documentation

## Overview

The Chaos Worker is a background automation system that applies automated chaos behaviors to the Virtual File System (VFS) without requiring user interaction. It runs periodically to create passive entropy, process file respawns, generate quantum states, and maintain the graveyard.

## Architecture

### Components

1. **chaosWorker.ts** - Core worker module with chaos behaviors
2. **index.ts** - VFS API with chaos worker endpoint integration
3. **Manual Trigger Endpoint** - `/api/chaos-worker` (POST)
4. **Automatic Execution** - Can be configured via Cloudflare Workers Cron (future)

### File Locations

```
raindrop-backend/
├── src/vfs-api/
│   ├── chaosWorker.ts          # Main chaos worker implementation
│   ├── index.ts                # VFS API with worker integration
│   └── raindrop.gen.ts         # Generated environment types
└── CHAOS_WORKER.md             # This documentation
```

## Chaos Behaviors

### 1. Respawn Queue Processing

**Purpose:** Resurrect deleted files from the graveyard after their respawn delay.

**How it works:**
- Scans `meta/graveyard/` for deleted files
- Checks if `respawn_at` timestamp has passed
- Restores file metadata to original location
- Increments `resurrection_count` in chaos metadata
- Removes file from graveyard

**Triggers:**
- Runs on every worker execution
- Only processes files where `now >= respawn_at`

**Example:**
```typescript
// Before (in graveyard)
{
  "id": "abc-123",
  "name": "document.txt",
  "deleted_at": "2025-10-25T10:00:00Z",
  "respawn_at": "2025-10-25T10:05:00Z"  // 5 minutes later
}

// After (restored)
{
  "id": "abc-123",
  "name": "document.txt",
  "chaos_metadata": {
    "resurrection_count": 1,
    "last_resurrected": "2025-10-25T10:05:01Z"
  }
}
```

### 2. Passive Entropy

**Purpose:** Files age and degrade over time, even without user interaction.

**How it works:**
- Calculates file age in days
- Entropy probability: `(age_days × 0.01) × escalation_level × 0.05`
- Applies filename drift character substitutions
- Tracks mutations in `chaos_metadata.entropy_mutations`

**Character Substitutions:**
```
e → ë, é, è, 3
a → á, à, @, 4
o → ó, 0, ö
i → í, 1, ï
s → $, 5
t → †, 7
l → 1, |
```

**Example Progression:**
```
Day 0:  "report.txt"
Day 1:  "r3port.txt"      (e → 3)
Day 3:  "r3p0rt.txt"      (o → 0)
Day 5:  "r3p0r†.txt"      (t → †)
Day 10: "r3p0r†.†x†"      (multiple mutations)
```

**Escalation Impact:**
- Level 0: No entropy
- Level 1: 0.05% chance per day
- Level 5: 0.25% chance per day
- Level 10: 0.5% chance per day

### 3. Quantum State Generation

**Purpose:** Create quantum variants for files uploaded before escalation level 3.

**Requirements:**
- Only runs at escalation level 3+
- Only for files without existing quantum states
- Skips folders

**How it works:**
- 10% chance per file per worker run
- Generates 2-4 quantum states based on escalation
- Creates content variants by mutating bytes
- Stores variants as `content/{id}-state-{n}`

**State Count Formula:**
```typescript
stateCount = Math.min(4, 2 + Math.floor(escalationLevel / 3))
```

**Escalation Levels:**
- Level 3-5: 2 states
- Level 6-8: 3 states
- Level 9-10: 4 states

**Divergence:**
- Variant 1: 2.5% byte mutation (escalation 5)
- Variant 2: 5% byte mutation
- Variant 3: 7.5% byte mutation

### 4. Graveyard Cleanup

**Purpose:** Remove old graveyard entries that are too stale to respawn.

**How it works:**
- Checks `deleted_at` timestamp
- Removes entries older than 24 hours
- Prevents infinite graveyard growth

**Rationale:**
Files in graveyard for >24 hours are considered permanently forgotten by the system. They won't respawn anymore.

## Configuration

### Chaos Config (chaosWorker.ts)

```typescript
const CHAOS_CONFIG = {
  entropy: {
    passiveGrowthRate: 0.05,    // 5% per escalation level per day
    nameDriftRate: 0.01,        // 1% per escalation level per day
  },
  quantum: {
    stateCount: 3,
    divergenceRate: 0.1,
  },
  recurrence: {
    respawnDelayBase: 300,      // 5 minutes base delay
  },
  worker: {
    runIntervalSeconds: 30,     // Target run frequency
  },
};
```

## API Endpoints

### Manual Trigger

**Endpoint:** `POST /api/chaos-worker`

**Authentication:** Requires `api_key` query parameter or `Authorization: Bearer {key}` header

**Request:**
```bash
curl -X POST "https://{domain}/api/chaos-worker?api_key={key}"
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Chaos worker executed successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Testing

### Test Interface

Open `test-chaos-worker.html` in browser:

```bash
# Serve locally
python3 -m http.server 8000
# Open http://localhost:8000/test-chaos-worker.html
```

### Test Scenarios

#### 1. Respawn Testing

```javascript
1. Upload test files
2. Set escalation to level 5
3. Delete a test file
4. Wait 5 minutes (or trigger worker manually)
5. Verify file reappears with resurrection_count: 1
```

#### 2. Entropy Testing

```javascript
1. Upload files with plain ASCII names
2. Set escalation to level 5
3. Trigger worker multiple times (or wait)
4. Observe filename drift over time
5. Check chaos_metadata.entropy_mutations counter
```

#### 3. Quantum State Testing

```javascript
1. Upload a text file at escalation level 2
2. Increase escalation to level 5
3. Trigger worker multiple times
4. Eventually (10% chance), file gets quantum states
5. Download file multiple times - observe different content
```

#### 4. Graveyard Cleanup

```javascript
1. Manually create old graveyard entries (>24h ago)
2. Trigger worker
3. Verify old entries are removed
4. Recent entries remain
```

## Deployment

### Current Deployment

```bash
cd raindrop-backend
npm run build
npx raindrop build deploy
```

**Deployed URL:**
```
https://01k8e372u4cptexvbaz8g2pfvr.vfs-api.raindrop.liquidmetal.ai
```

### Future: Automatic Execution

To enable automatic periodic execution via Cloudflare Workers Cron:

**Option 1: Add scheduled() method to service**

```typescript
export default class VFSService extends Service<Env> {
  // Add scheduled handler for cron triggers
  async scheduled(event: ScheduledEvent): Promise<void> {
    const worker = new ChaosWorker(this.env);
    await worker.run();
  }
}
```

**Option 2: Configure cron in raindrop.manifest**

```yaml
services:
  - name: vfs-api
    crons:
      - schedule: "*/30 * * * *"  # Every 30 minutes
        handler: "chaosWorker"
```

## Performance Considerations

### Batch Processing

Worker processes up to **1000 files per run** (R2 list limit):

```typescript
const allFiles = await this.env.VFS_STORAGE.list({ prefix: 'meta/', limit: 1000 });
```

**For larger datasets:** Implement pagination or cursor-based iteration.

### Error Handling

- Individual file errors don't stop worker execution
- Each chaos behavior wrapped in try/catch
- Errors logged but worker continues

### Idempotency

Worker can run multiple times safely:
- Respawn checks timestamp before restoring
- Entropy is probabilistic (won't double-apply)
- Quantum states check if already exist
- Graveyard cleanup is time-based

## Logging

Worker emits console logs for monitoring:

```
[ChaosWorker] Starting chaos maintenance cycle...
[ChaosWorker] Respawned file: document.txt (resurrection #1)
[ChaosWorker] Respawned 3 files from graveyard
[ChaosWorker] Applied passive entropy to 5 files
[ChaosWorker] Generated quantum states for 2 files
[ChaosWorker] Cleaned up 1 old graveyard entries
[ChaosWorker] Chaos maintenance cycle complete
```

View logs:
```bash
npx raindrop logs tail vfs-api
```

## Monitoring

### Key Metrics

1. **Respawn Rate** - Files resurrected per worker run
2. **Entropy Mutations** - Files mutated per run
3. **Quantum Generation** - States created per run
4. **Graveyard Size** - Current entries in graveyard
5. **Worker Errors** - Failed operations

### Health Checks

Worker is healthy if:
- Runs complete without throwing errors
- Respawn queue is processing (if files exist)
- Entropy applies at expected rate
- Graveyard cleanup prevents unbounded growth

## Troubleshooting

### Worker not running

**Check:**
1. Deployment status: `npx raindrop build status`
2. Manual trigger works: `POST /api/chaos-worker`
3. API key is valid
4. Logs show execution: `npx raindrop logs tail vfs-api`

### Files not respawning

**Check:**
1. Files exist in graveyard: `meta/graveyard/{id}.json`
2. `respawn_at` timestamp has passed
3. Worker is running at configured interval
4. Escalation level > 0

### Entropy not applying

**Check:**
1. Files have `created_at` timestamp
2. Escalation level > 0
3. Files are old enough (age in days)
4. Probability is low - may take multiple runs

### Quantum states not generating

**Check:**
1. Escalation level >= 3
2. Files are not folders
3. Files don't already have quantum states
4. 10% probability - may take multiple runs

## Future Enhancements

### Planned Features

1. **Scheduled Execution** - Cloudflare Workers Cron integration
2. **Configurable Intervals** - Per-escalation level worker frequency
3. **Chaos Metrics API** - Endpoint to query chaos statistics
4. **Worker Dashboard** - Visual monitoring interface
5. **Custom Chaos Rules** - User-configurable chaos behaviors
6. **Chaos Rollback** - Restore original filenames/content

### Performance Improvements

1. **Cursor-based pagination** - Handle >1000 files
2. **Parallel processing** - Process files concurrently
3. **Selective execution** - Only run needed behaviors
4. **Cache optimization** - Reduce R2 reads

## Philosophy

The Chaos Worker embodies the VFS's absurdist philosophy:

> "Like entropy in thermodynamics, chaos is not a bug - it's the natural state of the system. Files don't decay because of errors; they decay because that's what files do. The worker doesn't introduce chaos; it simply allows the universe to be itself."

The worker creates futility through:
- **Passive decay** - Files change without user action
- **Eternal recurrence** - Deleted files always return
- **Quantum uncertainty** - File content becomes indeterminate
- **Sisyphean cleanup** - Graveyard grows faster than cleanup

## License

Part of the SisyphOS Fantasy Operating System project.

---

*"One must imagine the chaos worker happy."* - Albert Camus (probably)
