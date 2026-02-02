"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const melodicSynthRef = useRef<Tone.Synth | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      // Release resources
      droneRef.current?.dispose();
      synthRef.current?.dispose();
      noiseRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
      sequenceRef.current?.dispose();
      melodicSynthRef.current?.dispose();

      // Stop transport
      Tone.Transport.stop();
      Tone.Transport.cancel();
      isStartedRef.current = false;
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (isStartedRef.current) return;

    await Tone.start();

    // Safety check - stop any previous playback
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    // Create FX chain
    reverbRef.current = new Tone.Reverb(2.5).toDestination();
    filterRef.current = new Tone.Filter(800, "lowpass").connect(
      reverbRef.current,
    );

    // Background Drone
    droneRef.current = new Tone.Oscillator(40, "sine")
      .connect(filterRef.current)
      .start();
    droneRef.current.volume.value = -20;

    // Noise for glitchiness
    noiseRef.current = new Tone.Noise("pink")
      .connect(filterRef.current)
      .start();
    noiseRef.current.volume.value = -100; // Start silent

    // PolySynth for alerts
    synthRef.current = new Tone.PolySynth(Tone.Synth).connect(
      filterRef.current,
    );
    synthRef.current.volume.value = -12;

    // Melodic Synth (The "Music")
    melodicSynthRef.current = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 1 },
    }).connect(filterRef.current);
    melodicSynthRef.current.volume.value = -15;

    // Create a loop
    const notes = ["C3", "Eb3", "G3", "Bb3", "C4", "Bb3", "G3", "Eb3"];
    sequenceRef.current = new Tone.Sequence(
      (time, note) => {
        melodicSynthRef.current?.triggerAttackRelease(note, "8n", time);
      },
      notes,
      "8n",
    );

    Tone.Transport.bpm.value = 100;
    sequenceRef.current.start(0);
    Tone.Transport.start();

    isStartedRef.current = true;
    console.log("🔊 AUDIO ENGINE STARTED");
  }, []);

  // Update audio based on entropy
  useEffect(() => {
    if (
      !isStartedRef.current ||
      !droneRef.current ||
      !filterRef.current ||
      !noiseRef.current ||
      !sequenceRef.current
    )
      return;

    // Map entropy to drone frequency (it gets higher/more tense)
    const baseFreq = 40 + (entropy / 100) * 80;
    droneRef.current.frequency.rampTo(baseFreq, 0.1);

    // Map entropy to filter cutoff (it gets sharper/more chaotic)
    const filterFreq = 500 + (entropy / 100) * 5000;
    filterRef.current.frequency.rampTo(filterFreq, 0.1);

    // Map entropy to noise volume (more static as entropy grows)
    const noiseVol = -100 + (entropy / 100) * 90;
    noiseRef.current.volume.rampTo(noiseVol, 0.2);

    // Dynamic Tempo based on entropy
    Tone.Transport.bpm.rampTo(100 + entropy, 1);

    // Near collapse alarm
    if (isNearCollapse && Math.random() < 0.1) {
      synthRef.current?.triggerAttackRelease(["C5", "E5"], "16n");
    }
  }, [entropy, isNearCollapse]);

  const playGlitch = useCallback(() => {
    if (!isStartedRef.current || !synthRef.current) return;

    const notes = ["G2", "C3", "G3", "C4", "F#4"];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    synthRef.current.triggerAttackRelease(randomNote, "32n", undefined, 0.5);
  }, []);

  const playCollapse = useCallback(() => {
    if (!isStartedRef.current) return;

    const noiseBurst = new Tone.Noise("white").toDestination().start();
    noiseBurst.volume.rampTo(-5, 0.1);
    noiseBurst.volume.rampTo(-100, 2.5);

    setTimeout(() => noiseBurst.stop().dispose(), 3000);
  }, []);

  return {
    startAudio,
    playGlitch,
    playCollapse,
    isStarted: isStartedRef.current,
  };
}
