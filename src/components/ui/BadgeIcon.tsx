import React from 'react';
import { BadgeId } from '../../types';
import { BadgeDefinition } from '../../data/badges';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeIconProps {
  badge: BadgeDefinition;
  earned?: boolean;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, earned = false, className }) => {
  return (
    <div 
      className={twMerge(clsx(
        'relative flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-300',
        earned ? 'bg-yellow-100 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-neutral-100 border-neutral-300 opacity-60 grayscale',
        className
      ))}
      title={badge.description}
    >
      <div className="text-4xl mb-2">{badge.icon}</div>
      <span className="text-xs font-bold text-center mt-2 leading-tight">
        {badge.name}
      </span>
    </div>
  );
};
