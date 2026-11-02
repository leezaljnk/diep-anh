import assert from 'node:assert/strict';
import { test } from 'node:test';
import { jointAngle, matchTprPose, pointDistance, PoseDwellTracker, type PosePoint } from '../src/utils/englishTprLogic';
import { readFileSync } from 'node:fs';
import { ENGLISH_VOCAB } from '../src/data/englishVocab';
import { CATCH_ORIGINS, createEnglishCatchRounds, EMPTY_ENGLISH_CATCH, stepEnglishCatch } from '../src/utils/englishHandCatch';
import { speakEnglish, stopEnglishSpeech } from '../src/utils/speech';

test('catch rounds have 15 unique targets, same-topic distractors and real local assets', () => {
  for (const random of [() => 0, () => 0.999, Math.random]) {
    const rounds = createEnglishCatchRounds(random);
    assert.equal(rounds.length, 15);
    assert.equal(new Set(rounds.map(round => round.target.id)).size, 15);
    for (const round of rounds) {
      assert(round.choices.length >= 2 && round.choices.length <= 3);
      assert.equal(new Set(round.choices.map(choice => choice.id)).size, round.choices.length);
      assert.equal(round.choices.filter(choice => choice.id === round.target.id).length, 1);
      assert(round.choices.every(choice => choice.category === round.target.category));
    }
  }
  assert.equal(ENGLISH_VOCAB.length, 28);
  for (const item of ENGLISH_VOCAB) {
    const bytes = readFileSync(new URL(`../public/${item.image}`, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', item.image);
  }
});

test('English speech selects a local English voice, never a remote fallback, and supports cancellation', () => {
  const keys = ['window', 'SpeechSynthesisUtterance'];
  const descriptors = keys.map(key => Object.getOwnPropertyDescriptor(globalThis, key));
  const spoken: { text: string; voice?: unknown; rate?: number; lang?: string }[] = [];
  const local = { localService: true, lang: 'en-GB' };
  let voices = [{ localService: false, lang: 'en-US' }, { localService: true, lang: 'vi-VN' }, local];
  let cancelled = 0;
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {
      speechSynthesis: { cancel: () => cancelled++, getVoices: () => voices, speak: (utterance: typeof spoken[number]) => spoken.push(utterance) },
    } });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { configurable: true, value: class {
      constructor(public text: string) {}
    } });
    assert(speakEnglish('Apple'));
    assert.equal(spoken[0].voice, local);
    assert.equal(spoken[0].lang, 'en-GB');
    assert.equal(spoken[0].rate, 0.8);
    voices = [{ localService: false, lang: 'en-US' }];
    assert.equal(speakEnglish('Banana'), false);
    assert.equal(spoken.length, 1);
    stopEnglishSpeech();
    assert.equal(cancelled, 3);
  } finally {
    keys.forEach((key, index) => {
      if (descriptors[index]) Object.defineProperty(globalThis, key, descriptors[index]!);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});

test('catch requires open-to-closed edge, correct item and release inside basket', () => {
  const round = createEnglishCatchRounds(() => 0)[0];
  const correctIndex = round.choices.findIndex(item => item.id === round.target.id);
  const origin = CATCH_ORIGINS[correctIndex];
  const basket = { x: 0.5, y: 0.85 };
  assert.equal(stepEnglishCatch(EMPTY_ENGLISH_CATCH, origin, 'closed', round).state.held, null);
  let state = stepEnglishCatch(EMPTY_ENGLISH_CATCH, origin, 'open', round).state;
  state = stepEnglishCatch(state, origin, 'closed', round).state;
  assert.equal(state.held, correctIndex);
  assert.equal(stepEnglishCatch(state, basket, 'closed', round).state.held, correctIndex);
  assert.equal(stepEnglishCatch(state, basket, 'open', round).result, 'correct');
  assert.equal(stepEnglishCatch(state, origin, 'open', round).result, 'retry');
  const wrong = { gesture: 'closed' as const, held: (correctIndex + 1) % round.choices.length };
  assert.equal(stepEnglishCatch(wrong, basket, 'open', round).result, 'retry');
  assert.equal(stepEnglishCatch(EMPTY_ENGLISH_CATCH, basket, 'open', round).result, null);
});

function pose(): PosePoint[] {
  const points = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.6, visibility: 1 }));
  points[0] = { x: 0.5, y: 0.22, visibility: 1 };
  points[2] = { x: 0.46, y: 0.2, visibility: 1 };
  points[5] = { x: 0.54, y: 0.2, visibility: 1 };
  points[7] = { x: 0.42, y: 0.25, visibility: 1 };
  points[8] = { x: 0.58, y: 0.25, visibility: 1 };
  points[11] = { x: 0.4, y: 0.4, visibility: 1 };
  points[12] = { x: 0.6, y: 0.4, visibility: 1 };
  points[15] = { x: 0.3, y: 0.7, visibility: 1 };
  points[16] = { x: 0.7, y: 0.7, visibility: 1 };
  return points;
}

test('TPR geometry respects camera aspect ratio and degenerate joints', () => {
  assert.equal(pointDistance({ x: 0, y: 0 }, { x: 1, y: 0 }, 2), 2);
  assert.equal(jointAngle({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }), 0);
  assert.equal(jointAngle({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 180);
});

test('hands up rejects low-confidence and off-camera joints', () => {
  const points = pose();
  assert.equal(matchTprPose('hands-up', points), 'observing');
  points[15].y = points[16].y = 0.1;
  assert.equal(matchTprPose('hands-up', points), 'matched');
  points[15].visibility = 0.3;
  assert.equal(matchTprPose('hands-up', points), 'out-of-frame');
  points[15].visibility = 1;
  points[15].x = -0.1;
  assert.equal(matchTprPose('hands-up', points), 'out-of-frame');
  assert.equal(matchTprPose('hands-up', []), 'out-of-frame');
  assert.equal(matchTprPose('hands-up', pose(), NaN), 'out-of-frame');
});

test('head touch accepts either visible wrist, surprise requires both cheeks', () => {
  const points = pose();
  points[15] = { ...points[0] };
  points[16].visibility = 0;
  assert.equal(matchTprPose('touch-head', points), 'matched');
  assert.equal(matchTprPose('surprised', points), 'out-of-frame');
  points[15] = { ...points[7] };
  points[16] = { ...points[8] };
  assert.equal(matchTprPose('surprised', points), 'matched');
});

test('clap and open arms use shoulder-relative geometry', () => {
  const points = pose();
  points[15] = { x: 0.49, y: 0.5, visibility: 1 };
  points[16] = { x: 0.51, y: 0.5, visibility: 1 };
  assert.equal(matchTprPose('clap', points), 'matched');
  points[13] = { x: 0.25, y: 0.4, visibility: 1 };
  points[14] = { x: 0.75, y: 0.4, visibility: 1 };
  points[15] = { x: 0.1, y: 0.4, visibility: 1 };
  points[16] = { x: 0.9, y: 0.4, visibility: 1 };
  assert.equal(matchTprPose('open-arms', points), 'matched');
  points[15].y = 0.7;
  assert.equal(matchTprPose('open-arms', points), 'observing');
});

test('sleepy requires a head tilt plus a hand by the cheek, not facial emotion', () => {
  const points = pose();
  points[5].y += 0.08;
  assert.equal(matchTprPose('sleepy', points), 'observing');
  points[15] = { ...points[7] };
  assert.equal(matchTprPose('sleepy', points), 'matched');
});

test('dwell requires continuous detection, resets on lost frames and clock reversal', () => {
  const tracker = new PoseDwellTracker();
  assert.equal(tracker.update(true, 0), 0);
  for (const timestamp of [150, 300, 450, 600, 750]) assert(tracker.update(true, timestamp) < 1);
  assert.equal(tracker.update(true, 900), 1);
  assert.equal(tracker.update(false, 950), 0);
  assert.equal(tracker.update(true, 1000), 0);
  assert.equal(tracker.update(true, 1500), 0);
  assert.equal(tracker.update(true, 1400), 0);
});