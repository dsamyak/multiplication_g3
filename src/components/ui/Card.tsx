import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default',
  className,
  ...props 
}) => {
  const baseStyles = 'rounded-3xl p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-white shadow-soft',
    glass: 'bg-white/40 backdrop-blur-md border border-white/40 shadow-glass',
  };

  const classes = twMerge(clsx(baseStyles, variants[variant], className));

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
