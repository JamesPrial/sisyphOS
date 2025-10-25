-- Virtual File System - Database Schema
-- Files and folders table (unified)

CREATE TABLE IF NOT EXISTS vfs_entries (
  id TEXT PRIMARY KEY,              -- UUID
  name TEXT NOT NULL,               -- File/folder name with extension
  type TEXT NOT NULL,               -- 'file' or 'folder'
  parent_id TEXT,                   -- NULL = root directory
  size INTEGER DEFAULT 0,           -- Bytes (folders = sum of contents)
  mime_type TEXT,                   -- MIME type (files only)
  bucket_key TEXT,                  -- Bucket object key (files only)
  created_at TEXT NOT NULL,         -- ISO 8601 timestamp
  modified_at TEXT NOT NULL,        -- ISO 8601 timestamp
  icon TEXT,                        -- Optional emoji icon
  metadata_json TEXT,               -- JSON blob for extended properties

  FOREIGN KEY (parent_id) REFERENCES vfs_entries(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_parent_id ON vfs_entries(parent_id);
CREATE INDEX IF NOT EXISTS idx_type ON vfs_entries(type);
CREATE INDEX IF NOT EXISTS idx_name ON vfs_entries(name);
