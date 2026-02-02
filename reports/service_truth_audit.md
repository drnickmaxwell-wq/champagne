# Service / Offer Correctness Audit (Treatment Routes)

Sources:
- content-scope/live-pages.json
- page-truth/treatments-*.txt
- REPORTS/TREATMENT_INVENTORY.md

## /treatments
- Status: OK
- Why:
  - Hub route listing treatment groups; not a single-service offering.
- Evidence:
  - "Find treatments by locked groups"
  - "Start with brief guidance, then open the eight director-defined groups. Each card shows up to five featured pathways and keeps the rest hidden until you choose View all."
- Risk: confusing patient flow (none observed)

## /treatments/3d-dentistry-and-technology
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan with 3D technology"
  - "See how scans, printing, and guided workflows shape your treatment plan."
- Risk: confusing patient flow (none observed)

## /treatments/3d-digital-dentistry
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "See how digital dentistry supports care"
  - "Explore scanning, guided planning, and 3D printing for precise treatments."
- Risk: confusing patient flow (none observed)

## /treatments/3d-implant-restorations
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Review 3D implant restorations"
  - "See how digital workflows improve fit, aesthetics, and durability."
- Risk: confusing patient flow (none observed)

## /treatments/3d-printed-dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan 3D printed dentures"
  - "See how printed try-ins speed up fit, comfort, and aesthetics."
- Risk: confusing patient flow (none observed)

## /treatments/3d-printed-veneers
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Preview your smile with 3D printed veneers"
  - "Trial shapes and shades before choosing permanent porcelain."
- Risk: confusing patient flow (none observed)

## /treatments/3d-printing-lab
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Use the 3D printing lab for your care"
  - "See how printed guides, models, and mock-ups support predictable results."
- Risk: confusing patient flow (none observed)

## /treatments/acrylic-dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan acrylic dentures"
  - "Review comfort, aesthetics, and maintenance for acrylic dentures."
- Risk: confusing patient flow (none observed)

## /treatments/anti-wrinkle-treatments
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Related facial aesthetics"
  - "Subtle, clinician-led treatment — with clear guidance on suitability, safety, and natural results."
- Risk: confusing patient flow (none observed)

## /treatments/broken-chipped-cracked-teeth
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Broken, chipped or cracked teeth"
  - "If you’ve chipped a tooth, cracked a corner, or something feels sharp or painful, it’s worth getting it checked promptly."
- Risk: confusing patient flow

## /treatments/bruxism-and-jaw-clenching
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Protect worn teeth, reduce jaw strain, and understand the triggers — with a practical plan."
  - "Help for grinding and clenching"
- Risk: confusing patient flow (none observed)

## /treatments/cbct-3d-scanning
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Book CBCT or 3D scanning"
  - "Plan diagnostic imaging for implants, orthodontics, and restorative work."
- Risk: confusing patient flow (none observed)

## /treatments/childrens-dentistry
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Children’s dentistry"
  - "Gentle check-ups that build lifelong habits"
- Risk: confusing patient flow (none observed)

## /treatments/chrome-dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Review chrome denture options"
  - "Choose lightweight, stable dentures with precision attachments."
- Risk: confusing patient flow (none observed)

## /treatments/clear-aligners
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Clear aligners with clear diagnosis"
  - "Introduction"
- Risk: confusing patient flow (none observed)

## /treatments/clear-aligners-spark
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Explore Spark aligner treatment"
  - "Review how Spark aligners compare and what retention looks like."
- Risk: confusing patient flow (none observed)

## /treatments/composite-bonding
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Composite bonding for measured smile refinement"
  - "Composite bonding (also called cosmetic bonding or dental bonding) uses layered resin to rebuild edges and balance shapes with minimal drilling. We preserve enamel wherever possible, plan conservatively, and explain how wear and staining can be managed over time."
- Risk: confusing patient flow

## /treatments/dental-abscess-infection
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Dental abscess and infection"
  - "A dental abscess is an infection that can build pressure and cause significant pain, swelling, or a bad taste."
- Risk: confusing patient flow

## /treatments/dental-bridges
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan your dental bridge"
  - "Replace missing teeth and balance your bite with the right bridge style."
- Risk: confusing patient flow (none observed)

## /treatments/dental-checkups-oral-cancer-screening
- Status: REMOVE_OR_ARCHIVE
- Why:
  - Route is not listed in the canonical treatment inventory.
- Evidence:
  - "Gentle check-ups with attentive screening"
  - "We keep routine exams unhurried, explaining what we see and what it means for your mouth. We include a visual oral cancer screening at every routine exam."
- Risk: misrepresentation

## /treatments/dental-crowns
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Strength, function, and maintainability"
  - "Introduction"
- Risk: confusing patient flow (none observed)

## /treatments/dental-fillings
- Status: REMOVE_OR_ARCHIVE
- Why:
  - Route is not listed in the canonical treatment inventory.
- Evidence:
  - "Plan a calm filling appointment"
  - "Choose composite or amalgam with guidance and follow-up."
- Risk: misrepresentation

## /treatments/dental-retainers
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Keep your smile in position"
  - "Check fixed or removable retainers and plan replacements when needed."
- Risk: confusing patient flow (none observed)

## /treatments/dental-trauma-accidents
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Care after dental trauma or accidents"
  - "Falls, sports injuries, or other accidents can affect teeth and soft tissues. We provide calm assessment, stop bleeding, protect damaged areas, and outline any further treatment."
- Risk: confusing patient flow

## /treatments/dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Refresh your denture fit"
  - "Review acrylic, chrome, and implant-stabilised options with the clinician."
- Risk: confusing patient flow (none observed)

## /treatments/dermal-fillers
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Related facial aesthetics"
  - "A careful, proportion-led approach — focused on balance, structure, and natural movement."
- Risk: confusing patient flow (none observed)

## /treatments/digital-smile-design
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Map your smile makeover"
  - "Use Digital Smile Design to preview whitening, bonding, veneers, or aligners."
- Risk: confusing patient flow (none observed)

## /treatments/emergency-dental-appointments
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Emergency dental appointments"
  - "If you’re in pain, have swelling, or you’ve damaged a tooth, an emergency appointment is about stabilising the situation."
- Risk: confusing patient flow

## /treatments/emergency-dentistry
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Emergency dentistry"
  - "If you’re in pain, have swelling, or you’ve damaged a tooth, the first job is to work out what’s urgent and what’s fixable — calmly."
- Risk: confusing patient flow

## /treatments/endodontics-root-canal
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Endodontics & root canal care"
  - "Root canal treatment"
- Risk: confusing patient flow (none observed)

## /treatments/extractions-and-oral-surgery
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Extractions & oral surgery"
  - "Dental extractions"
- Risk: confusing patient flow (none observed)

## /treatments/facial-aesthetics
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Explore facial aesthetics options"
  - "Choose a natural, clinician-led approach — with clear advice on what’s appropriate and what’s not."
- Risk: confusing patient flow (none observed)

## /treatments/facial-pain-and-headache
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Find relief from facial pain"
  - "Combine dental, TMJ, and therapeutic approaches to manage headaches."
- Risk: confusing patient flow (none observed)

## /treatments/facial-therapeutics
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan therapeutic facial care"
  - "Manage jaw tension, migraines, or facial pain with medical oversight."
- Risk: confusing patient flow (none observed)

## /treatments/failed-implant-replacement
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Resolve implant concerns"
  - "Assess failing implants, plan rescue options, and stabilise healing."
- Risk: confusing patient flow (none observed)

## /treatments/fixed-braces
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Fixed braces"
  - "Predictable, clinician-led tooth straightening"
- Risk: confusing patient flow (none observed)

## /treatments/full-smile-makeover
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Smile makeovers guided by a shared plan"
  - "A full smile makeover is a way of looking at your teeth together, rather than treating individual problems in isolation. People often come to us with a mix of concerns — how their teeth look, how they function, or how they’ve changed over time."
- Risk: confusing patient flow

## /treatments/home-teeth-whitening
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Custom home whitening with dentist oversight"
  - "A calm, paced whitening plan using custom trays and prescribed gel strengths. We keep change gradual, stable, and respectful of your enamel and existing restorations."
- Risk: confusing patient flow (none observed)

## /treatments/implant-aftercare
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Keep implant healing on track"
  - "Schedule reviews, hygiene, and comfort checks after placement."
- Risk: confusing patient flow (none observed)

## /treatments/implant-consultation
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Book implant consultation & planning"
  - "Assess bone support, digital scans, and sedation needs before treatment."
- Risk: confusing patient flow (none observed)

## /treatments/implant-retained-dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Stabilise dentures with implants"
  - "See how implant support can secure existing or new dentures."
- Risk: confusing patient flow (none observed)

## /treatments/implants
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Planning first, surgery second"
  - "Introduction"
- Risk: confusing patient flow (none observed)

## /treatments/implants-bone-grafting
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan bone grafting for implants"
  - "Review when grafting, sinus lifts, or ridge preservation make implants predictable."
- Risk: confusing patient flow (none observed)

## /treatments/implants-full-arch
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Discuss full-arch implant solutions"
  - "Review All-on-X, staged, or denture-supported options with the clinical team."
- Risk: confusing patient flow (none observed)

## /treatments/implants-multiple-teeth
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan multiple-tooth implant care"
  - "Compare bridgework, staged implants, or denture support to fit your goals."
- Risk: confusing patient flow (none observed)

## /treatments/implants-single-tooth
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Ready for a single tooth implant?"
  - "Replace a missing tooth and plan long-term maintenance from day one."
- Risk: confusing patient flow (none observed)

## /treatments/injection-moulded-composite
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Injection-moulded composite for guided precision"
  - "Injection moulded composite is a digitally planned approach to cosmetic bonding. We design the smile change first, create a custom guide, and deliver the composite through it so widths, edges, and symmetry follow the plan without unnecessary drilling."
- Risk: confusing patient flow

## /treatments/inlays-onlays
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Protect teeth with inlays or onlays"
  - "Choose durable restorations when fillings are not enough."
- Risk: confusing patient flow (none observed)

## /treatments/knocked-out-tooth
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Knocked-out tooth"
  - "A knocked-out adult tooth can sometimes be saved, but timing and handling matter."
- Risk: confusing patient flow

## /treatments/lost-crowns-veneers-fillings
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Lost crowns, veneers or fillings"
  - "If a crown, veneer or filling has come out, it can feel urgent — especially if the tooth is sensitive or looks unfinished."
- Risk: confusing patient flow

## /treatments/mouthguards-and-retainers
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Retainers, sports guards, and night guards do different jobs — we’ll help you choose what’s appropriate."
  - "Protect teeth, restorations, and orthodontic results"
- Risk: confusing patient flow (none observed)

## /treatments/nervous-patients
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Nervous patients"
  - "If you feel anxious about dentistry, you’re not alone — and you don’t need to ‘push through it’ to get help."
- Risk: confusing patient flow (none observed)

## /treatments/night-guards-occlusal-splints
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Compare connected options for clenching, jaw joint symptoms, and tooth wear — and choose the calm next step."
  - "Night guards for grinding and jaw tension"
- Risk: confusing patient flow (none observed)

## /treatments/orthodontics
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan your orthodontic pathway"
  - "Choose between aligners or braces and plan retention and finishing."
- Risk: confusing patient flow (none observed)

## /treatments/painless-numbing-the-wand
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Experience gentle anaesthesia"
  - "See how The Wand provides precise, comfortable numbing."
- Risk: confusing patient flow (none observed)

## /treatments/peek-partial-dentures
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Discuss PEEK partial dentures"
  - "Review flexible, metal-free partials and how they integrate with implants."
- Risk: confusing patient flow (none observed)

## /treatments/periodontal-gum-care
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Periodontal & gum care"
  - "Gum disease"
- Risk: confusing patient flow (none observed)

## /treatments/polynucleotides
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Related facial therapeutics"
  - "Compare options that support hydration, texture, and natural-looking skin quality — with clear advice on suitability."
- Risk: confusing patient flow (none observed)

## /treatments/preventative-and-general-dentistry
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Preventative & general dentistry"
  - "Prevention-first dentistry that keeps teeth for life"
- Risk: confusing patient flow (none observed)

## /treatments/sedation-dentistry
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan sedation for dental care"
  - "Match IV, oral, or inhalation sedation to the treatment you need."
- Risk: confusing patient flow (none observed)

## /treatments/sedation-for-implants
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Plan sedation for implant care"
  - "Review conscious sedation options to keep implant visits calm."
- Risk: confusing patient flow (none observed)

## /treatments/senior-mature-smile-care
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Compare connected options and plan the next step calmly."
  - "Plan mature smile care"
- Risk: confusing patient flow (none observed)

## /treatments/severe-toothache-dental-pain
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Severe toothache and dental pain"
  - "Severe toothache can feel urgent, and it’s hard to think about anything else. Here in Shoreham-by-Sea, we see how quickly pain can disrupt sleep, eating, and work."
- Risk: confusing patient flow

## /treatments/sinus-lift
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Discuss sinus lift care"
  - "Check if a sinus lift is needed before your implant placement."
- Risk: confusing patient flow (none observed)

## /treatments/skin-boosters
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Compare connected options and choose a calm, natural next step."
  - "Skin booster consultation"
- Risk: confusing patient flow (none observed)

## /treatments/sports-mouthguards
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Custom sports mouthguards"
  - "Protect teeth during sport with tailored guards and annual reviews."
- Risk: confusing patient flow (none observed)

## /treatments/teeth-in-a-day
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Explore Teeth-in-a-Day"
  - "See if same-day placement suits your case and what aftercare involves."
- Risk: confusing patient flow (none observed)

## /treatments/teeth-whitening
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Teeth whitening in Shoreham-by-Sea"
  - "Dentist-led home whitening with UK-compliant gels, custom trays, and clear shade planning. We keep enamel safe while preparing your smile for wider cosmetic work such as alignment or bonding."
- Risk: confusing patient flow (none observed)

## /treatments/teeth-whitening-faqs
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Dentist-led answers about whitening"
  - "Clear, UK-compliant guidance on whitening safety, shade expectations, and how treatment fits with veneers or crowns."
- Risk: confusing patient flow (none observed)

## /treatments/therapeutic-facial-injectables
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Jaw tension, clenching, facial pain and headaches can overlap — compare options and choose a calm next step."
  - "Therapeutic injectables for jaw tension and facial pain"
- Risk: confusing patient flow (none observed)

## /treatments/tmj-disorder-treatment
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Jaw pain, clicking, headaches, and clenching often overlap — compare options and choose the calm next step."
  - "TMJ disorder assessment and treatment"
- Risk: confusing patient flow (none observed)

## /treatments/tmj-jaw-comfort
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Compare connected options and choose the calm next step."
  - "Get help with jaw joint (TMJ) discomfort"
- Risk: confusing patient flow (none observed)

## /treatments/tooth-wear-broken-teeth
- Status: NEEDS_SCOPE_FIX
- Why:
  - Treatment inventory flags missing section layout (existsOnDisk: NO).
- Evidence:
  - "Tooth wear and erosion"
  - "Tooth wear refers to the gradual loss of tooth structure over time."
- Risk: confusing patient flow

## /treatments/veneers
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "A conservative route to refined change"
  - "Introduction"
- Risk: confusing patient flow (none observed)

## /treatments/whitening-sensitive-teeth
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Whitening with sensitivity in mind"
  - "We plan whitening for sensitive teeth using gentle gel strengths, protective trays, and pacing. Every step is monitored by your dentist so comfort leads the plan."
- Risk: confusing patient flow (none observed)

## /treatments/whitening-top-ups
- Status: OK
- Why:
  - Treatment inventory lists an on-disk section layout for this route.
- Evidence:
  - "Keep your whitening results steady"
  - "Dentist-guided top-ups reuse your existing trays and follow a conservative schedule. We protect enamel, match refreshes to hygiene visits, and avoid over-whitening."
- Risk: confusing patient flow (none observed)

