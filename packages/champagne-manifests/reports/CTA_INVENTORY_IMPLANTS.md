# CTA Inventory — Implant Treatment Pages

_Report scope: manifest-defined CTAs and clickable treatment cards for implant pages._

## /treatments/implants (routeId: treatments.implants)
- **CTA instances (section-level):**
  1) `implants-cta` · component `treatment.cta` · variant `shoreham_implants_cta` (footer)
     - Primary: “Book an Implant Consultation & Planning” → `/contact`
     - Secondary: “Ask a question” → `/contact?topic=implants`

- **Notes:** Section-supplied CTAs only; both drive to contact rather than a dedicated implant-flow step.【F:packages/champagne-manifests/data/sections/smh/treatments.implants.json†L193-L205】

## /treatments/single-tooth-implant (routeId: treatments.implants-single-tooth)
- **CTA instances (section-level):**
  1) `single-implant-cta` · component `treatment.cta` · variant `shoreham_single_implant_cta` (footer)
     - Primary: “Book a single-implant consult” → `/contact`
     - Secondary: “Ask about single implants” → `/contact?topic=implants`

- **Notes:** Section-supplied; both CTAs route to contact forms.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-single-tooth.json†L141-L152】

## /treatments/multiple-teeth-implants (routeId: treatments.implants-multiple-teeth)
- **CTA instances (section-level):**
  1) `multi-implant-cta` · component `treatment.cta` · variant `shoreham_multi_implant_cta` (footer)
     - Primary: “Book a multi-implant consult” → `/contact`
     - Secondary: “Ask about implant bridges” → `/contact?topic=implants`

- **Notes:** Section-supplied; both CTAs route to contact forms.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-multiple-teeth.json†L142-L153】

## /treatments/all-on-4
- **Status:** Missing route/manifest entry for this slug (no page defined in the machine manifest or section manifests).

## /treatments/implant-retained-dentures (routeId: treatments.implant-retained-dentures)
- **CTA instances (section-level):**
  1) `implant-retained-hero-intro` · component `treatment.heroIntro` · variant `shoreham_implant_retained_intro` (hero)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Ask about implant-retained dentures” → `/contact?topic=implants`
  2) `implant-retained-cta` · component `treatment.cta` · variant `shoreham_implant_retained_cta` (footer)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Explore implant options” → `/treatments/implants`

- **Notes:** Hero and footer CTAs compete for attention but align on assessment. Footer introduces cross-link back to the main implants page.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json†L157-L168】

## /treatments/teeth-in-a-day (routeId: treatments.teeth-in-a-day)
- **CTA instances (section-level):**
  1) `teeth-in-a-day-hero-intro` · component `treatment.heroIntro` · variant `shoreham_teeth_in_a_day_intro` (hero)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Ask if I qualify for Teeth-in-a-Day” → `/contact?topic=implants`
  2) `teeth-in-a-day-cta` · component `treatment.cta` · variant `shoreham_teeth_in_a_day_cta` (footer)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Explore implant options” → `/treatments/implants`

- **Notes:** Hero/footer CTAs overlap; both default to the generic contact endpoint rather than a specific same-day pathway.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-teeth-in-a-day.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-teeth-in-a-day.json†L159-L169】

## /treatments/implant-consultation (routeId: treatments.implant-consultation)
- **CTA instances (section-level):**
  1) `implant-consultation-hero-intro` · component `treatment.heroIntro` · variant `shoreham_implant_consultation_intro` (hero)
     - Primary: “Book an implant consultation” → `/contact`
     - Secondary: “Ask a question first” → `/contact?topic=implants`
  2) `implant-consultation-cta` · component `treatment.cta` · variant `shoreham_implant_consultation_cta` (footer)
     - Primary: “Book an implant consultation” → `/contact`
     - Secondary: “Explore implant treatments” → `/treatments/implants`

- **Notes:** Both CTAs align on booking the consultation; secondary footer CTA loops back to the general implants page.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-consultation.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-consultation.json†L173-L184】

## /treatments/implant-aftercare (routeId: treatments.implant-aftercare)
- **CTA instances (section-level):**
  1) `implants-aftercare-hero-intro` · component `treatment.heroIntro` · variant `shoreham_implants_aftercare_intro` (hero)
     - Primary: “Book an implant consultation” → `/contact`
     - Secondary: “Explore implant options” → `/treatments/implants`
  2) `implants-aftercare-cta` · component `treatment.cta` · variant `shoreham_implants_aftercare_cta` (footer)
     - Primary: “Book a consultation” → `/contact`
     - Secondary: “See implant consultation details” → `/treatments/implant-consultation`

- **Notes:** CTA paths mix aftercare guidance with new-treatment entry points; both hero/footer rely on contact/consultation rather than post-op support flows.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json†L170-L181】

## /treatments/failed-implant-replacement (routeId: treatments.failed-implant-replacement)
- **CTA instances (section-level):**
  1) `failed-implant-hero-intro` · component `treatment.heroIntro` · variant `shoreham_failed_implant_intro` (hero)
     - Primary: “Book an implant review” → `/contact`
     - Secondary: “Ask about failed implant options” → `/contact?topic=implants`
  2) `failed-implant-cta` · component `treatment.cta` · variant `shoreham_failed_implant_cta` (footer)
     - Primary: “Book now” → `/contact`
     - Secondary: “See implant consultation details” → `/treatments/implant-consultation`

- **Notes:** All CTAs funnel to contact/consultation; no direct aftercare triage. Footer cross-links to consultation, which may bypass necessary diagnostic steps after failure.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json†L164-L175】

## /treatments/sinus-lift (routeId: treatments.sinus-lift)
- **CTA instances (section-level):**
  1) `sinus-lift-hero-intro` · component `treatment.heroIntro` · variant `shoreham_implant_sinus_lift_intro` (hero)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Ask about sinus lift suitability” → `/contact?topic=implants`
  2) `sinus-lift-cta` · component `treatment.cta` · variant `shoreham_implant_sinus_lift_cta` (footer)
     - Primary: “Book an implant assessment” → `/contact`
     - Secondary: “Implant consultation” → `/treatments/implant-consultation`

- **Notes:** Hero/footer CTAs both default to contact/consultation; no intra-page navigation to sinus-specific content.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-sinus-lift.json†L8-L25】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-sinus-lift.json†L158-L169】

## /treatments/all-on-4 equivalents (routeId: treatments.implants-full-arch)
- **CTA instances (section-level):**
  1) `full-arch-hero-intro` · component `treatment.heroIntro` · variant `shoreham_full_arch_intro` (hero)
     - Primary: “Book a full-arch consultation” → `/contact`
     - Secondary: “Speak to the implant team” → `/contact?topic=implants`
  2) `full-arch-cta` · component `treatment.cta` · variant `shoreham_full_arch_cta` (footer)
     - Primary: “Book consultation” → `/contact`
     - Secondary: “Discuss implant options” → `/contact?topic=implants`

- **Notes:** Serves as the closest match for All-on-4/All-on-6; both CTAs route to contact forms without a distinct full-arch pathway.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-full-arch.json†L8-L24】【F:packages/champagne-manifests/data/sections/smh/treatments.implants-full-arch.json†L159-L171】

## Cross-page implant CTA links
- Several footer secondary CTAs loop back to the general implants hub (`/treatments/implants`) or the consultation page, creating circular navigation rather than forward progression:
  - Implant-retained dentures footer → `/treatments/implants`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json†L157-L168】
  - Teeth-in-a-day footer → `/treatments/implants`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-teeth-in-a-day.json†L159-L169】
  - Implant consultation footer → `/treatments/implants`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-consultation.json†L173-L184】
  - Implant aftercare footer → `/treatments/implant-consultation`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json†L170-L181】
  - Failed implant replacement footer → `/treatments/implant-consultation`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json†L164-L175】
  - Sinus lift footer → `/treatments/implant-consultation`.【F:packages/champagne-manifests/data/sections/smh/treatments.implants-sinus-lift.json†L158-L169】

## Treatment hub (/treatments) cards pointing to implant pages
- Cards auto-generated from the machine manifest; each card links to `treatment.path` with label `treatment.label` inside the treatments listing component.【F:apps/web/app/treatments/page.tsx†L69-L139】
- Implant-related card destinations and labels (manifest sources):
  - “Dental Implants in Shoreham-by-Sea” → `/treatments/implants`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L122-L158】
  - “Single-tooth dental implants in Shoreham-by-Sea” → `/treatments/implants-single-tooth`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L595-L631】
  - “Multiple teeth implant options” → `/treatments/implants-multiple-teeth`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L632-L668】
  - “Full arch implant rehabilitation” → `/treatments/implants-full-arch`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L669-L705】
  - “Implant-retained dentures” → `/treatments/implant-retained-dentures`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L706-L740】
  - “Implant consultation & planning in Shoreham-by-Sea” → `/treatments/implant-consultation`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L706-L777】
  - “Teeth-in-a-Day implants in Shoreham-by-Sea” → `/treatments/teeth-in-a-day`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L817-L889】
  - “Failed implant replacement in Shoreham-by-Sea” → `/treatments/failed-implant-replacement`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L928-L962】
  - “Implant aftercare & recovery in Shoreham-by-Sea” → `/treatments/implant-aftercare`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L965-L1000】
  - “Sinus lift for dental implants in Shoreham-by-Sea” → `/treatments/sinus-lift`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L817-L852】

- **Notes:** Treatment hub cards inherit the same contact-heavy journey; no dedicated consultation or booking differentiator is exposed at the card level.
