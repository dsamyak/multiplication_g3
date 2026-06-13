import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  narrationEnabled: boolean;
  
  toggleMusic: () => void;
  toggleSfx: () => void;
  toggleNarration: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      musicEnabled: true,
      sfxEnabled: true,
      narrationEnabled: true,

      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
      toggleNarration: () => set((state) => ({ narrationEnabled: !state.narrationEnabled })),
    }),
    {
      name: 'intellia-audio-settings',
    }
  )
);
