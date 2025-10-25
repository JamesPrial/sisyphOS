# Virtual File System Backend Integration Guide

This document explains how to integrate the deployed Raindrop VFS backend with the SisyphOS frontend.

## Backend Deployment Status

✅ **Successfully Deployed**

- **Platform:** LiquidMetal Raindrop (Cloudflare Workers)
- **Application:** `sisyphos-vfs`
- **Version:** `01k8dy6t98jqr1ek8thaxc6mqx`
- **Base URL:** `https://01k8dy6t98jqr1ek8thaxc6mqx.raindrop.liquidmetal.ai`
- **Location:** `/raindrop-backend/`

## Backend Architecture

**Components:**
- **vfs-api:** Public HTTP service handling all API requests
- **vfs-metadata:** SQL database storing file/folder metadata
- **vfs-storage:** S3-compatible bucket storing actual file content

**Features:**
- Hierarchical folder structure with unlimited nesting
- File upload/download with MIME type preservation
- Full-text search by filename
- Directory tree traversal
- Breadcrumb path generation
- CASCADE delete (folders recursively delete all children)
- CORS enabled for all endpoints

## Frontend Integration Steps

### Step 1: Create API Client

Create `src/services/fileSystemAPI.js`:

```javascript
const API_URL = 'https://01k8dy6t98jqr1ek8thaxc6mqx.raindrop.liquidmetal.ai';

export const fileSystemAPI = {
  // List files in a directory
  async listFiles(parentId = null, sortBy = 'name', order = 'asc') {
    const params = new URLSearchParams();
    if (parentId) params.append('parent_id', parentId);
    params.append('sort_by', sortBy);
    params.append('order', order);
    
    const response = await fetch(`${API_URL}/api/files?${params}`);
    if (!response.ok) throw new Error('Failed to list files');
    return response.json();
  },

  // Get file metadata
  async getFile(fileId) {
    const response = await fetch(`${API_URL}/api/files/${fileId}`);
    if (!response.ok) throw new Error('File not found');
    return response.json();
  },

  // Upload file
  async uploadFile(file, parentId = null, customName = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parent_id', parentId);
    if (customName) formData.append('name', customName);

    const response = await fetch(`${API_URL}/api/files`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  // Download file
  async downloadFile(fileId) {
    const response = await fetch(`${API_URL}/api/files/${fileId}/content`);
    if (!response.ok) throw new Error('Failed to download file');
    return response.blob();
  },

  // Update file (rename or move)
  async updateFile(fileId, updates) {
    const response = await fetch(`${API_URL}/api/files/${fileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update file');
    return response.json();
  },

  // Delete file
  async deleteFile(fileId) {
    const response = await fetch(`${API_URL}/api/files/${fileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete file');
    return response.json();
  },

  // Get file path (breadcrumbs)
  async getFilePath(fileId) {
    const response = await fetch(`${API_URL}/api/files/${fileId}/path`);
    if (!response.ok) throw new Error('Failed to get file path');
    return response.json();
  },

  // Create folder
  async createFolder(name, parentId = null) {
    const response = await fetch(`${API_URL}/api/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parent_id: parentId }),
    });
    if (!response.ok) throw new Error('Failed to create folder');
    return response.json();
  },

  // Get folder with children
  async getFolder(folderId) {
    const response = await fetch(`${API_URL}/api/folders/${folderId}`);
    if (!response.ok) throw new Error('Folder not found');
    return response.json();
  },

  // Update folder (rename or move)
  async updateFolder(folderId, updates) {
    const response = await fetch(`${API_URL}/api/folders/${folderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update folder');
    return response.json();
  },

  // Delete folder (recursive)
  async deleteFolder(folderId) {
    const response = await fetch(`${API_URL}/api/folders/${folderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete folder');
    return response.json();
  },

  // Search files
  async searchFiles(query, type = null, parentId = null) {
    const response = await fetch(`${API_URL}/api/files/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, type, parent_id: parentId }),
    });
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  // Get directory tree
  async getTree(maxDepth = 10) {
    const response = await fetch(`${API_URL}/api/tree?max_depth=${maxDepth}`);
    if (!response.ok) throw new Error('Failed to get tree');
    return response.json();
  },
};
```

### Step 2: Create Zustand Store

Create `src/store/fileSystemStore.js`:

```javascript
import { create } from 'zustand';
import { fileSystemAPI } from '../services/fileSystemAPI';

export const useFileSystemStore = create((set, get) => ({
  // State
  currentFolderId: null,
  files: [],
  folders: [],
  breadcrumbs: [{ id: 'root', name: '/' }],
  loading: false,
  error: null,

  // Actions
  setCurrentFolder: async (folderId) => {
    set({ currentFolderId: folderId, loading: true, error: null });
    try {
      const { entries } = await fileSystemAPI.listFiles(folderId);
      const files = entries.filter(e => e.type === 'file');
      const folders = entries.filter(e => e.type === 'folder');
      
      // Update breadcrumbs if not root
      let breadcrumbs = [{ id: 'root', name: '/' }];
      if (folderId) {
        const { path } = await fileSystemAPI.getFilePath(folderId);
        breadcrumbs = path;
      }
      
      set({ files, folders, breadcrumbs, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  uploadFile: async (file, parentId = null) => {
    set({ loading: true, error: null });
    try {
      await fileSystemAPI.uploadFile(file, parentId);
      // Refresh current folder
      await get().setCurrentFolder(get().currentFolderId);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteFile: async (fileId) => {
    set({ loading: true, error: null });
    try {
      await fileSystemAPI.deleteFile(fileId);
      // Refresh current folder
      await get().setCurrentFolder(get().currentFolderId);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createFolder: async (name, parentId = null) => {
    set({ loading: true, error: null });
    try {
      await fileSystemAPI.createFolder(name, parentId);
      // Refresh current folder
      await get().setCurrentFolder(get().currentFolderId);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteFolder: async (folderId) => {
    set({ loading: true, error: null });
    try {
      await fileSystemAPI.deleteFolder(folderId);
      // Refresh current folder
      await get().setCurrentFolder(get().currentFolderId);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchFiles: async (query) => {
    set({ loading: true, error: null });
    try {
      const { results } = await fileSystemAPI.searchFiles(query);
      const files = results.filter(e => e.type === 'file');
      const folders = results.filter(e => e.type === 'folder');
      set({ files, folders, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

### Step 3: Create File Browser Component

Create `src/components/apps/FileBrowser.jsx`:

```jsx
import React, { useEffect, useState } from 'react';
import { useFileSystemStore } from '../../store/fileSystemStore';
import { fileSystemAPI } from '../../services/fileSystemAPI';

export function FileBrowser() {
  const {
    files,
    folders,
    breadcrumbs,
    loading,
    error,
    currentFolderId,
    setCurrentFolder,
    uploadFile,
    deleteFile,
    createFolder,
    deleteFolder,
    searchFiles,
  } = useFileSystemStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load root directory on mount
    setCurrentFolder(null);
  }, []);

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file, currentFolderId);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    const blob = await fileSystemAPI.downloadFile(fileId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchFiles(searchQuery);
    } else {
      setCurrentFolder(currentFolderId);
    }
  };

  return (
    <div className="file-browser">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.id}>
            <button onClick={() => handleFolderClick(crumb.id === 'root' ? null : crumb.id)}>
              {crumb.name}
            </button>
            {idx < breadcrumbs.length - 1 && ' / '}
          </span>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Toolbar */}
      <div className="toolbar">
        <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload" />
        <button onClick={() => document.getElementById('file-upload').click()}>
          Upload File
        </button>
        <button onClick={() => {
          const name = prompt('Folder name:');
          if (name) createFolder(name, currentFolderId);
        }}>
          New Folder
        </button>
      </div>

      {/* Loading/Error states */}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* File list */}
      <div className="file-list">
        {/* Folders */}
        {folders.map(folder => (
          <div key={folder.id} className="file-item folder">
            <span onClick={() => handleFolderClick(folder.id)}>
              📁 {folder.name}
            </span>
            <button onClick={() => {
              if (confirm(`Delete folder "${folder.name}"?`)) {
                deleteFolder(folder.id);
              }
            }}>
              Delete
            </button>
          </div>
        ))}

        {/* Files */}
        {files.map(file => (
          <div key={file.id} className="file-item file">
            <span>
              📄 {file.name} ({Math.round(file.size / 1024)}KB)
            </span>
            <button onClick={() => handleDownload(file.id, file.name)}>
              Download
            </button>
            <button onClick={() => {
              if (confirm(`Delete file "${file.name}"?`)) {
                deleteFile(file.id);
              }
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Add to Desktop

Add the File Browser to your desktop files in `src/store/osStore.js`:

```javascript
desktopFiles: [
  // ... existing files
  {
    id: 'file-browser',
    name: 'File Browser.exe',
    icon: '📁',
    x: 340,
    y: 50,
    originalX: 340,
    originalY: 50,
  },
],
```

Add window handling in `src/components/Window.jsx`:

```javascript
case 'File Browser.exe':
  return <FileBrowser />;
```

## Testing the Integration

```bash
# From the browser console:
import { fileSystemAPI } from './services/fileSystemAPI';

// Test folder creation
await fileSystemAPI.createFolder('Test Folder');

// Test file listing
const { entries } = await fileSystemAPI.listFiles();
console.log(entries);

// Test search
const { results } = await fileSystemAPI.searchFiles('test');
console.log(results);
```

## Backend Management

```bash
# Check deployment status
cd raindrop-backend
raindrop build status

# View logs
raindrop logs tail --application sisyphos-vfs --version 01k8dy6t98jqr1ek8thaxc6mqx

# Redeploy after changes
raindrop build deploy --start

# Stop service
raindrop build stop
```

## Absurdist VFS Features (Optional - Future Enhancement)

To maintain SisyphOS's theme of futile tasks, consider adding:

1. **File Drift-Back:** Files slowly drift back to their parent folder after being moved
2. **Quantum Files:** File contents change slightly each time they're opened
3. **Sisyphean Search:** Search results randomize on each query
4. **Entropy Increase:** File sizes slowly increase over time
5. **Philosophical Errors:** Random existentialist error messages

These can be implemented as middleware in the Raindrop service or as frontend behavior.

## Success Criteria

✅ Backend API deployed and accessible  
✅ All CRUD operations working (Create, Read, Update, Delete)  
✅ File upload/download functional  
✅ Folder hierarchy supported  
✅ Search functionality implemented  
✅ CORS enabled for frontend access  
⏳ Frontend integration (next phase)  
⏳ Absurdist features (optional)  

## Next Steps

1. Implement the frontend components described above
2. Test all operations in the SisyphOS UI
3. Add drag-and-drop file upload
4. Implement context menus for files/folders
5. Add file type icons based on MIME type
6. Consider adding absurdist behaviors to match SisyphOS theme

**"One must imagine the file system happy."** - Albert Camus (probably)
