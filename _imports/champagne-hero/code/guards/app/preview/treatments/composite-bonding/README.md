# Composite Bonding Preview

This directory contains the composite bonding treatment sections while they are evaluated in preview.

- **Promotion flow:** Once approved, create `release/composite-bonding-stage-1` and migrate each section into the production `app/treatments/composite-bonding` route.
- **Guard expectations:** Keep tokens aligned with `/docs/Brand_Canon_Packet/smh-champagne-tokens.css` and avoid raw hex values. Preview-only guards must remain green before any promotion.
- **Showcase page:** `/app/preview/treatments/composite-bonding/page.tsx` renders each section with a preview banner and noindex metadata for reviewers.

After release, update `config/champagne/Manus_Section_Catalog.json` to mark the stage as `live` and adjust component paths.
