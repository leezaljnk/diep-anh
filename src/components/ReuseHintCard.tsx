import React from 'react';
import type { ReuseHint } from '../data/reuseHints';

export function ReuseHintCard({ hint }: { hint?: ReuseHint }) {
  return (
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Gợi ý tái sử dụng"
      className="reuse-hint-card pointer-events-none absolute z-30"
    >
      {hint && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-2 text-emerald-950 shadow-lg sm:p-3">
          <p className="mb-1 text-xs font-black text-emerald-700">Gợi ý tái sử dụng</p>
          <img
            src={hint.imageUrl}
            alt={hint.imageAlt}
            draggable={false}
            className="reuse-hint-image mx-auto rounded-lg object-contain"
            onError={() => console.error(`Không tải được ảnh gợi ý tái sử dụng: ${hint.imageUrl}`)}
          />
          <p className="mt-1 text-sm font-bold leading-snug">{hint.text}</p>
          {hint.safetyNote && <p className="mt-1 text-xs leading-tight">{hint.safetyNote}</p>}
        </div>
      )}
    </aside>
  );
}
