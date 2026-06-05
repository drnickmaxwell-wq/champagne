# CHAMPAGNE SEO Pre-Patch Inspection V1

**Role:** `CHAMPAGNE_SEO_PRE_PATCH_INSPECTOR_V1`  
**Repo:** `drnickmaxwell-wq/champagne`  
**Inspection date:** 2026-06-05  
**Authority:** Read-only pre-patch inspection, with only this audit report written to disk. No site/content/source files were modified.

## 1. Excluded Work Confirmation

This inspection did **not** perform live network calls, scraping, browser automation, API integrations, automated search querying, Google Business Profile changes, analytics changes, chatbot/runtime changes, portal/PMS/PHI work, deployment, or implementation patches.

The target queries supplied in the mission were used as context labels only. They were not queried live.

## 2. Repo / Framework / Routing Summary

- The repo is a pnpm workspace. Root scripts include `lint`, `build`, `typecheck`, `guard:hero`, `guard:canon`, `guard:seo-launch-safety`, and `verify`.
- The public web app is `apps/web`, built with Next.js `15.5.7`, React `19.2.1`, and the App Router.
- Routing model: filesystem App Router pages under `apps/web/app/**`, with a manifest-driven page builder (`ChampagnePageBuilder`) rendering shared route content from `@champagne/manifests` and `@champagne/sections`.
- Core public route owners:
  - `/` -> `apps/web/app/page.tsx`
  - `/contact` -> `apps/web/app/contact/page.tsx`
  - `/about` -> `apps/web/app/(champagne)/about/page.tsx`
  - `/team` -> `apps/web/app/team/page.tsx`
  - `/treatments` -> `apps/web/app/treatments/page.tsx`
  - `/treatments/[slug]` -> `apps/web/app/treatments/[slug]/page.tsx`
  - Generic one-segment manifest routes -> `apps/web/app/(site)/[page]/page.tsx`
- Site-wide schema and metadata foundation already exists in `apps/web/app/layout.tsx` via `buildSiteSchemaGraph(...)`; route-level JSON-LD exists on homepage, contact, about, team, treatments hub, generic page, and treatment slug routes.

## 3. Route-to-File Inspection Map

| Intent / query family | Current canonical route | Route file | Content manifest owner | Notes |
| --- | --- | --- | --- | --- |
| Homepage / local entry route | `/` | `apps/web/app/page.tsx` | `packages/champagne-manifests/data/champagne_machine_manifest_full.json` page key `home` | Local proof sections present: `home_locality_nap`, `home_map_location`, `home_areas_served`, `home_access_parking`, home FAQs. |
| Contact / location route | `/contact` | `apps/web/app/contact/page.tsx` | manifest page key `contact` | NAP-style contact details, finding practice, urgent CTA, and closing CTA present. |
| About / practice proof route | `/about` | `apps/web/app/(champagne)/about/page.tsx` | manifest page key `about` | Practice story/proof content present. |
| Team / clinician proof route | `/team` | `apps/web/app/team/page.tsx` | manifest page key `team`; SEO team registry files | Team grid and verified schema team registry exist. |
| Private dentist / general dentistry route | `/treatments/preventative-and-general-dentistry` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `preventative_and_general_dentistry`; section layout file `packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json` | Existing route can absorb private/general dentistry authority work without route sprawl. |
| Dental implants | `/treatments/implants` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `implants`; layout file `packages/champagne-manifests/data/sections/smh/treatments.implants.json`; duplicate treatment collection entry also exists | Alias `/treatments/dental-implants` redirects/resolves to `/treatments/implants`. Needs duplicate-entry caution. |
| Emergency dentist | `/treatments/emergency-dentistry` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `emergency_dentistry`; layout file `packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json` | Strong existing route with triage, steps, emergency-topic links, FAQ, closing CTA. |
| Spark Aligners | `/treatments/clear-aligners-spark` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `clear_aligners_spark`; layout file `packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json` | Existing page route; no new route required. |
| Orthodontics | `/treatments/orthodontics` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `orthodontics`; layout file `packages/champagne-manifests/data/sections/smh/treatments.orthodontics.json` | Existing hub-style route with inventory links. |
| 3D dentistry | `/treatments/3d-dentistry-and-technology` and `/treatments/3d-digital-dentistry` | `apps/web/app/treatments/[slug]/page.tsx` | manifest keys `3d_dentistry_and_technology`, `technology_digital_dentistry`; layout files with matching names | Two overlapping routes: choose one primary canonical intent before patching. |
| Same-day veneers / same-day crowns-veneers | `/treatments/3d-digital-dentistry` and `/treatments/veneers` | `apps/web/app/treatments/[slug]/page.tsx` | manifest keys `technology_digital_dentistry`, `veneers`; layouts `treatments.3d-digital-dentistry.json`, `treatments.veneers.json` | Existing route options; avoid creating new same-day veneer route unless canon explicitly requires. |
| Sedation / nervous dentist | `/treatments/sedation-dentistry` | `apps/web/app/treatments/[slug]/page.tsx` | manifest page key `sedation_dentistry`; layout file `packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json` | Existing route supports anxiety/sedation intent. |

## 4. Shared Components / Modules Inspected

- Root metadata/schema/layout: `apps/web/app/layout.tsx`.
- Route owners: `apps/web/app/page.tsx`, `apps/web/app/contact/page.tsx`, `apps/web/app/(champagne)/about/page.tsx`, `apps/web/app/team/page.tsx`, `apps/web/app/treatments/page.tsx`, `apps/web/app/treatments/[slug]/page.tsx`, `apps/web/app/(site)/[page]/page.tsx`.
- Page builder: `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx`.
- Footer/NAP-adjacent navigation: `apps/web/app/components/layout/Footer.tsx`, `apps/web/app/components/layout/Header.tsx`, `packages/champagne-manifests/data/manifest.nav.main.json`.
- Schema/SEO data and builders: `packages/champagne-manifests/src/seo.ts`, `packages/champagne-manifests/data/seo/local-identity.smh.json`, `packages/champagne-manifests/data/seo/approved-facts.smh.json`, `packages/champagne-manifests/data/seo/team-registry.smh.json`.
- Manifest routing/helpers: `packages/champagne-manifests/src/core.ts`, `packages/champagne-manifests/src/helpers.ts`, `packages/champagne-manifests/src/index.ts`.
- AI citation readiness registries: `packages/champagne-manifests/src/aiAnswerFoundation.ts` and `packages/champagne-manifests/data/seo-ai-answer-foundation/*.json`.
- Section renderer and content components: `packages/champagne-sections/src/ChampagneSectionRenderer.tsx`, `packages/champagne-sections/src/SectionRegistry.ts`, `packages/champagne-sections/src/registry.ts`, `Section_FAQ`, `Section_TreatmentAnswerSurface`, `Section_ClinicianInsight`, `Section_TreatmentRoutingCards`, `Section_FeatureList`, `Section_TextBlock`, `sections/Section_PeopleGrid`.

## 5. Exact Ownership Findings

| Concern | Current owner(s) | Inspection finding |
| --- | --- | --- |
| Local entity proof | `local-identity.smh.json`, `approved-facts.smh.json`, homepage/contact manifests | Existing structured local identity has brand, legal entity, NAP, hours, primary/support markets, and priority services. Homepage/contact already display locality/contact sections. |
| NAP | `local-identity.smh.json`; homepage/contact manifest sections; `Footer.tsx` only has local positioning, not full NAP | Structured NAP exists in SEO JSON and ContactPage schema source; footer does not expose full address/telephone/email. Future NAP work should reconcile with approved facts before adding visible repetitions. |
| Footer | `apps/web/app/components/layout/Footer.tsx`, `FooterLuxe.module.css` | Footer has local practice positioning and internal links. Header/footer are normally protected by Champagne canon unless specifically authorized. |
| Schema / structured data | `apps/web/app/layout.tsx`, route page files, `packages/champagne-manifests/src/seo.ts`, SEO data JSON | Site graph includes Organization, Dentist/LocalBusiness, WebSite, WebPage, verified Person nodes, priority Service nodes. Treatment routes emit WebPage, Service, BreadcrumbList graph. FAQ schema is not currently emitted route-by-route from manifest FAQs. |
| FAQ / answer blocks | Manifest sections with `treatment_faq_block`; `Section_FAQ.tsx`; AI answer foundation registries | Visible FAQ blocks exist across homepage and treatment pages. AI answer registries exist for priority services. Future schema emission should avoid auto-promoting unreviewed FAQs. |
| Clinician / evidence proof | `team-registry.smh.json`, team route, `buildPersonNode`, `Section_ClinicianInsight`, team/people sections | Verified team members and Person/Dentist schema support clinician proof. Some team registry source notes reference prior live-site evidence and should not be treated as newly verified by this no-network inspection. |
| Internal links | nav manifest, footer links, route manifest CTAs/routing cards, treatment hub sections | Internal link inventory is rich. Some priority service links are in `local-identity.smh.json`; 3D/same-day intents have overlapping route targets needing canonical decision. |
| Treatment page templates | `apps/web/app/treatments/[slug]/page.tsx`, `ChampagnePageBuilder`, `ChampagneSectionRenderer`, treatment section JSON files | First-pass treatment authority work can be done through existing templates and manifests without route sprawl or redesign. |

## 6. Findings by First-Pass Action Group

### 6.1 LOCAL_ENTITY_PROOF_BUILD

- Strong foundation exists in `local-identity.smh.json` and `approved-facts.smh.json`.
- Homepage local proof sections exist (`home_locality_nap`, `home_map_location`, `home_areas_served`, `home_access_parking`).
- Contact route contains practice details, methods, finding-practice map, and emergency/support CTAs.
- Risk: Footer has local positioning but no complete visible NAP; duplicating NAP in future work must not introduce inconsistent address/phone/email/hours.

### 6.2 AI_CITATION_READINESS

- AI answer foundation module and data registries already exist.
- Target services include emergency dentist, dental implants, private dentist, Spark Aligners, orthodontics, 3D dentistry, same-day crowns/veneers, veneers, sedation/anxiety dentistry, hygiene/recall, and examinations.
- Registries include governance flags (`approved_for_ai`, `approved_for_voice`, `approved_for_chatbot`, `approved_for_schema`) and clinical-review requirements.
- Risk: Existing evidence sources include `live_site` references captured earlier; this inspection did not re-verify them live.

### 6.3 TREATMENT_AUTHORITY_PAGE_BUILD

- Existing treatment route architecture is suitable for bounded first-pass SEO authority improvements.
- Existing pages cover the requested target families: implants, emergency, Spark Aligners, orthodontics, 3D/digital dentistry, veneers, sedation/anxiety, and general/private dentistry.
- No route sprawl is necessary for a first pass.
- Main ambiguity: `3D dentistry` has two candidate routes; `same-day veneers` maps partly to `3d-digital-dentistry` and partly to `veneers`. A future implementation should select primary canonical intent routes before patching metadata/schema/internal links.

## 7. Can First-Pass SEO Work Use Existing Pages/Components?

Yes. The safest first patch can use existing page files, manifest SEO data, and existing treatment pages/components. It should not require new public routes, visual redesign, hero changes, header/footer changes, chatbot changes, or live integrations.

## 8. Risks and Stop Conditions

### Risks

- **Unsupported clinical claims:** Treatment pages must stay within public approved facts and clinician-reviewed content. Avoid “guaranteed”, “painless”, “same-day for everyone”, diagnosis, outcome promises, or emergency availability claims not proven in approved sources.
- **YMYL / medical claim risk:** Dental treatment content is health-related. Keep advice general, safety-focused, and assessment-bound.
- **NAP inconsistency:** Current canonical NAP is in `local-identity.smh.json` / `approved-facts.smh.json`. Any visible repetition must match exactly.
- **Schema risk:** Site and treatment schema already exists; adding FAQ/Medical/Review schema without approved flags may create compliance/search risk.
- **Internal-link risk:** Existing CTAs and routing cards are broad; adding keyword-driven links must not create spammy route-to-route loops.
- **Route-sprawl risk:** New routes are unnecessary for first pass. Overlapping 3D/same-day intent routes need canonical decisions instead.
- **Canon risk:** `apps/web/app/layout.tsx` and `apps/web/app/treatments/[slug]/page.tsx` are only patchable under the specific SEO JSON-LD override currently present in AGENTS.md; other protected areas require fresh authority.

### Stop Conditions

Stop a later implementation patch if:

- `npm run guard:hero`, `npm run guard:canon`, or `npm run verify` is missing or fails for new reasons.
- A proposed change touches sacred hero engine/manifests/renderer files without explicit Sacred Hero Surgeon authority.
- A claim cannot be traced to approved repo facts or clinician-approved copy.
- NAP values conflict across approved facts, local identity, visible content, or schema.
- A patch requires route creation or redesign rather than using existing route/template architecture.
- JSON-LD would be emitted from unapproved/unreviewed FAQ/review/medical content.

## 9. Exact Future Files Likely Safe to Patch (With Fresh Implementation Authority)

Safest bounded first-patch candidates:

1. `packages/champagne-manifests/data/seo/local-identity.smh.json` — only if updating structured local identity from approved facts; avoid unsupported NAP edits.
2. `packages/champagne-manifests/data/seo/approved-facts.smh.json` — approved public fact source only.
3. `packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json` — AI answer readiness, only with approved clinical boundaries.
4. `packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json` — structured treatment facts; leave unknowns null.
5. `packages/champagne-manifests/data/seo-ai-answer-foundation/question-inventory.v1.smh.json` — future query/question mapping only.
6. `packages/champagne-manifests/data/sections/smh/treatments.implants.json`.
7. `packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json`.
8. `packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json`.
9. `packages/champagne-manifests/data/sections/smh/treatments.orthodontics.json`.
10. `packages/champagne-manifests/data/sections/smh/treatments.3d-dentistry-and-technology.json` and/or `treatments.3d-digital-dentistry.json` after canonical decision.
11. `packages/champagne-manifests/data/sections/smh/treatments.veneers.json` after same-day route-intent decision.
12. `packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json`.
13. `packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json`.
14. `apps/web/app/layout.tsx` and `apps/web/app/treatments/[slug]/page.tsx` only under the current `DIRECTOR_SCOPE_OVERRIDE: SEO_JSONLD_V1` and only for JSON-LD/metadata work matching its scope.

## 10. Files Explicitly Not To Touch

- Sacred hero engine core:
  - `packages/champagne-hero/src/HeroAssetRegistry.ts`
  - `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
  - `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`
  - `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
  - `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`
- Sacred hero manifests:
  - `packages/champagne-manifests/data/hero/sacred_*`
- Sacred render entry:
  - `apps/web/app/components/hero/HeroRenderer.tsx`
- Theme/layout prohibited without fresh authority:
  - `apps/web/app/globals.css`
  - `apps/web/app/components/layout/Header.tsx`
  - `apps/web/app/components/layout/Footer.tsx`
  - `apps/web/app/components/layout/FooterLuxe.module.css`
- No chatbot/portal/API/PMS/PHI files for this SEO scope:
  - `apps/web/app/api/**`
  - `apps/web/app/components/concierge/**`
  - patient portal and stock/ops apps.

## 11. Validation Plan for Later Approved Implementation Patch

Minimum commands for a later patch:

1. `npm run lint`
2. `npm run build`
3. `npm run guard:hero`
4. `npm run guard:canon`
5. `npm run verify`
6. `npm run seo:schema-qa`
7. `npm run seo:answer-foundation-qa`
8. `npm run seo:answer-packet-qa`
9. `npm run seo:answer-rendering-qa`
10. `git diff --check`

If JSON-LD is changed, inspect rendered payload shape locally and confirm no unsupported FAQ/Review/medical claims are emitted.

## 12. Rollback Notes

- Since the first implementation should be file-bounded, rollback should be a simple revert of changed SEO data/JSON-LD files.
- Avoid migrations, route creation, or broad component rewrites; that keeps rollback to data/schema page-file diffs only.
- If schema QA fails, revert JSON-LD changes first, then data copy changes if they were introduced in the same patch.

## 13. Validation Results From This Inspection

- `npm run lint` — PASS. Next.js reported deprecation/plugin warnings but exited 0.
- `npm run build` — PASS. Build completed; warnings included stale Browserslist data, Tailwind content pattern warning, and Next ESLint plugin warning.
- `git diff --check` — PASS after creating these audit files.

## 14. Forbidden Changes Confirmation

No site/content/source files were modified. No hero, manifest content, layout, component, route, API, chatbot, portal, analytics, deployment, or external integration changes were made.
