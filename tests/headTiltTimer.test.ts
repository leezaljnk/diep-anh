import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadTiltTimer } from '../src/components/HeadTiltTimer';

const renderTimer = (secondsRemaining: number, running = true) =>
  renderToStaticMarkup(createElement(HeadTiltTimer, { secondsRemaining, running }));

test('radial timer is a non-interactive, labelled status display with a full initial ring', () => {
  const html = renderTimer(10);
  assert.match(html, /role="timer"/);
  assert.match(html, /aria-live="off"/);
  assert.match(html, /aria-label="Thời gian còn lại: 10 giây"/);
  assert.match(html, /stroke-dashoffset="0"/);
  assert.match(html, /from-amber-100/);
  assert.match(html, /stroke-dasharray="1 1"/);
  assert.match(html, /mask="url\(#/);
  assert.doesNotMatch(html, /<button|tabindex|head-tilt-timer-heartbeat/);
});

test('ring shrinks proportionally and heartbeat appears only in the final five seconds', () => {
  for (const remaining of [9, 6, 5, 3, 1]) {
    const html = renderTimer(remaining);
    assert.match(html, new RegExp(`stroke-dashoffset="${100 - remaining * 10}"`));
    assert.equal(html.includes('head-tilt-timer-heartbeat'), remaining <= 5);
    assert.equal(html.includes('stroke-rose-500'), remaining <= 5);
  }
});

test('stopping the clock stops heartbeat without changing the displayed time', () => {
  const html = renderTimer(3, false);
  assert.doesNotMatch(html, /head-tilt-timer-heartbeat/);
  assert.match(html, /aria-label="Thời gian còn lại: 3 giây"/);
  assert.match(html, /stroke-dashoffset="70"/);
});

test('zero has an empty ring and calm styling without heartbeat', () => {
  const html = renderTimer(0);
  assert.match(html, /stroke-dashoffset="100"/);
  assert.match(html, /opacity-0/);
  assert.match(html, /aria-label="Thời gian còn lại: 0 giây"/);
  assert.doesNotMatch(html, /head-tilt-timer-heartbeat|bg-rose-50/);
});

test('multiple badge timers use independent SVG masks', () => {
  const html = renderToStaticMarkup(createElement('div', null,
    createElement(HeadTiltTimer, { secondsRemaining: 8, running: true }),
    createElement(HeadTiltTimer, { secondsRemaining: 2, running: true }),
  ));
  const ids = [...html.matchAll(/<mask id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids).size, 2);
  for (const id of ids) assert(html.includes(`mask="url(#${id})"`));
});

test('out-of-range remaining values cannot overfill the ring or display negative time', () => {
  assert.match(renderTimer(-1), /stroke-dashoffset="100"/);
  assert.match(renderTimer(11), /stroke-dashoffset="0"/);
});

test('reduced motion disables heartbeat and ring transitions', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.head-tilt-timer-ring\s*\{\s*transition: none;\s*\}\s*\.head-tilt-timer-heartbeat\s*\{\s*animation: none;/);
});
