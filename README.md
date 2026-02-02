# System Entropy Visualizer

**A Controlled Chaos Dashboard for the "System Collapse" Hackathon**

![Built with The Grid](https://img.shields.io/badge/Built%20with-The%20Grid-00d4ff?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)
![Theme: System Collapse](https://img.shields.io/badge/Theme-System%20Collapse-ff3333?style=for-the-badge)

## 🌀 Concept

**"Most software is designed to prevent errors. This project is designed to cultivate them."**

The **System Entropy Visualizer** explores the hackathon theme "System Collapse" by turning instability into a creative force. It creates a "living" UI where specific metrics—CPU drift, neural load, and memory leaks—interact in complex feedback loops.

As users interact with the system (or leave it to idle), **Entropy** rises. This single variable drives every part of the experience:

- **Visuals:** A 3D Tron-inspired grid begins to jitter and fragment.
- **Audio:** A generative synthesizer shifts from harmonic drones to dissonant noise.
- **Interface:** Buttons and cards begin to drift and glitch using reactive CSS animations.

The goal isn't to fix the system, but to surf the edge of destruction, triggering "collapse events" that reset the environment into unique, randomized configurations. It demonstrates how complex systems learn and evolve through failure.

## ✨ Implemented Features

### 1. **Entropy Visuals** ✅

- Real-time entropy meter (0-100%)
- Progressive visual decay and glitch effects
- Color mutations based on system state
- Scanline and distortion effects intensify with entropy

### 2. **Feedback Loops** ✅

- Metrics influence each other dynamically
- User interactions affect global entropy
- Pattern spawning triggers load increases
- Stability decreases as entropy rises

### 3. **Emergent Behavior** ✅

- Patterns spawn unpredictably based on entropy levels
- 3D grid evolves with particle and beam effects
- Simple rules create complex, non-linear behavior
- Each cycle produces unique system states

### 4. **Collapse Events** ✅

- Automatic collapse after 60 seconds OR when entropy hits 100%
- Manual collapse trigger for user control
- Each collapse randomizes metrics with new drift rates
- System "resets" but into a different initial state

### 5. **Adaptive Rules** ✅

- UI behavior changes based on entropy threshold
- Animation speeds adapt to system stability
- Visual effects intensify under high entropy
- Components glitch when system is unstable

### 6. **Audio Engine** ✅

- Tone.js powered generative soundscape
- Background drone and noise intensity react to entropy
- Glitch triggers for pattern spawn and system collapse
- Low-latency real-time synthesis
- **Manual Initialization Protocol**: To prevent unauthorized neural synchronization, the audio core requires a manual "click-to-initialize" handshake on system boot. This feature ensures operator readiness before the sonic interface engages.

### 7. **Cinematic HUD** ✅

- Immersive anomaly banners for critical states
- HUD-style corner frames and status strips
- Adaptive visual hierarchy for system events
- Realistic "System Core" aesthetic

### 8. **Pattern Memory & Lifecycle** ✅

- Real-time pattern tracking with type classification (ANOMALY, SPIKE, DRIFT, SURGE)
- Visual lifecycle indicators showing pattern age vs lifespan
- Ghost traces of recently collapsed patterns
- Load metrics showing system impact
- Emergent pattern behavior with unpredictable lifespans

### 9. **Collapse History Tracker** ✅

- Records peak entropy for each evolution cycle
- Displays average entropy across all collapses
- Visual timeline of system evolution
- Demonstrates how the system learns from failure

### 10. **Interactive 3D Grid** ✅

- Entropy-driven visual distortions
- Dynamic particle systems that intensify with chaos
- Camera jitter and movement based on system state
- Real-time shader effects responding to entropy levels

### 11. **Enhanced UI Architecture** ✅

- **Hero Command Interface**: Centralized "System Status" visualization with dramatic typography and unified action controls.
- **Schematic Override System**: High-fidelity visual theme selector with "god-mode" cards and instant palette swapping.
- **Telemetry Stream**: Unified dashboard grouping core system metrics, logs, and anomaly detection into a cohesive "Core Operations" viewport.
- **Status Bar**: Simplified top-level monitoring strip for build version, offset time, and audio controls.

## 🎨 Tron-Themed Design

Built using **The Grid** - a Tron-inspired component library with:

- **6 Theme Variants**: Ares, Tron, Clu, Athena, Aphrodite, Poseidon
- **3D Effects**: Interactive grid with particles and light beams
- **Visual Effects**: Scanlines, glows, neon accents
- **Tron Fonts**: Orbitron (display) and Rajdhani (body)

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Styling**: Tailwind CSS 4 + The Grid components
- **3D Graphics**: Three.js + React Three Fiber
- **Audio**: Tone.js (Web Audio API)
- **Animation**: Framer Motion + GSAP
- **Type Safety**: TypeScript 5

## 🚀 Running the Project

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Visit `http://localhost:3000` to see the dashboard.

## 📊 How It Works

### State Management

The core system state includes:

- **Entropy**: Grows over time, accelerated by user actions
- **Patterns**: Emergent entities with types, lifespans, and load metrics
- **Tasks**: Anomalies that decay and affect system stability
- **Metrics**: Four key indicators that drift and influence each other
- **Glitch Intensity**: Visual distortion based on entropy level
- **Audio Feedback**: Real-time soundscape reacting to system state
- **Collapse History**: Tracking evolution cycles and peak entropy

### Interaction

- **Click Metric Cards**: Inject entropy (+5)
- **Inject Entropy Button**: Add +10 to entropy
- **Spawn Pattern Button**: Manually create a pattern with random type and lifespan
- **Add Tasks**: Deploy anomalies that decay over time
- **Complete Tasks**: Resolve anomalies for stabilization bursts (-5 entropy)
- **Trigger Collapse Button**: Force an immediate reset
- **Audio Toggle**: Enable/disable generative soundscape (auto-plays on load)
- **Theme Buttons**: Change visual theme (affects colors globally)

### The Collapse Cycle

1. System starts at 0% entropy
2. Entropy grows passively (~0.05% per frame)
3. User actions accelerate entropy growth
4. Metrics drift and mutate
5. Patterns spawn based on probability
6. At 60 seconds OR 100% entropy → COLLAPSE
7. System resets with randomized state
8. Cycle repeats with new behaviors

## 🎯 Hackathon Alignment

This project directly addresses the "System Collapse" theme by:

1. **Embracing Instability**: The system doesn't fight entropy—it uses it
2. **Feedback Loops**: Actions cascade through interconnected metrics
3. **Emergent Complexity**: Simple rules produce unpredictable patterns
4. **Intentional Failure**: Collapse is a feature, not a bug
5. **Adaptive Behavior**: The UI evolves based on system state

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Theme provider + Tron fonts
│   ├── page.tsx            # Main dashboard
│   ├── globals.css         # Base styles
│   └── tron-globals.css    # Tron theme variables
├── components/
│   ├── theme/              # Theme system
│   ├── tron-grid.tsx       # 3D grid component
│   ├── entropy-meter.tsx   # Custom entropy display
│   ├── metric-card.tsx     # Mutating metric cards
│   └── [25+ Grid components]
└── hooks/
    └── use-system-state.ts # Core state management
```

## 🌟 Key Components

### `useSystemState` Hook

Manages all system state with real-time updates via `requestAnimationFrame`. Implements entropy growth, pattern evolution, metric drift, and collapse logic.

### `TronGrid3D`

Three.js-based 3D grid that responds to entropy levels. Particles and light beams appear/intensify as chaos increases.

### `MetricCard`

Data visualization cards that drift, glitch, and influence each other through feedback loops.

### `EntropyMeter`

Visual gauge showing system entropy with color-coded status (Stable/Warning/Critical) and glitch effects.

## 📈 Future Enhancements

- **Network Mode**: Multi-user entropy synchronization
- **Pattern Gallery**: View history of emerged patterns
- **Entropy Presets**: Load predefined chaos scenarios
- **Audio Feedback**: Sound design that responds to entropy
- **Advanced Physics**: More complex pattern interactions

## 🙏 Credits

- **The Grid**: Tron-themed component library by @educlopez
- **shadcn/ui**: Base component architecture
- **Three.js**: 3D graphics engine
- **Next.js**: React framework

---

**Built for the "System Collapse" Hackathon**  
_Where chaos meets control, and breaking things makes them better._
