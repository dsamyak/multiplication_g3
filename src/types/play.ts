import { TableId } from './index';

export type PlayQuestionType = 'product' | 'missing-factor' | 'reverse' | 'word-problem';

export interface PlayQuestion {
  id: string;
  type: PlayQuestionType;
  world: number;
  table: TableId;
  multiplicand: number;
  multiplier: number;
  product: number;
  missingSlot?: 'product' | 'multiplier' | 'multiplicand' | 'none';
  questionText: string;
  visual?: 'arrayDiagram' | 'picture' | 'sentence' | null;
  objectEmoji?: string;
  explanation: string;
  options: number[];
  correctAnswer: number;
}

export interface PlayStats {
  score: number;
  xp: number;
  maxStreak: number;
  totalAnswered: number;
  worldResults: Record<number, { score: number; total: number; stars: number }>;
}

export interface WorldConfig {
  id: number;
  table: TableId;
  name: string;
  icon: string;
  color: string;
  desc: string;
}
