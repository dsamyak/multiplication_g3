import { BadgeId } from '../types';

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export const BADGES: Record<BadgeId, BadgeDefinition> = {
  'coral-explorer': { id: 'coral-explorer', name: 'Coral Explorer', description: 'Completed Table ×6', icon: '🐠' },
  'jungle-champion': { id: 'jungle-champion', name: 'Jungle Champion', description: 'Completed Table ×7', icon: '🦁' },
  'space-ace': { id: 'space-ace', name: 'Space Ace', description: 'Completed Table ×8', icon: '🚀' },
  'temple-guardian': { id: 'temple-guardian', name: 'Temple Guardian', description: 'Completed Table ×9', icon: '🏛️' },
  'crystal-master': { id: 'crystal-master', name: 'Crystal Master', description: 'Defeated the Boss', icon: '💎' },
  'speed-demon': { id: 'speed-demon', name: 'Speed Demon', description: 'Finished Tier 2 in under 30 seconds', icon: '⚡' },
  'perfect-score': { id: 'perfect-score', name: 'Perfect Score', description: '10/10 on Tier 1, first attempt', icon: '🎯' },
  'global-explorer': { id: 'global-explorer', name: 'Global Explorer', description: 'Completed all 4 tables', icon: '🌍' },
};
