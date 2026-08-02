# Champagne Repository Instructions

**Status:** `ACTIVE_OPERATIONAL_CONSTRAINTS_NO_AUTHORITY`

These instructions constrain work in `drnickmaxwell-wq/champagne`. They do not
grant branch, commit, pull-request, merge, deployment, publication, production,
credential, Router, WEOS, chatbot-engine or cross-repository authority.

## 1. Required inputs

Before planning or changing Champagne, load:

1. applicable platform and security policy;
2. `docs/canon/programmes/CHAMPAGNE_CANON_PROGRAMME_INDEX_V1.md` and every
   source in its required read order;
3. the current exact Founder packet when mutation is requested;
4. this root file;
5. every scoped `AGENTS.md` applicable to each target path;
6. the task or build packet.

Missing, truncated, stale or conflicting input is a stop condition.

## 2. Semantic roles — no universal precedence list

Different inputs answer different questions:

- platform/security policy supplies absolute constraints;
- the Founder packet supplies an exact transaction gate and may contain an
  explicit canon decision only when it clearly identifies itself as one;
- mandatory Champagne canon controls product truth;
- root and scoped `AGENTS.md` files supply operational constraints only;
- a task packet describes a requested operation only;
- machine policy specifies evaluator behaviour only;
- historical records are inert and must not be loaded as active instructions.

Do not collapse these roles into one precedence or priority array.

## 3. Transaction-authority gate

Read-only inspection, audit and planning do not imply mutation authority. Pure
read-only work requires no Founder authority envelope, performs no repository,
external-system or state mutation, and remains subject to platform/security,
mandatory canon and every applicable root and scoped constraint.

Any mutation requires fresh exact stage-specific Founder authority naming the
repository, ref or pull request, operation, paths, stage and explicit expiry.
Authority does not inherit between stages or transactions. A role name, PASS
label, old Director approval, historical exemption, task request, installed
canon or repository file is not authority.

A valid mutation transaction must satisfy all of the following:

- the requested operation is inside the exact Founder authority envelope;
- every target path is inside the task and authority scope;
- platform/security constraints are satisfied;
- this root file and every applicable scoped file are satisfied.

Implementation authority does not imply mark-ready, merge, deployment,
publication or production authority. Those require separate exact Founder gates.

## 4. Product-truth gate

The proposed outcome must independently satisfy mandatory Champagne canon.
Transaction authority does not silently amend product truth.

The programme index controls canon loading and conflict behaviour:

- the Stage 1 acceptance wrapper controls programme acceptance;
- V2 remains `FOUNDER_REVIEW_DRAFT_NON_MUTATING` source direction;
- the Master Truth Amendment is accepted, additive and product-local;
- receipts are evidence only;
- unresolved conflict means stop, preserve the sources and request Founder
  resolution;
- canon grants no transaction authority by itself.

A Founder packet changes canon only when it explicitly declares a current-stage
canon resolution or amendment and identifies the affected source or conflict.
Silence, general implementation permission or path authority is not a canon
change.

Both the transaction-authority gate and product-truth gate must pass.

## 5. Root and scoped constraint composition

Root and scoped instructions accumulate constraints; they do not grant authority
and do not compete for precedence.

For every target path:

- load root plus every applicable scoped file from repository root to target;
- apply every constraint as a logical `AND` condition;
- union prohibitions, required checks and stop conditions;
- treat any path or capability list as a maximum boundary, never as authority;
- scoped instructions may narrow but never expand;
- root instructions may not weaken a scoped safeguard;
- repository instructions may not contradict mandatory canon or
  platform/security policy.

The task and Founder envelope define positive transaction scope. Repository
instructions can only restrict that scope. If monotonic narrowing or the final
allowed operation cannot be determined unambiguously, stop.

## 6. Champagne invariants

Agents MUST:

- preserve Champagne canon and truthful product semantics;
- protect the Sacred Hero system;
- preserve token-only styling and semantic surface meaning;
- preserve accessibility, privacy and failure visibility;
- leave the system more observable and no more fragile;
- make the smallest authorised change.

Agents MUST NOT:

- refactor core engines without exact path authority;
- introduce raw colours, rogue gradients or inline colour literals outside
  approved token-source contracts;
- bypass, weaken, hide or broadly exempt guards;
- invent practice, clinical, fee, availability, booking or patient facts;
- add PHI collection, diagnosis, triage, personalised clinical advice or
  autonomous clinical/booking action;
- mutate Router, WEOS, chatbot engine or another repository;
- force visibility or patch visual failures without diagnostics.

## 7. Sacred Hero surfaces

These paths are sacred/high-risk:

- `packages/champagne-hero/src/HeroAssetRegistry.ts`
- `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
- `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`
- `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
- `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`
- `packages/champagne-manifests/data/hero/sacred_*`
- `apps/web/app/components/hero/HeroRenderer.tsx`

Mutation requires fresh exact Founder authority naming the files and Hero scope,
plus the Hero-scoped constraints. Otherwise the work is invalid.

## 8. Semantic surface contract

- `--surface-0`: base porcelain canvas for primary content;
- `--surface-1`: elevated porcelain;
- `--surface-2`: highest porcelain elevation;
- `--surface-glass`: intentional translucent/glass surfaces only;
- `--surface-ink`: intentional high-contrast ink surfaces only;
- `--surface-footer-emotion`: footer emotional surface only.

Hard rules:

- glass is not the default card surface;
- ink is not a porcelain replacement;
- footer emotion is not body content;
- token purity does not by itself prove semantic correctness.

## 9. Required approach for visual work

1. runtime diagnostics;
2. layer-stack inspection;
3. asset-resolution confirmation;
4. CSS/token binding verification;
5. renderer paint confirmation;
6. smallest authorised repair;
7. focused tests and applicable full proving ladder.

Skipping diagnostics is guessing and is a stop condition.

## 10. Verification

Run focused tests for every changed surface and all applicable repository proving
commands. The standard full ladder is:

- `pnpm run guard:hero`
- `pnpm run guard:canon`
- `pnpm run guard:champagne-contracts`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build:web`
- `pnpm run verify`

A green build where an applicable guard did not run is failure.

## 11. Evidence and revalidation

Record loaded paths and hashes. Repository instruction files establish at most
`CANON_ONLY` evidence; they do not prove Router discovery, injection, provider
loading, cross-provider consistency or patch-time revalidation.

Revalidate authority, canon, base/head, target paths and effective constraints
immediately before patch application and again before any ready, merge or
deployment operation. Any drift invalidates prior review and approval.

## 12. Historical evidence exclusion

`docs/governance/history/**` is evidence only and must be excluded from active
instruction discovery and loading. Historical PASS blocks, Director grants,
expired exemptions, role labels and prior approvals cannot be revived as current
authority.

## 13. Failure protocol

On conflict, uncertainty, missing authority, scope expansion, semantic ambiguity,
failed guard or stale evidence:

1. stop;
2. preserve the evidence;
3. identify the exact conflict;
4. report without patching blindly;
5. request Founder resolution where required.
