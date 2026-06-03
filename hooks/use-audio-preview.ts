"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.oncanplay = null;
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      // Clear handlers BEFORE pausing — prevents a stale oncanplay from
      // firing after stop() and replaying the audio.
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
    }
    setPlayingId(null);
    setLoadingId(null);
  }, []);

  const toggle = useCallback(
    (voiceId: string, previewUrl: string) => {
      // Cancel if this voice is playing OR still loading (loadingId check
      // was missing — caused the pause button to not work during buffering).
      if (playingId === voiceId || loadingId === voiceId) {
        stop();
        return;
      }

      stop();

      const audio = audioRef.current ?? (audioRef.current = new Audio());

      setLoadingId(voiceId);
      audio.src = previewUrl;
      audio.load();

      audio.oncanplay = () => {
        setLoadingId(null);
        setPlayingId(voiceId);
        audio.play().catch(() => {
          setPlayingId(null);
          setLoadingId(null);
        });
      };
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        setPlayingId(null);
        setLoadingId(null);
      };
    },
    [playingId, loadingId, stop]
  );

  return { playingId, loadingId, toggle, stop };
}
