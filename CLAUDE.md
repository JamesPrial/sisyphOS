# CLAUDE.md - Development Context & History

## Project Overview

**SisyphOS** is a Fantasy Operating System themed around Albert Camus's "The Myth of Sisyphus" and absurdist philosophy. Built for a hackathon with the theme "Fantasy OS," it's a web-based parody OS where every feature is deliberately futile yet strangely meaningful.

**Tech Stack:**
- React 18 + Vite
- Zustand (state management)
- framer-motion (animations)
- react-draggable (window/icon dragging)
- Custom CSS with CSS variables

**Core Philosophy:** Tasks that appear functional but are eternally futile - updates that never complete, files that drift back to original positions, processes that multiply when killed, progress bars that reset at 99%.

## Critical Bug Fix (2025-10-24)

### The Problem

Desktop icons appeared clickable but **windows were not rendering visually** despite being added to state. Symptoms:
- Double-clicking icons did nothing visible
- Taskbar buttons appeared (proving windows existed in state)
- Console showed windows being created
- No visual windows on screen

### Root Cause

**CSS Layout Issue:** Windows were rendering off-screen below the Desktop component.

**Technical Details:**
```
┌─────────────────────────┐
│ App Container           │
│  ├─ Desktop (100% height) ← Takes full viewport
│  ├─ Window #1          │
│  ├─ Window #2          │ ← These rendered AFTER Desktop
│  └─ Taskbar            │   so they were pushed down
└─────────────────────────┘
        ↓
Windows at position (100, 100)
actually rendered at top: 837px
(below visible viewport)
```

The Desktop component had `height: 100%` filling the entire viewport. Windows rendered sequentially after Desktop in the DOM were positioned relative to the document flow, placing them below the Desktop and off-screen.

### The Solution

Created an absolutely positioned overlay container for windows (src/App.jsx:83-101):

```jsx
{/* Windows layer - absolutely positioned overlay */}
<div
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none', // Allow clicks through to desktop
  }}
>
  <AnimatePresence>
    {openWindows.map((window) => (
      <div key={window.id} style={{ pointerEvents: 'auto' }}>
        <Window window={window} />
      </div>
    ))}
  </AnimatePresence>
</div>
```

**Key aspects:**
- Absolute positioning with `top: 0; left: 0` creates viewport-relative coordinate system
- `pointerEvents: 'none'` on container allows desktop clicks to pass through
- `pointerEvents: 'auto'` on individual windows makes them interactive
- Windows now correctly position at (100, 100) relative to viewport

### Additional Fixes

**Window.jsx - Draggable/framer-motion Conflict:**
Both libraries were trying to control CSS transforms on the same element, causing conflicts. Fixed with two-layer structure:
- Outer div: Draggable controls (positioning via transform)
- Inner motion.div: framer-motion controls (scale/opacity animations)

**Error Handling:**
- Added ErrorBoundary.jsx to catch component render errors gracefully
- Wrapped window content in ErrorBoundary to prevent silent failures

**Debugging Infrastructure:**
- Added console.log statements in Window.jsx and Desktop.jsx
- Debug logs show window creation flow and component rendering

## Architecture Notes

### State Management (src/store/osStore.js)

Zustand store manages:
- `openWindows`: Array of window objects (id, title, content, position, size, zIndex)
- `desktopFiles`: Array of desktop icons with positions (including originalX/Y for drift-back)
- `isHappyMode`: Aesthetic toggle (changes colors but not functionality)

**Key Methods:**
- `addWindow()`: Creates new window with auto-positioning (cascade effect)
- `focusWindow()`: Updates z-index for window stacking
- `updateDesktopFilePosition()`: Used by boulder physics for drift-back

### Component Structure

```
App.jsx
├─ WelcomeScreen.jsx (first-time overlay)
├─ Desktop.jsx
│  └─ BoulderIcon (wraps Icon.jsx)
│     └─ Icon.jsx (with useBoulderPhysics hook)
├─ Windows Layer (absolute overlay)
│  └─ Window.jsx
│     └─ ErrorBoundary
│        └─ App Components (SystemUpdate, TaskManager, etc.)
├─ Taskbar.jsx
├─ PhilosophyNotification.jsx
└─ Dialog.jsx (inescapable modals)
```

### Window-to-Component Mapping

Window.jsx uses a switch statement on `window.content` or `window.title`:
- `system_update.exe` → SystemUpdate.jsx
- `task_manager.exe` → TaskManager.jsx
- `organize.exe` → OrganizeDesktop.jsx
- etc.

Files without custom components (README.txt, boulder.exe) show fallback UI with icon and filename.

### Absurdist Features

1. **Boulder File Manager**: Desktop icons drift back to original positions after 2-second delay (useBoulderPhysics.js)
2. **Sisyphean Progress Bars**: Reset at 99% and start over (SystemUpdate, FileDownload, InstallWizard)
3. **Futile Task Manager**: Processes respawn with higher CPU/memory, multiply after 3 kills (useProcessManager.js)
4. **Philosophy Dialogs**: Inescapable dialogs with Camus quotes, ESC key disabled
5. **Happy Mode**: Toggle that changes aesthetics (bright gradients, sparkles) but keeps futility intact

## Debugging Methodology Used

1. **Hypothesis Formation**: Icons clickable → tabs appear → windows exist in state but not visible
2. **Console Inspection**: Added debug logging to trace data flow
3. **Chrome DevTools MCP**: Live browser inspection revealed `top: 837px` on windows
4. **Root Cause Analysis**: CSS layout issue identified (DOM order causing off-screen positioning)
5. **Minimal Fix**: Single wrapper div with absolute positioning
6. **Verification**: Multiple windows opened successfully, all features working

## Known Behaviors

### Double-Click Detection
Icons use custom double-click logic (Icon.jsx:22-46) with 300ms window. Standard browser double-click events don't work reliably with React + Draggable, hence the manual implementation.

### Boulder Physics
- 2-second delay after drag stops
- 3-4 second drift duration based on distance
- Cubic easing for natural deceleration
- Rotation effect simulates rolling boulder
- Uses requestAnimationFrame for 60fps smoothness

### Process Manager
Processes respawn 500ms after kill with:
- +10-20% CPU increase
- +30-50MB memory increase
- After 3 kills: process multiplies (creates clone)
- Process IDs increment globally to avoid conflicts

## File Locations

**Core:**
- `/src/App.jsx` - Main app structure, window overlay fix
- `/src/store/osStore.js` - Zustand state management
- `/src/components/Window.jsx` - Window component with dual-layer structure
- `/src/components/ErrorBoundary.jsx` - Error catching wrapper

**Apps:**
- `/src/components/apps/TaskManager.jsx` - Process manager with futility
- `/src/components/apps/SystemUpdate.jsx` - Endless 99% update
- `/src/components/apps/OrganizeDesktop.jsx` - Temporary organization
- `/src/components/apps/Help.jsx` - Circular reference documentation

**Hooks:**
- `/src/hooks/useBoulderPhysics.js` - File drift-back physics
- `/src/hooks/useProcessManager.js` - Process respawn/multiply logic
- `/src/hooks/usePhilosophyNotifications.js` - Random notification system

**Data:**
- `/src/data/philosophy.js` - Camus quotes, error messages, notifications

## Development Notes

### CSS Variables
All styling uses CSS custom properties (src/styles/minimalist.css) for easy theming:
- Colors: `--color-bg-primary`, `--color-accent-primary`, etc.
- Shadows: `--shadow-sm` through `--shadow-xl`
- Spacing: `--spacing-xs` through `--spacing-xl`
- Happy mode overrides: `body.happy-mode` changes gradients and adds sparkles

### Performance Considerations
- Boulder physics uses requestAnimationFrame cleanup on unmount
- Process manager uses intervals that cleanup properly
- Philosophy notifications have queue management to prevent spam
- Window animations use CSS transforms (GPU-accelerated)

## Future Developers / AI Assistants

If you're working on this project:

1. **Window positioning is fragile**: Don't remove the absolute overlay container in App.jsx
2. **Draggable + framer-motion**: Keep the two-layer structure in Window.jsx to avoid transform conflicts
3. **Debug logging**: Console logs are intentional for development, remove before production
4. **Happy Mode**: Changes aesthetics only - never modify the futility mechanics
5. **Philosophy content**: All text is in `/src/data/philosophy.js` for easy updates

## Current Status

**Last Updated:** 2025-10-24
**Status:** Fully functional, demo-ready for hackathon
**Known Issues:** None
**Build Status:** ✅ 403.41 kB bundle (122.99 kB gzipped)

All features tested and working:
- ✅ Window creation and rendering
- ✅ Desktop icon double-clicking
- ✅ Window dragging, minimize, close
- ✅ Boulder physics drift-back
- ✅ Task manager process futility
- ✅ Progress bar resets
- ✅ Philosophy notifications
- ✅ Happy mode toggle
- ✅ Welcome screen
- ✅ Taskbar functionality

---

*"One must imagine Sisyphus happy." - Albert Camus*
