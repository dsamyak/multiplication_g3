import { TableId, CharacterName } from '../types';

export interface WorldConfig {
  id: TableId;
  name: string;
  themeColor: string;
  character: CharacterName;
  description: string;
  patternTrick: string;
}

export const WORLDS: Record<TableId, WorldConfig> = {
  6: {
    id: 6,
    name: 'Coral Reef World',
    themeColor: 'world-coral',
    character: 'Sarah',
    description: 'Explore the colourful coral reef and discover the magic of sixes!',
    patternTrick: 'Always even! Ends in 0, 2, 4, 6, 8.'
  },
  7: {
    id: 7,
    name: 'Jungle Canopy World',
    themeColor: 'world-jungle',
    character: 'Miguel',
    description: 'Swing through the vines and master the tricky sevens.',
    patternTrick: 'No shortcut — memory + story!'
  },
  8: {
    id: 8,
    name: 'Space Station World',
    themeColor: 'world-space',
    character: 'John',
    description: 'Float among the stars to uncover the eights.',
    patternTrick: 'Double-double-double!'
  },
  9: {
    id: 9,
    name: 'Ancient Temple World',
    themeColor: 'world-temple',
    character: 'Aiko',
    description: 'Solve the temple mysteries to learn the nines.',
    patternTrick: 'Finger trick & digits sum to 9.'
  }
};
