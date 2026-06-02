# Champagne SEO Next Build Recommendation V1

## Recommended next mission

**Mission name:** `SEO_LOCAL_IDENTITY_AND_SCHEMA_GRAPH_FOUNDATION_V1`

## Why this mission should be next

The most important pre-launch blocker is not route quantity. The site already has broad treatment coverage and a strong manifest/page-builder foundation. The next build should establish a verified, single-source practice identity and schema graph because this unlocks Google organic, Google Maps/local pack, AI answers, service schema, chatbot facts, and citation consistency.

## Scope

1. Create a verified practice identity source of truth.
   - Practice legal/display name.
   - Full postal address.
   - Telephone.
   - Email/contact policy if approved.
   - Opening hours.
   - Geo coordinates.
   - Google Maps URL/place ID if approved.
   - sameAs profiles.
   - Logo/image references.

2. Bind that identity to SEO outputs.
   - Root Dentist/LocalBusiness JSON-LD.
   - WebSite/Organization-style graph if approved.
   - Contact page visible NAP.
   - Footer NAP summary.
   - Treatment Service provider references using the canonical Dentist `@id`.

3. Add schema graph QA.
   - Assert required Dentist/LocalBusiness fields are present.
   - Assert Service provider references the canonical Dentist node.
   - Assert no unverified AggregateRating/review claims.
   - Assert no private/debug/API routes enter sitemap.

4. Prepare AI/chatbot fact sync.
   - Export approved practice facts from the same identity source.
   - Allow chatbot to cite only approved practice facts for NAP/hours/location answers.

## Explicit non-scope

- Do not create secondary-town doorway pages.
- Do not rewrite treatment copy.
- Do not add reviews/ratings unless verified source and consent are approved.
- Do not touch sacred hero engine/manifests/render entry.
- Do not change visual styling.

## Acceptance criteria

- Verified NAP appears consistently in schema, contact page, and footer.
- Dentist/LocalBusiness JSON-LD includes address, telephone, geo, openingHours, URL, image/logo, areaServed, and stable `@id`.
- Treatment Service JSON-LD references the canonical Dentist `@id`.
- A guard or test fails if required local identity fields are removed.
- Chatbot approved-facts export includes NAP/hours/location fields and excludes PHI.
- `npm run guard:hero`, `npm run guard:canon`, and `npm run verify` remain wired and pass or failures are reported truthfully.

## Follow-on missions

1. `SEO_FAQ_AND_TREATMENT_SCHEMA_EXTRACTION_V1` — emit governed FAQPage and richer treatment facts.
2. `SEO_CLINICAL_REVIEW_AND_GDC_EEAT_V1` — add GDC numbers, reviewer/author fields, and clinical review workflow.
3. `SEO_PRIORITY_CONTENT_MATURITY_V1` — graduate high-intent treatment pages from seed/framework to clinically reviewed launch copy.
4. `SEO_IMAGE_VIDEO_PERFORMANCE_POLICY_V1` — implement image/video optimization and Lighthouse/CWV checks.
5. `SEO_CHATBOT_APPROVED_FACTS_SYNC_V1` — connect chatbot to approved website facts, FAQs, and service facts.
