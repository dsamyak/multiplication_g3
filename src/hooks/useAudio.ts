import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudioStore } from '../store/audioStore';

// Minimal silent mp3 data URI to prevent 404s
const SILENT_MP3 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjMuMTAwAAAAAAAAAAAAAAD/+0DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADQAAAAEAAABoAAQEBgYKCg4OEBAWFhgYHh4iIiYmKioqLi4yMjY2ODg+Pj5CQkZGSkoODhAQFhYYGB4eIiImJioqKi4uMjI2Njg4Pj4+QkJGRkpKUlJWVlpany8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwAAAAD/+0DAAAABgAIAAAAEAAABH//v/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

export function useAudio(src: string | undefined = SILENT_MP3, loop: boolean = false) {
  const { musicEnabled, sfxEnabled, narrationEnabled } = useAudioStore();
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      loop,
      volume: 0.5,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [src, loop]);

  const playMusic = () => {
    if (musicEnabled && soundRef.current && !soundRef.current.playing()) {
      soundRef.current.play();
    }
  };

  const playSfx = () => {
    if (sfxEnabled && soundRef.current) {
      soundRef.current.play();
    }
  };

  const playNarration = () => {
    if (narrationEnabled && soundRef.current) {
      soundRef.current.play();
    }
  };

  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  };

  return { playMusic, playSfx, playNarration, stop };
}
