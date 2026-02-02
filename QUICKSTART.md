# 🎮 Quick Start Guide - The Grid Dashboard

## ✅ Installation Complete!

You now have **25+ Tron-themed components** installed from The Grid, including:

- 10 Tron-specific UI components (HUD, data cards, timers, etc.)
- 3 3D components with Three.js
- 4 Visual effects (scanlines, glows, circuits)
- 8 Core UI components with Tron styling
- Theme provider with 6 color schemes

## 🚀 Next Steps

### Step 1: Copy Tron Styles

Download the full Tron CSS from The Grid:

```bash
# Download globals.css with all Tron theme variables and animations
curl https://raw.githubusercontent.com/educlopez/thegridcn-ui/main/src/app/globals.css > src/app/tron-globals.css
```

Then import it in your `src/app/layout.tsx`:

```typescript
import "./tron-globals.css";
```

Or merge the theme variables into your existing `globals.css`.

### Step 2: Add Theme Provider to Layout

Update `src/app/layout.tsx`:

```typescript
import { ThemeProvider } from "@/components/theme/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This script prevents flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('project-ares-theme') || 'ares';
                const intensity = localStorage.getItem('project-ares-theme-intensity') || 'medium';
                document.documentElement.setAttribute('data-theme', theme);
                if (intensity !== 'none') {
                  document.documentElement.setAttribute('data-tron-intensity', intensity);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 3: Create Your First Tron Component

Create `src/app/page.tsx`:

```typescript
"use client"

import { TronHud } from "@/components/tron-hud"
import { TronDataCard } from "@/components/tron-data-card"
import { TronGrid } from "@/components/tron-grid"
import { Button } from "@/components/button"
import { useTheme } from "@/components/theme/theme-provider"

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="min-h-screen bg-background">
      {/* 3D Grid Background */}
      <div className="fixed inset-0 z-0">
        <TronGrid />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto p-8">
        <TronHud
          title="System Collapse Dashboard"
          subtitle="Monitoring entropy and system stability"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TronDataCard
              title="System Entropy"
              value="42%"
              label="Stability Index"
              status="warning"
            />
            <TronDataCard
              title="Active Patterns"
              value="1,337"
              label="Emergent Behaviours"
              status="success"
            />
            <TronDataCard
              title="Time to Collapse"
              value="00:15:42"
              label="Countdown"
              status="critical"
            />
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={() => setTheme('ares')}>Ares</Button>
            <Button onClick={() => setTheme('tron')}>Tron</Button>
            <Button onClick={() => setTheme('clu')}>Clu</Button>
            <Button onClick={() => setTheme('athena')}>Athena</Button>
          </div>
        </TronHud>
      </div>
    </main>
  )
}
```

### Step 4: Run Your Project

```bash
bun run dev
```

Visit `http://localhost:3000` to see your Tron-themed dashboard!

## 🎨 Available Themes

The Grid includes 6 unique color schemes:

1. **Ares** (Red) - God of War - Default theme
2. **Tron** (Cyan) - The User - Classic Tron blue
3. **Clu** (Orange) - The Program - Villain aesthetic
4. **Athena** (Gold) - Goddess of Wisdom - Golden glow
5. **Aphrodite** (Pink) - Goddess of Love - Magenta accent
6. **Poseidon** (Blue) - God of the Sea - Deep blue

Switch themes using:

```typescript
const { theme, setTheme } = useTheme();
setTheme("tron"); // or 'ares', 'clu', 'athena', 'aphrodite', 'poseidon'
```

## 🎯 Hackathon Dashboard Ideas

Based on the "System Collapse" theme, here are some implementation ideas:

### 1. Entropy Visualizer

- Use `TronHud` for the main container
- `TronDataCard` for metrics that "drift" over time
- `TronGrid` (3D) as animated background that glitches
- `Scanlines` effect that intensifies with entropy

### 2. Pattern Evolution Display

- `TronCinematicHud` for immersive full-screen view
- `TronMap` showing network/cellular automata
- `TronTimer` counting down to next "collapse event"
- `CircuitBackground` that mutates patterns

### 3. Interactive Control Panel

- `Button` components that trigger "collapse"
- `TronStatusBar` showing system health
- `Progress` bars that behave unpredictably
- `TronAlert` for critical system events

## 📚 Component Reference

### Tron UI Components

- `TronHud` - Main HUD container
- `TronCinematicHud` - Full-screen immersive HUD
- `TronDataCard` - Data display cards
- `TronStatusBar` - Status indicators
- `TronTimer` - Countdown/timer
- `TronMap` - Grid map visualization
- `TronMovieUI` - Complete movie UI toolkit
- `TronThemeDossier` - Theme selector
- `TronVideoPlayer` - Video player
- `TronAlert` - Alert notifications

### 3D Components (Three.js)

- `TronGrid` - Interactive 3D grid
- `TronTunnel` - 3D tunnel effect
- `TronGodAvatar` - 3D avatar with themes

### Effects

- `Scanlines` - CRT scanline effect
- `GlowContainer` - Neon glow wrapper
- `CircuitBackground` - Circuit patterns
- `GridFloor` - Grid floor pattern

### Core UI

- `Button`, `Card`, `Input`, `Badge`, `Alert`, `Separator`, `Progress`, `Tabs`

All with Tron styling!

## 🐛 Troubleshooting

### Components not styled correctly?

Make sure you've imported the Tron globals.css in your layout.

### Theme not changing?

Check that ThemeProvider wraps your app and the inline script is in the `<head>`.

### 3D components not rendering?

Ensure Three.js dependencies are installed:

```bash
bun add three @react-three/fiber @react-three/drei
```

## 🎉 You're Ready!

Start building your hackathon project using The Grid's Tron-inspired components. Good luck with "System Collapse"! 🚀
