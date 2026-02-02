"use client";

import { Card } from "@/components/card";
import { cn } from "@/lib/utils";
import type { Metric } from "@/hooks/use-system-state";

interface MetricCardProps {
  metric: Metric;
  entropy: number;
  glitchIntensity: number;
  onClick?: () => void;
}

export function MetricCard({ metric, entropy, glitchIntensity, onClick }: MetricCardProps) {
  const value = metric.value;
  const isDrifting = Math.abs(metric.drift) > 0.05;
  const isVolatile = entropy > 50;

  // Color based on type and value
  const getColor = () => {
    if (metric.id === "stability" && value < 50) return "hsl(var(--destructive))";
    if (metric.id === "patterns" && value > 80) return "hsl(var(--chart-3))";
    if (metric.id === "coherence" && value < 70) return "hsl(var(--chart-3))";  
    if (metric.id === "load" && value > 60) return "hsl(var(--destructive))";
    return "hsl(var(--primary))";
  };

  const color = getColor();

  const glitchStyle = glitchIntensity > 0.5 ? {
    animation: `drift ${2 / glitchIntensity}s infinite`,
    filter: `hue-rotate(${glitchIntensity * 30}deg)`,
  } : {};

  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden border p-4 transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg",
        isVolatile && "animate-pulse",
      )}
      onClick={onClick}
      style={glitchStyle}
    >
      {/* Corner brackets */}
      <div
        className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2"
        style={{ borderColor: color }}
      />
      <div
        className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2"
        style={{ borderColor: color }}
      />

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {metric.label}
          </span>
          {isDrifting && (
            <span className={cn(
              "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
              metric.drift > 0 ? "bg-chart-2/20 text-chart-2" : "bg-destructive/20 text-destructive"
            )}>
              {metric.drift > 0 ? "↑" : "↓"}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-3xl font-bold tabular-nums transition-colors"
            style={{ color }}
          >
            {value.toFixed(1)}
          </span>
          {metric.id === "patterns" && (
            <span className="font-mono text-sm text-muted-foreground">
              active
            </span>
          )}
          {metric.id !== "patterns" && (
            <span className="font-mono text-sm text-muted-foreground">
              %
            </span>
          )}
        </div>

        {/* Volatility indicator */}
        {isVolatile && (
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 animate-ping rounded-full bg-primary" />
            <span className="font-mono text-[10px] text-primary">
              VOLATILE
            </span>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 group-active:opacity-20"
        style={{ backgroundColor: color }}
      />
    </Card>
  );
}
