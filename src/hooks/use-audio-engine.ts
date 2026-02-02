"use client";

import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

interface AudioEngineProps {
  entropy: number;
  isNearCollapse: boolean;
}

export function useAudioEngine({ entropy, isNearCollapse }: AudioEngineProps) {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const droneRef = useRef<Tone.Oscillator | null>(null);
  const noiseRef = useRef<Tone.Noise | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const isStartedRef = useRef(false);

  const startAudio = useCallback(async () => {
    if (isStartedRef.current) return;
    
    await Tone.start();
    
    // Create FX chain
    reverbRef.current = new Tone.Reverb(2).toDestination();
    filterRef.current = new Tone.Filter(1000, "lowpass").connect(reverbRef.current);
    
    // Background Drone
    droneRef.current = new Tone.Oscillator(40, "sine").connect(filterRef.current).start();
    droneRef.current.volume.value = -25;
    
    // Noise for glitchiness
    noiseRef.current = new Tone.Noise("white").connect(filterRef.current).start();
    noiseRef.current.volume.value = -100; // Start silent
    
    // PolySynth for alerts
    synthRef.current = new Tone.PolySynth(Tone.Synth).connect(filterRef.current);
    synthRef.current.volume.value = -15;

    isStartedRef.current = true;
    console.log("🔊 AUDIO ENGINE STARTED");
  }, []);

  // Update audio based on entropy
  useEffect(() => {
    if (!isStartedRef.current || !droneRef.current || !filterRef.current || !noiseRef.current) return;

    // Map entropy to drone frequency (it gets higher/more tense)
    const baseFreq = 40 + (entropy / 100) * 80;
    droneRef.current.frequency.rampTo(baseFreq, 0.1);
    
    // Map entropy to filter cutoff (it gets sharper/more chaotic)
    const filterFreq = 500 + (entropy / 100) * 5000;
    filterRef.current.frequency.rampTo(filterFreq, 0.1);
    
    // Map entropy to noise volume (more static as entropy grows)
    const noiseVol = -100 + (entropy / 100) * 85; 
    noiseRef.current.volume.rampTo(noiseVol, 0.2);

    // Near collapse alarm
    if (isNearCollapse && Math.random() < 0.1) {
       synthRef.current?.triggerAttackRelease(["C2", "C3"], "16n");
    }

  }, [entropy, isNearCollapse]);

  const playGlitch = useCallback(() => {
    if (!isStartedRef.current || !synthRef.current) return;
    
    const notes = ["G2", "C3", "G3", "C4"];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    synthRef.current.triggerAttackRelease(randomNote, "32n", undefined, 0.5);
  }, []);

  const playCollapse = useCallback(() => {
    if (!isStartedRef.current) return;
    
    const noiseBurst = new Tone.Noise("pink").toDestination().start();
    noiseBurst.volume.rampTo(-10, 0.1);
    noiseBurst.volume.rampTo(-100, 1.5);
    
    setTimeout(() => noiseBurst.stop().dispose(), 2000);
  }, []);

  return {
    startAudio,
    playGlitch,
    playCollapse,
    isStarted: isStartedRef.current
  };
}
