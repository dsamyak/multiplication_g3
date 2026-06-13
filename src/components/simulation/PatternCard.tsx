import React from 'react';
import { Card } from '../ui/Card';
import { TableId } from '../../types';

interface PatternCardProps {
  tableId: TableId;
}

export const PatternCard: React.FC<PatternCardProps> = ({ tableId }) => {
  const getPatternDescription = () => {
    switch (tableId) {
      case 6:
        return "Multiply by 5 and add one more group! (e.g., 6×4 = 5×4 + 4)";
      case 7:
        return "7 is 5 + 2. Multiply by 5, multiply by 2, and add them together!";
      case 8:
        return "Double, double, and double again! (e.g., 8×3 → 3×2=6, 6×2=12, 12×2=24)";
      case 9:
        return "The tens digit goes up by 1, and the ones digit goes down by 1. Also, the digits always add up to 9! (e.g., 9×4=36, 3+6=9)";
      default:
        return "Look for the hidden patterns to master this table!";
    }
  };

  const renderPatternVisual = () => {
    if (tableId === 9) {
      return (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {[1, 2, 3, 4, 5].map(i => {
            const result = i * 9;
            const tens = Math.floor(result / 10);
            const ones = result % 10;
            return (
              <div key={i} className="flex flex-col items-center p-2 bg-neutral-100 rounded-lg">
                <span className="text-xs text-neutral-500 font-bold mb-1">9 × {i}</span>
                <div className="flex text-lg font-bold">
                  <span className={tens > 0 ? "text-primary-500" : "text-transparent"}>{tens > 0 ? tens : 0}</span>
                  <span className="text-secondary-500">{ones}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    // Fallback/Generic visual for others
    return (
      <div className="flex gap-2 justify-center mt-4 text-4xl opacity-50">
        ✨ 🔍 💡
      </div>
    );
  };

  return (
    <Card variant="glass" className="border-primary-200 bg-white/60">
      <h3 className="text-xl font-bold text-primary-800 mb-2 flex items-center gap-2">
        <span>🕵️‍♀️</span> Pattern Detective
      </h3>
      <p className="text-neutral-700 font-medium">
        {getPatternDescription()}
      </p>
      {renderPatternVisual()}
    </Card>
  );
};
