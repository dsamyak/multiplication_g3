import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGES } from '../../data/badges';
import { BadgeId } from '../../types';

interface BadgeProps {
  id: BadgeId;
  earned: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ id, earned, size = 'md' }) => {
  const badgeDef = BADGES[id];
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <div className="flex flex-col items-center group relative">
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 
          ${earned ? 'bg-gradient-to-br from-glass-bg to-white/10 border-gold shadow-glow-gold' : 'bg-bg-base border-glass-border grayscale opacity-50'}`}
        whileHover={earned ? { scale: 1.1, rotate: [0, -10, 10, -10, 0] } : {}}
      >
        <span>{badgeDef.icon}</span>
      </motion.div>
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-base px-2 py-1 rounded text-xs whitespace-nowrap z-10 border border-glass-border">
        {badgeDef.name}
      </div>
    </div>
  );
};
