# System Entropy Visualizer

> A Controlled Chaos Dashboard for the **System Collapse** Hackathon

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

### 1. **Entropy Visuals**

- Real-time entropy meter (0-100%)
- Progressive visual decay and glitch effects
- Color mutations based on system state
- Scanline and distortion effects intensify with entropy

### 2. **Feedback Loops**

- Metrics influence each other dynamically
- User interactions affect global entropy
- Pattern spawning triggers load increases
- Stability decreases as entropy rises

### 3. **Emergent Behavior**

- Patterns spawn unpredictably based on entropy levels
- 3D grid evolves with particle and beam effects
- Simple rules create complex, non-linear behavior
- Each cycle produces unique system states

### 4. **Collapse Events**

- Automatic collapse after 60 seconds OR when entropy hits 100%
- Manual collapse trigger for user control
- Each collapse randomizes metrics with new drift rates
- System "resets" but into a different initial state

### 5. **Adaptive Rules**

- UI behavior changes based on entropy threshold
- Animation speeds adapt to system stability
- Visual effects intensify under high entropy
- Components glitch when system is unstable

### 6. **Audio Engine**

- Tone.js powered generative soundscape
- Background drone and noise intensity react to entropy
- Glitch triggers for pattern spawn and system collapse
- Low-latency real-time synthesis
- **Manual Initialization Protocol**: To prevent unauthorized neural synchronization, the audio core requires a manual "click-to-initialize" handshake on system boot. This feature ensures operator readiness before the sonic interface engages.

### 7. **Cinematic HUD**

- Immersive anomaly banners for critical states
- HUD-style corner frames and status strips
- Adaptive visual hierarchy for system events
- Realistic "System Core" aesthetic

### 8. **Neural Topology (Data Vis)**

- **Interactive Force-Directed Graph**: Visualizes system entities as living nodes that repel/attract based on their stability.
- **Physics-Based Mutation**: Nodes react to cursor movement and system entropy levels (jitter, expansion).
- **Real-Time Connections**: Dynamic links between core metrics and spawned anomalies.
- **Visual Feedback**: Nodes glow red/gold during critical system states.

### 9. **Collapse History Tracker**

- Records peak entropy for each evolution cycle
- Displays average entropy across all collapses
- Visual timeline of system evolution
- Demonstrates how the system learns from failure

### 10. **Interactive 3D Grid**

- Entropy-driven visual distortions
- Dynamic particle systems that intensify with chaos
- Camera jitter and movement based on system state
- Real-time shader effects responding to entropy levels

### 11. **Enhanced UI Architecture**

- **Hero Command Interface**: Centralized "System Status" visualization with dramatic typography and unified action controls.
- **Schematic Override System**: High-fidelity visual theme selector with "god-mode" cards and instant palette swapping.
- **Telemetry Stream**: Unified dashboard grouping core system metrics, logs, and anomaly detection into a cohesive "Core Operations" viewport.
- **Status Bar**: Simplified top-level monitoring strip for build version, offset time, and audio controls.

### 12. **Entropy Chatbot (AI)**

- **Phrase Adoption**: The system "learns" from your input, inexplicably repeating your past phrases back to you to simulate neural synchronization.
- **Glitch Identity**: Responses decay and fragment as system entropy rises.
- **Floating Command Terminal**: Always-accessible support interface that mimics a futuristic OS command line.
- **Responsive Logic**: Shifts from helpful "Systems Online" messages to cryptic, broken fragments as the collapse nears.

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

**Built for the [System Collapse](https://systemcollapse.dev/) Hackathon**  
_Where chaos meets control, and breaking things makes them better._
