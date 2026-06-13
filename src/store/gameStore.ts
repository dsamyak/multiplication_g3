import { create } from 'zustand';
import { TableId, ModuleId, Question, BadgeId } from '../types';

interface GameState {
  unlockedWorlds: TableId[];
  completedLearnModules: TableId[];
  completedTier1: TableId[];
  completedTier2: TableId[];
  bossBattleComplete: boolean;

  crystals: number;
  grandCrystals: number;
  badges: BadgeId[];
  sessionScore: number;
  personalBest: Record<string, number>;

  currentWorld: TableId | null;
  currentModule: ModuleId | null;
  currentScreen: 'story' | 'world-map' | 'dashboard' | 'world-scene';
  sessionQuestions: Question[];

  unlockWorld: (id: TableId) => void;
  addCrystals: (n: number) => void;
  awardBadge: (id: BadgeId) => void;
  setSessionQuestions: (qs: Question[]) => void;
  completeModule: (world: TableId, module: ModuleId) => void;
  setCurrentWorld: (id: TableId | null) => void;
  setCurrentModule: (id: ModuleId | null) => void;
  setScreen: (screen: 'story' | 'world-map' | 'dashboard' | 'world-scene') => void;
  setActiveWorld: (id: TableId | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  unlockedWorlds: [6],
  completedLearnModules: [],
  completedTier1: [],
  completedTier2: [],
  bossBattleComplete: false,

  crystals: 0,
  grandCrystals: 0,
  badges: [],
  sessionScore: 0,
  personalBest: {},

  currentWorld: null,
  currentModule: null,
  currentScreen: 'story',
  sessionQuestions: [],

  unlockWorld: (id) => set((state) => ({ 
    unlockedWorlds: state.unlockedWorlds.includes(id) ? state.unlockedWorlds : [...state.unlockedWorlds, id] 
  })),
  addCrystals: (n) => set((state) => ({ crystals: state.crystals + n })),
  awardBadge: (id) => set((state) => ({
    badges: state.badges.includes(id) ? state.badges : [...state.badges, id]
  })),
  setSessionQuestions: (qs) => set({ sessionQuestions: qs }),
  completeModule: (world, module) => set((state) => {
    const newState = { ...state };
    if (module === 'learn' && !newState.completedLearnModules.includes(world)) {
      newState.completedLearnModules.push(world);
    }
    if (module === 'tier1' && !newState.completedTier1.includes(world)) {
      newState.completedTier1.push(world);
      // unlock next world logic
      if (world === 6) newState.unlockedWorlds.push(7);
      if (world === 7) newState.unlockedWorlds.push(8);
      if (world === 8) newState.unlockedWorlds.push(9);
    }
    if (module === 'tier2' && !newState.completedTier2.includes(world)) {
      newState.completedTier2.push(world);
    }
    if (module === 'boss') {
      newState.bossBattleComplete = true;
    }
    // deduplicate
    newState.unlockedWorlds = Array.from(new Set(newState.unlockedWorlds));
    newState.completedLearnModules = Array.from(new Set(newState.completedLearnModules));
    newState.completedTier1 = Array.from(new Set(newState.completedTier1));
    newState.completedTier2 = Array.from(new Set(newState.completedTier2));

    return newState;
  }),
  setCurrentWorld: (id) => set({ currentWorld: id }),
  setCurrentModule: (id) => set({ currentModule: id }),
  setScreen: (screen) => set({ currentScreen: screen }),
  setActiveWorld: (id) => set({ currentWorld: id }),
}));
