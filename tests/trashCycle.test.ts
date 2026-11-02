import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TRASH_ITEMS } from '../src/data/trashItems';
import { drawClassroomTrashItems } from '../src/utils/trashCycle';

test('every classroom batch has three recyclable and two organic distinct items across cycle boundaries', () => {
  for (const random of [() => 0, () => 0.5, () => 0.999999, Math.random]) {
    let remaining: typeof TRASH_ITEMS = [];
    const streams = { recyclable: [] as string[], organic: [] as string[] };
    for (let batch = 0; batch < 100; batch++) {
      const draw = drawClassroomTrashItems(TRASH_ITEMS, remaining, random);
      for (const category of ['recyclable', 'organic'] as const) {
        const pending = remaining.filter(item => item.category === category);
        const chosen = draw.selected.filter(item => item.category === category);
        if (pending.length < chosen.length) {
          assert(pending.every(item => chosen.some(next => next.id === item.id)));
        } else {
          assert(chosen.every(item => pending.some(previous => previous.id === item.id)));
          assert.deepEqual(
            draw.remaining.filter(item => item.category === category),
            pending.slice(chosen.length)
          );
        }
      }
      remaining = draw.remaining;
      assert.equal(draw.selected.length, 5);
      assert.equal(new Set(draw.selected.map(item => item.id)).size, 5);
      assert.equal(draw.selected.filter(item => item.category === 'recyclable').length, 3);
      assert.equal(draw.selected.filter(item => item.category === 'organic').length, 2);
      for (const category of ['recyclable', 'organic'] as const) {
        const pool = TRASH_ITEMS.filter(item => item.category === category);
        streams[category].push(...draw.selected.filter(item => item.category === category).map(item => item.id));
        assert(remaining.filter(item => item.category === category).length < pool.length);
      }
    }
    for (const category of ['recyclable', 'organic'] as const) {
      const pool = TRASH_ITEMS.filter(item => item.category === category);
      assert.deepEqual(new Set(streams[category]), new Set(pool.map(item => item.id)));
    }
  }
});

test('each category finishes its pending cycle before drawing new items', () => {
  const recyclable = TRASH_ITEMS.filter(item => item.category === 'recyclable');
  const organic = TRASH_ITEMS.filter(item => item.category === 'organic');
  const pending = [recyclable[0], organic[0]];
  const snapshot = [...pending];
  const draw = drawClassroomTrashItems(TRASH_ITEMS, pending, () => 0);
  for (const item of pending) {
    assert.equal(draw.selected.filter(selected => selected.id === item.id).length, 1);
    assert(draw.remaining.some(remaining => remaining.id === item.id));
  }
  assert.deepEqual(pending, snapshot);
});

test('classroom placement is randomized rather than always grouped by category', () => {
  const first = drawClassroomTrashItems(TRASH_ITEMS, [], () => 0).selected;
  const second = drawClassroomTrashItems(TRASH_ITEMS, [], () => 0.999999).selected;
  assert.notDeepEqual(first.map(item => item.id), second.map(item => item.id));
});

test('partial classroom batches continue drawing every trash category through the full cycle', () => {
  let remaining: typeof TRASH_ITEMS = [];
  const drawn: string[] = [];
  const categories = new Set<string>();

  while (drawn.length < TRASH_ITEMS.length) {
    const draw = drawClassroomTrashItems(TRASH_ITEMS, remaining, () => 0, 1);
    assert.equal(draw.selected.length, 1);
    drawn.push(draw.selected[0].id);
    categories.add(draw.selected[0].category);
    remaining = draw.remaining;
  }

  assert.equal(new Set(drawn).size, TRASH_ITEMS.length);
  assert.deepEqual(categories, new Set(['organic', 'recyclable']));
});

test('insufficient category data fails explicitly', () => {
  assert.throws(() => drawClassroomTrashItems([], []), /Không đủ rác recyclable/);
  assert.throws(
    () => drawClassroomTrashItems(TRASH_ITEMS.filter(item => item.category === 'recyclable'), []),
    /Không đủ rác organic/
  );
});
