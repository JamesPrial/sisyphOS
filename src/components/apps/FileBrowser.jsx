import React, { useState, useEffect } from 'react';
import { fileSystemAPI } from '../../services/fileSystemAPI';
import { useOSStore } from '../../store/osStore';
import { FileSystemLogin } from './FileSystemLogin';

export function FileBrowser() {
  const { vfsIsAuthenticated, logoutVFS } = useOSStore();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { entries } = await fileSystemAPI.listFiles(currentFolder);
      setFolders(entries.filter(e => e.type === 'folder'));
      setFiles(entries.filter(e => e.type === 'file'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load files when component mounts or folder changes (only when authenticated)
  useEffect(() => {
    if (vfsIsAuthenticated) {
      loadFiles();
    }
  }, [currentFolder, vfsIsAuthenticated]);

  // If not authenticated, show login screen
  if (!vfsIsAuthenticated) {
    return <FileSystemLogin />;
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      await fileSystemAPI.uploadFile(file, currentFolder);
      await loadFiles(); // Refresh
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const blob = await fileSystemAPI.downloadFile(fileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    
    setLoading(true);
    try {
      await fileSystemAPI.createFolder(name, currentFolder);
      await loadFiles();
    } catch (err) {
      alert('Create folder failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, isFolder) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    setLoading(true);
    try {
      if (isFolder) {
        await fileSystemAPI.deleteFolder(id);
      } else {
        await fileSystemAPI.deleteFile(id);
      }
      await loadFiles();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>📁 File Browser</h2>
      
      {/* Toolbar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <button onClick={() => document.getElementById('file-upload').click()}>
          📤 Upload File
        </button>
        <button onClick={handleCreateFolder}>
          ➕ New Folder
        </button>
        {currentFolder && (
          <button onClick={() => setCurrentFolder(null)}>
            ⬆️ Back to Root
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={logoutVFS} style={{ marginLeft: 'auto' }}>
          🚪 Logout
        </button>
      </div>

      {/* Status */}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {/* File List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Folders */}
        {folders.map(folder => (
          <div
            key={folder.id}
            style={{
              padding: '10px',
              marginBottom: '5px',
              background: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              onClick={() => setCurrentFolder(folder.id)}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              📁 {folder.name}
            </span>
            <button
              onClick={() => handleDelete(folder.id, folder.name, true)}
              style={{ marginLeft: '10px' }}
            >
              🗑️
            </button>
          </div>
        ))}

        {/* Files */}
        {files.map(file => (
          <div
            key={file.id}
            style={{
              padding: '10px',
              marginBottom: '5px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              📄 {file.name} ({Math.round(file.size / 1024)}KB)
            </span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => handleDownload(file.id, file.name)}>
                ⬇️ Download
              </button>
              <button onClick={() => handleDelete(file.id, file.name, false)}>
                🗑️
              </button>
            </div>
          </div>
        ))}

        {folders.length === 0 && files.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            This folder is empty
          </div>
        )}
      </div>
    </div>
  );
}
