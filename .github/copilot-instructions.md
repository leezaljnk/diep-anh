# Repository guidance

## Build, test, and lint

Run commands from the repository root. Use Node.js 22 with npm (`npm ci`) or Bun (`bun install`).

- Development server: `npm run dev` (Vite on port 3000; `bun run dev` also works).
- Production build: `npm run build`.
- TypeScript check: `npm run lint` (`tsc --noEmit`).
- Full test suite: `node --import tsx --test tests/*.test.ts`.
- Single test file: `node --import tsx --test tests/movement.test.ts` (replace the filename as needed).

Tests use Node's built-in test runner and `tsx`; there is no separate test script in `package.json`.

## Architecture

- This is a React + TypeScript + Vite web app. `index.html` and `editor.html` are separate Vite entry points; `src/main.tsx` selects the game or shared-asset editor from the URL.
- `src/App.tsx` coordinates the main classroom and yard game state, while `src/components/` contains the game views, dialogs, and alternate games. Reusable game rules and calculations belong in `src/utils/`; catalogues and authored game content belong in `src/data/`.
- Vite uses a relative asset base for deployment and offline builds. Its project plugin in `vite.config.ts` creates the build-time asset manifest and development endpoints used by customization and offline HTML export. `scripts/generate_offline_html.cjs` generates the standalone HTML; `src/utils/offlineAssets.ts` embeds remote assets when exporting.
- Shared online media flows through `src/SharedAssetEditor.tsx` and `src/utils/sharedAssets.ts` to Supabase. `ASSET_SLOTS` defines uploadable IDs; keep it aligned with the policies and allowed IDs in `supabase/setup.sql`. The Pages workflow builds with Node 22 and deploys `dist/`.
- Customizations persist in the browser through `src/utils/persistentStorage.ts` (IndexedDB with localStorage fallback). Built-in project media lives under `public/`; offline exports can carry preloaded state independently from browser storage and Supabase.

## Repository-specific conventions

- User-facing copy and content are Vietnamese. Keep existing IDs stable and lowercase; IDs connect data catalogues, media filenames, voice prompt IDs, Supabase asset paths, and tests. When adding or changing shared assets or voice prompts, update every corresponding catalogue/policy and any contract tests.
- Keep domain rules in the existing data/utility modules rather than duplicating them in React components. Tests directly import these modules with `tsx`.
- Classroom trash batches have a category contract: 3 recyclable and 2 organic items, drawn from separate cycles without repeating an item in a batch. Yard selection uses its separate pool and selection behavior; preserve that distinction when changing trash-cycle logic.
- Costume IDs identify action/frame groups as well as assets. Use the existing mappings and fallback rules in `src/data/mascotCostumes.ts` when changing mascot animation or adding costume media.
- Supabase values prefixed `VITE_` are public client configuration bundled into the site, not secrets. Local play does not require Supabase; keep offline and local customization paths functional when shared assets are not configured.
