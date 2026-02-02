"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CollapseHistoryProps {
  cycle: number;
  entropy: number;
}

interface CollapseRecord {
  cycle: number;
  timestamp: number;
  peakEntropy: number;
}

export function CollapseHistory({ cycle, entropy }: CollapseHistoryProps) {
  const [history, setHistory] = useState<CollapseRecord[]>([]);
  const [peakEntropy, setPeakEntropy] = useState(0);

  useEffect(() => {
    setPeakEntropy(prev => Math.max(prev, entropy));
  }, [entropy]);

  useEffect(() => {
    if (cycle > 0) {
      setHistory(prev => {
        const newRecord: CollapseRecord = {
          cycle: cycle - 1,
          timestamp: Date.now(),
          peakEntropy: peakEntropy
        };
        const updated = [...prev, newRecord].slice(-10); // Keep last 10
        return updated;
      });
      setPeakEntropy(0);
    }
  }, [cycle, peakEntropy]);

  const avgEntropy = history.length > 0 
    ? history.reduce((sum, r) => sum + r.peakEntropy, 0) / history.length 
    : 0;

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="font-display text-sm tracking-widest text-primary uppercase flex items-center justify-between">
          <span>Evolution History</span>
          <span className="font-mono text-[9px] text-muted-foreground">
            {history.length} CYCLES RECORDED
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-mono text-[10px]">
            NO COLLAPSE EVENTS YET
          </div>
        ) : (
          <div className="space-y-3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-primary/10 rounded p-2 bg-primary/5">
                <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
                  Avg Peak Entropy
                </div>
                <div className="font-display text-lg font-bold text-primary">
                  {avgEntropy.toFixed(1)}%
                </div>
              </div>
              <div className="border border-primary/10 rounded p-2 bg-primary/5">
                <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
                  Total Collapses
                </div>
                <div className="font-display text-lg font-bold text-chart-2">
                  {history.length}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
              {[...history].reverse().map((record, idx) => (
                <div
                  key={record.cycle}
                  className={cn(
                    "flex items-center justify-between p-2 rounded border transition-all",
                    idx === 0 
                      ? "border-primary/40 bg-primary/10" 
                      : "border-primary/10 bg-background/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      idx === 0 ? "bg-primary animate-pulse" : "bg-primary/40"
                    )} />
                    <span className="font-mono text-[10px] text-foreground">
                      CYCLE {record.cycle.toString().padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-[9px] text-muted-foreground">
                      {record.peakEntropy.toFixed(1)}%
                    </div>
                    <div 
                      className="h-1.5 rounded-full bg-linear-to-r from-primary/20 to-destructive/60"
                      style={{ width: `${Math.max(20, record.peakEntropy * 0.4)}px` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
