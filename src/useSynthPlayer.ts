import { useEffect, useRef, useState } from "react";
import { tracks } from "./data";

function makeLoop(context: AudioContext, trackIndex: number) {
  const track = tracks[trackIndex];
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * track.duration);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const channel = buffer.getChannelData(0);
  const stepLength = 60 / track.bpm / 2;

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / sampleRate;
    const step = Math.floor(time / stepLength);
    const phase = (time - step * stepLength) / stepLength;
    const frequency = track.notes[step % track.notes.length];
    const envelope = Math.exp(-phase * 5.4) * (1 - Math.exp(-phase * 90));
    const vibrato = 1 + Math.sin(time * Math.PI * 8) * 0.0015;
    const bell =
      Math.sin(Math.PI * 2 * frequency * vibrato * time) * 0.13 +
      Math.sin(Math.PI * 4 * frequency * time) * 0.022;
    const pad =
      Math.sin(Math.PI * 2 * track.root * time) * 0.022 +
      Math.sin(Math.PI * 3 * track.root * time) * 0.014;
    const edgeFade = Math.max(0, Math.min(1, time / 0.05, (track.duration - time) / 0.05));
    channel[i] = (bell * envelope + pad) * edgeFade;
  }

  return buffer;
}

export function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function useSynthPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = localStorage.getItem("secret-room-volume");
      if (saved === null) return 0.55;
      const parsed = Number(saved);
      return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.55;
    } catch {
      return 0.55;
    }
  });
  const [restartToken, setRestartToken] = useState(0);
  const [error, setError] = useState("");

  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const anchorRef = useRef(0);
  const positionRef = useRef(0);
  const volumeRef = useRef(volume);
  const bufferCache = useRef(new Map<number, AudioBuffer>());

  useEffect(() => {
    if (!isPlaying) return;

    let cancelled = false;
    let timer = 0;

    const start = async () => {
      try {
        if (!contextRef.current) {
          contextRef.current = new AudioContext();
          gainRef.current = contextRef.current.createGain();
          gainRef.current.gain.value = volumeRef.current;
          gainRef.current.connect(contextRef.current.destination);
        }

        const context = contextRef.current;
        await context.resume();
        if (cancelled) return;

        let buffer = bufferCache.current.get(trackIndex);
        if (!buffer) {
          buffer = makeLoop(context, trackIndex);
          bufferCache.current.set(trackIndex, buffer);
        }

        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gainRef.current!);
        source.start(0, positionRef.current % tracks[trackIndex].duration);
        sourceRef.current = source;
        anchorRef.current = context.currentTime - positionRef.current;
        setError("");

        timer = window.setInterval(() => {
          const next = (context.currentTime - anchorRef.current) % tracks[trackIndex].duration;
          positionRef.current = next;
          setPosition(next);
        }, 100);
      } catch {
        setError("audio could not start in this browser");
        setIsPlaying(false);
      }
    };

    void start();

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          // A source can already be stopped during quick track changes.
        }
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
    };
  }, [isPlaying, trackIndex, restartToken]);

  useEffect(
    () => () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          // Nothing to do if the source already ended.
        }
      }
      if (contextRef.current) void contextRef.current.close();
      contextRef.current = null;
      gainRef.current = null;
      bufferCache.current.clear();
    },
    [],
  );

  const toggle = () => {
    setError("");
    setIsPlaying((current) => !current);
  };

  const selectTrack = (index: number) => {
    const next = (index + tracks.length) % tracks.length;
    positionRef.current = 0;
    setPosition(0);
    setTrackIndex(next);
    if (next === trackIndex && isPlaying) setRestartToken((token) => token + 1);
  };

  const seek = (nextPosition: number) => {
    const safePosition = Math.max(0, Math.min(tracks[trackIndex].duration, nextPosition));
    positionRef.current = safePosition;
    setPosition(safePosition);
    if (isPlaying) setRestartToken((token) => token + 1);
  };

  const setVolume = (nextVolume: number) => {
    const safeVolume = Math.max(0, Math.min(1, nextVolume));
    volumeRef.current = safeVolume;
    setVolumeState(safeVolume);
    try {
      localStorage.setItem("secret-room-volume", String(safeVolume));
    } catch {
      // Volume still applies for this session when storage is blocked.
    }
    if (gainRef.current && contextRef.current) {
      gainRef.current.gain.setTargetAtTime(safeVolume, contextRef.current.currentTime, 0.02);
    }
  };

  return {
    track: tracks[trackIndex],
    trackIndex,
    isPlaying,
    position,
    volume,
    error,
    toggle,
    selectTrack,
    seek,
    setVolume,
  };
}
