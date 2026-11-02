import type { PreloadedOfflineState } from '../types';

export async function loadProjectAssets(
  development: boolean,
  protocol: string,
  fetchAssets: typeof fetch = fetch,
): Promise<PreloadedOfflineState | null> {
  if (!protocol.startsWith('http')) return null;

  const sources = development
    ? ['./api/preloaded-assets', './kien-sang-assets.json']
    : ['./kien-sang-assets.json'];

  for (const source of sources) {
    try {
      const response = await fetchAssets(source);
      if (!response.ok) continue;
      const assets: unknown = await response.json();
      if (assets && typeof assets === 'object' && !Array.isArray(assets)) {
        return assets as PreloadedOfflineState;
      }
    } catch {
      // Preview APIs may be unavailable; continue with the static build manifest.
    }
  }
  return null;
}
