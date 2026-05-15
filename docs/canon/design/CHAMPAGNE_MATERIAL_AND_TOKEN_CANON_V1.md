# CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1

Status: `ACTIVE_DESIGN_CANON`

Scope:

- Champagne website
- Champagne agent / Companion OS UI
- Champagne ops portal
- Champagne patient portal
- Future Dental OS cockpit surfaces
- Future design-token generation and maintenance workflows

---

## 0. Purpose

This canon locks the foundational Champagne material and token philosophy before future automated design, Codex, router, agent, Manus, Stitch, or UI-builder work modifies the design system.

It exists to prevent:

- brand chroma drift,
- duplicated token systems,
- accidental redefinition of the Champagne material palette,
- generic dark-mode substitution,
- and uncontrolled cross-repo visual divergence.

---

## 1. Immutable brand chroma

The Champagne brand chroma tokens are permanent.

The following colour families must not be retuned, hue-shifted, softened, brightened, replaced, or reinterpreted by automated design passes:

- brand magenta
- brand turquoise / teal
- brand gold

These three colours are the recognisable Champagne signature.

They are not mood tokens.

They are not time-of-day tokens.

They are not per-surface preferences.

They are fixed brand identity anchors.

---

## 2. Primary dark material

The primary dark material is not generic ink.

The target material is:

```text
Persian Midnight Velvet Blue
```

This is a deep, luxury, midnight-blue material designed to set off:

- magenta,
- turquoise,
- gold,
- porcelain,
- and layered glass.

It should feel:

- deep,
- quiet,
- expensive,
- cinematic,
- Persian-blue influenced,
- velvet-like,
- and suitable for a luxury clinical technology brand.

It must not collapse into flat black, generic navy, charcoal, or developer-dashboard grey.

---

## 3. Porcelain material

Porcelain is the primary calm and readable light material.

Porcelain should support:

- patient understanding,
- clinical readability,
- treatment information,
- forms,
- cards,
- review panels,
- and accessible long-form reading.

Porcelain should feel:

- warm,
- premium,
- clean,
- dental-adjacent without looking medical-basic,
- and calm against the Persian Midnight Velvet material.

It must not become stark white, hospital white, grey SaaS white, or low-contrast cream.

---

## 4. Champagne gold material

Gold is an accent material, not a background wash.

Gold should be used for:

- keylines,
- rare particles,
- premium accents,
- small highlights,
- selected CTA affordances,
- hierarchy emphasis,
- and cinematic interruptions.

Gold should feel expensive through restraint.

Direction:

```text
not more gold, better gold
```

Gold should not become noisy, brassy, yellow, flat, or overused.

---

## 5. Layered glass material

Glass is a depth material, not generic transparency.

Layered glass should communicate:

- hierarchy,
- depth,
- precision,
- calm luxury,
- and cockpit-like clarity.

Glass must preserve readability.

Glass must not create haze, low contrast, busy panels, or illegible clinical content.

Operational surfaces such as ops portal and patient portal may use calmer, clearer glass than the public cinematic website.

---

## 6. Cinematic hero identity

The layered cinematic hero system is part of Champagne brand DNA.

It may use:

- gradient fields,
- wave geometry,
- caustics,
- glass shimmer,
- film grain,
- gold dust,
- particle drift,
- lighting layers,
- and focal-stage composition.

The cinematic hero system should remain available as a shared optional module.

It must not be automatically applied to every operational screen.

Ops, patient, and cockpit surfaces should inherit the design DNA but use calmer surface variants when readability and workflow focus matter more than spectacle.

---

## 7. Time-of-day rule

Time-of-day variants may adjust atmosphere.

They may alter:

- ambient warmth,
- background depth,
- sheen opacity,
- vignette strength,
- lighting temperature,
- particle visibility,
- glass opacity,
- and cinematic layer intensity.

They must not alter the immutable brand chroma tokens.

The magenta, turquoise/teal, and gold brand chroma must remain stable across time-of-day variants.

---

## 8. Surface-specific semantic themes

All Champagne surfaces should share one design-token DNA.

However, each product surface may define a semantic theme:

- website theme,
- ops portal theme,
- patient portal theme,
- agent / cockpit theme.

These themes may adjust:

- background material usage,
- surface density,
- glass clarity,
- typography scale,
- status colours,
- operational panel hierarchy,
- patient readability,
- and animation restraint.

They must not fork or duplicate primitive brand tokens.

---

## 9. Token architecture direction

The canonical token package should evolve toward explicit shared exports such as:

```text
@champagne/tokens/primitives.css
@champagne/tokens/themes/website.css
@champagne/tokens/themes/ops.css
@champagne/tokens/themes/patient.css
@champagne/tokens/themes/cockpit.css
@champagne/tokens/hero.css
```

Primitive tokens should hold fixed brand and material foundations.

Semantic themes should adapt those primitives to each product surface.

Hero and cinematic layers should remain optional imports.

---

## 10. Forbidden design drift

Future design work must not:

- retune immutable brand magenta,
- retune immutable brand turquoise / teal,
- retune immutable brand gold,
- replace Persian Midnight Velvet with generic ink/black/grey,
- replace porcelain with generic SaaS white,
- copy public website hero CSS blindly into internal operational surfaces,
- fork token files into separate ungoverned repos,
- create duplicate token systems,
- or allow automated design tools to invent new brand primitives without canon approval.

---

## 11. Current known token issue

The exact Persian Midnight Velvet background token still requires final tuning.

This is an active material calibration target.

It should be treated as:

```text
CURRENT_PERSIAN_MIDNIGHT_TOKEN_CALIBRATION_TARGET
```

until the final value family is locked.

The existing website background may be used as current implementation truth, but it is not automatically final material truth unless explicitly canon-locked later.

---

## 12. Future work

Recommended next design-system phase:

```text
CHAMPAGNE_UNIFIED_TOKEN_SYSTEM_V1
```

That phase should:

- audit current token exports,
- align TypeScript token metadata with CSS variables,
- separate primitives from semantic themes,
- make hero/cinematic layers optional,
- add ops/patient/cockpit semantic themes,
- quarantine duplicate token trees,
- and add no-drift guards.

---

## 13. Build discipline

Token work must proceed as small, evidence-backed PRs.

No future PR should simultaneously:

- rewrite token architecture,
- retune brand colours,
- redesign hero surfaces,
- and migrate apps.

Each phase must remain separately reviewable.
