# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SisyphOS** is a Fantasy Operating System themed around Albert Camus's "The Myth of Sisyphus" and absurdist philosophy. Built for a hackathon with the theme "Fantasy OS," it's a web-based parody OS where every feature is deliberately futile yet strangely meaningful.

**Tech Stack:**
- React 18 + Vite
- Zustand (state management)
- framer-motion (animations)
- react-draggable (window/icon dragging)
- Custom CSS with CSS variables

**Core Philosophy:** Tasks that appear functional but are eternally futile - updates that never complete, files that drift back to original positions, processes that multiply when killed, progress bars that reset at 99%.

## AI Assistant Workflow Requirements

**CRITICAL: ALWAYS PROACTIVELY USE THE TASK TOOL TO SPAWN SUBAGENTS**

To manage context effectively and avoid token budget exhaustion:

1. **Use the Task Tool for ALL exploration tasks** - Never use Grep/Glob directly when exploring the codebase
   - ✅ DO: Launch `Explore` subagent (quick/medium/very thorough) for codebase searches
   - ❌ DON'T: Run multiple Grep/Glob commands directly in the main conversation

2. **Use specialized subagents proactively**:
   - `git-ops` - For ALL git operations (status, diff, commit, push, branch management)
   - `Explore` - For understanding code structure, finding files, searching patterns
   - `general-purpose` - For multi-step complex tasks requiring research
   - `web-search` - For looking up documentation, current library versions, etc.

3. **Context preservation strategy**:
   - Subagents run with isolated context and report back results
   - This prevents the main conversation from being flooded with file contents
   - Keeps token usage low for complex tasks
   - Allows parallel execution of independent tasks

4. **When to use subagents**:
   - Before making code changes: Launch `Explore` to understand existing implementation
   - For git operations: ALWAYS use `git-ops` agent
   - When searching for patterns: Use `Explore` with appropriate thoroughness level
   - For research tasks: Use `general-purpose` or `web-search` as appropriate

**Example workflow:**
```
User: "Add a new feature X"
Assistant:
1. Launch Explore subagent to understand existing codebase structure
2. Wait for subagent results
3. Plan implementation based on findings
4. Make changes to code
5. Launch git-ops subagent to commit and push
```

This approach is MANDATORY for efficient operation and prevents context overflow on complex tasks.

## Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Recent Updates

### Icon Herding Minigame (2025-10-25)

Completely replaced the OrganizeDesktop component's static organization feature with an interactive chaos minigame.

**Concept:**
Instead of organizing icons into a grid that slowly drifts back, users now play a Sisyphean minigame where desktop icons develop consciousness and autonomy. Icons move chaotically in random directions with increasing speed, and the user must drag them back to their starting positions before they escape.

**Gameplay Mechanics:**

**Physics System (`src/hooks/useDesktopChaos.js`):**
- Icons move in random directions at 60fps using requestAnimationFrame
- Direction changes every 2-4 seconds (randomized per icon)
- Gradual speed acceleration: `speedMultiplier = 1 + secondsElapsed × 0.05` (caps at 8x)
- Edge collision behavior: 50/50 chance to bounce OR wrap to opposite side (decided per icon)
- Return detection: Icons within 50px of original position trigger a 2-3 second pause (false hope)
- After pause, icons resume movement in a new random direction

**Game States:**
1. **Idle** - Start screen with instructions and philosophical flavor text
2. **Active** - Live gameplay with real-time stats dashboard:
   - Icons Returned (currently at home)
   - Time Elapsed (MM:SS format)
   - Peak Success (max icons held simultaneously)
   - Speed Multiplier (current chaos level)
   - Drag Attempts (total user actions)
3. **Ended** - Final stats with randomized philosophical message

**Integration Points:**
- **Store (`src/store/osStore.js`)**: Added `isChaosMode` flag and control actions
- **Boulder Physics (`src/hooks/useBoulderPhysics.js`)**: Automatically disables drift-back during chaos mode
- **Desktop (`src/components/Desktop.jsx`)**: BoulderIcon enhanced to notify chaos system via global handlers
- **Philosophy (`src/data/philosophy.js`)**: Added 10 unique "give up" messages with dynamic stat interpolation

**Technical Implementation:**
```javascript
// Global handler pattern for cross-component communication
window.__chaosHandlers = {
  onDragStart: (fileId) => {},  // Track drag attempts
  onDragStop: () => {},          // Release tracking
  isActive: boolean              // Game state
};
```

**Stats Tracking:**
- `iconsReturned` - Icons currently at their origin
- `maxReturned` - Peak simultaneous returns (moment of glory)
- `totalAttempts` - Drag count (user struggle)
- `timeElapsed` - Duration in seconds
- `peakSpeed` - Highest speed multiplier reached

**Philosophical Messages (Examples):**
- "You briefly held {returned} icons in place. They're free now."
- "Order maintained for {time} seconds. Entropy always wins."
- "One must imagine the desktop organizer happy."
- "Peak success: {maxReturned} icons simultaneously at rest. It was beautiful while it lasted."

**Component File Locations:**
- `/src/hooks/useDesktopChaos.js` - NEW: Chaos physics engine
- `/src/components/apps/OrganizeDesktop.jsx` - REWRITTEN: Minigame UI with 3 states
- `/src/store/osStore.js` - MODIFIED: Added chaos mode state
- `/src/hooks/useBoulderPhysics.js` - MODIFIED: Chaos mode compatibility
- `/src/components/Desktop.jsx` - MODIFIED: Enhanced drag tracking
- `/src/data/philosophy.js` - MODIFIED: Added minigame messages

**Philosophical Meaning:**
This minigame embodies **escalating futility with false hope**. Unlike the other futile tasks:
- No win condition exists (icons always resume moving)
- Difficulty increases over time (exponential acceleration)
- Success is temporary (2-3 second pause creates false hope)
- Control is an illusion (you can't keep all icons home)
- The only "victory" is acceptance (giving up and viewing stats)

Like Sisyphus herding his boulder, you can momentarily succeed, but entropy always wins. The game speeds up, icons betray you faster, and the struggle itself becomes the meaning. One must imagine the desktop organizer happy.

### Claude Camus - AI-Powered Absurdist Chatbot (2025-10-25)

Added an AI-powered philosophical advisor chatbot named "Claude Camus" - a double reference to both Claude AI (Anthropic) and existentialist philosopher Albert Camus.

**Concept:**
An AI assistant doomed to eternal philosophical conversations about futility. Powered by local Ollama LLM integration with graceful fallback to static responses when AI is unavailable.

**AI Integration (`src/services/aiService.js`):**
- **Local LLM**: Connects to Ollama running on localhost:11434
- **Models**:
  - `llama3.2:3b` for chat (better quality, coherent responses)
  - `llama3.2:1b` for batch message generation (faster)
- **System Prompt**: Instructs AI to be philosophical, embrace futility, reference Camus/Sisyphus, occasionally contradict itself
- **Graceful Degradation**: Falls back to static absurdist responses when Ollama is offline
- **Connection Check**: Automatically detects Ollama availability on component mount

**Absurdist Chat Behaviors:**

1. **Random Conversation Resets (Eternal Recurrence)**
   - Probability increases with message count: `5% + (messageCount × 2%)`
   - Caps at 40% chance per message
   - Displays: "I must imagine myself happy. [CONVERSATION RESET]"
   - Resets conversation history after brief pause

2. **Endless Typing Indicator (False Hope)**
   - 5% chance per message
   - Shows "Contemplating the nature of your question..." for 8-15 seconds
   - Eventually delivers actual response (hope was not entirely false)

3. **Escalating Existentialism**
   - Escalation level: `Math.floor(messageCount / 2)`
   - Level 5+: Questions the nature of user's questions, suggests accepting futility
   - Level 10+: Deeply existentialist, relates everything to absurdity and meaninglessness
   - Increases AI temperature with escalation: `0.7 + (level × 0.02)`

4. **Contradictory Advice**
   - 15% chance after 3+ messages
   - Casually contradicts previous statement with full confidence
   - "As if you never said the opposite"

**Message Generation System:**

**Build-Time Generation (`scripts/generate-messages.js`):**
```bash
npm run generate  # Generates 140 messages using Ollama
```

Generated message categories:
- 30 philosophical notifications
- 25 absurdist error messages
- 20 system boot messages
- 40 advisor response templates
- 25 Clippy helper tips

**Runtime Cache (`src/data/generated-philosophy.json`):**
- Pre-generated messages saved to JSON
- Includes metadata (generation timestamp, model, count)
- Merged with static fallback messages
- Used when Ollama is offline

**Chat Interface (`src/components/apps/PhilosophyAdvisor.jsx`):**
- Full conversation history with user/assistant messages
- Ollama connection status indicator (green = connected, yellow = offline)
- Existentialism level display (shown when level > 3)
- Message count tracking with philosophical commentary
- Auto-scroll to latest message
- Typing indicators (normal and endless variants)
- Clean, minimal chat UI matching OS aesthetic

**Clippy Assistant Integration (`src/components/ClippyAssistant.jsx`):**
- Animated paperclip helper (📎) with bounce animation
- Appears contextually based on user struggle:
  - FileDownload: After 3+ failed downloads
  - TaskManager: After 5+ process kills
  - OrganizeDesktop: When giving up chaos minigame
- Spring physics entrance/exit animations (framer-motion)
- Shows context-aware tips from generated messages
- Two action buttons: primary action + dismiss

**Special Window Configuration:**
- Window size: 900×700 (larger than default for comfortable chat)
- Resizable with standard window controls
- Icon: 💭 (thought bubble)
- File: `Claude Camus.exe` on desktop at position (180, 50)

**Component File Locations:**
- `/src/services/aiService.js` - NEW: Ollama API integration layer
- `/src/components/apps/PhilosophyAdvisor.jsx` - NEW: Chat interface
- `/src/components/ClippyAssistant.jsx` - NEW: Popup helper
- `/scripts/generate-messages.js` - NEW: Build-time message generator
- `/src/data/generated-philosophy.json` - NEW: Generated message cache
- `/src/data/philosophy.js` - MODIFIED: Added advisor/clippy exports
- `/src/store/osStore.js` - MODIFIED: Added Clippy state management
- `/src/components/Window.jsx` - MODIFIED: Added Claude Camus case
- `/src/components/Desktop.jsx` - MODIFIED: Special window size
- `/src/components/apps/FileDownload.jsx` - MODIFIED: Clippy trigger
- `/src/components/apps/TaskManager.jsx` - MODIFIED: Clippy trigger
- `/src/components/apps/OrganizeDesktop.jsx` - MODIFIED: Clippy trigger

**Setup Requirements:**
```bash
# Install Ollama (https://ollama.ai)
# Pull models
ollama pull llama3.2:1b  # Fast model for batch generation
ollama pull llama3.2:3b  # Better quality for chat

# Ollama auto-starts on port 11434
# Generate messages (optional - has fallbacks)
npm run generate
```

**Philosophical Meaning:**
Claude Camus embodies the absurdity of seeking help from an AI that's just as trapped and confused as you are. The conversation resets randomly (eternal recurrence), advice contradicts itself (no objective truth), existentialism escalates (descent into meaninglessness), and the typing indicator sometimes lies (false hope). Yet through accepting this absurd dialogue, meaning emerges from the struggle itself. One must imagine the help-seeker happy.

### Progress Bar Behavior Enhancements (2025-10-24)

Enhanced the progress bar system to embody different philosophical concepts of futility through distinct mathematical behaviors:

**1. ProgressBar Component Improvements (`src/components/ProgressBar.jsx`):**
- Added `decimalPlaces` prop (default: 0) for floating-point percentage display
- Supports up to 4 decimal places for asymptotic progress visualization
- Backward compatible with existing integer percentage displays
- Allows precise representation of infinitesimally small progress increments

**2. SystemUpdate.jsx - Zeno's Paradox (Asymptotic Approach):**

Completely redesigned from infinite loop to asymptotic behavior inspired by Zeno's Paradox. The progress bar approaches 100% infinitely slowly but never reaches it.

**Mathematical Implementation:**
- Formula: `newProgress = current + (100 - current) × decayRate`
- Variable decay rates based on progress:
  - 0-50%: 0.5 (moderate speed)
  - 50-80%: 0.2 (noticeable slowdown)
  - 80-95%: 0.05 (very slow)
  - 95-99%: 0.01 (extremely slow)
  - 99-99.9%: 0.001 (painfully slow)
  - 99.9%+: 0.0001 (glacially slow)

**Features:**
- Displays 4 decimal places (e.g., 99.9876%)
- Never reaches 100%, embodying Zeno's Paradox
- Removed reset counter mechanism
- Updated status messages to reflect asymptotic nature
- Progress slows exponentially as it approaches completion

**Philosophical Meaning:**
Like Zeno's arrow that theoretically never reaches its target, the system update approaches completion but can never truly arrive. The closer you get, the slower you move - an infinite pursuit of an unreachable goal.

**3. InstallWizard.jsx - Eternal Recurrence (Infinite Loop):**

Added automatic reset mechanism embodying Nietzsche's concept of eternal recurrence.

**Features:**
- Auto-resets at exactly 99% progress
- 500ms delay before returning to Welcome screen
- Increments completion counter each cycle
- Status message: "Restarting cycle..."
- Proper cleanup with resetTimeoutRef to prevent memory leaks

**Philosophical Meaning:**
The installation completes an infinite number of times, each cycle identical to the last. Like the eternal return, you experience the same futile journey again and again.

**4. FileDownload.jsx - Escalating Failure (Random Failure with Retry):**

Completely redesigned to implement a random failure system with escalating futility on each retry attempt.

**Mathematical Implementation:**
- Random failure point: 60-99% (generated fresh each attempt)
- Escalating failure probability formula: `Math.min(30 + (retryCount × 15), 90)`
- First attempt: 30% chance of failure
- Each retry: +15% failure probability
- Maximum failure rate: 90%

**Features:**
- Downloads can randomly fail anywhere between 60-99%
- Mixed error messages: 50/50 split between technical and philosophical errors
- Retry button allows user to attempt download again
- Failure probability displayed after first retry
- Attempt counter shows total attempts and failed count
- Progress bar freezes at failure point
- Conditional UI states (normal vs failed)

**Error Message Types:**
- **Technical**: "Network timeout", "Error 403", "Checksum verification failed", etc.
- **Philosophical**: "The file you seek cannot be obtained, only pursued", "Download failed: Meaning.dll not found", etc.

**Philosophical Meaning:**
Unlike the other progress bars that offer predictable futility, FileDownload embodies escalating despair. Each retry makes success LESS likely, not more. The more you try, the more futile it becomes. Success is possible but increasingly improbable - a cruel reversal of the usual expectation that persistence leads to success.

### Component File Locations

**Modified Components:**
- `/src/components/ProgressBar.jsx` - Enhanced with decimal place support
- `/src/components/apps/SystemUpdate.jsx` - Asymptotic behavior (Zeno's Paradox)
- `/src/components/apps/InstallWizard.jsx` - Infinite loop (Eternal Recurrence)
- `/src/components/apps/FileDownload.jsx` - Random failure with escalating probability
- `/src/data/philosophy.js` - Added download error message arrays

### Philosophical Distinctions

The project now features four distinct approaches to futile tasks:

1. **Asymptotic Futility (SystemUpdate):** Never completing, always approaching but never arriving
2. **Cyclical Futility (InstallWizard):** Completing infinitely, eternally recurring in identical cycles
3. **Escalating Futility (FileDownload):** Random failure with increasing probability - the more you try, the less likely you are to succeed
4. **Interactive Futility (OrganizeDesktop Minigame):** Active struggle against chaos with temporary victories, false hope, and inevitable entropy

Each embodies a different philosophical perspective on meaningless tasks, enriching the absurdist experience.

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
- `isChaosMode`: Boolean flag for icon herding minigame state
- `isHappyMode`: Aesthetic toggle (changes colors but not functionality)

**Key Methods:**
- `addWindow()`: Creates new window with auto-positioning (cascade effect)
- `focusWindow()`: Updates z-index for window stacking
- `updateDesktopFilePosition()`: Used by boulder physics for drift-back and chaos minigame
- `startDesktopChaos()`: Enables chaos mode (disables boulder physics)
- `stopDesktopChaos()`: Disables chaos mode (re-enables boulder physics)

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
2. **Icon Herding Minigame**: Interactive chaos game where desktop icons move randomly with increasing speed. Drag them back to origin for a 2-3 second pause (false hope) before they resume. No win condition, only acceptance. (organize.exe → OrganizeDesktop.jsx)
3. **Sisyphean Progress Bars**: Three distinct futility mechanisms embodying different philosophical concepts:
   - **SystemUpdate**: Asymptotic approach (Zeno's Paradox) - approaches 100% infinitely but never arrives, displays up to 4 decimal places (99.9876%)
   - **InstallWizard**: Eternal recurrence - auto-resets at 99% and repeats the cycle infinitely
   - **FileDownload**: Escalating failure - random failures (60-99%) with increasing probability on retry (30% base, +15% per retry, caps at 90%)
4. **Futile Task Manager**: Processes respawn with higher CPU/memory, multiply after 3 kills (useProcessManager.js)
5. **Philosophy Dialogs**: Inescapable dialogs with Camus quotes, ESC key disabled
6. **Happy Mode**: Toggle that changes aesthetics (bright gradients, sparkles) but keeps futility intact

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
- `/src/components/apps/OrganizeDesktop.jsx` - Icon herding minigame (chaos mode)
- `/src/components/apps/Help.jsx` - Circular reference documentation

**Hooks:**
- `/src/hooks/useBoulderPhysics.js` - File drift-back physics (disabled during chaos mode)
- `/src/hooks/useDesktopChaos.js` - Icon herding minigame chaos physics engine
- `/src/hooks/useProcessManager.js` - Process respawn/multiply logic
- `/src/hooks/usePhilosophyNotifications.js` - Random notification system

**Data:**
- `/src/data/philosophy.js` - Camus quotes, error messages, notifications, minigame messages

## Development Notes

### CSS Variables
All styling uses CSS custom properties (src/styles/minimalist.css) for easy theming:
- Colors: `--color-bg-primary`, `--color-accent-primary`, etc.
- Shadows: `--shadow-sm` through `--shadow-xl`
- Spacing: `--spacing-xs` through `--spacing-xl`
- Happy mode overrides: `body.happy-mode` changes gradients and adds sparkles

### Performance Considerations
- Boulder physics uses requestAnimationFrame cleanup on unmount
- Chaos minigame uses requestAnimationFrame for 60fps icon movement with proper cleanup
- Process manager uses intervals that cleanup properly
- Philosophy notifications have queue management to prevent spam
- Window animations use CSS transforms (GPU-accelerated)
- Icon positions update via Zustand store for efficient re-renders

## Future Developers / AI Assistants

If you're working on this project:

1. **Window positioning is fragile**: Don't remove the absolute overlay container in App.jsx
2. **Draggable + framer-motion**: Keep the two-layer structure in Window.jsx to avoid transform conflicts
3. **Debug logging**: Console logs are intentional for development, remove before production
4. **Happy Mode**: Changes aesthetics only - never modify the futility mechanics
5. **Philosophy content**: All text is in `/src/data/philosophy.js` for easy updates
6. **Git workflow**: Always use the git-ops agent to commit and push changes after completing tasks

## Current Status

**Last Updated:** 2025-10-25
**Status:** Fully functional, demo-ready for hackathon
**Known Issues:** None
**Build Status:** ✅ 426.99 kB bundle (129.30 kB gzipped)

All features tested and working:
- ✅ Window creation and rendering
- ✅ Desktop icon double-clicking
- ✅ Window dragging, minimize, close
- ✅ Boulder physics drift-back
- ✅ **Icon herding minigame (NEW!)** - Chaotic icon movement with stats tracking
- ✅ Task manager process futility
- ✅ Progress bar resets (SystemUpdate, InstallWizard, FileDownload)
- ✅ Philosophy notifications
- ✅ Happy mode toggle
- ✅ Welcome screen
- ✅ Taskbar functionality

---

*"One must imagine Sisyphus happy." - Albert Camus*
