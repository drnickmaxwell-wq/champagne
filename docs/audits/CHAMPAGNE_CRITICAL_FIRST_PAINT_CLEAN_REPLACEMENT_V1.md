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

The loaded token stylesheet imports the generated CSS. The root layout imports the leaf-pure generated TypeScript module by its repository-relative generated-source path and emits one unconditional marked style directly inside the document head. The token package also exposes `@champagne/tokens/critical-paint`, but the web application does not consume that package subpath in this PR because doing so correctly requires an explicit web workspace dependency and regenerated lockfile. That separate package-boundary cleanup is disclosed rather than approximated.

The direct-head resource establishes the default concrete custom-property values before external CSS arrives. The generated document style paints HTML and body through `var(--surface-canvas)` and `var(--text-ink-high)` without declaring those custom properties inline. This preserves the later cascade authority of the approved dawn, dusk and night theme selectors. A generated Suspense fallback covers any streamed gap before request-dependent content resolves. All consumers derive from the same material graph.

The generator validates source shape, material identity, the exact non-final status, the matching false final-selection flag, node identity, references, cycles, integer weights, opaque canvas output and parity with the material graph's primitive tokens. Check mode compares exact committed bytes without modifying the worktree. Write mode is limited to the two generated paths and uses temporary sibling files plus atomic rename.

## Product truth preserved

The current approved material is transcribed without visual calibration:

- `--ink`: `#0B0D0F`
- `--brand-teal`: `#40C4B4`
- `--brand-magenta`: `#C2185B`
- `--smh-white`: `#FFFFFF`
- canvas recipe: existing nested `oklab` mixes at `88/12` then `92/8`
- readable foreground: existing `96%` white-to-transparent `oklab` mix

The surface guard separately preserves the exact immutable values of `--brand-gold` and `--brand-gold-keyline`, because those primitives are intentionally outside the first-paint material graph.

`status` remains exactly `CURRENT_APPROVED_MATERIAL_NOT_FINAL_PERSIAN_MIDNIGHT` and `finalPersianMidnightSelection` remains `false`. Sacred Hero source, motion semantics, content, booking, chatbot and clinical meaning are unchanged.

## Codex corrections incorporated

The first exact-head Codex review identified three valid issues:

1. exact immutable-gold validation had been reduced to a definition-count check;
2. inline custom-property declarations prevented dawn, dusk and night from overriding the default canvas;
3. the former browser-specific label was not a canonical evidence level.

The first correction restored exact gold and gold-keyline checks, removed inline theme-token ownership while retaining immediate paint, added exact browser proof that every approved time-of-day theme changes the canvas, and adopted canonical evidence vocabulary.

The second exact-head Codex review identified three further valid P2 proof gaps:

1. the structured material's `status` field was accepted but not validated alongside the false final-selection flag;
2. duplicate generated-owner scanning covered token CSS and `globals.css`, but not every application stylesheet and CSS module;
3. fallback assertions existed in the browser code but no route was required to execute them.

The second correction now:

- rejects any material status other than `CURRENT_APPROVED_MATERIAL_NOT_FINAL_PERSIAN_MIDNIGHT` and proves contradictory status/selection mutations fail closed;
- recursively scans every CSS file under both `packages/champagne-tokens/styles` and `apps/web/app` for unapproved generated-owner declarations;
- requires the real `/champagne/sections-debug` parser-time state to contain exactly one opaque, readable, full-viewport streaming fallback while the external stylesheet is held.

## Stage B harness truth

The production middleware continues to return 404 for `/champagne/*` routes unless `ALLOW_CHAMPAGNE_ROUTES=true`. Production behaviour is unchanged.

The Stage B regression job sets `ALLOW_CHAMPAGNE_ROUTES=true` only in its test environment. Before Chromium runs, it proves that `/champagne/sections-debug` returns successful HTML containing the real `Sections Debugger` page rather than the protected JSON 404 response.

The browser matrix withholds real Next external stylesheets and requires:

- one marked direct-head critical style where contractually observable;
- an opaque early canvas and readable foreground;
- exact early-versus-loaded sRGB canvas and foreground equality;
- no inline `--surface-canvas` or `--text-ink-high` ownership on HTML or body;
- transparent content surfaces above the canonical canvas;
- exact dawn, dusk and night theme canvas resolution after loaded CSS;
- a real full-viewport parser-time Suspense fallback on the internal Champagne route;
- no browser or console errors;
- preserved Hero V2 transparency, one-stack identity and visible content on public routes;
- home, implant-treatment, contact and internal-lab route coverage across mobile, desktop and reduced-motion combinations.

The internal lab is retained as a first-paint route but its Hero presence is not treated as part of this PR's contract. The existing request-path-derived Hero routing behaviour is present on the authorised main base and is a separate route-architecture concern. Public Hero assertions and the dedicated Hero lifecycle/navigation tests remain mandatory.

## Verification evidence

At implementation head `cda76c4790c5f3614a21a05ac8cefcba3cf9c6e5`, before the evidence-receipt updates:

- generator and adversarial tests: `8 passed`;
- exact material-status contradiction rejection: passed;
- generated-byte freshness and byte-clean regeneration: passed;
- recursive application-CSS generated-owner scan: passed;
- lint and TypeScript: passed;
- production web build: passed;
- workspace, canon, Hero, rogue-colour, surface-semantics and token-binding guards: passed;
- Stage B real-internal-HTML route proof: passed;
- Stage B Chromium matrix: `19 passed`;
- required internal-route streaming-fallback proof: passed;
- full umbrella `verify`: passed;
- CodeQL, Semgrep, Trivy, Gitleaks and SBOM: passed.

The final evidence-receipt head must independently repeat the complete CI and security ladder before fresh Codex review. The receipt deliberately does not embed its own moving commit identifier.

## Known bounded follow-up

The token package exposes the pure `@champagne/tokens/critical-paint` subpath, while the current root layout uses the leaf-pure generated module through a repository-relative path. Converting the web app to the package subpath correctly requires an explicit `@champagne/tokens` workspace dependency and regenerated `pnpm-lock.yaml`. That is not required to prove the first-paint behaviour and remains a disclosed package-boundary follow-up rather than hidden technical debt.

The internal Champagne lab can expose the global Hero when explicitly unlocked in a production-mode test because the pre-existing root layout derives route identity from request headers. The route remains production-blocked by default, and this PR makes no claim to repair that separate routing issue.

## WEOS evidence classification

This is a Champagne-local golden-tenant evidence candidate only.

- Structured generator and mutation fixtures: `FIXTURE_PROVEN` at implementation head `cda76c4790c5f3614a21a05ac8cefcba3cf9c6e5`, subject to exact final-head reconfirmation.
- Visitor-facing and internal-lab browser first-paint behaviour: `LIVE_READ_PROVEN` at implementation head `cda76c4790c5f3614a21a05ac8cefcba3cf9c6e5`, subject to exact final-head reconfirmation.
- WEOS runtime, lane readiness, Router consumption and cross-repository registration: **not claimed**.

Any future import, reconciliation or readiness update inside `drnickmaxwell-wq/agent` requires separate exact Founder authority after Router recovery. Existing WEOS claim-evidence and readiness machinery should consume a final accepted Champagne packet rather than this Champagne lane mutating WEOS directly.

## Human approvals and release boundary

- Founder authorised the exact Champagne repository, base, branch, operation, path ceiling, exclusions and expiry.
- No authority has been issued to mark ready, merge, deploy, mutate `agent`, or register evidence in WEOS.
- PR #865 must remain draft and unmerged pending final exact-head CI/security, fresh Codex review, independent audit and a later Founder merge decision.

## Rollback

Before merge, close the clean draft PR and delete its branch if the Founder rejects the result; `main` remains unchanged. After a separately authorised merge, revert the clean replacement merge commit to restore the prior token ownership and remove generated first-paint integration. PR #864 remains unmerged evidence and must not be used as a rollback merge source.
