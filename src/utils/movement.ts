interface Bounds {
  left: number;
  right: number;
  bottom: number;
  top: number;
  width: number;
  height: number;
}

export type MoveDirection = 'left' | 'right' | 'up' | 'down';

export function getKeyboardMove(
  x: number,
  y: number,
  held: ReadonlySet<MoveDirection>,
  elapsedMs: number
) {
  // Cap catch-up after a stalled/hidden frame; retain the original speed at 60 Hz.
  const frames = Math.max(0, Math.min(elapsedMs, 50)) / (1000 / 60);
  const dx = Number(held.has('right')) - Number(held.has('left'));
  const dy = (held.has('down') ? 0.35 : 0) - (held.has('up') ? 0.32 : 0);
  return {
    x: Math.max(4, Math.min(96, x + dx * 0.38 * frames)),
    y: Math.max(44, Math.min(100, y + dy * frames)),
  };
}

export function getCommandMoveDuration(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  area: { width: number; height: number }
) {
  const distance = Math.hypot(
    (targetX - startX) / 100 * area.width,
    (targetY - startY) / 100 * area.height
  );
  return Math.max(600, distance / 200 * 1000);
}

export function getBinApproachTarget(
  area: Bounds,
  bin: Bounds,
  robotWidth: number,
  organic: boolean
) {
  const halfWidth = robotWidth / 2;
  const centerX = organic ? bin.right + halfWidth + 8 : bin.left - halfWidth - 8;
  const x = Math.max(halfWidth, Math.min(area.width - halfWidth, centerX - area.left));
  const y = Math.max(0, Math.min(area.height, bin.bottom - area.top));
  return { x: x / area.width * 100, y: y / area.height * 100 };
}
