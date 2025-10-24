import { useState, useRef } from 'react';
import Draggable from 'react-draggable';

const Icon = ({
  icon,
  label,
  onDoubleClick,
  selected,
  onSelect,
  onDragStart,
  onDrag,
  onDragStop,
  position,
  isDrifting,
  rotation,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const clickTimer = useRef(null);
  const nodeRef = useRef(null);

  const handleClick = (e) => {
    // Don't handle clicks if we just finished dragging
    if (isDragging) {
      e.stopPropagation();
      return;
    }

    setClickCount((prev) => prev + 1);

    // Clear existing timer
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    // Single click - select icon
    if (clickCount === 0) {
      onSelect?.();
      clickTimer.current = setTimeout(() => {
        setClickCount(0);
      }, 300);
    } else {
      // Double click - open icon
      setClickCount(0);
      onDoubleClick?.();
    }
  };

  const getIconEmoji = (name) => {
    if (name.endsWith('.txt')) return '📄';
    if (name.endsWith('.exe')) return '⚙️';
    if (name.endsWith('.jpg') || name.endsWith('.png')) return '🖼️';
    if (name === 'organize.exe') return '🗂️';
    if (name === 'task_manager.exe') return '📊';
    return '📁';
  };

  const handleDragStart = (e, data) => {
    setIsDragging(true);
    onDragStart?.(e, data);
  };

  const handleDrag = (e, data) => {
    onDrag?.(e, data);
  };

  const handleDragStop = (e, data) => {
    // Small delay before allowing clicks again
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
    onDragStop?.(e, data);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        onClick={handleClick}
        className="no-select"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '80px',
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: selected ? 'rgba(92, 107, 192, 0.2)' : 'transparent',
          border: selected ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
          transition: isDragging || isDrifting ? 'none' : 'all var(--transition-fast)',
          transform: isDragging
            ? 'scale(1.05)'
            : isDrifting
            ? `rotate(${rotation}deg)`
            : 'scale(1)',
          opacity: isDrifting ? 0.85 : 1,
          boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
          position: 'absolute',
        }}
      >
        <div
          style={{
            fontSize: '2.5rem',
            marginBottom: 'var(--spacing-xs)',
            filter: selected ? 'brightness(1.1)' : 'none',
            pointerEvents: 'none',
          }}
        >
          {icon || getIconEmoji(label)}
        </div>
        <div
          style={{
            fontSize: '11px',
            textAlign: 'center',
            color: 'var(--color-text-primary)',
            fontWeight: selected ? '600' : '400',
            wordWrap: 'break-word',
            width: '100%',
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>
      </div>
    </Draggable>
  );
};

export default Icon;
