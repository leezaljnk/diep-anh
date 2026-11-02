import type { TrashCategory, TrashItemDef } from '../types';

export const HEAD_TILT_ROUND_COUNT = 8;

export const HEAD_TILT_TRASH_IMAGES: Record<string, string> = {
  vo_hop_sua: './images/trash/vo_hop_sua.png',
  vo_hop_giay: './images/trash/vo_hop_giay.png',
  giay_cu: './images/trash/giay_cu.png',
  vo_chai: './images/trash/vo_chai.png',
  ong_nhua: './images/trash/ong_nhua.png',
  vo_keo: './images/trash/vo_keo.png',
  vo_lon: './images/trash/vo_lon.png',
  vo_chai_nhua: './images/trash/vo_chai_nhua.png',
  xuong_ca: './images/trash/xuong_ca.png',
  dui_ga: './images/trash/dui_ga.png',
  vo_dua_hau: './images/trash/vo_dua_hau.png',
  banh_mi: './images/trash/banh_mi.png',
  la_cay: './images/trash/la_cay.png',
  vo_chuoi: './images/trash/vo_chuoi.png',
  vo_tao: './images/trash/vo_tao.png',
};

export interface HeadTiltRound {
  item: TrashItemDef;
}

export function shuffleItems<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createHeadTiltRounds(
  items: readonly TrashItemDef[],
  random: () => number = Math.random
): HeadTiltRound[] {
  const organic = shuffleItems(items.filter(item => item.category === 'organic'), random);
  const recyclable = shuffleItems(items.filter(item => item.category === 'recyclable'), random);
  if (organic.length < HEAD_TILT_ROUND_COUNT / 2 || recyclable.length < HEAD_TILT_ROUND_COUNT / 2) {
    throw new Error('Cần ít nhất bốn vật phẩm cho mỗi nhóm rác để bắt đầu trò chơi.');
  }
  return shuffleItems([
    ...organic.slice(0, HEAD_TILT_ROUND_COUNT / 2),
    ...recyclable.slice(0, HEAD_TILT_ROUND_COUNT / 2),
  ], random).map(item => ({ item }));
}

export function evaluateHeadTiltChoice(item: TrashItemDef, choice: TrashCategory): boolean {
  return item.category === choice;
}

export interface PoseLandmark {
  x: number;
  visibility?: number;
}

export function getShoulderRelativeOffset(
  landmarks: readonly (PoseLandmark | undefined)[],
  minimumVisibility = 0.5
): number | null {
  const nose = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  if (!nose || !leftShoulder || !rightShoulder) return null;
  if ([nose, leftShoulder, rightShoulder].some(point =>
    !Number.isFinite(point.x) || (point.visibility ?? 1) < minimumVisibility
  )) return null;

  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
  if (shoulderWidth < 0.08) return null;
  const shoulderMidpoint = (leftShoulder.x + rightShoulder.x) / 2;
  return (nose.x - shoulderMidpoint) / shoulderWidth;
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0 || values.some(value => !Number.isFinite(value))) return null;
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export type HeadTiltDirection = 'left' | 'right';

export function headTiltDirectionToCategory(
  direction: HeadTiltDirection,
  previewMirrored = true
): TrashCategory {
  const visualDirection = previewMirrored
    ? direction === 'left' ? 'right' : 'left'
    : direction;
  return visualDirection === 'left' ? 'organic' : 'recyclable';
}

export class HeadTiltSignalDetector {
  private readonly samples: number[] = [];
  private activeDirection: HeadTiltDirection | null = null;
  private directionSince = 0;
  private locked = false;

  constructor(
    private readonly neutralOffset: number,
    private readonly enterThreshold = 0.18,
    private readonly exitThreshold = 0.08,
    private readonly dwellMs = 450
  ) {}

  lockUntilNeutral() {
    this.locked = true;
    this.activeDirection = null;
  }

  update(offset: number | null, timestampMs: number): HeadTiltDirection | null {
    if (offset === null || !Number.isFinite(offset)) {
      this.samples.length = 0;
      this.activeDirection = null;
      return null;
    }

    this.samples.push(offset - this.neutralOffset);
    if (this.samples.length > 5) this.samples.shift();
    const smoothedOffset = median(this.samples);
    if (smoothedOffset === null) return null;

    if (Math.abs(smoothedOffset) <= this.exitThreshold) {
      this.activeDirection = null;
      this.locked = false;
      return null;
    }
    if (this.locked || Math.abs(smoothedOffset) < this.enterThreshold) return null;

    const direction = smoothedOffset < 0 ? 'left' : 'right';
    if (direction !== this.activeDirection) {
      this.activeDirection = direction;
      this.directionSince = timestampMs;
      return null;
    }
    if (timestampMs - this.directionSince < this.dwellMs) return null;

    this.locked = true;
    return direction;
  }
}