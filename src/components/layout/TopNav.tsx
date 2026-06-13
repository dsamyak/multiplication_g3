import React from 'react';
import { useProgressStore } from '../../store/progressStore';
import { useAudioStore } from '../../store/audioStore';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';

export const TopNav: React.FC = () => {
  const { crystals: totalCrystals, badges: earnedBadges } = useProgressStore();
  const { musicEnabled, sfxEnabled, toggleMusic, toggleSfx } = useAudioStore();
  const { setScreen } = useGameStore();

  return (
    <nav className="w-full bg-white/40 backdrop-blur-md border-b border-white/40 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => setScreen('world-map')}
      >
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
          M
        </div>
        <h1 className="text-xl font-black text-primary-800 tracking-tight hidden md:block">
          Multiplication Masters
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div 
          className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/80 transition shadow-sm border border-white/50"
          onClick={() => setScreen('dashboard')}
        >
          <span className="text-xl">💎</span>
          <span className="font-bold text-primary-700">{totalCrystals}</span>
          <div className="w-px h-6 bg-neutral-300 mx-2" />
          <span className="text-xl">🏅</span>
          <span className="font-bold text-secondary-700">{earnedBadges.length}</span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="glass" 
            size="icon" 
            onClick={toggleMusic}
            title={musicEnabled ? "Disable Music" : "Enable Music"}
          >
            {musicEnabled ? '🎵' : '🔇'}
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            onClick={toggleSfx}
            title={sfxEnabled ? "Disable Sound Effects" : "Enable Sound Effects"}
          >
            {sfxEnabled ? '🔊' : '🔈'}
          </Button>
        </div>
      </div>
    </nav>
  );
};
