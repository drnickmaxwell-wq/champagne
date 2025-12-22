# Phase I CTA UX Hygiene Report

## Mid CTA placement
- Treatment pages assessed: 71
- Pages with exactly one mid CTA box: 71/71
- Pages with multiple mid CTA boxes: 0 (runtime insertion disabled when manifest mid CTA exists)

## Cross-surface duplication
- Pages with mid/closing CTA href overlap before exclusions: 53
- Pages with mid/closing CTA href overlap after exclusions: 23 (remaining overlaps kept to avoid dropping below two closing CTAs)

## Outstanding duplication rationale
- Overlaps remain only when removing mid-surface links would leave closing sections with fewer than two CTAs.

## Example page audits (mid vs closing CTAs)
1. **/treatments/implants**
   - Mid: See implant consultation steps (/treatments/implant-consultation); Explore single tooth implants (/treatments/implants-single-tooth)
   - Closing: Book an implant consultation (/contact); Plan a clinician-led implants review (/treatments/implants); Consider alternatives like CBCT planning (/treatments/cbct-3d-scanning)
   - Overlap: 0
2. **/treatments/veneers**
   - Mid: Try 3D printed veneers (/treatments/3d-printed-veneers); See digital smile design (/treatments/digital-smile-design)
   - Closing: Book veneer consultation (/contact); Plan a clinician-led veneers review (/treatments/veneers); Consider alternatives like full smile makeover (/treatments/full-smile-makeover)
   - Overlap: 0
3. **/treatments/clear-aligners**
   - Mid: Plan retention early (/treatments/dental-retainers); Protect with night guards (/treatments/night-guards-occlusal-splints)
   - Closing: Start an aligner consultation (/contact); Discuss clear aligners spark before deciding (/treatments/clear-aligners-spark); Consider alternatives like Finishing with teeth whitening (/treatments/teeth-whitening); Plan next steps with Digital smile planning (/treatments/digital-smile-design)
   - Overlap: 0
4. **/treatments/clear-aligners-spark**
   - Mid: See whitening next steps (/treatments/teeth-whitening); Explore veneers options (/treatments/veneers)
   - Closing: Plan a Spark aligner review (/contact); Discuss clear aligners before deciding (/treatments/clear-aligners); Plan next steps with Digital smile planning (/treatments/digital-smile-design)
   - Overlap: 0
5. **/treatments/implants-single-tooth**
   - Mid: Check implant aftercare steps (/treatments/implant-aftercare); Discuss implant-retained dentures (/treatments/implant-retained-dentures)
   - Closing: Arrange a single tooth implant review (/contact); Plan a clinician-led implants single tooth review (/treatments/implants-single-tooth); Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
   - Overlap: 0
6. **/treatments/implants-multiple-teeth**
   - Mid: Explore related treatment: Single-tooth dental implants in Shoreham-by-Sea (/treatments/implants-single-tooth); Explore related treatment: Dental bridges (/treatments/dental-bridges)
   - Closing: Plan a clinician-led implants multiple teeth review (/contact); Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
   - Overlap: 0
7. **/treatments/implants-full-arch**
   - Mid: Plan a clinician-led implants full arch review (/contact)
   - Closing: Plan a clinician-led implants full arch review (/contact); Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
   - Overlap: 1 (kept to maintain two closing CTAs)
8. **/treatments/implant-retained-dentures**
   - Mid: See implant aftercare guidance (/treatments/implant-aftercare); Review implant consultation (/treatments/implant-consultation)
   - Closing: Plan implant-retained dentures (/contact); Plan a clinician-led implant retained dentures review (/treatments/implant-retained-dentures); Consider alternatives like implants (/treatments/implants)
   - Overlap: 0
9. **/treatments/implant-consultation**
   - Mid: See dental implant options (/treatments/implants); Review guided surgery planning (/treatments/cbct-3d-scanning)
   - Closing: Arrange an implant consultation (/contact); Plan a clinician-led implant consultation review (/treatments/implant-consultation)
   - Overlap: 0
10. **/treatments/implants-bone-grafting**
    - Mid: Explore related treatment: Dental Implants in Shoreham-by-Sea (/treatments/implants); Explore related treatment: Full arch implant rehabilitation (/treatments/implants-full-arch)
    - Closing: Plan a clinician-led implants bone grafting review (/contact); Consider alternatives like Implant placement (/treatments/implants)
    - Overlap: 1 (kept to maintain two closing CTAs)
