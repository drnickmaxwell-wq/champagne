# Champagne Page Architecture

Author: Codex · Champagne Design System

Purpose: Blueprint the canonical marketing site architecture using the Route Framework Report, Manifest & Config Framework Report, Manus Design Atlas v1, and existing preview templates. Preview/lab routes are excluded from launch unless explicitly tagged.

## 1. Page Classification

**V1 (launch-critical)**
- `/` (homepage)
- `/treatments` hub and treatment detail pages: `/treatments/general`, `/treatments/cosmetic`, `/treatments/orthodontics`, `/treatments/3d-dentistry`, `/treatments/technology`, `/treatments/implants`, `/treatments/dental-implants`, `/treatments/whitening`, `/treatments/veneers`
- `/team`
- `/anxiety-dentistry`
- `/video-consultation`
- `/emergency-dentist`
- `/champagne/hero` (frozen reference; QA only)

**V1.5 (post-launch SEO expansion)**
- `/blog`
- `/stories` and `/patient-stories`
- `/patient-education`
- `/team/dr-sarah-mitchell`

**V2 (luxury & AI advanced)**
- `/ai-smile-quiz`
- Future luxury/AI augmentations layered onto V1 templates (e.g., concierge strips, AI copy injectors); keep all `/preview/*` and `/champagne-preview` routes tagged **non-launch**.

## 2. Page-by-page requirements (V1 + V1.5)

### `/` (Homepage)
- **Required components:** `HOME_HERO_CHAMPAGNE_V1` (Manus hero), `HOME_TECH_STRIP_V1`, `HOME_TREATMENT_GRID_A` (reskin), `HOME_TESTIMONIALS_A` (reskin), `HOME_FAQ_V1`, `FOOTER_CHAMPAGNE_LIGHT_DARK_DUO`.
- **Preview coverage:** Hero and footer have preview/frozen variants; tech strip and FAQ present in preview home; treatment grid/testimonials need Champagne reskin.
- **Gaps:** Reskin treatment grid + testimonials to Champagne tokens; add AI Concierge band per strategy.
- **SEO schema:** Organization, LocalBusiness (Dentist), WebSite+SearchAction, BreadcrumbList, FAQPage, Review snippet.
- **Copy depth:** Long-form sections (story + local proof) with short CTA blocks.
- **Hero:** Use ChampagneHero template locked to `HOME_HERO_CHAMPAGNE_V1` (no new Manus brief).

### `/treatments` (Hub)
- **Required components:** `TreatmentHero(hub)`, `ValueGrid`, `TreatmentCardGrid`, `ThreeDViewer`, `FinanceBand`, `FAQRail`, `CTASection`. Manus Atlas mapping: `CB_FAQ_PHASE1E` for FAQ pattern; treatment cards align to `HOME_TREATMENT_GRID_A` structure.
- **Preview coverage:** Full preview stack exists in `/preview/treatments` with wired sections.
- **Gaps:** Needs Champagne reskin for cards/grid; finance band polish; connect schema packs.
- **SEO schema:** ItemList of Service, FAQPage, BreadcrumbList.
- **Copy depth:** Long-form lede + succinct card copy.
- **Hero:** ChampagneHero variant (hub) using preview hero pattern.

### `/treatments/general`, `/treatments/cosmetic`, `/treatments/orthodontics`, `/treatments/3d-dentistry`, `/treatments/technology`, `/treatments/whitening`, `/treatments/dental-implants`
- **Required components:** Treatment hero, Benefits grid, HowTo steps, Results/Who it’s for, Before/After gallery, Pricing & Finance, FAQAccordion, CTASection. Manus Atlas analogs: `CB_HERO_FINAL` (hero spec), `CB_TABS_OVERVIEW_V1` (tabs/overview model), `CB_FAQ_PHASE1E` (FAQ), `CB_TESTIMONIALS_CAROUSEL` for gallery cadence.
- **Preview coverage:** All slugs have preview counterparts under `/preview/treatments/*` with hero + FAQ schema loaders.
- **Gaps:** Need Manus-aligned Benefits/HowTo/Finance components and Champagne reskin; ensure schema packs mapped per slug.
- **SEO schema:** Service or MedicalProcedure, HowTo, FAQPage, BreadcrumbList; add Product where device-specific.
- **Copy depth:** Long-form (benefits + how-to) with concise finance CTA.
- **Hero:** ChampagneHero treatment variant following `CB_HERO_FINAL` spacing.

### `/treatments/veneers`
- **Required components:** `TreatmentHero(veneers)`, `BenefitGrid(veneers)`, `HowToSteps(schemaKey="veneers-process")`, `ThreeDViewer` with poster, `FinanceModule(planGroup="veneers")`, `BeforeAfterGallery(veneers)`, `FAQAccordion(veneers)`, `CTASection`.
- **Preview coverage:** Preview page exists with hero/FAQ/schema wiring.
- **Gaps:** Needs gallery assets and finance integration; ensure HowTo steps map to schema pack.
- **SEO schema:** Service, HowTo, FAQPage, BreadcrumbList, optional ImageObject for gallery.
- **Copy depth:** Long-form.
- **Hero:** ChampagneHero treatment variant (`CB_HERO_FINAL`).

### `/treatments/implants`
- **Required components:** `TreatmentHero(implants)`, `BenefitGrid(implants)`, `HowToSteps(schemaKey="implant-process")`, `ThreeDViewer(implant)`, `FinanceModule(planGroup="implants")`, `BeforeAfterGallery(implants)`, `FAQAccordion(implants)`, `CTASection`.
- **Preview coverage:** Preview slug present with schema packs.
- **Gaps:** 3D asset + finance polish; align HowTo to schema.
- **SEO schema:** Service, HowTo, FAQPage, BreadcrumbList.
- **Copy depth:** Long-form.
- **Hero:** ChampagneHero treatment variant.

### `/treatments/orthodontics/spark-aligners`
- **Required components:** `TreatmentHero(spark-aligners)`, `BenefitGrid`, `HowToSteps(schemaKey="aligner-process")`, `ThreeDViewer`, `FinanceModule(planGroup="aligners")`, `BeforeAfterGallery`, `FAQAccordion`, `CTASection`.
- **Preview coverage:** Dedicated preview slug available.
- **Gaps:** Align HowTo to schema; gallery assets.
- **SEO schema:** Service, HowTo, FAQPage, BreadcrumbList.
- **Copy depth:** Long-form.
- **Hero:** ChampagneHero treatment variant.

### `/team`
- **Required components:** Team hero (mission), Team grid (bios with author markup), Values band, Clinic tour media, CTA, FAQ rail. Manus Atlas mapping: reuse `HOME_TESTIMONIALS_A` spacing for testimonials; FAQ via `HOME_FAQ_V1` pattern.
- **Preview coverage:** Production route wired; preview LUX team variants exist.
- **Gaps:** Author schema on bios; clinic tour block; Champagne reskin of cards.
- **SEO schema:** Organization, Person (per bio), BreadcrumbList, FAQPage, VideoObject if tour is video.
- **Copy depth:** Long-form values + short bios.
- **Hero:** New Manus brief aligned to team tone (not sacred home hero).

### `/team/dr-sarah-mitchell`
- **Required components:** Clinician hero (author), Qualifications + GDC, Treatments focus list, Testimonials, CTA, FAQ rail.
- **Preview coverage:** Route wired; preview LUX team profiles inform layout.
- **Gaps:** Author/Review schema; CTA band; Champagne polish for biography sections.
- **SEO schema:** Person, Article/Review snippet as applicable, BreadcrumbList, FAQPage.
- **Copy depth:** Long-form biography.
- **Hero:** New Manus brief (profile-specific); keep separate from homepage hero.

### `/anxiety-dentistry`
- **Required components:** Service hero, Benefit grid (comfort measures), HowItWorks (sedation flow), Clinician reassurance, FAQ, CTA.
- **Preview coverage:** None specific; borrow treatment template blocks.
- **Gaps:** Comfort/finance microcopy; schema mapping.
- **SEO schema:** Service, FAQPage, HowTo (if sedation steps), BreadcrumbList.
- **Copy depth:** Long-form reassurance + short CTA.
- **Hero:** ChampagneHero derivative with calm tokens (new brief).

### `/video-consultation`
- **Required components:** Hero (virtual care), Steps (book → upload → consult), Tech requirements, FAQ, CTA.
- **Preview coverage:** None; use preview CTA/FAQ modules as scaffolds.
- **Gaps:** Schema for HowTo; video/telehealth compliance copy.
- **SEO schema:** HowTo, FAQPage, Service, BreadcrumbList.
- **Copy depth:** Short-form with clear steps.
- **Hero:** ChampagneHero variant or new brief tuned for telehealth.

### `/emergency-dentist`
- **Required components:** Urgent-care hero, Symptoms/when to call, Response time strip, Pricing/insurance note, FAQ, CTA (call now), Location map.
- **Preview coverage:** None dedicated; reuse treatment CTA/FAQ blocks.
- **Gaps:** Map + structured hours; emergency schema copy.
- **SEO schema:** Service, FAQPage, BreadcrumbList, Speakable for triage snippet.
- **Copy depth:** Short-form urgent guidance.
- **Hero:** Frozen hero derivative with emergency messaging (do not alter sacred home hero layers).

### `/blog`
- **Required components:** Blog hero, Category filter, Post grid, Author boxes, Newsletter CTA.
- **Preview coverage:** Base route wired; no Champagne reskin yet.
- **Gaps:** Manus-aligned article cards; author schema; breadcrumb wiring.
- **SEO schema:** Blog, BlogPosting (per card), BreadcrumbList, FAQPage for hub FAQs.
- **Copy depth:** Long-form posts; hub short lede.
- **Hero:** New Manus brief (editorial hero).

### `/stories` / `/patient-stories`
- **Required components:** Stories hero, Filterable grid (concern/treatment/timeframe), Case cards, Link to treatment pages, CTA.
- **Preview coverage:** Production route wired; LUX stories preview offers card model.
- **Gaps:** Case metadata + schema; gallery polish; CTA rail.
- **SEO schema:** CollectionPage; Review/CreativeWork with author; BreadcrumbList; ImageObject per case.
- **Copy depth:** Long-form per case; hub medium-form.
- **Hero:** New Manus brief (storytelling hero).

### `/patient-education`
- **Required components:** Education hero, Interactive modules (quiz/light guides), FAQ rail, Related treatments, CTA.
- **Preview coverage:** Interactive hub exists; lacks Champagne polish.
- **Gaps:** Schema wiring for HowTo/FAQ; component reskin.
- **SEO schema:** HowTo, FAQPage, BreadcrumbList, Speakable for snippets.
- **Copy depth:** Long-form guides with short summaries.
- **Hero:** New Manus brief (educational tone).

### `/champagne/hero`
- **Required components:** Frozen canonical hero reference only (no content changes). Use `HOME_HERO_CHAMPAGNE_V1` locked state.
- **Preview coverage:** Hero freeze present.
- **Gaps:** None—guarded surface; only QA instrumentation allowed.
- **SEO schema:** None (reference page only).
- **Copy depth:** N/A.
- **Hero:** Sacred; do not modify.

## 3. Component Mapping

- **Champagne hero surfaces:** `HOME_HERO_CHAMPAGNE_V1` (home), `CB_HERO_FINAL` (treatment hero archetype). Preview heroes exist in `/preview/home`, `/preview/treatments/*`, and `/champagne/hero`. Never modify the frozen hero; new briefs may be created for team/blog/story variations without touching sacred home hero.
- **Treatment stacks:** Preview components available in `/preview/treatments` (hero, FAQs, schema injection). Manus Atlas coverage: `CB_TABS_OVERVIEW_V1` (overview/tabs), `CB_FAQ_PHASE1E` (FAQ), `CB_TESTIMONIALS_CAROUSEL` (stories/gallery cadence). Missing: Champagne-reskinned Benefits/HowTo/Finance modules and 3D assets for veneers/implants/aligners.
- **Homepage sections:** Preview tech strip and FAQ exist; treatment grid/testimonials need reskin to match `HOME_TREATMENT_GRID_A` and `HOME_TESTIMONIALS_A` from Atlas. AI Concierge band requires new design before implementation. Hero/footers are sacred and may be reused; never layer experiments directly onto hero.
- **Team & profiles:** Preview LUX team pages provide card/layout references. Manus Atlas lacks dedicated team hero; require new brief. Implement bios/author markup in preview first, then promote.
- **Stories/blog/education:** Base routes wired but lack Champagne components. Preview LUX stories grid can be reused safely. New Manus briefs needed for editorial and storytelling heroes; build grids/cards in preview before launch.
- **Emergency/telehealth/anxiety:** No preview-specific components; reuse treatment CTA/FAQ patterns in preview sandboxes. Ensure schema packs align before production. Keep sacred hero untouched; build independent hero variants.
- **SEO schema blocks:** Schema packs already wired for preview treatments (config/seo schema files). Extend Breadcrumb + FAQ injection to all V1/V1.5 pages in preview first. FAQ rail uses `CB_FAQ_PHASE1E` pattern.

## 4. Recommended Build Order

1. **Phase A: Scaffold missing preview routes** — ensure every V1/V1.5 page has a preview twin with placeholder sections (no hero modifications). Prioritize anxiety, emergency, video consultation, blog/stories/education heroes.
2. **Phase B: Implement missing treatment detail pages** — finalize Benefits/HowTo/Finance modules, 3D assets, and gallery cadence aligned to Manus Atlas; reskin treatment grid/testimonials.
3. **Phase C: Apply Champagne Skin Engine when stable** — propagate tokens, layer stack, and guard rails across preview sections; run guard:hero and guard:manifest-sync checks.
4. **Phase D: SEO schema + content injection** — wire Service/HowTo/FAQ/Breadcrumb/BlogPosting schema; load copy packs; integrate author markup and localized metadata.
5. **Phase E: Pre-launch pixel QA** — cross-device hero freeze validation, motion/PRM checks, CWV budgets, and rogue-hex sweeps; then promote preview routes to production.

## 5. JSON Mirror

See `/config/champagne/page-architecture.json` for machine-readable mapping.
