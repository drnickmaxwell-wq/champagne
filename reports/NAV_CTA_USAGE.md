# Navigation and CTA manifest usage

## Navigation
- Navigation links come from `manifest.nav.main.json`, imported and normalized by `getMainNavItems` in `packages/champagne-manifests/src/core.ts`. 【packages/champagne-manifests/src/core.ts】
- The site header (`apps/web/app/_components/Header.tsx`) calls `getMainNavItems()` and renders the returned items in the top nav. 【apps/web/app/_components/Header.tsx】

## CTA slots
- CTA slots are stored on each page manifest inside `champagne_machine_manifest_full.json` under the `ctas` key. `getCTASlotsForPage` in `packages/champagne-manifests/src/helpers.ts` normalizes hero, mid-page, and footer CTA lists for a given slug. 【packages/champagne-manifests/src/helpers.ts】【packages/champagne-manifests/data/champagne_machine_manifest_full.json】
- `ChampagnePageBuilder` resolves `pageSlug`, pulls CTA slots via `getCTASlotsForPage`, maps them to variants with `resolveCTAList`, and injects them into `ChampagneHeroFrame` (hero CTA) and `ChampagneSectionRenderer` (mid/footer inserts). 【apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx】
- `ChampagneSectionRenderer` inserts mid-page CTAs at the midpoint of the section list and adds footer CTAs when no closing CTA section exists. 【packages/champagne-sections/src/ChampagneSectionRenderer.tsx】
