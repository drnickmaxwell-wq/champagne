# Page Coverage Diff

## Planned sources
- Machine manifest lists home, treatments hub, contact, team, smile gallery, blog, patient portal, and numerous treatment/toplevel pages (utility pages like finance, practice plan, video consultation, dental check-ups, etc.).
- Treatment catalogue covers all `/treatments/{slug}` entries from the machine manifest.

## Coverage status
- ✅ Dedicated routes: `/`, `/treatments`, `/treatments/[slug]`, `/contact`, `/blog`, `/team`, `/patient-portal`, `/champagne/about`, `/champagne/legal/privacy`, `/champagne/smile-gallery`, plus champagne debug routes.
- ✅ Treatment leaf coverage: `/treatments/[slug]` resolves any manifest-backed treatment path (including multi-word slugs) and renders via `ChampagnePageBuilder` with optional hero.
- ⚠️ Catch-all pages: single-segment non-treatment slugs (e.g., `/video-consultation`, `/finance`, `/practice-plan`, `/dental-checkups-oral-cancer-screening`, `/about`) resolve through `(site)/[page]` and rely on the generic builder without bespoke route files.
- ⚠️ Layout gaps: treatment pages with layout JSON present but not imported (whitening set, periodontal gum care, children’s dentistry, 3D dentistry & technology) render using inline manifest sections rather than the SMH layout list.
- ❌ Missing routes: none detected; all manifest slugs are reachable via dedicated routes or the catch-all/treatment dynamic route.
