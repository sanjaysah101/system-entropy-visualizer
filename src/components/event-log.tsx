"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/card";
import { cn } from "@/lib/utils";

interface SystemEvent {
  id: string;
  time: string;
  type: "collapse" | "pattern" | "entropy" | "metric" | "warning";
  message: string;
}

interface EventLogProps {
  entropy: number;
  patternsCount: number;
  cycle: number;
  className?: string;
}

export function EventLog({ entropy, patternsCount, cycle, className }: EventLogProps) {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const prevEntropy = useRef(entropy);
  const prevPatterns = useRef(patternsCount);
  const prevCycle = useRef(cycle);

  useEffect(() => {
    const newEvents: SystemEvent[] = [];

    // Detect cycle change (collapse)
    if (cycle > prevCycle.current) {
      newEvents.push({
        id: `collapse-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        type: "collapse",
        message: `🌀 SYSTEM COLLAPSE! Resetting to new state (Cycle ${cycle})`,
      });
    }

    // Detect entropy milestones
    if (Math.floor(entropy / 25) > Math.floor(prevEntropy.current / 25)) {
      if (entropy >= 75) {
        newEvents.push({
          id: `entropy-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          type: "warning",
          message: `⚠️  Critical entropy reached: ${entropy.toFixed(1)}% - Collapse imminent!`,
        });
      } else if (entropy >= 50) {
        newEvents.push({
          id: `entropy-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          type: "entropy",
          message: `📈 Entropy increasing: ${entropy.toFixed(1)}% - System becoming unstable`,
        });
      }
    }

    // Detect pattern spawns
    if (patternsCount > prevPatterns.current) {
      newEvents.push({
        id: `pattern-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        type: "pattern",
        message: `✨ New pattern emerged! Total patterns: ${patternsCount}`,
      });
    }

    if (newEvents.length > 0) {
      setEvents((prev) => [...newEvents, ...prev].slice(0, 10)); // Keep last 10 events
    }

    prevEntropy.current = entropy;
    prevPatterns.current = patternsCount;
    prevCycle.current = cycle;
  }, [entropy, patternsCount, cycle]);

  const getEventColor = (type: SystemEvent["type"]) => {
    switch (type) {
      case "collapse": return "text-destructive";
      case "warning": return "text-chart-3";
      case "pattern": return "text-chart-2";
      case "entropy": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("border-primary/30 bg-card/60 backdrop-blur-sm p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold tracking-wider text-primary">
          SYSTEM EVENT LOG
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          [ LIVE FEED ]
        </span>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
        {events.length === 0 && (
          <div className="py-8 text-center font-mono text-xs text-muted-foreground">
            Monitoring system... No events yet.
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-2 rounded border border-border/50 bg-background/40 p-2 text-xs transition-all hover:border-primary/50"
          >
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">
              {event.time}
            </span>
            <span className={cn("font-mono leading-tight", getEventColor(event.type))}>
              {event.message}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
