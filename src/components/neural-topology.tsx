"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme";
import type { SystemState } from "@/hooks/use-system-state";
import { cn } from "@/lib/utils";

interface NeuralTopologyProps {
  state: SystemState;
  onNodeClick?: (id: string, type: "metric" | "pattern") => void;
  className?: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "core" | "metric" | "pattern";
  color: string;
  label?: string;
  targetX?: number; // For metrics
  targetY?: number; // For metrics
}

export function NeuralTopology({
  state,
  onNodeClick,
  className,
}: NeuralTopologyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, distinct: false });
  const { theme } = useTheme();

  // Initialize Core and Metric Nodes
  useEffect(() => {
    if (nodesRef.current.length === 0) {
      // Core Node
      nodesRef.current.push({
        id: "core",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 20,
        type: "core",
        color: "#ffffff",
        label: "CORE",
      });

      // Metric Nodes (fixed targets)
      state.metrics.forEach((m, i) => {
        const angle = (i / state.metrics.length) * Math.PI * 2;
        nodesRef.current.push({
          id: m.id,
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100,
          targetX: Math.cos(angle) * 100,
          targetY: Math.sin(angle) * 100,
          vx: 0,
          vy: 0,
          radius: 8,
          type: "metric",
          color: "#00ff00", // Will be dynamic
          label: m.label,
        });
      });
    }
  }, [
    // Metric Nodes (fixed targets)
    state.metrics.forEach,
    state.metrics.length,
  ]); // Only init once

  // Sync state patterns to nodes
  useEffect(() => {
    const currentNodes = nodesRef.current;
    const patternNodes = currentNodes.filter((n) => n.type === "pattern");
    const existingIds = new Set(patternNodes.map((n) => n.id));

    // Add new patterns
    state.patterns.forEach((p) => {
      if (!existingIds.has(p.id)) {
        currentNodes.push({
          id: p.id,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 3 + p.load,
          type: "pattern",
          color:
            p.type === "ANOMALY"
              ? "#ef4444"
              : p.type === "SURGE"
                ? "#eab308"
                : "#3b82f6",
          label: p.type,
        });
      }
    });

    // Remove old patterns
    const statePatternIds = new Set(state.patterns.map((p) => p.id));
    nodesRef.current = currentNodes.filter(
      (n) =>
        n.type !== "pattern" || statePatternIds.has(n.id) || n.radius <= 0.5, // Keep fading ones for a bit?
    );
  }, [state.patterns]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let iframeId: number;

    const render = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const centerX = width / 2;
      const centerY = height / 2;
      const entropyFactor = state.entropy / 100;
      const jitter = entropyFactor * 5;

      // Clear
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trail effect
      ctx.fillRect(0, 0, width, height);

      // Core pulsing
      const core = nodesRef.current.find((n) => n.type === "core");
      if (core) {
        core.radius = 20 + Math.sin(Date.now() / 200) * 5 * entropyFactor + 5;
        core.color =
          state.entropy > 80
            ? "#ef4444"
            : theme === "tron"
              ? "#00d4ff"
              : "#ffffff";
      }

      // Physics & Draw
      nodesRef.current.forEach((node, _i) => {
        // 1. Forces
        // Return to target (for metrics)
        if (
          node.type === "metric" &&
          node.targetX !== undefined &&
          node.targetY !== undefined
        ) {
          const k = 0.05; // spring constant
          const ax = (node.targetX - node.x) * k;
          const ay = (node.targetY - node.y) * k;
          node.vx += ax;
          node.vy += ay;
        }

        // Repulsion from Mouse
        if (mouseRef.current.distinct) {
          const dx = node.x + centerX - mouseRef.current.x;
          const dy = node.y + centerY - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            node.vx += (dx / dist) * force * 5;
            node.vy += (dy / dist) * force * 5;
          }
        }

        // Repulsion from Core
        if (node.type !== "core") {
          const dx = node.x;
          const dy = node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            node.vx += (dx / dist) * 1;
            node.vy += (dy / dist) * 1;
          }
        }

        // Brownian Motion / Entropy Jitter
        node.vx += (Math.random() - 0.5) * jitter;
        node.vy += (Math.random() - 0.5) * jitter;

        // Friction
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Update Position
        node.x += node.vx;
        node.y += node.vy;

        // Draw Connections (Metric to Core)
        if (node.type === "metric") {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + entropyFactor * 0.5})`;
          ctx.lineWidth = 1;
          // Glitchy lines
          const glitchX = (Math.random() - 0.5) * jitter * 2;
          const glitchY = (Math.random() - 0.5) * jitter * 2;
          ctx.moveTo(centerX + node.x + glitchX, centerY + node.y + glitchY);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();

          // Text Label
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "10px monospace";
          ctx.fillText(
            node.label || "",
            centerX + node.x + 10,
            centerY + node.y,
          );
        }

        // Draw Connections (Pattern to nearest Metric)
        if (node.type === "pattern") {
          // Simply connect to core for chaos look, or find nearest metric?
          // Let's connect to random metric for "network" look
          const metric = nodesRef.current.find((n) => n.type === "metric"); // Just grab first for speed or random
          if (metric) {
            ctx.beginPath();
            ctx.strokeStyle = node.color;
            ctx.globalAlpha = 0.2;
            ctx.moveTo(centerX + node.x, centerY + node.y);
            ctx.lineTo(centerX + metric.x, centerY + metric.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Draw Node
        ctx.beginPath();
        const drawX =
          centerX +
          node.x +
          (Math.random() - 0.5) * (state.glitchIntensity * 2);
        const drawY =
          centerY +
          node.y +
          (Math.random() - 0.5) * (state.glitchIntensity * 2);

        ctx.arc(drawX, drawY, node.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          node.type === "metric"
            ? state.entropy > 50
              ? "#eab308"
              : "#22c55e"
            : node.color;

        // Critical override
        if (state.entropy > 90) ctx.fillStyle = "#ef4444";

        ctx.fill();

        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      iframeId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(iframeId);
  }, [state, theme]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      distinct: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.distinct = false;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-black/20",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <h4 className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest">
          Neural Topology
        </h4>
        <div className="text-[9px] text-primary/50">
          INTERACTIVE :: MUTATING
        </div>
      </div>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
