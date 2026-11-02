import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canPickUp, createHandPickupRounds, getHandDropCategory, getHandOpenness,
  createHandPickupPosition, HAND_DROP_ZONES, HAND_PICKUP_MAX_COUNT, isValidHandPickupCount,
  HandGestureDetector, mapHandPoint, PICKUP_ORIGIN, stepHandPickup,
} from '../src/utils/handPickup';

test('five unique camera items include both categories even at random extremes', () => {
  for (const random of [() => 0, () => 0.999, Math.random]) {
    for (let iteration = 0; iteration < 30; iteration++) {
      const rounds = createHandPickupRounds(random);
      assert.equal(rounds.length, 5);
      assert.equal(new Set(rounds.map(item => item.id)).size, 5);
      assert.equal(new Set(rounds.map(item => item.category)).size, 2);
      assert(rounds.every(item => item.image.includes(item.id)));
    }
  }
});

test('custom counts preserve unique items and both categories up to the whole catalogue', () => {
  for (const count of [2, 3, 7, 70, 140, HAND_PICKUP_MAX_COUNT]) {
    for (const random of [() => 0, () => 0.999, Math.random]) {
      const rounds = createHandPickupRounds(random, count);
      assert.equal(rounds.length, count);
      assert.equal(new Set(rounds.map(item => item.id)).size, count);
      assert.equal(new Set(rounds.map(item => item.category)).size, 2);
    }
  }
  for (const count of [0, 1, -2, 2.5, NaN, Infinity, HAND_PICKUP_MAX_COUNT + 1]) {
    assert(!isValidHandPickupCount(count));
    assert.throws(() => createHandPickupRounds(Math.random, count));
  }
});

test('random origins leave room around the trash and keep it clear of both bins', () => {
  const positions = new Set<string>();
  for (const random of [() => 0, () => 0.999, Math.random]) {
    for (let sample = 0; sample < 100; sample++) {
      const origin = createHandPickupPosition(random);
      positions.add(JSON.stringify(origin));
      assert(origin.x >= 0.16 && origin.x <= 0.84);
      assert(origin.y >= 0.3 && origin.y <= 0.43);
      assert.equal(getHandDropCategory(origin), null);
      for (const zone of Object.values(HAND_DROP_ZONES)) assert(origin.y + 0.12 < zone.y - 0.04);
    }
  }
  assert(positions.size > 2);
});

test('pickup follows the randomized origin rather than the old center', () => {
  const origin = { x: 0.17, y: 0.3 };
  const ready = { holding: false, gesture: 'open' as const, result: null };
  assert(canPickUp(origin, origin));
  assert(!canPickUp(PICKUP_ORIGIN, origin));
  assert(stepHandPickup(ready, origin, 'closed', 'organic', origin).holding);
  assert(!stepHandPickup(ready, PICKUP_ORIGIN, 'closed', 'organic', origin).holding);
});

test('mirrored hand mapping clamps and smooths without cropping the video frame', () => {
  assert.deepEqual(mapHandPoint({ x: 0.2, y: 0.3 }), { x: 0.8, y: 0.3 });
  assert.deepEqual(mapHandPoint({ x: -1, y: 2 }), { x: 1, y: 1 });
  const smoothed = mapHandPoint({ x: 0, y: 1 }, { x: 0, y: 0 });
  assert.deepEqual(smoothed, { x: 0.45, y: 0.45 });
  assert(canPickUp(PICKUP_ORIGIN));
  assert(!canPickUp({ x: 0, y: 0 }));
});

test('drop buffers help near the rim without overlapping the two bins', () => {
  assert.equal(getHandDropCategory({ x: 0.25, y: 0.61 }), 'organic');
  assert.equal(getHandDropCategory({ x: 0.75, y: 0.8 }), 'recyclable');
  assert.equal(getHandDropCategory({ x: 0.5, y: 0.8 }), null);
  assert.equal(getHandDropCategory(PICKUP_ORIGIN), null);
});

test('pickup requires an open-to-closed edge near the item; release evaluates only once', () => {
  let state = stepHandPickup({ holding: false, gesture: null, result: null }, PICKUP_ORIGIN, 'closed', 'organic');
  assert(!state.holding);
  state = stepHandPickup(state, PICKUP_ORIGIN, 'open', 'organic');
  state = stepHandPickup(state, PICKUP_ORIGIN, 'closed', 'organic');
  assert(state.holding);
  state = stepHandPickup(state, { x: 0.25, y: 0.8 }, 'closed', 'organic');
  assert(state.holding);
  state = stepHandPickup(state, { x: 0.25, y: 0.8 }, 'open', 'organic');
  assert.equal(state.result, 'correct');
  assert(!state.holding);
  assert.equal(stepHandPickup(state, { x: 0.25, y: 0.8 }, 'open', 'organic').result, null);
});

test('wrong bin and missed drop return the item for retry, without completing it', () => {
  const holding = { holding: true, gesture: 'closed' as const, result: null };
  assert.deepEqual(stepHandPickup(holding, { x: 0.75, y: 0.8 }, 'open', 'organic'), { holding: false, gesture: 'open', result: 'wrong' });
  assert.equal(stepHandPickup(holding, PICKUP_ORIGIN, 'open', 'organic').result, 'miss');
  assert(!stepHandPickup({ holding: false, gesture: 'open', result: null }, { x: 0, y: 0 }, 'closed', 'organic').holding);
});

test('gesture detector debounces transitions, holds through hysteresis band, and resets on loss', () => {
  const detector = new HandGestureDetector();
  assert.equal(detector.update(2, 0), null);
  assert.equal(detector.update(2, 150), 'open');
  assert.equal(detector.update(1, 200), 'open');
  assert.equal(detector.update(1.5, 300), 'open');
  assert.equal(detector.update(1, 350), 'open');
  assert.equal(detector.update(1, 500), 'closed');
  assert.equal(detector.update(1.5, 550), 'closed');
  detector.reset();
  assert.equal(detector.update(2, 600), null);
  assert.equal(detector.update(2, 750), 'open');
  assert.equal(detector.update(NaN, 800), null);
});

test('openness distinguishes extended and curled fingers and rejects invalid palms', () => {
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.7 }));
  landmarks[0] = { x: 0.5, y: 0.9 };
  assert.equal(getHandOpenness([]), null);
  assert.equal(getHandOpenness(landmarks, 0), null);
  for (const tip of [8, 12, 16, 20]) landmarks[tip] = { x: 0.5, y: 0.4 };
  assert(getHandOpenness(landmarks)! > 1.65);
  for (const tip of [8, 12, 16, 20]) landmarks[tip] = { x: 0.5, y: 0.75 };
  assert(getHandOpenness(landmarks)! < 1.25);
  landmarks[9] = landmarks[0];
  assert.equal(getHandOpenness(landmarks), null);
});