import { BadgeId, TableId } from '../types';

type GameEvent = 
  | 'complete-skip-count'
  | 'complete-array-builder'
  | 'tier1-correct-first-try'
  | 'tier1-correct-second-try'
  | 'tier2-complete'
  | 'boss-correct'
  | 'boss-victory';

export function awardCrystals(event: GameEvent): number {
  const rewards: Record<GameEvent, number> = {
    'complete-skip-count': 1,
    'complete-array-builder': 1,
    'tier1-correct-first-try': 1,
    'tier1-correct-second-try': 0,
    'tier2-complete': 5,
    'boss-correct': 1,
    'boss-victory': 10,
  };
  return rewards[event] ?? 0;
}

export function evaluateBadges(
  completedWorlds: TableId[],
  bossDefeated: boolean,
  tier2PersonalBest: number,
  earnedBadges: BadgeId[]
): BadgeId[] {
  const newBadges: BadgeId[] = [...earnedBadges];

  if (completedWorlds.includes(6) && !newBadges.includes('coral-explorer')) newBadges.push('coral-explorer');
  if (completedWorlds.includes(7) && !newBadges.includes('jungle-champion')) newBadges.push('jungle-champion');
  if (completedWorlds.includes(8) && !newBadges.includes('space-ace')) newBadges.push('space-ace');
  if (completedWorlds.includes(9) && !newBadges.includes('temple-guardian')) newBadges.push('temple-guardian');
  if (bossDefeated && !newBadges.includes('crystal-master')) newBadges.push('crystal-master');
  if (tier2PersonalBest <= 30 && !newBadges.includes('speed-demon')) newBadges.push('speed-demon');

  return newBadges;
}
