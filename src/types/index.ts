export type TableId = 6 | 7 | 8 | 9;
export type ModuleId = 'learn' | 'tier1' | 'tier2' | 'boss';
export type CharacterName = 'John' | 'Sarah' | 'Miguel' | 'Aiko' | 'Priya';
export type BadgeId = 'coral-explorer' | 'jungle-champion' | 'space-ace' | 'temple-guardian' | 'crystal-master' | 'speed-demon' | 'perfect-score' | 'global-explorer';
export type QuestionType = 'product' | 'missing-factor' | 'reverse' | 'word-problem';

export interface Question {
  id: string;
  multiplicand: number | null;
  multiplier: number | null;
  answer: number;
  options: number[];
  type: QuestionType;
  text?: string;
}

export interface CrystalCatchScore {
  score: number;
  total: number;
  perfectFirstTry: boolean;
}

export interface StarRaceResult {
  score: number;
  timeRemaining: number;
  totalTime: number;
}
