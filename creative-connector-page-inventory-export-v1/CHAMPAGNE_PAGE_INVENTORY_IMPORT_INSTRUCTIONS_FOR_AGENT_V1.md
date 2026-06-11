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
