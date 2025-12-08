# Treatment layout usage (phase 5)

This note traces how treatment slugs now flow through the builder into the hero and section layout. It also calls out the key files to adjust when wiring new content.

## Flow from slug to rendered page

1. **Slug lookup**
   - `/treatments/[slug]` resolves the manifest entry via `getTreatmentManifest` (`apps/web/app/treatments/[slug]/page.tsx`).
   - `ChampagnePageBuilder` receives the resolved `pageSlug` and manifest reference.
2. **Hero resolution**
   - `ChampagnePageBuilder` derives the page label/eyebrow/strapline from the manifest (or the slug as a fallback) and fetches hero data with `getHeroManifest`.
   - `getHeroManifest` now merges the hero preset from `manifest.styles.champagne.json` when the hero is declared by ID, so style tokens land inside `ChampagneHeroFrame` even if the page manifest only stores the ID.
3. **Section stack**
   - Section IDs/types come from the machine manifest (`getSectionStackForPage`).
   - `packages/champagne-sections/src/SectionRegistry.ts` adapts raw entries into a clean internal shape (`kind`, `title`, `body`, `items`, etc.), filling sensible fallbacks when content is light.
4. **Render**
   - `ChampagneHeroFrame` renders eyebrow → title → strapline within a BaseChampagneSurface shell.
   - `ChampagneSectionRenderer` walks the normalized stack and maps `kind` to the available section components (`Section_TextBlock`, `Section_MediaBlock`, `Section_FeatureList`), inserting mid-page CTAs when configured.

## Where to adjust things

- **Add a new treatment**: add an entry to `packages/champagne-manifests/data/champagne_machine_manifest_full.json` (or the feeder manifest) with `path`, `hero`, and `sections`. The `/treatments` index and `[slug]` route will pick it up automatically.
- **Change section order or composition**: edit the `sections` array for the treatment in the manifest data. The registry adapter will normalize types and fallbacks without further wiring.
- **Adjust hero copy**: update `label`, `eyebrow/overline`, or `strapline/intro/summary` fields on the page manifest. If only a hero ID exists, styles will still be pulled from `manifest.styles.champagne.json`; add richer hero metadata there if needed.

## Notes on current gaps

- Many treatment sections only ship IDs/types today; the adapter supplies neutral, accessible placeholder copy to keep layouts complete until full text arrives.
- Hero presets from the styles manifest currently provide palette/motion metadata. If a hero-specific title/subtitle is ever authored there, `ChampagneHeroFrame` will display it automatically.

## Composite bonding — rich layout stack

- Overview rich (eyebrow, headline, key bullets)
- Media feature with Champagne canvas placeholder
- AI tools trio grid
- Clinician insight quote
- Patient stories rail
- FAQ block
- Closing CTA band
