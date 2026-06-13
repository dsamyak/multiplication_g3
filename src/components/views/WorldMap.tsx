import React from 'react';
import { WORLDS } from '../../data/worlds';
import { useProgressStore } from '../../store/progressStore';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../ui/Card';
import { CharacterSVG } from '../characters/CharacterSVG';

export const WorldMap: React.FC = () => {
  const { completedWorlds } = useProgressStore();
  const { setScreen, setActiveWorld } = useGameStore();

  const handleSelectWorld = (tableId: number) => {
    setActiveWorld(tableId as any);
    setScreen('world-scene');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-neutral-800 mb-4 drop-shadow-sm">Choose Your Adventure!</h1>
        <p className="text-xl text-neutral-600 font-medium">Master the multiplication tables to unlock new worlds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative">
        {Object.values(WORLDS).map((world, index) => {
          const isCompleted = completedWorlds.includes(world.id);
          // Simple unlocking logic: first world always unlocked, next unlocked if prev is completed
          const worldsArr = Object.values(WORLDS);
          const isUnlocked = index === 0 || completedWorlds.includes(worldsArr[index - 1].id);

          return (
            <Card 
              key={world.id}
              variant="glass"
              className={`relative flex flex-col items-center p-8 transition-transform duration-500
                ${isUnlocked ? 'cursor-pointer hover:-translate-y-2 hover:shadow-lg' : 'opacity-60 grayscale cursor-not-allowed'}
              `}
              onClick={() => isUnlocked && handleSelectWorld(world.id)}
              style={{ backgroundColor: `${world.themeColor}20` }} // 20 hex is 12% opacity
            >
              {isCompleted && (
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl shadow-md border-4 border-white z-10 animate-bounce">
                  ⭐
                </div>
              )}
              
              {!isUnlocked && (
                <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] rounded-3xl flex items-center justify-center z-20">
                  <span className="text-5xl drop-shadow-md">🔒</span>
                </div>
              )}

              <CharacterSVG 
                primaryColor={world.themeColor} 
                emotion={isCompleted ? 'celebrate' : 'idle'}
                className="w-32 h-32 mb-6 drop-shadow-md" 
              />
              
              <h2 className="text-2xl font-bold text-center mb-2" style={{ color: world.themeColor }}>
                {world.name}
              </h2>
              <div className="bg-white/80 px-4 py-1 rounded-full text-sm font-bold text-neutral-600 mb-4 shadow-sm border border-white">
                Table of {world.id}
              </div>
              <p className="text-center text-neutral-600 font-medium text-sm">
                {world.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
