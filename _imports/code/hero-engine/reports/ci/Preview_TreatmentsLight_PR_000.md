# Preview Treatments Light PR 000

## Summary
- Restored `public/brand/manifest.json` to the mainline snapshot and left other sacred brand assets untouched.
- Updated the `/preview/treatments-light/` page to source schema data from `/reports/routes-map.json` and `/config/seo/Treatments_Schema_Pack.json`.
- Added a direct copy of the routes map under `/reports/routes-map.json` for preview consumption without touching production routes.

## File inventory
- `app/preview/treatments-light/page.tsx`
- `public/brand/manifest.json`
- `reports/routes-map.json`
- `styles/preview/treatments-light.css`

## Sacred file confirmation
- `public/brand/*` other than `manifest.json` shows no changes (`git status`).
- `styles/tokens/smh-champagne-tokens.css` untouched (`git status`).
- `components/home/ChampagneHero.tsx` and `app/champagne/hero/page.tsx` untouched (no diffs in `git status`).

## Guard + build log
- `pnpm run brand:guard`
- `pnpm run guard:hero`
- `node scripts/guard-sacred-routes.mjs` *(fails: repository lacks \\`origin/main\\` remote; manually confirmed sacred routes unchanged via \\`git status\\`)*
- `CI=1 pnpm run build`
