# Champagne Route Coverage Audit V1

**Site:** smhdental.co.uk → Champagne (Next.js)  
**Generated:** 2026-06-07  
**Auditor role:** CHAMPAGNE_ROUTE_COVERAGE_AUDITOR_V1  
**Status:** ROUTE COVERAGE AUDIT ONLY. NO CHANGES MADE. NOT LAUNCH READY.

---

## SECTION 1 — CHAMPAGNE ROUTE INVENTORY

Routes are sourced from the machine manifest (`champagne_machine_manifest_full.json`), the Next.js app directory (`apps/web/app`), and the navigation manifest. Internal debug routes under `/champagne/` and API routes are listed separately and excluded from SEO/cutover scope.

### 1.1 — Non-treatment page routes (23 public routes)

| Route | Manifest Category | Source |
|---|---|---|
| `/` | hub | `app/page.tsx` — manifest-driven via ChampagnePageBuilder |
| `/about` | hub | `app/(champagne)/about/page.tsx` |
| `/blog` | editorial | `app/blog/page.tsx` — nav status: stub |
| `/contact` | utility | `app/contact/page.tsx` |
| `/downloads` | utility | `app/(site)/[page]/page.tsx` catch-all |
| `/fees` | utility | `app/fees/page.tsx` |
| `/finance` | utility | `app/(site)/[page]/page.tsx` catch-all |
| `/legal/accessibility` | legal | `app/(champagne)/legal/[slug]/page.tsx` |
| `/legal/complaints` | legal | `app/(champagne)/legal/[slug]/page.tsx` |
| `/legal/cookies` | legal | `app/(champagne)/legal/[slug]/page.tsx` |
| `/legal/privacy` | legal | `app/(champagne)/legal/privacy/page.tsx` (also `/legal/[slug]`) |
| `/legal/terms` | legal | `app/(champagne)/legal/[slug]/page.tsx` |
| `/newsletter` | utility | `app/(site)/[page]/page.tsx` catch-all |
| `/patient-portal` | utility | `app/patient-portal/page.tsx` — excluded from sitemap |
| `/practice-plan` | utility | `app/(site)/[page]/page.tsx` catch-all |
| `/smile-gallery` | editorial | `app/(champagne)/smile-gallery/page.tsx` |
| `/team` | hub | `app/team/page.tsx` |
| `/team/nick-maxwell` | profile | `app/team/[slug]/page.tsx` |
| `/team/sara-burden` | profile | `app/team/[slug]/page.tsx` |
| `/team/sylvia-krafft` | profile | `app/team/[slug]/page.tsx` |
| `/technology` | utility | `app/(site)/[page]/page.tsx` catch-all |
| `/treatments` | hub | `app/treatments/page.tsx` — hard-coded index, not manifest sections |
| `/video-consultation` | utility | `app/(site)/[page]/page.tsx` catch-all |

### 1.2 — Internal redirect route (not a content page)

| Route | Type | Target |
|---|---|---|
| `/dental-checkups-oral-cancer-screening` | 301 redirect | `/treatments/dental-checkups-oral-cancer-screening` |

This is handled by `app/dental-checkups-oral-cancer-screening/route.ts` (a Next.js route handler, not middleware).

### 1.3 — Treatment routes under /treatments/ (78 routes)

All served by `app/treatments/[slug]/page.tsx`. Two entries (cosmetic-dentistry, facial-aesthetics) carry manifest category=hub; all others are category=treatment or technology.

**Implants cluster (13 routes):**
`/treatments/implants`, `/treatments/implant-consultation`, `/treatments/implants-single-tooth`, `/treatments/implants-multiple-teeth`, `/treatments/implants-full-arch`, `/treatments/implants-bone-grafting`, `/treatments/implant-retained-dentures`, `/treatments/sinus-lift`, `/treatments/teeth-in-a-day`, `/treatments/sedation-for-implants`, `/treatments/failed-implant-replacement`, `/treatments/implant-aftercare`, `/treatments/surgically-guided-implants`

**Cosmetic / aesthetic cluster (8 routes):**
`/treatments/cosmetic-dentistry` *(hub)*, `/treatments/full-smile-makeover`, `/treatments/veneers`, `/treatments/composite-bonding`, `/treatments/injection-moulded-composite`, `/treatments/3d-printed-veneers`, `/treatments/digital-smile-design`, `/treatments/teeth-whitening`

**Whitening sub-cluster (4 routes):**
`/treatments/home-teeth-whitening`, `/treatments/whitening-top-ups`, `/treatments/whitening-sensitive-teeth`, `/treatments/teeth-whitening-faqs`

**Orthodontics / aligners cluster (5 routes):**
`/treatments/orthodontics`, `/treatments/clear-aligners`, `/treatments/clear-aligners-spark`, `/treatments/fixed-braces`, `/treatments/dental-retainers`

**Emergency cluster (8 routes):**
`/treatments/emergency-dentistry`, `/treatments/emergency-dental-appointments`, `/treatments/severe-toothache-dental-pain`, `/treatments/dental-abscess-infection`, `/treatments/broken-chipped-cracked-teeth`, `/treatments/knocked-out-tooth`, `/treatments/lost-crowns-veneers-fillings`, `/treatments/dental-trauma-accidents`

**General / preventative cluster (7 routes):**
`/treatments/preventative-and-general-dentistry`, `/treatments/preventive-dentistry` *(possible duplicate/alias)*, `/treatments/dental-checkups-oral-cancer-screening`, `/treatments/childrens-dentistry`, `/treatments/periodontal-gum-care`, `/treatments/endodontics-root-canal`, `/treatments/extractions-and-oral-surgery`

**Restorative cluster (9 routes):**
`/treatments/dental-crowns`, `/treatments/dental-bridges`, `/treatments/dental-fillings`, `/treatments/inlays-onlays`, `/treatments/dentures`, `/treatments/acrylic-dentures`, `/treatments/chrome-dentures`, `/treatments/peek-partial-dentures`, `/treatments/tooth-wear-broken-teeth`

**3D / technology cluster (7 routes):**
`/treatments/3d-digital-dentistry`, `/treatments/3d-dentistry-and-technology`, `/treatments/cbct-3d-scanning`, `/treatments/3d-printing-lab`, `/treatments/3d-implant-restorations`, `/treatments/3d-printed-dentures`, `/treatments/3d-implant-restorations`

**TMJ / occlusal cluster (4 routes):**
`/treatments/night-guards-occlusal-splints`, `/treatments/bruxism-and-jaw-clenching`, `/treatments/tmj-jaw-comfort`, `/treatments/tmj-disorder-treatment`

**Sedation / nervous patients cluster (3 routes):**
`/treatments/nervous-patients`, `/treatments/sedation-dentistry`, `/treatments/painless-numbing-the-wand`

**Facial aesthetics cluster (7 routes):**
`/treatments/facial-aesthetics` *(hub)*, `/treatments/facial-therapeutics`, `/treatments/facial-pain-and-headache`, `/treatments/anti-wrinkle-treatments`, `/treatments/dermal-fillers`, `/treatments/skin-boosters`, `/treatments/polynucleotides`, `/treatments/therapeutic-facial-injectables`

**Other treatment routes (3 routes):**
`/treatments/senior-mature-smile-care`, `/treatments/sports-mouthguards`, `/treatments/mouthguards-and-retainers`

### 1.4 — Internal / dev-only routes (excluded from SEO scope)

These routes exist in the app directory but are not registered in the main manifest and should not be indexed:

| Route | Purpose |
|---|---|
| `/champagne/hero-debug` | Hero visual debug tool |
| `/champagne/hero-asset-lab` | Hero asset lab |
| `/champagne/hero-lab` | Hero lab |
| `/champagne/hero-lab/concierge` | Concierge lab |
| `/champagne/hero-preview` | Hero preview |
| `/champagne/sections-debug` | Sections debug tool |

### 1.5 — API routes (not public pages)

`/api/health`, `/api/converse`, `/api/handoff/booking`, `/api/handoff/emergency-callback`, `/api/handoff/new-patient`

---

## SECTION 2 — HUB PAGE INVENTORY

Assessment of whether key hub categories exist as standalone routes in Champagne.

| Hub | Champagne Route | Status | Notes |
|---|---|---|---|
| Cosmetic dentistry | `/treatments/cosmetic-dentistry` | **EXISTS** — manifest category=hub, 10 sections, section layout present | Under /treatments/ prefix. Rendered by treatments/[slug]/page.tsx. Not a top-level /cosmetic-dentistry route. |
| Teeth replacement | — | **MISSING** | No `/teeth-replacement` or `/treatments/teeth-replacement` route exists. No manifest entry. Individual replacement pages (dentures, implants, bridges) exist as separate treatments. |
| Emergency | — | **MISSING HUB** | No `/emergency` hub route. Primary treatment entry is `/treatments/emergency-dentistry`. Emergency cluster has 8 treatment sub-pages. The old WP `/emergency/` hub has no hub-level equivalent. |
| General dentistry | — | **MISSING HUB** | No `/general-dentistry` hub. Closest is `/treatments/preventative-and-general-dentistry` (a treatment page, not a hub). `/treatments/preventive-dentistry` also exists (possible alias — needs verification). |
| Implants | `/treatments/implants` | **EXISTS** — functions as implants hub entry with 13 sub-pages | Category=treatment in manifest but serves as the hub entry point. Full implants cluster (13 sub-pages) is present. |
| Orthodontics | `/treatments/orthodontics` | **EXISTS** — treatment page with aligner/brace cluster of 5 routes | Category=treatment. No separate orthodontics hub; the orthodontics page is the entry point. |
| Reviews | — | **MISSING** | No `/reviews` route exists in Champagne. See Section 7 for homepage reviews section assessment. |
| Fees | `/fees` | **EXISTS** | Standalone route, manifest category=utility. |
| Team | `/team` | **EXISTS** | Hub page with 3 team member profile routes (/team/nick-maxwell, /team/sara-burden, /team/sylvia-krafft). |
| Contact | `/contact` | **EXISTS** | Standalone route. |

---

## SECTION 3 — SECTION / ANCHOR INVENTORY

Homepage sections from the machine manifest. Section ids use the pattern `home_*`. There is no `#reviews` anchor on the homepage — see Section 7.

| Topic | Homepage Section ID | Component Type | Stable Anchor | Notes |
|---|---|---|---|---|
| Reviews / testimonials | `home_patient_stories` | patient_stories_rail | `#home_patient_stories` (not `#reviews`) | Placeholder content — "Case A", "Case B", "Case C". Not live patient reviews. |
| Google Reviews | `home_google_reviews` | google_reviews | `#home_google_reviews` (not `#reviews`) | **STATIC / PLACEHOLDER** — see Section 7. |
| Smile gallery | None on homepage | — | None | Standalone `/smile-gallery` route exists. No homepage gallery section. |
| Technology | `home_technology_showcase` | media | `#home_technology_showcase` | Also `/technology` standalone page. |
| Finance | `home_finance_options` | feature-list | `#home_finance_options` | Also `/finance` standalone page. |
| Anxiety / sedation | None as standalone section | — | None | `/treatments/nervous-patients` and `/treatments/sedation-dentistry` pages exist. Referenced via `home_treatment_routing` routing cards only. |
| Emergency | `home_special_pathways` | routing_cards | `#home_special_pathways` | Links to `/treatments/emergency-dentistry`. Not a full emergency section — just routing cards. |
| Implants | `home_treatment_routing` | routing_cards | `#home_treatment_routing` | Links to `/treatments/implants`. Shared section with other treatments. |
| Cosmetic dentistry | `home_treatment_routing` | routing_cards | `#home_treatment_routing` (shared) | Links to `/treatments/full-smile-makeover`. `/treatments/cosmetic-dentistry` hub exists. |
| Orthodontics | `home_treatment_routing` | routing_cards | `#home_treatment_routing` (shared) | Links to `/treatments/orthodontics`. |

**Anchor note:** Section ids in Champagne do not use short keyword-only names (e.g., `#reviews`, `#emergency`). All homepage section ids follow the `home_*` pattern. A redirect to `/#reviews` would not land on any anchor element.

---

## SECTION 4 — WORDPRESS URL COVERAGE

Classification key:
- **EXACT_ROUTE_MATCH** — same path in Champagne
- **RENAMED_ROUTE_MATCH** — different slug/path but same or closely equivalent content
- **SECTION_ONLY_MATCH** — no standalone route; content covered by a homepage or page section
- **MISSING_HUB** — was a hub in WP; Champagne has sub-pages but no hub-level page
- **MISSING_PAGE** — no equivalent route or section in Champagne
- **LEGACY_OR_404** — was already 404 or a builder artifact in WP
- **NEEDS_HUMAN_DECISION** — route exists in Champagne but mapping is ambiguous

| WP URL | Classification | Champagne Target | Notes |
|---|---|---|---|
| `/` | EXACT_ROUTE_MATCH | `/` | Same domain. No redirect needed. |
| `/emergency/` | MISSING_HUB | `/treatments/emergency-dentistry` (proposed) | WP had a hub; Champagne has 8 emergency treatment sub-pages. No top-level emergency hub. |
| `/implants/` | RENAMED_ROUTE_MATCH | `/treatments/implants` | Path changed. Content equivalent — implants hub functions. |
| `/general-dentistry/` | MISSING_HUB | `/treatments/preventative-and-general-dentistry` (proposed) | WP had a hub; Champagne has treatment pages but no general-dentistry hub. |
| `/teeth-replacement/` | MISSING_HUB | `/treatments` (proposed fallback) | No teeth-replacement hub or route in Champagne. Dentures, implants, bridges exist separately. |
| `/cosmetic-dentistry/` | RENAMED_ROUTE_MATCH | `/treatments/cosmetic-dentistry` | Champagne has a populated cosmetic-dentistry hub (category=hub, 10 sections). Path is under /treatments/. |
| `/about-us/` | RENAMED_ROUTE_MATCH | `/about` | Slug change only. Content equivalent. |
| `/team/` | RENAMED_ROUTE_MATCH | `/team` | Trailing slash difference only. |
| `/contact-us/` | RENAMED_ROUTE_MATCH | `/contact` | Slug change only. |
| `/fees/` | EXACT_ROUTE_MATCH | `/fees` | |
| `/reviews/` | MISSING_PAGE | None | No `/reviews` route in Champagne. Homepage google_reviews section is placeholder. See Section 7. |
| `/offer/` | MISSING_PAGE | None | No `/offer` or `/offers` page in Champagne. |
| `/examination/` | RENAMED_ROUTE_MATCH | `/treatments/dental-checkups-oral-cancer-screening` | Also handled by an internal redirect from `/dental-checkups-oral-cancer-screening`. |
| `/emergency-dentist/` | RENAMED_ROUTE_MATCH | `/treatments/emergency-dentistry` | Near-exact match. |
| `/dental-extraction/` | RENAMED_ROUTE_MATCH | `/treatments/extractions-and-oral-surgery` | Near-exact match. |
| `/root-canal-treatment/` | RENAMED_ROUTE_MATCH | `/treatments/endodontics-root-canal` | Near-exact match. |
| `/dental-implant/` | NEEDS_HUMAN_DECISION | `/treatments/implants` or `/treatments/implants-single-tooth` | Ambiguous WP slug — could be generic hub or single-tooth specific. See NR-07 in review pack. |
| `/single-tooth-implant/` | RENAMED_ROUTE_MATCH | `/treatments/implants-single-tooth` | Near-exact match. |
| `/replacing-multiple-teeth/` | RENAMED_ROUTE_MATCH | `/treatments/implants-multiple-teeth` | Near-exact match. |
| `/implant-over-denture/` | RENAMED_ROUTE_MATCH | `/treatments/implant-retained-dentures` | Near-exact match. |
| `/dental-implants-teeth-in-a-day/` | RENAMED_ROUTE_MATCH | `/treatments/teeth-in-a-day` | Near-exact match. |
| `/dental-hygienist/` | NEEDS_HUMAN_DECISION | `/treatments/periodontal-gum-care` or `/treatments/preventative-and-general-dentistry` | No dedicated hygienist page. Periodontal care is gum disease treatment; preventative is a better clinical fit for routine hygiene. Review pack recommends Option B. |
| `/fissure-sealants/` | RENAMED_ROUTE_MATCH | `/treatments/preventative-and-general-dentistry` | No dedicated page. Fissure sealants sit within preventative care scope. |
| `/dental-veneers/` | RENAMED_ROUTE_MATCH | `/treatments/veneers` | Near-exact match. |
| `/composite-restoration/` | RENAMED_ROUTE_MATCH | `/treatments/composite-bonding` | Near-exact match. |
| `/teeth-whitening/` | EXACT_ROUTE_MATCH | `/treatments/teeth-whitening` | |
| `/cfast/` | NEEDS_HUMAN_DECISION | `/treatments/fixed-braces` or 410 Gone | Cfast is a branded brace system. Brand status not confirmed. See NR-10 in review pack. |
| `/smiletru/` | NEEDS_HUMAN_DECISION | `/treatments/clear-aligners` or 410 Gone | SmileTru is a branded aligner. Brand status not confirmed. See NR-11 in review pack. |
| `/inman-aligner/` | NEEDS_HUMAN_DECISION | `/treatments/orthodontics` or `/treatments/clear-aligners` or 410 Gone | Inman Aligner brand. Status not confirmed. See NR-12 in review pack. |
| `/iv-sedation/` | RENAMED_ROUTE_MATCH | `/treatments/sedation-dentistry` | Near-exact match. |
| `/dental-crown/` | RENAMED_ROUTE_MATCH | `/treatments/dental-crowns` | Singular → plural slug. |
| `/dental-bridges/` | EXACT_ROUTE_MATCH | `/treatments/dental-bridges` | |
| `/dentures/` | EXACT_ROUTE_MATCH | `/treatments/dentures` | |
| `/crowns/` | RENAMED_ROUTE_MATCH | `/treatments/dental-crowns` | Duplicate WP slug for same Champagne target as `/dental-crown/`. |
| `/fillings/` | RENAMED_ROUTE_MATCH | `/treatments/dental-fillings` | |
| `/inlays/` | RENAMED_ROUTE_MATCH | `/treatments/inlays-onlays` | |
| `/general-dentistry-west-sussex/` | RENAMED_ROUTE_MATCH | `/treatments/preventative-and-general-dentistry` | Geo-variant slug; maps to primary treatment page. |
| `/confidentiality-policy/` | NEEDS_HUMAN_DECISION | `/legal/privacy` (recommended) | In dental/healthcare context, confidentiality = data protection. `/legal/terms` mapping in redirect-map is likely wrong. See NR-13 in review pack. |
| `/privacy-policy/` | RENAMED_ROUTE_MATCH | `/legal/privacy` | Near-exact match. |
| `/cookie-policy/` | RENAMED_ROUTE_MATCH | `/legal/cookies` | Near-exact match. |
| `/invisalign-teeth-straightening/` (was 404 in WP) | LEGACY_OR_404 | Check GSC; likely 410 Gone | Was already 404 in WP. Champagne has `/treatments/clear-aligners` as a target if backlinks exist. See HR-01 in review pack. |
| `/elementskit-content/dynamic-content-megamenu-menuitem1768/` | LEGACY_OR_404 | 410 Gone (strongly recommended) | Builder artifact URL. Not a real page. Should return 410, not 301. See HR-02 in review pack. |

**Coverage summary:**
- EXACT_ROUTE_MATCH: 5
- RENAMED_ROUTE_MATCH: 24
- MISSING_HUB: 3 (`/emergency/`, `/general-dentistry/`, `/teeth-replacement/`)
- MISSING_PAGE: 2 (`/reviews/`, `/offer/`)
- NEEDS_HUMAN_DECISION: 6 (NR-07, NR-08, NR-10, NR-11, NR-12, NR-13)
- LEGACY_OR_404: 2 (HR-01, HR-02)
- Total mapped: 42 WP URLs

---

## SECTION 5 — MISSING PAGE CANDIDATES

Pages that probably need to be created or resolved before launch, in priority order.

### 5.1 — CRITICAL: `/reviews` (no equivalent exists)

No dedicated reviews page exists in Champagne. The homepage has a `home_google_reviews` section but it contains static placeholder content, not live reviews (see Section 7). The WP `/reviews/` page was a trust asset with potential backlinks and direct search traffic. Without a standalone reviews page or a live reviews anchor, the `/reviews/` redirect has no clean target.

**Decision required:** Create a `/reviews` page (Trustpilot embed, Google reviews widget, or curated testimonials) OR accept `/smile-gallery` as a temporary fallback and plan the page post-launch.

### 5.2 — HIGH: Teeth replacement hub (no equivalent)

No `/treatments/teeth-replacement` or `/teeth-replacement` hub route exists. The WP `/teeth-replacement/` covered dentures, implants, and bridges as a broad category. Champagne only has individual treatment pages. This is a commercially significant category (high patient intent, multiple pathways).

**Decision required:** Create a `/treatments/teeth-replacement` hub page grouping the replacement sub-pages, OR accept redirect to `/treatments` as the fallback with understood SEO risk.

### 5.3 — MEDIUM: Emergency hub (no standalone hub)

No standalone `/emergency` hub. Champagne has 8 emergency treatment sub-pages. A hub page grouping these (`emergency-dentistry`, `emergency-dental-appointments`, `severe-toothache-dental-pain`, etc.) would better serve the WP `/emergency/` redirect and emergency organic traffic.

**Decision required:** Create an emergency hub page, OR accept redirect directly to `/treatments/emergency-dentistry`.

### 5.4 — MEDIUM: General dentistry hub (no standalone hub)

The WP `/general-dentistry/` was a broad hub. Champagne's `/treatments/preventative-and-general-dentistry` is a treatment page, not a hub. If general dentistry is a priority category for the practice, a hub grouping preventative, check-ups, children's, periodontal, and endodontics sub-pages would be stronger.

**Decision required:** Accept `/treatments/preventative-and-general-dentistry` as the redirect target, OR create a general dentistry hub.

### 5.5 — LOW-MEDIUM: Offer page

No `/offer` or `/offers` page. If the WP offer page featured a currently running promotion, content needs a home. If the promotion is expired, `/treatments` as a fallback is acceptable.

**Decision required (Nicko):** Is any promotional content being brought to Champagne?

### 5.6 — LOW: Confidentiality policy clarification

The WP `/confidentiality-policy/` should map to `/legal/privacy` (data protection) not `/legal/terms`. Current redirect-map has this as `/legal/terms`. This is both an SEO and a compliance issue — a patient or regulator following a confidentiality link should land on privacy/GDPR content.

**Action:** Correct redirect-map target from `/legal/terms` to `/legal/privacy`.

### 5.7 — LOW: Old orthodontic brand pages (Cfast, SmileTru, Inman Aligner)

Three WP pages exist for branded orthodontic systems. Status of each brand at the practice is unknown. If discontinued, 410 Gone is the correct response. If active, the mapped Champagne treatment pages are appropriate targets.

**Decision required (Nicko):** Confirm current status of Cfast, SmileTru, and Inman Aligner at the practice.

### 5.8 — NOTE: Duplicate/alias routes

`/treatments/preventive-dentistry` and `/treatments/preventative-and-general-dentistry` both exist in the manifest. These may be a legacy alias. If `/treatments/preventive-dentistry` has a separate manifest entry and section layout, it renders as a separate page. If it is an empty stub, it may surface as a thin or duplicate content issue.

**Recommend verification:** Check whether `/treatments/preventive-dentistry` has distinct content or should be canonicalized to `/treatments/preventative-and-general-dentistry`.

---

## SECTION 6 — REDIRECT DECISION SUPPORT

For each NEEDS_REVIEW (NR) and HUMAN_REVIEW_REQUIRED (HR) item in `redirect-human-review-pack.md`:

| ID | WP Path | Current Proposed Target | Route Coverage Finding | Recommendation |
|---|---|---|---|---|
| NR-01 | `/emergency/` | `/treatments/emergency-dentistry` | No emergency hub exists; primary emergency treatment page exists | **Keep current proposed target.** Cleaner than `/treatments`. Flag as temporary pending emergency hub creation (Section 5.3). |
| NR-02 | `/general-dentistry/` | `/treatments/preventative-and-general-dentistry` | No general dentistry hub; treatment page exists and is populated | **Keep current proposed target.** Review pack Option A is correct if no hub is planned. |
| NR-03 | `/teeth-replacement/` | `/treatments/dentures` | No teeth replacement hub; dentures, implants, bridges are separate | **Change target to `/treatments`.** Dentures alone is too narrow for a broad replacement hub. Review pack Option B is the safer default. Flag for teeth replacement hub creation (Section 5.2). |
| NR-04 | `/cosmetic-dentistry/` | `/treatments/full-smile-makeover` | `/treatments/cosmetic-dentistry` EXISTS as a populated hub (10 sections, category=hub) | **Change target to `/treatments/cosmetic-dentistry`.** A dedicated cosmetic hub exists — no need to fall back to full-smile-makeover or `/treatments`. This is the correct long-term target. |
| NR-05 | `/reviews/` | `/smile-gallery` | No `/reviews` route; homepage reviews section is PLACEHOLDER — see Section 7 | **Create missing page first** (Section 5.1). If not feasible before launch, `/smile-gallery` as a temporary measure is acceptable, but `/#reviews` anchor must NOT be used — no stable `#reviews` anchor exists. |
| NR-06 | `/offer/` | `/treatments` | No offer page exists | **Keep current proposed target** (`/treatments`). Confirm with Nicko whether promotional content is coming (Section 5.5). |
| NR-07 | `/dental-implant/` | `/treatments/implants-single-tooth` | Both `/treatments/implants` and `/treatments/implants-single-tooth` exist | **Change target to `/treatments/implants`.** The generic slug "dental-implant" is more likely to have been a broad hub. Single-tooth is too narrow for a generically named URL. Review pack Option B. |
| NR-08 | `/dental-hygienist/` | `/treatments/periodontal-gum-care` | No hygienist page; periodontal gum care is gum disease, not routine hygiene | **Change target to `/treatments/preventative-and-general-dentistry`.** Routine hygienist appointments are preventative care, not gum disease treatment. Review pack Option B is the better clinical match. |
| NR-09 | `/fissure-sealants/` | `/treatments/preventative-and-general-dentistry` | No dedicated page; preventative care is the correct scope | **Keep current proposed target.** Review pack Option A is correct. |
| NR-10 | `/cfast/` | `/treatments/fixed-braces` | `/treatments/fixed-braces` exists and is populated | **Needs Nicko decision** on brand status. If Cfast is still offered: keep `/treatments/fixed-braces`. If discontinued: 410 Gone. |
| NR-11 | `/smiletru/` | `/treatments/clear-aligners` | `/treatments/clear-aligners` exists and is populated | **Needs Nicko decision** on brand status. If SmileTru is still offered: keep `/treatments/clear-aligners`. If discontinued: 410 Gone. |
| NR-12 | `/inman-aligner/` | `/treatments/orthodontics` | Both `/treatments/orthodontics` and `/treatments/clear-aligners` exist | **Needs Nicko decision** on brand status. If discontinued: 410 Gone. If active: use `/treatments/clear-aligners` (better match for an aligner system than a broad orthodontics page). |
| NR-13 | `/confidentiality-policy/` | `/legal/terms` (current) | `/legal/privacy` exists and covers data protection | **Change target to `/legal/privacy`.** A confidentiality policy in a dental/healthcare context is a GDPR/data-handling document. Routing it to `/legal/terms` is a compliance mismatch. Review pack Option A is correct. |
| HR-01 | `/invisalign-teeth-straightening/` | `/treatments/clear-aligners` | Was already 404 in WP; Champagne has clear-aligners page | **Check GSC/Ahrefs first.** If traffic or backlinks exist: 301 to `/treatments/clear-aligners`. If no evidence: 410 Gone. |
| HR-02 | `/elementskit-content/…/` | `/` (proposed) | Legacy builder artifact — not real content | **410 Gone** (strongly recommended). Do not redirect a builder artifact to the homepage. 410 tells Google to stop crawling it. |

---

## SECTION 7 — REVIEW SECTION FINDING

**Question:** Does the Champagne homepage have a reviews/testimonials section, is it live, and can `/reviews/` redirect to `/#reviews`?

### Finding

| Item | Status |
|---|---|
| Homepage has a reviews section | **YES** — section id: `home_google_reviews`, type: `google_reviews` |
| Section is live Google Reviews | **NO** |
| Section is placeholder/static content | **YES** |
| Stable `#reviews` anchor exists | **NO** |

### Detail

The homepage manifest contains a section with:
- `id`: `home_google_reviews`
- `type`: `google_reviews`
- `strapline`: "Live Google reviews shown as they appear on Google — open, current, and unfiltered."
- `rating`: 4.9 (hardcoded in manifest JSON)
- `reviewCount`: "120+ Google reviews" (hardcoded string)
- Review quotes attributed to `"Google reviewer"` (not real reviewer names)
- Patient story cases named `"Case A"`, `"Case B"`, `"Case C"` (clearly placeholder)

**This section is static placeholder content defined in the manifest JSON.** There is no Google Reviews API integration, no Trustpilot widget, and no live review feed. The quotes and rating are hardcoded in the manifest. The strapline claiming "Live Google reviews" is aspirational copy, not a description of current functionality.

### Anchor status

The section uses id `home_google_reviews`, not `reviews`. The homepage does NOT have a `#reviews` anchor. The redirect option "B" in NR-05 (`/#reviews`) **must not be used** — there is no anchor for it to land on.

### Recommendation for `/reviews/` redirect

1. **Preferred (pre-launch):** Create a standalone `/reviews` page with a live Trustpilot widget, Google reviews embed, or curated patient testimonials. Then redirect `/reviews/` → `/reviews` (301).
2. **Fallback (if page cannot be ready at launch):** Redirect `/reviews/` → `/smile-gallery` (301) as a temporary social-proof equivalent. Document the intention to update once `/reviews` exists.
3. **Do not use:** `/` or `/#reviews` — neither provides relevant reviews content to a user clicking a reviews link.

### Review/trust integration gap

The placeholder google_reviews section represents an unresolved integration requirement. Before launch, a decision is needed on:
- Which review platform(s) will be displayed (Google Business Profile API, Trustpilot, manual curation)
- Whether the `home_google_reviews` section will be updated to a live widget or remain as curated static content
- Whether a dedicated `/reviews` page will be created (recommended)

This is noted as a **review/trust integration gap** for the launch readiness checklist.

---

## SECTION 8 — FINAL SUMMARY

### Route coverage status

The Champagne site is manifest-driven and has comprehensive treatment-level coverage with **78 treatment routes** covering implants, cosmetic, emergency, orthodontics, restorative, general, facial aesthetics, 3D/digital, and ancillary treatments. Non-treatment pages are well-covered: team, fees, contact, about, smile-gallery, legal, finance, technology, video-consultation, and patient-portal all have routes.

### Missing launch-relevant pages

| Priority | Missing Page | Impact |
|---|---|---|
| CRITICAL | `/reviews` | High-trust, high-conversion asset. No live reviews anywhere. Placeholder only. |
| HIGH | Teeth replacement hub | High-intent commercial category; 3 individual pages exist but no hub |
| MEDIUM | Emergency hub | Nice-to-have — 8 emergency sub-pages exist as alternatives |
| MEDIUM | General dentistry hub | Nice-to-have — treatment page exists as fallback |
| LOW | Offer page | Depends on whether promotional content is being migrated |

### Whether redirect decisions can proceed

**Partial.** The following redirect groups are unblocked:

- All DRAFT rows (23 rows) — no ambiguity, targets confirmed to exist.
- NR-01 (emergency), NR-02 (general-dentistry), NR-06 (offer), NR-09 (fissure-sealants) — targets confirmed, current proposed targets or small corrections apply.
- **NR-04 (cosmetic-dentistry)** — redirect target should be **changed** from `/treatments/full-smile-makeover` to `/treatments/cosmetic-dentistry`. The hub exists and is populated. This correction can proceed without Nicko input.
- **NR-07 (dental-implant)** — redirect target should be changed from `/treatments/implants-single-tooth` to `/treatments/implants`. Safer mapping.
- **NR-08 (dental-hygienist)** — redirect target should be changed from `/treatments/periodontal-gum-care` to `/treatments/preventative-and-general-dentistry`.
- **NR-13 (confidentiality-policy)** — redirect target should be changed from `/legal/terms` to `/legal/privacy`. This is both a correctness fix and a compliance issue.
- **HR-02 (elementskit builder URL)** — 410 Gone, does not require Nicko input.

Blocked pending Nicko input:
- NR-05 (`/reviews/`) — requires decision on whether to create `/reviews` page or accept `/smile-gallery` fallback.
- NR-10, NR-11, NR-12 (Cfast, SmileTru, Inman Aligner) — requires brand status confirmation.
- NR-03 (`/teeth-replacement/`) — recommended to change target to `/treatments`; Nicko should confirm no teeth-replacement hub is planned before launch.
- HR-01 (invisalign-teeth-straightening) — requires GSC check.

### Final status

> **ROUTE COVERAGE AUDIT ONLY. NO CHANGES MADE. NOT LAUNCH READY.**

The Champagne treatment library is comprehensive and all DRAFT redirect targets have been confirmed as valid routes. Four redirect targets require correction (NR-04, NR-07, NR-08, NR-13) before the redirect map can be finalised. Five decisions remain Nicko-gated (NR-05, NR-10, NR-11, NR-12, NR-03). The review/trust integration gap is the most significant pre-launch content issue — no live review data is currently displayed anywhere on the site.
