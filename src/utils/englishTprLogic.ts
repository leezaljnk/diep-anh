import { ENGLISH_TPR_ACTIONS, TPR_DWELL_MS, type TprActionId } from '../data/englishTprActions';

export interface PosePoint { x: number; y: number; visibility?: number }
export type PoseMatch = 'matched' | 'observing' | 'out-of-frame';

export function pointDistance(first: PosePoint, second: PosePoint, aspectRatio = 1): number {
  return Math.hypot((first.x - second.x) * aspectRatio, first.y - second.y);
}

export function jointAngle(first: PosePoint, center: PosePoint, last: PosePoint, aspectRatio = 1): number {
  const firstX = (first.x - center.x) * aspectRatio;
  const firstY = first.y - center.y;
  const lastX = (last.x - center.x) * aspectRatio;
  const lastY = last.y - center.y;
  const length = Math.hypot(firstX, firstY) * Math.hypot(lastX, lastY);
  return length ? Math.acos(Math.max(-1, Math.min(1, (firstX * lastX + firstY * lastY) / length))) * 180 / Math.PI : 0;
}

export function matchTprPose(id: TprActionId, points: readonly PosePoint[], aspectRatio = 1): PoseMatch {
  const action = ENGLISH_TPR_ACTIONS.find(action => action.id === id);
  const visible = (index: number) => {
    const point = points[index];
    return point && Number.isFinite(point.x) && Number.isFinite(point.y) &&
      point.x > 0.01 && point.x < 0.99 && point.y > 0.01 && point.y < 0.99 &&
      Number.isFinite(point.visibility) && point.visibility! >= 0.6;
  };
  if (!action || !Number.isFinite(aspectRatio) || aspectRatio <= 0 || !action.joints.every(visible)) return 'out-of-frame';
  if ((id === 'touch-head' || id === 'sleepy') && !visible(15) && !visible(16)) return 'out-of-frame';
  const width = pointDistance(points[11], points[12], aspectRatio);
  if (width < 0.06) return 'out-of-frame';
  const near = (first: number, second: number, threshold: number) => visible(first) &&
    pointDistance(points[first], points[second], aspectRatio) < width * threshold;
  let matched = false;
  switch (id) {
    case 'hands-up':
      matched = points[15].y < points[7].y - width * 0.1 && points[16].y < points[8].y - width * 0.1;
      break;
    case 'touch-head':
      matched = near(15, 0, 0.65) || near(16, 0, 0.65);
      break;
    case 'clap':
      matched = near(15, 16, 0.3) && points[15].y > Math.min(points[11].y, points[12].y) - width * 0.3;
      break;
    case 'open-arms':
      matched = jointAngle(points[11], points[13], points[15], aspectRatio) > 150 &&
        jointAngle(points[12], points[14], points[16], aspectRatio) > 150 &&
        Math.abs(points[15].y - points[11].y) < width * 0.3 &&
        Math.abs(points[16].y - points[12].y) < width * 0.3 &&
        (points[15].x - points[11].x) * (points[16].x - points[12].x) < 0 &&
        pointDistance(points[15], points[16], aspectRatio) > width * 2;
      break;
    case 'sleepy': {
      const roll = Math.atan2(Math.abs(points[5].y - points[2].y), Math.abs(points[5].x - points[2].x) * aspectRatio) * 180 / Math.PI;
      matched = roll > 25 && (near(15, 7, 0.65) || near(16, 8, 0.65));
      break;
    }
    case 'surprised':
      matched = near(15, 7, 0.65) && near(16, 8, 0.65);
      break;
  }
  return matched ? 'matched' : 'observing';
}

export class PoseDwellTracker {
  private since: number | null = null;
  private previous: number | null = null;

  reset() { this.since = null; this.previous = null; }

  update(matched: boolean, timestamp: number): number {
    if (!matched || !Number.isFinite(timestamp)) { this.reset(); return 0; }
    if (this.previous === null || timestamp < this.previous || timestamp - this.previous > 250) this.since = timestamp;
    this.previous = timestamp;
    return Math.min(1, Math.max(0, (timestamp - this.since!) / TPR_DWELL_MS));
  }
}