import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getBinApproachTarget, getKeyboardMove, type MoveDirection } from '../src/utils/movement';

test('held-key speed is independent of 30, 60 and 144 Hz frame rates', () => {
  const held = new Set<MoveDirection>(['right', 'down']);
  for (const rate of [30, 60, 144]) {
    let position = { x: 20, y: 50 };
    for (let frame = 0; frame < rate; frame++) {
      position = getKeyboardMove(position.x, position.y, held, 1000 / rate);
    }
    assert(Math.abs(position.x - 42.8) < 0.0001);
    assert(Math.abs(position.y - 71) < 0.0001);
  }
});

test('keyboard movement clamps bounds, stalls and opposing keys', () => {
  assert.deepEqual(getKeyboardMove(4, 44, new Set(['left', 'up']), 16.67), { x: 4, y: 44 });
  assert.deepEqual(getKeyboardMove(96, 100, new Set(['right', 'down']), 16.67), { x: 96, y: 100 });
  assert.deepEqual(getKeyboardMove(50, 68, new Set(['left', 'right']), 16.67), { x: 50, y: 68 });
  assert.deepEqual(getKeyboardMove(50, 68, new Set(['right']), -10), { x: 50, y: 68 });
  assert.deepEqual(getKeyboardMove(50, 68, new Set(['right']), 5000), { x: 51.14, y: 68 });
});

test('approaches actual bin image with an 8px gap and aligned feet across viewport sizes', () => {
  for (const width of [375, 768, 1366]) {
    for (const robotWidth of [112, 168]) {
      const area = { left: 20, right: 20 + width, top: 70, bottom: 670, width, height: 600 };
      for (const organic of [true, false]) {
        const left = organic ? 32 : width - 92;
        const bin = { left, right: left + 80, top: 500, bottom: 620, width: 80, height: 120 };
        const target = getBinApproachTarget(area, bin, robotWidth, organic);
        const center = area.left + target.x / 100 * area.width;
        assert(Math.abs((organic ? center - robotWidth / 2 - bin.right
          : bin.left - center - robotWidth / 2) - 8) < 0.001);
        assert(Math.abs(area.top + target.y / 100 * area.height - bin.bottom) < 0.001);
      }
    }
  }
});
