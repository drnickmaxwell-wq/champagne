# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_DRAFT_IMPLEMENTATION_EVIDENCE`

This receipt records the bounded Champagne-only replacement for the cold first-paint canvas defect. It does not select the final Persian Midnight material, grant release authority, or register or mutate WEOS.

## Authority and repository boundary

- Repository: `drnickmaxwell-wq/champagne`
- Authorised base: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Stage: `CHAMPAGNE_STAGE_B_HYDRATION_AND_LIFECYCLE_STABILIZATION — CRITICAL FIRST-PAINT CLEAN REPLACEMENT V1`
- Authority expiry: no later than `2026-08-10T23:59:00+01:00`, subject to earlier stop conditions in the Founder envelope.
- Evidence source PR #864 remains frozen, draft and unmerged at `4c1548744e8d7afdac70a02e1f42c29fb4a2d2d6`.
- PR #863 remains outside scope and untouched.
- `drnickmaxwell-wq/agent` and its pre-finished WEOS/Router remain read-only at `18a3682567096e9363dcbc85fcdf0bff7858627f`.

No branch, base, file, pull request, evidence registry, Router recovery state or WEOS runtime in `drnickmaxwell-wq/agent` is changed by this work.

## Architecture decision

The first and fully loaded paint derive from one structured, human-editable material source:

`packages/champagne-tokens/src/canvas-material.v1.json`

The source is a closed expression graph rather than arbitrary CSS text. One deterministic generator produces:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The loaded token stylesheet imports the generated CSS. The root layout imports the leaf-pure generated TypeScript module by its repository-relative generated-source path and emits one unconditional marked style directly inside the document head. The token package also exposes `@champagne/tokens/critical-paint`, but the web application does not consume that package subpath in this PR because doing so correctly requires an explicit web workspace dependency and regenerated lockfile. That separate package-boundary cleanup was not smuggled into this repair.

The generated document style also protects the HTML and body roots, and a generated Suspense fallback covers any streamed gap before request-dependent content resolves. All three consumers derive from the same canonical material graph.

The generator validates source shape, node identity, references, cycles, integer weights, opaque canvas output and parity with immutable Champagne primitive tokens. Check mode compares exact committed bytes without modifying the worktree. Write mode is limited to the two generated paths and uses temporary sibling files plus atomic rename.

## Product truth preserved

The current approved material is transcribed without visual calibration:

- `--ink`: `#0B0D0F`
- `--brand-teal`: `#40C4B4`
- `--brand-magenta`: `#C2185B`
- `--smh-white`: `#FFFFFF`
- canvas recipe: existing nested `oklab` mixes at `88/12` then `92/8`
- readable foreground: existing `96%` white-to-transparent `oklab` mix

`finalPersianMidnightSelection` remains `false`. Sacred Hero source, motion semantics, content, booking, chatbot and clinical meaning are unchanged.

## Stage B harness truth

The production middleware continues to return 404 for `/champagne/*` routes unless `ALLOW_CHAMPAGNE_ROUTES=true`. Production behaviour was not changed.

The Stage B regression job sets `ALLOW_CHAMPAGNE_ROUTES=true` only in its test environment. Before Chromium runs, it proves that `/champagne/sections-debug` returns successful HTML containing the real `Sections Debugger` page rather than the protected JSON 404 response.

The browser matrix then withholds real Next external stylesheets and requires:

- one marked direct-head critical style where contractually observable;
- an opaque early canvas and readable foreground;
- exact early-versus-loaded sRGB canvas and foreground equality;
- transparent content surfaces above the canonical canvas;
- no browser or console errors;
- preserved Hero V2 transparency, one-stack identity and visible content on public routes;
- home, implant-treatment, contact and internal-lab route coverage across mobile, desktop and reduced-motion combinations.

The internal lab is retained as a first-paint route but its Hero presence is not treated as part of this PR's contract. The existing request-path-derived Hero routing behaviour is present on the authorised main base and is a separate route-architecture concern. Public Hero assertions and the dedicated Hero lifecycle/navigation tests remain mandatory.

## Verification evidence

At implementation head `02639104e5905a9132afc066761a7cb21bbb71e4`, before this evidence-only receipt update:

- generator tests: `7 passed`;
- generated-byte freshness and byte-clean regeneration: passed;
- lint and TypeScript: passed;
- production web build: passed;
- workspace, canon, Hero, rogue-colour, surface-semantics and token-binding guards: passed;
- Stage B real-internal-HTML route proof: passed;
- Stage B Chromium matrix: `19 passed`;
- full umbrella `verify`: passed;
- CodeQL, Semgrep, Trivy, Gitleaks and SBOM: passed.

This documentation-only update must receive a fresh exact-head CI and security result before Codex review. A pending external check must never be represented as passed.

## Known bounded follow-up

The token package exposes the pure `@champagne/tokens/critical-paint` subpath, while the current root layout uses the leaf-pure generated module through a repository-relative path. Converting the web app to the package subpath correctly requires an explicit `@champagne/tokens` workspace dependency and regenerated `pnpm-lock.yaml`. That is not required to prove the first-paint behaviour and remains a disclosed package-boundary follow-up rather than hidden technical debt.

The internal Champagne lab can expose the global Hero when explicitly unlocked in a production-mode test because the pre-existing root layout derives route identity from request headers. The route remains production-blocked by default, and this PR makes no claim to repair that separate routing issue.

## WEOS evidence classification

This is a Champagne-local golden-tenant evidence candidate only.

- Structured generator and mutation fixtures: `FIXTURE_PROVEN`.
- Visitor-facing and internal-lab browser first-paint behaviour: `BROWSER_PROVEN` at the recorded implementation head, subject to fresh exact-head confirmation after this receipt update.
- WEOS runtime, lane readiness, Router consumption and cross-repository registration: **not claimed**.

Any future import, reconciliation or readiness update inside `drnickmaxwell-wq/agent` requires separate exact Founder authority after Router recovery. Existing WEOS claim-evidence and readiness machinery should consume a final accepted Champagne packet rather than this Champagne lane mutating WEOS directly.

## Human approvals and release boundary

- Founder authorised the exact Champagne repository, base, branch, operation, path ceiling, exclusions and expiry.
- No authority has been issued to mark ready, merge, deploy, mutate `agent`, or register evidence in WEOS.
- PR #865 must remain draft and unmerged pending exact-head CI, Codex review, independent audit and a later Founder merge decision.

## Rollback

Before merge, close the clean draft PR and delete its branch if the Founder rejects the result; `main` remains unchanged. After a separately authorised merge, revert the clean replacement merge commit to restore the prior token ownership and remove generated first-paint integration. PR #864 remains unmerged evidence and must not be used as a rollback merge source.
