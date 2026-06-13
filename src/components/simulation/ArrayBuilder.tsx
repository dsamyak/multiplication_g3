import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useAudio } from '../../hooks/useAudio';

interface ArrayBuilderProps {
  rows: number;
  cols: number;
  activeRows?: number; // How many rows are currently 'filled' or 'active'
  activeCols?: number;
  onCellClick?: (r: number, c: number) => void;
  className?: string;
}

export const ArrayBuilder: React.FC<ArrayBuilderProps> = ({
  rows,
  cols,
  activeRows = rows,
  activeCols = cols,
  onCellClick,
  className
}) => {
  const { playSfx } = useAudio();

  const handleCellClick = (r: number, c: number) => {
    playSfx();
    onCellClick?.(r, c);
  };

  return (
    <div className={twMerge(clsx('flex flex-col items-center justify-center p-4 bg-white/50 rounded-3xl backdrop-blur-sm border border-white/60 shadow-inner', className))}>
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          Array.from({ length: cols }).map((_, c) => {
            const isActive = r < activeRows && c < activeCols;
            
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={clsx(
                  'w-10 h-10 rounded-lg transition-all duration-300 transform',
                  isActive 
                    ? 'bg-secondary-500 shadow-[0_4px_0_0_rgba(139,92,246,0.5)] hover:-translate-y-1 hover:bg-secondary-400' 
                    : 'bg-neutral-200 shadow-inner hover:bg-neutral-300'
                )}
                aria-label={`Cell row ${r + 1} column ${c + 1}`}
              />
            );
          })
        ))}
      </div>
      
      {/* Labels */}
      <div className="mt-6 flex justify-between w-full px-4 text-neutral-600 font-bold text-lg">
        <div className="flex flex-col items-center">
          <span>Rows</span>
          <span className="text-2xl text-secondary-600">{activeRows}</span>
        </div>
        <div className="flex flex-col items-center text-4xl text-neutral-400 font-light justify-center">
          ×
        </div>
        <div className="flex flex-col items-center">
          <span>Columns</span>
          <span className="text-2xl text-secondary-600">{activeCols}</span>
        </div>
        <div className="flex flex-col items-center text-4xl text-neutral-400 font-light justify-center">
          =
        </div>
        <div className="flex flex-col items-center">
          <span>Total</span>
          <span className="text-2xl text-primary-600">{activeRows * activeCols}</span>
        </div>
      </div>
    </div>
  );
};
