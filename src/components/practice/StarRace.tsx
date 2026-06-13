import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { useAudio } from '../../hooks/useAudio';

interface StarRaceProps {
  questions: Question[];
  onComplete: (correct: number, timeTakenSeconds: number) => void;
}

export const StarRace: React.FC<StarRaceProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isActive, setIsActive] = useState(true);
  
  const startTime = useRef(Date.now());
  const { playSfx } = useAudio();
  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
          onComplete(correctCount, timeTaken);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, correctCount, onComplete]);

  const handleAnswer = (answer: number) => {
    if (!isActive) return;

    if (answer === currentQ.answer) {
      playSfx();
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Finished all questions before time runs out
        setIsActive(false);
        const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
        onComplete(newCorrect, timeTaken);
      }
    } else {
      playSfx();
      // Penalty: deduct 2 seconds
      setTimeLeft(prev => Math.max(0, prev - 2));
    }
  };

  if (!currentQ) return null;

  return (
    <Card variant="glass" className="w-full max-w-3xl mx-auto p-8 bg-white/70">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-600 mb-2 flex items-center gap-2">
          <span>⏱️</span> Star Race!
        </h2>
        <div className="w-full flex items-center gap-4 mb-2">
          <span className="font-bold text-neutral-600 w-16">{timeLeft}s</span>
          <ProgressBar progress={(timeLeft / 60) * 100} color={timeLeft > 15 ? 'secondary' : 'warning'} />
        </div>
        <div className="font-bold text-lg text-neutral-600">
          Stars: {correctCount} / {questions.length}
        </div>
      </div>

      <div className="text-5xl md:text-7xl font-black text-neutral-800 mb-12 text-center py-8">
        {currentQ.text}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {currentQ.options.map((opt, i) => (
          <Button 
            key={i} 
            size="lg"
            variant="glass"
            className="text-3xl font-bold py-8 hover:scale-105"
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
};
