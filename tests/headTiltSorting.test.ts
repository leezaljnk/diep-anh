import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { TRASH_ITEMS } from '../src/data/trashItems';
import {
  createHeadTiltRounds,
  evaluateHeadTiltChoice,
  getShoulderRelativeOffset,
  headTiltDirectionToCategory,
  HEAD_TILT_ROUND_COUNT,
  HEAD_TILT_TRASH_IMAGES,
  HeadTiltSignalDetector,
  median,
} from '../src/utils/headTiltSorting';

test('a game has eight unique, shuffled questions balanced across categories', () => {
  const rounds = createHeadTiltRounds(TRASH_ITEMS, () => 0.5);
  assert.equal(rounds.length, HEAD_TILT_ROUND_COUNT);
  assert.equal(new Set(rounds.map(({ item }) => item.id)).size, rounds.length);
  assert.equal(rounds.filter(({ item }) => item.category === 'organic').length, 4);
  assert.equal(rounds.filter(({ item }) => item.category === 'recyclable').length, 4);
  assert.throws(() => createHeadTiltRounds(TRASH_ITEMS.slice(0, 7)), /ít nhất bốn vật phẩm/);
});

test('answers use the existing categories and every trash question has an existing mapped image', () => {
  for (const item of TRASH_ITEMS) {
    assert.equal(typeof HEAD_TILT_TRASH_IMAGES[item.id], 'string', item.id);
    assert(existsSync(new URL(`../public/${HEAD_TILT_TRASH_IMAGES[item.id].replace(/^\.\//, '')}`, import.meta.url)));
    assert.equal(evaluateHeadTiltChoice(item, item.category), true);
    assert.equal(evaluateHeadTiltChoice(item, item.category === 'organic' ? 'recyclable' : 'organic'), false);
  }
  assert.equal(Object.keys(HEAD_TILT_TRASH_IMAGES).length, TRASH_ITEMS.length);
});

test('pose offset is normalized by shoulder width and rejects unreliable landmarks', () => {
  const landmarks = [] as ({ x: number; visibility?: number } | undefined)[];
  landmarks[0] = { x: 0.55, visibility: 0.9 };
  landmarks[11] = { x: 0.4, visibility: 0.9 };
  landmarks[12] = { x: 0.6, visibility: 0.9 };
  assert(Math.abs(getShoulderRelativeOffset(landmarks)! - 0.25) < 1e-9);
  landmarks[0] = { x: 0.55, visibility: 0.1 };
  assert.equal(getShoulderRelativeOffset(landmarks), null);
  landmarks[0] = { x: 0.55, visibility: 0.9 };
  landmarks[12] = { x: 0.45, visibility: 0.9 };
  assert.equal(getShoulderRelativeOffset(landmarks), null);
});

test('mirrored camera directions match the visible left and right choices', () => {
  assert.equal(headTiltDirectionToCategory('right'), 'organic');
  assert.equal(headTiltDirectionToCategory('left'), 'recyclable');
  assert.equal(headTiltDirectionToCategory('left', false), 'organic');
  assert.equal(headTiltDirectionToCategory('right', false), 'recyclable');
});

test('neutral calibration and dwell detection emit one direction until the player returns to neutral', () => {
  assert(Math.abs(median([0.11, 0.09, 0.1, 0.12])! - 0.105) < 1e-9);
  const detector = new HeadTiltSignalDetector(0, 0.18, 0.08, 400);
  assert.equal(detector.update(0.3, 0), null);
  assert.equal(detector.update(0.3, 200), null);
  assert.equal(detector.update(0.3, 450), 'right');
  assert.equal(detector.update(0.3, 900), null);
  detector.lockUntilNeutral();
  for (const time of [1000, 1100, 1200, 1300, 1400]) detector.update(0, time);
  for (const time of [1500, 1600, 1700, 1800, 1900]) {
    assert.equal(detector.update(-0.3, time), null);
  }
  assert.equal(detector.update(-0.3, 2100), 'left');
  assert.equal(detector.update(null, 2200), null);
});