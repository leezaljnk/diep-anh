import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { HEAD_TILT_TRASH_ITEMS } from '../src/data/headTiltTrashItems';
import {
  createHeadTiltRounds,
  evaluateHeadTiltChoice,
  getHeadRollRadians,
  getHeadTiltCountdown,
  isValidHeadTiltRoundCount,
  getShoulderRelativeOffset,
  headTiltDirectionToCategory,
  isHeadTiltCameraReady,
  HEAD_TILT_ROUND_COUNT,
  HEAD_TILT_TRASH_IMAGES,
  HeadTiltNeutralCalibration,
  HeadTiltSignalDetector,
  median,
} from '../src/utils/headTiltSorting';

test('a game defaults to twenty shuffled camera images without repeats', () => {
  const rounds = createHeadTiltRounds(undefined, () => 0.5);
  assert.equal(HEAD_TILT_ROUND_COUNT, 20);
  assert.equal(rounds.length, HEAD_TILT_ROUND_COUNT);
  assert.equal(new Set(rounds.map(({ item }) => item.id)).size, rounds.length);
  assert(rounds.every(({ item }) => HEAD_TILT_TRASH_ITEMS.some(candidate => candidate.id === item.id)));
  assert.notDeepEqual(rounds.map(({ item }) => item.id), HEAD_TILT_TRASH_ITEMS.slice(0, 20).map(item => item.id));
});

test('custom lengths exhaust the pool before repeating and avoid consecutive repeats at cycle boundaries', () => {
  const poolSize = HEAD_TILT_TRASH_ITEMS.length;
  for (const count of [1, 7, 20, poolSize, poolSize * 2 + 7]) {
    const rounds = createHeadTiltRounds(undefined, () => 0.999, count);
    assert.equal(rounds.length, count);
    for (let start = 0; start < count; start += poolSize) {
      const cycle = rounds.slice(start, start + poolSize);
      assert.equal(new Set(cycle.map(({ item }) => item.id)).size, cycle.length);
    }
    for (let index = 1; index < rounds.length; index++) {
      assert.notEqual(rounds[index].item.id, rounds[index - 1].item.id);
    }
  }
  const smallPool = HEAD_TILT_TRASH_ITEMS.slice(0, 2);
  const rounds = createHeadTiltRounds(smallPool, () => 0, 5);
  assert.deepEqual(rounds.map(({ item }) => item.id), [smallPool[1].id, smallPool[0].id, smallPool[1].id, smallPool[0].id, smallPool[1].id]);
  assert.equal(createHeadTiltRounds(smallPool.slice(0, 1), () => 0, 3).length, 3);
});

test('question counts accept positive integers only', () => {
  for (const count of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(isValidHeadTiltRoundCount(count), false);
    assert.throws(() => createHeadTiltRounds(undefined, undefined, count), /số nguyên dương/);
  }
  assert.equal(isValidHeadTiltRoundCount(1), true);
  assert.equal(isValidHeadTiltRoundCount(200), true);
  assert.throws(() => createHeadTiltRounds([]), /ít nhất một ảnh/);
});

test('countdown warns every second from five through zero and keeps warning after zero', () => {
  for (let elapsed = 0; elapsed <= 30; elapsed++) {
    assert.deepEqual(getHeadTiltCountdown(elapsed), {
      remaining: Math.max(0, 10 - elapsed),
      warning: elapsed >= 5,
    });
  }
  assert.deepEqual(getHeadTiltCountdown(0), { remaining: 10, warning: false });
});

test('camera catalogue covers every image in both folders and maps each to its folder category', () => {
  for (const [folder, category] of [['huu_co', 'organic'], ['vo_co', 'recyclable']] as const) {
    const files = readdirSync(new URL(`../public/images/camera/${folder}/`, import.meta.url)).filter(file => file.endsWith('.png')).sort();
    const items = HEAD_TILT_TRASH_ITEMS.filter(item => item.category === category);
    assert.deepEqual(items.map(item => `${item.id}.png`).sort(), files);
    for (const item of items) {
      assert.equal(HEAD_TILT_TRASH_IMAGES[item.id], `./images/camera/${folder}/${item.id}.png`);
      assert(existsSync(new URL(`../public/${HEAD_TILT_TRASH_IMAGES[item.id].replace(/^\.\//, '')}`, import.meta.url)));
      assert.equal(evaluateHeadTiltChoice(item, item.category), true);
      assert.equal(evaluateHeadTiltChoice(item, item.category === 'organic' ? 'recyclable' : 'organic'), false);
    }
  }
  assert.equal(Object.keys(HEAD_TILT_TRASH_IMAGES).length, HEAD_TILT_TRASH_ITEMS.length);
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

test('head tilt uses the eye line even when the nose and shoulders do not move', () => {
  for (const angle of [-Math.PI / 12, 0, Math.PI / 12]) {
    const landmarks = [] as ({ x: number; y: number; visibility: number } | undefined)[];
    landmarks[0] = { x: 0.5, y: 0.5, visibility: 1 };
    landmarks[2] = { x: 0.4, y: 0.4, visibility: 1 };
    landmarks[5] = { x: 0.6, y: 0.4 + Math.tan(angle) * 0.2 * 640 / 480, visibility: 1 };
    assert(Math.abs(getHeadRollRadians(landmarks, 640, 480)! - angle) < 1e-9);
  }
});

test('head tilt is independent of translation, eye ordering and camera aspect ratio', () => {
  for (const [width, height] of [[640, 480], [1920, 1080], [480, 640]]) {
    const angle = Math.PI / 12;
    const landmarks = [] as ({ x: number; y: number; visibility: number } | undefined)[];
    landmarks[2] = { x: 0.7, y: 0.3 + Math.tan(angle) * 0.2 * width / height, visibility: 1 };
    landmarks[5] = { x: 0.5, y: 0.3, visibility: 1 };
    assert(Math.abs(getHeadRollRadians(landmarks, width, height)! - angle) < 1e-9);
  }
});

test('head tilt rejects missing, unreliable or out-of-frame eyes and invalid video dimensions', () => {
  const landmarks = [] as ({ x: number; y: number; visibility: number } | undefined)[];
  assert.equal(getHeadRollRadians(landmarks, 640, 480), null);
  landmarks[2] = { x: 0.4, y: 0.4, visibility: 1 };
  landmarks[5] = { x: 0.6, y: 0.4, visibility: 0.1 };
  assert.equal(getHeadRollRadians(landmarks, 640, 480), null);
  landmarks[5] = { x: 0.41, y: 0.4, visibility: 1 };
  assert.equal(getHeadRollRadians(landmarks, 640, 480), null);
  landmarks[5] = { x: 0.6, y: -0.1, visibility: 1 };
  assert.equal(getHeadRollRadians(landmarks, 640, 480), null);
  landmarks[5] = { x: 0.6, y: 0.4, visibility: 1 };
  assert.equal(getHeadRollRadians(landmarks, 0, 480), null);
  assert.equal(getHeadRollRadians(landmarks, 640, Number.NaN), null);
});

test('mirrored camera directions match the visible left and right choices', () => {
  assert.equal(headTiltDirectionToCategory('right'), 'organic');
  assert.equal(headTiltDirectionToCategory('left'), 'recyclable');
  assert.equal(headTiltDirectionToCategory('left', false), 'organic');
  assert.equal(headTiltDirectionToCategory('right', false), 'recyclable');
});

test('opposite camera movements cannot both be correct for the same question', () => {
  for (const item of HEAD_TILT_TRASH_ITEMS) {
    const answers = [-0.3, 0.3].map(offset => {
      const detector = new HeadTiltSignalDetector(0);
      let direction: ReturnType<HeadTiltSignalDetector['update']> = null;
      for (const time of [0, 100, 200, 300, 400, 500]) {
        direction = detector.update(offset, time);
      }
      assert.notEqual(direction, null);
      return evaluateHeadTiltChoice(item, headTiltDirectionToCategory(direction!));
    });
    assert.equal(answers.filter(Boolean).length, 1, item.id);
  }
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

test('a movement must stay beyond the selection threshold for the entire dwell time', () => {
  const detector = new HeadTiltSignalDetector(0);
  for (const [offset, time] of [[0.3, 0], [0.12, 100], [0.12, 200], [0.12, 300], [0.12, 400], [0.3, 500], [0.3, 600], [0.3, 700]]) {
    assert.equal(detector.update(offset, time), null, `must not select at ${time}ms`);
  }
  assert.equal(detector.update(0.3, 1000), null);
  assert.equal(detector.update(0.3, 1200), 'right');
});

test('a long gap between camera frames cannot complete a pending movement', () => {
  const detector = new HeadTiltSignalDetector(0);
  assert.equal(detector.update(0.3, 0), null);
  assert.equal(detector.update(0.3, 2000), null);
  assert.equal(detector.update(0.3, 2100), null);
  assert.equal(detector.update(0.3, 2200), null);
  assert.equal(detector.update(0.3, 2300), null);
  assert.equal(detector.update(0.3, 2500), 'right');
});

test('neutral calibration waits for twenty consecutive stable frames', () => {
  const calibration = new HeadTiltNeutralCalibration();
  for (let index = 0; index < 20; index++) {
    assert.equal(calibration.update(index % 2 === 0 ? -0.3 : 0.3, index * 100), null);
  }
  for (let index = 0; index < 19; index++) {
    assert.equal(calibration.update(0.01, 2000 + index * 100), null);
  }
  assert.equal(calibration.update(0.01, 3900), 0.01);
  assert.equal(calibration.sampleCount, 20);
});

test('neutral calibration discards samples after a missing pose or a camera gap', () => {
  const calibration = new HeadTiltNeutralCalibration();
  for (let index = 0; index < 10; index++) calibration.update(0, index * 100);
  assert.equal(calibration.update(null, 1000), null);
  assert.equal(calibration.sampleCount, 0);
  calibration.update(0, 1100);
  calibration.update(0, 1200);
  assert.equal(calibration.update(0, 2000), null);
  assert.equal(calibration.sampleCount, 1);
});

test('reading time observes neutral without consuming a choice or accumulating dwell time', () => {
  const detector = new HeadTiltSignalDetector(0);
  detector.lockUntilNeutral();
  assert.equal(detector.update(0, 0, false), null);
  assert.equal(detector.status.needsNeutral, false);
  for (const time of [100, 200, 300, 400, 500, 600, 700]) {
    assert.equal(detector.update(0.3, time, false), null);
  }
  assert.equal(detector.update(0.3, 800, true), null);
  assert.equal(detector.status.direction, 'right');
  assert.equal(detector.status.progress, 0);
  for (const time of [900, 1000, 1100, 1200]) assert.equal(detector.update(0.3, time), null);
  assert.equal(detector.update(0.3, 1300), 'right');
  assert.equal(detector.status.needsNeutral, true);
});

test('answers require a ready camera and a live stream, with no camera-off fallback', () => {
  for (const state of ['off', 'requesting', 'calibrating', 'error'] as const) {
    assert.equal(isHeadTiltCameraReady(state, true), false, state);
    assert.equal(isHeadTiltCameraReady(state, false), false, state);
  }
  assert.equal(isHeadTiltCameraReady('ready', false), false);
  assert.equal(isHeadTiltCameraReady('ready', true), true);
});