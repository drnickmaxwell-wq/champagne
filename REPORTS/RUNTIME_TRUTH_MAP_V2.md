# Runtime Truth Map (V2)

## App Router entrypoints
- `/` → conditional `HeroRenderer` plus manifest-driven `ChampagnePageBuilder` for `/`.
- `/blog`, `/contact`, `/team` → conditional `HeroRenderer` with `ChampagnePageBuilder` targeting the matching slug.
- `/treatments` → optional treatment hero, renders treatment hub sections via `ChampagneSectionRenderer`, then manifest-derived treatment cards.
- `/treatments/[slug]` → resolves treatment manifest for the slug, optional hero, and renders via `ChampagnePageBuilder` using the manifest path.
- `/patient-portal` → intent-specific landing copy plus `ChampagnePageBuilder` for `/patient-portal`.
- `(site)/[page]` → catch-all for non-treatment slugs; resolves page manifest, gates out treatment paths, and renders with optional hero + builder.
- `(champagne)/smile-gallery`, `(champagne)/legal/privacy`, `(champagne)/about` → direct builder or hero-frame + section renderer previews for specific slugs.
- Debug/diagnostic routes under `/champagne/*` (hero labs, sections debugger, hero preview/asset lab) render tooling surfaces and do not change public routing.

## Runtime manifest imports
- `packages/champagne-manifests/src/core.ts` imports the machine manifest, nav manifest, public brand manifest, styles manifest, Manus import bundle, media deck, journey, section defaults, section library, and SMH section layout JSON files to assemble runtime registries and section stacks.
- `packages/champagne-manifests/src/helpers.ts` layers schema validation and exposes getters over the same manifest registry (including CTA slots, hero lookup, section layouts, journeys, and media decks).
- `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts` imports sacred hero base/surfaces/variants/weather JSON plus marketing/treatment/editorial/utility variant manifests to build hero presets for the runtime hero registry.

## Section registry / resolver
- `packages/champagne-manifests/src/core.ts` maps route slugs to section layout manifests, falls back to per-page sections or page-type defaults, and normalises component types for layouts.
- `packages/champagne-sections/src/SectionRegistry.ts` resolves section definitions from manifests, derives component kinds, and enriches data (eyebrow, copy, CTAs, reviews) before rendering.
- `packages/champagne-sections/src/registry.ts` registers the concrete section components (feature list, media block, clinician insight, patient stories rail, FAQ, closing CTA, tools trio, overview rich, treatment media feature, routing cards) for lookup.
- `packages/champagne-sections/src/ChampagneSectionRenderer.tsx` maps section kinds to components and inserts mid/footer CTA groups from manifest-driven CTA slots.

## Navigation manifest and CTA wiring
- Navigation uses `manifest.nav.main.json` via `getMainNavItems` to build header/footer links at runtime.
- CTA wiring comes from `packages/champagne-cta/src/CTARegistry.ts`, which seeds CTA IDs (e.g., book consultation, video consultation, portal intents, practice plan, view treatments) and sanitises targets before resolution.
