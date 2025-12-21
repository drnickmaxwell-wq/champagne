# CTA Surface Expansion Plan (Treatment Pages)

## Current CTA Rendering Surfaces
- **Mid-page CTA components**: `packages/champagne-sections/src/Section_TreatmentMidCTA.tsx` renders treatment mid CTAs from the section stack; optional inline `ChampagneCTAGroup` insertion comes from `ChampagneSectionRenderer` when `midPageCTAs` are provided.
- **Closing CTA component**: `packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx` renders closing CTAs at the end of treatment stacks. `ChampagneSectionRenderer` passes `footerCTAs` into this component when the manifest includes a closing CTA slot.

## Current Visible CTA Capacity
- **Section_TreatmentMidCTA**: collects section + journey + fallback links, dedupes, and slices to the first **4** CTAs before rendering.
- **Inline mid-page CTAGroup**: when `midPageCTAs` are provided, the renderer inserts the entire list mid-stack; no explicit cap beyond supplied length.
- **Section_TreatmentClosingCTA**: resolves whichever CTA list wins priority without an explicit cap; typical fallbacks render **2** CTAs, while journey-driven `cta_targets` can surface up to **3** slots (primary, secondary, tertiary).

## Current CTA Selection Order
- **Mid CTAs**
  1. Section-defined CTAs (with preserved variants when provided)
  2. Journey-derived CTAs (mid-page CTA, related treatments, and secondary/tertiary journey targets)
  3. Keyword-driven fallback treatment links (ensuring internal, valid slugs)
  4. Deduplication by href, then limited to 4 via `resolveCTAList`
- **Closing CTAs**
  1. `footerCTAs` passed from the page-level CTA slots
  2. Section-defined CTAs in the closing CTA section
  3. Journey-derived CTAs (`cta_targets` or late-page intent plan mapped via intent config/labels)
  4. Fallback registry CTAs (book consultation + AI preview, or preventative check-up variant)

## Proposed Minimal Expansion Approach
- **Manifest-first sourcing**: keep existing priority order but widen the surface by allowing both explicit section CTAs and journey/intent-derived CTAs to co-exist (instead of short-circuiting after the first available set) while still respecting `resolveCTAList` semantics.
- **Mid-page surface**: surface up to 3–4 actions by pairing one primary/high-intent CTA with two related secondary options and an optional tertiary text-link row (e.g., related treatments). Use journey `related_treatments`, `cta_targets`, and intent labels before falling back to current keyword defaults.
- **Closing surface**: ensure closing CTA exposes a primary plus 2–3 supporting actions drawn from the journey (finance, gallery, alternatives, emergency) with validation against known treatment paths to avoid dead links.
- **Safety rails**: keep routing untouched, reuse existing variants/tokens, validate hrefs against runtime treatment paths, and continue to use manifest-provided labels/intents to stay UK-compliant.
