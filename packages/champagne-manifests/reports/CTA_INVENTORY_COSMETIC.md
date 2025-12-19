# CTA Inventory — Cosmetic Treatment Pages

Report scope: /treatments/composite-bonding, /treatments/veneers, /treatments/smile-makeover, /treatments/digital-smile-design. Also reviewed treatment hub cards linking to these destinations.

## /treatments/composite-bonding
* **Route status:** Manifest present as `/treatments/composite-bonding` under `composite_bonding` page.
* **CTA source:** Section-level CTA block in page manifest (no presets or fallbacks).
* **CTA instances:**
  1) `instanceId`: `composite_next_steps` · `componentId`: `treatment_closing_cta` (type) · `variantId`: _not specified_.
     * Primary: “Cosmetic Assessment” → `/contact`
     * Secondary: “Veneers” → `/treatments/veneers`
     * Secondary: “Teeth whitening” → `/treatments/teeth-whitening`
     * Secondary: “Clear aligners” → `/treatments/clear-aligners`
* **Notes:** CTA set points to contact and related cosmetic/adjacent treatments; no preset/fallback usage observed. Only one CTA block on the page.

## /treatments/veneers
* **Route status:** Manifest present.
* **CTA source:** Section-level CTAs supplied in section data (no presets or fallbacks).
* **CTA instances (order of appearance):**
  1) `instanceId`: `veneers-hero-intro` · `componentId`: `treatment.heroIntro` · `variantId`: `shoreham_veneers_intro`
     * Primary: “Book a veneers consultation” → `/contact`
     * Secondary: “Ask about composite vs porcelain” → `/contact?topic=veneers`
  2) `instanceId`: `veneers-cta` · `componentId`: `treatment.cta` · `variantId`: `shoreham_veneers_cta`
     * Primary: “Veneer Consultation & Smile Design” → `/contact`
     * Secondary: “Explore alternative cosmetic options” → `/treatments/full-smile-makeover`
* **Notes:** Both CTAs route to contact or full-smile-makeover; no duplicates beyond contact emphasis.

## /treatments/smile-makeover
* **Route status:** Missing route. No manifest located for `/treatments/smile-makeover`; closest available page is `/treatments/full-smile-makeover` (see below).
* **CTA inventory:** Not applicable (route absent).

### Related: /treatments/full-smile-makeover
* **CTA source:** Section-level CTA block in page manifest (no presets or fallbacks).
* **CTA instances:**
  1) `instanceId`: `full_smile_makeover_closing_cta` · `componentId`: `treatment_closing_cta` (type) · `variantId`: _not specified_.
     * Primary: “Book a planning session” → `/contact`
     * Secondary: “Preview the roadmap” → `/treatments/digital-smile-design`
* **Notes:** Only CTA set on the page. Routing mixes contact and digital-smile-design.

## /treatments/digital-smile-design
* **Route status:** Manifest present.
* **CTA source:** Section-level CTAs supplied in section data (no presets or fallbacks).
* **CTA instances (order of appearance):**
  1) `instanceId`: `dsd-hero` · `componentId`: `treatment.heroIntro` · `variantId`: `smh_dsd_hero`
     * Primary: “Book a digital design consult” → `/contact?topic=digital-dentistry`
     * Secondary: “Ask about smile previews” → `/contact?topic=3d-printing`
  2) `instanceId`: `dsd-cta` · `componentId`: `treatment.cta` · `variantId`: `smh_dsd_cta`
     * Primary: “Book a design session” → `/contact?topic=digital-dentistry`
     * Secondary: “Ask about mock-ups” → `/contact?topic=3d-printing`
* **Notes:** Hero and closing CTAs share the same destinations; all CTAs go to contact form topics.

## Treatment Hub (/treatments)
* **Route status:** No manifest entry found for `/treatments`; unable to locate hub cards within current data.
* **CTA/card links to cosmetic pages:** None observed due to missing route definition.
* **Notes:** If a hub page exists elsewhere, its CTAs/cards are not represented in `champagne_machine_manifest_full.json` or section data.
