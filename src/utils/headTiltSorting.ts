import type { TrashCategory } from '../types';
import { HEAD_TILT_TRASH_ITEMS, type HeadTiltTrashItem } from '../data/headTiltTrashItems';

export const HEAD_TILT_ROUND_COUNT = 20;
export const HEAD_TILT_QUESTION_SECONDS = 10;
export const HEAD_TILT_WARNING_SECONDS = 5;

export function isValidHeadTiltRoundCount(count: number): boolean {
  return Number.isSafeInteger(count) && count > 0;
}

export function getHeadTiltCountdown(elapsedSeconds: number): { remaining: number; warning: boolean } {
  const remaining = Math.max(0, HEAD_TILT_QUESTION_SECONDS - Math.floor(elapsedSeconds));
  return { remaining, warning: remaining <= HEAD_TILT_WARNING_SECONDS };
}
export const HEAD_TILT_CALIBRATION_SAMPLE_COUNT = 20;
export const HEAD_TILT_ENTER_RADIANS = Math.PI / 18;
export const HEAD_TILT_EXIT_RADIANS = Math.PI / 36;

export type HeadTiltCameraState = 'off' | 'requesting' | 'calibrating' | 'ready' | 'error';

export function isHeadTiltCameraReady(cameraState: HeadTiltCameraState, streamActive: boolean): boolean {
  return cameraState === 'ready' && streamActive;
}

export const HEAD_TILT_TRASH_IMAGES: Record<string, string> = Object.fromEntries(
  HEAD_TILT_TRASH_ITEMS.map(item => [item.id, item.image])
);

export interface HeadTiltRound {
  item: Pick<HeadTiltTrashItem, 'id' | 'category'>;
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
  items: readonly HeadTiltRound['item'][] = HEAD_TILT_TRASH_ITEMS,
  random: () => number = Math.random,
  roundCount = HEAD_TILT_ROUND_COUNT
): HeadTiltRound[] {
  if (!isValidHeadTiltRoundCount(roundCount)) throw new Error('Số câu hỏi phải là số nguyên dương.');
  if (items.length === 0) throw new Error('Cần ít nhất một ảnh rác để bắt đầu trò chơi.');
  const rounds: HeadTiltRound[] = [];
  while (rounds.length < roundCount) {
    const cycle = shuffleItems(items, random);
    if (cycle.length > 1 && cycle[0].id === rounds.at(-1)?.item.id) {
      [cycle[0], cycle[1]] = [cycle[1], cycle[0]];
    }
    rounds.push(...cycle.slice(0, roundCount - rounds.length).map(item => ({ item })));
  }
  return rounds;
}

export function evaluateHeadTiltChoice(item: HeadTiltRound['item'], choice: TrashCategory): boolean {
  return item.category === choice;
}

export interface PoseLandmark {
  x: number;
  y?: number;
  visibility?: number;
}

export function getHeadRollRadians(
  landmarks: readonly (PoseLandmark | undefined)[],
  frameWidth: number,
  frameHeight: number,
  minimumVisibility = 0.5
): number | null {
  const firstEye = landmarks[2];
  const secondEye = landmarks[5];
  if (!firstEye || !secondEye) return null;
  if (!Number.isFinite(frameWidth) || !Number.isFinite(frameHeight) || frameWidth <= 0 || frameHeight <= 0) return null;
  const [imageLeftEye, imageRightEye] = firstEye.x < secondEye.x ? [firstEye, secondEye] : [secondEye, firstEye];
  const leftY = imageLeftEye.y;
  const rightY = imageRightEye.y;
  if (typeof leftY !== 'number' || typeof rightY !== 'number') return null;
  if ([imageLeftEye, imageRightEye].some(point =>
    !Number.isFinite(point.x) || !Number.isFinite(point.y) ||
    point.x < 0 || point.x > 1 || point.y! < 0 || point.y! > 1 ||
    !Number.isFinite(point.visibility ?? 1) || (point.visibility ?? 1) < minimumVisibility
  )) return null;
  const eyeWidth = imageRightEye.x - imageLeftEye.x;
  if (eyeWidth < 0.025) return null;
  return Math.atan2((rightY - leftY) * frameHeight, eyeWidth * frameWidth);
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

export class HeadTiltNeutralCalibration {
  private samples: number[] = [];
  private lastTimestampMs: number | null = null;

  get sampleCount(): number {
    return this.samples.length;
  }

  update(offset: number | null, timestampMs: number): number | null {
    if (this.lastTimestampMs !== null && (timestampMs - this.lastTimestampMs > 300 || timestampMs <= this.lastTimestampMs)) {
      this.samples = [];
    }
    this.lastTimestampMs = timestampMs;
    if (offset === null || !Number.isFinite(offset)) {
      this.samples = [];
      return null;
    }
    this.samples.push(offset);
    if (Math.max(...this.samples) - Math.min(...this.samples) > 0.08) {
      this.samples = [offset];
    }
    if (this.samples.length > HEAD_TILT_CALIBRATION_SAMPLE_COUNT) this.samples.shift();
    return this.samples.length === HEAD_TILT_CALIBRATION_SAMPLE_COUNT ? median(this.samples) : null;
  }
}

export type HeadTiltDirection = 'left' | 'right';

export interface HeadTiltSignalStatus {
  offset: number | null;
  needsNeutral: boolean;
  direction: HeadTiltDirection | null;
  progress: number;
  enabled: boolean;
}

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
  private lastTimestampMs: number | null = null;
  private smoothedOffset: number | null = null;
  private inputEnabled = false;

  constructor(
    private readonly neutralOffset: number,
    private readonly enterThreshold = 0.18,
    private readonly exitThreshold = 0.08,
    private readonly dwellMs = 450
  ) {}

  get status(): HeadTiltSignalStatus {
    return {
      offset: this.smoothedOffset,
      needsNeutral: this.locked,
      direction: this.locked ? null : this.activeDirection,
      progress: !this.locked && this.activeDirection && this.lastTimestampMs !== null
        ? Math.min(1, (this.lastTimestampMs - this.directionSince) / this.dwellMs)
        : 0,
      enabled: this.inputEnabled,
    };
  }

  lockUntilNeutral() {
    this.locked = true;
    this.activeDirection = null;
    this.samples.length = 0;
    this.smoothedOffset = null;
  }

  update(offset: number | null, timestampMs: number, canSelect = true): HeadTiltDirection | null {
    this.inputEnabled = canSelect;
    if (this.lastTimestampMs !== null && (timestampMs - this.lastTimestampMs > 300 || timestampMs <= this.lastTimestampMs)) {
      this.samples.length = 0;
      this.activeDirection = null;
    }
    this.lastTimestampMs = timestampMs;
    if (offset === null || !Number.isFinite(offset)) {
      this.samples.length = 0;
      this.activeDirection = null;
      this.smoothedOffset = null;
      return null;
    }

    this.samples.push(offset - this.neutralOffset);
    if (this.samples.length > 5) this.samples.shift();
    const smoothedOffset = median(this.samples);
    this.smoothedOffset = smoothedOffset;
    if (smoothedOffset === null) return null;

    if (Math.abs(smoothedOffset) <= this.exitThreshold) {
      this.activeDirection = null;
      this.locked = false;
      return null;
    }
    if (this.locked) return null;
    if (!canSelect || Math.abs(smoothedOffset) < this.enterThreshold) {
      this.activeDirection = null;
      return null;
    }

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