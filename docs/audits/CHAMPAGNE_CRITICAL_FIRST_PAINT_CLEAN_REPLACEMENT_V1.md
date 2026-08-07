# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_STATIC_TYPESCRIPT_WRAPPER_CLOSURE_DRAFT`

This receipt records the Founder-authorised final three-path static TypeScript-wrapper closure on top of the bounded embedded-style ownership closure and Route B settlement for Champagne PR #865. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#865`
- Base branch: `main`
- Exact authorised and unchanged base: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Exact authorised starting head: `b5f6f8a68b60f24ea320761049c46db4bbd4c6c7`
- Authorised starting state: 96 commits above base and exactly 17 changed paths
- Repair authority: exactly the three paths listed below
- No `pnpm-lock.yaml` or `apps/web/package.json` change
- No production application, CSS, token, generated artefact, Hero V2, workflow, dependency or deployment mutation

The repair commit's exact SHA cannot be embedded literally in the tracked contents that determine that same SHA. The immutable resulting head is therefore recorded in the final lane packet immediately after the single repair commit is created.

## Exact repair paths — 3

1. `packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`
2. `tests/champagne-critical-first-paint-generator.test.mjs`
3. `docs/audits/CHAMPAGNE_CRITICAL_FIRST_PAINT_CLEAN_REPLACEMENT_V1.md`

The overall pull-request inventory remains the existing 17 paths. No fourth repair path is authorised.

## Route B architectural decision

An independent read-only settlement architecture audit returned `PASS — ROUTE B BOUNDED SETTLEMENT RECOMMENDED` and reproduced three exact-head P2 findings:

1. executable protected mutations inside template interpolations can be skipped;
2. division after an object literal can be mistaken for a regular-expression literal; and
3. style-object recognition can fail beyond the fixed 32-token lookback.

These findings invalidate broad JavaScript or TypeScript lexical-closure claims. They do not invalidate the first-paint architecture, generated artefacts, CSS governance, ownership contracts or delivery proof.

The bespoke general JavaScript runtime-mutation scanner, its statement-bound extraction, JavaScript literal and identifier decoding, regex-versus-division heuristics, tokenisation, member/call matching, fixed-lookback style-object recognition, candidate construction, runtime-source collection, protected runtime-payload classification, orchestration, exports and scanner-only tests have been removed.

The audit found no corresponding protected-token mutation in the governed production application source at the authorised starting head. This is a bounded source observation, not proof of general JavaScript semantics.

General JavaScript and TypeScript runtime-mutation hardening is deferred to a separately governed AST-based change. The TypeScript Compiler API use added here is limited to locating and reconstructing JSX/TSX `<style>` payloads; it is not a general runtime-mutation parser or a selection for the deferred hardening architecture.

## Bounded embedded-style ownership closure

A fresh exact-head Codex review of `a2378b8a2e796ad32cccce377d5b8d9deb3c00da` identified that the protected static-CSS inventory covered `.css` files but omitted browser-effective CSS emitted by first-party JSX/TSX `<style>` elements. The finding was independently reproduced architecturally. No live rogue protected-token declaration was found in the current first-party embedded-style inventory; the defect was guard coverage and claim completeness.

The guard now uses the repository's existing TypeScript tooling only to traverse JSX/TSX syntax trees beneath `apps/web/app/**` and `packages/**`. It recovers static stylesheet payloads from ordinary `<style>` children and `dangerouslySetInnerHTML={{ __html: ... }}` forms, including string and template literals. Dynamic template values are replaced with an inert syntactically valid CSS value so a static declaration name remains inspectable. Source is neither evaluated nor executed, and diagnostics retain the TSX/JSX path and style-block location.

Recovered stylesheet text is fed into the same shared CSS declaration parser, material-owner contract and protected `@property` registration contract used for `.css` files. Test/spec files and ignored, generated and vendor trees remain excluded, while source-tree symlinks and malformed source fail closed.

This extractor governs CSS actually emitted from statically identifiable JSX/TSX `<style>` elements. It is not a restoration of the removed JavaScript lexical scanner, does not discover arbitrary runtime mutation calls, and does not claim that dynamically constructed declaration names or general JavaScript/TypeScript semantics are closed.

## Static TypeScript-wrapper closure

A fresh exact-head Codex review of `b5f6f8a68b60f24ea320761049c46db4bbd4c6c7` identified that legal compile-time TypeScript wrappers could hide otherwise static embedded-style payloads from the direct AST classification. The finding was accepted as valid. No live rogue protected declaration was found; the defect was bounded static extraction completeness.

One deterministic expression normalisation authority now recursively unwraps `ParenthesizedExpression`, `AsExpression`, `SatisfiesExpression`, `TypeAssertionExpression` and `NonNullExpression` nodes. The same normalisation is applied before classifying the whole `dangerouslySetInnerHTML` expression and before recovering static string or template text from `__html` initializers and ordinary style children. Angle-bracket assertions are covered at the TypeScript-expression layer where that syntax is valid; JSX/TSX itself does not permit that assertion spelling.

The normaliser does not execute source or resolve identifiers, calls, imports, aliases, comma expressions, control flow or arbitrary data flow. After transparent wrappers are removed, the existing bounded static extraction and shared CSS ownership and registration contracts remain the only classification authorities.

## Narrowed acceptance claim

> Protected declarations and `@property` registrations in static CSS files and statically recoverable first-party JSX/TSX embedded styles, canonical material ownership, generated first-paint artefact integrity and render-unblocking first-paint delivery are governed. General JavaScript and TypeScript runtime-mutation detection is not claimed by PR #865 and is deferred to a separately governed AST-based hardening change.

PR #865 governs first-paint architecture, generated artefacts, static CSS declarations, statically recoverable embedded styles, registrations, ownership and delivery. It does not claim broad statically discoverable application-mutation closure or general JavaScript parser equivalence.

## Retained first-paint architecture

`packages/champagne-tokens/src/canvas-material.v1.json` remains the sole human-editable first-paint composition graph. Primitive owners remain separately maintained in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`.

One deterministic generator continues to validate graph-to-primitive parity and emit:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The root layout continues to emit one React-managed critical style resource and meaningful server-rendered header, main and footer content. Next production CSS inlining remains enabled. Initial production HTML continues to avoid a render-blocking external stylesheet link, while HTML and body paint through cascade-resolved variables so dawn, dusk and night overrides remain effective.

The shared CSS declaration parser remains the single CSS parser authority used by the generator and surface guard. Protected owners in `.css` files and recovered JSX/TSX style sheets, protected `@property` registrations, literal primitives, generated owners, immutable-gold owners, `--ink-100`, exact time-of-day canvas owners, malformed CSS and protected-source-tree symlinks remain governed.

Hero V2, mobile and desktop behaviour, normal and reduced motion, JavaScript-disabled usefulness, CSP-interference resilience, meaningful SSR, actual screenshot pixels, generated-file drift rejection, stable serialisation, workflow integrity and pinned actions remain in the retained validation scope.

## Settlement test inventory

- Generator and contract Node suite: exactly `39` tests
- Added transparent TypeScript-wrapper tests: exactly `8` tests
- Added bounded embedded-style ownership tests: exactly `8` tests
- Removed scanner-only generator tests: exactly `13` tests
- Retained surface-semantics Playwright declarations: exactly `5` tests, including the dawn/dusk/night parameterisation
- Removed scanner-only surface-semantics browser demonstrations: exactly `2` tests
- No replacement lexical scanner or general runtime-mutation test family was added

## Executed evidence

Evidence is recorded here only after execution against the settlement worktree.

- `node --check packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`: successful
- `node --check packages/champagne-guards/scripts/guard-surface-semantics.mjs`: successful
- `pnpm run test:critical-paint-generator`: `39/39 passed`, `0 failed`, `0 skipped`
- `pnpm run guard:surface-semantics`: successful with the narrowed static-file and embedded-style ownership/registration/artefact/delivery claim
- `pnpm run check:critical-paint-generated`: successful
- `pnpm run guard:all`: successful
- `pnpm run guard:hero`: successful, including the sacred Hero lock
- `pnpm run guard:canon`: successful, including the patient-portal SSR probe
- `pnpm run guard:champagne-contracts`: successful with `2/2` safe fixtures
- `pnpm run lint`: successful with `0` ESLint warnings or errors
- `pnpm run typecheck`: successful
- `CI=1 pnpm run build:web`: successful; `110/110` static pages generated
- `pnpm run verify`: successful
- Stage B CI-environment production build with `ALLOW_CHAMPAGNE_ROUTES=true`, `NEXT_PUBLIC_FEATURE_BRAND_HERO=true` and `NEXT_PUBLIC_HERO_ENGINE=v2`: successful; `110/110` static pages generated
- Complete retained Playwright matrix: `25/25 passed`, `0 failed`, `0 skipped`
  - `tests/champagne-critical-first-paint.spec.ts`: `17/17 passed`
  - `tests/champagne-surface-semantics.spec.ts`: `5/5 passed`
  - `tests/hero-v2-navigation-continuity.spec.ts`: `3/3 passed`
- Generated-artifact check and generated-path diff: successful; no generated diff
- `packages/champagne-tokens/src/critical-paint.generated.ts` SHA-256: `fc006d23752b48e6aabdeccb82065e18031b722c6ac6a8f5d78c9619b51c5128`
- `packages/champagne-tokens/styles/champagne/canvas-material.generated.css` SHA-256: `73bcf78f94c89ce00fbd53d89c0e5e9c4902623ef365eb25f03522663c7bf665`

The first local browser attempt enumerated all 25 retained tests but could not launch 23 browser-dependent cases because Playwright Chromium headless-shell build 1200 was absent; the two HTTP-only cases passed. After downloading the exact official runtime, the unchanged matrix passed `25/25`. Playwright's Node 26 archive extractor stalled locally after the download completed, so that official archive was extracted into Playwright's browser cache with the system unzip tool; CI pins Node 20 and performs the standard Playwright installation step.

The Homebrew pnpm 11 wrapper initially attempted an interactive modules replacement for this pnpm 9.15.4 repository and aborted without running the requested scripts. Every required pnpm command was therefore executed with the already cached exact pnpm `9.15.4` binary. The first sandboxed `guard:canon` attempt could not bind its localhost SSR probe (`EPERM`); the same guard then completed successfully outside the filesystem/network sandbox. These environment-only attempts are not counted as passing evidence.

Non-failing pre-existing notices observed during verification were: legacy workspace-dependency allowlist warnings; SEO inventory `78` versus live manifest `79`; manifest-sync skipped because its optional manifests were absent; chatbot-copy fallback because its optional QA report and conversation files were absent; and internal-lab server warnings for currently unregistered `implant_crown_3d_viewer` and `treatment_mid_cta` components. None was treated as successful proof or silently repaired.

Exact-head CI/security evidence and both Vercel contexts remain pending until the single repair commit is pushed. They will be recorded in the final lane packet because post-push evidence cannot be embedded in the commit it identifies.

## Evidence classification

- Static CSS parser, file and embedded-style owner, registration, generator and workflow contracts: `FIXTURE_PROVEN`
- Visitor-facing first-paint, SSR, pixel, navigation, motion and surface behaviour: `LIVE_READ_PROVEN` only where the retained browser suites complete successfully
- General JavaScript or TypeScript runtime-mutation detection: not claimed
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Residual risk

PR #865 does not govern general JavaScript or TypeScript runtime mutation of protected custom properties. A runtime mutation expressed through executable template interpolation, a dynamically constructed CSS declaration name, ambiguous division/regex syntax, a style object, dynamic member access, aliasing, interprocedural flow or another unparsed semantic form can remain outside this guard.

The risk is explicit and deferred. It must not be described as closed by scanner fixtures, browser demonstrations, absence of a current production match, CodeQL, Semgrep or a positive Codex review.

## Advanced Security distinction

Exact-head CodeQL, Semgrep, Trivy, Gitleaks and SBOM conclusions will be recorded after the settlement push. Successful execution does not establish historical alert lifecycle closure.

## Acceptance ceiling and final gate

After the single repair commit is pushed and exact-head evidence is recorded:

1. do not change the pull-request title, body, base, draft state or review-thread state;
2. post exactly one fresh top-level `@codex review` request against that exact head only if every required remote check is green;
3. freeze the branch immediately after that request; and
4. do not perform another automatic repair cycle.

PR #865 must remain open, draft and unmerged. Any new P1 or P2 ends mutation and requires new Founder authority. A positive review is not merge authority.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it. Champagne `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. PR #864 remains evidence only and is not a rollback merge source.
