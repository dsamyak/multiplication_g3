import audioMap from './audioMap';

export interface NarrationSegment {
  text: string;
  style: string;
  pause: number;
}

let currentQueue: symbol | null = null;
let isSpeaking = false;
let currentAudio: HTMLAudioElement | null = null;
let playId = 0;
const elevenLabsCache = new Map<string, Promise<string>>();

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';

const getElevenLabsSettings = (speechStyle: string) => {
  switch (speechStyle) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.5, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.2, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.5, style: 0.6, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.6, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.2, similarity_boost: 0.55, style: 0.5, use_speaker_boost: true };
  }
};

export async function getAudioUrl(text: string, style: string): Promise<string> {
  // Check static audio map first for exact phrase match
  // @ts-ignore
  if (audioMap && audioMap[text]) {
    // @ts-ignore
    return audioMap[text];
  }

  const cacheKey = `${text}_${style}`;
  if (elevenLabsCache.has(cacheKey)) {
    return elevenLabsCache.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    const localApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
    const voiceSettings = getElevenLabsSettings(style);

    let response = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId: ELEVENLABS_VOICE_ID, voiceSettings }),
    });

    const isHtmlFallback = (response.headers.get('content-type') || '').includes('text/html');

    if ((!response.ok || isHtmlFallback) && localApiKey) {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': localApiKey },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: voiceSettings }),
      });
    }

    if (!response.ok || isHtmlFallback) {
      throw new Error('Failed to fetch audio');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  })();

  elevenLabsCache.set(cacheKey, fetchPromise);
  fetchPromise.catch(() => elevenLabsCache.delete(cacheKey));
  return fetchPromise;
}

export function speak(text: string, enabled = true, style = 'statement'): Promise<void> {
  return new Promise(async (resolve) => {
    if (!enabled || !text) {
      resolve();
      return;
    }

    playId++;
    const currentPlayId = playId;
    window.speechSynthesis?.cancel();
    isSpeaking = true;

    try {
      const audioUrl = await getAudioUrl(text, style);
      if (currentPlayId !== playId) {
        isSpeaking = false;
        resolve();
        return;
      }

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      currentAudio = new Audio(audioUrl);
      currentAudio.onended = () => {
        isSpeaking = false;
        resolve();
      };
      currentAudio.onerror = () => {
        isSpeaking = false;
        resolve();
      };
      await currentAudio.play();
    } catch {
      isSpeaking = false;
      resolve();
    }
  });
}

export function seg(text: string, style = 'statement', pauseMs = 400): NarrationSegment {
  return { text, style, pause: pauseMs };
}

export const say = (text: string, pause = 0) => seg(text, 'statement', pause);
export const ask = (text: string, pause = 0) => seg(text, 'question', pause);
export const cheer = (text: string, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text: string, pause = 0) => seg(text, 'emphasis', pause);
export const think = (text: string, pause = 0) => seg(text, 'thinking', pause);
export const celebrate = (text: string, pause = 0) => seg(text, 'celebration', pause);
export const instruct = (text: string, pause = 0) => seg(text, 'instruction', pause);

export function preloadNarration(segments: NarrationSegment[]) {
  segments.forEach((s) => {
    if (s.text?.trim()) getAudioUrl(s.text, s.style).catch(() => {});
  });
}

export function narrate(segments: NarrationSegment[], enabled = true) {
  const queueId = Symbol('narration');
  currentQueue = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      window.speechSynthesis?.cancel();
      isSpeaking = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments?.length) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        if (nextSeg.text?.trim()) getAudioUrl(nextSeg.text, nextSeg.style).catch(console.error);
      }

      if (segment.text?.trim()) {
        await speak(segment.text, true, segment.style);
      }

      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise((r) => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

export function stopNarration() {
  playId++;
  currentQueue = null;
  window.speechSynthesis?.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isSpeaking = false;
}

let audioCtx: AudioContext | null = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioCtx;
}

export function playTone(frequency: number, duration = 200) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    /* silent */
  }
}

export const sounds = {
  correct: () => {
    playTone(523, 150);
    setTimeout(() => playTone(659, 150), 150);
    setTimeout(() => playTone(784, 200), 300);
  },
  wrong: () => playTone(220, 300),
  badge: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 200), i * 150)),
  click: () => playTone(440, 80),
  streak: () => {
    playTone(880, 100);
    setTimeout(() => playTone(1100, 150), 100);
  },
};
