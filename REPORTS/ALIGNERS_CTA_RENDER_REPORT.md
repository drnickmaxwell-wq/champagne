# Aligners CTA Render Report

## Step 1 — Rendered Section Stack Report (Before fixes)

### /treatments/clear-aligners
- Section stack (order): heroIntro (10), trustSignals (20), consultationOverview (30), whoIsItFor (40), processTimeline (50), technology (60), aftercareRisks (70), faq (80), cta (90), trustSignals (100).
- Closing CTA presence: none in layout (only a mid-page `treatment.cta` mapped as CTA but followed by another section).
- Mid-page CTA labels/links (from section layout): "Book consultation" → /contact, "Discuss options" → /contact.

### /treatments/clear-aligners-spark
- Section stack (order): heroIntro (10), trustSignals (20), consultationOverview (30), trustSignals (35), whoIsItFor (40), processTimeline (50), trustSignals (55), technology (60), aftercareRisks (70), trustSignals (72), faq (80), trustSignals (85), cta (90), trustSignals (100).
- Closing CTA presence: none in layout (CTA block mid-stack, then further content).
- Mid-page CTA labels/links (from section layout): "Book an Orthodontic Assessment" → /contact, "Ask about Spark aligners" → /contact?topic=aligners.

CTA sources before: layouts pulled from `packages/champagne-manifests/data/sections/smh/treatments.clear-aligners*.json`; closing CTAs from the machine manifest were bypassed because the section layout was found first.

## Step 2 — Changes Applied
- Added explicit closing CTA sections to both aligner layouts with the required three links.
- Replaced mid-page CTA links so they promote Spark options, whitening, and smile design (aligners) or compare aligners, whitening, and smile design (Spark), instead of defaulting to /contact.

Files updated:
- `packages/champagne-manifests/data/sections/smh/treatments.clear-aligners.json`
- `packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json`

## Step 3 — Rendered Section Stack Report (After fixes)

### /treatments/clear-aligners
- Section stack (order): heroIntro (10), trustSignals (20), consultationOverview (30), whoIsItFor (40), processTimeline (50), technology (60), aftercareRisks (70), faq (80), cta (90), trustSignals (100), treatment_closing_cta (110).
- Mid-page CTA labels/links: "See Spark aligner options" → /treatments/clear-aligners-spark, "Plan whitening after alignment" → /treatments/teeth-whitening, "See Digital Smile Design" → /treatments/digital-smile-design.
- Closing CTA labels/links: "Start your aligner consultation" → /contact, "See Spark aligner options" → /treatments/clear-aligners-spark, "Plan whitening after alignment" → /treatments/teeth-whitening.

### /treatments/clear-aligners-spark
- Section stack (order): heroIntro (10), trustSignals (20), consultationOverview (30), trustSignals (35), whoIsItFor (40), processTimeline (50), trustSignals (55), technology (60), aftercareRisks (70), trustSignals (72), faq (80), trustSignals (85), cta (90), trustSignals (100), treatment_closing_cta (110).
- Mid-page CTA labels/links: "Compare aligner options" → /treatments/clear-aligners, "Plan whitening after Spark" → /treatments/teeth-whitening, "See smile design planning" → /treatments/digital-smile-design.
- Closing CTA labels/links: "Book a Spark aligner review" → /contact, "Compare aligner options" → /treatments/clear-aligners, "See smile design planning" → /treatments/digital-smile-design.

## Step 4 — Verification
- guard:canon — passed
- guard:hero — passed
- verify — passed
