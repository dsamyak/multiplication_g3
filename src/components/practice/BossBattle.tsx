import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { useAudio } from '../../hooks/useAudio';
import { CharacterSVG } from '../characters/CharacterSVG';

interface BossBattleProps {
  questions: Question[];
  onComplete: (victory: boolean) => void;
}

export const BossBattle: React.FC<BossBattleProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [bossHealth, setBossHealth] = useState(questions.length);
  const [feedback, setFeedback] = useState<'none' | 'hit-boss' | 'hit-player'>('none');

  const { playSfx } = useAudio();
  const currentQ = questions[currentIndex];

  const handleAnswer = (answer: number) => {
    if (feedback !== 'none') return;

    if (answer === currentQ.answer) {
      playSfx(); // Maybe a specific 'hit' sound
      setFeedback('hit-boss');
      
      setTimeout(() => {
        const newBossHealth = bossHealth - 1;
        setBossHealth(newBossHealth);
        
        if (newBossHealth <= 0) {
          onComplete(true);
        } else {
          setCurrentIndex(prev => prev + 1);
          setFeedback('none');
        }
      }, 1000);
    } else {
      playSfx(); // specific 'damage' sound
      setFeedback('hit-player');
      
      setTimeout(() => {
        const newPlayerHealth = playerHealth - 1;
        setPlayerHealth(newPlayerHealth);
        
        if (newPlayerHealth <= 0) {
          onComplete(false);
        } else {
          // Re-try same question or move on? Let's move on to keep it moving, or stay. We'll stay.
          setFeedback('none');
        }
      }, 1000);
    }
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4">
      {/* Battle Arena */}
      <div className="flex justify-between items-center bg-neutral-900/10 rounded-3xl p-8 backdrop-blur-md border border-white/20">
        
        {/* Player Side */}
        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="flex gap-2 text-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < playerHealth ? 'opacity-100' : 'opacity-20 grayscale'}>❤️</span>
            ))}
          </div>
          <CharacterSVG 
            emotion={feedback === 'hit-player' ? 'sad' : feedback === 'hit-boss' ? 'celebrate' : 'idle'} 
            className={`w-32 h-32 ${feedback === 'hit-player' ? 'animate-shake opacity-75' : ''}`}
          />
          <div className="font-bold text-white bg-primary-500 px-4 py-1 rounded-full">You</div>
        </div>

        {/* VS / Question */}
        <div className="flex flex-col items-center gap-4 w-1/3 z-10">
          <div className="text-4xl font-black text-red-500 italic drop-shadow-md">VS</div>
          <Card className="text-4xl md:text-5xl font-bold text-center w-full py-8 whitespace-nowrap z-20 shadow-xl">
            {currentQ.text}
          </Card>
        </div>

        {/* Boss Side */}
        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="w-full px-4">
            <ProgressBar progress={(bossHealth / questions.length) * 100} color="warning" className="h-4" />
          </div>
          <CharacterSVG 
            primaryColor="#ef4444" 
            emotion={feedback === 'hit-boss' ? 'sad' : feedback === 'hit-player' ? 'celebrate' : 'thinking'}
            className={`w-40 h-40 ${feedback === 'hit-boss' ? 'animate-shake opacity-75 grayscale' : 'animate-pulse'}`}
          />
          <div className="font-bold text-white bg-red-500 px-4 py-1 rounded-full">Boss</div>
        </div>

      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentQ.options.map((opt, i) => (
          <Button 
            key={i} 
            size="lg"
            variant="glass"
            className={`text-3xl font-bold py-6 hover:scale-105 bg-white/80
              ${feedback === 'hit-boss' && opt === currentQ.answer ? 'bg-green-400 text-white' : ''}
              ${feedback === 'hit-player' && opt !== currentQ.answer ? 'opacity-50' : ''}
            `}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== 'none'}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};
