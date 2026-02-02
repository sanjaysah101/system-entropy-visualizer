"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Pattern {
  id: string;
  x: number;
  y: number;
  intensity: number;
  age: number;
  lifespan: number;
  type: string;
  load: number;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  drift: number;
  volatility: number;
}

export interface Task {
  id: string;
  label: string;
  stability: number; // 0-100
  isCompleted: boolean;
  decayRate: number;
}

export interface SystemState {
  entropy: number; // 0-100
  patterns: Pattern[];
  collapseCountdown: number;
  evolutionCycle: number;
  metrics: Metric[];
  tasks: Task[];
  glitchIntensity: number;
}

const COLLAPSE_INTERVAL = 60; // seconds
const MAX_ENTROPY = 100;
const ENTROPY_GROWTH_RATE = 0; // per frame (Disabled for manual interaction focus)

export function useSystemState() {
  const [state, setState] = useState<SystemState>({
    entropy: 0,
    patterns: [],
    collapseCountdown: COLLAPSE_INTERVAL,
    evolutionCycle: 0,
    metrics: [
      {
        id: "stability",
        label: "System Stability",
        value: 100,
        drift: -0.1,
        volatility: 5,
      },
      {
        id: "patterns",
        label: "Active Patterns",
        value: 0,
        drift: 0.2,
        volatility: 10,
      },
      {
        id: "coherence",
        label: "Data Coherence",
        value: 95,
        drift: -0.05,
        volatility: 3,
      },
      {
        id: "load",
        label: "Processing Load",
        value: 42,
        drift: 0.15,
        volatility: 8,
      },
    ],
    tasks: [],
    glitchIntensity: 0,
  });

  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());

  // Trigger collapse event
  const triggerCollapse = useCallback((prev: SystemState): SystemState => {
    console.log("🌀 COLLAPSE EVENT");

    return {
      entropy: 0,
      collapseCountdown: COLLAPSE_INTERVAL,
      evolutionCycle: prev.evolutionCycle + 1,
      patterns: [],
      tasks: [],
      metrics: prev.metrics.map((m) => ({
        ...m,
        value: Math.random() * 100,
        drift: (Math.random() - 0.5) * 0.3,
      })),
      glitchIntensity: 1,
    };
  }, []);

  // Update system state on every frame
  const updateSystem = useCallback(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;

    setState((prev) => {
      let extraEntropy = 0;

      // Update tasks and calculate entropy impact
      const updatedTasks = prev.tasks
        .map((task) => {
          if (task.isCompleted) return task;

          const newStability = Math.max(
            0,
            task.stability - task.decayRate * deltaTime * 60,
          );

          // If task stability hits 0, it adds entropy
          if (newStability === 0 && task.stability > 0) {
            extraEntropy += 2;
          }

          return { ...task, stability: newStability };
        })
        .filter((task) => {
          // Remove completed tasks after some time or if they are super glitched
          return !task.isCompleted || task.stability > 20;
        });

      // Gradually decay stability of completed tasks too for a "glitch out" effect
      const finalTasks = updatedTasks
        .map((task) => {
          if (task.isCompleted) {
            return {
              ...task,
              stability: Math.max(0, task.stability - 1 * deltaTime * 60),
            };
          }
          return task;
        })
        .filter((task) => task.stability > 0 || !task.isCompleted);

      const newEntropy = Math.min(
        MAX_ENTROPY,
        prev.entropy + ENTROPY_GROWTH_RATE * deltaTime * 60 + extraEntropy,
      );

      const newCountdown = Math.max(0, prev.collapseCountdown - deltaTime);

      if (newCountdown === 0 || newEntropy >= MAX_ENTROPY) {
        return triggerCollapse(prev);
      }

      const newMetrics = prev.metrics.map((metric) => {
        let newValue = metric.value + metric.drift * deltaTime * 60;

        const entropyFactor = newEntropy / 100;
        const randomDrift =
          (Math.random() - 0.5) * metric.volatility * entropyFactor;
        newValue += randomDrift;

        if (metric.id === "stability") {
          newValue -= newEntropy * 0.1;
        }
        if (metric.id === "patterns") {
          newValue = prev.patterns.length + Math.random() * 10;
        }
        if (metric.id === "load") {
          newValue += prev.patterns.length * 0.5 + prev.tasks.length * 0.2;
        }

        newValue = Math.max(0, Math.min(100, newValue));

        return { ...metric, value: newValue };
      });

      const newPatterns = [...prev.patterns];
      if (Math.random() < newEntropy / 1000) {
        newPatterns.push({
          id: `pattern-${Date.now()}-${Math.random()}`,
          x: Math.random(),
          y: Math.random(),
          intensity: (Math.random() * newEntropy) / 100,
          age: 0,
          lifespan: 30 + Math.random() * 50, // 30-80 frames
          type: ["ANOMALY", "SPIKE", "DRIFT", "SURGE"][
            Math.floor(Math.random() * 4)
          ],
          load: 1 + Math.random() * 4, // 1-5 load
        });
      }

      const activePatterns = newPatterns
        .map((p) => ({ ...p, age: p.age + deltaTime }))
        .filter((p) => p.age < 10);

      const glitchIntensity = (newEntropy / 100) ** 2;

      return {
        ...prev,
        entropy: newEntropy,
        collapseCountdown: newCountdown,
        metrics: newMetrics,
        patterns: activePatterns,
        tasks: finalTasks,
        glitchIntensity,
      };
    });
  }, [triggerCollapse]);

  const collapse = useCallback(() => {
    setState((prev) => triggerCollapse(prev));
  }, [triggerCollapse]);

  const injectEntropy = useCallback((amount: number) => {
    // Add randomness to user actions (±20%)
    const variance = 0.8 + Math.random() * 0.4;
    const finalAmount = amount * variance;
    
    setState((prev) => ({
      ...prev,
      entropy: Math.min(MAX_ENTROPY, prev.entropy + finalAmount),
    }));
  }, []);

  const spawnPattern = useCallback(() => {
    setState((prev) => ({
      ...prev,
      patterns: [
        ...prev.patterns,
        {
          id: `pattern-${Date.now()}-${Math.random()}`,
          x: Math.random(),
          y: Math.random(),
          intensity: Math.random(),
          age: 0,
          lifespan: 30 + Math.random() * 50,
          type: ["ANOMALY", "SPIKE", "DRIFT", "SURGE"][
            Math.floor(Math.random() * 4)
          ],
          load: 1 + Math.random() * 4,
        },
      ],
    }));
  }, []);

  const addTask = useCallback((label: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      label,
      stability: 100,
      isCompleted: false,
      decayRate: 0.1 + Math.random() * 0.2,
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      entropy: Math.min(MAX_ENTROPY, prev.entropy + 2), // Adding tasks adds a bit of load/entropy
    }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      if (!task || task.isCompleted) return prev;

      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, isCompleted: true, stability: 100 } : t,
        ),
        entropy: Math.max(0, prev.entropy - 5), // Completing tasks stabilizes system
      };
    });
  }, []);

  useEffect(() => {
    const animate = () => {
      updateSystem();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateSystem]);

  return {
    state,
    collapse,
    reboot: collapse, // For now, reboot is same as collapse (reset)
    injectEntropy,
    spawnPattern,
    addTask,
    completeTask,
  };
}
