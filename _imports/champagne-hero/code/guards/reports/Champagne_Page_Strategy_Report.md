[Champagne_Page_Strategy_Report.md](https://github.com/user-attachments/files/23471249/Champagne_Page_Strategy_Report.md)
# St Mary’s House Dental — Champagne Page Strategy Report
Version: 2025-11-10 · Platform: Next.js 15 (App Router), Tailwind v4, shadcn/ui, Framer Motion  
Brand Law: linear-gradient(135deg,#C2185B 0%,#40C4B4 60%,#D4AF37 100%); Gold ≤ 4%; AA; PRM

## UX & SEO Patterns Observed (Luxury Clinics)
- **Luxury anchor pages** lead with social proof above the fold and jump links to treatments; persistent book/phone CTAs; hero video kept lightweight.
- **Patient story hubs**: filterable grids with case metadata (age, treatment, concerns) and before/after images; internal links to service pages.
- **Teleconsult hooks**: clear e‑consult flows and async photo upload wizards.
- **Zero‑click surfaces**: bite‑sized FAQs, pricing ranges, and mini HowTo steps directly embeddable as snippets.

> Benchmarks are informed by observed leaders plus Google guidance on AI features, structured data, and Core Web Vitals.

---

## Global Elements (applies to all routes)
- Topbar with phone, WhatsApp, finance, and **AI Concierge** pill. Sticky mobile bottom dock: Call · Book · WhatsApp · Quiz · Portal.
- **Guarded gradient** header, wave mask, film‑grain overlay, parallax ≤6px (prefers‑reduced‑motion respected).
- Sitewide **FAQ rail** (injects per route for zero‑click wins), review snippet component, and schema blocks (JSON‑LD).
- **Performance budget**: Hero ≤ 120KB images, LCP element preloaded, all effects progressive (CSS first, then WebGL/3D on idle).

**Core Web Vitals Targets** (all pages): LCP ≤ 2.5s; INP ≤ 200ms; CLS ≤ 0.1. Preload fonts (Montserrat, Lora, Inter) with `font-display: swap` and unicode‑range subsets.

---

## Route Blueprints

### 1) Home `/`
**Purpose:** Route to conversions, surface differentiators (luxury, tech, AI), expose key treatments, and trust.

**Section order:**
1. **Champagne Hero** — gradient + wave; headline with Montserrat; subcopy in Lora; rich CTAs: *Book Now*, *Free E‑Consult*, *AI Smile Quiz*; trust bar (awards, Invisalign tier).
2. **Value Trio** — Luxury Care · Advanced Tech · Coastal Calm (icon cards, micro‑animations).
3. **Patient Stories Carousel** — before/after slider + link to hub.
4. **Priority Treatments** — Veneers, Composite Bonding, Implants, Invisalign (cards with mini FAQs).
5. **3D/AR Showcase** — lightweight 3D viewer demo with AR handoff.
6. **AI Concierge Band** — what the chatbot can do (book, quotes, routes).
7. **Teleconsult CTA** — async photo uploads + availability.
8. **Finance & Membership** — Tabeo integration and plan compare.
9. **FAQ Rail** — top 6 global FAQs (expanders).
10. **Local Proof** — map, opening hours, parking, Shoreham‑by‑Sea specifics.
11. **Footer** — deep links, compliance, brand locks.

**Schema:** Organization, LocalBusiness→Dentist, WebSite+SearchAction, BreadcrumbList, FAQPage, Review snippet (AggregateRating).

---

### 2) Treatments (template) `/treatments/:slug`
**Purpose:** Rank for intent terms; provide depth for AI Overviews; convert with cases + pricing band.

**Section order:**
1. **Treatment Hero** — problem→solution; primary CTA *Book*; secondary *Free E‑Consult*; anchor links (Benefits · Process · Pricing · FAQs · Cases).
2. **Symptoms & Benefits** — bullet grid (copy primed for featured snippets).
3. **How It Works** — 4–6 step **HowTo** with schema; optional short video.
4. **Who It’s For / Not For** — candid guidance; EEAT tone.
5. **Results & Longevity** — expected timelines; care tips.
6. **Before/After Gallery** — filterable; case metadata; internal links to patient stories.
7. **Pricing Range & Finance** — transparent range + calculator.
8. **3D/AR Module** — interactive model if relevant (veneers/implants/aligners).
9. **Clinician Expertise** — dentist cards with author markup; GDC numbers.
10. **FAQs** — 8–12, optimized for zero‑click.
11. **Conversion Band** — Book · Free E‑Consult · WhatsApp.

**Schema:** MedicalProcedure or Service, HowTo, FAQPage, VideoObject (if used), Review, BreadcrumbList, Speakable (select headings).

---

### 3) Technology `/technology`
Showcase hardware/software with credibility and speed.

**Sections:** Hero · Tech grid (CBCT, IOS, 3D printing, AI planning) · Live demo (3D viewer) · Case tie‑ins · FAQs · CTA.

**Schema:** Product (when brand‑specific), TechArticle, FAQPage, BreadcrumbList.

---

### 4) About `/about`
Luxury human story + EEAT.

**Sections:** Hero (mission), Team grid (bios with author markup), Clinic tour (video), Values, Safety/Compliance, Careers teaser, Press logos, FAQs, CTA.

**Schema:** Organization, Person (embedded), BreadcrumbList, VideoObject, FAQPage.

---

### 5) Patient Stories `/patient-stories`
**Sections:** Filters (concern, treatment, timeframe), Card grid (before/after), Story pages with narrative and outcomes, UGC consent management.

**Schema:** CollectionPage; each story page uses Review/CreativeWork+author, ImageObject; BreadcrumbList.

---

### 6) AI Smile Quiz `/ai-smile-quiz`
**Sections:** Intro + consent, quiz steps (concerns, photos), instant guidance, result page with recommended treatments and booking handoff; accessibility copy for PRM.

**Schema:** HowTo (steps), FAQPage, SoftwareApplication (if exposed), Event (if leads to teleconsult slot).

---

### 7) Portal `/portal`
**Sections:** Feature overview (uploads, plans, payments), security/GDPR, app links, CTA to sign in; gentle gradient and reduced effects.

**Schema:** SoftwareApplication, FAQPage, Organization, BreadcrumbList.

---

### 8) Contact `/contact`
**Sections:** Smart contact (channels, response SLAs), map with parking, hours (specialHours support), emergency flow, mini‑FAQ; embed structured `openingHoursSpecification`.

**Schema:** LocalBusiness, ContactPoint, FAQPage, BreadcrumbList.

---

### 9) Blog `/blog` & Post
**Sections:** Topic hubs (aligners, implants, cosmetic), author boxes (GDC, credentials), FAQ extractors, related treatments, internal link rails.

**Schema:** Blog, BlogPosting (author, reviewedBy), FAQPage, Speakable, BreadcrumbList, VideoObject when present.

---

## Interactivity & Effects (by type)
- **Parallax**: max 6px translateY with spring ease `cubic-bezier(0.645,0.045,0.355,1)`; disabled for PRM.
- **3D/AR**: progressive enhancement; poster image LQIP; user‑initiated load.
- **Chatbot**: floating button; opens sheet; integrates booking/finance; logs intents for SEO copy gaps.

## Lighthouse / CWV Targets
- LCP ≤ 2.5s (hero image/video optimized, `fetchpriority=high`)
- INP ≤ 200ms (defer hydration; island architecture for heavy widgets)
- CLS ≤ 0.1 (fixed media dimensions; font fallback metrics)
