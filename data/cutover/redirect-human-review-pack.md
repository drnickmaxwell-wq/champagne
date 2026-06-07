# Redirect Human Review Pack
**Site:** smhdental.co.uk → Champagne (Next.js)
**Generated:** 2026-06-07
**Status:** HUMAN REVIEW PACK ONLY. NO REDIRECTS APPROVED. NOT LAUNCH READY.
**Input file:** `data/cutover/redirect-map.csv`

---

## How to use this document

- Read each entry, choose an option, tick the approval checkbox.
- Return this document to the dev team. They will update `redirect-map.csv` and implement only ticked rows.
- Rows with no tick will remain unimplemented at launch.
- **"Recommended default" labels are suggestions only — not pre-approved.**

---

## Coverage record (no action required)

| WordPress URL | Next.js route | Note |
|---|---|---|
| `https://www.smhdental.co.uk/` | `/` | Same domain, same path. No redirect will be created. Included in the CSV for audit coverage only. |

---

## Section 1 — NEEDS_REVIEW

These rows have a plausible mapping but carry enough ambiguity that a human must choose before any redirect goes live.

---

### NR-01 — /emergency/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/emergency/` |
| **Proposed target** | `/treatments/emergency-dentistry` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** The WP `/emergency/` page was a hub that may have linked to multiple emergency services. Mapping the whole hub to a single treatment page is usually right, but should be confirmed by someone who knows what that page contained.

**SEO / business risk:** Medium. If `/emergency/` held unique content and had backlinks, those links now point to one treatment page. If the hub content is fully covered by the Champagne emergency treatment page, risk is low.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/emergency-dentistry` | The WP emergency page was primarily about emergency appointments — this is the best match |
| B | `/treatments` | The WP page was a broad services hub with no single best Champagne match |

**Recommended default (NOT APPROVED):** Option A — `/treatments/emergency-dentistry`

> **Nicko approval:**
> - [ ] Option A — `/treatments/emergency-dentistry`
> - [ ] Option B — `/treatments`
> - [ ] Other: _______________

---

### NR-02 — /general-dentistry/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/general-dentistry/` |
| **Proposed target** | `/treatments/preventative-and-general-dentistry` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** The WP hub slug "general-dentistry" is broad. Champagne's closest match is "preventative-and-general-dentistry" but verify the slug is the correct parent for this content.

**SEO / business risk:** Low–medium. General dentistry is a high-volume local search category. If the Champagne slug fully replaces this content, the redirect is clean. If a general dentistry hub page is planned separately, hold this until it exists.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/preventative-and-general-dentistry` | Champagne's general dentistry treatment page covers the same content |
| B | `/treatments` | No single Champagne page covers the WP hub; send to the treatments index instead |

**Recommended default (NOT APPROVED):** Option A — `/treatments/preventative-and-general-dentistry`

> **Nicko approval:**
> - [ ] Option A — `/treatments/preventative-and-general-dentistry`
> - [ ] Option B — `/treatments`
> - [ ] Other: _______________

---

### NR-03 — /teeth-replacement/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/teeth-replacement/` |
| **Proposed target** | `/treatments/dentures` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** The WP "teeth replacement" hub covered multiple options — dentures, implants, bridges. Sending it to dentures alone is narrower than the original page intent.

**SEO / business risk:** Medium. "Teeth replacement" is a broad, high-intent search term. If a user searched for implants and lands on a dentures page, that is a poor experience. The treatments hub `/treatments` is a safer fallback if no single best match exists. If a "tooth replacement options" overview page is planned in Champagne, hold this redirect until it exists.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/dentures` | Dentures were the primary content of the WP page |
| B | `/treatments` | The WP page covered multiple replacement types; the hub is a safer landing |
| C | `/treatments/implants-multiple-teeth` | The WP page was primarily implant-led content |

**Recommended default (NOT APPROVED):** Option B — `/treatments` (safer given the hub's broad scope)

> **Nicko approval:**
> - [ ] Option A — `/treatments/dentures`
> - [ ] Option B — `/treatments`
> - [ ] Option C — `/treatments/implants-multiple-teeth`
> - [ ] Other: _______________

---

### NR-04 — /cosmetic-dentistry/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/cosmetic-dentistry/` |
| **Proposed target** | `/treatments/full-smile-makeover` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** "Cosmetic dentistry" is likely one of the most-linked hub pages on the WP site. It covered veneers, whitening, bonding, and more. Mapping it to a single treatment page loses that breadth.

**SEO / business risk:** High. This hub likely held significant link equity and indexed rankings for broad cosmetic terms. If Champagne is planning a dedicated cosmetic dentistry hub page, this redirect should be held until that page exists. Sending a high-equity hub to a single treatment page passes link value narrowly and may lose rankings for cosmetic search terms not covered by full-smile-makeover alone.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/full-smile-makeover` | Full smile makeover is the closest single cosmetic treatment umbrella |
| B | `/treatments/veneers` | Veneers were the primary cosmetic service featured on the WP hub |
| C | `/treatments` | No single Champagne page covers the WP cosmetic hub; send to treatments index |
| D | Hold — create a `/treatments/cosmetic-dentistry` hub page first | A dedicated cosmetic hub is planned and should exist before this redirect is set |

**Recommended default (NOT APPROVED):** Option C — `/treatments` (until a cosmetic hub page exists in Champagne)

> **Nicko approval:**
> - [ ] Option A — `/treatments/full-smile-makeover`
> - [ ] Option B — `/treatments/veneers`
> - [ ] Option C — `/treatments`
> - [ ] Option D — Hold; create cosmetic hub page first
> - [ ] Other: _______________

---

### NR-05 — /reviews/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/reviews/` |
| **Proposed target** | `/smile-gallery` (proposed) |
| **Proposed type** | 301 Permanent |

**Why this needs review:** No `/reviews` route exists in Champagne. A reviews page is a high-trust, high-conversion asset — users and Google both value it. The proposed fallback `/smile-gallery` is the nearest social-proof page but serves a different purpose (before/after images vs. patient reviews).

**Note on `/#reviews` anchor:** A redirect to `/#reviews` on the homepage is only appropriate if the homepage contains a stable, persistent `#reviews` anchor element (e.g., a Trustpilot or Google reviews widget with `id="reviews"`). If no such anchor exists, this option must not be used.

**SEO / business risk:** High. Review pages attract direct search traffic ("smhdental reviews"), link clicks from Google Business Profile, and social sharing. Redirecting to smile-gallery may confuse users expecting written reviews, increasing bounce rate. A dedicated `/reviews` page in Champagne is the cleanest long-term solution.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/smile-gallery` | No reviews page is planned; smile-gallery is the best available social-proof equivalent |
| B | `/#reviews` | **Only if** the Champagne homepage has a stable `#reviews` anchor (e.g. Trustpilot widget). Confirm before selecting. |
| C | Hold — create a dedicated `/reviews` page in Champagne | A reviews page is planned (Trustpilot embed, Google reviews, or testimonials) |
| D | Leave as NEEDS_REVIEW and exclude from launch | No acceptable target exists; launch without this redirect |

**Recommended default (NOT APPROVED):** Option C — create a dedicated `/reviews` page. If not feasible before launch, Option A as a temporary measure with a plan to update once `/reviews` exists.

> **Nicko approval:**
> - [ ] Option A — `/smile-gallery`
> - [ ] Option B — `/#reviews` *(confirm homepage anchor exists before ticking)*
> - [ ] Option C — Hold; create `/reviews` page first
> - [ ] Option D — Exclude from launch
> - [ ] Other: _______________

---

### NR-06 — /offer/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/offer/` |
| **Proposed target** | `/treatments` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** No `/offer` or `/offers` page exists in Champagne. If the WP offer page featured a specific promotion that is no longer running, the content is dead and the redirect destination does not matter much. If offers/promotions content is being brought across, a dedicated page would preserve its value.

**SEO / business risk:** Low–medium. Offer/promotions pages tend to attract price-sensitive searchers. If there is no equivalent content in Champagne, `/treatments` is a reasonable fallback. If specific promotional content is planned, hold until the page exists.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments` | No offers page is planned; treatments hub is the most useful fallback |
| B | `/` | The offer was a one-off promotion; send to home |
| C | Hold — create a dedicated `/offers` or `/promotions` page | Offers/promotions content is coming to Champagne |

**Recommended default (NOT APPROVED):** Option A — `/treatments`

> **Nicko approval:**
> - [ ] Option A — `/treatments`
> - [ ] Option B — `/`
> - [ ] Option C — Hold; create offers page first
> - [ ] Other: _______________

---

### NR-07 — /dental-implant/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/dental-implant/` |
| **Proposed target** | `/treatments/implants-single-tooth` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** The WP slug "dental-implant" (singular) is ambiguous. It may have been a generic implants hub, or a single-tooth specific page. Mapping it to single-tooth implants is narrower than the hub `/treatments/implants`.

**SEO / business risk:** Medium. "Dental implant" is a high-volume search term. If the WP page served general implant queries, sending those users to single-tooth implants may underserve patients seeking full-arch or multiple-tooth options. Note: WP also had `/implants/` (already mapped to `/treatments/implants`) — verify these two WP pages were distinct and not duplicates.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/implants-single-tooth` | The WP page was specifically about single-tooth implants |
| B | `/treatments/implants` | The WP page was a general implants hub; `/implants/` and `/dental-implant/` were separate pages covering different content |

**Recommended default (NOT APPROVED):** Option B — `/treatments/implants` (safer for a generically-named hub slug)

> **Nicko approval:**
> - [ ] Option A — `/treatments/implants-single-tooth`
> - [ ] Option B — `/treatments/implants`
> - [ ] Other: _______________

---

### NR-08 — /dental-hygienist/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/dental-hygienist/` |
| **Proposed target** | `/treatments/periodontal-gum-care` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** Dental hygienist and periodontal/gum care serve overlapping but distinct patient needs. A user searching for a hygienist appointment is often seeking a routine scale and polish, not gum disease treatment. Champagne may plan a dedicated hygiene page.

**SEO / business risk:** Medium. Hygienist is a routine, high-frequency service. If the WP page ranked for hygienist appointment queries, landing on a gum care treatment page may feel clinical/mismatched. If a hygiene-specific page is planned, hold.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/periodontal-gum-care` | No hygiene-specific page is planned; gum care is the closest clinical match |
| B | `/treatments/preventative-and-general-dentistry` | Hygiene sits more naturally under general/preventative care than gum disease |
| C | Hold — create a dedicated hygiene/hygienist page | A hygiene page is planned in Champagne |

**Recommended default (NOT APPROVED):** Option B — `/treatments/preventative-and-general-dentistry` (hygiene is preventative care, not gum disease treatment)

> **Nicko approval:**
> - [ ] Option A — `/treatments/periodontal-gum-care`
> - [ ] Option B — `/treatments/preventative-and-general-dentistry`
> - [ ] Option C — Hold; create hygienist page first
> - [ ] Other: _______________

---

### NR-09 — /fissure-sealants/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/fissure-sealants/` |
| **Proposed target** | `/treatments/preventative-and-general-dentistry` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** Fissure sealants is a specific preventative treatment, not a broad category. Champagne has no dedicated fissure sealants page. The proposed fallback is reasonable but generic. A 410 Gone may be cleaner if this was a thin or low-traffic page.

**SEO / business risk:** Low. Fissure sealants is a niche, lower-volume search term. If the WP page had little indexed traffic, the choice of fallback barely matters from an SEO standpoint. If there is a meaningful audience (e.g., parents searching for children's dental sealants), the preventative-and-general page is a reasonable landing.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/preventative-and-general-dentistry` | Champagne offers fissure sealants as part of preventative care; this page covers it |
| B | 410 Gone | The WP page was thin or had no meaningful traffic; no redirect needed |

**Recommended default (NOT APPROVED):** Option A — `/treatments/preventative-and-general-dentistry`

> **Nicko approval:**
> - [ ] Option A — `/treatments/preventative-and-general-dentistry`
> - [ ] Option B — 410 Gone
> - [ ] Other: _______________

---

### NR-10 — /cfast/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/cfast/` |
| **Proposed target** | `/treatments/fixed-braces` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** Cfast is a specific branded fixed-brace system. The correct redirect depends on whether the practice still offers Cfast under that branding. If discontinued, a 410 is cleaner than redirecting to a page that may not mention Cfast at all.

**SEO / business risk:** Low–medium. Branded orthodontic searches ("cfast dentist near me") are specific. If the brand is no longer offered, a 301 redirect may mislead patients. A 410 tells Google the page is intentionally gone, which is honest and avoids confusion.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/fixed-braces` | Cfast is still offered at SMHD as a fixed-brace option |
| B | `/treatments/orthodontics` | Cfast is still offered but sits under a broader orthodontics page |
| C | 410 Gone | Cfast is no longer offered at SMHD |

**Recommended default (NOT APPROVED):** Nicko to confirm brand status. If still offered: Option A. If discontinued: Option C.

> **Nicko approval:**
> - [ ] Option A — `/treatments/fixed-braces` *(Cfast still offered)*
> - [ ] Option B — `/treatments/orthodontics` *(Cfast still offered, broader page)*
> - [ ] Option C — 410 Gone *(Cfast discontinued)*
> - [ ] Other: _______________

---

### NR-11 — /smiletru/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/smiletru/` |
| **Proposed target** | `/treatments/clear-aligners` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** SmileTru is a specific branded aligner system. Same logic as Cfast — the correct redirect depends on whether the practice still offers SmileTru by name.

**SEO / business risk:** Low–medium. Branded aligner searches are specific. If discontinued, 410 avoids misleading patients searching for SmileTru specifically.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/clear-aligners` | SmileTru is still offered at SMHD as a clear aligner option |
| B | 410 Gone | SmileTru is no longer offered at SMHD |

**Recommended default (NOT APPROVED):** Nicko to confirm brand status. If still offered: Option A. If discontinued: Option B.

> **Nicko approval:**
> - [ ] Option A — `/treatments/clear-aligners` *(SmileTru still offered)*
> - [ ] Option B — 410 Gone *(SmileTru discontinued)*
> - [ ] Other: _______________

---

### NR-12 — /inman-aligner/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/inman-aligner/` |
| **Proposed target** | `/treatments/orthodontics` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** Inman Aligner is a specific removable appliance brand. Same brand-status question as Cfast and SmileTru. If discontinued, 410. If still offered, the best Champagne match could be either clear-aligners or orthodontics depending on how the treatment is presented.

**SEO / business risk:** Low–medium. Inman Aligner has its own search community. If still offered, clear-aligners may be a more accurate landing than a broad orthodontics page.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/orthodontics` | Inman Aligner is still offered; orthodontics is the best umbrella |
| B | `/treatments/clear-aligners` | Inman Aligner is still offered; it is categorised with other aligner systems |
| C | 410 Gone | Inman Aligner is no longer offered at SMHD |

**Recommended default (NOT APPROVED):** Nicko to confirm brand status. If still offered: Option A or B. If discontinued: Option C.

> **Nicko approval:**
> - [ ] Option A — `/treatments/orthodontics` *(Inman still offered)*
> - [ ] Option B — `/treatments/clear-aligners` *(Inman still offered, aligner category)*
> - [ ] Option C — 410 Gone *(Inman discontinued)*
> - [ ] Other: _______________

---

### NR-13 — /confidentiality-policy/

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/confidentiality-policy/` |
| **Proposed target** | `/legal/terms` |
| **Proposed type** | 301 Permanent |

**Why this needs review:** In a dental / healthcare context, a "confidentiality policy" almost certainly means patient data protection and privacy (GDPR / UK GDPR), not general terms and conditions. Mapping it to `/legal/terms` could misdirect patients and regulators expecting privacy content.

**SEO / business risk:** Low for search rankings, but meaningful for compliance. If a patient or regulator follows a link to the confidentiality policy and lands on terms-and-conditions content, that is a GDPR documentation gap. `/legal/privacy` is the correct target if it covers data handling.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/legal/privacy` | The WP confidentiality policy was a patient data / GDPR document *(likely correct)* |
| B | `/legal/terms` | The WP confidentiality policy was a general practice confidentiality statement folded into T&Cs |

**Recommended default (NOT APPROVED):** Option A — `/legal/privacy`

> **Nicko approval:**
> - [ ] Option A — `/legal/privacy`
> - [ ] Option B — `/legal/terms`
> - [ ] Other: _______________

---

## Section 2 — HUMAN_REVIEW_REQUIRED

These rows have been flagged as requiring mandatory human verification before any implementation decision can be made.

---

### HR-01 — /invisalign-teeth-straightening/ ⚠ SOURCE WAS 404 IN WORDPRESS

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/invisalign-teeth-straightening/` |
| **Proposed target** | `/treatments/clear-aligners` |
| **Proposed type** | 301 Permanent |
| **Flag** | Source URL returned 404 in the WordPress site before migration |

**Why this needs review:** This URL was already a 404 in WordPress — it was either deleted or never properly published. Implementing a 301 redirect for a page that never existed (or was removed) is only worthwhile if there is evidence of indexed traffic or inbound backlinks to this URL. Without that evidence, a 410 Gone is cleaner.

**Action required before deciding:** Check Google Search Console and/or Ahrefs for:
- Any indexed impressions or clicks for `/invisalign-teeth-straightening/`
- Any external backlinks pointing to this URL

**SEO / business risk:** Low if no traffic/links exist (implement 410 and move on). Medium if backlinks or indexed traffic exist — in that case, a 301 to clear-aligners rescues that link equity.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | `/treatments/clear-aligners` — 301 | GSC/Ahrefs confirms indexed traffic or backlinks exist for this URL |
| B | `/treatments/orthodontics` — 301 | Same as A but orthodontics is a better fit for Invisalign-branded queries |
| C | 410 Gone | No indexed traffic or backlinks found; source was already dead in WP |

**Recommended default (NOT APPROVED):** Check GSC first. If traffic/links exist: Option A. If no evidence: Option C.

> **Nicko approval:**
> - [ ] Option A — `/treatments/clear-aligners` (301) *(after confirming traffic/links)*
> - [ ] Option B — `/treatments/orthodontics` (301) *(after confirming traffic/links)*
> - [ ] Option C — 410 Gone *(no traffic/links found)*
> - [ ] Other: _______________

---

### HR-02 — /elementskit-content/dynamic-content-megamenu-menuitem1768/ ⚠ LEGACY BUILDER URL — STRONGLY RECOMMEND 410

| Field | Value |
|---|---|
| **WordPress URL** | `https://www.smhdental.co.uk/elementskit-content/dynamic-content-megamenu-menuitem1768/` |
| **Proposed target** | `/` |
| **Proposed type** | 301 Permanent (proposed) |
| **Flag** | Legacy ElementsKit page-builder internal URL — not a real content page |

**Why this needs review:** This URL is an internal artifact generated by the ElementsKit WordPress page builder for a dynamic megamenu item. It is not a real page, was not intended to be publicly accessible, and should never have been indexed by Google. Sending a 301 redirect to the homepage passes this builder artifact into Google's crawl graph as a real URL with a redirect, which is unnecessary and slightly untidy.

**A 410 Gone response tells Google: this URL is intentionally gone and was never real content. Stop crawling it.** This is the correct response for a builder artifact.

**SEO / business risk:** Very low either way — this URL has no meaningful SEO value. A 410 is cleaner. A 301 to `/` is harmless but unnecessary.

**Options:**

| # | Target | When to pick this |
|---|---|---|
| A | 410 Gone | **(Strongly recommended)** This was a builder artifact, not a real page |
| B | `/` — 301 | Preference to redirect rather than return 410 for any known URL |

**Recommended default (NOT APPROVED):** Option A — 410 Gone

> **Nicko approval:**
> - [ ] Option A — 410 Gone *(recommended)*
> - [ ] Option B — `/` (301)
> - [ ] Other: _______________

---

## Summary table

| ID | WordPress path | Status | Recommended default (NOT APPROVED) |
|---|---|---|---|
| NR-01 | `/emergency/` | NEEDS_REVIEW | 301 → `/treatments/emergency-dentistry` |
| NR-02 | `/general-dentistry/` | NEEDS_REVIEW | 301 → `/treatments/preventative-and-general-dentistry` |
| NR-03 | `/teeth-replacement/` | NEEDS_REVIEW | 301 → `/treatments` |
| NR-04 | `/cosmetic-dentistry/` | NEEDS_REVIEW | 301 → `/treatments` (or hold for cosmetic hub) |
| NR-05 | `/reviews/` | NEEDS_REVIEW | Create `/reviews` page; temp 301 → `/smile-gallery` |
| NR-06 | `/offer/` | NEEDS_REVIEW | 301 → `/treatments` |
| NR-07 | `/dental-implant/` | NEEDS_REVIEW | 301 → `/treatments/implants` |
| NR-08 | `/dental-hygienist/` | NEEDS_REVIEW | 301 → `/treatments/preventative-and-general-dentistry` |
| NR-09 | `/fissure-sealants/` | NEEDS_REVIEW | 301 → `/treatments/preventative-and-general-dentistry` |
| NR-10 | `/cfast/` | NEEDS_REVIEW | Confirm brand status first |
| NR-11 | `/smiletru/` | NEEDS_REVIEW | Confirm brand status first |
| NR-12 | `/inman-aligner/` | NEEDS_REVIEW | Confirm brand status first |
| NR-13 | `/confidentiality-policy/` | NEEDS_REVIEW | 301 → `/legal/privacy` |
| HR-01 | `/invisalign-teeth-straightening/` | HUMAN_REVIEW_REQUIRED | Check GSC; likely 410 Gone |
| HR-02 | `/elementskit-content/…/` | HUMAN_REVIEW_REQUIRED | 410 Gone (strongly recommended) |

---

## Pre-approval checklist (complete before returning this document)

- [ ] All 15 rows above have an option ticked or marked as excluded
- [ ] Brand status confirmed for NR-10 (Cfast), NR-11 (SmileTru), NR-12 (Inman Aligner)
- [ ] GSC / Ahrefs checked for HR-01 (invisalign-teeth-straightening)
- [ ] Homepage anchor `#reviews` status confirmed if Option B selected for NR-05
- [ ] Cosmetic hub page decision made for NR-04
- [ ] Hygienist page decision made for NR-08

---

*This document does not approve any redirects. Redirects will be implemented only after this document is returned with Nicko's choices marked.*
