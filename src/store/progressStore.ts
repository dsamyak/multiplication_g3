import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TableId, BadgeId } from '../types';

export interface ProgressState {
  crystals: number;
  badges: BadgeId[];
  completedWorlds: TableId[];
  tier1Scores: Record<number, number[]>;
  tier2PersonalBest: number;
  bossDefeated: boolean;
  lastVisit: string;
  streakDays: number;

  saveProgress: (updates: Partial<ProgressState>) => void;
  updateBadges: (newBadges: BadgeId[]) => void;
  addCrystals: (amount: number) => void;
  completeWorld: (tableId: TableId) => void;
  updateTier2Best: (time: number) => void;
  completeBoss: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      crystals: 0,
      badges: [],
      completedWorlds: [],
      tier1Scores: {},
      tier2PersonalBest: Infinity,
      bossDefeated: false,
      lastVisit: new Date().toISOString(),
      streakDays: 1,

      saveProgress: (updates) => set((state) => ({ ...state, ...updates })),
      updateBadges: (newBadges) => set({ badges: newBadges }),
      addCrystals: (amount) => set((state) => ({ crystals: state.crystals + amount })),
      completeWorld: (tableId) => set((state) => ({ 
        completedWorlds: state.completedWorlds.includes(tableId) ? state.completedWorlds : [...state.completedWorlds, tableId] 
      })),
      updateTier2Best: (time) => set((state) => ({ tier2PersonalBest: Math.min(state.tier2PersonalBest, time) })),
      completeBoss: () => set({ bossDefeated: true }),
    }),
    {
      name: 'intellia-lesson-3-1',
      version: 1,
    }
  )
);
