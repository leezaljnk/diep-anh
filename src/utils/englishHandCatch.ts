import { ENGLISH_CATCH_ROUNDS, ENGLISH_VOCAB, type EnglishWordItem } from '../data/englishVocab';
import { shuffleItems } from './headTiltSorting';
import type { HandGesture, HandPoint } from './handPickup';

export interface EnglishCatchRound { target: EnglishWordItem; choices: EnglishWordItem[] }
export const CATCH_ORIGINS: readonly HandPoint[] = [{ x: 0.2, y: 0.32 }, { x: 0.5, y: 0.32 }, { x: 0.8, y: 0.32 }];
export const CATCH_BASKET = { x: 0.32, y: 0.74, width: 0.36, height: 0.24 };

export function createEnglishCatchRounds(random: () => number = Math.random): EnglishCatchRound[] {
  return shuffleItems(ENGLISH_VOCAB, random).slice(0, ENGLISH_CATCH_ROUNDS).map(target => ({
    target,
    choices: shuffleItems([target, ...shuffleItems(ENGLISH_VOCAB.filter(item => item.category === target.category && item.id !== target.id), random).slice(0, 2)], random),
  }));
}

export interface EnglishCatchState { gesture: HandGesture | null; held: number | null }
export const EMPTY_ENGLISH_CATCH: EnglishCatchState = { gesture: null, held: null };

export function stepEnglishCatch(state: EnglishCatchState, point: HandPoint, gesture: HandGesture, round: EnglishCatchRound, aspectRatio = 4 / 3): {
  state: EnglishCatchState; result: 'correct' | 'retry' | null;
} {
  if (state.gesture === null) return { state: { gesture, held: null }, result: null };
  if (state.gesture === gesture) return { state, result: null };
  if (gesture === 'closed') {
    const held = CATCH_ORIGINS.findIndex((origin, index) => index < round.choices.length &&
      Math.hypot(point.x - origin.x, (point.y - origin.y) / aspectRatio) <= 0.115);
    return { state: { gesture, held: held < 0 ? null : held }, result: null };
  }
  if (state.held === null) return { state: { gesture, held: null }, result: null };
  const inside = point.x >= CATCH_BASKET.x && point.x <= CATCH_BASKET.x + CATCH_BASKET.width &&
    point.y >= CATCH_BASKET.y && point.y <= CATCH_BASKET.y + CATCH_BASKET.height;
  return {
    state: { gesture, held: null },
    result: inside && round.choices[state.held]?.id === round.target.id ? 'correct' : 'retry',
  };
}