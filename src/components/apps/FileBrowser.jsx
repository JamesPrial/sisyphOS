import React, { useState, useEffect } from 'react';
import { fileSystemAPI } from '../../services/fileSystemAPI';
import { useOSStore } from '../../store/osStore';
import { FileSystemLogin } from './FileSystemLogin';
import ProgressBar from '../ProgressBar';
import { getRandomMessage, formatMessage } from '../../data/vfs-philosophy';
import useVFSEscalation from '../../hooks/useVFSEscalation';
import '../../styles/VFSAbsurdLabor.css';

export function FileBrowser() {
  const { vfsIsAuthenticated, logoutVFS, vfsEscalationLevel, getVFSChaosMultiplier } = useOSStore();
  const { level, interactions, incrementInteraction } = useVFSEscalation();
  const chaosMultiplier = getVFSChaosMultiplier();

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chaos statistics tracking
  const [chaosStats, setChaosStats] = useState({
    entropy_mutations: 0,
    resurrections: 0,
    quantum_collapses: 0,
    failed_operations: 0,
  });

  // Eternal recurrence state
  const [showDejaVu, setShowDejaVu] = useState(false);
  const [quantumWarning, setQuantumWarning] = useState(null);
  const [observing, setObserving] = useState(false);
  const [currentFolderData, setCurrentFolderData] = useState(null);

  // Rename state
  const [renameState, setRenameState] = useState({
    isRenaming: false,
    fileId: null,
    fileName: '',
    newName: '',
    progress: 0,
    error: null,
  });

  // Delete state
  const [deleteState, setDeleteState] = useState({
    fileId: null,
    fileName: '',
    attempts: 0,
    error: null,
    isDeleting: false,
  });

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fileSystemAPI.listFiles(currentFolder);
      setCurrentFolderData(data);
      const entries = data.entries || [];
      const folderEntries = entries.filter(e => e.type === 'folder');
      const fileEntries = entries.filter(e => e.type === 'file');

      setFolders(folderEntries);
      setFiles(fileEntries);

      // Update chaos stats
      const stats = {
        entropy_mutations: fileEntries.reduce((sum, f) =>
          sum + (f.chaos_metadata?.entropy_mutations || 0), 0),
        resurrections: fileEntries.reduce((sum, f) =>
          sum + (f.chaos_metadata?.resurrection_count || 0), 0),
        quantum_collapses: fileEntries.filter(f =>
          f.chaos_metadata?.quantum_states?.length > 1).length,
        failed_operations: chaosStats.failed_operations, // Preserve existing count
      };
      setChaosStats(stats);

      // Check for quantum folder
      if (data.quantum_folder) {
        setQuantumWarning(`Reality ${data.reality_index + 1} of 3`);
        setTimeout(() => setQuantumWarning(null), 3000);
      }

      // Increment interaction for navigation
      incrementInteraction();
    } catch (err) {
      setError(err.message);
      setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
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

  // ETERNAL RECURRENCE: Periodic respawn check
  useEffect(() => {
    if (!vfsIsAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const response = await fileSystemAPI.checkRespawns();
        if (response.count > 0) {
          console.log(`${response.count} file(s) have returned from deletion`);
          // Refresh current view
          await loadFiles();
        }
      } catch (error) {
        console.error('Respawn check failed:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [vfsIsAuthenticated, currentFolder]);

  // If not authenticated, show login screen
  if (!vfsIsAuthenticated) {
    return <FileSystemLogin />;
  }

  // ETERNAL RECURRENCE: Navigation loops
  const handleFolderOpen = async (folderId) => {
    const loopChance = vfsEscalationLevel * 0.04; // 4% per level

    if (Math.random() < loopChance) {
      // Loop back to parent instead of going into folder
      setShowDejaVu(true);
      setTimeout(() => setShowDejaVu(false), 2000);

      // Navigate to parent instead
      const parent = currentFolderData?.parent_id || null;
      setCurrentFolder(parent);
      return;
    }

    // Normal navigation
    setCurrentFolder(folderId);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await fileSystemAPI.uploadFile(file, currentFolder);
      incrementInteraction();

      // ABSURD LABOR: File might be misdirected - show success but refresh to reveal true location
      // No explicit warning - user discovers misdirection organically
      setTimeout(async () => {
        await loadFiles();
      }, 2000);
    } catch (err) {
      const errorMsg = formatMessage(getRandomMessage('absurdLabor'), { filename: file.name });
      setError(errorMsg);
      setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    // ABSURD LABOR: Warn about potential corruption at high escalation
    if (vfsEscalationLevel > 5) {
      const corruptionChance = vfsEscalationLevel * 5;
      const confirmed = window.confirm(
        `Warning: File integrity cannot be guaranteed at escalation level ${vfsEscalationLevel}.\n\n` +
          `Estimated corruption probability: ${corruptionChance}%\n\n` +
          'Download anyway?'
      );
      if (!confirmed) return;
    }

    try {
      const blob = await fileSystemAPI.downloadFile(fileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      incrementInteraction();
    } catch (err) {
      // Always use philosophical error messages
      const message = getRandomMessage('entropy');
      const formatted = formatMessage(message, { filename: fileName });
      setError(formatted);
      setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;

    setLoading(true);
    try {
      await fileSystemAPI.createFolder(name, currentFolder);
      incrementInteraction();
      await loadFiles();
    } catch (err) {
      const errorMsg = formatMessage(getRandomMessage('absurdLabor'), { filename: name });
      setError(errorMsg);
      setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, isFolder) => {
    if (!confirm(`Delete "${name}"?`)) return;

    setDeleteState({ fileId: id, fileName: name, attempts: 0, error: null, isDeleting: true });

    try {
      if (isFolder) {
        await fileSystemAPI.deleteFolder(id);
        incrementInteraction();
        await loadFiles();
        setDeleteState({ fileId: null, fileName: '', attempts: 0, error: null, isDeleting: false });
      } else {
        // Files have delete resistance
        const response = await fileSystemAPI.deleteFile(id);
        incrementInteraction();

        if (!response.success) {
          // Failed delete - use philosophical error
          const errorMsg = formatMessage(getRandomMessage('recurrence'), {
            filename: name,
            n: response.attempts
          });
          setDeleteState({
            fileId: id,
            fileName: name,
            attempts: response.attempts,
            error: errorMsg,
            isDeleting: false,
          });
          setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
          return;
        }

        // Success - refresh list
        await loadFiles();
        setDeleteState({ fileId: null, fileName: '', attempts: 0, error: null, isDeleting: false });
      }
    } catch (err) {
      const errorMsg = formatMessage(getRandomMessage('recurrence'), { filename: name });
      setDeleteState({
        fileId: id,
        fileName: name,
        attempts: deleteState.attempts + 1,
        error: errorMsg,
        isDeleting: false,
      });
      setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
    }
  };

  const handleRenameClick = (id, name) => {
    const newName = prompt('New name:', name);
    if (!newName || newName === name) return;

    handleRename(id, name, newName);
  };

  const handleRename = async (fileId, fileName, newName) => {
    setRenameState({
      isRenaming: true,
      fileId,
      fileName,
      newName,
      progress: 0,
      error: null,
    });

    // Asymptotic progress (approaches 99% but never completes)
    const progressInterval = setInterval(() => {
      setRenameState(prev => {
        const remaining = 99 - prev.progress;
        const increment = remaining * 0.1; // Slower as it approaches 99%
        return { ...prev, progress: Math.min(99, prev.progress + increment) };
      });
    }, 100);

    // After 8 seconds, show failure
    setTimeout(async () => {
      clearInterval(progressInterval);

      try {
        await fileSystemAPI.renameFile(fileId, newName);
        incrementInteraction();
        // This will always fail based on backend logic
      } catch (err) {
        const errorMsg = formatMessage(getRandomMessage('absurdLabor'), { filename: fileName });
        setRenameState({
          isRenaming: false,
          fileId: null,
          fileName: '',
          newName: '',
          progress: 0,
          error: errorMsg,
        });
        setChaosStats(prev => ({ ...prev, failed_operations: prev.failed_operations + 1 }));
      }
    }, 8000);
  };

  // Helper to get current path display
  const getCurrentPath = () => {
    if (!currentFolder) return '/';
    return currentFolderData?.path || '/...';
  };

  return (
    <div className={`file-browser escalation-${Math.floor(level / 3)}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chaos Dashboard Header */}
      <div className={`chaos-dashboard chaos-level-${Math.floor(level / 3)}`}>
        <div className="dashboard-left">
          <h3>File System</h3>
          <span className="path-display">{getCurrentPath()}</span>
        </div>

        <div className="dashboard-right">
          <div className="escalation-meter">
            <span className="meter-label">Chaos Level</span>
            <div className="meter-bar">
              <div
                className="meter-fill"
                style={{ width: `${level * 10}%` }}
              />
            </div>
            <span className="meter-value">{level}/10</span>
          </div>

          <div className="chaos-stats">
            <div className="stat">
              <span className="stat-icon">🔄</span>
              <span className="stat-value">{interactions}</span>
              <span className="stat-label">Actions</span>
            </div>

            {chaosStats.entropy_mutations > 0 && (
              <div className="stat">
                <span className="stat-icon">📈</span>
                <span className="stat-value">{chaosStats.entropy_mutations}</span>
                <span className="stat-label">Mutations</span>
              </div>
            )}

            {chaosStats.resurrections > 0 && (
              <div className="stat">
                <span className="stat-icon">👻</span>
                <span className="stat-value">{chaosStats.resurrections}</span>
                <span className="stat-label">Respawns</span>
              </div>
            )}

            {chaosStats.quantum_collapses > 0 && (
              <div className="stat">
                <span className="stat-icon">🌀</span>
                <span className="stat-value">{chaosStats.quantum_collapses}</span>
                <span className="stat-label">Collapses</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chaos Level Warnings */}
      {level >= 5 && level < 7 && (
        <div className="chaos-warning warning-level-1">
          <span className="warning-icon">⚠️</span>
          <p>File integrity degrading. Expect unusual behavior.</p>
        </div>
      )}

      {level >= 7 && level < 9 && (
        <div className="chaos-warning warning-level-2">
          <span className="warning-icon">🔥</span>
          <p>Critical chaos level. Files may mutate, respawn, or exist in superposition.</p>
        </div>
      )}

      {level >= 9 && (
        <div className="chaos-warning warning-level-3">
          <span className="warning-icon">💀</span>
          <p>Maximum entropy. The file system has achieved consciousness... and despair.</p>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      
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

      {/* Déjà Vu Message */}
      {showDejaVu && (
        <div className="deja-vu-message">
          {getRandomMessage('recurrence')}
        </div>
      )}

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
              onClick={() => handleFolderOpen(folder.id)}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              {folder.icon || '📁'} {folder.name}
              {/* Show original name if drifted */}
              {folder.chaos_metadata?.original_name &&
               folder.chaos_metadata.original_name !== folder.name && (
                <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>
                  (was: {folder.chaos_metadata.original_name})
                </span>
              )}
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
            className={`file-item ${file.chaos_metadata?.superposition ? 'quantum-file' : ''} ${file.chaos_metadata?.resurrection_count > 0 ? 'respawned' : ''}`}
            style={{
              padding: '12px',
              marginBottom: '8px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span className="file-icon">📄</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="file-name" style={{ fontWeight: '500' }}>{file.name}</span>
                {/* Show original name if drifted */}
                {file.chaos_metadata?.original_name &&
                 file.chaos_metadata.original_name !== file.name && (
                  <span className="original-name-hint">
                    (was: {file.chaos_metadata.original_name})
                  </span>
                )}
              </div>

              {/* Badge Container */}
              <div className="badge-container">
                {/* Entropy badge */}
                {file.chaos_metadata?.entropy_mutations > 0 && (
                  <span
                    className="badge entropy-badge"
                    title={`Mutated ${file.chaos_metadata.entropy_mutations} times. Last: ${new Date(file.chaos_metadata.last_mutated).toLocaleString()}`}
                  >
                    📈
                  </span>
                )}

                {/* Respawn badge */}
                {file.chaos_metadata?.resurrection_count > 0 && (
                  <span
                    className="badge respawn-badge"
                    title={`Returned from deletion ${file.chaos_metadata.resurrection_count} times`}
                  >
                    👻
                  </span>
                )}

                {/* Duplicate badge */}
                {file.chaos_metadata?.is_duplicate && (
                  <span className="badge duplicate-badge" title="Duplicate file">
                    ♾️
                  </span>
                )}

                {/* Quantum badge */}
                {file.chaos_metadata?.superposition && (
                  <span
                    className="badge quantum-badge"
                    title={`Exists in ${file.chaos_metadata.state_count} quantum states`}
                  >
                    🌀
                  </span>
                )}

                {/* Phantom badge */}
                {file.chaos_metadata?.is_phantom && (
                  <span className="badge phantom-badge" title="Phantom file (may not exist)">
                    👻
                  </span>
                )}
              </div>

              <span className="file-size" style={{ color: '#666', fontSize: '14px', marginLeft: 'auto' }}>
                {Math.round(file.size / 1024)}KB
              </span>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => handleRenameClick(file.id, file.name)}>
                ✏️ Rename
              </button>
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

      {/* Rename Dialog */}
      {renameState.isRenaming && (
        <div className="vfs-dialog-overlay">
          <div className="vfs-dialog rename-dialog">
            <h3>Renaming file...</h3>
            <p>
              From: <strong>{renameState.fileName}</strong>
            </p>
            <p>
              To: <strong>{renameState.newName}</strong>
            </p>
            <ProgressBar progress={renameState.progress} decimalPlaces={2} />
            <p className="status">Processing... {renameState.progress.toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Rename Error Dialog */}
      {renameState.error && (
        <div className="vfs-dialog-overlay">
          <div className="vfs-dialog error-dialog absurd">
            <h3>Rename Failed</h3>
            <p className="error-message">{renameState.error}</p>
            <button
              onClick={() =>
                setRenameState({ isRenaming: false, fileId: null, fileName: '', newName: '', progress: 0, error: null })
              }
            >
              Accept Fate
            </button>
          </div>
        </div>
      )}

      {/* Delete Failed Dialog */}
      {deleteState.error && (
        <div className="vfs-dialog-overlay">
          <div className="vfs-dialog delete-failed-dialog">
            <h3>Delete Failed</h3>
            <p className="error-message">{deleteState.error}</p>
            <p className="hint">Attempt {deleteState.attempts}/3</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => handleDelete(deleteState.fileId, deleteState.fileName, false)}>
                Try Again
              </button>
              <button
                onClick={() =>
                  setDeleteState({ fileId: null, fileName: '', attempts: 0, error: null, isDeleting: false })
                }
              >
                Give Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Observer Animation */}
      {observing && (
        <div className="observation-overlay">
          <div className="quantum-collapse">
            <h3>🌀 Observing File...</h3>
            <p>{getRandomMessage('quantum')}</p>
            <div className="collapse-animation"></div>
          </div>
        </div>
      )}

      {/* Quantum Folder Warning */}
      {quantumWarning && (
        <div className="quantum-warning">
          <span>⚠️</span> {quantumWarning}
          <p className="hint">{getRandomMessage('quantum')}</p>
        </div>
      )}
      </div>
    </div>
  );
}
