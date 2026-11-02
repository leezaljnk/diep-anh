import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadTiltGameStatus } from '../src/components/HeadTiltGameStatus';

const renderStatus = (secondsRemaining: number, roundNumber = 4, score = 2) =>
  renderToStaticMarkup(createElement(HeadTiltGameStatus, {
    roundNumber, totalRounds: 20, score, secondsRemaining, running: true,
  }));

test('game HUD groups the question, score, progress and exactly one timer', () => {
  const html = renderStatus(9);
  assert.match(html, /aria-label="Tiến trình chơi"/);
  assert.match(html, /Câu 4\/20/);
  assert.match(html, /Điểm đúng: 2/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuemax="20" aria-valuenow="4"/);
  assert.match(html, /width:20%/);
  assert.equal([...html.matchAll(/role="timer"/g)].length, 1);
  assert.doesNotMatch(html, /không cần vội/);
});

test('zero keeps the timer and reassuring message without changing score or progress', () => {
  const html = renderStatus(0);
  assert.match(html, /aria-label="Thời gian còn lại: 0 giây"/);
  assert.match(html, /Bé cứ chọn nhé, không cần vội!/);
  assert.match(html, /Điểm đúng: 2/);
  assert.match(html, /width:20%/);
});

test('the HUD reflects the latest question and score', () => {
  const html = renderStatus(10, 20, 18);
  assert.match(html, /Câu 20\/20/);
  assert.match(html, /Điểm đúng: 18/);
  assert.match(html, /width:100%/);
});
