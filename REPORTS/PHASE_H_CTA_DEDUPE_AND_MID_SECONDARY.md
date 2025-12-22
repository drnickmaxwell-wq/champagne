# Phase H CTA Dedupe and Mid Secondary Coverage

## Summary
- Added mid-surface secondary CTA support while prioritising manifest and journey definitions.
- Normalised and deduped CTA buttons and supporting lines to prevent repeated labels.
- Audited treatment pages for mid and closing CTA coverage.

## Counts
- Total treatment slugs scanned: 71
- Mid CTA boxes with 2 actions: 66
- Mid CTA boxes with 1 action: 5
- Duplicates removed (mid): 57
- Duplicates removed (closing): 275
- Single-action mid CTA reasons:
- single unique CTA: 5

## Examples (labels before → after)
- /treatments/implants:
  - Mid before: See implant consultation steps, Explore single tooth implants, Explore related treatment: Dental bridges, Explore related treatment: Dentures & tooth replacement, Explore related treatment: Sedation for dental implant treatment in Shoreham-by-Sea, Plan a clinician-led implants review
  - Mid after: See implant consultation steps, Explore single tooth implants
  - Closing before: Plan a clinician-led implants review, Consider alternatives like CBCT planning, Book an implant consultation, See implant consultation steps, Plan a clinician-led implants review
  - Closing after: Plan a clinician-led implants review, Consider alternatives like CBCT planning, Book an implant consultation, See implant consultation steps
- /treatments/veneers:
  - Mid before: Try 3D printed veneers, Try 3D printed veneers, See digital smile design, Explore related treatment: 3D printed veneers, Explore related treatment: Digital smile design, Explore related treatment: Composite bonding, Explore related treatment: Teeth whitening, Plan a clinician-led veneers review
  - Mid after: Try 3D printed veneers, See digital smile design
  - Closing before: Plan a clinician-led veneers review, Consider alternatives like full smile makeover, Book veneer consultation, Try 3D printed veneers, Plan a clinician-led veneers review
  - Closing after: Plan a clinician-led veneers review, Consider alternatives like full smile makeover, Book veneer consultation, Try 3D printed veneers
- /treatments/clear-aligners:
  - Mid before: Plan retention early, Protect with night guards, Explore related treatment: Teeth whitening, Explore related treatment: Composite bonding, Explore related treatment: Dental veneers in Shoreham-by-Sea, Plan a clinician-led clear aligners review
  - Mid after: Plan retention early, Protect with night guards
  - Closing before: Discuss clear aligners spark before deciding, Consider alternatives like Finishing with teeth whitening, Plan next steps with Digital smile planning, Start an aligner consultation, Plan retainers, Plan a clinician-led clear aligners review
  - Closing after: Discuss clear aligners spark before deciding, Consider alternatives like Finishing with teeth whitening, Plan next steps with Digital smile planning, Start an aligner consultation
- /treatments/clear-aligners-spark:
  - Mid before: See whitening next steps, Explore veneers options, Explore related treatment: Teeth whitening, Explore related treatment: Composite bonding, Explore related treatment: Dental veneers in Shoreham-by-Sea, Plan a clinician-led clear aligners spark review
  - Mid after: See whitening next steps, Explore veneers options
  - Closing before: Discuss clear aligners before deciding, Consider alternatives like Finishing with teeth whitening, Plan next steps with Digital smile planning, Plan a Spark aligner review, See whitening next steps, Plan a clinician-led clear aligners spark review
  - Closing after: Discuss clear aligners before deciding, Consider alternatives like Finishing with teeth whitening, Plan next steps with Digital smile planning, Plan a Spark aligner review
- /treatments/implants-single-tooth:
  - Mid before: Check implant aftercare steps, Discuss implant-retained dentures, Explore related treatment: Implant aftercare & recovery in Shoreham-by-Sea, Explore related treatment: Implant-retained dentures, Plan a clinician-led implants single tooth review
  - Mid after: Check implant aftercare steps, Discuss implant-retained dentures
  - Closing before: Plan a clinician-led implants single tooth review, Consider alternatives like CBCT 3D scanning, Arrange a single tooth implant review, Check implant aftercare steps, Plan a clinician-led implants single tooth review
  - Closing after: Plan a clinician-led implants single tooth review, Consider alternatives like CBCT 3D scanning, Arrange a single tooth implant review, Check implant aftercare steps
- /treatments/implants-multiple-teeth:
  - Mid before: Explore related treatment: Single-tooth dental implants in Shoreham-by-Sea, Explore related treatment: Dental bridges, Plan a clinician-led implants multiple teeth review
  - Mid after: Explore related treatment: Single-tooth dental implants in Shoreham-by-Sea, Explore related treatment: Dental bridges
  - Closing before: Plan a clinician-led implants multiple teeth review, Consider alternatives like CBCT 3D scanning, Plan a clinician-led implants multiple teeth review, Plan a clinician-led implants multiple teeth review, Plan a clinician-led implants multiple teeth review
  - Closing after: Plan a clinician-led implants multiple teeth review, Consider alternatives like CBCT 3D scanning
- /treatments/implants-full-arch:
  - Mid before: Plan a clinician-led implants full arch review
  - Mid after: Plan a clinician-led implants full arch review
  - Closing before: Plan a clinician-led implants full arch review, Consider alternatives like CBCT 3D scanning, Plan a clinician-led implants full arch review, Plan a clinician-led implants full arch review, Plan a clinician-led implants full arch review
  - Closing after: Plan a clinician-led implants full arch review, Consider alternatives like CBCT 3D scanning
- /treatments/implant-retained-dentures:
  - Mid before: See implant aftercare guidance, See implant aftercare guidance, Review implant consultation, Explore related treatment: Full arch implant rehabilitation, Explore related treatment: Implant aftercare & recovery in Shoreham-by-Sea, Explore related treatment: Single-tooth dental implants in Shoreham-by-Sea, Plan a clinician-led implant retained dentures review
  - Mid after: See implant aftercare guidance, Review implant consultation
  - Closing before: Plan a clinician-led implant retained dentures review, Consider alternatives like implants, Plan implant-retained dentures, See implant aftercare guidance, Plan a clinician-led implant retained dentures review
  - Closing after: Plan a clinician-led implant retained dentures review, Consider alternatives like implants, Plan implant-retained dentures, See implant aftercare guidance
- /treatments/implant-consultation:
  - Mid before: See dental implant options, Review guided surgery planning, Plan a clinician-led implant consultation review
  - Mid after: See dental implant options, Review guided surgery planning
  - Closing before: Plan a clinician-led implant consultation review, Consider alternatives like implants, Arrange an implant consultation, See dental implant options, Plan a clinician-led implant consultation review
  - Closing after: Plan a clinician-led implant consultation review, Consider alternatives like implants, Arrange an implant consultation
- /treatments/implants-bone-grafting:
  - Mid before: Explore related treatment: Dental Implants in Shoreham-by-Sea, Explore related treatment: Full arch implant rehabilitation, Plan a clinician-led implants bone grafting review
  - Mid after: Explore related treatment: Dental Implants in Shoreham-by-Sea, Explore related treatment: Full arch implant rehabilitation
  - Closing before: Plan a clinician-led implants bone grafting review, Consider alternatives like Implant placement, Plan a clinician-led implants bone grafting review, Plan a clinician-led implants bone grafting review, Plan a clinician-led implants bone grafting review
  - Closing after: Plan a clinician-led implants bone grafting review, Consider alternatives like Implant placement