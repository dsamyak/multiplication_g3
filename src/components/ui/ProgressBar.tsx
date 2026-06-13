import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'primary',
  className
}) => {
  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  };

  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={twMerge(clsx('w-full bg-neutral-200 rounded-full h-4 overflow-hidden', className))}>
      <div 
        className={clsx('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
};
