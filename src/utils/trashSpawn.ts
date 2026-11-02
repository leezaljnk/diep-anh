export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function getTrashSpawnSlots(
  area: Rect,
  bins: Rect[],
  playableArea: Rect = area,
  obstacles: Rect[] = []
) {
  const width = area.right - area.left;
  const height = area.bottom - area.top;
  const slots: { x: number; y: number }[] = [];
  const isCompact = width < 700 || height < 500;
  const playableHeight = playableArea.bottom - playableArea.top;
  const halfWidth = isCompact ? 46 : 90;
  const halfHeight = isCompact
    ? Math.min(38, Math.max(20, (playableHeight - 16) / 2))
    : 55;
  const clearance = isCompact ? Math.min(8, Math.max(3, playableHeight * 0.025)) : 24;
  const stepX = isCompact ? 76 : 128;
  const stepY = isCompact ? 28 : 48;
  const blockers = [...bins, ...obstacles];
  const candidateXs = new Set<number>();
  const candidateYs = new Set<number>();

  for (let cx = playableArea.left + halfWidth + clearance;
    cx <= playableArea.right - halfWidth - clearance;
    cx += stepX) candidateXs.add(cx);
  for (let cy = playableArea.top + halfHeight + clearance;
    cy <= playableArea.bottom - halfHeight - clearance;
    cy += stepY) candidateYs.add(cy);
  for (const blocker of blockers) {
    candidateXs.add(blocker.left - halfWidth - clearance - 1);
    candidateXs.add(blocker.right + halfWidth + clearance + 1);
    candidateYs.add(blocker.top - halfHeight - clearance - 1);
    candidateYs.add(blocker.bottom + halfHeight + clearance + 1);
  }

  for (const cy of candidateYs) {
    for (const cx of candidateXs) {
      if (cx < playableArea.left + halfWidth + clearance ||
        cx > playableArea.right - halfWidth - clearance ||
        cy < playableArea.top + halfHeight + clearance ||
        cy > playableArea.bottom - halfHeight - clearance) continue;
      const isClear = blockers.every(blocker =>
        cx + halfWidth + clearance < blocker.left ||
        cx - halfWidth - clearance > blocker.right ||
        cy + halfHeight + clearance < blocker.top ||
        cy - halfHeight - clearance > blocker.bottom
      );
      if (isClear) {
        slots.push({
          x: (cx - area.left) / width * 100,
          y: (cy - area.top) / height * 100,
        });
      }
    }
  }
  return slots;
}

export function getNonOverlappingTrashSpawnSlots(
  slots: { x: number; y: number }[],
  area: Rect,
  count: number,
  occupied: { x: number; y: number }[] = [],
  random: () => number = Math.random
) {
  const width = area.right - area.left;
  const height = area.bottom - area.top;
  const isCompact = width < 700 || height < 500;
  const minHorizontalDistance = isCompact ? 92 : 118;
  const minVerticalDistance = isCompact ? 78 : 104;
  const candidates = [...slots];

  for (let index = candidates.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }

  const rows = new Map<number, { x: number; y: number }[]>();
  for (const candidate of candidates) {
    const row = Math.floor(candidate.y / 100 * height / 56);
    const rowSlots = rows.get(row) || [];
    rowSlots.push(candidate);
    rows.set(row, rowSlots);
  }

  const selected: { x: number; y: number }[] = [];
  while (selected.length < count) {
    let addedInRound = false;
    for (const rowSlots of rows.values()) {
      const slotIndex = rowSlots.findIndex(candidate =>
        [...occupied, ...selected].every(point =>
          Math.abs(candidate.x - point.x) / 100 * width >= minHorizontalDistance ||
          Math.abs(candidate.y - point.y) / 100 * height >= minVerticalDistance
        )
      );
      if (slotIndex === -1) continue;
      selected.push(rowSlots.splice(slotIndex, 1)[0]);
      addedInRound = true;
      if (selected.length === count) return selected;
    }
    if (!addedInRound) break;
  }

  return selected;
}
