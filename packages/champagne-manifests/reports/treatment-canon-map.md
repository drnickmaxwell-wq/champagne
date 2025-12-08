# Treatment Canon Map

Snapshot of treatment routes in the Champagne manifests. Hero and section indicators show whether a preset and section stack are defined for the slug.

| Slug | Title | Hero | Sections |
| --- | --- | --- | --- |
| 3d-dentistry-and-technology | 3D dentistry & technology | ✅ | ✅ |
| 3d-implant-restorations | 3D implant restorations (IBEX high-tech) | ✅ | ✅ |
| 3d-printed-veneers | 3D printed veneers (IBEX high-tech) | ✅ | ✅ |
| 3d-printing-lab | 3D printing lab | ✅ | ✅ |
| cbct-3d-scanning | CBCT & 3D scanning | ✅ | ✅ |
| childrens-dentistry | Children’s dentistry | ✅ | ✅ |
| clear-aligners | Clear aligner orthodontics (Spark and other systems) | ✅ | ✅ |
| composite-bonding | Composite bonding | ✅ | ✅ |
| crowns-bridges-restorative | Crowns, bridges & restorative dentistry | ✅ | ✅ |
| digital-smile-design | Digital smile design | ✅ | ✅ |
| emergency-dentistry | Emergency dentistry | ✅ | ✅ |
| endodontics-root-canal | Endodontics & root canal care | ✅ | ✅ |
| extractions-and-oral-surgery | Extractions & oral surgery | ✅ | ✅ |
| full-smile-makeover | Full smile makeover | ✅ | ✅ |
| implants | Implant dentistry | ✅ | ✅ |
| implants-full-arch | Full arch implant rehabilitation | ✅ | ✅ |
| implants-multiple-teeth | Multiple teeth implant options | ✅ | ✅ |
| implants-single-tooth | Single tooth implant solutions | ✅ | ✅ |
| orthodontics | Orthodontics | ✅ | ✅ |
| periodontal-gum-care | Periodontal & gum care | ✅ | ✅ |
| preventative-and-general-dentistry | Preventative & general dentistry | ✅ | ✅ |
| senior-mature-smile-care | Senior & mature smile care | ✅ | ✅ |
| tmj-jaw-comfort | TMJ & jaw comfort | ✅ | ✅ |
| veneers | Veneers | ✅ | ✅ |
| whitening | Teeth whitening | ✅ | ✅ |
| whitening-at-home | Whitening at home | ✅ | ✅ |
| whitening-in-surgery | In-surgery whitening | ✅ | ✅ |

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
