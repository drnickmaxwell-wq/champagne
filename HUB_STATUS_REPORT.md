# Hub Status Report

## Existing hubs (category = "hub")
- **Home** (`/`) — manifest category hub with full section stack.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L7-L242】
- **About** (`/about`) — manifest category hub with story/people placeholders and CTA entry.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L414-L438】
- **Team** (`/team`) — manifest category hub with team intro/grid and CTA entry.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L440-L485】

## Other hub-like surfaces
- **Treatments index** (`/treatments`) exists as a hard-coded list page rather than a manifest hub; navigation links point here.【F:apps/web/app/treatments/page.tsx†L1-L147】【F:packages/champagne-manifests/data/manifest.nav.main.json†L2-L9】

## Referenced but missing hubs
- No separate cosmetic/implants/whitening hub manifests exist; CTAs and routing cards point directly to treatment leaf pages instead (e.g., `/treatments/implants`, `/treatments/veneers`).【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L244-L320】【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L79-L135】
- Navigation does not reference any hub that lacks a route; all nav links resolve to implemented pages (home, treatments index, team, smile-gallery, blog stub, contact, patient portal).【F:packages/champagne-manifests/data/manifest.nav.main.json†L2-L10】
