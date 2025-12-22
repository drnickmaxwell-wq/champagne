# Duplicate closing CTA — dental fillings

## Finding
- `/treatments/dental-fillings` resolved two `treatment_closing_cta` sections because the mid-page CTA block in `treatments.dental-fillings.json` was wired with `componentId: "treatment.cta"`, so SectionRegistry normalized it as a second closing CTA instead of a mid CTA.

## Fix
- Rewired the mislabelled mid CTA to `componentId: "treatment_mid_cta"`, restoring the intended mid-page placement.
- Added a renderer invariant that, for treatment pages, keeps only the last closing CTA in the stack and drops earlier duplicates so runtime cannot render more than one terminal CTA even if manifest input regresses.
