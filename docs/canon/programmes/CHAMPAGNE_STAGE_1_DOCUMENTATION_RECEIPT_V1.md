# Champagne Stage 1 Documentation Receipt V1

**Document ID:** `CHAMPAGNE_STAGE_1_DOCUMENTATION_RECEIPT_V1`
**Stage:** `0_CANONICAL_DOCUMENTATION`
**Date:** 2026-07-28
**Branch:** `docs/champagne-stage-1-canon-v1-20260728`
**Status:** Stage 1 documentation prepared and validated; no merge or deployment authority

## Inputs

- Founder authority: `CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`
- Founder instruction to complete Stage 1 in the Champagne repository.
- The exact Markdown and JSON payloads supplied for the Stage 1 programme canon.
- The bounded `AGENTS.md` section supplied for one-time insertion.
- Recorded Champagne freeze commit: `7be05b21a36e2fbc899c41ced4f7ce7c6cdeaad9`
- Recorded Champagne freeze tree: `b5ca7b5f6ac3f988e6ec9a9ced586ad34dd411b9`
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
- Git reports the actual tree for commit `7be05b21a36e2fbc899c41ced4f7ce7c6cdeaad9` as `b5ca7f10f5fb8e05cccd37676a58194ac6ee28ca`.
- The supplied V2 source records the tree as `b5ca7b5f6ac3f988e6ec9a9ced586ad34dd411b9`.
- Decision: preserve the supplied V2 source exactly and report the tree mismatch rather than silently changing founder-supplied canon.

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
- No genuine contradiction with newer approved Champagne canon was found because HEAD equals the freeze commit.
- The existing active material and operational canon is additive and does not contradict the supplied Stage 1 programme documents.

## Decisions

- Preserved the supplied V2 JSON plan as the canonical machine source.
- Reapplied the materially matching, unmerged Stage 1 documentation patch to the
  safe branch variant, then updated this receipt to describe the current run.
- Kept the Master Truth Amendment separate, additive, proposed and without runtime authority.
- Added the programme index and explicit precedence/conflict rules.
- Preserved all supplied freeze values while separately recording the tree-hash evidence mismatch.
- Added the founder-supplied bounded `AGENTS.md` section once without removing or rewriting unrelated instructions.
- Granted no Stage B authority and made no automatic stage advancement.
- Treated the founder's exact current-stage instruction as authority for the required docs-only branch, commit and draft pull request under the index precedence rule.
- Made no product, Router, WEOS, chatbot-engine, runtime, clinical, booking, privacy, merge, deployment or publication change.

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
- No existing canon or contract file was rewritten.
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
- Non-failing repository warnings observed: stale Browserslist data, a broad Tailwind content pattern, treatment inventory `78` versus machine manifest `79`, skipped manifest sync because manifests were reported missing by that guard, and missing optional chatbot QA/conversation inputs. No warning was caused by the Stage 1 documentation files.

## Human authority

- Founder authority phrase: `CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`
- Founder explicitly required the docs-only branch, documentation commit and draft pull request for this Stage 1 execution.
- Founder remains visual, product and final acceptance authority.
- No clinical, regulatory, booking, privacy, publication, Stage B, merge or deployment approval was inferred.

## Unresolved conflicts

- The only unresolved evidence conflict is the supplied Champagne freeze tree `b5ca7b5f6ac3f988e6ec9a9ced586ad34dd411b9` versus Git's actual tree `b5ca7f10f5fb8e05cccd37676a58194ac6ee28ca` for the same freeze commit.
- Founder resolution is required before any future document corrects or reinterprets that tree value.
- Draft pull request `#856` already proposes the same Stage 1 programme canon
  from the original branch. Founder review should select one Stage 1 draft and
  close the duplicate before any authorised merge.
- The proposed V2 plan and additive amendment still require founder acceptance or amendment as described in their own statuses.
- Stage B remains ungranted and requires the separate exact phrase `CHAMPAGNE_STAGE_B_HYDRATION_AND_LIFECYCLE_STABILIZATION`.

## Rollback

- Before merge: close the new draft pull request and delete
  `docs/champagne-stage-1-canon-v1-20260728`.
- After an authorised merge: revert the single Stage 1 documentation commit.
- Rollback removes only the ten supplied canon files, this receipt and the bounded `AGENTS.md` addition.
- No product/runtime rollback, deployment rollback or data migration is required because Stage 1 changes no product behaviour.
