import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMascotPosition } from '../src/utils/mascotPosition';

test('position snapshots stay stable until the mascot actually moves', () => {
  const store = createMascotPosition(50, 68);
  const initial = store.getSnapshot();
  let notifications = 0;
  const unsubscribe = store.subscribe(() => { notifications++; });
  store.moveTo(50, 68);
  assert.equal(store.getSnapshot(), initial);
  assert.equal(notifications, 0);
  store.moveTo(51, 70);
  assert.deepEqual(store.getSnapshot(), { x: 51, y: 70 });
  assert.notEqual(store.getSnapshot(), initial);
  assert.equal(notifications, 1);
  unsubscribe();
  store.moveTo(52, 71);
  assert.equal(notifications, 1);
});

test('manual steps and command movement share the latest coordinates without a React render', () => {
  const store = createMascotPosition(50, 68);
  store.setX(x => x + 1.2);
  store.setX(x => x + 1.2);
  store.setY(y => y + 1);
  assert.deepEqual(store.getSnapshot(), { x: 52.400000000000006, y: 69 });
  store.moveTo(80, 90);
  store.setX(x => x - 0.38);
  assert.deepEqual(store.getSnapshot(), { x: 79.62, y: 90 });
  store.setX(50);
  store.setY(68);
  assert.deepEqual(store.getSnapshot(), { x: 50, y: 68 });
});
