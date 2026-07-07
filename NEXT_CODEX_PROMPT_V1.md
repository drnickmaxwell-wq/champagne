# NEXT_CODEX_PROMPT_V1

ROLE: CHAMPAGNE_WEBSITE_OS_CONTRACT_SCHEMA_IMPLEMENTER_V1

MISSION:
Implement the first non-runtime contract slice for Website OS and Live Canvas packet validation.

Scope:
- Champagne repo only.
- Contract/schema/docs only unless explicitly authorized.
- Do not mutate runtime app code.
- Do not deploy.
- Do not call providers.
- No PHI, PMS, secrets, or production changes.

Read first:
- AGENTS.md
- CHAMPAGNE_WEBSITE_OS_CONTRACT_DESIGN_V1.md
- CHAMPAGNE_WEBSITE_OS_CONTRACT_DESIGN_V1.json
- CHAMPAGNE_LIVE_CANVAS_SAFE_EDIT_CONTRACT_V1.md
- CHAMPAGNE_TENANT_BLUEPRINT_EXTRACTION_PLAN_V1.md
- CHAMPAGNE_CAMPAIGN007_REALITY_AUDIT_V1.md
- PR #850 audit reports in the repo root
- ops/contracts/WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json
- ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json

Objectives:
1. Add JSON schema files for:
   - Website OS import envelope
   - Website OS export envelope
   - Website OS safe patch packet
   - Live Canvas preview receipt
2. Add example valid and invalid packets as fixtures.
3. Add a fail-closed validator script for the fixtures only.
4. Ensure the validator rejects:
   - forbidden files
   - raw colour/style proposals
   - missing source hashes
   - missing review gates
   - launch-readiness claims
   - provider/PMS/PHI/secrets fields
5. Do not wire CI until a separate packet authorizes CI changes.

Rules:
- Design/contract tooling only.
- No runtime app code changes.
- No sacred hero edits.
- No guard weakening.
- Fail closed.

Run:
- npm run guard:hero
- npm run guard:canon
- npm run verify
- any new validator command you add

Produce:
- schema files
- fixture files
- validator script if authorized by allowed zones
- implementation report
- test results
