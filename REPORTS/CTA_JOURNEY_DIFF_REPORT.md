# CTA Journey Diff Report

Journey-driven CTA mapping with mid-page and closing CTAs sourced from treatment_journeys.json.

## Emergency Relief

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/emergency-dentistry | triage | See root canal pain relief → /treatments/endodontics-root-canal | Primary: Call for urgent dental help → /contact<br>Secondary: Understand root canal care → /treatments/endodontics-root-canal<br>Tertiary: See surgical extraction support → /treatments/extractions-and-oral-surgery |
| /treatments/endodontics-root-canal | stabilise | When extraction is needed → /treatments/extractions-and-oral-surgery | Primary: Urgent contact for toothache → /contact<br>Secondary: Review emergency dentistry steps → /treatments/emergency-dentistry<br>Tertiary: Plan crowns after root canal → /treatments/dental-crowns |
| /treatments/extractions-and-oral-surgery | surgical_relief | Plan implant consultation → /treatments/implant-consultation | Primary: Call for extraction advice → /contact<br>Secondary: See implant consultation → /treatments/implant-consultation<br>Tertiary: Review emergency care guidance → /treatments/emergency-dentistry |

## Prevent & Maintain

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/childrens-dentistry | paediatric | Return to routine check-ups → /dental-checkups-oral-cancer-screening | Primary: Arrange a children's check-up → /contact<br>Secondary: See routine check-up details → /dental-checkups-oral-cancer-screening<br>Tertiary: Plan preventive hygiene → /treatments/hygiene |
| /treatments/dental-checkups-oral-cancer-screening | entry | Book a hygiene visit next → /treatments/hygiene | Primary: Book a routine exam → /contact<br>Secondary: Read preventive care tips → /treatments/hygiene<br>Tertiary: See general dentistry support → /treatments/general-dentistry |
| /treatments/general-dentistry | maintenance | See children's dentistry guidance → /treatments/childrens-dentistry | Primary: Book a general review → /contact<br>Secondary: See children's dentistry support → /treatments/childrens-dentistry<br>Tertiary: Plan senior smile care → /treatments/senior-mature-smile-care |
| /treatments/hygiene | proactive | See general dentistry repairs → /treatments/general-dentistry | Primary: Schedule hygiene care → /contact<br>Secondary: Plan general dentistry review → /treatments/general-dentistry<br>Tertiary: Help for children → /treatments/childrens-dentistry |
| /treatments/senior-mature-smile-care | senior | Plan tailored hygiene support → /treatments/hygiene | Primary: Book a mature smile review → /contact<br>Secondary: Plan hygiene and gum care → /treatments/hygiene<br>Tertiary: Review denture options → /treatments/dentures |

## Functional Restoration

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/dental-bridges | span | See denture solutions → /treatments/dentures | Primary: Plan a bridge fitting → /contact<br>Secondary: See denture solutions → /treatments/dentures<br>Tertiary: Explore implant options → /treatments/dental-implants |
| /treatments/dental-crowns | coverage | Compare bridge planning → /treatments/dental-bridges | Primary: Book a crown consultation → /contact<br>Secondary: Consider bridge planning → /treatments/dental-bridges<br>Tertiary: See denture alternatives → /treatments/dentures |
| /treatments/dentures | full_replacement | Explore implant-retained dentures → /treatments/implant-retained-dentures | Primary: Arrange a denture review → /contact<br>Secondary: Explore implant-retained dentures → /treatments/implant-retained-dentures<br>Tertiary: See bridge alternatives → /treatments/dental-bridges |
| /treatments/inlays-onlays | conservative_restoration | Compare full crown coverage → /treatments/dental-crowns | Primary: Book an onlay assessment → /contact<br>Secondary: Compare crown coverage → /treatments/dental-crowns<br>Tertiary: Review tooth wear planning → /treatments/tooth-wear-broken-teeth |
| /treatments/tooth-wear-broken-teeth | diagnosis | See dental crown protection → /treatments/dental-crowns | Primary: Book a restorative assessment → /contact<br>Secondary: See crown coverage options → /treatments/dental-crowns<br>Tertiary: Review onlay repairs → /treatments/inlays-onlays |

## Advanced Implants

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/dental-implants | placement | Explore implant-retained dentures → /treatments/implant-retained-dentures | Primary: Book an implant assessment → /contact<br>Secondary: Explore implant-retained dentures → /treatments/implant-retained-dentures<br>Tertiary: See guided surgery planning → /treatments/cbct-guided-surgery |
| /treatments/implant-aftercare | aftercare | Review implant hygiene support → /treatments/hygiene | Primary: Schedule implant aftercare → /contact<br>Secondary: Review hygiene support → /treatments/hygiene<br>Tertiary: Check implant denture maintenance → /treatments/implant-retained-dentures |
| /treatments/implant-consultation | planning | See dental implant options → /treatments/dental-implants | Primary: Arrange an implant consultation → /contact<br>Secondary: See dental implant options → /treatments/dental-implants<br>Tertiary: Review guided surgery planning → /treatments/cbct-guided-surgery |
| /treatments/implant-retained-dentures | restoration | See implant aftercare guidance → /treatments/implant-aftercare | Primary: Plan implant-retained dentures → /contact<br>Secondary: See implant aftercare guidance → /treatments/implant-aftercare<br>Tertiary: Review implant consultation → /treatments/implant-consultation |

## Orthodontic & Stability

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/clear-aligners | aligner_pathway | Plan retention early → /treatments/retainers | Primary: Start an aligner consultation → /contact<br>Secondary: Plan retainers → /treatments/retainers<br>Tertiary: Protect with night guards → /treatments/night-guards-occlusal-splints |
| /treatments/fixed-braces | active_alignment | Plan retainers after braces → /treatments/retainers | Primary: Arrange orthodontic consultation → /contact<br>Secondary: Compare clear aligners → /treatments/clear-aligners<br>Tertiary: Plan retention → /treatments/retainers |
| /treatments/night-guards-occlusal-splints | protection | Review retainer options → /treatments/retainers | Primary: Arrange splint fitting → /contact<br>Secondary: See retainer options → /treatments/retainers<br>Tertiary: Manage jaw comfort → /treatments/tmj-jaw-comfort |
| /treatments/retainers | retention | Protect with night guards → /treatments/night-guards-occlusal-splints | Primary: Book a retainer check → /contact<br>Secondary: Protect with night guards → /treatments/night-guards-occlusal-splints<br>Tertiary: Refresh aligner planning → /treatments/clear-aligners |

## Aesthetic Smile

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/3d-printed-veneers | preview | View digital smile design → /treatments/digital-smile-design | Primary: Plan 3D printed veneer review → /contact<br>Secondary: View digital smile design → /treatments/digital-smile-design<br>Tertiary: Compare porcelain veneers → /treatments/veneers |
| /treatments/composite-bonding | refinement | Explore injection-moulded composite → /treatments/injection-moulded-composite | Primary: Plan bonding consultation → /contact<br>Secondary: Explore injection-moulded composite → /treatments/injection-moulded-composite<br>Tertiary: Consider veneers → /treatments/veneers |
| /treatments/digital-smile-design | planning | Plan veneer options → /treatments/veneers | Primary: Book smile design consult → /contact<br>Secondary: See veneer options → /treatments/veneers<br>Tertiary: Explore bonding refinements → /treatments/composite-bonding |
| /treatments/injection-moulded-composite | transitional | Compare veneer options → /treatments/veneers | Primary: Schedule composite review → /contact<br>Secondary: Compare veneer options → /treatments/veneers<br>Tertiary: See whitening planning → /treatments/teeth-whitening |
| /treatments/teeth-whitening | shade_set | Pair with composite bonding → /treatments/composite-bonding | Primary: Book whitening consultation → /contact<br>Secondary: See bonding refinements → /treatments/composite-bonding<br>Tertiary: Preview digital smile design → /treatments/digital-smile-design |
| /treatments/veneers | porcelain | Try 3D printed veneers → /treatments/3d-printed-veneers | Primary: Book veneer consultation → /contact<br>Secondary: Try 3D printed veneers → /treatments/3d-printed-veneers<br>Tertiary: See digital smile design → /treatments/digital-smile-design |

## Digital & 3D Dentistry

| Page | Journey role | Mid-page CTA | Closing CTAs |
| --- | --- | --- | --- |
| /treatments/3d-digital-dentistry | workflow_intro | See 3D printed dentures → /treatments/3d-printed-dentures | Primary: Book digital workflow consult → /contact<br>Secondary: See 3D printed dentures → /treatments/3d-printed-dentures<br>Tertiary: Explore guided surgery planning → /treatments/cbct-guided-surgery |
| /treatments/3d-printed-dentures | removable | See implant restorations → /treatments/3d-printed-implant-restorations | Primary: Plan 3D denture consult → /contact<br>Secondary: See implant restorations → /treatments/3d-printed-implant-restorations<br>Tertiary: Review denture care → /treatments/dentures |
| /treatments/3d-printed-implant-restorations | restorative | See guided surgery planning → /treatments/cbct-guided-surgery | Primary: Book implant restoration review → /contact<br>Secondary: See guided surgery planning → /treatments/cbct-guided-surgery<br>Tertiary: Review implant consultation → /treatments/implant-consultation |
| /treatments/cbct-guided-surgery | guided_planning | See dental implant options → /treatments/dental-implants | Primary: Plan guided surgery consult → /contact<br>Secondary: See dental implant options → /treatments/dental-implants<br>Tertiary: Review 3D workflow → /treatments/3d-digital-dentistry |
