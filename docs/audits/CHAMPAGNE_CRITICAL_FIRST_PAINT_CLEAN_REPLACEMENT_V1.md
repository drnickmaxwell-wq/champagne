# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_ROUTE_B_DRAFT_SETTLEMENT`

This receipt records the Founder-authorised Route B five-path settlement for Champagne PR #865. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#865`
- Base branch: `main`
- Exact authorised and unchanged base: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Exact authorised starting head: `ef2058ca307aa0cddd3104a1a50a40772fd21e51`
- Authorised starting state: 94 commits above base and exactly 17 changed paths
- Settlement authority: exactly the five paths listed below
- No `pnpm-lock.yaml` or `apps/web/package.json` change
- No production application, CSS, token, generated artefact, Hero V2, workflow, dependency or deployment mutation

The settlement commit's exact SHA cannot be embedded literally in the tracked contents that determine that same SHA. The immutable resulting head is therefore recorded in PR #865 metadata and the final lane packet immediately after the single settlement commit is created.

## Exact settlement paths — 5

1. `docs/audits/CHAMPAGNE_CRITICAL_FIRST_PAINT_CLEAN_REPLACEMENT_V1.md`
2. `packages/champagne-guards/scripts/guard-surface-semantics.mjs`
3. `packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`
4. `tests/champagne-critical-first-paint-generator.test.mjs`
5. `tests/champagne-surface-semantics.spec.ts`

The overall pull-request inventory remains the existing 17 paths. No sixth settlement path is authorised.

## Route B architectural decision

An independent read-only settlement architecture audit returned `PASS — ROUTE B BOUNDED SETTLEMENT RECOMMENDED` and reproduced three exact-head P2 findings:

1. executable protected mutations inside template interpolations can be skipped;
2. division after an object literal can be mistaken for a regular-expression literal; and
3. style-object recognition can fail beyond the fixed 32-token lookback.

These findings invalidate broad JavaScript or TypeScript lexical-closure claims. They do not invalidate the first-paint architecture, generated artefacts, CSS governance, ownership contracts or delivery proof.

The bespoke general JavaScript runtime-mutation scanner, its statement-bound extraction, JavaScript literal and identifier decoding, regex-versus-division heuristics, tokenisation, member/call matching, fixed-lookback style-object recognition, candidate construction, runtime-source collection, protected runtime-payload classification, orchestration, exports and scanner-only tests have been removed.

The audit found no corresponding protected-token mutation in the governed production application source at the authorised starting head. This is a bounded source observation, not proof of general JavaScript semantics.

General JavaScript and TypeScript runtime-mutation hardening is deferred to a separately governed AST-based change. A later change may assess the TypeScript Compiler API or `@typescript-eslint/parser`; PR #865 does not implement or select that approach.

## Narrowed acceptance claim

> Protected static CSS declarations, protected `@property` registrations, canonical material ownership, generated first-paint artefact integrity and render-unblocking first-paint delivery are governed. General JavaScript and TypeScript runtime-mutation detection is not claimed by PR #865 and is deferred to a separately governed AST-based hardening change.

PR #865 governs first-paint architecture, generated artefacts, static CSS declarations, registrations, ownership and delivery. It does not claim broad statically discoverable application-mutation closure or general JavaScript parser equivalence.

## Retained first-paint architecture

`packages/champagne-tokens/src/canvas-material.v1.json` remains the sole human-editable first-paint composition graph. Primitive owners remain separately maintained in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`.

One deterministic generator continues to validate graph-to-primitive parity and emit:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The root layout continues to emit one React-managed critical style resource and meaningful server-rendered header, main and footer content. Next production CSS inlining remains enabled. Initial production HTML continues to avoid a render-blocking external stylesheet link, while HTML and body paint through cascade-resolved variables so dawn, dusk and night overrides remain effective.

The shared CSS declaration parser remains the single parser authority used by the generator and surface guard. Protected static owners, protected `@property` registrations, literal primitives, generated owners, immutable-gold owners, `--ink-100`, exact time-of-day canvas owners, malformed CSS and CSS-tree symlinks remain governed.

Hero V2, mobile and desktop behaviour, normal and reduced motion, JavaScript-disabled usefulness, CSP-interference resilience, meaningful SSR, actual screenshot pixels, generated-file drift rejection, stable serialisation, workflow integrity and pinned actions remain in the retained validation scope.

## Settlement test inventory

- Retained generator and contract Node suite: exactly `23` tests
- Removed scanner-only generator tests: exactly `13` tests
- Retained surface-semantics Playwright declarations: exactly `5` tests, including the dawn/dusk/night parameterisation
- Removed scanner-only surface-semantics browser demonstrations: exactly `2` tests
- No replacement lexical scanner or AST test family was added

## Executed evidence

Evidence is recorded here only after execution against the settlement worktree.

- `node --check packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`: successful
- `node --check packages/champagne-guards/scripts/guard-surface-semantics.mjs`: successful
- `pnpm run test:critical-paint-generator`: `23/23 passed`, `0 failed`, `0 skipped`
- `pnpm run guard:surface-semantics`: successful with the narrowed CSS/ownership/artefact/delivery claim
- `pnpm run check:critical-paint-generated`: successful
- `pnpm run guard:all`: successful
- `pnpm run lint`: successful with `0` ESLint warnings or errors
- `pnpm run typecheck`: successful
- `CI=1 pnpm run build:web`: successful; `110/110` static pages generated
- `pnpm run verify`: successful
- `npm run guard:hero`: successful, including the sacred Hero lock
- `npm run guard:canon`: successful, including the patient-portal SSR probe
- `npm run verify`: successful
- Stage B CI-environment production build with `ALLOW_CHAMPAGNE_ROUTES=true`, `NEXT_PUBLIC_FEATURE_BRAND_HERO=true` and `NEXT_PUBLIC_HERO_ENGINE=v2`: successful; `110/110` static pages generated
- Internal `/champagne/sections-debug` real-HTML probe: successful
- Complete retained Playwright matrix: `25/25 passed`, `0 failed`, `0 skipped`
  - `tests/champagne-critical-first-paint.spec.ts`: `17/17 passed`
  - `tests/champagne-surface-semantics.spec.ts`: `5/5 passed`
  - `tests/hero-v2-navigation-continuity.spec.ts`: `3/3 passed`
- Deterministic regeneration followed by generated-path diff: successful; no generated diff
- `packages/champagne-tokens/src/critical-paint.generated.ts` SHA-256: `fc006d23752b48e6aabdeccb82065e18031b722c6ac6a8f5d78c9619b51c5128`
- `packages/champagne-tokens/styles/champagne/canvas-material.generated.css` SHA-256: `73bcf78f94c89ce00fbd53d89c0e5e9c4902623ef365eb25f03522663c7bf665`

The first local browser attempt enumerated all 25 retained tests but could not launch 23 browser-dependent cases because Playwright Chromium build 1200 was absent; the two HTTP-only cases passed. After installing the exact Chromium runtime into isolated temporary storage, the unchanged matrix passed `25/25`. Playwright's Node 26 archive extractor stalled locally, so the official downloaded archives were extracted with the system unzip tool; CI pins Node 20 and performs the standard Playwright installation step.

Non-failing pre-existing notices observed during verification were: legacy workspace-dependency allowlist warnings; SEO inventory `78` versus live manifest `79`; manifest-sync skipped because its optional manifests were absent; chatbot-copy fallback because its optional QA report and conversation files were absent; and internal-lab server warnings for currently unregistered `implant_crown_3d_viewer` and `treatment_mid_cta` components. None was treated as successful proof or silently repaired.

Exact-head CI/security evidence and both Vercel contexts remain pending until the single settlement commit is pushed.

## Evidence classification

- Static CSS parser, owner, registration, generator and workflow contracts: `FIXTURE_PROVEN`
- Visitor-facing first-paint, SSR, pixel, navigation, motion and surface behaviour: `LIVE_READ_PROVEN` only where the retained browser suites complete successfully
- General JavaScript or TypeScript runtime-mutation detection: not claimed
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Residual risk

PR #865 does not govern general JavaScript or TypeScript runtime mutation of protected custom properties. A runtime mutation expressed through executable template interpolation, ambiguous division/regex syntax, a distant style-object context, dynamic member access, aliasing, interprocedural flow or another unparsed semantic form can remain outside this guard.

The risk is explicit and deferred. It must not be described as closed by scanner fixtures, browser demonstrations, absence of a current production match, CodeQL, Semgrep or a positive Codex review.

## Advanced Security distinction

Exact-head CodeQL, Semgrep, Trivy, Gitleaks and SBOM conclusions will be recorded after the settlement push. Successful execution does not establish historical alert lifecycle closure.

## Acceptance ceiling and final gate

After the single settlement commit is pushed and exact-head evidence is recorded:

1. update the draft pull-request description with the exact settlement head, unchanged 17-path inventory, narrowed claim, exact local evidence and exact remote status;
2. post exactly one fresh top-level `@codex review` request against that exact head;
3. freeze the branch immediately after that request; and
4. do not perform another automatic repair cycle.

PR #865 must remain open, draft and unmerged. Any new P1 or P2 ends mutation and requires new Founder authority. A positive review is not merge authority.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it. Champagne `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. PR #864 remains evidence only and is not a rollback merge source.
