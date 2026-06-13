import { CharacterName, TableId, Question } from '../types';

export const CHARACTERS: Record<CharacterName, { name: string; avatarUrl?: string }> = {
  John: { name: 'John' },
  Sarah: { name: 'Sarah' },
  Miguel: { name: 'Miguel' },
  Aiko: { name: 'Aiko' },
  Priya: { name: 'Priya' }
};

interface WordProblemTemplate {
  id: string;
  template: string;
  character: CharacterName;
}

const TEMPLATES: WordProblemTemplate[] = [
  { id: 'wp1', template: '{char} packed {a} boxes. Each box holds {b} crayons. How many crayons in all?', character: 'Aiko' },
  { id: 'wp2', template: "{char}'s rocket has {a} fuel tanks. Each holds {b} litres. How many litres total?", character: 'John' },
  { id: 'wp3', template: "{char} counted {a} rows of coral, with {b} pieces each. How many coral pieces?", character: 'Sarah' },
  { id: 'wp4', template: "{char} picked {a} bananas from each of {b} trees. How many bananas altogether?", character: 'Miguel' },
  { id: 'wp5', template: "{char} bought {a} books. Each book costs {b} dollars. How much did they spend in total?", character: 'Priya' },
  // Adding more so we have plenty
  { id: 'wp6', template: "{char} found {a} treasure chests. Each chest has {b} gold coins. How many coins total?", character: 'John' },
  { id: 'wp7', template: "{char} saw {a} groups of dolphins. There were {b} dolphins in each group. How many dolphins?", character: 'Sarah' },
  { id: 'wp8', template: "{char} baked {a} trays of cookies. Each tray had {b} cookies. How many cookies?", character: 'Aiko' },
  { id: 'wp9', template: "{char} planted {a} rows of trees. Each row had {b} trees. How many trees were planted?", character: 'Miguel' },
  { id: 'wp10', template: "{char} collected {a} bags of marbles. Each bag contains {b} marbles. How many marbles?", character: 'Priya' },
];

export function generateWordProblem(table: TableId): Question {
  const n = Math.ceil(Math.random() * 10);
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return {
    id: `wp-${Date.now()}-${Math.random()}`,
    multiplicand: table,
    multiplier: n,
    answer: table * n,
    type: 'word-problem',
    text: template.template
      .replace('{char}', CHARACTERS[template.character].name)
      .replace('{a}', String(table))
      .replace('{b}', String(n))
      .replace('{product}', String(table * n)),
    options: [table * n, table * n + table, table * n - table, table * n + 1].sort(() => Math.random() - 0.5).slice(0, 4),
  };
}
