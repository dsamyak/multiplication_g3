import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';

interface CrystalCatchProps {
  questions: Question[];
  onComplete: (correctFirstTry: number, totalQuestions: number) => void;
}

export const CrystalCatch: React.FC<CrystalCatchProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptsThisQuestion, setAttemptsThisQuestion] = useState(0);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  
  const { playSfx } = useAudio();
  const currentQ = questions[currentIndex];

  const handleAnswer = (answer: number) => {
    if (feedback !== 'none') return; // Prevent multiple clicks

    if (answer === currentQ.answer) {
      playSfx();
      setFeedback('correct');
      if (attemptsThisQuestion === 0) {
        setCorrectFirstTry(prev => prev + 1);
      }
      
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setAttemptsThisQuestion(0);
          setFeedback('none');
        } else {
          onComplete(correctFirstTry + (attemptsThisQuestion === 0 ? 1 : 0), questions.length);
        }
      }, 1000);
    } else {
      playSfx();
      setFeedback('incorrect');
      setAttemptsThisQuestion(prev => prev + 1);
      setTimeout(() => {
        setFeedback('none');
      }, 1000);
    }
  };

  if (!currentQ) return null;

  return (
    <Card variant="glass" className="w-full max-w-2xl mx-auto flex flex-col items-center p-8 bg-white/70">
      <div className="flex justify-between w-full mb-6">
        <span className="font-bold text-neutral-600">Question {currentIndex + 1} of {questions.length}</span>
        <span className="font-bold text-primary-500">Crystals: {correctFirstTry}</span>
      </div>

      <div className="text-4xl md:text-6xl font-bold text-neutral-800 mb-12 text-center">
        {currentQ.text}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentQ.options.map((opt, i) => (
          <Button 
            key={i} 
            size="lg"
            variant="glass"
            className={`text-2xl font-bold py-6 ${feedback === 'correct' && opt === currentQ.answer ? 'bg-green-400 text-white border-green-500 shadow-none' : ''} ${feedback === 'incorrect' && opt !== currentQ.answer ? 'opacity-50' : ''}`}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== 'none'}
          >
            {opt}
          </Button>
        ))}
      </div>

      {feedback === 'correct' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-bounce">
          ✨
        </div>
      )}
      {feedback === 'incorrect' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-shake">
          ❌
        </div>
      )}
    </Card>
  );
};
