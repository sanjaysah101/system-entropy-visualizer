"use client";

import { Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import type { Pattern } from "@/hooks/use-system-state";
import { cn } from "@/lib/utils";

interface PatternMemoryProps {
  patterns: Pattern[];
  entropy: number;
}

export function PatternMemory({ patterns }: PatternMemoryProps) {
  const activePatterns = patterns.filter((p) => p.age < p.lifespan);
  const recentlyDied = patterns.filter(
    (p) => p.age >= p.lifespan && p.age < p.lifespan + 2,
  );

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="font-display text-sm tracking-widest text-primary uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pattern Matrix</span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground">
            {activePatterns.length} ACTIVE
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-1 overflow-hidden flex flex-col">
        {patterns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground font-mono text-[10px] space-y-2">
              <Zap className="h-6 w-6 mx-auto opacity-20" />
              <div>NO PATTERNS DETECTED</div>
              <div className="text-[8px] opacity-50">SPAWN ENTITY TO BEGIN</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {/* Active Patterns */}
            {activePatterns.map((pattern) => {
              const lifePercent = (pattern.age / pattern.lifespan) * 100;
              const isOld = lifePercent > 70;

              return (
                <div
                  key={pattern.id}
                  className={cn(
                    "relative border rounded p-2.5 transition-all duration-300",
                    isOld
                      ? "border-amber-500/40 bg-amber-500/5 animate-pulse"
                      : "border-primary/20 bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-foreground">
                        PATTERN #
                        {pattern.id.split("-")[1].substring(0, 6).toUpperCase()}
                      </span>
                      <span className="font-mono text-[8px] text-muted-foreground/60 uppercase">
                        Type: {pattern.type} | Load: {pattern.load.toFixed(1)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "font-mono text-[9px] tabular-nums px-1.5 py-0.5 rounded",
                        isOld
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-primary/20 text-primary",
                      )}
                    >
                      {lifePercent.toFixed(0)}%
                    </div>
                  </div>

                  {/* Life bar */}
                  <div className="h-1 bg-background/40 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        isOld
                          ? "bg-linear-to-r from-amber-500 to-destructive"
                          : "bg-linear-to-r from-primary to-chart-2",
                      )}
                      style={{ width: `${lifePercent}%` }}
                    />
                  </div>

                  {/* Glitch effect for dying patterns */}
                  {isOld && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-px bg-destructive/50 animate-pulse" />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-px bg-destructive/50 animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Recently Died Patterns (Ghost Traces) */}
            {recentlyDied.map((pattern) => (
              <div
                key={`ghost-${pattern.id}`}
                className="relative border border-destructive/20 rounded p-2.5 bg-destructive/5 opacity-40 grayscale"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-muted-foreground line-through">
                    PATTERN #
                    {pattern.id.split("-")[1].substring(0, 6).toUpperCase()}
                  </span>
                  <span className="font-mono text-[8px] text-destructive uppercase">
                    COLLAPSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-3 pt-3 border-t border-primary/10 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="font-mono text-[8px] text-muted-foreground uppercase">
              Spawned
            </div>
            <div className="font-display text-sm font-bold text-primary">
              {patterns.length}
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[8px] text-muted-foreground uppercase">
              Active
            </div>
            <div className="font-display text-sm font-bold text-chart-2">
              {activePatterns.length}
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[8px] text-muted-foreground uppercase">
              Died
            </div>
            <div className="font-display text-sm font-bold text-destructive">
              {patterns.length - activePatterns.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
