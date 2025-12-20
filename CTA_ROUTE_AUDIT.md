# CTA Route Audit

## Safety checks
- CTA registry actively blocks `/book` as a target (throws in non-production, rewrites to `/contact` in production). No manifest CTA references `/book`, and the sanitizer enforces the rule at runtime.【F:packages/champagne-cta/src/CTARegistry.ts†L3-L104】

## Canonical CTA definitions
- `book-consultation` → `/contact` (primary)
- `video-consultation-portal` → `/patient-portal?intent=video` (primary)
- `portal-finance` → `/patient-portal?intent=finance` (primary)
- `portal-upload` → `/patient-portal?intent=upload` (secondary)
- `portal-login` → `/patient-portal?intent=login` (secondary)
- `practice-plan` → `/practice-plan` (secondary)
- `ai-smile-preview` → `/treatments/digital-smile-design` (secondary)
- `view-treatments` → `/treatments` (secondary)
These are sourced from the CTA registry and reused across manifests.【F:packages/champagne-cta/src/CTARegistry.ts†L13-L61】

## Page-level CTA destinations
- **Home**: hero CTAs link to `/contact`, `/treatments`, and `/treatments/nervous-patients`; mid-page CTAs link to `/patient-portal?intent=video`, `/practice-plan`, `/patient-portal?intent=login`; footer CTA to `/contact`; closing CTA section repeats `/contact` and `/treatments`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L13-L35】【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L224-L239】
- **Contact**: CTA section points to `/patient-portal` and `/contact`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L512-L525】
- **Patient portal**: CTA band references registry IDs `portal-login` and `portal-upload` plus `/contact`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L604-L616】
- **Practice plan**: hero/footer CTAs go to `/contact?topic=practice-plan` and `/dental-checkups-oral-cancer-screening`; closing CTA repeats the same.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L785-L846】
- **Video consultation**: hero/footer CTAs use `video-consultation-portal` and `/treatments/emergency-dentistry`; CTA section repeats those destinations.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L629-L701】
- **Finance**: hero/footer CTAs use `portal-finance` and `/treatments/implants`; CTA section repeats those destinations.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L713-L773】
- **Treatments leaf pages**: CTA destinations are pulled from registry slots via `resolveCTAList` in `ChampagnePageBuilder`; defaults resolve to registry mappings (no `/book` present).【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L135-L195】【F:packages/champagne-cta/src/CTARegistry.ts†L13-L147】
