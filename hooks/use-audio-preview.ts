"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
    setLoadingId(null);
  }, []);

  const toggle = useCallback(
    (voiceId: string, previewUrl: string) => {
      if (playingId === voiceId) {
        stop();
        return;
      }
      stop();

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;

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
    [playingId, stop]
  );

  return { playingId, loadingId, toggle, stop };
}
