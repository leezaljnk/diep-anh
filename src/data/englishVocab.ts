import { VOCAB_ITEMS } from '../../public/english/data/englishVocab';
export type { EnglishCategory, EnglishWordItem } from '../../public/english/data/englishVocab';

export const ENGLISH_VOCAB = VOCAB_ITEMS.filter(item =>
  ['school', 'animals', 'food'].includes(item.category) && item.id !== 'eraser'
).map(item => ({
  ...item,
  image: `english/images/illustrated/${item.id}.png`,
}));

export const ENGLISH_CATCH_ROUNDS = 15;