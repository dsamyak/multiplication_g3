import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface CrystalCounterProps {
  count: number;
}

export const CrystalCounter: React.FC<CrystalCounterProps> = ({ count }) => {
  const controls = useAnimation();
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count > prevCount) {
      controls.start({
        scale: [1, 1.3, 1],
        color: ['#f1f5f9', '#74c0fc', '#f1f5f9'],
        transition: { duration: 0.5 }
      });
      setPrevCount(count);
    }
  }, [count, prevCount, controls]);

  return (
    <div className="flex items-center gap-2 bg-glass-bg px-4 py-2 rounded-full border border-glass-border">
      <span className="text-xl">💎</span>
      <motion.span 
        animate={controls}
        className="font-display text-xl text-white min-w-[2ch]"
        role="status"
        aria-live="polite"
        aria-label={`${count} crystals collected`}
      >
        {count}
      </motion.span>
    </div>
  );
};
