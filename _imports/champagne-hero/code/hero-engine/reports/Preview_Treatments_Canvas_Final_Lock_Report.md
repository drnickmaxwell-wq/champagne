# Preview Treatments Canvas Final Lock Report

**Internal wiring note (current state):**
- Canvas owner: `app/preview/treatments/layout.tsx` wraps all treatment previews with `cpv-page cpv-page--champagne-dark cpv-page--treatments` and `data-preview-scope="treatments"`.
- Potential light painters identified: legacy preview skins in `styles/preview/treatments.css` (section-level only) and `styles/preview/treatments-light.css` (unused by the treatments subtree); no page-level light selectors remain in the treatments subtree.
- Neutralisation approach: high-specificity `.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` rule now exclusively paints the treatments canvas; no hero tone or light-skin wrapper is allowed to override it.

## Changes applied
- Locked the treatments layout to the shared dark canvas with `cpv-page cpv-page--champagne-dark cpv-page--treatments` plus `data-preview-scope="treatments"`.
- Added a dedicated treatments canvas selector in `styles/preview/champagne-preview.css` that reuses the Champagne ink + magenta/teal gradient stack and on-dark text tokens.
- Verified no `/preview/treatments/**` pages import light skins or add their own canvas wrappers (only section/panel styling remains).

## Canonical canvas rule
- Selector: `.cpv-page.cpv-page--champagne-dark.cpv-page--treatments`
- Paints: dark Champagne gradient stack with on-dark text tokens and `min-height: 100vh`.
- Applied by: `app/preview/treatments/layout.tsx` for the entire `/preview/treatments/**` subtree.

## Neutralised/isolated light styles
- Legacy light preview skins (`treatments-light.css`, `treatments.css`) remain available for other previews but are not imported or wrapped by `/preview/treatments/**` routes.
- No canvas-level selectors targeting `body`, `html`, `.cpv-page`, `.tl-main`, or `.tp-main` remain active for treatment previews.

## Hero scoping confirmation
- Hero tone/intensity classes remain confined to hero containers (e.g., `.hero-engine-shell`, `.hero-frame`) with no selectors targeting `.cpv-page` or layout wrappers.

## QA checklist
- Hub loads on dark Champagne canvas after hard refresh.
- Navigating hub → whitening → hub → composite-bonding → hub keeps the canvas dark and consistent.
- Other `/preview/treatments/**` routes (e.g., veneers, implants, orthodontics) share the same canvas with no light/washed states.
- Hero band remains visible on all routes; tone variations stay within the hero band only.

## Tests
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- `pnpm brand:guard`
- `node scripts/guard-rogue-hex.mjs`
- `node scripts/guard-manifest-sync.mjs`

(Commands may be unavailable in the current runner; see chat summary for execution status.)
