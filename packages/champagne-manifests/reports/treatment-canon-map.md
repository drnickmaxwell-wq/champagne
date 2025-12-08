# Treatment Canon Map

Snapshot of treatment routes in the Champagne manifests. Hero and section indicators show whether a preset and section stack are defined for the slug.

| Slug | Title | Hero | Sections | Layout |
| --- | --- | --- | --- | --- |
| 3d-dentistry-and-technology | 3D dentistry & technology | ✅ | ✅ | Simple |
| 3d-implant-restorations | 3D implant restorations (IBEX high-tech) | ✅ | ✅ | Rich |
| 3d-printed-veneers | 3D printed veneers (IBEX high-tech) | ✅ | ✅ | Rich |
| 3d-printing-lab | 3D printing lab | ✅ | ✅ | Simple |
| cbct-3d-scanning | CBCT & 3D scanning | ✅ | ✅ | Simple |
| childrens-dentistry | Children’s dentistry | ✅ | ✅ | Simple |
| clear-aligners | Clear aligner orthodontics (Spark and other systems) | ✅ | ✅ | Rich |
| composite-bonding | Composite bonding | ✅ | ✅ | Rich |
| crowns-bridges-restorative | Crowns, bridges & restorative dentistry | ✅ | ✅ | Simple |
| digital-smile-design | Digital smile design | ✅ | ✅ | Simple |
| emergency-dentistry | Emergency dentistry | ✅ | ✅ | Simple |
| endodontics-root-canal | Endodontics & root canal care | ✅ | ✅ | Simple |
| extractions-and-oral-surgery | Extractions & oral surgery | ✅ | ✅ | Simple |
| full-smile-makeover | Full smile makeover | ✅ | ✅ | Rich |
| implants | Implant dentistry | ✅ | ✅ | Simple |
| implants-full-arch | Full arch implant rehabilitation | ✅ | ✅ | Simple |
| implants-multiple-teeth | Multiple teeth implant options | ✅ | ✅ | Simple |
| implants-single-tooth | Single tooth implant solutions | ✅ | ✅ | Simple |
| orthodontics | Orthodontics | ✅ | ✅ | Simple |
| painless-numbing-the-wand | Painless numbing with The Wand | ✅ | ✅ | Rich |
| periodontal-gum-care | Periodontal & gum care | ✅ | ✅ | Simple |
| preventative-and-general-dentistry | Preventative & general dentistry | ✅ | ✅ | Simple |
| senior-mature-smile-care | Senior & mature smile care | ✅ | ✅ | Simple |
| tmj-jaw-comfort | TMJ & jaw comfort | ✅ | ✅ | Simple |
| veneers | Veneers | ✅ | ✅ | Simple |
| whitening | Teeth whitening | ✅ | ✅ | Simple |
| whitening-at-home | Whitening at home | ✅ | ✅ | Rich |
| whitening-in-surgery | In-surgery whitening | ✅ | ✅ | Rich |

## Phase 5 wiring

- /treatments index now renders directly from the manifest canon (no hard-coded lists).
- Hero presets now resolve IDs through `manifest.styles.champagne.json` so treatment heroes render with a palette/motion preset even when only an ID is present in the page manifest.
- Section stacks flow through the adapter in `@champagne/sections`, which fills neutral copy for sparse manifest entries while keeping the canon order intact.
- Treatment slugs routed through the Champagne builder:
  - 3d-dentistry-and-technology
  - 3d-implant-restorations
  - 3d-printed-veneers
  - 3d-printing-lab
  - cbct-3d-scanning
  - childrens-dentistry
  - clear-aligners
  - composite-bonding
  - crowns-bridges-restorative
  - digital-smile-design
  - emergency-dentistry
  - endodontics-root-canal
  - extractions-and-oral-surgery
  - full-smile-makeover
  - implants
  - implants-full-arch
  - implants-multiple-teeth
  - implants-single-tooth
  - orthodontics
  - periodontal-gum-care
  - preventative-and-general-dentistry
  - senior-mature-smile-care
  - tmj-jaw-comfort
  - veneers
  - whitening
  - whitening-at-home
  - whitening-in-surgery
  - painless-numbing-the-wand

Rich layout stack (overview rich, media feature, tools trio, clinician insight / stories as applicable, FAQ, closing CTA):
- composite-bonding
- 3d-printed-veneers
- 3d-implant-restorations
- whitening-in-surgery
- whitening-at-home
- clear-aligners
- full-smile-makeover
- painless-numbing-the-wand
