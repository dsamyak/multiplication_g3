import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';

export function useProgress() {
  const game = useGameStore();
  const progress = useProgressStore();

  const syncToPersisted = () => {
    progress.saveProgress({
      crystals: game.crystals,
      badges: game.badges,
      completedWorlds: game.completedTier1,
      tier2PersonalBest: Math.max(progress.tier2PersonalBest || 0, game.personalBest['tier2'] || 0),
      bossDefeated: game.bossBattleComplete,
    });
  };

  return { game, progress, syncToPersisted };
}
