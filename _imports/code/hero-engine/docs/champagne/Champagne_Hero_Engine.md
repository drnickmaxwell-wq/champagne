[Champagne_Hero_Engine.md](https://github.com/user-attachments/files/24034828/Champagne_Hero_Engine.md)
# Champagne Hero Engine

`ChampagneHeroFrame` renders the layered Champagne hero surface (gradient, wave mask, caustics, particles, dust, grain) with configurable visual variants while preserving the sacred homepage layout.

## API

```tsx
import { ChampagneHeroFrame, type ChampagneHeroVariant } from "@/components/preview/champagne/ChampagneHeroFrame";

<ChampagneHeroFrame
  variant="home"
  titleId="home-hero-title"
  contentClassName="custom-content"
>
  {/** Place hero heading, copy, and CTAs here */}
</ChampagneHeroFrame>
```

- `variant`: optional `ChampagneHeroVariant` key (defaults to `home`).
- `titleId`: forwarded to `aria-labelledby` on the hero section for accessibility.
- `contentClassName`: appends to the default `hero-content-wrapper` class for layout tuning.

## Current variants

- `home`: canonical preview homepage hero with core Champagne gradient, wave mask, soft particles, and gold dust.
- `whitening`: brighter Champagne gradient with increased caustics, shimmer wave particles, and softer grain/dust for whitening.

## Adding new variants

1. Extend `ChampagneHeroVariant` and the `HERO_VARIANTS` map inside `components/preview/champagne/ChampagneHeroFrame.tsx`.
2. Reuse existing Champagne tokens for gradients (e.g., `--smh-gradient`) and available assets from `/public/assets/champagne/` or `/public/brand/` (waves, particles, caustics). Do **not** introduce new PNG backgrounds.
3. Tune visual feel with the config knobs:
   - `gradientToken` for the CSS variable to feed the base gradient.
   - `waveMaskId`, `particleFieldId`, `causticsId`, `dustId` to select existing assets.
   - `brightnessScale`, `contrastScale`, `vignetteStrength`, and optional opacity overrides for particles/caustics/dust.
4. Point new routes or templates at the variant via `<ChampagneHeroFrame variant="your_variant" />`, keeping the content layout and CTA system intact.

Stay within the Champagne Canon: lean on brand tokens, wave/particle assets already in `public/brand` or `public/assets/champagne`, and avoid raw hex values or new binary backgrounds.
