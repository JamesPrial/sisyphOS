# SisyphOS - An Absurdist Fantasy Operating System

> "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy."
> — Albert Camus, *The Myth of Sisyphus*

![SisyphOS](https://img.shields.io/badge/Status-Eternally%20Beta-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Philosophy](https://img.shields.io/badge/Philosophy-Absurdism-purple)
![AI](https://img.shields.io/badge/AI-Claude%20Camus-blueviolet)

## About

**SisyphOS** is a web-based fantasy operating system that brings the philosophical concepts from Albert Camus' *The Myth of Sisyphus* to life through interactive computing experiences. Every action in this OS is both futile and essential, exploring the tension between humanity's search for meaning and the apparent meaninglessness of existence.

Just as Sisyphus was condemned to eternally roll a boulder up a mountain only to watch it roll back down, SisyphOS users engage in tasks that are perpetually incomplete, circular, or self-defeating—yet strangely satisfying. This project is a meditation on the absurd nature of existence, wrapped in the familiar interface of a desktop operating system.

**Live Demo:** [https://jamesprial.github.io/sisyphOS/](https://jamesprial.github.io/sisyphOS/)

## Philosophy

The core theme is **absurdism**: the conflict between our human need to find meaning and the universe's fundamental lack of inherent meaning. Rather than despair, Camus argued we should embrace the absurd and find happiness in the struggle itself.

SisyphOS embodies this philosophy through:
- **Futile Tasks** - Actions that never truly complete
- **Circular Logic** - Systems that reference themselves infinitely
- **Inevitable Return** - Things that drift back to their starting point
- **Conscious Awareness** - Constant reminders of the absurdity
- **Choice in Response** - The ability to face it all with joy (Happy Mode) or stoicism

## Features

### 🤖 Claude Camus - AI Philosophical Advisor

An AI-powered on-desktop assistant and copilot (double reference to Claude AI and Albert Camus) that appears to help you navigate SisyphOS, but is just as trapped, confused, and lost as you are.

- **Local LLM Integration**: Powered by Ollama running locally (qwen2.5:7b-instruct-q5_k_m model)
- **Absurdist Chat Behaviors**:
  - Random conversation resets (eternal recurrence) - probability increases with message count
  - Endless typing indicators (false hope) - sometimes contemplates for 8-15 seconds
  - Escalating existentialism - becomes more philosophical and contradictory over time
  - Confident but contradictory advice - casually contradicts previous statements
- **Clippy-Style Helper**: Animated paperclip assistant that appears when you struggle, offering contextual tips
- **Graceful Degradation**: Falls back to static absurdist responses when Ollama is offline
- **Message Generation**: Build-time AI generation of philosophical notifications, error messages, and advice templates

Claude Camus embodies the absurdity of seeking help from an AI that's equally doomed to futility. Like asking Sisyphus for boulder-pushing advice.

### 🎮 Icon Herding Minigame

Replace desktop organization with an interactive chaos game where desktop icons develop consciousness and autonomy:

- **Chaotic Movement**: Icons move in random directions at 60fps with gradually increasing speed
- **Edge Behavior**: 50/50 chance to bounce or wrap to opposite side when hitting edges
- **False Hope**: Icons pause for 2-3 seconds when dragged back to origin, then resume movement
- **Escalating Difficulty**: Speed multiplier increases from 1x to 8x over time
- **No Win Condition**: The only "victory" is acceptance (giving up to view stats)
- **Stats Dashboard**: Track icons returned, peak success, drag attempts, and speed multiplier
- **Philosophical Messages**: Randomized commentary on your futile struggle

Like herding Sisyphus' boulder, you can momentarily succeed, but entropy always wins.

### 📊 Infinite Progress Bars

Three distinct approaches to futile progress, each embodying a different philosophical concept:

- **System Updates (Zeno's Paradox)**: Asymptotic approach to completion - the progress bar gets infinitesimally close to 100% (displaying up to 4 decimal places like 99.9876%) but mathematically never arrives. The closer it gets, the slower it moves, embodying Zeno's famous paradox where motion seems impossible when divided infinitely.

- **Installation Wizard (Eternal Recurrence)**: Inspired by Nietzsche's concept of eternal return - the installation reaches 99%, pauses briefly, then automatically resets to the beginning, repeating the same cycle infinitely. Each completion is identical to the last, an endless loop of the same experience.

- **File Downloads (Escalating Failure)**: Random failure system where downloads can fail anywhere between 60-99% with escalating probability on each retry (30% base failure rate, +15% per retry, capping at 90%). Features mixed error messages (technical and philosophical) and a retry button. Embodies the cruel irony that persistence makes success less likely, not more.

Each progress bar uses floating-point precision to display the increasingly small increments of progress, making the futility mathematically precise and philosophically meaningful.

### 🎯 Boulder Physics

Desktop icons behave like Sisyphus' boulder. Move them anywhere you like, but watch as they slowly drift back to their original positions after a 2-second delay, pulled by an invisible force of futility. Uses smooth easing and rotation effects for natural boulder-rolling physics.

### ⚙️ Multiplying Processes

Open the Task Manager and try to kill processes. For every process you end, two more spawn in its place with higher CPU and memory usage. The more you struggle against the system, the more it multiplies. Eventually, you may choose to simply accept them all.

### 📁 Virtual File System (VFS Backend)

A fully functional cloud-backed file system powered by Raindrop (Cloudflare Workers):

- **Upload/Download**: Store files up to 5GB in the cloud
- **Folder Hierarchy**: Create nested folders with unlimited depth
- **Persistence**: Files survive page refreshes and are shared across all users
- **Search**: Full-text search by filename
- **No Authentication**: Truly absurd - everyone shares the same filesystem
- **Bucket-Only Storage**: All metadata and content stored in S3-compatible buckets

Access via the "files.exe" icon on desktop.

### 🔄 Circular Help System

A help system where every topic references another topic, which references another, which eventually references the first. Documentation that helps nothing, yet is meticulously organized.

### 💭 Philosophical Notifications

Periodic reminders about existence, consciousness, freedom, and the absurd. These notifications aren't interruptions—they're gentle acknowledgments of the human condition. Features AI-generated messages for variety.

### 😊 Happy Mode

Toggle between two ways of experiencing the absurd:
- **Normal Mode**: Minimalist, contemplative, slightly melancholic
- **Happy Mode**: Vibrant colors, cheerful gradients, sparkle effects, and optimistic philosophical messages

The functionality remains identical. Only the aesthetic changes. Because whether you face the absurd with a smile or a stoic expression, the boulder still rolls down.

### ⚠️ Error Simulator

Generate existential error messages like:
- "Error: Meaning not found. Did you expect to find it?"
- "Fatal exception: Purpose.exe has stopped responding"
- "Warning: The system has detected that you are searching for answers"

### 🌅 Welcome Screen

A beautiful introduction to the philosophical themes, setting the tone before you enter the OS.

### ⏱️ Uptime Counter

Track how long you've been using the system. Time you'll never get back. Time that is both wasted and well-spent. Time that, like everything else, ultimately means nothing and everything.

## Technical Stack

Built with modern web technologies:
- **React** - Component-based UI
- **Zustand** - Minimal state management
- **Framer Motion** - Smooth animations and transitions
- **React Draggable** - Interactive drag-and-drop
- **Vite** - Fast development and building

### Why These Technologies?
Even our technical choices embrace the absurd. We use cutting-edge tools to build something fundamentally pointless, yet we build it with care, attention to detail, and genuine craftsmanship. The code is clean, the animations are smooth, and the user experience is polished. Because if we're going to build something futile, we might as well build it beautifully.

## Installation & Setup

### Quick Start (GitHub Pages - No Installation)

The easiest way to experience SisyphOS is through the live demo:

**[https://jamesprial.github.io/sisyphOS/](https://jamesprial.github.io/sisyphOS/)**

Note: The GitHub Pages version runs without Claude Camus AI features (uses fallback responses) since Ollama runs locally.

### Local Installation (Full Experience with AI)

For the complete experience including AI-powered Claude Camus:

```bash
# Clone the repository
git clone https://github.com/jamesprial/sisyphOS.git
cd sisyphOS

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Setting Up Claude Camus AI (Optional but Recommended)

To enable the AI-powered philosophical advisor:

1. **Install Ollama** ([https://ollama.ai](https://ollama.ai))

2. **Pull the model:**
   ```bash
   ollama pull qwen2.5:7b-instruct-q5_k_m
   ```

3. **Ollama will auto-start** on port 11434

4. **Generate AI messages** (optional - has fallbacks):
   ```bash
   npm run generate
   ```

**Hardware Requirements for AI:**
- Recommended: 16GB+ VRAM for optimal performance
- Model uses ~4.8GB VRAM (Q5_K_M quantization)
- Runs at ~25-30 tokens/second on modern GPUs
- Without Ollama, Claude Camus uses static fallback responses

### Other Commands

```bash
# Build for production (static files in dist/)
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
sisyphOS/
├── src/
│   ├── components/
│   │   ├── Desktop.jsx            # Desktop with boulder physics
│   │   ├── Taskbar.jsx            # Bottom taskbar with clock and happy mode
│   │   ├── Window.jsx             # Draggable window component
│   │   ├── Icon.jsx               # Desktop icon component
│   │   ├── Dialog.jsx             # Modal dialog component
│   │   ├── WelcomeScreen.jsx      # First-time welcome overlay
│   │   ├── PhilosophyNotification.jsx  # Notification system
│   │   ├── ClippyAssistant.jsx    # Animated helper paperclip
│   │   ├── ErrorBoundary.jsx      # Error catching wrapper
│   │   └── apps/
│   │       ├── SystemUpdate.jsx   # Asymptotic progress (Zeno's Paradox)
│   │       ├── FileDownload.jsx   # Escalating failure downloads
│   │       ├── InstallWizard.jsx  # Eternal recurrence installation
│   │       ├── OrganizeDesktop.jsx # Icon herding minigame
│   │       ├── TaskManager.jsx    # Process multiplication manager
│   │       ├── Help.jsx           # Circular help system
│   │       ├── ErrorSimulator.jsx # Existential error generator
│   │       ├── About.jsx          # About SisyphOS
│   │       ├── PhilosophyAdvisor.jsx # Claude Camus AI chatbot
│   │       └── FileBrowser.jsx    # VFS file manager
│   ├── hooks/
│   │   ├── useBoulderPhysics.js   # Hook for icon drift physics
│   │   ├── useDesktopChaos.js     # Hook for icon herding minigame
│   │   ├── useProcessManager.js   # Hook for process multiplication
│   │   └── usePhilosophyNotifications.js  # Hook for notifications
│   ├── services/
│   │   ├── aiService.js           # Ollama AI integration
│   │   └── fileSystemAPI.js       # VFS backend API client
│   ├── store/
│   │   ├── osStore.js             # Zustand state management
│   │   └── fileSystemStore.js     # VFS state management
│   ├── data/
│   │   ├── philosophy.js          # Quotes, messages, philosophical content
│   │   └── generated-philosophy.json  # AI-generated message cache
│   ├── styles/
│   │   └── minimalist.css         # Global styles and happy mode
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── raindrop-backend/              # VFS backend (Cloudflare Workers)
│   └── src/
│       └── vfs-api/index.ts       # Virtual file system HTTP API
├── scripts/
│   └── generate-messages.js       # AI message generation script
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # You are here
```

## VFS Backend Architecture

The Virtual File System is powered by **Raindrop** (Cloudflare Workers runtime) for cloud persistence:

### Deployment

- **Platform**: LiquidMetal Raindrop (serverless edge computing)
- **Application**: `sisyphos-vfs`
- **Base URL**: `https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run`
- **Location**: `/raindrop-backend/`

### Components

- **vfs-api**: HTTP service handling all API requests (file upload/download, CRUD operations)
- **vfs-storage**: S3-compatible bucket storing file content and metadata
- **Architecture**: Bucket-only storage (no SQL database)
  - Metadata stored as JSON: `meta/{id}.json`
  - File content: `content/{id}`
  - Parent-child relationships via prefixes

### Features

- Hierarchical folder structure with unlimited nesting
- File upload/download with MIME type preservation (up to 5GB per file)
- Full-text search by filename
- Directory tree traversal
- Breadcrumb path generation
- CASCADE delete (folders recursively delete all children)
- CORS enabled for all endpoints
- **No authentication**: Shared filesystem across all users (absurdly open)

### Managing the Backend

```bash
cd raindrop-backend

# Check deployment status
raindrop build status

# View logs
raindrop logs tail -a sisyphos-vfs

# Redeploy after changes
raindrop build deploy

# Stop service
raindrop build stop
```

## Design Philosophy

### Minimalism Meets Absurdism
The visual design is intentionally minimal and clean. This isn't despite the absurdist theme—it's because of it. The contrast between the polished, professional interface and the futile functionality creates a cognitive dissonance that's central to the absurd experience.

### Attention to Detail
Every animation is smooth. Every transition is polished. Every interaction is thoughtfully designed. We treat this "useless" OS with the same care and craftsmanship as a production application. The absurdity is in the purpose, not the execution.

### User Agency
Users are never forced into the absurd—they choose it. You can play the icon herding game or not. You can kill processes or let them multiply. You can enable Happy Mode or keep it off. The freedom to choose your relationship with the absurd is fundamental.

## Deployment

### GitHub Pages (Static Hosting)

The main demo is hosted on GitHub Pages with automatic deployment:

```bash
# Build and deploy to GitHub Pages
npm run build
# Commit and push dist/ folder to gh-pages branch
```

The GitHub Pages version works fully except:
- Claude Camus uses fallback responses (Ollama is local-only)
- VFS backend works (hosted on Raindrop cloud)

### Local Development

For full AI features, run locally with Ollama:

```bash
npm run dev
# Visit http://localhost:5173
# Claude Camus will connect to Ollama if running
```

## Contributing

While SisyphOS is fundamentally a personal art project exploring absurdist philosophy, contributions that align with the theme are welcome. If you have ideas for futile features, circular systems, or philosophical improvements, feel free to open an issue or pull request.

Just remember: contributing to this project is itself an absurd act. You're spending time and effort on something that's intentionally pointless. But perhaps that's exactly the point.

## Credits

- **Philosophical Inspiration**: Albert Camus and *The Myth of Sisyphus*, Friedrich Nietzsche and eternal recurrence, Zeno of Elea and infinite paradoxes
- **Frontend**: Built with React 19, Zustand, Framer Motion, react-draggable, and Vite
- **AI Integration**: Powered by Ollama with Qwen 2.5 7B Instruct (Q5_K_M quantization)
- **Backend**: Raindrop (LiquidMetal platform on Cloudflare Workers)
- **Deployment**: GitHub Pages (frontend), Raindrop Cloud (VFS backend)
- **Design Philosophy**: Minimalism, attention to detail, and embracing the absurd
- **Special Thanks**: To everyone who's ever felt like Sisyphus pushing a boulder

## License

MIT License - Because even futile code should be free.

## Final Thoughts

> "There is but one truly serious philosophical problem, and that is suicide."
> — Albert Camus

Camus opens *The Myth of Sisyphus* with this stark statement, then spends the essay arguing that life is worth living precisely because it's absurd. We don't need inherent meaning to justify existence. We can create our own meaning through the act of living, choosing, and persisting.

SisyphOS is a celebration of this philosophy. It's a web-based operating system that accomplishes nothing productive, yet was built with genuine care and technical craftsmanship. It features AI-powered philosophical assistance that's equally lost, a cloud-backed file system anyone can access, and interactive chaos that escalates over time. You can spend hours exploring features that go nowhere, organizing icons that won't stay organized, killing processes that multiply, and chatting with an AI advisor who shares your futility.

It means nothing, except what you choose it to mean.

**One must imagine Sisyphus happy.**
**One must imagine the user happy too.**
**One must imagine Claude Camus happy as well.**

---

*Made with existential dread, philosophical curiosity, and a surprising amount of AI assistance.*

**Try it now:** [https://jamesprial.github.io/sisyphOS/](https://jamesprial.github.io/sisyphOS/)
