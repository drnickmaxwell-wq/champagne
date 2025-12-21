# Phase D Slug Truth (Step A)

## Runtime treatment slugs (getTreatmentPages derived)
- /treatments/3d-digital-dentistry
- /treatments/3d-implant-restorations
- /treatments/3d-printed-dentures
- /treatments/3d-printed-veneers
- /treatments/3d-printing-lab
- /treatments/acrylic-dentures
- /treatments/anti-wrinkle-treatments
- /treatments/broken-chipped-cracked-teeth
- /treatments/bruxism-and-jaw-clenching
- /treatments/cbct-3d-scanning
- /treatments/childrens-dentistry
- /treatments/chrome-dentures
- /treatments/clear-aligners
- /treatments/clear-aligners-spark
- /treatments/composite-bonding
- /treatments/dental-abscess-infection
- /treatments/dental-bridges
- /treatments/dental-crowns
- /treatments/dental-retainers
- /treatments/dental-trauma-accidents
- /treatments/dentures
- /treatments/dermal-fillers
- /treatments/digital-smile-design
- /treatments/emergency-dental-appointments
- /treatments/emergency-dentistry
- /treatments/endodontics-root-canal
- /treatments/extractions-and-oral-surgery
- /treatments/facial-pain-and-headache
- /treatments/failed-implant-replacement
- /treatments/fixed-braces
- /treatments/full-smile-makeover
- /treatments/home-teeth-whitening
- /treatments/implant-aftercare
- /treatments/implant-consultation
- /treatments/implant-retained-dentures
- /treatments/implants
- /treatments/implants-bone-grafting
- /treatments/implants-full-arch
- /treatments/implants-multiple-teeth
- /treatments/implants-single-tooth
- /treatments/injection-moulded-composite
- /treatments/inlays-onlays
- /treatments/knocked-out-tooth
- /treatments/lost-crowns-veneers-fillings
- /treatments/mouthguards-and-retainers
- /treatments/nervous-patients
- /treatments/night-guards-occlusal-splints
- /treatments/orthodontics
- /treatments/painless-numbing-the-wand
- /treatments/peek-partial-dentures
- /treatments/periodontal-gum-care
- /treatments/polynucleotides
- /treatments/preventative-and-general-dentistry
- /treatments/sedation-dentistry
- /treatments/sedation-for-implants
- /treatments/senior-mature-smile-care
- /treatments/severe-toothache-dental-pain
- /treatments/sinus-lift
- /treatments/skin-boosters
- /treatments/sports-mouthguards
- /treatments/teeth-in-a-day
- /treatments/teeth-whitening
- /treatments/teeth-whitening-faqs
- /treatments/therapeutic-facial-injectables
- /treatments/tmj-disorder-treatment
- /treatments/tmj-jaw-comfort
- /treatments/tooth-wear-broken-teeth
- /treatments/veneers
- /treatments/whitening-sensitive-teeth
- /treatments/whitening-top-ups

## Target slug checks
### /treatments/veneers
- Exists: **yes** (treatment page in machine manifest).
- Sections present: mid CTA `treatment_mid_cta`, FAQ `treatment.faq`, closing CTA `treatment_closing_cta`.
- Current CTAs: mid CTA offers smile design, 3D printed veneers, and bonding links from the section config; closing CTA offers contact plus 3D printed veneers and Digital Smile Design from the section config.

### /treatments/composite-bonding
- Exists: **yes**.
- Sections present: mid CTA `treatment_mid_cta`, FAQ block `treatment_faq_block`, closing CTA `treatment_closing_cta`.
- Current CTAs: mid CTA links to contact, whitening, and veneers; closing CTA links to contact plus veneers, whitening, and clear aligners, all defined in the section config.

### /treatments/implants
- Exists: **yes**.
- Sections present: mid CTA `treatment_mid_cta`, FAQ `treatment.faq`, closing CTA `treatment_closing_cta`.
- Current CTAs: mid CTA links to contact, single-tooth implants, and bridges; closing CTA links to contact plus single-tooth and full-arch implants from the section config.

### /treatments/wear
- Exists: **no** (slug not present in runtime manifest; closest is `/treatments/tooth-wear-broken-teeth`).

### /treatments/emergency-dentist
- Exists: **no** (runtime emergency routes use `/treatments/emergency-dentistry` and `/treatments/emergency-dental-appointments`).
