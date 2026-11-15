# Pokédex of Colour

A personal Pokémon colouring encyclopedia built around the exact **Kalour 240** pencil set. Five complete initial guides cover Bulbasaur, Ivysaur, Venusaur, Charmander and Squirtle.

The TypeScript frontend includes official artwork, numbered swatches, anatomical layering instructions, search, type/family filters, evolutionary links, pencil-to-guide discovery, local completion and step tracking, dark mode, compact instructions, pencil copying and print styles.

## No-rebuild guide updates

The Sites-hosted frontend reads `Lewissss/ColourDex` at runtime. It resolves main to a commit SHA, fetches palette/index/guides pinned to that immutable revision, then validates the whole snapshot before displaying it. Content merged through a PR appears without a Sites deployment. The app checks on opening, every five minutes while visible, after returning past that interval, and through its manual refresh button. GitHub caching can add a short propagation delay.

The repository must stay public. No token is shipped in the browser. Network failures, unauthenticated API limits and invalid content use the last validated local snapshot or the five bundled guides. The footer reports its actual source and revision.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the normal-chat prompt and [AGENTS.md](AGENTS.md) for agent instructions. ChatGPT needs GitHub write/PR tools in that conversation; tool availability depends on account, chat and connection permissions. Sites editing is not required for content additions.

## Files

- `content/palette/kalour-240.json`: exact number/name mapping and approximate display hexes.
- `content/pokemon/index.json`: catalogue discovery.
- `content/pokemon/NNNN-slug.json`: complete individual guides with pencil-number references.
- `schemas/`: strict JSON contracts.
- `src/validation.mjs`: runtime and CI cross-file checks.
- `src/content.mjs`: GitHub repository configuration and snapshot loader.
- `src/main.ts`, `src/style.css`: responsive frontend, bundled fallback imports.
- `.github/workflows/validate.yml`: schema/reference/artwork tests and production build.
- `scripts/check-remote.mjs BRANCH`: actual public GitHub update-path test.
- `scripts/configure-github.sh`: administrator-applied branch and Actions configuration.

## Development

Node 24+, `npm ci`, `npm test`, `npm run validate -- --links`, `npm run build`, `npm run dev`.

Frontend source is kept here for maintainability; Sites uses a separate platform-managed deployment repository containing its private deployment manifest. Frontend changes require a Sites deployment. Content changes do not. Never commit deployment credentials, tokens or personal photographs.

This is an independent fan reference, not an official Pokémon or Kalour product. Official artwork © Nintendo / Creatures Inc. / GAME FREAK inc.; Pokémon.com sources are attributed in every guide. Digital swatches are approximations rather than measured pigments and cannot represent metallic sheen or fluorescence. Personal progress is local to one browser/device; there is no account synchronisation or automatic photo upload.


## Private completed-page photographs

Marking a Pokémon complete offers an optional device photo picker with a preview and a Not now option. My Collection shows the official reference and the saved photograph side by side; photos can be added later, replaced or removed. Completing a Pokémon never requires a photo.

Photos are resized in the browser, re-encoded to remove original EXIF/location metadata, and stored as blobs in IndexedDB on that browser/device. The original filename and original metadata are not stored. No photo bytes are sent to Sites, GitHub or another server. Clearing browser data removes the photos; there is no cross-device synchronisation. Marking a Pokémon incomplete keeps its photo for later.

`src/photos.ts` owns validation, processing and private browser storage. `tests/photos.test.mjs` checks supported formats, size limits and proportional resizing. Real-browser QA covers saving, reload persistence, cancellation, replacement, removal and responsive comparisons.
