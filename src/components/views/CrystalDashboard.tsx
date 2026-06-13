import React from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useGameStore } from '../../store/gameStore';
import { BADGES } from '../../data/badges';
import { BadgeIcon } from '../ui/BadgeIcon';
import { Button } from '../ui/Button';

export const CrystalDashboard: React.FC = () => {
  const { crystals: totalCrystals, badges: earnedBadges } = useProgressStore();
  const { setScreen } = useGameStore();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center">
      <div className="flex justify-between w-full mb-8">
        <h1 className="text-4xl font-black text-neutral-800">Your Dashboard</h1>
        <Button onClick={() => setScreen('world-map')} variant="primary">Back to Map</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-glass flex flex-col items-center justify-center col-span-1">
          <div className="text-8xl mb-4 animate-bounce">💎</div>
          <h2 className="text-2xl font-bold text-neutral-600 mb-2">Total Crystals</h2>
          <div className="text-6xl font-black text-primary-600">{totalCrystals}</div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-glass col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <span>🏅</span> Badges Earned ({earnedBadges.length}/{Object.values(BADGES).length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.values(BADGES).map(badge => (
              <BadgeIcon 
                key={badge.id} 
                badge={badge} 
                earned={earnedBadges.includes(badge.id)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
