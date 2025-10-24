import { useState, useEffect } from 'react';
import useOSStore from '../store/osStore';

const Taskbar = () => {
  const { openWindows, focusWindow, restoreWindow, focusedWindowId, isHappyMode, toggleHappyMode } = useOSStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const startTime = useState(() => Date.now())[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleWindowButtonClick = (windowId) => {
    const window = openWindows.find((w) => w.id === windowId);
    if (window?.minimized) {
      restoreWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-md)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10000,
      }}
    >
      {/* Left: Start Button & Uptime */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <button
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-accent-primary)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            fontSize: '13px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Start
        </button>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
          title="Time you'll never get back"
        >
          <span style={{ fontWeight: '500' }}>Uptime:</span> {formatUptime(uptime)}
        </div>
      </div>

      {/* Center: Open Windows */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginLeft: 'var(--spacing-md)',
          overflow: 'auto',
        }}
      >
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => handleWindowButtonClick(window.id)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor:
                focusedWindowId === window.id && !window.minimized
                  ? 'var(--color-bg-primary)'
                  : 'transparent',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              border:
                focusedWindowId === window.id && !window.minimized
                  ? '1px solid var(--color-border-medium)'
                  : '1px solid transparent',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: window.minimized ? '400' : '500',
              opacity: window.minimized ? 0.6 : 1,
            }}
          >
            {window.title || 'Untitled'}
          </button>
        ))}
      </div>

      {/* Right: Happy Mode Toggle & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <button
          onClick={toggleHappyMode}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: isHappyMode ? 'var(--color-accent-success)' : 'transparent',
            color: isHappyMode ? 'white' : 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '18px',
            border: isHappyMode ? 'none' : '1px solid var(--color-border-medium)',
            transition: 'all var(--transition-fast)',
          }}
          title="One must imagine Sisyphus happy"
        >
          {isHappyMode ? '😊' : '😐'}
        </button>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--color-text-secondary)',
            minWidth: '70px',
            textAlign: 'right',
          }}
        >
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
