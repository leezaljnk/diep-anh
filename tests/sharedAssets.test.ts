import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { ASSET_SLOTS, sharedAssetsToState, uploadSharedAsset } from '../src/utils/sharedAssets';

test('catalog covers 215 costumes, 15 trash items, 3 base images and 98 voices', () => {
  assert.equal(ASSET_SLOTS.length, 331);
  assert.equal(new Set(ASSET_SLOTS.map(s => s.id)).size, 331);
  const sql = readFileSync(new URL('../supabase/setup.sql', import.meta.url), 'utf8');
  const patterns = [...sql.matchAll(/asset_id ~ '([^']+)'/g)].map(m => new RegExp(m[1]));
  for (const slot of ASSET_SLOTS) {
    assert(sql.includes(`'${slot.id}'`) || patterns.some(p => p.test(slot.id)), slot.id);
  }
  assert(!patterns.some(p => p.test('images/costumes/tim_rac_16')));
  assert(!patterns.some(p => p.test('images/costumes/vui_05')));
  assert(!patterns.some(p => p.test('images/costumes/buon_05')));
  assert(!patterns.some(p => p.test('images/costumes/cam_gio_13')));
});

test('shared manifest maps each asset category and versions media URLs', () => {
  const state = sharedAssetsToState([
    { id: 'images/costumes/tim_rac_01', revision: 'r1' },
    { id: 'images/costumes/cam_gio_01', revision: 'basket1' },
    { id: 'images/trash/banh_mi', revision: 'r2' },
    { id: 'images/bins/organic', revision: 'r3' },
    { id: 'images/bins/recyclable', revision: 'r4' },
    { id: 'images/mascot/main', revision: 'r5' },
    { id: 'voice/correct', revision: 'r6' },
  ]);
  assert.match(state.customCostumes?.tim_rac_01 || '', /tim_rac_01\?v=r1$/);
  assert.match(state.customCostumes?.cam_gio_01 || '', /cam_gio_01\?v=basket1$/);
  assert.match(state.customTrashImages?.banh_mi || '', /banh_mi\?v=r2$/);
  assert.match(state.customOrganicUrl || '', /organic\?v=r3$/);
  assert.match(state.customRecyclableUrl || '', /recyclable\?v=r4$/);
  assert.match(state.customMascotUrl || '', /main\?v=r5$/);
  assert.match(state.voiceClips?.correct || '', /correct\?v=r6$/);
  assert.equal(state.voiceClips?.incorrect, null);
});

test('upload rejects unknown IDs, SVG, wrong media group, empty and oversized files', async () => {
  await assert.rejects(uploadSharedAsset('../outside', new File(['x'], 'a.png', { type: 'image/png' })), /ID/);
  await assert.rejects(uploadSharedAsset('images/mascot/main', new File(['x'], 'a.svg', { type: 'image/svg+xml' })), /Chỉ nhận/);
  await assert.rejects(uploadSharedAsset('voice/correct', new File(['x'], 'a.png', { type: 'image/png' })), /Chỉ nhận/);
  await assert.rejects(uploadSharedAsset('voice/correct', new File([], 'a.mp3', { type: 'audio/mpeg' })), /5 MB/);
  await assert.rejects(uploadSharedAsset('voice/correct', new File([new Uint8Array(5242881)], 'a.mp3', { type: 'audio/mpeg' })), /5 MB/);
});
