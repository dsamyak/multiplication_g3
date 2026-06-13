import { TableId, Question, QuestionType } from '../types';
import { shuffle } from './shuffle';
import { generateWordProblem } from '../data/wordProblems';

export function generateTableQuestions(
  tableId: TableId,
  count: number,
  types: QuestionType[] = ['product']
): Question[] {
  const pool: Question[] = [];

  for (let n = 1; n <= 10; n++) {
    const product = tableId * n;

    if (types.includes('product')) {
      const opts = shuffle([product, product + tableId, product - tableId, product + 1]).slice(0, 4);
      pool.push({ id: `${tableId}x${n}`, multiplicand: tableId, multiplier: n, answer: product, options: opts, type: 'product' });
    }
    if (types.includes('missing-factor')) {
      const opts = shuffle([n, n + 1, n - 1, n + 2].map(x => Math.max(1, x))).slice(0, 4);
      pool.push({ id: `${tableId}x${n}-mf`, multiplicand: tableId, multiplier: null, answer: n, options: opts, type: 'missing-factor' });
    }
    if (types.includes('reverse')) {
      const opts = shuffle([product, product + n, product - n, product + 2]).slice(0, 4);
      pool.push({ id: `${tableId}x${n}-rev`, multiplicand: null, multiplier: n, answer: product, options: opts, type: 'reverse' });
    }
    if (types.includes('word-problem')) {
      pool.push(generateWordProblem(tableId));
    }
  }

  return shuffle(pool).slice(0, count);
}

export function generateMixedQuestions(
  tables: TableId[],
  count: number,
  types: QuestionType[]
): Question[] {
  const allQuestions: Question[] = [];
  tables.forEach(t => allQuestions.push(...generateTableQuestions(t, 20, types))); // pull enough to mix
  return shuffle(allQuestions).slice(0, count);
}
