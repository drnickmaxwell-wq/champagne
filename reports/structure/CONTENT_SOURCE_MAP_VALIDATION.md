# Content Source Map Validation

Generated: 2026-02-05T16:49:23.921653Z

## File existence and parsing checks

| File | Exists | Parse | Size (bytes) | Notes |
|---|---:|---:|---:|---|
| `reports/patient_content_audit/content_source_classification.json` | PASS | PASS | 52127 | type=list; keys=evidence,route,routeId,sourceType; counts=items:105 |
| `reports/patient_content_audit/content_truth_map.json` | PASS | PASS | 2735066 | type=dict; keys=blocks; counts=blocks:10142 |
| `reports/patient_content_audit/duplication_summary.json` | PASS | PASS | 134 | type=dict; keys=totalPublicRoutes,totalPatientFacingTextBlocks,numberOfSharedBlocks,numberOfUniqueBlocks; counts= |
| `reports/patient_content_audit/route_inventory.json` | PASS | PASS | 46920 | type=list; keys=evidence,route,routeId; counts=items:105 |
| `reports/patient_content_audit/shared_content_analysis.json` | PASS | PASS | 783897 | type=dict; keys=exactMatches,nearMatches; counts=exactMatches:742; nearMatches:750 |
| `scripts/patient_content_audit.py` | PASS | N/A | 24736 | type=; keys=; counts= |
| `reports/structure/content-source-map.v1.json` | PASS | PASS | 95111 | type=dict; keys=schema,generatedAt,repoRootAssumed,inputs,stats,routes; counts=schema:31; generatedAt:24; repoRootAssumed:20; inputs:4; stats:3; routes:108 |
| `packages/champagne-guards/scripts/report-content-source-map.mjs` | PASS | N/A | 11606 | type=; keys=; counts= |
| `packages/champagne-guards/package.json` | PASS | PASS | 1978 | type=dict; keys=name,private,version,main,types,files,scripts,dependencies; counts=name:17; version:5; main:13; types:15; files:7; scripts:20; dependencies:1 |

## Coverage metrics
- Canonical route source: `route_truth_ledger`
- Canonical route count: **99**
- System A coverage: **99 / 99 (100.0%)**
- System B coverage: **99 / 99 (100.0%)**

## Internal consistency
### System A
- Inventory-only routes: 1
- Mapped-only routes: 0
- Duplicate route keys (inventory): 0
- Duplicate route keys (mapped): 104
- FALLBACK/DERIVED entries: 0
### System B
- DERIVED entries: 0

## Integrity metrics
- System A broken targets: 0
- System A broken pointers/keys: 0
- System B broken targets: 0
- System B broken pointers/keys: 0

## Reconciliation (System A vs System B)
- Same target routes: 99
- Conflicts: 0
- Routes only in A: 6
- Routes only in B: 9

| Route | A target | B target | Winner |
|---|---|---|---|

## Duplication + cannibalisation signals
### Top 20 exact duplicated items
1. (104 routes) `Join list`
2. (104 routes) `Sign up to hear about new treatments and Champagne build milestones.`
3. (104 routes) `Contact`
4. (104 routes) `St Mary's House Dental`
5. (104 routes) `Home`
6. (104 routes) `Explore`
7. (104 routes) `Contact us`
8. (104 routes) `About`
9. (104 routes) `Team`
10. (104 routes) `Luxe ink gradient with soft particle bloom, tuned for calm reading and brand gold accents. Crafted for the Champagne eco`
11. (104 routes) `Fees`
12. (104 routes) `Cookies policy`
13. (104 routes) `Blog`
14. (104 routes) `View treatments`
15. (104 routes) `Complaints policy`
16. (104 routes) `Smile gallery`
17. (104 routes) `Privacy policy`
18. (104 routes) `Support`
19. (104 routes) `Champagne finish`
20. (104 routes) `Accessibility`
### Top 20 high-overlap near matches
1. (104 routes) `Contact`
2. (104 routes) `Privacy policy`
3. (104 routes) `Sign up to hear about new treatments and Champagne build milestones.`
4. (104 routes) `Cookies policy`
5. (104 routes) `St Mary's House Dental`
6. (104 routes) `Contact us`
7. (104 routes) `Home`
8. (104 routes) `Downloads`
9. (104 routes) `Email address`
10. (104 routes) `Terms`
11. (104 routes) `Join list`
12. (104 routes) `Explore`
13. (104 routes) `Accessibility`
14. (104 routes) `Stay in sync`
15. (104 routes) `Luxe ink gradient with soft particle bloom, tuned for calm reading and brand gold accents. Crafted for the Champagne eco`
16. (104 routes) `View treatments`
17. (104 routes) `Fees`
18. (104 routes) `Support`
19. (104 routes) `About`
20. (104 routes) `Team`

## SAFE-TO-USE verdicts
- System A: **SAFE**
- System B: **SAFE**
- Combined: **SAFE**

## How to use these maps for no-drift updates
1. Start from a canonical route (from route-truth ledger / machine manifest-backed list).
2. Resolve the route in System B first (or System A fallback) to get exact `file path + pointer` target.
3. Patch only that target file and keep semantics/token rules intact.
4. Re-run map generators and this validation report; ensure zero new broken targets/pointers and conflict count does not rise.
5. Run `npm run guard:hero`, `npm run guard:canon`, and `npm run verify` before merge.
