# Champagne Repo Recon Report

## 1. Framework & Routes Map
- **App shell:** Next.js App Router with global metadata/layout; preview shell used for `/preview/*` and `/champagne/hero` routes, while main site uses sticky header/footer shell. 【F:app/layout.tsx†L1-L131】
- **Homepage:** `/` renders ChampagneHero (feature-flagged), a 4K hero video, and SmileJourney section. 【F:app/page.tsx†L1-L11】
- **Treatments hub:** `/treatments` client page with animated treatment cards and hero band; numerous nested treatment detail routes exist under `app/treatments/*`. 【F:app/treatments/page.tsx†L1-L61】【F:app/treatments/page.tsx†L88-L112】
- **Champagne hero lock:** `/champagne/hero` exposes the canonical hero only when the brand flag permits. 【F:app/champagne/hero/page.tsx†L1-L19】
- **Preview sandboxes:** `/champagne-preview` mirrors the locked hero; `/preview/home` composes full home sections for experimentation; `/preview/hero-gilded` hosts experimental gold/motion toggles with PRM handling; additional preview canvases exist for chat, treatments, technology, footer, and brand lock. 【F:app/champagne-preview/page.tsx†L1-L10】【F:app/preview/home/page.tsx†L1-L78】【F:app/preview/hero-gilded/page.tsx†L1-L143】

## 2. Design System Inventory (Champagne Layer)
- **Token source of truth:** `styles/tokens/smh-champagne-tokens.css` defines canonical hues, gradient law, glass/overlay intensities, and PRM parallax caps. 【F:styles/tokens/smh-champagne-tokens.css†L2-L82】
- **Theme bundle:** `styles/champagne/theme.css` imports tokens/gradients/layers/glass/typography/spacing/time-of-day and sets ink/dusk backgrounds for Champagne pages. 【F:styles/champagne/theme.css†L1-L19】
- **Gradient law utility:** `styles/champagne/gradients.css` encodes the 135° magenta→teal→soft-gold sweep. 【F:styles/champagne/gradients.css†L1-L7】
- **Glass surfaces:** `styles/champagne/glass.css` specifies blur/background/border/shadow recipes for soft and deep glass cards. 【F:styles/champagne/glass.css†L1-L18】
- **Layer + motion manifest:** `styles/champagne/manifest.json` documents hero tokens, 9-layer stack, assets, and compliance rules (opacity caps, parallax limit). 【F:styles/champagne/manifest.json†L2-L118】
- **Hero implementation:** `styles/champagne/hero.css` applies the manifest with 9 discrete layers, gradient CTA styling, and PRM fallbacks. Used by `components/home/ChampagneHero.tsx` and the hero preview routes. 【F:styles/champagne/hero.css†L4-L200】【F:components/home/ChampagneHero.tsx†L5-L70】
- **Core utilities:** `lib/champagne/theme.ts` re-exports gradient/layer/time-of-day helpers; `lib/champagne/timeOfDay.ts` toggles `[data-theme]` for dawn/dusk/night background shifts. 【F:lib/champagne/theme.ts†L1-L5】【F:lib/champagne/timeOfDay.ts†L1-L5】【F:styles/champagne/time-of-day.css†L1-L10】

## 3. Manifests & Canon Docs (Pre-existing)
- **Brand canon packet:** README plus manifests/tokens declaring immutable Champagne tokens and hero style manifest for auditors and downstream consumers. 【F:docs/Brand_Canon_Packet/Brand_Canon_README.md†L1-L19】
- **Hero style manifest (JSON):** `docs/Brand_Canon_Packet/manifest.styles.champagne.json` mirrors `styles/champagne/manifest.json`, cataloguing tokens, layers, assets, and PRM rules for the canonical hero. 【F:styles/champagne/manifest.json†L2-L118】
- **Hero freeze process:** `docs/hero-freeze.md` instructs running `pnpm run guard:hero` and updating the baseline hash file when intentional hero asset changes occur. 【F:docs/hero-freeze.md†L1-L9】
- **Blueprint governance:** `docs/Blueprint.md` locks `/` and `/champagne/hero`, routes work to preview sandboxes, and mandates guards (`brand:guard`, `guard:hero`) plus manifest references. 【F:docs/Blueprint.md†L72-L131】
- **Guard inventory:** `Guards_Audit_Report.md` lists the established guard scripts/workflows (brand, hue, hero-freeze, preview/sacred-route/asset-size checks). 【F:Guards_Audit_Report.md†L3-L42】
- **Champagne tokens (css copy):** `docs/Brand_Canon_Packet/smh-champagne-tokens.css` duplicates the canonical token set for documentation/audit use (aligned with Section 2 tokens). 【F:styles/tokens/smh-champagne-tokens.css†L2-L82】
- **Numerous audit/previews reports** under `/reports` capture state-of-play for heroes, previews, and technology/treatment canvases; they pre-date Atlas and reference Champagne canon (e.g., CHAMPAGNE_AUDIT, Preview_Hero_* series). *(Not exhaustively repeated here but remain as historical references in `/reports`.)*

## 4. Manus Atlas v1 Integration
- **Manus_Design_Atlas_v1.md:** Master design bible summarising gradient law, layer stack rules, and page-by-page component status; calls the restored Home Hero canonical and notes CHAMPAGNE_READY vs NEEDS_RE-SKIN sections. 【F:docs/manus-atlas/v1/Manus_Design_Atlas_v1.md†L10-L200】
- **Manus_Audit_Report.md:** Deep audit of Manus eras highlighting strengths (hero layering, AI tools) and recommending promotion of restored heroes/components. 【F:docs/manus-atlas/v1/Manus_Audit_Report.md†L3-L120】
- **Integration_Roadmap.md:** Prescribes build order (effects/tokens → canonical ChampagneHero → layout → cards → CTA/FAQ/testimonials) and reiterates using only Champagne-restored variants. 【F:docs/manus-atlas/v1/Integration_Roadmap.md†L8-L200】
- **Assets_Register.json & Manus_Section_Catalog.json:** JSON listings of assets and section IDs/statuses feeding Atlas references (align with the hero manifest and component IDs noted above). 【F:docs/manus-atlas/v1/Manus_Design_Atlas_v1.md†L16-L68】
- **Intake_Batch_Summary.md:** Summarises imported batches (home hero/tech strip, composite phases, technology hero) and flags areas requiring reskinning. 【F:docs/manus-atlas/v1/Manus_Design_Atlas_v1.md†L71-L133】
- **Relationship to code:** Atlas asserts the ChampagneHero as canonical (matching `components/home/ChampagneHero.tsx` + `styles/champagne/hero.css`) and sets expectations for cards/CTA/FAQ/testimonials that align with existing section components in `components/sections` and preview canvases.

## 5. Hero Freeze / Gilded / Guards
- **Canonical freeze assets:** `scripts/hero-freeze.hashes.json` hashes wave/particles/film-grain WEBPs/WEBMs plus derived film-grain/wave SVG to enforce immutable hero visuals. 【F:scripts/hero-freeze.hashes.json†L2-L28】
- **Guard enforcement:** `scripts/guard-hero-freeze.mjs` (invoked via `pnpm run guard:hero`) compares current assets against the baseline; `docs/hero-freeze.md` details the update flow. 【F:docs/hero-freeze.md†L1-L9】
- **Sacred routes:** `docs/Blueprint.md` labels `/` and `/champagne/hero` as frozen hero surfaces, directing changes into preview sandboxes. 【F:docs/Blueprint.md†L72-L111】
- **Gilded experiment:** `/preview/hero-gilded` page adds veil/gold-boost toggles and PRM-aware motion pausing, indicating an experimental variant separate from the locked hero. 【F:app/preview/hero-gilded/page.tsx†L1-L143】
- **Hero manifest canon:** `styles/champagne/manifest.json` & `docs/Brand_Canon_Packet/manifest.styles.champagne.json` serve as sacred definitions for layer order/opacities/assets. 【F:styles/champagne/manifest.json†L2-L118】

## 6. Guards & Automation
- **Brand/hero/hue guards:** Package scripts include `brand:guard`, `verify:hue`, and `guard:hero`, with guard inventory captured in `Guards_Audit_Report.md`. 【F:Guards_Audit_Report.md†L3-L42】
- **Additional QA guards:** Preview-only, rogue-hex, asset-size, manifest-sync, and sacred-route guards are enumerated in the audit report, indicating coverage for tokens, routes, and binary integrity. 【F:Guards_Audit_Report.md†L33-L42】
- **Hero freeze workflow:** Baseline hashes and `guard-hero-freeze.mjs` protect the Champagne hero assets from drift; updates require rehashing via documented steps. 【F:scripts/hero-freeze.hashes.json†L2-L28】【F:docs/hero-freeze.md†L1-L9】

## 7. Design State Summary (for Director AI)
- The canonical Champagne tokens and gradient law live in `styles/tokens/smh-champagne-tokens.css`; hero layering is codified in `styles/champagne/manifest.json` and implemented by `styles/champagne/hero.css` + `components/home/ChampagneHero.tsx`. 【F:styles/tokens/smh-champagne-tokens.css†L2-L78】【F:styles/champagne/manifest.json†L2-L118】【F:styles/champagne/hero.css†L4-L118】【F:components/home/ChampagneHero.tsx†L5-L70】
- Hero freeze is enforced via hash baselines and guards; `/` and `/champagne/hero` are treated as sacred, with experimentation limited to `/preview/*` (notably `/preview/hero-gilded`). 【F:scripts/hero-freeze.hashes.json†L2-L28】【F:docs/Blueprint.md†L72-L111】【F:app/preview/hero-gilded/page.tsx†L1-L143】
- Cards/CTA/FAQ/testimonial guidance now comes from Manus Atlas v1 (Integration Roadmap + Atlas page index), which expects Champagne-restored versions; these align with existing section components used in preview canvases. 【F:docs/manus-atlas/v1/Integration_Roadmap.md†L61-L200】【F:docs/manus-atlas/v1/Manus_Design_Atlas_v1.md†L71-L200】
- Legacy canon docs (Brand_Canon_Packet, Blueprint, hero-freeze guide, guard audits) remain authoritative for gradient law, gold limits, and guard workflows; they pre-date Atlas but do not conflict—Atlas largely reinforces them. 【F:docs/Brand_Canon_Packet/Brand_Canon_README.md†L1-L19】【F:docs/Blueprint.md†L72-L131】【F:docs/hero-freeze.md†L1-L9】【F:Guards_Audit_Report.md†L3-L42】
- Biggest risk of off-brand change is mutating hero assets or tokens outside guard processes; safest work occurs in preview routes and doc updates while respecting guard baselines. 【F:docs/Blueprint.md†L72-L111】【F:docs/hero-freeze.md†L1-L9】【F:app/preview/home/page.tsx†L1-L78】
