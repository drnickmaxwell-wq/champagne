# Treatments Hub Preview v1

## Sections implemented
- Champagne hero wrapper with tailored treatments headline and AI Smile Quiz / consultation CTAs.
- Concern rail and detail deck for veneers, implants, orthodontics, whitening, composite bonding, general, and technology.
- 4-step How It Works grid (Consultation → 3D Planning → Treatment Day → Aftercare).
- Pricing & finance band with preview ranges and finance CTAs.
- Technology highlight panel (CBCT, 3D printing, digital planning).
- Patient stories teaser grid with concern tags.
- Micro FAQ rail aligned to zero-click prompts.
- Preview-only schema helper injecting Service, HowTo, and FAQPage JSON-LD.

## Hero details
- Headline: “Find the right treatment for your smile.”
- Calm subcopy covering cosmetic, restorative, and tech-led care.
- Primary CTA → /ai-smile-quiz, Secondary CTA → /contact.
- Uses ChampagneHero via preview wrapper to mirror /preview/home canvas.

## Concern rail
- Cards: Veneers, Implants, Orthodontics, Whitening, Composite Bonding, General, Technology.
- Short card summaries plus longer below-the-fold detail deck using AnswerFirst copy tone.
- Links point to existing preview treatment routes and technology surface.

## How it works
- Four schema-aligned steps: Consultation, 3D Planning, Treatment Day, Aftercare.
- Mirrors treatments SEO plan and Zero_Click_Strategy requirements for HowTo visibility.

## Finance band
- Glass band with preview price ranges (cosmetic refresh, smile makeover, implant stability).
- Finance copy references soft searches and stage-aligned schedules.
- CTAs: explore finance (/finance) and ask about pricing (/contact).

## Tech highlight
- CBCT precision, 3D printing & guides, digital planning; CTA to /technology.
- Styled with Champagne glass panels and magenta/teal accents.

## Stories teaser
- Four story cards: veneers chips, implant premolar, aligner crowding, whitening + bonding.
- CTA to /patient-stories.

## FAQ rail
- Five accordion entries: veneer longevity, comfort, finance, online start, technology.
- Copy structured for FAQPage schema and zero-click answers.

## Manus and SEO manifests
- Mapped Manus section guidance for treatment surfaces (concern deck, consultation CTA tones) into rail + deck patterns within preview shell.
- Schema wired per schema-map `/treatments/[slug]` targets: Service, HowTo, FAQPage via `TreatmentHubPreviewSchema`.
- AnswerFirst copy from `config/seo/Treatments_AnswerFirst_Copy.md` informs hub descriptions; Zero_Click_Strategy used for FAQ/HowTo emphasis.

## Brand/FX notes
- Palette and glass shells reuse champagne-preview tokens for dusk-to-ink mood, magenta/teal lifts, and ready PRM behaviour (no new motion added).
- Time-of-day flexibility preserved through token usage; no live clock logic introduced.

## Tests & guards
- pnpm test — _see run output_
- pnpm brand:guard — _see run output_
- node scripts/guard-rogue-hex.mjs — _see run output_
- node scripts/guard-manifest-sync.mjs — _see run output_
- node scripts/guard-preview-only.mjs — _see run output_
- Note: guard-preview-only may flag missing origin/main in sandbox; no changes made to guard scripts.
