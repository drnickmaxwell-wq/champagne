# CHAMPAGNE SEO Section Layout + Cannibalisation Review V1

**Role:** `CHAMPAGNE_SEO_SECTION_LAYOUT_AND_CANNIBALISATION_REVIEW_V1`  
**Repo:** `drnickmaxwell-wq/champagne`  
**Review date:** 2026-06-05  
**Authority status:** `INSPECTION_ONLY_NO_IMPLEMENTATION`

## Scope Boundary

Inspection only. No implementation changes were made to routes, treatment content, hero, visual design, layout, header/footer, API, concierge, portal, stock/ops, PHI/PMS, deployment, scraping, browser automation, analytics, GBP, or external publishing surfaces.

## Files Inspected

- `tools/audits/seo-answer-packet-compression/CHAMPAGNE_SEO_ANSWER_PACKET_COMPRESSION_V1.md`
- `tools/audits/seo-answer-packet-compression/CHAMPAGNE_SEO_ANSWER_PACKET_COMPRESSION_V1.json`
- `tools/audits/seo-post-patch-validation/CHAMPAGNE_SEO_POST_PATCH_VALIDATION_V1.md`
- `tools/audits/seo-post-patch-validation/CHAMPAGNE_SEO_POST_PATCH_VALIDATION_V1.json`
- `packages/champagne-manifests/data/seo/local-identity.smh.json`
- `packages/champagne-manifests/data/seo/approved-facts.smh.json`
- `packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json`
- `packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json`
- `apps/web/app/treatments/[slug]/page.tsx`
- `packages/champagne-manifests/src/core.ts`
- `packages/champagne-manifests/src/helpers.ts`
- `scripts/seo-launch-safety-check.mjs`
- `REPORTS/TREATMENT_INVENTORY.md`
- Relevant `packages/champagne-manifests/data/sections/smh/treatments.*.json` section layout files for each route listed by the guard warning.

## Section Layout Ownership

The treatment route source does **not** own individual treatment page section stacks. `apps/web/app/treatments/[slug]/page.tsx` resolves a treatment, emits JSON-LD, and renders `ChampagnePageBuilder` with `pageSlug`.

Section layout ownership is:

1. `packages/champagne-manifests/data/sections/smh/treatments.*.json` — per-route section layout data.
2. `packages/champagne-manifests/src/core.ts` — imports each section layout JSON and registers entries in `champagneSectionLayouts`.
3. `getSectionStackForPage()` in `packages/champagne-manifests/src/core.ts` — resolves route → routeId → registered section layout first, then falls back to page manifest `sections`, then page-type defaults.
4. `scripts/seo-launch-safety-check.mjs` — current warning source; it reads `REPORTS/TREATMENT_INVENTORY.md` and prints whatever stale `Treatments missing section layout:` line exists there.

## Missing Section Layout Findings

The current guard warning is driven by stale `REPORTS/TREATMENT_INVENTORY.md` text, not by live section-layout resolution. All 12 routes reported as missing have matching section layout JSON files on disk and are imported/registered in `packages/champagne-manifests/src/core.ts`.

| Route reported by guard | Actual layout file | Route ID | Sections | Finding | Safest future fix | Risk |
| --- | --- | --- | ---: | --- | --- | --- |
| `/treatments/composite-bonding` | `packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json` | `treatments.composite-bonding` | 12 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/injection-moulded-composite` | `packages/champagne-manifests/data/sections/smh/treatments.injection-moulded-composite.json` | `treatments.injection-moulded-composite` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/full-smile-makeover` | `packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json` | `treatments.full-smile-makeover` | 8 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/emergency-dentistry` | `packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json` | `treatments.emergency-dentistry` | 11 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/emergency-dental-appointments` | `packages/champagne-manifests/data/sections/smh/treatments.emergency-dental-appointments.json` | `treatments.emergency-dental-appointments` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/severe-toothache-dental-pain` | `packages/champagne-manifests/data/sections/smh/treatments.severe-toothache-dental-pain.json` | `treatments.severe-toothache-dental-pain` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/dental-abscess-infection` | `packages/champagne-manifests/data/sections/smh/treatments.dental-abscess-infection.json` | `treatments.dental-abscess-infection` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/broken-chipped-cracked-teeth` | `packages/champagne-manifests/data/sections/smh/treatments.broken-chipped-cracked-teeth.json` | `treatments.broken-chipped-cracked-teeth` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/knocked-out-tooth` | `packages/champagne-manifests/data/sections/smh/treatments.knocked-out-tooth.json` | `treatments.knocked-out-tooth` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/lost-crowns-veneers-fillings` | `packages/champagne-manifests/data/sections/smh/treatments.lost-crowns-veneers-fillings.json` | `treatments.lost-crowns-veneers-fillings` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/dental-trauma-accidents` | `packages/champagne-manifests/data/sections/smh/treatments.dental-trauma-accidents.json` | `treatments.dental-trauma-accidents` | 9 | False-positive stale inventory row | A. Manifest/report data only | Low |
| `/treatments/tooth-wear-broken-teeth` | `packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json` | `treatments.tooth-wear-broken-teeth` | 10 | False-positive stale inventory row | A. Manifest/report data only | Low |

### Missing Layout Conclusion

Do **not** edit route source to fix the missing-layout warning. The safest later patch is data/report-only:

1. Refresh or regenerate `REPORTS/TREATMENT_INVENTORY.md` so these routes no longer appear as missing.
2. In a separately authorized guard-hardening mission, consider updating `scripts/seo-launch-safety-check.mjs` to live-resolve `champagneSectionLayouts` instead of trusting stale Markdown text.

## Cannibalisation Cluster Findings

The guard prints high-risk clusters by slug regex from `REPORTS/TREATMENT_INVENTORY.md`. These are real clusters to audit, but the output is not proof that a route conflict exists. Canonical owner/supporting intent should be recorded as metadata before any copy, routing, canonical, or noindex decisions.

### Implants Cluster

**Guard routes:**

- `/treatments/3d-implant-restorations`
- `/treatments/failed-implant-replacement`
- `/treatments/implant-aftercare`
- `/treatments/implant-consultation`
- `/treatments/implant-retained-dentures`
- `/treatments/implants`
- `/treatments/implants-bone-grafting`
- `/treatments/implants-full-arch`
- `/treatments/implants-multiple-teeth`
- `/treatments/implants-single-tooth`
- `/treatments/sedation-for-implants`
- `/treatments/sinus-lift`
- `/treatments/teeth-in-a-day`

**Recommended canonical owner:** `/treatments/implants`  
**Recommended supporting routes:** all route-specific implant sub-intents above.  
**Fix type:** D first — defer / needs human SEO decision; then A or B data-only metadata.  
**Risk:** Medium.

### Cosmetic Cluster

**Guard routes:**

- `/treatments/3d-printed-veneers`
- `/treatments/composite-bonding`
- `/treatments/digital-smile-design`
- `/treatments/full-smile-makeover`
- `/treatments/home-teeth-whitening`
- `/treatments/lost-crowns-veneers-fillings`
- `/treatments/senior-mature-smile-care`
- `/treatments/teeth-whitening`
- `/treatments/teeth-whitening-faqs`
- `/treatments/veneers`
- `/treatments/whitening-sensitive-teeth`
- `/treatments/whitening-top-ups`

**Recommended canonical owner:** `/treatments/cosmetic-dentistry` for broad cosmetic-dentistry hub intent.  
**Required preserved decisions:** `/treatments/3d-digital-dentistry` remains primary for same-day veneers workflow; `/treatments/veneers` remains broader veneers support and must not outrank implants, emergency, Spark Aligners / orthodontics, or private/general dentistry.  
**Recommended supporting routes:** veneers, 3D printed veneers, composite bonding, digital smile design, full smile makeover, whitening routes, and senior mature smile care as specific sub-intents.  
**Fix type:** D first — defer / needs human SEO decision; then A or B data-only metadata.  
**Risk:** High because the cluster contains distinct cosmetic, emergency-restoration, whitening, and veneers intents.

### Orthodontics Cluster

**Guard routes:**

- `/treatments/clear-aligners`
- `/treatments/clear-aligners-spark`
- `/treatments/dental-retainers`
- `/treatments/fixed-braces`
- `/treatments/mouthguards-and-retainers`
- `/treatments/orthodontics`

**Recommended canonical owner:** `/treatments/orthodontics` for broad orthodontic intent.  
**Recommended supporting routes:** `/treatments/clear-aligners-spark` owns Spark Aligners priority queries; clear aligners, fixed braces, dental retainers, and mouthguards/retainers remain specific support routes.  
**Fix type:** D first — defer / needs human SEO decision; then A or B data-only metadata.  
**Risk:** Medium.

### Emergency Cluster

**Guard routes:**

- `/treatments/broken-chipped-cracked-teeth`
- `/treatments/dental-abscess-infection`
- `/treatments/dental-trauma-accidents`
- `/treatments/emergency-dental-appointments`
- `/treatments/emergency-dentistry`
- `/treatments/knocked-out-tooth`
- `/treatments/lost-crowns-veneers-fillings`
- `/treatments/severe-toothache-dental-pain`
- `/treatments/tooth-wear-broken-teeth`

**Recommended canonical owner:** `/treatments/emergency-dentistry` for broad emergency dentist intent.  
**Recommended supporting routes:** symptom/incident pages for severe toothache, abscess, trauma, knocked-out tooth, broken/chipped/cracked teeth, lost restorations, emergency appointments, and tooth wear/broken teeth.  
**Fix type:** D first — defer / needs human SEO and clinical decision; then A or B data-only metadata.  
**Risk:** High because emergency intent is safety-sensitive.

## Can These Be Fixed Without Route / Source Rewrites?

| Area | Fix path | Recommendation |
| --- | --- | --- |
| Missing section layout warning | A. Manifest/report data only | Yes. Refresh `REPORTS/TREATMENT_INVENTORY.md`; route source patch is not justified. |
| Missing section layout guard robustness | C only if explicitly authorized | A future guard mission may update `scripts/seo-launch-safety-check.mjs` to live-resolve section layouts. Not needed for route rendering. |
| Cannibalisation owner/supporting metadata | A or B after human decision | Prefer approved facts/local identity/treatment fact metadata or section-layout metadata. Do not rewrite route source. |
| Cannibalisation content changes | D | Defer. Requires human SEO/clinical decision and fresh content authority. |
| Canonical/noindex/routing changes | D | Defer. No evidence from this inspection justifies route source changes. |

## Safe Files for a Later Approved Patch

- `REPORTS/TREATMENT_INVENTORY.md` — refresh stale inventory rows.
- Future inventory generator, if one is introduced or found in a later mission.
- `packages/champagne-manifests/data/seo/approved-facts.smh.json` — canonical intent annotations only.
- `packages/champagne-manifests/data/seo/local-identity.smh.json` — local priority governance annotations only.
- `packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json` — route owner/supporting metadata only.
- `packages/champagne-manifests/data/sections/smh/treatments.*.json` — metadata-only owner/supporting tags only if approved; no copy rewrite.

## Files Not To Touch

- `apps/web/app/treatments/[slug]/page.tsx` unless a future mission explicitly authorizes route source work.
- `apps/web/app/layout.tsx`.
- `apps/web/app/globals.css`.
- `apps/web/app/components/hero/HeroRenderer.tsx`.
- Sacred hero engine files.
- Sacred hero manifests.
- Visual design, layout, header/footer, API, concierge, portal, stock/ops, PHI/PMS files.

## Recommended Implementation Order

1. Refresh/regenerate `REPORTS/TREATMENT_INVENTORY.md` so missing-layout rows match the already-registered section layout JSON files.
2. Optionally harden `scripts/seo-launch-safety-check.mjs` in a future approved guard mission so it live-resolves `champagneSectionLayouts` instead of trusting stale Markdown text.
3. Get human SEO/clinical sign-off for canonical owner/supporting route intent per cluster.
4. Add owner/supporting metadata to approved facts, local identity, treatment facts, or section layout JSON only after sign-off.
5. Re-run validation; do not patch route source unless future explicit authority says data-only evidence is insufficient.

## Validation Commands For Later Approved Patch

- `npm run guard:seo-launch-safety`
- `npm run seo:answer-foundation-qa`
- `npm run seo:answer-packet-qa`
- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`
- `npm run lint`
- `npm run build`
- `git diff --check`

## Validation Run This Mission

| Command | Result |
| --- | --- |
| `npm run guard:seo-launch-safety` | PASS_WITH_EXISTING_WARNINGS |
| `npm run seo:answer-foundation-qa` | PASS |
| `npm run seo:answer-packet-qa` | PASS |
| `git diff --check` | PASS |

## Authority Status

`INSPECTION_ONLY_PASS_WITH_EXISTING_LAUNCH_READINESS_WARNINGS`

No implementation was performed. Missing-layout warnings appear to be stale inventory false positives. Cannibalisation clusters should be handled through human-approved owner/supporting intent metadata before any content, canonical, noindex, route, or source patch is considered.
