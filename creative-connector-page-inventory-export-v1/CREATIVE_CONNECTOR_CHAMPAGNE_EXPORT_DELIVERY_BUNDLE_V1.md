# Creative Connector Champagne Export Delivery Bundle V1

## Purpose
This portable delivery bundle gives the user a practical, copyable way to provide the Champagne page inventory export files to Codex while working in the agent repo. It does not add website execution authority and does not mutate website source, website content, routes, metadata, deployment state, providers, crawling, screenshots, or PHI.

## Exact file list
| Source file in Champagne repo | Size (bytes) | Target path in agent repo | Delivery method |
| --- | ---: | --- | --- |
| `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json` | 1084517 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json` | Reassemble from delivery chunks listed below |
| `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json` | 578 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json` | Embedded below; also available as source file |
| `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md` | 13834 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md` | Embedded below; also available as source file |
| `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md` | 2725 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md` | Embedded below; also available as source file |

## Clear user delivery instructions
1. In the agent repo, create the folder `tools/agent/data/imports/champagne-page-inventory/` if it does not already exist.
2. Copy the three smaller support files from the embedded sections below into their exact target paths.
3. For the large `CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json`, open/copy/download every chunk file listed in `delivery-chunks/` and concatenate them in numeric order from `part001` through `part008` with no separators.
4. Save the reassembled large JSON as `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json` in the agent repo.
5. Provide the four files to agent Codex and use the prompt in `CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md` / the next-campaign prompt. The import must remain read-only.

## Large JSON export delivery chunks
- Large source file: `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json`.
- Large source file size: 1084517 bytes.
- Chunk directory: `creative-connector-page-inventory-export-v1/delivery-chunks/`.
- Chunk manifest: `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.CHUNK_MANIFEST.md`.

### Chunk manifest content
````markdown
# Champagne Page Inventory Export V1 Chunk Manifest

## Reassembly target
- `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json`

## Source checksum
- Source file size: 1084517 bytes
- Source SHA-256: `519aa3493144e3fc278a6890ec04fb473071eeb5505d1bad524abf453403f041`

## Chunk order
| Order | Chunk path | Size (bytes) | SHA-256 |
| ---: | --- | ---: | --- |
| 1 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part001.txt` | 140000 | `cab872861c418ceb868b6a113907c1cd9e73c4176792255fdb540c85658194bd` |
| 2 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part002.txt` | 140000 | `0c5731721d122fe55dc5d66c1ff6fa538e8f18e73db70d0e1ed404c1dd0580fe` |
| 3 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part003.txt` | 140000 | `b15ef422fd0586c2a43d1f2b5bc8f6471a681852e04328d80d8445a461919ab4` |
| 4 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part004.txt` | 140000 | `e37b60a860facffce036d47926830a713927054c4d7f87a704cc354fb940d963` |
| 5 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part005.txt` | 140000 | `619de4d7c6ee2b1a2ab527baab591a1c58fe3dd2b36a7b6b9be9562208cedc15` |
| 6 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part006.txt` | 140000 | `c2e80bc5ab9fcb3e67b0ffab95a886d619be52913a21de6523529db88761c0a1` |
| 7 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part007.txt` | 140000 | `05655d2a1ec9cd984c9e8d2bb52d57b0fc44a8dd36c876c47d3444976a0970af` |
| 8 | `creative-connector-page-inventory-export-v1/delivery-chunks/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.part008.txt` | 104517 | `cc4eb5c2c7bf112b237f4941d2376b4a26425e77eff4d6a5d98992583b00af57` |

## Agent reassembly instruction
Concatenate the chunks in the exact order above with no separators to recreate `CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json`, then validate the SHA-256 and run the agent-side import validation.
````

## Embedded support file: CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json
````json
{
  "schemaVersion": "CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1",
  "exportCreated": true,
  "repoMutatedExistingFiles": false,
  "websiteBehaviourChanged": false,
  "contentRewritten": false,
  "routesChanged": false,
  "metadataChanged": false,
  "mediaChanged": false,
  "deploymentRun": false,
  "phiTouched": false,
  "networkCallsMade": false,
  "pagesFound": 103,
  "extractionStatusSummary": {
    "EXTRACTED_DECLARED": 46,
    "PARTIAL": 57
  },
  "recommendedImportTarget": "agent Creative Connector Phase 13 Champagne Inventory Import",
  "launchReadyClaim": false
}
````

## Embedded support file: CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md
````markdown
# Champagne Page Inventory Export V1

## No-mutation posture
This export was generated by static repository inspection only. It creates a read-only inventory directory and does not change Champagne website source files, routes, metadata, media, content, runtime behaviour, deployment state, PHI, or provider integrations.

## Summary
- Pages found: 103
- Page types: home (1), hub (1), editorial (2), utility (9), site (1), legal (5), team_hub (1), team_detail (3), treatment_hub (1), treatment_detail (79)
- Extraction coverage: EXTRACTED_DECLARED (46), PARTIAL (57)
- Clinical/treatment-review risk pages: 80
- CTA blocks recorded: 306
- Media slots recorded: 128

## Routes found
- / — home — EXTRACTED_DECLARED
- /about — hub — EXTRACTED_DECLARED
- /blog — editorial — EXTRACTED_DECLARED
- /contact — utility — EXTRACTED_DECLARED
- /dental-checkups-oral-cancer-screening — site — EXTRACTED_DECLARED
- /downloads — utility — EXTRACTED_DECLARED
- /fees — utility — EXTRACTED_DECLARED
- /finance — utility — EXTRACTED_DECLARED
- /legal/accessibility — legal — EXTRACTED_DECLARED
- /legal/complaints — legal — EXTRACTED_DECLARED
- /legal/cookies — legal — EXTRACTED_DECLARED
- /legal/privacy — legal — EXTRACTED_DECLARED
- /legal/terms — legal — EXTRACTED_DECLARED
- /newsletter — utility — EXTRACTED_DECLARED
- /patient-portal — utility — EXTRACTED_DECLARED
- /practice-plan — utility — EXTRACTED_DECLARED
- /smile-gallery — editorial — EXTRACTED_DECLARED
- /team — team_hub — EXTRACTED_DECLARED
- /team/nick-maxwell — team_detail — EXTRACTED_DECLARED
- /team/sara-burden — team_detail — EXTRACTED_DECLARED
- /team/sylvia-krafft — team_detail — EXTRACTED_DECLARED
- /technology — utility — EXTRACTED_DECLARED
- /treatments — treatment_hub — EXTRACTED_DECLARED
- /treatments/3d-dentistry-and-technology — treatment_detail — PARTIAL
- /treatments/3d-digital-dentistry — treatment_detail — PARTIAL
- /treatments/3d-implant-restorations — treatment_detail — PARTIAL
- /treatments/3d-printed-dentures — treatment_detail — PARTIAL
- /treatments/3d-printed-veneers — treatment_detail — PARTIAL
- /treatments/3d-printing-lab — treatment_detail — PARTIAL
- /treatments/acrylic-dentures — treatment_detail — PARTIAL
- /treatments/anti-wrinkle-treatments — treatment_detail — PARTIAL
- /treatments/broken-chipped-cracked-teeth — treatment_detail — EXTRACTED_DECLARED
- /treatments/bruxism-and-jaw-clenching — treatment_detail — PARTIAL
- /treatments/cbct-3d-scanning — treatment_detail — PARTIAL
- /treatments/childrens-dentistry — treatment_detail — EXTRACTED_DECLARED
- /treatments/chrome-dentures — treatment_detail — PARTIAL
- /treatments/clear-aligners — treatment_detail — PARTIAL
- /treatments/clear-aligners-spark — treatment_detail — PARTIAL
- /treatments/composite-bonding — treatment_detail — EXTRACTED_DECLARED
- /treatments/cosmetic-dentistry — treatment_detail — PARTIAL
- /treatments/dental-abscess-infection — treatment_detail — EXTRACTED_DECLARED
- /treatments/dental-bridges — treatment_detail — PARTIAL
- /treatments/dental-checkups-oral-cancer-screening — treatment_detail — EXTRACTED_DECLARED
- /treatments/dental-crowns — treatment_detail — PARTIAL
- /treatments/dental-fillings — treatment_detail — PARTIAL
- /treatments/dental-retainers — treatment_detail — PARTIAL
- /treatments/dental-trauma-accidents — treatment_detail — EXTRACTED_DECLARED
- /treatments/dentures — treatment_detail — PARTIAL
- /treatments/dermal-fillers — treatment_detail — PARTIAL
- /treatments/digital-smile-design — treatment_detail — PARTIAL
- /treatments/emergency-dental-appointments — treatment_detail — EXTRACTED_DECLARED
- /treatments/emergency-dentistry — treatment_detail — EXTRACTED_DECLARED
- /treatments/endodontics-root-canal — treatment_detail — EXTRACTED_DECLARED
- /treatments/extractions-and-oral-surgery — treatment_detail — EXTRACTED_DECLARED
- /treatments/facial-aesthetics — treatment_detail — PARTIAL
- /treatments/facial-pain-and-headache — treatment_detail — PARTIAL
- /treatments/facial-therapeutics — treatment_detail — PARTIAL
- /treatments/failed-implant-replacement — treatment_detail — PARTIAL
- /treatments/fixed-braces — treatment_detail — PARTIAL
- /treatments/full-smile-makeover — treatment_detail — EXTRACTED_DECLARED
- /treatments/home-teeth-whitening — treatment_detail — EXTRACTED_DECLARED
- /treatments/implant-aftercare — treatment_detail — PARTIAL
- /treatments/implant-consultation — treatment_detail — PARTIAL
- /treatments/implant-retained-dentures — treatment_detail — PARTIAL
- /treatments/implants — treatment_detail — PARTIAL
- /treatments/implants-bone-grafting — treatment_detail — PARTIAL
- /treatments/implants-full-arch — treatment_detail — PARTIAL
- /treatments/implants-multiple-teeth — treatment_detail — PARTIAL
- /treatments/implants-single-tooth — treatment_detail — PARTIAL
- /treatments/injection-moulded-composite — treatment_detail — EXTRACTED_DECLARED
- /treatments/inlays-onlays — treatment_detail — PARTIAL
- /treatments/knocked-out-tooth — treatment_detail — EXTRACTED_DECLARED
- /treatments/lost-crowns-veneers-fillings — treatment_detail — EXTRACTED_DECLARED
- /treatments/mouthguards-and-retainers — treatment_detail — PARTIAL
- /treatments/nervous-patients — treatment_detail — PARTIAL
- /treatments/night-guards-occlusal-splints — treatment_detail — PARTIAL
- /treatments/orthodontics — treatment_detail — PARTIAL
- /treatments/painless-numbing-the-wand — treatment_detail — PARTIAL
- /treatments/peek-partial-dentures — treatment_detail — PARTIAL
- /treatments/periodontal-gum-care — treatment_detail — PARTIAL
- /treatments/polynucleotides — treatment_detail — PARTIAL
- /treatments/preventative-and-general-dentistry — treatment_detail — EXTRACTED_DECLARED
- /treatments/preventive-dentistry — treatment_detail — PARTIAL
- /treatments/sedation-dentistry — treatment_detail — PARTIAL
- /treatments/sedation-for-implants — treatment_detail — PARTIAL
- /treatments/senior-mature-smile-care — treatment_detail — PARTIAL
- /treatments/severe-toothache-dental-pain — treatment_detail — EXTRACTED_DECLARED
- /treatments/sinus-lift — treatment_detail — PARTIAL
- /treatments/skin-boosters — treatment_detail — PARTIAL
- /treatments/sports-mouthguards — treatment_detail — PARTIAL
- /treatments/surgically-guided-implants — treatment_detail — PARTIAL
- /treatments/teeth-in-a-day — treatment_detail — PARTIAL
- /treatments/teeth-replacement — treatment_detail — PARTIAL
- /treatments/teeth-whitening — treatment_detail — EXTRACTED_DECLARED
- /treatments/teeth-whitening-faqs — treatment_detail — EXTRACTED_DECLARED
- /treatments/therapeutic-facial-injectables — treatment_detail — PARTIAL
- /treatments/tmj-disorder-treatment — treatment_detail — PARTIAL
- /treatments/tmj-jaw-comfort — treatment_detail — PARTIAL
- /treatments/tooth-wear-broken-teeth — treatment_detail — EXTRACTED_DECLARED
- /treatments/veneers — treatment_detail — PARTIAL
- /treatments/whitening-sensitive-teeth — treatment_detail — EXTRACTED_DECLARED
- /treatments/whitening-top-ups — treatment_detail — EXTRACTED_DECLARED
- /video-consultation — utility — EXTRACTED_DECLARED

## Blocked or partial pages
- /treatments/3d-dentistry-and-technology: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/3d-digital-dentistry: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/3d-implant-restorations: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/3d-printed-dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/3d-printed-veneers: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/3d-printing-lab: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/acrylic-dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/anti-wrinkle-treatments: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/bruxism-and-jaw-clenching: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/cbct-3d-scanning: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/chrome-dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/clear-aligners: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/clear-aligners-spark: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/cosmetic-dentistry: ROUTE_NOT_PRESENT_IN_EXISTING_PAGE_TRUTH_INDEX, SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dental-bridges: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dental-crowns: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dental-fillings: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dental-retainers: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/dermal-fillers: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/digital-smile-design: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/facial-aesthetics: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/facial-pain-and-headache: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/facial-therapeutics: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/failed-implant-replacement: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/fixed-braces: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implant-aftercare: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implant-consultation: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implant-retained-dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implants: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implants-bone-grafting: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implants-full-arch: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implants-multiple-teeth: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/implants-single-tooth: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/inlays-onlays: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/mouthguards-and-retainers: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/nervous-patients: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/night-guards-occlusal-splints: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/orthodontics: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/painless-numbing-the-wand: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/peek-partial-dentures: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/periodontal-gum-care: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/polynucleotides: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/preventive-dentistry: ROUTE_NOT_PRESENT_IN_EXISTING_PAGE_TRUTH_INDEX, SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/sedation-dentistry: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/sedation-for-implants: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/senior-mature-smile-care: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/sinus-lift: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/skin-boosters: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/sports-mouthguards: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/surgically-guided-implants: ROUTE_NOT_PRESENT_IN_EXISTING_PAGE_TRUTH_INDEX, SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/teeth-in-a-day: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/teeth-replacement: ROUTE_NOT_PRESENT_IN_EXISTING_PAGE_TRUTH_INDEX, SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/therapeutic-facial-injectables: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/tmj-disorder-treatment: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/tmj-jaw-comfort: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT
- /treatments/veneers: SECTION_REFERENCE_WITHOUT_INLINE_CONTENT

## Unknown fields and extraction caveats
- H1 values are set to UNKNOWN for every page because H1 was not explicitly extracted from runtime-rendered markup; manifest labels and section titles were not treated as H1.
- Meta descriptions use manifest description/intro fields where present; missing values are preserved as null rather than guessed.
- Treatment detail pages may contain section references whose runtime default content is resolved through the page builder/section system; those pages are marked PARTIAL when inline content could not be fully declared from the primary manifest.
- Four manifest treatment routes are absent from the existing page-truth index and are therefore marked PARTIAL: /treatments/cosmetic-dentistry, /treatments/preventive-dentistry, /treatments/surgically-guided-implants, /treatments/teeth-replacement.
- Media slots are recorded only for explicit hero bindings, media/map section types, or manifest media hints; no visual guesses, screenshots, or browser crawls were used.
- SEO/schema extraction is based on static metadata/JSON-LD patterns and manifest values. Payloads were not browser-rendered.

## Files or patterns not safely interpreted
- Runtime renderer output was not executed; component-level H1 and final rendered schema payload details remain unconfirmed.
- Dynamic catch-all behaviour in apps/web/app/(site)/[page]/page.tsx is represented through manifest route matching, not by crawling.
- API/route handlers are listed as observed non-page route handlers in the JSON export but are not emitted as page objects.

## Import posture for Creative Connector OS
- Recommended import target: agent Creative Connector Phase 13 Champagne Inventory Import
- Import must treat this as a read-only page read-model source and must not mutate Champagne.
````

## Embedded support file: CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md
````markdown
# Champagne Page Inventory Import Instructions for Agent V1

## Export location

Read these files from the Champagne repository without mutating Champagne:

- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json
- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md
- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json

## Expected schema shape

The JSON export root contains schemaVersion, sourceRepo, generationMode, routeSourcePatterns, nonPageRouteHandlersObserved, sourceFilesRead, recommendedImportTarget, and pages.
Each pages[] object contains schemaVersion, pageId, sourceRepo, route, pageType, routeGroup, title, h1, metaDescription, canonicalPath, contentBlocks, ctaBlocks, mediaSlots, componentRefs, seoFields, structuredDataFields, sourceFileRefs, riskFlags, rewriteEligibility, mediaPlacementEligibility, bundleEligibility, unknownFields, extractionStatus, extractionBlockers, evidenceRefs, authorityPosture, and notes.

## Known partial/unknown extraction caveats

- h1 is intentionally UNKNOWN unless explicitly extracted; do not infer it from title or labels during import.
- PARTIAL pages must retain extractionBlockers and unknownFields.
- Clinical/treatment pages carry CLINICAL_CONTENT_REVIEW_REQUIRED and must not be treated as approved rewrite candidates.
- Four manifest treatment routes are not present in the existing page-truth index and remain partial evidence records.
- Media slots represent structural inventory only; they are not placement instructions.
- The export did not render pages, crawl the site, call providers, or make network requests.

## Suggested validation rules

- Validate schemaVersion equals CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1 at root and on every page.
- Validate pageId and route are unique.
- Validate authorityPosture.canMutateChampagne, canApplyRewrite, canPublish, canDeploy, canTouchPhi, networkCallsAllowed, providerCallsAllowed, and launchReadyClaimAllowed are all false for every page.
- Validate status flags keep repoMutatedExistingFiles, websiteBehaviourChanged, contentRewritten, routesChanged, metadataChanged, mediaChanged, deploymentRun, phiTouched, networkCallsMade, and launchReadyClaim false.
- Preserve unknownFields, extractionBlockers, evidenceRefs, and riskFlags verbatim in the imported read model.

## Suggested next agent prompt path

Use: agent Creative Connector Phase 13 Champagne Inventory Import.
Import the JSON as a read-only Champagne page read-model contract source. Do not mutate the Champagne repository. Do not rewrite content, alter routes, change media, deploy, publish, touch PHI, call providers, or claim launch readiness.
````

## Copy readiness
Yes. The four Creative Connector Champagne export/support files exist and are prepared for manual delivery to the agent repo import drop. The large JSON export is delivered through ordered chunks so the user does not need to hunt through the repo or manually dig with shell commands.
