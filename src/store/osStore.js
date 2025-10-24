import { create } from 'zustand';

const useOSStore = create((set) => ({
  // Window management
  openWindows: [],
  focusedWindowId: null,

  // Desktop files/icons
  desktopFiles: [
    { id: 'file-1', name: 'README.txt', type: 'text', x: 50, y: 50, originalX: 50, originalY: 50 },
    { id: 'file-2', name: 'boulder.exe', type: 'executable', x: 50, y: 150, originalX: 50, originalY: 150 },
    { id: 'file-3', name: 'mountain.jpg', type: 'image', x: 50, y: 250, originalX: 50, originalY: 250 },
    { id: 'file-4', name: 'system_update.exe', type: 'executable', x: 50, y: 350, originalX: 50, originalY: 350 },
    { id: 'file-5', name: 'download.exe', type: 'executable', x: 50, y: 450, originalX: 50, originalY: 450 },
    { id: 'file-6', name: 'install.exe', type: 'executable', x: 50, y: 550, originalX: 50, originalY: 550 },
    { id: 'file-7', name: 'organize.exe', type: 'executable', x: 180, y: 300, originalX: 180, originalY: 300 },
    { id: 'file-8', name: 'task_manager.exe', type: 'executable', x: 180, y: 400, originalX: 180, originalY: 400 },
    { id: 'file-9', name: 'help.exe', type: 'executable', x: 300, y: 50, originalX: 300, originalY: 50, icon: '📖' },
    { id: 'file-10', name: 'errors.exe', type: 'executable', x: 300, y: 150, originalX: 300, originalY: 150, icon: '⚠️' },
    { id: 'file-11', name: 'about.exe', type: 'executable', x: 300, y: 250, originalX: 300, originalY: 250, icon: 'ℹ️' },
  ],

  // Desktop organization tracking
  organizationAttempts: 0,

  // Happy mode toggle (for absurdist behavior)
  isHappyMode: false,

  // Dialog state
  currentDialog: null,

  // Window actions
  addWindow: (window) =>
    set((state) => ({
      openWindows: [
        ...state.openWindows,
        {
          ...window,
          id: window.id || `window-${Date.now()}`,
          zIndex: state.openWindows.length + 1,
          position: window.position || { x: 100 + state.openWindows.length * 30, y: 100 + state.openWindows.length * 30 },
          size: window.size || { width: 600, height: 400 },
        },
      ],
      focusedWindowId: window.id || `window-${Date.now()}`,
    })),

  removeWindow: (windowId) =>
    set((state) => ({
      openWindows: state.openWindows.filter((w) => w.id !== windowId),
      focusedWindowId:
        state.focusedWindowId === windowId
          ? state.openWindows[state.openWindows.length - 2]?.id || null
          : state.focusedWindowId,
    })),

  focusWindow: (windowId) =>
    set((state) => {
      const maxZIndex = Math.max(...state.openWindows.map((w) => w.zIndex), 0);
      return {
        openWindows: state.openWindows.map((w) =>
          w.id === windowId ? { ...w, zIndex: maxZIndex + 1 } : w
        ),
        focusedWindowId: windowId,
      };
    }),

  updateWindowPosition: (windowId, position) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowId ? { ...w, position } : w
      ),
    })),

  updateWindowSize: (windowId, size) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowId ? { ...w, size } : w
      ),
    })),

  minimizeWindow: (windowId) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowId ? { ...w, minimized: true } : w
      ),
    })),

  restoreWindow: (windowId) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === windowId ? { ...w, minimized: false } : w
      ),
      focusedWindowId: windowId,
    })),

  // Desktop file actions
  addDesktopFile: (file) =>
    set((state) => ({
      desktopFiles: [
        ...state.desktopFiles,
        {
          ...file,
          id: file.id || `file-${Date.now()}`,
        },
      ],
    })),

  removeDesktopFile: (fileId) =>
    set((state) => ({
      desktopFiles: state.desktopFiles.filter((f) => f.id !== fileId),
    })),

  updateDesktopFilePosition: (fileId, x, y) =>
    set((state) => ({
      desktopFiles: state.desktopFiles.map((f) =>
        f.id === fileId ? { ...f, x, y } : f
      ),
    })),

  // Happy mode toggle
  toggleHappyMode: () =>
    set((state) => ({
      isHappyMode: !state.isHappyMode,
    })),

  setHappyMode: (value) =>
    set(() => ({
      isHappyMode: value,
    })),

  // Desktop organization actions
  organizeDesktop: () =>
    set((state) => {
      // Create a grid layout for files
      const gridSpacing = 100;
      const startX = 50;
      const startY = 50;
      const columns = 5;

      const organizedFiles = state.desktopFiles.map((file, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        return {
          ...file,
          x: startX + col * gridSpacing,
          y: startY + row * gridSpacing,
        };
      });

      return {
        desktopFiles: organizedFiles,
        organizationAttempts: state.organizationAttempts + 1,
      };
    }),

  resetDesktopPositions: () =>
    set((state) => ({
      desktopFiles: state.desktopFiles.map((file) => ({
        ...file,
        x: file.originalX,
        y: file.originalY,
      })),
    })),

  incrementOrganizationAttempts: () =>
    set((state) => ({
      organizationAttempts: state.organizationAttempts + 1,
    })),

  // Dialog actions
  showDialog: (dialog) =>
    set(() => ({
      currentDialog: dialog,
    })),

  hideDialog: () =>
    set(() => ({
      currentDialog: null,
    })),
}));

export default useOSStore;
