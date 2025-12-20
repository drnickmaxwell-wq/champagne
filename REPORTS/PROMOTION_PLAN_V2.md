# Minimal Promotion Plan (V2)

1. **Import missing SMH treatment layouts into the resolver**
   - Source: `packages/champagne-manifests/data/sections/smh/treatments.{3d-dentistry-and-technology,childrens-dentistry,home-teeth-whitening,periodontal-gum-care,teeth-whitening,teeth-whitening-faqs,whitening-sensitive-teeth,whitening-top-ups}.json`.
   - Target: add imports and include in `champagneSectionLayouts` within `packages/champagne-manifests/src/core.ts`.
   - Why: ensures planned whitening/periodontal/children/3D dentistry pages use authored layouts instead of falling back to inline/default stacks.
   - Risks/guards: keep ordering consistent; rerun `pnpm run guard:rogue-hex`, `pnpm run guard:canon`, `pnpm run verify`.

2. **Render patient portal CTA band as real CTAs**
   - Source: `packages/champagne-manifests/data/champagne_machine_manifest_full.json` (`patient_portal_cta_band`).
   - Target: update the section type to a CTA-aware component (e.g., `treatment_closing_cta` with CTA list) or extend `SectionRegistry` to treat `cta` as a CTA-rendering kind.
   - Why: current `cta` type falls back to plain text, leaving patient portal without actionable links despite manifest CTAs.
   - Risks/guards: avoid introducing new colour literals; verify CTA targets remain canonical (no `/book`).

3. **Add on-page reviews to the treatments hub**
   - Source: `treatments_hub_reviews` block in `packages/champagne-manifests/data/champagne_machine_manifest_full.json`.
   - Target: convert to `google_reviews` (or inject CTA-backed review component) to surface authority signals directly on the hub.
   - Why: SEO checklist calls for authority/review signals; currently only references home reviews without rendering any.
   - Risks/guards: ensure review content uses existing tokenised styles; re-run guards after manifest edit.
