import type { TrashCategory } from '../types';

export interface IdentifiableTrashItem {
  id: string;
}

export function drawTrashItems<T extends IdentifiableTrashItem>(
  items: readonly T[],
  remaining: readonly T[],
  count: number,
  random: () => number = Math.random
): { selected: T[]; remaining: T[] } {
  const selected: T[] = [];
  let bag = [...remaining];

  while (selected.length < count && items.length > 0) {
    if (bag.length === 0) {
      bag = [...items];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }

    const next = bag.shift();
    if (next) selected.push(next);
  }

  return { selected, remaining: bag };
}

export function drawClassroomTrashItems<T extends IdentifiableTrashItem & { category: TrashCategory }>(
  items: readonly T[],
  remaining: readonly T[],
  random: () => number = Math.random,
  batchSize = 5
): { selected: T[]; remaining: T[] } {
  if (batchSize < 5) {
    return drawTrashItems(items, remaining, batchSize, random);
  }

  const selected: T[] = [];
  const nextRemaining: T[] = [];
  const quotas = { recyclable: 3, organic: 2 } as const;

  for (const category of ['recyclable', 'organic'] as const) {
    const pool = items.filter(item => item.category === category);
    const count = quotas[category];
    if (pool.length < count) {
      throw new Error(`Không đủ rác ${category} để tạo lô lớp học: cần ${count} món.`);
    }
    let bag = remaining.filter(item => item.category === category);
    if (bag.length < count) {
      const refill = drawTrashItems(pool, [], pool.length, random).selected;
      const pendingIds = new Set(bag.map(item => item.id));
      // Finish the old cycle, then avoid repeating those items in the same batch.
      bag = [
        ...bag,
        ...refill.filter(item => !pendingIds.has(item.id)),
        ...refill.filter(item => pendingIds.has(item.id)),
      ];
    }
    const draw = drawTrashItems(pool, bag, count, random);
    selected.push(...draw.selected);
    nextRemaining.push(...draw.remaining);
  }

  return {
    selected: drawTrashItems(selected, [], selected.length, random).selected,
    remaining: nextRemaining,
  };
}
