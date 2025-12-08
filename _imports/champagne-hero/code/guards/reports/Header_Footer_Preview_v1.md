# Header & Footer Preview v1

## Summary
- Added a dedicated `/preview` layout shell that wraps preview routes with a Champagne-flavoured header and luxury footer while keeping production chrome untouched.
- Introduced a reusable nav config for preview navigation and wired mobile/desktop states with token-based gradients and guard-safe assets.
- Laid the groundwork for future mood-based palettes and Manus footer upgrades without introducing new colour tokens.

## Double header root cause
Preview routes were still passing through `app/layout.tsx`, which only bypassed the global `StickyHeader` for `/champagne-preview` and hero routes. Because `/preview/**` was not included, preview pages inherited the production sticky header and any local preview mastheads, producing stacked menus. The root layout now detects `/preview` paths (plus existing champagne preview paths) and skips the production header/footer, allowing the new preview shell to render a single header bar.

## Future-ready notes
- **Manus footer assets:** The preview footer already uses the Manus particle texture. Swap in additional Manus motifs or gradients by updating the preview footer module background layers; keep using existing token variables for colour stops and keylines.
- **Time-of-day palette:** The preview shell collects the header and footer in one place, so injecting time-based theme tokens or CSS variables (e.g., morning/evening palettes) can happen via the preview layout without touching individual pages. Ensure contrast remains AA over the ink/navy base and reuse the existing gradient angles to maintain brand cohesion.

## Guard/test results
- `pnpm test`
- `pnpm brand:guard`
- `node scripts/guard-rogue-hex.mjs`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-preview-only.mjs` ⚠️ fails because `origin/main` is not available in this environment; no code issues were reported before the git lookup.
- `node scripts/guard-asset-size.mjs` ⚠️ fails for the same missing `origin/main` baseline; asset scanning did not proceed.
