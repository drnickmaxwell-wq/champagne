# Guard Rogue Hex Fix — Champagne Machine Manifest

## Rogue hex values identified
- `#fafafa` → mapped to `--smh-white` neutral surface token.
- Raw teal `#40C4B4` references → mapped to `--smh-primary-teal` token.
- `#e0e0e0` → mapped to `--smh-gray-200` neutral token.
- `#C2185B → #40C4B4` gradient note → mapped to `--smh-primary-magenta → --smh-primary-teal` tokens.
- `#fff` → replaced with `--smh-white` token.
- `#ddd` → mapped to `--smh-gray-200` neutral token.
- `#2196f3` blue accent callout → directed to `--smh-primary-teal` token.
- `#444` → mapped to `--smh-ink` for ink/dark text.

## Notes
- Updated the manifest annotations only; palette/token definitions now reference canonical Champagne tokens instead of raw hex strings.
- Guard checks and brand sync re-run to confirm compliance.

## Status
- guard-rogue-hex.mjs: ✅
- brand:guard: ✅
- guard-manifest-sync: ✅
- pnpm test: ✅
