import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadProjectAssets } from '../src/utils/preloadedAssets';

const costumes = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => {
    const id = `tim_rac_${String(index + 1).padStart(2, '0')}`;
    return [id, `./images/costumes/${id}.png`];
  }),
);
const manifest = { customCostumes: costumes };

function mockFetch(handler: (url: string) => Response | Promise<Response>) {
  const calls: string[] = [];
  const fetchAssets: typeof fetch = async input => {
    const url = String(input);
    calls.push(url);
    return handler(url);
  };
  return { calls, fetchAssets };
}

test('production loads all walking frames from the static manifest without calling the dev API', async () => {
  const { calls, fetchAssets } = mockFetch(() => Response.json(manifest));
  const assets = await loadProjectAssets(false, 'https:', fetchAssets);
  assert.deepEqual(calls, ['./kien-sang-assets.json']);
  assert.deepEqual(assets?.customCostumes, costumes);
  for (const url of Object.values(assets?.customCostumes || {})) {
    assert.ok(url);
    assert.ok(new URL(url, 'https://leezaljnk.github.io/robot-kien-sang/').pathname
      .startsWith('/robot-kien-sang/images/costumes/'));
  }
});

test('development keeps the disk-backed preview API', async () => {
  const { calls, fetchAssets } = mockFetch(() => Response.json(manifest));
  assert.deepEqual(await loadProjectAssets(true, 'http:', fetchAssets), manifest);
  assert.deepEqual(calls, ['./api/preloaded-assets']);
});

for (const failure of ['http', 'network', 'html', 'null', 'array'] as const) {
  test(`development falls back to the manifest after ${failure} failure`, async () => {
    const { calls, fetchAssets } = mockFetch(url => {
      if (url.endsWith('.json')) return Response.json(manifest);
      if (failure === 'network') throw new TypeError('Failed to fetch');
      if (failure === 'http') return new Response(null, { status: 404 });
      if (failure === 'null') return Response.json(null);
      if (failure === 'array') return Response.json([]);
      return new Response('<!DOCTYPE html><html></html>');
    });
    assert.deepEqual(await loadProjectAssets(true, 'http:', fetchAssets), manifest);
    assert.deepEqual(calls, ['./api/preloaded-assets', './kien-sang-assets.json']);
  });
}

test('missing static assets do not prevent using local assets', async () => {
  const { calls, fetchAssets } = mockFetch(() => new Response(null, { status: 404 }));
  assert.equal(await loadProjectAssets(false, 'https:', fetchAssets), null);
  assert.deepEqual(calls, ['./kien-sang-assets.json']);
});

test('offline HTML never requests an API or manifest', async () => {
  const { calls, fetchAssets } = mockFetch(() => { throw new Error('Unexpected fetch'); });
  assert.equal(await loadProjectAssets(false, 'file:', fetchAssets), null);
  assert.equal(await loadProjectAssets(true, 'file:', fetchAssets), null);
  assert.deepEqual(calls, []);
});
