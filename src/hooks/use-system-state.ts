"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Pattern {
  id: string;
  x: number;
  y: number;
  intensity: number;
  age: number;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  drift: number;
  volatility: number;
}

export interface SystemState {
  entropy: number; // 0-100
  patterns: Pattern[];
  collapseCountdown: number;
  evolutionCycle: number;
  metrics: Metric[];
  glitchIntensity: number;
}

const COLLAPSE_INTERVAL = 60; // seconds
const MAX_ENTROPY = 100;
const ENTROPY_GROWTH_RATE = 0.05; // per frame

export function useSystemState() {
  const [state, setState] = useState<SystemState>({
    entropy: 0,
    patterns: [],
    collapseCountdown: COLLAPSE_INTERVAL,
    evolutionCycle: 0,
    metrics: [
      { id: "stability", label: "System Stability", value: 100, drift: -0.1, volatility: 5 },
      { id: "patterns", label: "Active Patterns", value: 0, drift: 0.2, volatility: 10 },
      { id: "coherence", label: "Data Coherence", value: 95, drift: -0.05, volatility: 3 },
      { id: "load", label: "Processing Load", value: 42, drift: 0.15, volatility: 8 },
    ],
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
      const newEntropy = Math.min(
        MAX_ENTROPY,
        prev.entropy + ENTROPY_GROWTH_RATE * deltaTime * 60
      );

      const newCountdown = Math.max(0, prev.collapseCountdown - deltaTime);

      if (newCountdown === 0 || newEntropy >= MAX_ENTROPY) {
        return triggerCollapse(prev);
      }

      const newMetrics = prev.metrics.map((metric) => {
        let newValue = metric.value + (metric.drift * deltaTime * 60);

        const entropyFactor = newEntropy / 100;
        const randomDrift = (Math.random() - 0.5) * metric.volatility * entropyFactor;
        newValue += randomDrift;

        if (metric.id === "stability") {
          newValue -= newEntropy * 0.1;
        }
        if (metric.id === "patterns") {
          newValue = prev.patterns.length + Math.random() * 10;
        }
        if (metric.id === "load") {
          newValue += (prev.patterns.length * 0.5);
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
          intensity: Math.random() * newEntropy / 100,
          age: 0,
        });
      }

      const activePatterns = newPatterns
        .map((p) => ({ ...p, age: p.age + deltaTime }))
        .filter((p) => p.age < 10);

      const glitchIntensity = Math.pow(newEntropy / 100, 2);

      return {
        ...prev,
        entropy: newEntropy,
        collapseCountdown: newCountdown,
        metrics: newMetrics,
        patterns: activePatterns,
        glitchIntensity,
      };
    });
  }, [triggerCollapse]);

  const collapse = useCallback(() => {
    setState((prev) => triggerCollapse(prev));
  }, [triggerCollapse]);

  const injectEntropy = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      entropy: Math.min(MAX_ENTROPY, prev.entropy + amount),
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
        },
      ],
    }));
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
    injectEntropy,
    spawnPattern,
  };
}
