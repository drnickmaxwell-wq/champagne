# Phase D CTA & Journey Diff Report (Step B)

## /treatments/veneers
- **Mid CTA (section)** now links to Digital Smile Design, 3D printed veneers, and composite bonding for decision support and alternatives.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L926-L940】
- **Closing CTA (section)** keeps the primary consultation CTA plus secondary links to 3D printed veneers and Digital Smile Design; all destinations are internal.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L952-L971】
- **Journey CTA targets** add booking, 3D printed veneer comparison, smile design review, and whitening staging to support planning and reassurance flows.【F:packages/champagne-manifests/data/sections/smh/treatment_journeys.json†L1623-L1639】
- No external links introduced.

## /treatments/composite-bonding
- **Mid CTA (section)** now provides direct links to book, plan whitening, and compare veneers, giving mid-page decision and staging options.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L2719-L2735】
- **Closing CTA (section)** keeps the booking CTA and related whitening, veneer, and aligner links to guide onward choices.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L2773-L2794】
- **Journey CTA targets** now cover booking, injection-moulded composite, veneers, and whitening so CTAs can vary across surfaces.【F:packages/champagne-manifests/data/sections/smh/treatment_journeys.json†L1358-L1374】
- No external links introduced.

## /treatments/implants
- **Mid CTA (section)** now links to contact, single-tooth implants, and dental bridges to compare pathways mid-page.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L843-L859】
- **Closing CTA (section)** keeps booking plus single-tooth and full-arch implant options for late-stage decisions.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L869-L888】
- **Journey CTA targets** now specify booking, consultation detail, single-tooth, full-arch, and bridge comparison routes, adding restorative and alternative paths.【F:packages/champagne-manifests/data/sections/smh/treatment_journeys.json†L2822-L2842】
- No external links introduced.

## Skipped slugs
- `/treatments/wear` and `/treatments/emergency-dentist` are absent from runtime and were not altered.【6fd07f†L22-L91】
