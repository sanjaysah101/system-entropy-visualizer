"use client";

import { Check, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/progress";
import type { Task } from "@/hooks/use-system-state";
import { cn } from "@/lib/utils";

interface SystemTasksProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onAdd: (label: string) => void;
  entropy: number;
}

export function SystemTasks({
  tasks,
  onComplete,
  onAdd,
  entropy,
}: SystemTasksProps) {
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const handleAdd = () => {
    if (newTaskLabel.trim()) {
      onAdd(newTaskLabel);
      setNewTaskLabel("");
    }
  };

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-primary/20 pb-4">
        <div className="flex flex-col">
          <CardTitle className="font-display text-xl tracking-wider text-primary">
            ANOMALY RESOLUTION
          </CardTitle>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
            Active Countermeasures
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap
            className={cn(
              "h-4 w-4",
              entropy > 50 ? "text-amber-500 animate-pulse" : "text-primary/40",
            )}
          />
          <span className="font-mono text-[10px] text-muted-foreground">
            {tasks.filter((t) => !t.isCompleted).length} ACTIVE
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Add Task Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Detect new anomaly..."
              className="w-full bg-background/40 border border-primary/20 rounded px-3 py-1.5 font-mono text-[11px] focus:outline-none focus:border-primary/50 text-foreground transition-all focus:bg-background/60"
            />
            <div className="absolute right-2 top-1.5 opacity-30">
              <span className="font-mono text-[8px] text-primary">[⏎]</span>
            </div>
          </div>
          <Button
            disabled={!newTaskLabel.trim()}
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="font-mono text-[10px] h-8 border-primary/30 hover:bg-primary/10 transition-all uppercase tracking-tighter"
          >
            <Plus className="h-3 w-3 mr-1" /> Deploy
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 select-none custom-scrollbar">
          {tasks.length === 0 && (
            <div className="text-center py-12 border border-dashed border-primary/10 rounded-lg bg-primary/2">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary/10" />
              <p className="font-mono text-[10px] text-muted-foreground italic uppercase tracking-widest">
                No active threats detected
              </p>
            </div>
          )}

          {[...tasks].reverse().map((task) => (
            <div
              key={task.id}
              className={cn(
                "group relative border rounded-md p-3 transition-all duration-300 overflow-hidden",
                task.isCompleted
                  ? "border-green-500/20 bg-green-500/5 opacity-60 grayscale-[0.5]"
                  : task.stability < 30
                    ? "border-destructive/40 bg-destructive/10 animate-pulse shadow-[0_0_15px_-5px_rgba(239,68,68,0.4)]"
                    : "border-primary/15 bg-background/20 hover:border-primary/40 hover:bg-background/40",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col max-w-[80%]">
                  <span
                    className={cn(
                      "font-mono text-[11px] font-bold truncate transition-all",
                      task.isCompleted
                        ? "text-green-500 line-through decoration-1"
                        : "text-foreground",
                      task.stability < 30 &&
                        !task.isCompleted &&
                        "glitch-text text-destructive",
                    )}
                  >
                    {task.label}
                  </span>
                  {!task.isCompleted && (
                    <span className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-tighter mt-0.5">
                      {task.id.split("-")[1]}{" "}
                      {/* CID: {Math.random().toString(36).substring(7).toUpperCase()} */}
                    </span>
                  )}
                </div>
                {!task.isCompleted ? (
                  <button
                    type="button"
                    className="h-6 w-6 rounded border border-primary/30 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-500 transition-all group-hover:scale-105 active:scale-95"
                    onClick={() => onComplete(task.id)}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="text-green-500/50">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-muted-foreground/50 tracking-tighter">
                    STRUCTURAL INTEGRITY
                  </span>
                  <span
                    className={cn(
                      "tabular-nums",
                      task.isCompleted
                        ? "text-green-500/80"
                        : task.stability < 30
                          ? "text-destructive font-black animate-pulse"
                          : "text-primary/70",
                    )}
                  >
                    {Math.round(task.stability)}%
                  </span>
                </div>
                <Progress
                  value={task.stability}
                  className="h-1 bg-primary/5 border-[0.5px] border-primary/10"
                  indicatorClassName={cn(
                    task.isCompleted
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                      : task.stability < 30
                        ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "bg-primary/60",
                  )}
                />
              </div>

              {/* Status Tags */}
              {!task.isCompleted && task.stability < 30 && (
                <div className="absolute top-1 right-8 h-px w-8 bg-destructive/50 animate-ping rotate-45" />
              )}

              {/* Animated Scan Line for active tasks */}
              {!task.isCompleted && (
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent h-1 w-full pointer-events-none opacity-20 animate-scan-task" />
              )}
            </div>
          ))}
        </div>

        <div className="rounded border border-primary/10 bg-primary/2 p-3 relative overflow-hidden group/hint">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/30 group-hover/hint:bg-amber-500/60 transition-colors" />
          <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/80 pl-2">
            <span className="text-amber-500 font-bold mr-1">PROTOCOL:</span>
            Unresolved anomalies destabilize core logic. Resolving an anomaly
            initiates a
            <span className="text-primary mx-1">STABILIZATION BURST</span>{" "}
            (-5.0% Entropy). Failure results in{" "}
            <span className="text-destructive mx-1">CASCADING FAILURE</span>{" "}
            (+2.0% Entropy).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
