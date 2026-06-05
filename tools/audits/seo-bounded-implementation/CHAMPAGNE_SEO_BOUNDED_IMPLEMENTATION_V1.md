# CHAMPAGNE SEO Bounded Implementation V1

**Role:** `CHAMPAGNE_SEO_BOUNDED_IMPLEMENTATION_PATCH_V1`  
**Repo:** `drnickmaxwell-wq/champagne`  
**Implementation date:** 2026-06-05  
**Action groups:** `LOCAL_ENTITY_PROOF_BUILD`, `AI_CITATION_READINESS`, `TREATMENT_AUTHORITY_PAGE_BUILD`

## Files Changed

| File | Exact reason |
| --- | --- |
| `packages/champagne-manifests/data/seo/local-identity.smh.json` | Added approved local entity proof, NAP/entity summary, service-route query support, and canonical intent labels using existing locality, address, contact, support-market, and priority-service data. |
| `packages/champagne-manifests/data/seo/approved-facts.smh.json` | Added a concise local entity summary, county/Sussex relevance, NAP source label, and canonical intent mapping decisions for 3D dentistry vs same-day veneers. |
| `packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json` | Added source-labelled local entity and authority summaries to relevant answer packets without changing approval flags or inventing clinical claims. |
| `packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json` | Added source-labelled local/entity summaries, treatment authority summaries, target query support, and canonical intent fields for priority service treatment facts. |
| `tools/audits/seo-bounded-implementation/CHAMPAGNE_SEO_BOUNDED_IMPLEMENTATION_V1.md` | Required human-readable implementation report. |
| `tools/audits/seo-bounded-implementation/CHAMPAGNE_SEO_BOUNDED_IMPLEMENTATION_V1.json` | Required machine-readable implementation report. |

## Target Queries Supported

- St Mary’s House Dental Care
- private dentist Shoreham-by-Sea
- private dentist West Sussex
- general dentistry Shoreham-by-Sea
- dental implants Shoreham-by-Sea
- dental implants West Sussex
- implant dentist Sussex
- emergency dentist Shoreham-by-Sea
- urgent dentist Shoreham-by-Sea
- emergency dentist West Sussex
- Spark Aligners Shoreham-by-Sea
- clear aligners Shoreham-by-Sea
- Spark Aligners West Sussex
- orthodontics Shoreham-by-Sea
- orthodontist Shoreham-by-Sea
- 3D dentistry Shoreham-by-Sea
- 3D dental scans Shoreham-by-Sea
- digital dentistry Shoreham-by-Sea
- same-day veneers Shoreham-by-Sea
- same-day crowns Shoreham-by-Sea
- digital veneers Shoreham-by-Sea

## Local Entity Improvements Made

- Added an explicit `localEntityProof` block for St Mary's House Dental Care using approved public NAP: St Mary's Road, Shoreham-by-Sea, West Sussex, BN43 5ZA; 01273 453109; info@smhdental.co.uk.
- Added primary locality and county/Sussex relevance labels: Shoreham-by-Sea, West Sussex, Sussex.
- Added service-to-route links for private dentistry, dental implants, emergency dentistry, Spark Aligners, and orthodontics.
- Added approved local target-query labels to priority service entries without route creation or UI changes.

## AI Citation Readiness Improvements Made

- Added `source_label` values to relevant answer packets.
- Added `local_entity_summary` values so AI extraction can identify the practice, locality, and route owner.
- Added `authority_summary` values that summarise existing page-truth/approved-fact evidence without promoting unsupported claims.
- Preserved all existing `evidence_source` arrays and approval flags.

## Treatment Authority Improvements Made

- **Dental implants:** strengthened treatment fact summaries around planning-led care, CBCT/digital scans, suitability boundaries, alternatives, aftercare, and maintenance.
- **Emergency dentistry:** strengthened treatment fact summaries around triage, pain/swelling/trauma/infection assessment, stabilisation, and safety boundaries.
- **Spark Aligners / orthodontics:** strengthened treatment fact summaries around digital scans, staged aligner trays, fixed braces, retainers, progress checks, retention, and suitability boundaries.
- **Private/general dentistry:** anchored private dentist intent to approved NAP and general dentistry to the existing preventative/general dentistry route.

## Canonical Intent Mapping Decision

| Intent | Primary route | Supporting route | Decision |
| --- | --- | --- | --- |
| 3D dentistry Shoreham | `/treatments/3d-dentistry-and-technology` | `/treatments/3d-digital-dentistry` | The 3D dentistry route owns technology-capability intent such as CBCT, 3D scanning, guided planning, digital scans, and 3D printing where appropriate. |
| Same-day veneers Shoreham | `/treatments/3d-digital-dentistry` | `/treatments/veneers` | The 3D digital dentistry route owns same-day crown/veneer workflow intent; the veneers route remains the broader veneer treatment route. |

## Files Explicitly Not Touched

- `packages/champagne-hero/src/HeroAssetRegistry.ts`
- `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
- `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`
- `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
- `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`
- `packages/champagne-manifests/data/hero/sacred_*`
- `apps/web/app/components/hero/HeroRenderer.tsx`
- `apps/web/app/layout.tsx`
- `apps/web/app/treatments/[slug]/page.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/components/layout/Header.tsx`
- `apps/web/app/components/layout/Footer.tsx`
- `apps/web/app/components/layout/FooterLuxe.module.css`
- `apps/web/app/api/**`
- `apps/web/app/components/concierge/**`

## Risks

- Added registry-only fields are non-visual and should be ignored by consumers that do not yet read them.
- No live search, Google Business Profile, review, award, rating, or external citation claims were added.
- Clinical statements remain bounded to approved facts/page-truth evidence and retain assessment-gated language.

## Validation Results

| Command | Status | Notes |
| --- | --- | --- |
| `npm run lint` | PASS | Exited 0; existing Next.js lint deprecation/plugin warnings observed. |
| `npm run build` | PASS | Exited 0; existing Browserslist/Tailwind/Next ESLint configuration warnings observed. |
| `git diff --check` | PASS | No whitespace errors. |
| `npm run seo:schema-qa` | PASS | SEO schema graph QA passed with no errors or warnings. |
| `npm run seo:answer-foundation-qa` | PASS | AI answer foundation QA passed; existing word-count and veneers priority-service warnings remained. |
| `npm run seo:answer-packet-qa` | PASS | Priority service answer packet QA passed. |
| `npm run seo:answer-rendering-qa` | PASS | Visible answer surface rendering QA passed 11/11. |
| `npm run guard:hero` | PASS | Hero Guard and sacred hero lock passed. |
| `npm run guard:canon` | PASS | Canon Guard passed; existing Browserslist/Tailwind warnings observed during SSR smoke test. |
| `npm run verify` | PASS | Full verify exited 0; existing workspace dependency, SEO launch-safety, chatbot QA report, Browserslist, Tailwind, and Next ESLint plugin warnings observed. |

## Rollback Notes

- Revert this commit to remove the SEO registry additions and implementation report.
- No route, layout, hero, schema-emission, API, analytics, GBP, deployment, or visual state was changed.
