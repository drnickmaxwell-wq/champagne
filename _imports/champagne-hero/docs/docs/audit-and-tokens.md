# Manus Luxury Hero – Audit & Tokens

## New / Updated Tokens
- `--champ-start`, `--champ-mid`, `--champ-end` – define the champagne gradient sweep applied to the hero and Smile Journey backdrops.
- `--wave-ink`, `--wave-ink-soft` – soft navy overlays used for wave masks on both sections.
- `--fx-wave-opacity`, `--fx-grain-opacity` – opacity controls for decorative layers.
- `--glass-bg`, `--glass-border`, `--glass-inner-ring`, `--glass-blur` – glassmorphism stack referenced by the hero pane, Smile Journey cards, and callout.
- `--shadow-glass`, `--glow-edge` – drop shadow and glow for elevated glass surfaces.
- `--motion-duration-fast`, `--motion-duration-normal`, `--motion-duration-slow`, `--motion-easing-smooth` – motion curves for CTA and card micro-interactions (overridden to 0ms when users prefer reduced motion).
- `--ink`, `--ink-strong`, `--ink-on-glass`, `--body-on-glass` – typography contrast tokens for glass surfaces and overlays.

## Implementation Notes
- **HeroLuxury.tsx** now renders a full-bleed `<section data-hero="champagne">` with gradient, wave, and film grain layers built entirely from tokens. The inner glass pane uses the updated glass tokens, including an inner gold ring and ink veil to maintain WCAG AA contrast.
- **SmileJourney.tsx** inherits the same backdrop tokens for visual continuity, applies the shared glass stack to each card, and reuses the gold ring treatment with hover/focus opacity shifts. Focus states reference the new glass inner ring token for accessibility.
- **Global layout** keeps the footer untouched while ensuring the homepage renders only `HeroLuxury` and `SmileJourney`.
