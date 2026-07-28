# Champagne Stage 1 Documentation Receipt V1

**Document ID:** `CHAMPAGNE_STAGE_1_DOCUMENTATION_RECEIPT_V1`
**Stage:** `0_CANONICAL_DOCUMENTATION`
**Date:** 2026-07-28
**Branch:** `docs/champagne-stage-1-canon-v1-20260728`
**Status:** Stage 1 canon corrected under Founder and Main Directorate A01–A06 authority; no merge or deployment authority

## Inputs

- Founder authority: `CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`
- Corrective Main Directorate authority:
  `MAIN_DIRECTORATE_APPROVES_CHAMPAGNE_PR857_AMENDMENTS_CHAMP_S1_A01_TO_A06_V1`
- Corrective Founder authority:
  `FOUNDER_AUTHORISATION_CHAMPAGNE_PR857_AMENDMENTS_CHAMP_S1_A01_TO_A06_V1`
- Founder instruction to complete Stage 1 in the Champagne repository.
- The exact Markdown and JSON payloads supplied for the Stage 1 programme canon.
- The bounded `AGENTS.md` section supplied for one-time insertion.
- Recorded Champagne freeze commit: `7be05b21a36e2fbc899c41ced4f7ce7c6cdeaad9`
- Source-recorded erroneous Champagne freeze tree:
  `b5ca7b5f6ac3f988e6ec9a9ced586ad34dd411b9`
- Authoritative verified Champagne freeze tree:
  `b5ca7f10f5fb8e05cccd37676a58194ac6ee28ca`
- Recorded chatbot-engine freeze commit: `875604639b6c01495b0c41b9fe843be8c8e4eda6`

## Source documents

### Supplied Stage 1 sources

- `CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2`
- `CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1`
- `CHAMPAGNE_CANON_PROGRAMME_INDEX_V1`
- `CHAMPAGNE_AUTHORITY_AND_FREEZE_CONTRACT_V1`
- `CHAMPAGNE_STAGE_1_DOCUMENTATION_ACCEPTANCE_V1`
- `CHAMPAGNE_AGENTS_CANON_ENTRY_PROPOSAL_V1`

### Existing repository sources reviewed

- `AGENTS.md`
- `docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md`
- `docs/canon/operations/CHAMPAGNE_OS_OPERATIONAL_PHILOSOPHY_V1.md`
- `ops/contracts/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1.json`
- `ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json`
- `ops/contracts/PAGE_FAMILY_ROUTE_CANON_V1.json`
- `ops/contracts/PAGE_SURFACE_V1.json`
- `ops/contracts/WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json`

## Repository HEAD

- Repository root: `/Users/nickomaxwell/Documents/website - champagne`
- Starting branch: `main`
- Starting and pre-commit HEAD: `7be05b21a36e2fbc899c41ced4f7ce7c6cdeaad9`
- HEAD subject: `Add Champagne runtime readiness diagnostic (#854)`
- Working branch: `docs/champagne-stage-1-canon-v1-20260728`
- Worktree state before Stage 1: clean

## Freeze-point comparison

- The recorded Champagne freeze commit exists.
- The recorded Champagne freeze commit is the current pre-commit HEAD, so it is in history and there are no commits after the freeze to reconcile.
- Relevant approved canon created after the freeze: none.
- Verification command:
  `git rev-parse 7be05b21a36e2fbc899c41ced4f7ce7c6cdeaad9^{tree}`
- Authoritative verified result:
  `b5ca7f10f5fb8e05cccd37676a58194ac6ee28ca`.
- Historical erroneous supplied result:
  `b5ca7b5f6ac3f988e6ec9a9ced586ad34dd411b9`.
- Main Directorate and Founder resolution: preserve the erroneous value only as
  historical evidence. The verified Git tree controls operational freeze
  comparison because Git object identity is authoritative.

## Collisions found

- No pre-existing file or repository text on `main` matched any of these requested document IDs:
  - `CHAMPAGNE_CANON_PROGRAMME_INDEX_V1`
  - `CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2`
  - `CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1`
  - `CHAMPAGNE_STAGE_1_DOCUMENTATION_ACCEPTANCE_V1`
  - `CHAMPAGNE_AGENTS_CANON_ENTRY_PROPOSAL_V1`
  - `CHAMPAGNE_AUTHORITY_AND_FREEZE_CONTRACT_V1`
  - `CHAMPAGNE_STAGE_1_DOCUMENTATION_RECEIPT_V1`
- The requested remote branch `docs/champagne-stage-1-canon-v1` already existed at
  `fa7fa94ac979798948204044607504033a02c3c4`, with draft pull request
  `https://github.com/drnickmaxwell-wq/champagne/pull/856`.
- The existing unmerged branch contained materially matching Stage 1 payloads
  based directly on the recorded freeze commit. It was not treated as approved
  mainline canon.
- Per founder instruction, the safe non-conflicting branch variant
  `docs/champagne-stage-1-canon-v1-20260728` was created from `main`.
- Duplicate pull request `#856` was later closed unmerged with
  `SUPERSEDED_DUPLICATE_BY_PR_857`; its branch and head were preserved.
- Pull request `#857` remained the canonical open draft.
- No genuine contradiction with newer approved Champagne canon was found because HEAD equals the freeze commit.
- The existing active material and operational canon is additive and does not contradict the supplied Stage 1 programme documents.

## Decisions

- Preserved the V2 plan as `FOUNDER_REVIEW_DRAFT_NON_MUTATING` source direction.
- Reapplied the materially matching, unmerged Stage 1 documentation patch to the
  safe branch variant, then updated this receipt to describe the current run.
- Kept the Master Truth Amendment separate and additive, accepted it as a
  product-local overlay and granted it no runtime authority.
- Made the Stage 1 acceptance contract the controlling acceptance wrapper.
- Resolved the freeze-tree mismatch using verified Git object identity while
  retaining the supplied erroneous value as historical evidence.
- Added the founder-supplied bounded `AGENTS.md` section once without removing or rewriting unrelated instructions.
- Granted no Stage B authority and made no automatic stage advancement.
- Distinguished explicitly granted documentation transaction authority from
  installed-canon and future runtime authority.
- Made no product, Router, WEOS, chatbot-engine, runtime, clinical, booking, privacy, merge, deployment or publication change.

## Authority timeline and procedural record

- Founder documentation authority existed for the original Stage 1
  documentation work.
- Branch, commit and draft pull request preparation occurred before Main
  Directorate execution approval. Main Directorate approval did not exist at
  that time. Its later approval was retrospective and is not backdated.
- No merge occurred, no product code changed and no production runtime change
  occurred.
- Opening the draft pull requests triggered automated non-production Vercel
  preview deployments. No manual preview deployment and no production
  deployment occurred.
- The work entered retrospective Founder and Main Directorate review.
- Duplicate pull request `#856` was closed unmerged and superseded by `#857`.
  Pull request `#857` remained the canonical draft.
- The A01–A06 corrective amendments were later authorised by both the Main
  Directorate and Founder for the existing `#857` branch only.

## Exact files changed

1. `AGENTS.md`
2. `docs/canon/programmes/CHAMPAGNE_AGENTS_CANON_ENTRY_PROPOSAL_V1.md`
3. `docs/canon/programmes/CHAMPAGNE_CANON_PROGRAMME_INDEX_V1.md`
4. `docs/canon/programmes/CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1.md`
5. `docs/canon/programmes/CHAMPAGNE_STAGE_1_DOCUMENTATION_ACCEPTANCE_V1.md`
6. `docs/canon/programmes/CHAMPAGNE_STAGE_1_DOCUMENTATION_RECEIPT_V1.md`
7. `docs/canon/programmes/CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2.md`
8. `ops/contracts/CHAMPAGNE_AUTHORITY_AND_FREEZE_CONTRACT_V1.json`
9. `ops/contracts/CHAMPAGNE_CANON_PROGRAMME_INDEX_V1.json`
10. `ops/contracts/CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1.json`
11. `ops/contracts/CHAMPAGNE_STAGE_1_DOCUMENTATION_ACCEPTANCE_V1.json`
12. `ops/contracts/CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2.json`

## Changed fields

- Added the ten founder-supplied programme canon files.
- Added this Stage 1 receipt.
- Appended one `## Champagne golden-tenant canon` section to `AGENTS.md`.
- Corrected the same 12 existing Stage 1 paths under A01–A06 authority; no new
  file was added.
- Normalised freeze evidence, authority classes, product-local ownership,
  amendment acceptance and wrapper-controlled precedence.
- No product or runtime field changed.

## Tests and results

| Check | Result |
|---|---|
| Repository root and worktree check | PASS — Champagne root confirmed; starting worktree clean |
| Requested document-ID collision scan | PASS — no mainline file/ID collisions; existing remote Stage 1 branch and draft PR recorded |
| Freeze commit existence and ancestry | PASS — commit exists and equals pre-commit HEAD |
| Post-freeze canon history review | PASS — no post-freeze commits because HEAD equals freeze |
| Exact supplied payload comparison | PASS — all ten requested files match the attached heredoc payloads byte-for-byte |
| Deterministic JSON parse of five new contracts | PASS |
| Programme read-order and required documentation target existence | PASS |
| Top-level machine canon-ID uniqueness across the five new contracts | PASS |
| Bounded `AGENTS.md` section count | PASS — exactly one |
| Changed-file scope allowlist | PASS — documentation/contracts and `AGENTS.md` only |
| Authority-boundary assertions | PASS — Stage B false; chatbot implementation false; amendment mutation authorities false |
| A01–A06 corrective path allowlist | PASS — exactly the 12 authorised existing Stage 1 paths; no new files |
| Corrective JSON, read-order and precedence checks | PASS — five JSON files parsed; machine and Markdown orders agree; 23 IDs are unique; wrapper precedence and authority denials verified |
| Corrective diff whitespace check | PASS |
| Corrective `npm run guard:hero` | PASS — Hero Guard and sacred Hero lock |
| Corrective `npm run guard:canon` | PASS — retired booking routes, patient portal SSR and canon integrity |
| Corrective `npm run verify` | PASS — exact amended state in an identical temporary no-space worktree |
| Corrective security and independent exact-head review | POST-COMMIT EXACT-HEAD CHECK — report against the pushed amended SHA |
| Staged whitespace check | EXPECTED WARNINGS — founder-supplied Markdown contains intentional two-space hard breaks and was preserved exactly |
| `npm run guard:hero` | PASS |
| `npm run guard:canon` | PASS |
| `npm run verify` | PASS — token purity, workspace dependency guard, SEO launch safety, contract guard, full guard suite, lint, typecheck and production build; run from an identical temporary no-space worktree because the repository contract guard URL-encodes spaces in filesystem paths |

Validation setup notes:

- The first exact-payload harness preview expected only two payload blocks because
  the attachment had initially been read through line 520. Reading the complete
  attachment found all ten requested payloads; the corrected harness compared
  all ten files byte-for-byte and passed.
- `git diff --cached --check` identifies only intentional two-space Markdown hard
  breaks in the founder-supplied exact source. Those bytes were preserved.
- The first dependency-install attempt was blocked by the restricted package
  manager signature check; the approved-network retry succeeded.
- `pnpm install --frozen-lockfile` completed successfully without changing tracked dependency files.
- The install-only `.pnpm-store/` cache was moved out of the repository to
  `/private/tmp/champagne-stage1-pnpm-store-019fa6d5` and is not part of this change.
- `npm run guard:hero` and `npm run guard:canon` passed in the actual worktree.
- The first `npm run verify` attempt reached `guard:champagne-contracts` and
  exposed a pre-existing path-handling bug: `import.meta.url` was converted to a
  filesystem path without decoding `%20` for this workspace's space.
- Product tooling was not changed under documentation-only authority. The full
  `npm run verify` suite passed from a temporary no-space Git worktree at the
  identical freeze commit, and that temporary worktree was removed afterward.
- The corrective run copied the exact amended 12-file state into a new temporary
  no-space worktree at the required starting head. `npm run verify` passed there,
  and the temporary worktree was removed afterward.
- Non-failing repository warnings observed: stale Browserslist data, a broad Tailwind content pattern, treatment inventory `78` versus machine manifest `79`, skipped manifest sync because manifests were reported missing by that guard, and missing optional chatbot QA/conversation inputs. No warning was caused by the Stage 1 documentation files.

## Human authority

- Founder authority phrase: `CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`
- Founder explicitly required the docs-only branch, documentation commit and draft pull request for this Stage 1 execution.
- Main Directorate corrective authority:
  `MAIN_DIRECTORATE_APPROVES_CHAMPAGNE_PR857_AMENDMENTS_CHAMP_S1_A01_TO_A06_V1`
- Founder corrective authority:
  `FOUNDER_AUTHORISATION_CHAMPAGNE_PR857_AMENDMENTS_CHAMP_S1_A01_TO_A06_V1`
- Founder remains visual, product and final acceptance authority.
- The corrective authority permits only A01–A06 amendments and commit/push on
  the existing `#857` branch.
- No clinical, regulatory, booking, privacy, publication, Stage B, merge,
  production deployment, environment or secret-change authority was inferred.

## Unresolved conflicts

- The freeze-tree mismatch is resolved: verified Git tree
  `b5ca7f10f5fb8e05cccd37676a58194ac6ee28ca` controls operational comparison.
- Duplicate pull request `#856` is closed unmerged; `#857` is the canonical draft.
- Permanent WEOS, SEO, Marketing OS, tenant-platform, Foundry School and Router
  canon remain external and require future cross-lane reconciliation where
  applicable.
- Wave 13 remains an external review dependency before later merge review if a
  new Agent entry freeze is established.
- Stage B remains ungranted and requires the separate exact phrase `CHAMPAGNE_STAGE_B_HYDRATION_AND_LIFECYCLE_STABILIZATION`.

## Rollback

- Corrective rollback point:
  `5241d0ef491d7d4a42463e46c562623effd47458`.
- Before merge: reset the existing draft branch to the corrective rollback point
  only under separate rollback authority.
- After an authorised merge: revert the single Stage 1 documentation commit.
- Rollback removes only the ten supplied canon files, this receipt and the bounded `AGENTS.md` addition.
- No product/runtime rollback, deployment rollback or data migration is required because Stage 1 changes no product behaviour.
