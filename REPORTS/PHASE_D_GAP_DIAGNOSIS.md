# Phase D Gap Diagnosis (Step A)

## Existing target pages
- **/treatments/veneers**
  - The stack repeats `treatment.consultationOverview` twice, which reduces space for staged guidance and implies content duplication before mid-page CTAs.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L907-L918】
  - Closing CTAs cover consultation and related veneer planning but omit reassurance or finance/aftercare destinations, so decision-support is limited to treatment comparisons.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L869-L888】

- **/treatments/composite-bonding**
  - Core CTA surfaces exist, but the closing CTA set focuses on consultation and adjacent treatments without any maintenance/aftercare reassurance call-to-action, leaving longevity questions to the FAQ only.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L2761-L2796】

- **/treatments/implants**
  - Closing CTAs encourage booking and choosing implant scope but do not surface finance, sedation, or aftercare links, so patients lack a reassurance path near the page end.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L869-L888】

## Missing target slugs
- **/treatments/wear** – missing slug (closest runtime route is `/treatments/tooth-wear-broken-teeth`).【6fd07f†L22-L91】
- **/treatments/emergency-dentist** – missing slug (runtime emergency routes are `/treatments/emergency-dentistry` and `/treatments/emergency-dental-appointments`).【6fd07f†L22-L91】
