import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { WORLDS } from '../../data/worlds';
import { generateTableQuestions } from '../../utils/generateQuestions';
import { awardCrystals } from '../../utils/gamification';
import { Button } from '../ui/Button';
import { SkipCountLine } from '../simulation/SkipCountLine';
import { ArrayBuilder } from '../simulation/ArrayBuilder';
import { PatternCard } from '../simulation/PatternCard';
import { CrystalCatch } from '../practice/CrystalCatch';
import { StarRace } from '../practice/StarRace';
import { BossBattle } from '../practice/BossBattle';

type WorldPhase = 'intro' | 'simulation' | 'crystal-catch' | 'star-race' | 'boss';

export const WorldScene: React.FC = () => {
  const { currentWorld, setScreen } = useGameStore();
  const { addCrystals, completeWorld, updateTier2Best, completeBoss } = useProgressStore();
  const [phase, setPhase] = useState<WorldPhase>('intro');
  const [simStep, setSimStep] = useState(0);

  const world = Object.values(WORLDS).find(w => w.id === currentWorld);

  if (!world) {
    setScreen('world-map');
    return null;
  }

  const handleCrystalCatchComplete = (correctFirstTry: number, total: number) => {
    addCrystals(correctFirstTry * awardCrystals('tier1-correct-first-try'));
    setPhase('star-race');
  };

  const handleStarRaceComplete = (correct: number, timeTaken: number) => {
    addCrystals(awardCrystals('tier2-complete'));
    updateTier2Best(timeTaken);
    setPhase('boss');
  };

  const handleBossComplete = (victory: boolean) => {
    if (victory) {
      addCrystals(awardCrystals('boss-victory'));
      completeWorld(world.id);
      completeBoss();
      setScreen('world-map'); // go back to map on victory
    } else {
      // Retry boss or go back
      setPhase('intro');
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <div className="flex flex-col items-center bg-white/80 p-12 rounded-3xl backdrop-blur-md shadow-glass text-center max-w-2xl">
            <h1 className="text-5xl font-black mb-4" style={{ color: world.themeColor }}>{world.name}</h1>
            <p className="text-xl text-neutral-600 mb-8">{world.description}</p>
            <Button size="lg" onClick={() => setPhase('simulation')}>Begin Training</Button>
          </div>
        );
      case 'simulation':
        return (
          <div className="flex flex-col w-full max-w-4xl gap-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-neutral-800">Learn the Patterns</h2>
              <Button variant="ghost" onClick={() => setPhase('crystal-catch')}>Skip to Practice ⏭️</Button>
            </div>
            
            <div className="bg-white/80 p-8 rounded-3xl shadow-glass flex flex-col items-center">
              <h3 className="text-2xl font-bold text-neutral-700 mb-8">Skip Counting</h3>
              <SkipCountLine 
                baseNumber={world.id} 
                currentJump={simStep} 
                onJumpComplete={() => {}} 
              />
              <div className="flex gap-4 mt-12">
                <Button variant="secondary" onClick={() => setSimStep(Math.max(0, simStep - 1))}>Previous</Button>
                <Button onClick={() => setSimStep(Math.min(10, simStep + 1))}>Next Jump</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ArrayBuilder rows={world.id} cols={5} activeCols={Math.min(5, Math.max(1, simStep))} />
              <PatternCard tableId={world.id} />
            </div>

            <div className="flex justify-center mt-8">
              <Button size="lg" onClick={() => setPhase('crystal-catch')}>Start Practice Missions</Button>
            </div>
          </div>
        );
      case 'crystal-catch':
        return <CrystalCatch questions={generateTableQuestions(world.id, 10, ['product'])} onComplete={handleCrystalCatchComplete} />;
      case 'star-race':
        return <StarRace questions={generateTableQuestions(world.id, 15, ['product', 'missing-factor'])} onComplete={handleStarRaceComplete} />;
      case 'boss':
        return <BossBattle questions={generateTableQuestions(world.id, 5, ['product', 'missing-factor', 'reverse', 'word-problem'])} onComplete={handleBossComplete} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-80px)] w-full p-6 flex flex-col items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: `${world.themeColor}15` }}
    >
      {renderContent()}
    </div>
  );
};
