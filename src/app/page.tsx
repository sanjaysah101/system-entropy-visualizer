"use client";

import { Activity, Hexagon, Plus, Radio, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CollapseHistory } from "@/components/collapse-history";
import { EntropyMeter } from "@/components/entropy-meter";
import { EventLog } from "@/components/event-log";
import { MetricCard } from "@/components/metric-card";
import { PatternMemory } from "@/components/pattern-memory";
import { Scanlines } from "@/components/scanlines";
import { SystemTasks } from "@/components/system-tasks";
import { themes, useTheme } from "@/components/theme";
import {
  TronAnomalyBanner,
  TronHUDCornerFrame,
} from "@/components/tron-cinematic-hud";
import { TronGrid3D } from "@/components/tron-grid";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useSystemState } from "@/hooks/use-system-state";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const {
    state,
    collapse,
    injectEntropy,
    spawnPattern,
    addTask,
    completeTask,
  } = useSystemState();
  const { theme, setTheme } = useTheme();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const audioInitialized = useRef(false);

  const isNearCollapse = state.collapseCountdown < 10 || state.entropy > 90;

  const { startAudio, playGlitch, playCollapse } = useAudioEngine({
    entropy: state.entropy,
    isNearCollapse,
  });

  const lastPatternsCount = useRef(state.patterns.length);
  const lastCycle = useRef(state.evolutionCycle);

  // Auto-start audio on mount
  useEffect(() => {
    if (!audioInitialized.current) {
      const initAudio = async () => {
        try {
          await startAudio();
          audioInitialized.current = true;
          setNeedsInteraction(false);
        } catch {
          console.log("Audio autoplay blocked - user interaction required");
          setIsAudioEnabled(false);
          setNeedsInteraction(true);
        }
      };
      // Small delay to ensure page is loaded
      const timer = setTimeout(initAudio, 500);
      return () => clearTimeout(timer);
    }
  }, [startAudio]);

  useEffect(() => {
    if (state.patterns.length > lastPatternsCount.current) {
      playGlitch();
    }
    lastPatternsCount.current = state.patterns.length;
  }, [state.patterns.length, playGlitch]);

  useEffect(() => {
    if (state.evolutionCycle > lastCycle.current) {
      playCollapse();
    }
    lastCycle.current = state.evolutionCycle;
  }, [state.evolutionCycle, playCollapse]);

  const handleToggleAudio = async () => {
    if (!isAudioEnabled || needsInteraction) {
      await startAudio();
      setIsAudioEnabled(true);
      setNeedsInteraction(false);
      audioInitialized.current = true;
    } else {
      setIsAudioEnabled(false);
    }
  };

  const handleInitialize = async () => {
    await startAudio();
    setIsAudioEnabled(true);
    setNeedsInteraction(false);
    audioInitialized.current = true;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/30">
      {/* 3D Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{ opacity: 0.2 + state.entropy / 300 }}
      >
        <TronGrid3D
          enableParticles={state.entropy > 20}
          enableBeams={state.entropy > 40}
          cameraAnimation={true}
          entropy={state.entropy}
        />
      </div>

      <Scanlines
        intensity={
          state.entropy > 60 ? "heavy" : state.entropy > 30 ? "medium" : "light"
        }
      />

      {/* Initialize Overlay */}
      {needsInteraction && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 border border-primary/20 p-12 bg-black/50 relative overflow-hidden group">
            <TronHUDCornerFrame position="top-left" size={20} />
            <TronHUDCornerFrame position="bottom-right" size={20} />
            <h1 className="font-display text-4xl font-black tracking-[0.2em] text-primary glitch-text text-center glow-text">
              SYSTEM.CORE :: OFFLINE
            </h1>
            <p className="font-mono text-muted-foreground tracking-widest text-xs uppercase max-w-md text-center">
              Audio subsystem requires manual authorization for synchronization.
            </p>
            <Button
              onClick={handleInitialize}
              type="button"
              className="h-14 px-8 text-lg font-bold tracking-[0.2em] border-primary bg-primary/20 hover:bg-primary/40 hover:scale-105 transition-all w-full mt-4"
            >
              INITIALIZE SYSTEM
            </Button>
          </div>
        </div>
      )}

      {/* Near Collapse Banner */}
      {isNearCollapse && !needsInteraction && (
        <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none">
          <div className="bg-background/40 backdrop-blur-xl w-full py-12 border-y-2 border-destructive/50 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <TronAnomalyBanner
              title="SYSTEM COLLAPSE IMMINENT"
              subtitle="CRITICAL ENTROPY THRESHOLD BREACHED"
              className="max-w-4xl"
            />
            <div className="mt-8 flex items-center gap-8 animate-pulse text-destructive font-mono font-black text-2xl">
              <span>
                00:00:
                {state.collapseCountdown
                  .toFixed(2)
                  .split(".")[0]
                  .padStart(2, "0")}
              </span>
              <span>•</span>
              <span>{state.entropy.toFixed(1)}% ENTROPY</span>
            </div>
          </div>
        </div>
      )}

      {isNearCollapse && !needsInteraction && (
        <div className="pointer-events-none fixed inset-0 z-49 animate-pulse border-20 border-destructive/20" />
      )}

      {/* --- SITE HEADER (Status Bar) --- */}
      <header
        className={cn(
          "border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50 h-10 flex items-center justify-between px-6 transition-all",
          isNearCollapse && "border-destructive/50 bg-destructive/10",
        )}
      >
        <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-primary/70">
          <span>OS :: SYSTEM.CORE</span>
          <span className="opacity-30">|</span>
          <span>STATUS: {isNearCollapse ? "UNSTABLE" : "OPERATIONAL"}</span>
          <span className="opacity-30">|</span>
          <span>BUILD: V.2.0.4</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer in header as secondary display */}
          <span
            className={cn(
              "font-mono text-[10px] tracking-widest",
              isNearCollapse ? "text-destructive" : "text-primary/70",
            )}
          >
            OFFSET: {formatTime(state.collapseCountdown)}
          </span>
          <button
            type="button"
            onClick={handleToggleAudio}
            className="text-primary/70 hover:text-primary transition-colors"
          >
            {isAudioEnabled ? (
              <Volume2 className="h-3 w-3" />
            ) : (
              <VolumeX className="h-3 w-3" />
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-col min-h-screen container mx-auto px-4 pb-20">
        {/* --- HERO SECTION --- */}
        <section className="py-20 flex flex-col items-center justify-center relative">
          <div className="text-center space-y-2 z-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-primary/50 animate-pulse">
              System Entropy Visualizer
            </div>
            <h1
              className={cn(
                "font-display text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary via-primary/80 to-transparent transition-all duration-300",
                isNearCollapse &&
                  "from-destructive via-destructive/80 glitch-text",
              )}
            >
              SYSTEM
              <br />
              COLLAPSE
            </h1>
            <div
              className={cn(
                "h-px w-32 bg-primary/50 mx-auto mt-6",
                isNearCollapse && "bg-destructive/50",
              )}
            />
          </div>

          {/* Hero Actions */}
          <div className="mt-12 flex items-center gap-6 z-10">
            <Button
              type="button"
              onClick={collapse}
              variant="destructive"
              className="h-12 px-8 text-xs font-bold tracking-[0.2em] uppercase border-destructive/50 bg-destructive/10 hover:bg-destructive/30 hover:scale-105 transition-all glow-box-destructive"
            >
              FORCE COLLAPSE
            </Button>
            <Button
              type="button"
              onClick={() => injectEntropy(15)}
              variant="outline"
              className="h-12 px-8 text-xs font-bold tracking-[0.2em] uppercase border-primary/50 bg-primary/5 hover:bg-primary/20 hover:scale-105 transition-all text-primary"
            >
              INJECT CHAOS
            </Button>
          </div>

          {/* Hero Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </section>

        {/* --- THEME SELECTION GRID --- */}
        <section className="mb-20">
          <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-8">
            <h2 className="font-display text-lg font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-2">
              <Radio className="h-4 w-4" /> SELECT THEME
            </h2>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              [ VISUAL SCHEMATIC OVERRIDE ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "group relative h-24 border rounded overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left",
                  theme === t.id
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_-5px_var(--primary)]"
                    : "border-primary/10 bg-card/40 hover:border-primary/40",
                )}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="h-full flex items-center px-6 gap-5">
                  {/* Theme Icon/Color */}
                  <div
                    className="h-10 w-10 rounded border flex items-center justify-center shrink-0 transition-all duration-500 overflow-hidden relative"
                    style={{
                      borderColor: t.color,
                      boxShadow:
                        theme === t.id ? `0 0 15px ${t.color}` : "none",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: t.color }}
                    />
                    <Hexagon className="h-5 w-5" style={{ color: t.color }} />
                  </div>

                  {/* Theme Details */}
                  <div className="flex flex-col">
                    <span className="font-display text-2xl font-black uppercase text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {t.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      <span style={{ color: t.color }}>{t.god}</span>
                      <span className="opacity-30">{"//"}</span>
                      <span>{t.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* --- CORE SYSTEMS DASHBOARD --- */}
        <section>
          <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="font-display text-lg font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-2">
                <Activity className="h-4 w-4" /> CORE OPERATIONS
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={spawnPattern}
                className="h-6 text-[9px] border-primary/20 text-primary/70 hover:text-primary hover:border-primary/50 font-mono tracking-widest"
              >
                <Plus className="h-3 w-3 mr-1" /> SPAWN ENTITY
              </Button>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              [ SYSTEM ENTROPY MONITORING ]
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Entropy & Protocols */}
            <div className="lg:col-span-3 space-y-6">
              <Card
                className={cn(
                  "border-primary/20 bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-500",
                  state.entropy > 75 &&
                    "border-destructive/40 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]",
                )}
              >
                <CardHeader className="py-3 border-b border-primary/10">
                  <CardTitle className="font-display text-xs tracking-widest text-primary">
                    ENTROPY.METER
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <EntropyMeter
                    value={state.entropy}
                    glitchIntensity={state.glitchIntensity}
                  />
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase pl-1">
                  System Metrics
                </h3>
                <div className="grid gap-2">
                  {state.metrics.map((metric) => (
                    <MetricCard
                      key={metric.id}
                      metric={metric}
                      entropy={state.entropy}
                      glitchIntensity={state.glitchIntensity}
                      onClick={() => injectEntropy(2)}
                    />
                  ))}
                </div>
              </div>

              <CollapseHistory
                cycle={state.evolutionCycle}
                entropy={state.entropy}
              />
            </div>

            {/* CENTER COLUMN: Anomaly Resolver */}
            <div className="lg:col-span-6 h-full min-h-[500px]">
              <SystemTasks
                tasks={state.tasks}
                onComplete={completeTask}
                onAdd={addTask}
                entropy={state.entropy}
              />
            </div>

            {/* RIGHT COLUMN: Logs & Patterns */}
            <div className="lg:col-span-3 space-y-6 flex flex-col">
              <div className="flex-1 bg-card/40 border border-primary/10 backdrop-blur-md flex flex-col overflow-hidden rounded-lg min-h-[300px]">
                <div className="py-2 px-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-primary uppercase">
                    Active Patterns
                  </span>
                  <span className="font-mono text-[10px] text-primary/70">
                    {state.patterns.length} DETECTED
                  </span>
                </div>
                <div className="flex-1 p-0 overflow-y-auto max-h-[300px] scrollbar-hide">
                  <PatternMemory
                    patterns={state.patterns}
                    entropy={state.entropy}
                  />
                </div>
              </div>

              <div className="flex-1 bg-card/40 border border-primary/10 backdrop-blur-md flex flex-col overflow-hidden rounded-lg min-h-[300px]">
                <div className="py-2 px-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-primary uppercase">
                    Event Log
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span className="w-1 h-1 bg-primary/50 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <EventLog
                    entropy={state.entropy}
                    patternsCount={state.patterns.length}
                    cycle={state.evolutionCycle}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER SECTION --- */}
        <footer className="mt-20 border-t border-primary/10 pt-8 flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <div className="text-center">
              <div className="font-display text-xl font-bold text-primary">
                {state.evolutionCycle}
              </div>
              <div className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
                Cycles Evolved
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl font-bold text-primary">
                {state.patterns.length}
              </div>
              <div className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
                Active Entities
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl font-bold text-destructive">
                {state.tasks.length}
              </div>
              <div className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
                Unresolved Anomalies
              </div>
            </div>
          </div>

          <div className="h-px w-20 bg-primary/20 my-2" />

          <p className="font-mono text-[9px] text-muted-foreground tracking-[0.3em] uppercase opacity-50">
            System Collapse | Hackathon 2026 | Built on The Grid
          </p>
        </footer>
      </div>
    </main>
  );
}
