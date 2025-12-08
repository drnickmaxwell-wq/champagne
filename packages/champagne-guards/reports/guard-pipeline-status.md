# Guard pipeline status

## Available guard commands
- `npm run guard:rogue-hex` (root) / `npm run guard:rogue-hex -w @champagne/guards` — blocks new non-token HEX colors outside the allowlist.
- `npm run guard:hero-freeze` (root) / `npm run guard:hero-freeze -w @champagne/guards` — detects drift in hero media compared to the frozen hash baseline.
- `npm run guard:manifest` (root) / `npm run guard:manifest -w @champagne/guards` — ensures champagne/public manifests only reference files that exist and exits early if manifests are missing.
- `npm run guard:brand-structure` (root) / `npm run guard:brand-structure -w @champagne/guards` — enforces champagne surface usage and expected grid classes in hero and Smile Journey components.
- `npm run guard:all` (root) / `npm run guard:all -w @champagne/guards` — runs all guard checks sequentially.

## Running locally
- Use the root scripts for convenience: `npm run guard:all` for the full suite or `npm run guard:<name>` to target a specific guard.
- `npm run verify` now chains `npm run lint`, `CI=1 npm run build`, and `npm run guard:all` to mirror the local health check flow.

## Current status
- `npm run verify` passes on the current main branch after wiring the guard pipeline through the workspace scripts.
- Hero freeze is pinned to the placeholder assets stored under `packages/champagne-guards/public/**`; update `scripts/hero-freeze.hashes.json` if those assets change.
- Manifest guard currently reports missing manifests and exits early until `styles/champagne/manifest.json` and `public/brand/manifest.json` are restored.
