import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RobotKienSang } from '../src/components/RobotKienSang';
import { createMascotPosition } from '../src/utils/mascotPosition';

test('mascot positions use a full-area transform layer and preserve the sprite anchor', () => {
  const store = createMascotPosition(25, 80);
  store.moveTo(32, 90);
  const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
    mood: 'idle', positionStore: store, speechText: '', className: 'mobile-game-mascot',
  }));
  assert.match(html, /absolute inset-0[^\"]*mobile-game-mascot/);
  assert.match(html, /translate3d\(32%, 90%, 0\)/);
  assert.match(html, /translate\(-50%, -100%\)/);
  assert.match(html, /data-robot-sprite/);
});

test('garden and costume previews retain percentage-position props without a store', () => {
  const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
    mood: 'walking', xPercent: 40, yPercent: 75, speechText: '',
  }));
  assert.match(html, /translate3d\(40%, 75%, 0\)/);
});
