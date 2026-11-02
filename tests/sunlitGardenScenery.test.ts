import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SunlitGardenGame } from '../src/components/SunlitGardenGame';

test('garden renders twelve decorative clouds without blocking player input', () => {
  const html = renderToStaticMarkup(React.createElement(SunlitGardenGame, {
    onReturnToClassroom: () => {},
    triggerSpeech: () => {},
  }));
  const clouds = html.match(/<div class="garden-cloud [^"]*"[^>]*>☁️<\/div>/g) ?? [];
  assert.equal(clouds.length, 12);
  for (const cloud of clouds) {
    assert.match(cloud, /pointer-events-none/);
    assert.match(cloud, /aria-hidden="true"/);
    assert.match(cloud, /font-size:clamp\(/);
  }
});
