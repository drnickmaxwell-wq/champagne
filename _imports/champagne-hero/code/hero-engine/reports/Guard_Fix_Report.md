# Guard Fix Report

- Restored `components/home/ChampagneHero.tsx` and `app/page.tsx` to match the frozen production versions so freeze and preview-only guards are satisfied.
- Added a preview-only homepage at `app/preview/home/page.tsx` that renders the ChampagneHero followed by the clinic tour, treatments rail, technology highlight, patient stories, AI Smile Quiz, portal teaser, local proof, and micro-FAQ sections.
- Relocated the new homepage section components and shared styles to `components/sections/home/` for preview consumption.
- Upcoming validation to run locally: `pnpm test`, `pnpm brand:guard`, `node scripts/guard-rogue-hex.mjs`, and `node scripts/guard-preview-only.mjs`.
