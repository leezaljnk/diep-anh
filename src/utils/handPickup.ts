import { HEAD_TILT_TRASH_ITEMS, type HeadTiltTrashItem } from '../data/headTiltTrashItems';
import type { TrashCategory } from '../types';
import { shuffleItems } from './headTiltSorting';

export interface HandPoint { x: number; y: number }
export type HandGesture = 'open' | 'closed';
export const HAND_PICKUP_COUNT = 5;
export const HAND_PICKUP_MAX_COUNT = HEAD_TILT_TRASH_ITEMS.length;
export const PICKUP_ORIGIN: HandPoint = { x: 0.5, y: 0.37 };
export interface HandPickupRound extends HeadTiltTrashItem { origin: HandPoint }
export const HAND_DROP_ZONES = {
  organic: { x: 0.08, y: 0.64, width: 0.34, height: 0.3 },
  recyclable: { x: 0.58, y: 0.64, width: 0.34, height: 0.3 },
} satisfies Record<TrashCategory, { x: number; y: number; width: number; height: number }>;

export function isValidHandPickupCount(count: number): boolean {
  return Number.isSafeInteger(count) && count >= 2 && count <= HAND_PICKUP_MAX_COUNT;
}

export function createHandPickupPosition(random: () => number = Math.random): HandPoint {
  return { x: 0.16 + random() * 0.68, y: 0.3 + random() * 0.13 };
}

export function createHandPickupRounds(random: () => number = Math.random, count = HAND_PICKUP_COUNT): HandPickupRound[] {
  if (!isValidHandPickupCount(count)) throw new Error(`Số món phải là số nguyên từ 2 đến ${HAND_PICKUP_MAX_COUNT}.`);
  const organic = shuffleItems(HEAD_TILT_TRASH_ITEMS.filter(item => item.category === 'organic'), random);
  const inorganic = shuffleItems(HEAD_TILT_TRASH_ITEMS.filter(item => item.category === 'recyclable'), random);
  const organicCount = Math.max(count - inorganic.length, Math.min(organic.length, Math.floor(count / 2) + (count % 2 && random() >= 0.5 ? 1 : 0)));
  return shuffleItems([...organic.slice(0, organicCount), ...inorganic.slice(0, count - organicCount)], random)
    .map(item => ({ ...item, origin: createHandPickupPosition(random) }));
}

export function mapHandPoint(point: HandPoint, previous: HandPoint | null = null): HandPoint {
  const target = { x: Math.max(0, Math.min(1, 1 - point.x)), y: Math.max(0, Math.min(1, point.y)) };
  if (!previous) return target;
  return { x: previous.x + (target.x - previous.x) * 0.45, y: previous.y + (target.y - previous.y) * 0.45 };
}

export function canPickUp(point: HandPoint, origin: HandPoint = PICKUP_ORIGIN): boolean {
  return Math.hypot((point.x - origin.x) / 0.16, (point.y - origin.y) / 0.18) <= 1;
}

export function getHandDropCategory(point: HandPoint): TrashCategory | null {
  for (const category of ['organic', 'recyclable'] as const) {
    const zone = HAND_DROP_ZONES[category];
    if (point.x >= zone.x - 0.035 && point.x <= zone.x + zone.width + 0.035 &&
        point.y >= zone.y - 0.04 && point.y <= zone.y + zone.height + 0.04) return category;
  }
  return null;
}

export interface HandPickupState {
  holding: boolean;
  gesture: HandGesture | null;
  result: 'correct' | 'wrong' | 'miss' | null;
}

export function stepHandPickup(
  state: HandPickupState, point: HandPoint, gesture: HandGesture, category: TrashCategory, origin: HandPoint = PICKUP_ORIGIN,
): HandPickupState {
  if (state.gesture === null) return { holding: false, gesture, result: null };
  if (gesture === state.gesture) return { ...state, result: null };
  if (gesture === 'closed') return { holding: canPickUp(point, origin), gesture, result: null };
  if (!state.holding) return { holding: false, gesture, result: null };
  const target = getHandDropCategory(point);
  return { holding: false, gesture, result: target === null ? 'miss' : target === category ? 'correct' : 'wrong' };
}

export function getHandOpenness(landmarks: readonly HandPoint[], aspectRatio = 1): number | null {
  if (landmarks.length !== 21 || !Number.isFinite(aspectRatio) || aspectRatio <= 0 ||
      landmarks.some(point => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return null;
  const distance = (first: HandPoint, second: HandPoint) => Math.hypot((first.x - second.x) * aspectRatio, first.y - second.y);
  const palmLength = distance(landmarks[0], landmarks[9]);
  if (palmLength < 0.015) return null;
  return [8, 12, 16, 20].reduce((sum, tip) => sum + distance(landmarks[tip], landmarks[0]) / palmLength, 0) / 4;
}

export class HandGestureDetector {
  private stable: HandGesture | null = null;
  private candidate: HandGesture | null = null;
  private candidateSince = 0;

  reset() {
    this.stable = null;
    this.candidate = null;
    this.candidateSince = 0;
  }

  update(openness: number, timestamp: number): HandGesture | null {
    if (!Number.isFinite(openness) || !Number.isFinite(timestamp)) { this.reset(); return null; }
    const next = openness < 1.25 ? 'closed' : openness > 1.65 ? 'open' : this.stable;
    if (next === null || next === this.stable) {
      this.candidate = null;
      return this.stable;
    }
    if (next !== this.candidate) {
      this.candidate = next;
      this.candidateSince = timestamp;
    } else if (timestamp - this.candidateSince >= 140) {
      this.stable = next;
      this.candidate = null;
    }
    return this.stable;
  }
}