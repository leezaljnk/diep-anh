import assert from 'node:assert/strict';
import { test } from 'node:test';
import { playCountdownSfx } from '../src/utils/audio';

test('countdown uses a short, gentle tone and disconnects finished audio nodes', t => {
  const ramps: [number, number][] = [];
  const stops: number[] = [];
  const oscillators: { type: string; onended: (() => void) | null; disconnect: () => void }[] = [];
  let disconnected = 0;
  let resumed = 0;
  class AudioContextStub {
    state = 'suspended';
    currentTime = 1;
    destination = {};
    resume() { resumed++; this.state = 'running'; return Promise.resolve(); }
    createOscillator() {
      const oscillator = {
        type: '',
        frequency: { setValueAtTime: (value: number) => assert.equal(value, 660) },
        connect() {},
        disconnect() { disconnected++; },
        start() {},
        stop(time: number) { stops.push(time); },
        onended: null as (() => void) | null,
      };
      oscillators.push(oscillator);
      return oscillator;
    }
    createGain() {
      return {
        gain: {
          setValueAtTime(value: number) { assert.equal(value, 0); },
          linearRampToValueAtTime(value: number, time: number) { ramps.push([value, time]); },
        },
        connect() {},
        disconnect() { disconnected++; },
      };
    }
  }
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { AudioContext: AudioContextStub } });
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  });
  playCountdownSfx(0);
  playCountdownSfx();
  assert.equal(resumed, 1);
  assert.deepEqual(stops, [1.13, 1.13]);
  assert.deepEqual(ramps, [[0, 1.01], [0, 1.12], [0.06, 1.01], [0, 1.12]]);
  for (const oscillator of oscillators) {
    assert.equal(oscillator.type, 'sine');
    oscillator.onended?.();
  }
  assert.equal(disconnected, 4);
});
