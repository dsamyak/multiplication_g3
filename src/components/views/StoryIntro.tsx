import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CharacterSVG } from '../characters/CharacterSVG';

export const StoryIntro: React.FC = () => {
  const { setScreen } = useGameStore();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <Card variant="glass" className="w-full p-12 flex flex-col items-center text-center">
        <CharacterSVG emotion="celebrate" className="w-48 h-48 mb-8 animate-bounce drop-shadow-lg" />
        
        <h1 className="text-5xl md:text-7xl font-black text-primary-600 mb-6 drop-shadow-sm">
          Welcome to the Math Multiverse!
        </h1>
        
        <p className="text-2xl text-neutral-700 font-medium mb-12 max-w-2xl leading-relaxed">
          The Math Multiverse is losing its magic! We need your help to gather crystals and restore balance by mastering the powers of multiplication.
        </p>

        <Button 
          size="lg" 
          className="text-3xl px-12 py-6 animate-pulse hover:animate-none"
          onClick={() => setScreen('world-map')}
        >
          Start Adventure! 🚀
        </Button>
      </Card>
    </div>
  );
};
