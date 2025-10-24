import { useState } from 'react';
import useOSStore from '../store/osStore';
import useBoulderPhysics from '../hooks/useBoulderPhysics';
import Icon from './Icon';

// Wrapper component for each icon with boulder physics
const BoulderIcon = ({ file, selected, onSelect, onDoubleClick }) => {
  const { updateDesktopFilePosition } = useOSStore();

  const { isDrifting, rotation, onDragStart, onDragStop } = useBoulderPhysics(
    file.id,
    { x: file.x, y: file.y },
    { x: file.originalX, y: file.originalY },
    updateDesktopFilePosition
  );

  const handleDrag = (e, data) => {
    updateDesktopFilePosition(file.id, data.x, data.y);
  };

  return (
    <Icon
      icon={file.icon}
      label={file.name}
      selected={selected}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDrag={handleDrag}
      onDragStop={onDragStop}
      position={{ x: file.x, y: file.y }}
      isDrifting={isDrifting}
      rotation={rotation}
    />
  );
};

const Desktop = () => {
  const { desktopFiles, addWindow } = useOSStore();
  const [selectedIconId, setSelectedIconId] = useState(null);

  const handleDesktopClick = (e) => {
    // Deselect icon when clicking on empty desktop area
    if (e.target === e.currentTarget) {
      setSelectedIconId(null);
    }
  };

  const handleIconDoubleClick = (file) => {
    console.log('[Desktop] Icon double-clicked:', file);

    // Open window based on file type
    const windowConfig = {
      id: `window-${file.id}-${Date.now()}`,
      title: file.name,
      content: file.name,
      appType: file.type,
    };

    // Special size for task manager
    if (file.name === 'task_manager.exe') {
      windowConfig.size = { width: 700, height: 550 };
    }

    console.log('[Desktop] Creating window with config:', windowConfig);
    addWindow(windowConfig);
    console.log('[Desktop] Window added to store');
    setSelectedIconId(null);
  };

  return (
    <div
      className="desktop"
      onClick={handleDesktopClick}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        paddingBottom: '48px', // Space for taskbar
      }}
    >
      {desktopFiles.map((file) => (
        <BoulderIcon
          key={file.id}
          file={file}
          selected={selectedIconId === file.id}
          onSelect={() => setSelectedIconId(file.id)}
          onDoubleClick={() => handleIconDoubleClick(file)}
        />
      ))}
    </div>
  );
};

export default Desktop;
