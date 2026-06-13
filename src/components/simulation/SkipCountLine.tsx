import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useAudio } from '../../hooks/useAudio';

interface SkipCountLineProps {
  baseNumber: number;
  maxJumps?: number;
  currentJump: number; // Controlled by parent
  onJumpComplete?: (jump: number) => void;
  className?: string;
}

export const SkipCountLine: React.FC<SkipCountLineProps> = ({
  baseNumber,
  maxJumps = 10,
  currentJump,
  onJumpComplete,
  className
}) => {
  const { playSfx } = useAudio();
  const [animatedJump, setAnimatedJump] = useState(0);

  useEffect(() => {
    if (currentJump > animatedJump) {
      // Animate jumping to the target
      const timer = setTimeout(() => {
        setAnimatedJump(prev => prev + 1);
        playSfx();
      }, 400); // 400ms per jump
      return () => clearTimeout(timer);
    } else if (currentJump === animatedJump) {
      onJumpComplete?.(currentJump);
    } else {
      // Reset or go back instantly
      setAnimatedJump(currentJump);
    }
  }, [currentJump, animatedJump, playSfx, onJumpComplete]);

  const maxVal = baseNumber * maxJumps;
  const nodes = Array.from({ length: maxJumps + 1 }, (_, i) => i);

  return (
    <div className={twMerge(clsx('w-full relative py-12 px-4', className))}>
      {/* The Line */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-neutral-200 -translate-y-1/2 rounded-full z-0" />
      
      {/* The Filled Line */}
      <div 
        className="absolute top-1/2 left-0 h-2 bg-primary-500 -translate-y-1/2 rounded-full z-0 transition-all duration-300 ease-in-out"
        style={{ width: `${(animatedJump / maxJumps) * 100}%` }}
      />

      <div className="flex justify-between relative z-10">
        {nodes.map(i => {
          const value = i * baseNumber;
          const isReached = i <= animatedJump;
          const isCurrent = i === animatedJump;
          
          return (
            <div key={i} className="flex flex-col items-center justify-center relative">
              {/* Value display */}
              <div 
                className={clsx(
                  'absolute -top-10 font-bold transition-all duration-300',
                  isReached ? 'opacity-100 translate-y-0 text-primary-600' : 'opacity-0 translate-y-2 text-neutral-400',
                  isCurrent && i > 0 ? 'text-2xl animate-bounce' : 'text-lg'
                )}
              >
                {value}
              </div>

              {/* Node dot */}
              <div 
                className={clsx(
                  'w-6 h-6 rounded-full border-4 transition-all duration-300 shadow-sm',
                  isCurrent ? 'bg-primary-500 border-white scale-125 shadow-primary-500/50' : 
                  isReached ? 'bg-primary-400 border-primary-200' : 'bg-white border-neutral-300'
                )}
              />
              
              {/* Base multiplier display */}
              <div className="absolute -bottom-8 text-xs font-medium text-neutral-500">
                {i > 0 ? `${baseNumber}×${i}` : 'Start'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
