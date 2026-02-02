"use client";

import { useSystemState } from "@/hooks/use-system-state";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { TronGrid3D } from "@/components/tron-grid";
import { EntropyMeter } from "@/components/entropy-meter";
import { MetricCard } from "@/components/metric-card";
import { EventLog } from "@/components/event-log";
import { Button } from "@/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { Scanlines } from "@/components/scanlines";
import { useTheme, themes } from "@/components/theme";
import { SystemTasks } from "@/components/system-tasks";
import { TronAnomalyBanner, TronHUDCornerFrame } from "@/components/tron-cinematic-hud";
import { CollapseHistory } from "@/components/collapse-history";
import { PatternMemory } from "@/components/pattern-memory";
import { cn } from "@/lib/utils";
import { Zap, Cpu, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const { state, collapse, injectEntropy, spawnPattern, addTask, completeTask } = useSystemState();
  const { theme, setTheme } = useTheme();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const audioInitialized = useRef(false);

  const isNearCollapse = state.collapseCountdown < 10 || state.entropy > 90;

  const { startAudio, playGlitch, playCollapse } = useAudioEngine({
    entropy: state.entropy,
    isNearCollapse
  });

  const lastPatternsCount = useRef(state.patterns.length);
  const lastCycle = useRef(state.evolutionCycle);

  // Auto-start audio on mount
  useEffect(() => {
    if (!audioInitialized.current && isAudioEnabled) {
      const initAudio = async () => {
        try {
          await startAudio();
          audioInitialized.current = true;
        } catch {
          console.log("Audio autoplay blocked - user interaction required");
          setIsAudioEnabled(false);
        }
      };
      // Small delay to ensure page is loaded
      const timer = setTimeout(initAudio, 500);
      return () => clearTimeout(timer);
    }
  }, [startAudio, isAudioEnabled]);

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
    if (!isAudioEnabled) {
      await startAudio();
      setIsAudioEnabled(true);
      audioInitialized.current = true;
    } else {
      setIsAudioEnabled(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds %  60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* 3D Grid Background - Gets more intense with entropy */}
      <div className="fixed inset-0 z-0" style={{ opacity: 0.3 + (state.entropy / 200) }}>
        <TronGrid3D
          enableParticles={state.entropy > 30}
          enableBeams={state.entropy > 50}
          cameraAnimation={true}
          entropy={state.entropy}
        />
      </div>

      {/* Scanline effect - intensity increases with entropy */}
      <Scanlines intensity={state.entropy > 60 ? "heavy" : state.entropy > 30 ? "medium" : "light"} />

      {/* Near Collapse Banner */}
      {isNearCollapse && (
        <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none">
          <div className="bg-background/40 backdrop-blur-xl w-full py-12 border-y-2 border-destructive/50 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <TronAnomalyBanner 
              title="SYSTEM COLLAPSE IMMINENT" 
              subtitle="CRITICAL ENTROPY THRESHOLD BREACHED" 
              className="max-w-4xl"
            />
            <div className="mt-8 flex items-center gap-8 animate-pulse text-destructive font-mono font-black text-2xl">
              <span>00:00:{state.collapseCountdown.toFixed(2).split('.')[0].padStart(2, '0')}</span>
              <span>•</span>
              <span>{state.entropy.toFixed(1)}% ENTROPY</span>
            </div>
          </div>
        </div>
      )}

      {/* Flash warning on near collapse */}
      {isNearCollapse && (
        <div className="pointer-events-none fixed inset-0 z-49 animate-pulse border-20 border-destructive/20" />
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className={cn(
          "border-b border-primary/30 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all",
          isNearCollapse && "border-destructive/50 bg-destructive/10"
        )}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative rounded-full p-2 bg-primary/10 border border-primary/30">
                  <Cpu className={cn("h-6 w-6 text-primary", isNearCollapse && "text-destructive animate-spin-slow")} />
                  {isNearCollapse && (
                    <div className="absolute inset-0 bg-destructive/20 animate-ping rounded-full" />
                  )}
                </div>
                <div>
                  <h1 className={cn(
                    "font-display text-2xl font-black tracking-[0.2em] md:text-3xl transition-colors",
                    isNearCollapse ? "text-destructive glitch-text" : "text-primary"
                  )}>
                    OS :: SYSTEM.CORE
                  </h1>
                  <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    STATUS: {isNearCollapse ? "UNSTABLE" : "OPERATIONAL"} {/* SCTOR: GR-77 LVL: {state.evolutionCycle} */}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded border transition-all hover:bg-primary/10",
                    isAudioEnabled ? "border-primary/50 text-primary" : "border-primary/10 text-muted-foreground"
                  )}
                >
                  {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="font-mono text-[7px] uppercase mt-1">{isAudioEnabled ? "ON" : "OFF"}</span>
                </button>

                <div className="h-10 w-px bg-primary/20" />

                <div className="hidden md:flex flex-col items-end">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-tighter">TEMPORAL OFFSET</span>
                  <span className={cn(
                    "font-display text-xl font-bold tabular-nums",
                    state.collapseCountdown < 10 ? "text-destructive" : "text-primary"
                  )}>
                    {formatTime(state.collapseCountdown)}
                  </span>
                </div>
                <div className="h-10 w-px bg-primary/20 hidden md:block" />
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-tighter">EVOLUTION CYCLE</span>
                  <span className="font-display text-2xl font-black text-chart-2">
                    {state.evolutionCycle.toString().padStart(3, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>


        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-4 space-y-6">
              {/* Entropy Meter */}
              <Card className={cn(
                "relative border-primary/20 bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-700",
                state.entropy > 75 && "border-destructive/40 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]"
              )}>
                <TronHUDCornerFrame position="top-left" size={12} />
                <TronHUDCornerFrame position="bottom-right" size={12} />
                <CardContent className="p-6">
                  <EntropyMeter
                    value={state.entropy}
                    glitchIntensity={state.glitchIntensity}
                  />
                  <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-500" /> PASSIVE ACCELERATION
                    </span>
                    <span className="text-primary font-bold">ACTIVE</span>
                  </div>
                </CardContent>
              </Card>

              {/* Interaction Controls */}
              <Card className="border-primary/10 bg-card/40 backdrop-blur-md relative">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm tracking-widest text-primary flex items-center gap-2">
                    <Zap className="h-3 w-3" /> INTERVENTION PROTOCOLS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <Button
                    onClick={collapse}
                    variant="destructive"
                    className="w-full h-10 font-mono text-[10px] tracking-widest uppercase border-destructive/30 hover:bg-destructive/20"
                  >
                    FORCE COLLAPSE [SHUTDOWN]
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => injectEntropy(10)}
                      variant="outline"
                      className="h-10 font-mono text-[9px] tracking-tighter uppercase border-primary/20 hover:bg-primary/10"
                    >
                      INJECT CHAOS [+10]
                    </Button>
                    <Button
                      onClick={spawnPattern}
                      variant="outline"
                      className="h-10 font-mono text-[9px] tracking-tighter uppercase border-chart-2/20 hover:bg-chart-2/10 text-chart-2"
                    >
                      SPAWN ENTITY
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Collapse History */}
              <CollapseHistory 
                cycle={state.evolutionCycle}
                entropy={state.entropy}
              />

              {/* Pattern Memory */}
              <PatternMemory 
                patterns={state.patterns}
                entropy={state.entropy}
              />
            </div>

            {/* CENTER COLUMN: Anomaly Resolver (4 cols) */}
            <div className="lg:col-span-4 h-full">
              <SystemTasks 
                tasks={state.tasks} 
                onComplete={completeTask} 
                onAdd={addTask} 
                entropy={state.entropy}
              />
            </div>

            {/* RIGHT COLUMN: Live Stream & Metrics (4 cols) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
              <div className="flex-1 min-h-[400px]">
                <Card className="h-full border-primary/10 bg-card/40 backdrop-blur-md flex flex-col overflow-hidden">
                  <CardHeader className="py-3 border-b border-primary/10 flex flex-row items-center justify-between">
                    <CardTitle className="font-display text-sm tracking-widest text-primary uppercase">
                      TELEMETRY STREAM
                    </CardTitle>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-green-500/30 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <EventLog
                      entropy={state.entropy}
                      patternsCount={state.patterns.length}
                      cycle={state.evolutionCycle}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>

          {/* LOWER SECTION: METRIC GRID */}
          <div className="mt-8 space-y-4">
             <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <h2 className="font-display text-lg font-black tracking-[0.3em] text-primary uppercase">
                   CORE SUBSYSTEMS
                </h2>
                <span className="font-mono text-[9px] text-muted-foreground">
                   [ {state.metrics.length} SENSORS DETECTED ]
                </span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>

          {/* THEME SECTOR */}
          <Card className="mt-8 border-primary/10 bg-card/50 backdrop-blur-xl">
            <CardHeader className="py-4 border-b border-primary/10">
              <CardTitle className="font-display text-sm tracking-[0.5em] text-primary text-center">
                VISUAL SCHEMATIC OVERRIDE
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-5xl mx-auto">
                {themes.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "group relative rounded-lg border p-4 transition-all duration-500 overflow-hidden",
                      theme === t.id
                        ? "border-primary bg-primary/15 scale-105 shadow-[0_0_20px_-5px_var(--primary)]"
                        : "border-primary/10 bg-background/20 hover:border-primary/40 hover:scale-105"
                    )}
                  >
                    <div
                      className="mb-3 h-10 w-10 rounded-full mx-auto transition-all duration-700 relative"
                      style={{
                        backgroundColor: t.color,
                        boxShadow: theme === t.id ? `0 0 25px ${t.color}, 0 0 50px ${t.color}40` : "none",
                      }}
                    >
                       {theme === t.id && (
                         <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                       )}
                    </div>
                    <div className="font-mono text-[11px] font-black tracking-widest text-foreground text-center">{t.name}</div>
                    <div className="font-mono text-[8px] text-muted-foreground text-center mt-1 uppercase opacity-50">
                      {t.god}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-8 border-t border-primary/10 bg-background/80 backdrop-blur-md py-6">
           <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col items-center gap-2">
                 <p className="font-display text-[10px] font-black tracking-[0.8em] text-primary/40 uppercase">
                    SYSTEM COLLAPSE | HACKATHON 2026
                 </p>
                 <div className="flex gap-4 font-mono text-[8px] text-muted-foreground uppercase opacity-30">
                    <span>STABLE: FALSE</span>
                    <span>•</span>
                    <span>RANDOM: TRUE</span>
                    <span>•</span>
                    <span>EMERGENCE: ACTIVE</span>
                 </div>
              </div>
           </div>
        </footer>
      </div>
      
    </main>
  );
}

