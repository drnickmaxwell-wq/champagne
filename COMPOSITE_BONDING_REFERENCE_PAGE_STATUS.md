# COMPOSITE_BONDING_REFERENCE_PAGE_STATUS

Mode: `READ_ONLY_REFERENCE_PAGE_STATUS_AUDIT`  
Evidence date: 2026-06-05

## Verdict

Composite Bonding still exists and remains the strongest recovered Champagne design-flow reference by documentation lineage, but the current active page should be treated as `REFERENCE_PAGE_ZERO_CANDIDATE_REQUIRES_DEEPER_RUNTIME_AUDIT`, not an already-proven visual gold standard.

## Existence and route/path

- Active manifest route: `/treatments/composite-bonding`.
- Active manifest ID: `composite_bonding`.
- Active hero binding in the machine manifest: `treatment_neutral_hero_v1`.
- Active section-source file: `packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json`.
- Active Next route: `apps/web/app/treatments/[slug]/page.tsx`, which resolves `/treatments/${slug}`, redirects aliases, emits treatment JSON-LD, and renders `ChampagnePageBuilder`.

## Current structure from active repository data

The active Composite Bonding section stack contains 12 sections in this order:

1. `composite_intro` — treatment overview rich — `Composite bonding for measured smile refinement`
2. `composite_benefits` — features — `Conservative improvements, well planned`
3. `composite_limits` — treatment media feature — `What composite bonding can and can’t do`
4. `composite_guided` — treatment overview rich — `Digitally planned and guided bonding`
5. `composite_injection` — features — `Injection moulding technique`
6. `composite_options` — features — `How composite bonding fits with other options`
7. `composite_maintenance` — features — `Longevity & maintenance`
8. `composite_not_best` — features — `When bonding isn’t the best choice`
9. `composite_mid_cta` — treatment mid CTA — `Before you choose composite bonding`
10. `composite_faq` — treatment FAQ block — `Composite bonding FAQs`
11. `composite_candidates` — features — `Who composite bonding suits best`
12. `composite_next_steps` — treatment closing CTA — `Book a Cosmetic Assessment`

## Match against recovered design-flow principles

### Evidence that supports Composite Bonding as the recovered reference

- `Manus_Design_Atlas_v1.md` calls the Composite Bonding page “Your Rosetta Stone page”.
- The Atlas marks `CB_HERO_FINAL`, `CB_TABS_OVERVIEW_V1`, `CB_AI_TOOLS_TRIO`, clinician quote, FAQ, testimonials, and CTA patterns as Champagne-ready design material.
- The Atlas states Composite Bonding Polished Page Phase 1B is the master spacing reference.
- `Manus_Section_Catalog.json` maps Composite Bonding variants to restored hero/body/CTA/FAQ/testimonial archetypes.

### Evidence that weakens immediate “gold standard” status

- The active page is no longer a static recovered Manus page; it is rendered through `ChampagnePageBuilder` and section manifests.
- The current active hero binding is a generic treatment hero (`treatment_neutral_hero_v1`), not the recovered `CB_HERO_FINAL` label from the Atlas.
- The active section stack does not obviously include the recovered tabbed overview/AI tools trio as named Manus component IDs; it uses current section component IDs such as `treatment_overview_rich`, `features`, `treatment_media_feature`, `treatment_faq_block`, and CTA components.
- No screenshot/runtime visual inspection was performed in this mission; therefore visual parity with Phase 1B cannot be proven here.

## Should it remain Reference Page Zero?

Recommended status: `YES_AS_REFERENCE_PAGE_ZERO_CANDIDATE_WITH_AUDIT_GATE`.

Composite Bonding should remain the first page audited for Champagne design-flow because the recovered authorities repeatedly identify it as the canonical spacing/design-pattern source. However, future agents must distinguish:

- `Recovered Reference`: Manus/Atlas Composite Bonding Phase 1B design flow.
- `Active Runtime Page`: `/treatments/composite-bonding` via machine manifest + section manifest + ChampagnePageBuilder.

The page should not be used as a final visual acceptance baseline until a deeper follow-up audit verifies runtime DOM, hero binding, section components, surface tokens, typography, responsive layout, and screenshots against the recovered Phase 1B design-flow principles.

## Deeper follow-up audit needed

Yes. Recommended mission: `COMPOSITE_BONDING_REFERENCE_PAGE_ZERO_RUNTIME_AUDIT`.

Minimum scope:

1. Start the web app with guard-visible environment noted.
2. Capture `/treatments/composite-bonding` desktop and mobile screenshots.
3. Record active hero engine, hero preset/variant, and first-paint surface state.
4. Export DOM structure and section component mapping.
5. Compare runtime structure to Atlas Phase 1B principles: hero stack, spacing rhythm, tab/overview flow, card cadence, FAQ pattern, CTA terminal flow.
6. Report whether active runtime should be promoted to `Reference Page Zero` or whether the recovered design needs assimilation before visual baseline use.

## Safe conclusion

Composite Bonding remains the best reference-treatment candidate by recovered authority evidence. It is not safe to assume the current active page fully matches the recovered reference without a runtime/screenshot audit.
