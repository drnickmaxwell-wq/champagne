# Champagne SEO Prelaunch Reassessment V1

Generated: 2026-06-02T00:00:00.000Z

Repo commit: `cce716135536134b26ea4f5fe44fd40e51e14416`

## Audit Boundary

Audit-only. No fixes, redesign, deployment, PHI/PMS/Dentally changes, or chatbot runtime changes were made by this reassessment.

## Decision

**NEXT_MISSION_REQUIRED**

The repo is substantially stronger than the implementation-gap baseline and is close to final launch hardening, but evidence does not support launch certification or direct final hardening as the only remaining phase because priority visible answer packets remain clinically/governance unapproved for AI, voice, chatbot, and schema flags.

## Single Highest ROI Next Mission

**CLINICAL_AI_ANSWER_APPROVAL_AND_FINAL_QA_HARDENING_V1**

Reason: visible answer rendering is now complete, but the rendered priority answer packets still carry `clinician_review_required: true` and `approved_for_ai`, `approved_for_voice`, `approved_for_chatbot`, and `approved_for_schema` are false. Resolving that one governance layer improves AI overview readiness, zero-click confidence, voice readiness, E-E-A-T, chatbot alignment and schema readiness together.

## Route / Architecture Evidence

- Public manifest routes: 101
- Treatment routes: 78
- SMH section layout files: 89
- Section layouts with FAQ-like sections: 84
- Visible answer rendering coverage: 11/11 (100%)
- Question inventory coverage: 55 mapped questions across 12 target services
- Team registry: 5 members, 5 schema-verified, 5 with GDC numbers

## Capability Reassessment

| Capability | Status | Evidence |
| --- | --- | --- |
| Route architecture | STRONG | 101 public manifest routes, 78 treatment routes, 89 SMH section layout files. |
| Metadata/canonicals/OpenGraph | PARTIAL | Root metadataBase, production-aware robots, OpenGraph and Twitter defaults exist; route metadata supplies canonical/OpenGraph/Twitter fields on treatment/site/team routes. Gaps remain for title templates, route-specific OG image policy, and metadata snapshot QA. |
| Robots and sitemap | STRONG | robots.ts and sitemap.ts exist; guard:seo-launch-safety previously reports robots/sitemap production posture safe and sitemap excludes private paths. |
| Schema graph | STRONG | Schema QA status pass with 5 verified team members and 11 priority services; site graph emits Organization, Dentist/LocalBusiness, Website, WebPage, Person and Service nodes. |
| Local SEO | STRONG | Local identity includes NAP, hours, closed days, primary market Shoreham-by-Sea, support markets ['Brighton', 'Hove', 'Lancing', 'Worthing', 'Steyning'], and 11 local priority services. |
| Team E-E-A-T | STRONG | Team registry has 5 members, 5 schema-verified members and 5 GDC numbers. |
| Treatment E-E-A-T | PARTIAL | Treatment routes and answer-surface contracts exist, but priority packet entries still have clinician_review_required true and approved_for_ai/schema/chatbot/voice false, so final clinical approval evidence is incomplete. |
| AI answer architecture | PARTIAL | AI registry has 18 entries and 12 priority packets; question inventory has 55/55 mapped questions. However all 12 priority packet entries are unapproved for AI/voice/chatbot/schema flags. |
| Visible answer rendering | RESOLVED | Visible answer coverage report shows 11/11 rendered and 100% coverage; zero-click rendering QA status is pass. |
| FAQ coverage | PARTIAL | 84 section layout files include FAQ-like sections, but no route-level FAQPage JSON-LD emitter evidence was found in treatment page code. |
| Internal linking | PARTIAL | Routing cards, CTA relationships, treatment hub groups and layout guards exist; high-risk cannibalisation clusters are still reported by seo-launch-safety for implants/cosmetic/orthodontics/emergency. |
| Content maturity | PARTIAL | Priority service packets and visible answers exist; however answer foundation QA has registry warnings for overlong priority answers and priority packets remain marked for clinical review. |
| Voice search readiness | PARTIAL | Voice search registry has 7 foundation patterns with status foundation_patterns_only; priority packets are not approved_for_voice. |
| Chatbot alignment | PARTIAL | Chatbot alignment registry has 17 mappings and runtimeMutation=False; priority packets are not approved_for_chatbot and runtime was not changed. |
| Lighthouse/accessibility/mobile | PARTIAL | Build and lint/typecheck pass via verify, legal accessibility page exists, hero visual mobile test fixture exists; no current Lighthouse/CWV or axe report evidence was found in committed audit artifacts. |
| Bing/IndexNow | UNRESOLVED | No IndexNow key file, endpoint route or submission script was found; Bing readiness is sitemap/robots dependent only. |

## Readiness Scores

| Area | Score | Explanation |
| --- | ---: | --- |
| Google Organic Readiness | 82 | Route inventory, sitemap, robots, metadata and section architecture are strong; title-template/OG-image hardening and intent-cannibalisation review remain. |
| Google Local Pack Readiness | 86 | NAP, hours, support markets, Dentist/LocalBusiness schema and team registry are present; geo/hasMap/sameAs/GBP identifiers remain absent. |
| Google AI Overview Readiness | 76 | Priority packets and visible answer surfaces exist; priority packets remain clinician_review_required and not approved_for_ai/schema. |
| Google AI Mode Readiness | 74 | Question inventory and answer rendering support conversational extraction; governance approval flags are still false for priority packets. |
| Zero-Click Readiness | 82 | Visible answer rendering QA passes 11/11 with indexable HTML; overlong answer warnings and unapproved AI flags reduce readiness. |
| Voice Search Readiness | 72 | Voice pattern registry exists with 7 foundation patterns; priority packets are not approved_for_voice. |
| Bing Readiness | 70 | Robots and sitemap foundation are present; IndexNow implementation is absent. |
| IndexNow Readiness | 20 | No IndexNow key file, endpoint or submission script was found. |
| Schema Readiness | 84 | Organization/Dentist/LocalBusiness/WebSite/WebPage/Person/Service/Breadcrumb graph exists and schema QA passes; FAQPage and media/offer schemas are absent. |
| E-E-A-T Readiness | 76 | Team registry includes verified members and GDC numbers; visible answer packets still require clinical approval/reviewer linkage. |
| Chatbot Alignment Readiness | 72 | Alignment registry exists and runtimeMutation is false; priority packets are not approved_for_chatbot and runtime sync is not implemented. |
| Launch Readiness | 74 | Core SEO architecture is substantially complete, but clinical/AI approval flags, final Lighthouse/accessibility/mobile QA and IndexNow/metadata hardening remain before launch certification. |

## Launch Blocker Status

| Blocker | Classification | Severity | Evidence |
| --- | --- | --- | --- |
| MANIFEST_LOCATION_METADATA | RESOLVED | none | Verified local identity manifest now includes public brand, legal entity, street address, telephone, email, opening hours and closed days; Dentist/LocalBusiness node binds address, telephone, email and openingHoursSpecification. |
| TECH_METADATA_BASELINE | PARTIAL | final_hardening | metadataBase, production noindex policy, canonical alternates, OpenGraph and Twitter are present. Missing evidence remains for title templates, explicit icon/app-icon metadata and route-specific OG image policy. |
| STRUCTURED_DENTIST_LOCALBUSINESS | PARTIAL | final_hardening | Dentist/LocalBusiness schema now includes NAP, opening hours, areaServed and employee @id references. Missing evidence remains for geo coordinates, sameAs, image/logo, priceRange and hasMap/GBP identifiers. |
| STRUCTURED_SERVICE_BREADCRUMB | RESOLVED | none | Treatment route emits buildTreatmentSchemaGraph with WebPage, Service and BreadcrumbList; Service provider references canonical dentist @id. |
| STRUCTURED_FAQ_ARTICLE_VIDEO_IMAGE_OFFER | PARTIAL | post_launch_or_final_hardening | FAQ UI/data exists across section layouts, but no FAQPage schema emitter exists. Article/Video/Image/Offer schema remains intentionally absent unless governed source data exists. |
| AI_ZERO_CLICK_ANSWER_SURFACES | RESOLVED_FOR_VISIBLE_RENDERING_PARTIAL_FOR_APPROVAL | material_governance_risk | Visible rendering is resolved at 100% for 11 target routes, but priority packets still have approved_for_ai/voice/chatbot/schema false and clinician_review_required true. |
| DENTAL_EEAT_CLINICIAN_BIOS | RESOLVED_CORE_PARTIAL_LINKAGE | final_hardening | Team registry now has 5 GDC numbers and 5 verified schema members. Remaining gap: explicit reviewer linkage from every launch-critical treatment answer to named clinicians. |
| DENTAL_EEAT_CLAIMS_SAFETY | PARTIAL | material_governance_risk | Answer surfaces use cautious clinical-boundary language, but priority packets remain clinician_review_required true and not approved for AI/schema/chatbot/voice. |
| CONTENT_DEPTH_PRIORITY_PAGES | PARTIAL | final_hardening | Priority treatment routes, packets, questions and visible answers exist. Content maturity still has QA warnings for overlong answers and cannibalisation clusters requiring final editorial/intent review. |
| CHATBOT_ZONE_A_SYNC | PARTIAL | post_launch_or_final_hardening | Chatbot alignment registry exists with runtimeMutation=false. Runtime sync was intentionally not changed; priority packets remain not approved_for_chatbot. |
| BING_INDEXNOW | UNRESOLVED | post_launch_optimisation | No IndexNow key file, endpoint route or submission script evidence found. |
| LIGHTHOUSE_ACCESSIBILITY_MOBILE_QA | UNRESOLVED | final_hardening | No committed Lighthouse, Core Web Vitals or axe/accessibility audit output found for the current build. Build/verify evidence exists but not performance/accessibility scoring. |

## Local Dominance Assessment

Primary market **Shoreham-by-Sea** is strong but incomplete: NAP, hours, local schema, priority services and visible answers exist; geo/hasMap/sameAs/GBP identifiers and final clinical approval evidence are not present.

Support markets are entity-covered in `areaServed`, but no dedicated support-market landing route evidence was found for Brighton, Hove, Lancing, Worthing, or Steyning.

## AI Search Readiness

AI search architecture is materially present: answer registry, treatment fact registry, question inventory, chatbot alignment registry, voice pattern registry, priority packets and visible answer rendering all exist. The blocker is governance: priority packet entries are visible but not approved for AI/voice/chatbot/schema output.

## Launch Risk Assessment

Risk level: **MEDIUM**.

The repo is not in a broken SEO state: sitemap/robots/schema/local identity/team registry/answer rendering are present and automated QA exists. The remaining risk is concentrated in governed clinical approval, final technical measurement, and optional search-engine acceleration.

## Validation Run

| Command | Status | Notes |
| --- | --- | --- |
| `pnpm run guard:canon` | pass | Passed; emitted existing Browserslist/Tailwind notices during SSR smoke test. |
| `pnpm run guard:hero` | pass | Hero guard and sacred hero lock passed. |
| `pnpm run seo:schema-qa` | pass | Schema QA status pass; 5 verified team members and 11 priority services. |
| `pnpm run seo:answer-foundation-qa` | pass_with_warnings | Passed with existing registry warnings for overlong priority answers and one veneers fact outside approved priorityServices. |
| `pnpm run seo:answer-packet-qa` | pass | 12 packets / 12 services covered. |
| `pnpm run seo:answer-rendering-qa` | pass | 11/11 visible answer surfaces, 100%. |
| `pnpm run verify` | pass_with_warnings | Passed; includes existing workspace dependency warnings, SEO launch-safety warnings for treatment layout review/cannibalisation clusters, Browserslist/Tailwind notices, and Next lint plugin notice. |
| `git diff --check` | pass | No whitespace errors. |

## Recommendation

**NEXT_MISSION_REQUIRED**

Do not claim launch certification yet. Run the single next mission above, then reassess for final launch hardening.
