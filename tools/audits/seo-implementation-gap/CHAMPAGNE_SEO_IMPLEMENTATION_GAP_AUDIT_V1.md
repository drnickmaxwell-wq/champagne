# Champagne SEO Implementation Gap Audit V1

**Role:** `CHAMPAGNE_WEBSITE_SEO_IMPLEMENTATION_GAP_AUDITOR_V1`  
**Mission type:** audit-only; no runtime implementation.  
**Audited branch:** `work`  
**Audited commit:** `a9f1f71a002f250b3866247b546668a46b0e03c8`  
**Audit date:** 2026-06-02  
**Working tree note:** `pnpm-lock.yaml` was already modified before this audit began. This audit did not modify it.

## Executive verdict

Champagne has a strong manifest-driven foundation for treatment SEO, route truth, sitemap generation, local Shoreham positioning, treatment answer-surface structure, and Champagne guard culture. It is **not yet pre-launch SEO ready** against the Website OS SEO North Star because several launch-critical capabilities are partial or missing:

1. Verified LocalBusiness/Dentist NAP schema is incomplete.
2. Route metadata lacks a complete title-template/icon/OG-image policy.
3. FAQPage/media/price/article schema extraction is not implemented.
4. Priority answer surfaces are not all clinically reviewed and many are seed/framework content.
5. Clinician E-E-A-T lacks verified GDC identifiers and specific reviewer connections.
6. Chatbot facts/FAQ/service sync is not yet governed from approved website facts.
7. Location architecture is Shoreham-safe but lacks a fully verified Shoreham local landing/NAP evidence layer.

## Scope inspected

- `apps/web/app/**` route tree, metadata, JSON-LD, sitemap, robots, public pages, API/chatbot routes, and layout/header/footer.
- `packages/champagne-manifests/**` page/treatment/section manifests, manifest helpers, answer-surface contracts, and page-surface framework.
- `packages/champagne-sections/**` FAQ, answer-surface, routing, media, people, and section renderer behavior.
- `packages/champagne-hero/**` performance-adjacent reduced-motion/runtime evidence only; no sacred files were modified.
- `scripts/**`, `ops/contracts/**`, and `reports/**` SEO/readiness/guard truth artifacts.
- `public/assets/**` static motion/image asset presence.

## Capability status summary

| Status | Count | Meaning |
| --- | ---: | --- |
| PRESENT | 5 | Capability is implemented enough to count as an existing SEO strength. |
| PARTIAL | 14 | Foundation exists but launch-ready requirements are incomplete. |
| MISSING | 2 | No implementation evidence found for the expected capability. |
| UNCLEAR | 0 | Static audit could not classify. |

## Top 10 launch blockers

| Rank | Capability | Severity | Why it matters | Next action |
| ---: | --- | --- | --- | --- |
| 1 | `MANIFEST_LOCATION_METADATA` | BLOCKER | Local pack and GBP readiness require verified NAP, hours, map and place signals. Current local copy is approximate. | Create verified practice identity/NAP manifest and bind it to contact, footer, and schema. |
| 2 | `STRUCTURED_DENTIST_LOCALBUSINESS` | BLOCKER | Dentist/LocalBusiness JSON-LD has only name/url/areaServed and misses address, phone, geo, hours, sameAs, image/logo. | Implement canonical practice identity graph from verified data. |
| 3 | `TECH_METADATA_BASELINE` | HIGH | Global/route metadata exists, but title templates, icons/app icons, and route OG image policy are incomplete. | Add metadata policy and metadata snapshot tests. |
| 4 | `STRUCTURED_SERVICE_BREADCRUMB` | HIGH | Treatments emit WebPage/Service/BreadcrumbList, but Service provider is inline rather than graph-linked to canonical Dentist. | Link services to canonical Dentist `@id` and add safe service-area/audience fields. |
| 5 | `STRUCTURED_FAQ_ARTICLE_VIDEO_IMAGE_OFFER` | HIGH | FAQ UI exists but FAQPage schema does not; article/video/image/offer schemas are absent. | Add governed schema extraction before emission. |
| 6 | `AI_ZERO_CLICK_ANSWER_SURFACES` | HIGH | Answer-surface framework exists, but not all launch-critical treatment pages are complete/clinically reviewed. | Graduate priority treatments from seed to clinically reviewed content. |
| 7 | `DENTAL_EEAT_CLINICIAN_BIOS` | HIGH | Clinician bios exist, but GDC identifiers and explicit reviewer/author connections are missing. | Add verified GDC/profile metadata and reviewer links. |
| 8 | `DENTAL_EEAT_CLAIMS_SAFETY` | HIGH | Safe-content contracts exist, but clinical review status is incomplete and often generic. | Run clinical/legal content review and replace placeholders. |
| 9 | `CONTENT_DEPTH_PRIORITY_PAGES` | HIGH | Priority treatment routes exist but depth/schema/review maturity varies. | QA emergency, implants, Spark/orthodontics, 3D, sedation, fees/finance, hygiene/checkups. |
| 10 | `CHATBOT_ZONE_A_SYNC` | HIGH | Chatbot wiring exists, but approved website facts/FAQ/service sync is not governed. | Build approved facts export and no-diagnosis/no-PHI source contract. |

## Top 10 existing SEO strengths

1. App Router architecture is present and route families are inspectable.
2. Canonical page/treatment manifest registry exists and drives content.
3. Broad treatment coverage exists for the main commercial dental categories.
4. `robots.ts` is production-gated and blocks internal/private routes.
5. `sitemap.ts` is manifest-derived and includes lastmod/changefreq/priority.
6. Treatment pages emit baseline WebPage/Service/BreadcrumbList JSON-LD.
7. Shoreham-by-Sea is consistently treated as the primary locality.
8. Treatment answer-surface contracts include direct answers, risks, alternatives, costs, local context, FAQs, links, review, and CTA sections.
9. Team profile routes emit ProfilePage/Person schema and Dr Nick Maxwell has substantive biography/credential copy.
10. Concierge has page-context proxy and handoff/rate-limit foundations.

## Detailed findings by audit task

### 1. Route architecture

The repo uses the Next.js App Router under `apps/web/app`. Public routes include home, contact, fees, blog hub, team hub/detail, treatments hub/detail, legal pages, and manifest-backed dynamic `/[page]`. Internal/debug routes under `/champagne/*`, API routes, and patient portal are present. Sitemap coverage is manifest-derived, but no live location-page family or article detail route exists.

### 2. Manifest-driven SEO

Manifest foundations are strong: the machine manifest stores pages/treatments/sections/CTAs, helpers expose canonical getters, treatment section stacks live under `data/sections/smh`, and page-surface/answer-surface contracts exist. Gaps remain around location/NAP manifests, schema manifests, editorial manifests, and chatbot-approved facts manifests.

### 3. Technical SEO

Metadata is partially implemented. Root metadata has metadataBase, default title/description, robots gating, OpenGraph, and Twitter. Route pages add canonical/OpenGraph/Twitter metadata. Robots and sitemap are good foundations. Missing or incomplete: title template, route-specific OG images, app icon/favicon metadata evidence, global error handling, explicit redirect inventory, hreflang policy, and metadata tests.

### 4. Structured data

Present: global Dentist/LocalBusiness + WebSite; treatment WebPage/Service/BreadcrumbList; contact ContactPage; team ProfilePage/Person; generic WebPage on hubs/support pages.

Partial/missing: LocalBusiness identity fields, Organization graph, FAQPage, Article/BlogPosting, VideoObject, ImageObject, Offer/PriceSpecification, AggregateRating/review governance, and graph-linked provider/service relationships.

### 5. Local SEO

Shoreham-first copy is clearly present in header, footer, home locality blocks, and answer surfaces. Secondary towns are referenced as support areas without live doorway pages. However, verified NAP, opening hours, address, phone, geo/map identifiers, sameAs, GBP fields, and visible contact details are incomplete. This is the largest local-pack blocker.

### 6. AI / zero-click readiness

The treatment answer-surface framework is a strong start for AI-readable treatment facts. It includes direct answers, risks/limitations, alternatives, process, timeline, aftercare, cost/fee logic, local context, clinician expertise, technology, FAQ, links, review, and CTA. The blocker is maturity: priority pages need clinically reviewed, non-seed content and a reusable machine-readable facts export.

### 7. Dental E-E-A-T

Clinician bio depth is good for Dr Nick Maxwell, and the team route emits Person/ProfilePage. The repo lacks verified GDC references, explicit author/reviewer properties in schema, concrete review-source metadata, and fully reviewed launch-critical clinical content. Wording is generally cautious, but review metadata must become specific and verifiable.

### 8. Content depth

Treatment coverage is broad and includes the primary commercial treatments. Fees/finance/patient support pages exist. The depth gap is not route presence but readiness: some content is seed/framework-only, schemas are not fully extracted, and high-intent clusters need one-intent-per-page/cannibalisation review.

### 9. Internal linking

Header/footer navigation, CTA slots, routing cards, treatment breadcrumbs, and related treatment links exist. Gaps: generalized breadcrumbs for non-treatment pages, crawl QA for related treatment rendering across all priority pages, and a final internal-link graph report against launch routes.

### 10. Performance readiness

Reduced-motion handling exists in hero runtime, and dynamic section registry evidence exists. Risks: raw `<img>` in PeopleGrid, large public motion/video assets, no observed Next Image policy, no Lighthouse/CWV evidence, and no documented video/3D lazy-loading launch checklist.

### 11. Chatbot / Zone A sync readiness

Concierge sends `pageContext.pathname` to `/api/converse` and proxies to an external engine with handoff support and rate limiting. The `@champagne/ai` package is a placeholder. Missing: approved website facts export, FAQ/service facts sync, no-diagnosis contract, no-PHI source rules, and chatbot answer provenance from manifests.

### 12. Launch blockers

See `CHAMPAGNE_SEO_LAUNCH_BLOCKERS_V1.json` for machine-readable blocker details and `CHAMPAGNE_SEO_NEXT_BUILD_RECOMMENDATION_V1.md` for the recommended next mission.
