# Atlas Docs Cleanup Report

## Summary
- Consolidated all Manus Atlas v1 materials into the canonical `/docs/manus-atlas/v1/` location.
- Removed placeholder scaffolding to leave only substantive Atlas v1 content.
- Merged imported roadmap and audit details so there is a single authoritative source for each file.

## Files moved (old → new)
- `docs/integration/Integration_Roadmap.md` → `docs/manus-atlas/v1/Integration_Roadmap.md` (route order content merged into the canonical roadmap).
- `reports/manus/Manus_Audit_Report.md` → `docs/manus-atlas/v1/Manus_Audit_Report.md` (compliance table merged into the canonical audit report).

## Placeholders removed
- `docs/manus-atlas/v1/meta/Atlas_Readme.md`
- `docs/manus-atlas/v1/meta/Atlas_Index.md`
- `docs/manus-atlas/v1/gaps/Missing_Sections.md`
- `docs/manus-atlas/v1/pages/Home_Page.md`
- `docs/manus-atlas/v1/pages/Technology_Page.md`
- `docs/manus-atlas/v1/pages/Composite_Bonding.md`
- `docs/manus-atlas/v1/effects/Glass_Surfaces.md`
- `docs/manus-atlas/v1/effects/Particles.md`
- `docs/manus-atlas/v1/effects/Film_Grain.md`
- `docs/manus-atlas/v1/effects/Wave_Masks.md`
- `docs/manus-atlas/v1/section-archetypes/Technology_Archetype.md`
- `docs/manus-atlas/v1/section-archetypes/Treatment_Archetype.md`
- `docs/manus-atlas/v1/section-archetypes/CTA_Archetype.md`
- `docs/manus-atlas/v1/section-archetypes/Homepage_Archetype.md`
- `docs/manus-atlas/v1/components/CTA_Systems.md`
- `docs/manus-atlas/v1/components/Viewer_3D_Systems.md`
- `docs/manus-atlas/v1/components/Hero_Systems.md`
- `docs/manus-atlas/v1/components/Card_Systems.md`
- `docs/manus-atlas/v1/components/FAQ_Systems.md`
- `docs/manus-atlas/v1/components/Testimonial_Systems.md`
- `docs/manus-atlas/v1/components/AI_Tools_Systems.md`
- `docs/manus-atlas/v1/roadmaps/Integration_Roadmap.md`
- `docs/manus-atlas/v1/roadmaps/Design_Roadmap.md`

## Placeholders kept and marked for Atlas v2
- None.

## Canonical Atlas v1 files
- `/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md`
- `/docs/manus-atlas/v1/Manus_Audit_Report.md`
- `/docs/manus-atlas/v1/Integration_Roadmap.md`
- `/docs/manus-atlas/v1/Assets_Register.json`
- `/docs/manus-atlas/v1/Manus_Section_Catalog.json`
- `/docs/manus-atlas/v1/Intake_Batch_Summary.md`

## Guards and tests
- `pnpm test`
- `pnpm brand:guard`
- `node scripts/guard-rogue-hex.mjs`
- `node scripts/guard-manifest-sync.mjs`
