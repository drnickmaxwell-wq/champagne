# HUMAN REPORT

## Packet
PACKET_ZONEA_013_ADD_SURGICALLY_GUIDED_IMPLANTS_TO_TREATMENTS_MENU

## What was implemented
- Traced `/treatments` rendering: `apps/web/app/treatments/page.tsx` renders `ChampagnePageBuilder` with `slug="/treatments"`.
- Verified section resolution path: `ChampagnePageBuilder` -> `ChampagneSectionRenderer` -> `getSectionStack` -> `getSectionStackForPage`.
- Confirmed `/treatments` uses manifest fallback sections (no `routeId: "treatments"` SMH layout exists), so the authoritative hub menu list is in `packages/champagne-manifests/data/champagne_machine_manifest_full.json` under `pages.treatments_hub.sections`.
- Added one new entry to the `treatments_hub_all_treatments_index` routing cards list:
  - title: `Surgically guided implants`
  - href: `/treatments/surgically-guided-implants`

## Why this list was changed
- The main user-facing Treatments hub `/treatments` renders the `treatments_hub_all_treatments_index` `routing_cards` items from `pages.treatments_hub.sections` in the machine manifest.
- This list already contains the implant-related leaf links (e.g., sinus lift, teeth-in-a-day, sedation-for-implants, failed-implant-replacement, implant-aftercare), making it the correct single source to extend.

## Constraint checks
- Smallest diff applied (single functional list entry + required report updates).
- No redirects added.
- No copy rewrites beyond the single new menu item label.
- No refactors.
- No hero/token/theming system changes.

## Proof run
- `pnpm run guard:all` ✅
- `pnpm run build:web` ✅
