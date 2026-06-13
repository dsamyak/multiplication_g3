import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAudio } from '../../hooks/useAudio';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick,
  ...props 
}) => {
  const { playSfx } = useAudio();

  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0';
  
  const variants = {
    primary: 'bg-primary-500 text-white shadow-[0_4px_0_0_rgba(14,165,233,0.5)] hover:shadow-[0_6px_0_0_rgba(14,165,233,0.6)] hover:bg-primary-400 active:shadow-none',
    secondary: 'bg-secondary-500 text-white shadow-[0_4px_0_0_rgba(139,92,246,0.5)] hover:shadow-[0_6px_0_0_rgba(139,92,246,0.6)] hover:bg-secondary-400 active:shadow-none',
    danger: 'bg-red-500 text-white shadow-[0_4px_0_0_rgba(239,68,68,0.5)] hover:shadow-[0_6px_0_0_rgba(239,68,68,0.6)] hover:bg-red-400 active:shadow-none',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 hover:-translate-y-0 active:translate-y-0',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-neutral-800 shadow-glass hover:bg-white/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl',
    icon: 'p-3',
  };

  const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSfx();
    onClick?.(e);
  };

  return (
    <button className={classes} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
