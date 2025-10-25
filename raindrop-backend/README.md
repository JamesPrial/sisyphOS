# SisyphOS Virtual File System - Backend API

Complete serverless backend for the SisyphOS Virtual File System, deployed on LiquidMetal Raindrop platform.

## Deployment Information

**Application Name:** `sisyphos-vfs`
**Version ID:** `01k8e372s5xxedcc2kkzv6vha7`
**Platform:** Raindrop (Cloudflare Workers)
**Status:** ✅ RUNNING

### Architecture: Bucket-Only Storage

This VFS uses **bucket storage exclusively** - no SQL database!

**Why bucket-only?**
- SQL database initialization was failing in Raindrop
- Bucket storage is simpler, more reliable
- Supports files up to 5GB
- Prefix-based querying for folder navigation

### Infrastructure Components

- **Service:** `vfs-api` (public HTTP service) ⭐
- **Bucket Storage:** `vfs-storage` (metadata + content) ⭐
- **Auto-provisioned:** KV Cache (`_mem`), Annotations

**Storage Structure:**
```
meta/{id}.json              # Primary metadata
meta/root/{id}.json         # Root-level files (fast listing)
meta/parent_{id}/{id}.json  # Child files (fast listing)
content/{id}                # Actual file content
```

## API Base URL

```
https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run
```

**CORS Enabled:** `Access-Control-Allow-Origin: *`
**Public Access:** No authentication (shared filesystem!)

## Quick Start

### Test the API

```bash
# List files (should return empty array or existing files)
curl -s https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/files

# Create a folder
curl -X POST https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"My Folder"}'

# Upload a file
echo "Hello World" > test.txt
curl -X POST https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/files \
  -F "file=@test.txt"
```

## API Endpoints

### Files

**List Files**
```http
GET /api/files?parent_id={optional}
```

**Get File Metadata**
```http
GET /api/files/{file_id}
```

**Upload File**
```http
POST /api/files
Content-Type: multipart/form-data

file: <File>
parent_id: <optional UUID>
```

**Update File**
```http
PUT /api/files/{file_id}
Content-Type: application/json

{ "name": "new-name.txt" }
```

**Download File**
```http
GET /api/files/{file_id}/content
```

**Delete File**
```http
DELETE /api/files/{file_id}
```

### Folders

**Create Folder**
```http
POST /api/folders
Content-Type: application/json

{
  "name": "Folder Name",
  "parent_id": "<optional UUID>"
}
```

**Delete Folder (Recursive)**
```http
DELETE /api/folders/{folder_id}
```

### Search & Tree

**Search Files**
```http
POST /api/files/search
Content-Type: application/json

{ "query": "search term" }
```

**Get Directory Tree**
```http
GET /api/tree
```

## Development

### Deploy Changes

```bash
# From raindrop-backend directory
raindrop build deploy

# Check deployment status
raindrop build status

# Should see 5 modules running:
# - _mem
# - annotation-bucket
# - annotation-service
# - vfs-api ⭐
# - vfs-storage ⭐
```

### View Logs

```bash
raindrop logs tail -a sisyphos-vfs
```

### Find Service URL

```bash
raindrop build find --moduleType service -o json
```

## Manifest Structure

```hcl
application "sisyphos-vfs" {
  service "vfs-api" {
    visibility = "public"
  }

  bucket "vfs-storage" {}
}
```

**No SQL database** - metadata is stored as JSON in bucket!

## File Metadata Format

```json
{
  "id": "uuid",
  "name": "filename.txt",
  "type": "file" | "folder",
  "parent_id": "uuid | null",
  "size": 1234,
  "mime_type": "text/plain",
  "created_at": "ISO 8601",
  "modified_at": "ISO 8601",
  "icon": "optional emoji"
}
```

## Limits & Specifications

- **Max file size:** 5GB
- **Bucket list limit:** 250 objects (default)
- **CORS:** Enabled for all origins
- **Authentication:** None (public shared filesystem)
- **Persistence:** Permanent (until manually deleted)

## Features

✅ File upload/download
✅ Folder creation/deletion
✅ Hierarchical navigation
✅ Search functionality
✅ Directory tree view
✅ Recursive folder deletion
✅ Metadata management
✅ CORS enabled
✅ Cloud persistence

## Troubleshooting

**Service not responding:**
```bash
raindrop build status
# All modules should show "running"

raindrop build start
# If stopped, this will start it
```

**Testing locally:**
```bash
# Test if service is accessible
curl -v https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/files

# Should return 200 OK with JSON
```

## License

Part of the SisyphOS project.

**"One must imagine the backend happy."** - Albert Camus (probably)
