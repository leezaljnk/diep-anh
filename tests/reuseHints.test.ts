import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { TRASH_ITEMS } from '../src/data/trashItems';
import { getReuseHint, REUSE_HINTS, REUSE_HINT_DURATION_MS } from '../src/data/reuseHints';
import { ReuseHintCard } from '../src/components/ReuseHintCard';

const expectedTexts = {
  giay_cu: 'Giầy cũ có thể trồng cây.',
  ong_nhua: 'Ống hút nhựa có thể làm hoa nhựa.',
  vo_chai_nhua: 'Vỏ chai có thể làm lọ treo cây.',
  vo_chai: 'Vỏ chai có thể cắm hoa',
  vo_hop_giay: 'Hộp giấy có thể dùng để đựng đồ.',
  vo_hop_sua: 'Vỏ hộp sữa có thể trồng cây.',
  vo_lon: 'Vỏ lon có thể làm hộp bút.',
};

test('all seven approved ideas use the requested text and existing PNG images', () => {
  assert.deepEqual(Object.keys(REUSE_HINTS).sort(), Object.keys(expectedTexts).sort());
  assert.equal(REUSE_HINT_DURATION_MS, 3000);
  const offlineGenerator = readFileSync(new URL('../scripts/generate_offline_html.cjs', import.meta.url), 'utf8');
  for (const [id, text] of Object.entries(expectedTexts)) {
    const hint = REUSE_HINTS[id];
    assert.equal(hint.text, text);
    assert.equal(hint.imageUrl, `./images/tai-su-dung/${id}_taisudung.png`);
    assert(hint.productNameVi);
    assert(hint.imageAlt);
    assert(existsSync(new URL(`../public/${hint.imageUrl}`, import.meta.url)));
    assert(offlineGenerator.includes(`'tai-su-dung/${id}_taisudung.png'`), `Offline image: ${id}`);
  }
});

test('only correct, explicitly mapped recyclable items in the classroom get hints', () => {
  for (const item of TRASH_ITEMS) {
    assert.equal(getReuseHint('classroom', item, 'recyclable'), REUSE_HINTS[item.id]);
    assert.equal(getReuseHint('classroom', item, 'organic'), undefined);
    assert.equal(getReuseHint('yard', item, 'recyclable'), undefined);
    assert.equal(getReuseHint('yard', item, 'organic'), undefined);
  }
  const item = TRASH_ITEMS[0];
  assert.equal(getReuseHint('classroom', { ...item, id: 'unknown' }, 'recyclable'), undefined);
  assert.equal(getReuseHint('classroom', { ...item, id: 'toString' }, 'recyclable'), undefined);
  assert.equal(getReuseHint('classroom', { ...item, category: 'organic' }, 'organic'), undefined);
});

test('hint is a non-interactive live status with image alt and visible safety notes', () => {
  const hint = REUSE_HINTS.vo_lon;
  const markup = renderToStaticMarkup(createElement(ReuseHintCard, { hint }));
  assert(markup.includes('role="status"'));
  assert(markup.includes('aria-live="polite"'));
  assert(markup.includes('pointer-events-none'));
  assert(markup.includes(`alt="${hint.imageAlt}"`));
  assert(markup.includes(hint.text));
  assert(markup.includes(hint.safetyNote!));
  assert(!markup.includes('<button'));
  assert(!markup.includes('role="dialog"'));
  const empty = renderToStaticMarkup(createElement(ReuseHintCard));
  assert(!empty.includes('<img'));
  assert(!empty.includes(hint.text));
});
