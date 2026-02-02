"use client";

import { useSystemState } from "@/hooks/use-system-state";
import { TronGrid3D } from "@/components/tron-grid";
import { EntropyMeter } from "@/components/entropy-meter";
import { MetricCard } from "@/components/metric-card";
import { EventLog } from "@/components/event-log";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Scanlines } from "@/components/scanlines";
import { useTheme, themes } from "@/components/theme";
import { Separator } from "@/components/separator";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { state, collapse, injectEntropy, spawnPattern } = useSystemState();
  const { theme, setTheme } = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds %  60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isNearCollapse = state.collapseCountdown < 10 || state.entropy > 90;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* 3D Grid Background - Gets more intense with entropy */}
      <div className="fixed inset-0 z-0" style={{ opacity: 0.3 + (state.entropy / 200) }}>
        <TronGrid3D
          enableParticles={state.entropy > 30}
          enableBeams={state.entropy > 50}
          cameraAnimation={true}
        />
      </div>

      {/* Scanline effect - intensity increases with entropy */}
      <Scanlines intensity={0.2 + (state.entropy / 500)} />

      {/* Flash warning on near collapse */}
      {isNearCollapse && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-pulse border-4 border-destructive" />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className={cn(
          "border-b border-primary/30 bg-background/80 backdrop-blur-sm transition-all",
          isNearCollapse && "border-destructive/50 bg-destructive/5"
        )}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={cn(
                  "font-display text-3xl font-bold tracking-wider md:text-4xl transition-colors",
                  isNearCollapse ? "text-destructive glitch-text" : "text-primary"
                )}>
                  SYSTEM ENTROPY VISUALIZER
                </h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {isNearCollapse
                    ? "⚠️  CRITICAL STATE - COLLAPSE IMMINENT"
                    : "Exploring the Edge Between Order and Chaos"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display text-xs text-muted-foreground">
                  EVOLUTION CYCLE
                </span>
                <span className="font-display text-2xl font-bold text-primary">
                  {state.evolutionCycle.toString().padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Critical Info Bar */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Entropy Meter */}
            <Card className={cn(
              "border-primary/30 bg-card/80 p-4 backdrop-blur-sm transition-all",
              state.entropy > 75 && "border-destructive/50 bg-destructive/5"
            )}>
              <EntropyMeter
                value={state.entropy}
                glitchIntensity={state.glitchIntensity}
              />
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                💡 Entropy grows over time. Interact to speed it up!
              </p>
            </Card>

            {/* Collapse Countdown */}
            <Card className={cn(
              "border-primary/30 bg-card/80 p-4 backdrop-blur-sm transition-all",
              state.collapseCountdown < 10 && "border-destructive/50 bg-destructive/10 animate-pulse"
            )}>
              <div className="space-y-2">
                <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                  Time Until Collapse
                </span>
                <div className={cn(
                  "font-display text-4xl font-bold tabular-nums transition-colors",
                  state.collapseCountdown < 10 ? "text-destructive" : "text-primary"
                )}>
                  {formatTime(state.collapseCountdown)}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      state.collapseCountdown < 10
                        ? "bg-destructive animate-ping"
                        : "bg-primary animate-pulse"
                    }`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {state.collapseCountdown < 10 ? "IMMINENT" : "STABLE"}
                  </span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                ⏱️  System resets at 60s OR when entropy hits 100%
              </p>
            </Card>

            {/* Pattern Count */}
            <Card className="border-primary/30 bg-card/80 p-4 backdrop-blur-sm">
              <div className="space-y-2">
                <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                  Emergent Patterns
                </span>
                <div className="font-display text-4xl font-bold tabular-nums text-chart-2">
                  {state.patterns.length}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2 animate-ping" />
                  <span className="font-mono text-xs text-muted-foreground">
                    SPAWNING
                  </span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                ✨ Patterns = emergent behavior from simple rules
              </p>
            </Card>
          </div>

          {/* Control Panel */}
          <Card className="border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
            <h2 className="mb-4 font-display text-lg font-bold tracking-wider text-primary">
              INTERACTION CONTROLS
              <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                [ Click to Inject Chaos ]
              </span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Button
                onClick={collapse}
                variant="default"
                className="h-auto flex-col items-start gap-1 font-mono"
              >
                <span className="text-sm">🌀 Manual Collapse</span>
                <span className="text-[10px] text-primary-foreground/70">
                  Force immediate reset
                </span>
              </Button>
              <Button
                onClick={() => injectEntropy(10)}
                variant="outline"
                className="h-auto flex-col items-start gap-1 font-mono"
              >
                <span className="text-sm">⚡ Inject Entropy (+10)</span>
                <span className="text-[10px] text-muted-foreground">
                  Speed up instability
                </span>
              </Button>
              <Button
                onClick={spawnPattern}
                variant="outline"
                className="h-auto flex-col items-start gap-1 font-mono"
              >
                <span className="text-sm">✨ Spawn Pattern</span>
                <span className="text-[10px] text-muted-foreground">
                  Create emergence
                </span>
              </Button>
            </div>

            <div className="mt-4 rounded border border-primary/20 bg-primary/5 p-3">
              <p className="font-mono text-xs leading-relaxed text-foreground/80">
                <strong className="text-primary">💡 How It Works:</strong> This dashboard demonstrates the "System Collapse" theme.
                Entropy grows naturally, you can accelerate it by clicking. Metrics drift and influence each other (feedback loops).
                Patterns spawn probabilistically (emergent behavior). When entropy hits 100% OR time runs out, the system collapses
                and resets into a NEW random state. Each cycle is unique!
              </p>
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Metrics (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-xl font-bold tracking-wider text-primary">
                SYSTEM METRICS
                <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
                  [ Mutating Data - Click to Inject Entropy ]
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {state.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    metric={metric}
                    entropy={state.entropy}
                    glitchIntensity={state.glitchIntensity}
                    onClick={() => {
                      injectEntropy(5);
                    }}
                  />
                ))}
              </div>
              <div className="rounded border border-chart-2/30 bg-chart-2/5 p-3">
                <p className="font-mono text-xs text-foreground/80">
                  📊 <strong className="text-chart-2">Feedback Loops:</strong> These metrics drift over time AND influence each other.
                  Stability ↓ as entropy ↑. Patterns = Active Pattern count. Load ↑ when more patterns exist. Click any card to inject +5 entropy!
                </p>
              </div>
            </div>

            {/* Right: Event Log */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold tracking-wider text-primary">
                LIVE EVENTS
              </h2>
              <EventLog
                entropy={state.entropy}
                patternsCount={state.patterns.length}
                cycle={state.evolutionCycle}
              />
              <div className="rounded border border-destructive/30 bg-destructive/5 p-3">
                <p className="font-mono text-xs text-foreground/80">
                  📡 <strong className="text-destructive">Event Log:</strong> Watch the system evolve in real-time!
                  This shows collapse events, pattern spawns, and entropy milestones as they happen.
                </p>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <Card className="border-primary/30 bg-card/80 p-6 backdrop-blur-sm">
            <h2 className="mb-4 font-display text-xl font-bold tracking-wider text-primary">
              VISUAL THEME
              <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
                [ God/Program Identity ]
              </span>
            </h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "group relative rounded border p-4 transition-all",
                    theme === t.id
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border hover:border-primary/50 hover:scale-105"
                  )}
                >
                  <div
                    className="mb-2 h-8 w-8 rounded-full mx-auto transition-all"
                    style={{
                      backgroundColor: t.color,
                      boxShadow: theme === t.id ? `0 0 20px ${t.color}, 0 0 40px ${t.color}40` : "none",
                    }}
                  />
                  <div className="font-mono text-xs font-bold">{t.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {t.god}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 rounded border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="font-display text-sm font-bold text-primary">
              [ HACKATHON PROJECT • "SYSTEM COLLAPSE" THEME ]
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
              This dashboard implements ALL required mechanics: 
              <span className="text-chart-2"> Feedback Loops</span> (metrics influence each other) • 
              <span className="text-chart-3"> Entropy Visuals</span> (progressive decay) • 
              <span className="text-primary"> Emergent Behavior</span> (patterns spawn unpredictably) • 
              <span className="text-destructive"> Collapse Events</span> (system resets) • 
              <span className="text-chart-2"> Adaptive Rules</span> (UI adapts to state)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
