# Pokédex of Colour — agent instructions

Canonical public content repository: https://github.com/Lewissss/ColourDex

## Required workflow for a new guide

1. Read this file, CONTRIBUTING.md, `schemas/pokemon.schema.json`, `schemas/index.schema.json`, the current `content/pokemon/index.json`, `content/palette/kalour-240.json` and the existing `content/pokemon/0003-venusaur.json`.
2. Verify the official National Pokédex number, types and official Pokémon.com artwork URL. Check artwork returns an image response; store attribution and original source. Do not invent artwork or pencil information.
3. Create a feature branch from the latest main. NEVER commit directly to main. Treat main as protected even if GitHub administration settings have not yet been applied. Preserve all existing guide files and index rows during a normal addition.
4. Add `content/pokemon/NNNN-slug.json` and update the index, sorted by number. Guide pencil data contains ONLY exact three-digit numbers, not duplicate names. Text references use `@113` notation; the UI resolves the exact number/name/hex from the master palette. Include every used pencil in a visible colour group and each step's `pencils` metadata.
5. Follow the detailed Venusaur structure: tailored introduction; official reference; grouped visible swatches; anatomical numbered layering steps with pressure, placement, shadows and highlights; compact small-details table; final shading; 204 White burnishing tradeoffs; lighter-colour blending alternatives; recommended colouring order. At least four anatomical sections, each with at least three detailed steps. Use the existing guide as the depth reference, not a fill-in-the-blanks template.
6. Run `npm ci`, `npm test`, `npm run validate -- --links`, `npm run build` when an executor is available. With GitHub tools only, manually validate fields and cross-references and say which automated checks could not run. The PR's GitHub Action runs the full checks.
7. Open a pull request to main. Explain the guide, source artwork and validation. Do not self-approve or merge unless the user explicitly authorises that concrete PR. Never claim an unmerged guide is published.
8. After merge, verify the new guide is publicly readable from main. The live app resolves main to a commit SHA and fetches palette/index/guides pinned to that revision. It checks on opening, every five minutes while visible, when returning after the cache interval, and through the footer refresh button. No Sites rebuild is required for guide additions.

## Sources and compatibility

- `content/palette/tray-locations.json` records the user's physical pencil storage tray(s), in top-to-bottom order. Whenever recommending a pencil, look up its tray if recorded, and help the user find it without sorting the physical pencils by number. Do not guess a tray for pencils absent from the map; newly supplied tray photos can add additional tray entries. Never change the canonical 240-pencil palette for location-only updates.
- `content/palette/kalour-240.json` is the only pencil name authority. Preserve all numbers 001–240 exactly once, including duplicate names 103 and 196 Pale Green. Do not regenerate the palette for ordinary guide additions.
- `content/pokemon/index.json` discovers guides. Number, slug, types, family and filename must match the individual guide. Each family joins existing guide entries in evolutionary order by number.
- `schemas/` holds strict draft-07 contracts. `src/validation.mjs` adds uniqueness and reference checks. Unknown or incomplete remote snapshots are rejected atomically.
- `src/content.mjs` configures owner `Lewissss`, repository `ColourDex`, branch `main`. Ordinary content additions do not edit frontend code.
- Frontend source lives here for maintainability; Sites has a separate platform-managed deployment source. Frontend changes require a Sites deployment. Guide changes do not.
- Keep non-sensitive guide data public. No tokens, credentials or private personal data. Never publish photographs or identifying photo metadata without explicit permission. `completedArtwork` starts empty; permitted photos require `permissionGranted: true`.
- Local collection and step progress stay in browser storage, not GitHub; they do not sync between devices.

## Exact reusable user prompt

> Add [Pokémon name] to my Pokédex of Colour. Use the saved Kalour 240 palette and the Venusaur colouring-guide format. Generate the guide, update the GitHub repository through a feature branch and create a pull request. Keep the website's existing entries unchanged.

Add “Read Lewissss/ColourDex/AGENTS.md first; do not commit directly to main” if the conversation has no repository context.

## Test the update path

Use a temporary feature branch or the initial setup branch; never add dummy Pokémon to the live catalogue. `node scripts/check-remote.mjs BRANCH` runs the actual public GitHub loader and cross-file validator against the branch's immutable commit SHA. Confirm main is unchanged. Do not merge test-only content.


## Private photo feature

Completed-page photo selection uses `src/photos.ts` and browser IndexedDB, independent of guide data and GitHub. Do not put these private photos, original filenames or photo metadata into `completedArtwork` or any public commit. Preserve existing completion marks and local photos when changing the frontend. The optional picker must retain Not now, safe cancellation, preview-before-save, replacement and removal; My Collection compares the official reference and private photo side by side, including on mobile. Photographs stay on the current browser/device and do not sync.
