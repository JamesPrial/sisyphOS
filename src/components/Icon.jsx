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
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);
  const dragStartPos = useRef(null);

  const handleClick = (e) => {
    // Don't handle clicks if we just finished dragging
    if (isDragging) {
      e.stopPropagation();
      return;
    }

    // Single click - select icon
    onSelect?.();
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
    // Store starting position
    dragStartPos.current = { x: data.x, y: data.y };
    // Don't set isDragging yet - wait for actual movement
    onDragStart?.(e, data);
  };

  const handleDrag = (e, data) => {
    // Only set isDragging if we've actually moved more than 5 pixels
    if (dragStartPos.current) {
      const dx = data.x - dragStartPos.current.x;
      const dy = data.y - dragStartPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 5 && !isDragging) {
        setIsDragging(true);
      }
    }
    onDrag?.(e, data);
  };

  const handleDragStop = (e, data) => {
    // Reset immediately
    dragStartPos.current = null;
    if (isDragging) {
      // Small delay before allowing clicks again only if we were actually dragging
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    } else {
      // If we didn't drag, reset immediately
      setIsDragging(false);
    }
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
        onDoubleClick={(e) => {
          // Only fire double-click if not dragging
          if (!isDragging) {
            onDoubleClick?.();
          }
        }}
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
