# CHAMPAGNE SEO Inventory Refresh + Guard Hardening V1

**Role:** `CHAMPAGNE_SEO_INVENTORY_REFRESH_AND_GUARD_TRUTH_HARDENER_V1`  
**Repo:** `drnickmaxwell-wq/champagne`  
**Review date:** 2026-06-05  
**Authority status:** `DIRECTOR_AUTHORIZED_SEO_INVENTORY_REFRESH_AND_GUARD_TRUTH_HARDENING`  

## Scope Boundary

This mission refreshed treatment inventory truth and hardened the SEO launch safety guard's section-layout warning source. No patient-facing treatment copy, route definitions, canonical/noindex behaviour, hero, design, visual layout, header/footer, deployment, analytics, or external publishing surfaces were changed.

Cannibalisation clusters were not remediated. They remain a separate human editorial/SEO decision mission.

## Files Changed

| File | Exact reason for change |
| --- | --- |
| `REPORTS/TREATMENT_INVENTORY.md` | Regenerated stale inventory from live machine-manifest treatment routes and registered `champagneSectionLayouts` data so section-layout status reflects actual registered layout JSON files. |
| `scripts/seo-launch-safety-check.mjs` | Hardened missing-section-layout checks to resolve live treatment routes from `champagne_machine_manifest_full.json` and registered section layouts from `packages/champagne-manifests/src/core.ts`, instead of replaying stale Markdown warning text. |
| `tools/audits/seo-inventory-refresh-guard-hardening/CHAMPAGNE_SEO_INVENTORY_REFRESH_GUARD_HARDENING_V1.md` | Added human-readable audit record for this mission. |
| `tools/audits/seo-inventory-refresh-guard-hardening/CHAMPAGNE_SEO_INVENTORY_REFRESH_GUARD_HARDENING_V1.json` | Added machine-readable audit record for this mission. |

## Missing Section Layout Warning Finding

The missing-section-layout warning was confirmed stale.

Before hardening, `npm run guard:seo-launch-safety` read the stale `Treatments missing section layout:` line from `REPORTS/TREATMENT_INVENTORY.md` and warned on 12 routes.

After refreshing inventory truth and hardening the guard, `npm run guard:seo-launch-safety` resolves live manifest data and reports:

- `SEO_LAUNCH_SAFETY_PASS: machine manifest exposes 78 treatment routes for SEO coverage review`
- `SEO_LAUNCH_SAFETY_PASS: all 78 treatment routes have registered section layouts`

## Routes / Layouts Verified

| Route | Registered section layout file | Registered sections | Finding |
| --- | --- | ---: | --- |
| `/treatments/composite-bonding` | `packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json` | 12 | Confirmed registered; stale warning removed. |
| `/treatments/injection-moulded-composite` | `packages/champagne-manifests/data/sections/smh/treatments.injection-moulded-composite.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/full-smile-makeover` | `packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json` | 8 | Confirmed registered; stale warning removed. |
| `/treatments/emergency-dentistry` | `packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json` | 11 | Confirmed registered; stale warning removed. |
| `/treatments/emergency-dental-appointments` | `packages/champagne-manifests/data/sections/smh/treatments.emergency-dental-appointments.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/severe-toothache-dental-pain` | `packages/champagne-manifests/data/sections/smh/treatments.severe-toothache-dental-pain.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/dental-abscess-infection` | `packages/champagne-manifests/data/sections/smh/treatments.dental-abscess-infection.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/broken-chipped-cracked-teeth` | `packages/champagne-manifests/data/sections/smh/treatments.broken-chipped-cracked-teeth.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/knocked-out-tooth` | `packages/champagne-manifests/data/sections/smh/treatments.knocked-out-tooth.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/lost-crowns-veneers-fillings` | `packages/champagne-manifests/data/sections/smh/treatments.lost-crowns-veneers-fillings.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/dental-trauma-accidents` | `packages/champagne-manifests/data/sections/smh/treatments.dental-trauma-accidents.json` | 9 | Confirmed registered; stale warning removed. |
| `/treatments/tooth-wear-broken-teeth` | `packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json` | 10 | Confirmed registered; stale warning removed. |

## Guard Behaviour Before / After

| State | Behaviour |
| --- | --- |
| Before | Guard passed core robots/sitemap/legal checks, extracted 73 routes from stale Markdown, then printed a false missing-section-layout warning for 12 routes. |
| After | Guard passes core robots/sitemap/legal checks, extracts 78 treatment routes from the live machine manifest, verifies all 78 against registered section-layout JSON data, and emits no missing-section-layout warning. |

## Cannibalisation Warnings Deferred

High-risk cannibalisation clusters are still intentionally printed by the guard as informational launch-review prompts. No cannibalisation remediation was attempted in this mission. Cluster resolution requires a separate human decision mission for one-intent-per-page editorial direction.

## Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `npm run guard:seo-launch-safety` | PASS | Missing-section-layout warning removed; cannibalisation info remains. |
| `npm run seo:answer-foundation-qa` | PASS | Answer foundation QA passed. |
| `npm run seo:answer-packet-qa` | PASS | Answer packet QA passed. |
| `npm run lint` | PASS | Workspace lint passed. |
| `npm run build` | PASS | Production web build completed. |
| `git diff --check` | PASS | No whitespace errors. |

## Rollback Notes

To roll back, revert this commit. That restores the prior Markdown-derived warning behaviour and previous `REPORTS/TREATMENT_INVENTORY.md` contents. No route, patient-facing copy, hero, visual design, canonical, noindex, or registry ownership changes need separate rollback.

## Authority Status

`DIRECTOR_AUTHORIZED_SEO_INVENTORY_REFRESH_AND_GUARD_TRUTH_HARDENING` under strict SEO inventory/guard truth scope. Sacred hero/design zones were not touched.
