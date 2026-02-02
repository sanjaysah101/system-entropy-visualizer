"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/progress";

interface EntropyMeterProps {
  value: number; // 0-100
  glitchIntensity?: number; // 0-1
}

export function EntropyMeter({ value, glitchIntensity = 0 }: EntropyMeterProps) {
  const level = value / 100;
  const status =
    level < 0.5 ? "stable" : level < 0.75 ? "warning" : "critical";

  const statusColors = {
    stable: "hsl(var(--chart-2))",
    warning: "hsl(var(--chart-3))",
    critical: "hsl(var(--destructive))",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          System Entropy
        </span>
        <span
          className={cn(
            "font-mono text-lg font-bold tabular-nums transition-all",
            glitchIntensity > 0.3 && "glitch-text"
          )}
          style={{ color: statusColors[status] }}
        >
          {value.toFixed(1)}%
        </span>
      </div>

      <div className="relative">
        <Progress 
          value={value} 
          className="h-4"
          style={{
            //@ts-ignore
            "--progress-background": statusColors[status],
          }}
        />
        
        {/* Pulsing indicator for high entropy */}
        {level > 0.7 && (
          <div
            className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full animate-pulse"
            style={{ backgroundColor: statusColors[status] }}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === "stable" && "bg-chart-2 animate-pulse",
          status === "warning" && "bg-chart-3 animate-pulse",
          status === "critical" && "bg-destructive animate-pulse"
        )} />
        <span className="font-mono text-xs text-muted-foreground">
          {status === "stable" && "SYSTEM STABLE"}
          {status === "warning" && "APPROACHING INSTABILITY"}
          {status === "critical" && "COLLAPSE IMMINENT"}
        </span>
      </div>
    </div>
  );
}
