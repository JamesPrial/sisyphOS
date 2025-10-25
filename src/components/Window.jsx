import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import useOSStore from '../store/osStore';
import ErrorBoundary from './ErrorBoundary';
import SystemUpdate from './apps/SystemUpdate';
import FileDownload from './apps/FileDownload';
import InstallWizard from './apps/InstallWizard';
import OrganizeDesktop from './apps/OrganizeDesktop';
import TaskManager from './apps/TaskManager';
import Help from './apps/Help';
import ErrorSimulator from './apps/ErrorSimulator';
import About from './apps/About';
import PhilosophyAdvisor from './apps/PhilosophyAdvisor';

const Window = ({ window }) => {
  const {
    removeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    focusedWindowId,
  } = useOSStore();

  const nodeRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  const isFocused = focusedWindowId === window.id;
  const isMinimized = window.minimized;

  // Get app component based on window title/content
  const getAppContent = () => {
    const fileName = window.content || window.title;

    console.log('[Window] Rendering window:', {
      id: window.id,
      title: window.title,
      content: window.content,
      fileName,
      position: window.position,
      size: window.size,
      zIndex: window.zIndex,
      minimized: window.minimized
    });

    switch (fileName) {
      case 'system_update.exe':
        console.log('[Window] Rendering SystemUpdate');
        return <SystemUpdate />;
      case 'download.exe':
        console.log('[Window] Rendering FileDownload');
        return <FileDownload />;
      case 'install.exe':
        console.log('[Window] Rendering InstallWizard');
        return <InstallWizard />;
      case 'organize.exe':
        console.log('[Window] Rendering OrganizeDesktop');
        return <OrganizeDesktop />;
      case 'task_manager.exe':
        console.log('[Window] Rendering TaskManager');
        return <TaskManager />;
      case 'help.exe':
        console.log('[Window] Rendering Help');
        return <Help />;
      case 'errors.exe':
        console.log('[Window] Rendering ErrorSimulator');
        return <ErrorSimulator />;
      case 'about.exe':
        console.log('[Window] Rendering About');
        return <About />;
      case 'Claude Camus.exe':
        console.log('[Window] Rendering Claude Camus');
        return <PhilosophyAdvisor />;
      default:
        console.log('[Window] No app component for:', fileName, '- using default fallback');
        return null;
    }
  };

  useEffect(() => {
    // Auto-focus newly created windows
    if (!focusedWindowId) {
      focusWindow(window.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrag = (e, data) => {
    updateWindowPosition(window.id, { x: data.x, y: data.y });
  };

  const handleMouseDown = () => {
    if (!isFocused) {
      focusWindow(window.id);
    }
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      width: window.size.width,
      height: window.size.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
    focusWindow(window.id);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;

      const newWidth = Math.max(400, resizeStartRef.current.width + deltaX);
      const newHeight = Math.max(300, resizeStartRef.current.height + deltaY);

      updateWindowSize(window.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, window.id, updateWindowSize]);

  if (isMinimized) {
    return null;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-title-bar"
      position={window.position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          width: `${window.size.width}px`,
          height: `${window.size.height}px`,
          zIndex: window.zIndex,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: isFocused ? 'var(--shadow-xl)' : 'var(--shadow-lg)',
            border: '1px solid var(--color-border-light)',
            overflow: 'hidden',
            transition: 'box-shadow var(--transition-fast)',
          }}
        >
        {/* Title Bar */}
        <div
          className="window-title-bar no-select"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: isFocused
              ? 'var(--color-bg-primary)'
              : 'var(--color-border-light)',
            borderBottom: '1px solid var(--color-border-light)',
            cursor: 'move',
            minHeight: '36px',
            transition: 'background-color var(--transition-fast)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {window.title || 'Untitled'}
          </div>

          {/* Window Controls */}
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(window.id);
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              title="Minimize"
            >
              _
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWindow(window.id);
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: 'var(--color-accent-secondary)',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'var(--color-bg-secondary)',
          }}
        >
          <ErrorBoundary>
            {window.children || getAppContent() || (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--color-text-secondary)',
                  padding: 'var(--spacing-md)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                  {window.appType === 'text' && '📄'}
                  {window.appType === 'executable' && '⚙️'}
                  {window.appType === 'image' && '🖼️'}
                  {!window.appType && '📁'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: 'var(--spacing-xs)' }}>
                  {window.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                  {window.content || 'No preview available'}
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
            background: 'linear-gradient(135deg, transparent 50%, var(--color-border-light) 50%)',
            borderBottomRightRadius: 'var(--radius-md)',
            opacity: isFocused ? 0.6 : 0.3,
            transition: 'opacity var(--transition-fast)',
          }}
          title="Resize"
        />
        </motion.div>
      </div>
    </Draggable>
  );
};

export default Window;
