# Champagne Preview Fix Audit v4

## Hero Before / After
- **Before:** Preview heroes carried extra dusk weight and softer waves, so the canonical gradient and wave arc read flatter than the live home hero.
- **After:** Heroes now sit solely on the canonical magenta→teal→gold gradient with the `/brand/waves-bg-1920.webp` texture at high visibility (plus subtle motion gating) and a brighter smoked-white glass card with stronger lift to mirror the home hero feel.

## Cards Before / After
- **Before:** Page chrome and preview cards skewed toward dark ink slabs with thin gradient keylines and subdued text legibility.
- **After:** Page ink is lifted to a charcoal mix, while cards, FAQs, and link tiles use lighter smoked-glass fills and clearer text, reserving the canonical gradient for 1–2px borders and accents to keep hierarchy bright and readable.

## Compliance
- Tokens remain untouched and no new hex values were introduced; all colour uses existing tokens and the canonical gradient string.
- Guard suite remains green in local runs (`guard-rogue-hex`, `brand:guard`, `guard:hero`), with preview-only guard unchanged in behavior.
