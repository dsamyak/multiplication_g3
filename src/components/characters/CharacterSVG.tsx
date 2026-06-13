import React from 'react';

export type CharacterEmotion = 'idle' | 'happy' | 'thinking' | 'sad' | 'celebrate';

interface CharacterSVGProps {
  emotion?: CharacterEmotion;
  primaryColor?: string;
  className?: string;
}

export const CharacterSVG: React.FC<CharacterSVGProps> = ({ 
  emotion = 'idle', 
  primaryColor = '#0ea5e9', // default primary-500
  className 
}) => {
  // A generic cute robot/mascot placeholder
  
  const getEyeExpression = () => {
    switch(emotion) {
      case 'happy': return 'M 35 45 Q 45 35 55 45 M 65 45 Q 75 35 85 45'; // Curved up
      case 'sad': return 'M 35 40 Q 45 50 55 40 M 65 40 Q 75 50 85 40'; // Curved down
      case 'thinking': return 'M 35 45 L 55 45 M 65 40 Q 75 35 85 45'; // One straight, one curved
      case 'celebrate': return 'M 35 45 L 45 35 L 55 45 M 65 45 L 75 35 L 85 45'; // Carets
      case 'idle':
      default: return 'M 40 45 A 5 5 0 1 0 50 45 A 5 5 0 1 0 40 45 M 70 45 A 5 5 0 1 0 80 45 A 5 5 0 1 0 70 45'; // Circles
    }
  };

  const getMouthExpression = () => {
    switch(emotion) {
      case 'happy': return 'M 40 65 Q 60 85 80 65'; // Big smile
      case 'sad': return 'M 45 75 Q 60 65 75 75'; // Frown
      case 'thinking': return 'M 50 70 Q 60 70 70 65'; // Smirk/line
      case 'celebrate': return 'M 40 65 Q 60 90 80 65 Z'; // Open mouth
      case 'idle':
      default: return 'M 45 70 Q 60 75 75 70'; // Gentle curve
    }
  };

  return (
    <svg 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body/Head */}
      <rect x="20" y="20" width="80" height="80" rx="40" fill={primaryColor} opacity="0.2" />
      <rect x="25" y="25" width="70" height="70" rx="35" fill={primaryColor} />
      
      {/* Screen/Face Area */}
      <rect x="30" y="35" width="60" height="45" rx="15" fill="#1e293b" />
      
      {/* Eyes */}
      <path d={getEyeExpression()} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Mouth */}
      <path d={getMouthExpression()} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill={emotion === 'celebrate' ? '#38bdf8' : 'none'} />
      
      {/* Antenna */}
      <line x1="60" y1="25" x2="60" y2="10" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="8" r="6" fill="#f59e0b" />
    </svg>
  );
};
