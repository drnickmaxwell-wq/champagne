# Hero V3 Technical Architecture V1

**Status:** `APPROVED_ARCHITECTURE_PHASE_GATED`

**Current implementation ceiling:** `H3_1_DIAGNOSTIC_ONLY`

## Architectural intent

Hero V3 is a tenant-neutral composition and approval system that can reuse
proven rendering capabilities without embedding Champagne's identity in the
engine. Champagne is the demanding reference tenant, not the engine default.

## Mandatory abstraction contract

```text
ENGINE
  + TENANT_BRAND_PROFILE
  + HERO_GRAMMAR
  + HERO_INSTANCE
  -> VERSIONED_APPROVED_RENDER
```

### `ENGINE`

Owns neutral capabilities: validated composition, deterministic rendering,
layer orchestration, responsive art direction, progressive enhancement,
motion-score execution, accessibility, observability, performance enforcement,
versioning and safe failure.

It must not own Champagne palette, waves, St Mary's motifs, typography choices,
assets or motion temperament.

### `TENANT_BRAND_PROFILE`

Owns tenant-authorised design inputs and prohibitions: palette roles,
typography, motif vocabulary, material/surface character, imagery policy,
motion temperament, accessibility constraints, protected signatures and
anti-patterns. Profiles are versioned and independently approved.

### `HERO_GRAMMAR`

Owns reusable page-intent composition rules within one tenant: focal regions,
depth planes, media participation, content geometry, action hierarchy,
responsive recompositions, layer eligibility and motion-score references. A
grammar is not a page title swap and may not smuggle tenant styling into the
engine.

### `HERO_INSTANCE`

Owns one page-specific, content-authority-bound configuration: grammar and brand
profile versions, governed content references, media records, focal values,
approved preset, responsive overrides and approval state. It cannot invent
practice, clinical, fee, availability, booking or patient facts.

## Supporting contracts

- `ResponsiveArtDirection`: separately authored desktop, tablet and mobile
  composition values; mobile is not a squeezed desktop default.
- `MotionScore`: tenant-neutral phases, relationships, amplitude, speed, easing,
  colour-role participation, attention limits, reading/rest state and
  reduced-motion interpretation.
- `AssetRecord`: stable identity, origin, rights, dimensions, encoding, colour
  profile, crop/focal rules, derivatives and fallback.
- `ApprovalRecord`: immutable proposal identity, Founder/tenant decision,
  engine/profile/grammar/instance versions and `productionBinding` state.
- `VersionMigration`: explicit compatibility and migration rules preventing an
  engine update from silently changing an approved Hero.

## Rendering pipeline

1. Resolve and validate engine, brand profile, grammar and instance versions.
2. Fail closed on missing, malformed, incompatible or brand-leaking input.
3. Resolve authorised assets and content references.
4. Build the deterministic static master composition.
5. Apply separately authored responsive composition.
6. Produce a meaningful static first paint.
7. Select a bounded progressive-enhancement tier from capability and user
   preference, never from brand assumptions.
8. Apply the validated motion score when motion is permitted.
9. Expose observable layer, timing, performance and approval evidence.

## Progressive enhancement tiers

| Tier | Behaviour |
|---|---|
| T0 | Meaningful deterministic static composition; no script or media required |
| T1 | Static depth, masks and lightweight CSS enhancement |
| T2 | Bounded procedural or media-assisted motion under normal-motion preference |
| T3 | Optional high-capability effects within explicit GPU/network/attention budgets |

Every tier must preserve content, actions and intent. Reduced motion maps to a
designed static/rest interpretation, not to missing content or a broken layer
stack.

## Motion-score contract

The behavioural invariant is `NO_DETECTABLE_COLLECTIVE_RESTART`. The neutral
score controls:

- named phases and transitions;
- layer relationships and offsets;
- amplitude, speed and easing;
- colour-role participation rather than hard-coded colours;
- focal regions and attention ceilings;
- entry, reading/rest and rare-accent behaviour;
- reduced-motion interpretation;
- observability of current phase and timing.

Procedural fields, caustics, particles, highlight travel, media cross-fading or
other techniques remain replaceable implementation options.

## Champagne family strategy

The target taxonomy is Gateway, Implant, Composite/aesthetic, Orthodontic,
Restorative, General/preventive, Nervous/sedation, Emergency,
Digital/educational, Complex rehabilitation, Heritage and Concierge/contact.
H3.5 must first prove roughly four materially different representative
grammars. Expansion requires Founder acceptance of the mechanism.

## Tenant isolation and anti-brand leakage

H3.6 requires at least one organic/botanical and one precise/geometric synthetic
tenant. Automated assertions must demonstrate that they reuse engine,
responsive, motion, accessibility, approval and versioning machinery while not
inheriting Champagne waves, palette, St Mary's motifs, assets, typography or
motion temperament. Any palette-swap resemblance is `TENANT_ENGINE_FAIL`.

## H3.1 diagnostic architecture

H3.1 is an isolated non-production route using the real V2 renderer as a
read-only subject. Diagnostic wrappers may change laboratory presentation and
CSS variables without changing sacred source, manifests, guards, public
routing, production tokens or public Hero behaviour.

The lab records:

- runtime surface identity and resolved asset;
- DOM tag, z-index, opacity, blend, background, mask and crop;
- media duration, current time, ready state, playback rate and event history;
- CSS animation name, duration, delay, iteration and play state;
- remount/node-identity evidence;
- near-boundary and loop event timestamps;
- synchronized distance-to-boundary across motion layers;
- desktop, tablet, mobile and reduced-motion visual evidence.

Controls are explicitly experimental and non-persistent: visibility, opacity,
supported blend override, crop/position, focal position and supported media
phase/timing. Reset restores the exact renderer-derived state.

## Performance and accessibility architecture

- Static first paint is mandatory and must not wait for full enhancement.
- Enhancement must be bounded by explicit network, decode, memory and GPU
  evidence; exact numeric budgets may be refined from H3.1/H3.3 measurements.
- Motion intensity is bounded and must settle into a reading/rest state.
- Reduced motion has a complete, deterministic equivalent.
- Route navigation must preserve the persistent Hero lifecycle and must not
  reset media time.
- Desktop, tablet and mobile are authored compositions.
- Interactive Hero controls must meet keyboard, focus, contrast and target-size
  requirements.
- Approved presets render deterministically from frozen versioned inputs.

## Approval and production binding

Generated or experimental output defaults to `productionBinding: false`.
Approval records are immutable; changes create new versions. Engine upgrades do
not mutate an approved instance. Sacred Hero replacement requires direct,
complete V2-to-V3 Founder comparison and explicit later production authority.
V2 remains the rollback target.
