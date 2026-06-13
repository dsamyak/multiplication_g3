import { TableId } from '../types';
import { PlayQuestion, WorldConfig } from '../types/play';
import { shuffle } from './shuffle';

export const WORLDS: WorldConfig[] = [
  { id: 0, table: 6, name: 'Coral Reef World', icon: '🪸', color: '#ff4081', desc: 'Table of 6 · Questions 1–10' },
  { id: 1, table: 7, name: 'Jungle Canopy World', icon: '🌴', color: '#4caf50', desc: 'Table of 7 · Questions 11–20' },
  { id: 2, table: 8, name: 'Space Station World', icon: '🚀', color: '#03a9f4', desc: 'Table of 8 · Questions 21–30' },
  { id: 3, table: 9, name: 'Ancient Temple World', icon: '🏛️', color: '#ff9800', desc: 'Table of 9 · Questions 31–40' },
];

const EMOJIS = ['🪸', '🐠', '🌿', '🚀', '⭐', '🏛️', '🔢', '✨'];

function distractors(correct: number, count = 3): number[] {
  const set = new Set<number>();
  const offsets = [-3, -2, -1, 1, 2, 3, 4, -4];
  shuffle(offsets).forEach((o) => {
    const d = correct + o;
    if (d > 0 && d !== correct && set.size < count) set.add(d);
  });
  while (set.size < count) {
    const d = correct + set.size + 1;
    if (d !== correct) set.add(d);
  }
  return shuffle([correct, ...Array.from(set)]);
}

function genProduct(table: TableId, n: number, world: number, id: string): PlayQuestion {
  const product = table * n;
  const emoji = EMOJIS[table % EMOJIS.length];
  return {
    id,
    type: 'product',
    world,
    table,
    multiplicand: table,
    multiplier: n,
    product,
    missingSlot: 'product',
    questionText: `What is ${table} × ${n}?`,
    visual: 'arrayDiagram',
    objectEmoji: emoji,
    explanation: `${table} × ${n} = ${product}. Think: ${n} groups of ${table}!`,
    options: distractors(product),
    correctAnswer: product,
  };
}

function genMissingFactor(table: TableId, n: number, world: number, id: string): PlayQuestion {
  const product = table * n;
  const emoji = EMOJIS[table % EMOJIS.length];
  return {
    id,
    type: 'missing-factor',
    world,
    table,
    multiplicand: table,
    multiplier: n,
    product,
    missingSlot: 'multiplier',
    questionText: `${table} × ? = ${product}`,
    visual: 'sentence',
    objectEmoji: emoji,
    explanation: `${table} × ${n} = ${product}, so the missing number is ${n}.`,
    options: distractors(n, 3).map((x) => Math.max(1, Math.min(10, x))),
    correctAnswer: n,
  };
}

function genReverse(table: TableId, n: number, world: number, id: string): PlayQuestion {
  const product = table * n;
  const emoji = EMOJIS[table % EMOJIS.length];
  return {
    id,
    type: 'reverse',
    world,
    table,
    multiplicand: table,
    multiplier: n,
    product,
    missingSlot: 'multiplicand',
    questionText: `? × ${n} = ${product}`,
    visual: 'arrayDiagram',
    objectEmoji: emoji,
    explanation: `${table} × ${n} = ${product}. The first number is ${table}.`,
    options: distractors(table, 3).filter((x) => x >= 2 && x <= 12),
    correctAnswer: table,
  };
}

const WORD_TEMPLATES = [
  (char: string, a: number, b: number) =>
    `${char} packed ${a} boxes. Each box holds ${b} crayons. How many crayons in all?`,
  (char: string, a: number, b: number) =>
    `${char}'s rocket has ${a} fuel tanks. Each holds ${b} litres. How many litres total?`,
  (char: string, a: number, b: number) =>
    `${char} counted ${a} rows of coral, with ${b} pieces each. How many coral pieces?`,
  (char: string, a: number, b: number) =>
    `${char} picked ${b} bananas from each of ${a} trees. How many bananas altogether?`,
];

const CHARACTERS = ['Sarah', 'Miguel', 'John', 'Aiko'];

function genWordProblem(table: TableId, n: number, world: number, id: string): PlayQuestion {
  const product = table * n;
  const char = CHARACTERS[world];
  const template = WORD_TEMPLATES[world % WORD_TEMPLATES.length];
  const emoji = EMOJIS[world];
  return {
    id,
    type: 'word-problem',
    world,
    table,
    multiplicand: table,
    multiplier: n,
    product,
    missingSlot: 'product',
    questionText: template(char, table, n),
    visual: 'picture',
    objectEmoji: emoji,
    explanation: `${table} × ${n} = ${product}.`,
    options: distractors(product),
    correctAnswer: product,
  };
}

export function generateSessionQuestions(): PlayQuestion[] {
  const bank: PlayQuestion[] = [];
  const tables: TableId[] = [6, 7, 8, 9];

  tables.forEach((table, worldIdx) => {
    for (let n = 1; n <= 10; n++) {
      const base = `W${worldIdx}_N${n}`;
      const typeIdx = (n - 1) % 4;
      if (typeIdx === 0) bank.push(genProduct(table, n, worldIdx, `${base}_p`));
      else if (typeIdx === 1) bank.push(genMissingFactor(table, n, worldIdx, `${base}_mf`));
      else if (typeIdx === 2) bank.push(genReverse(table, n, worldIdx, `${base}_r`));
      else bank.push(genWordProblem(table, n, worldIdx, `${base}_wp`));
    }
  });

  return bank;
}
