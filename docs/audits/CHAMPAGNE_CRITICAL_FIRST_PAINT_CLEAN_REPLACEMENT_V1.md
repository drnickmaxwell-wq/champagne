# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_DRAFT_IMPLEMENTATION_EVIDENCE`

This receipt records the bounded final-settlement repair of PR #865 in `drnickmaxwell-wq/champagne`. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Authorised base and unchanged `main`: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Settlement starting head: `b0ae7c45c9e99d28bcf37418db250332b312ae42`
- Frozen PR #861 head: `b800e58134c6ef4f8b9a3196223379b0c47e4075`
- Frozen PR #863 head: `f29f0f10c08ab31374ba698a1d26a8a632fc13a9`
- Frozen evidence PR #864 head: `4c1548744e8d7afdac70a02e1f42c29fb4a2d2d6`
- Read-only `drnickmaxwell-wq/agent` boundary: `18a3682567096e9363dcbc85fcdf0bff7858627f`
- Maximum and final changed-path boundary: exactly 17
- No `pnpm-lock.yaml` or `apps/web/package.json` change
- No middleware, application-page design, Hero V2 source, production deployment, provider, spending, Router or WEOS mutation

## Exact changed paths — 17

1. `.github/workflows/verify.yml`
2. `apps/web/app/layout.tsx`
3. `apps/web/next.config.mjs`
4. `docs/audits/CHAMPAGNE_CRITICAL_FIRST_PAINT_CLEAN_REPLACEMENT_V1.md`
5. `package.json`
6. `packages/champagne-guards/scripts/guard-surface-semantics.mjs`
7. `packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`
8. `packages/champagne-tokens/package.json`
9. `packages/champagne-tokens/scripts/css-declarations.v1.mjs`
10. `packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs`
11. `packages/champagne-tokens/src/canvas-material.v1.json`
12. `packages/champagne-tokens/src/critical-paint.generated.ts`
13. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
14. `packages/champagne-tokens/styles/champagne/tokens.css`
15. `tests/champagne-critical-first-paint-generator.test.mjs`
16. `tests/champagne-critical-first-paint.spec.ts`
17. `tests/champagne-surface-semantics.spec.ts`

## Precise architecture statement

`packages/champagne-tokens/src/canvas-material.v1.json` is the sole human-editable **first-paint composition graph**. It is not the sole source of every material primitive.

The graph references separately maintained primitive owners in:

`packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`

The generator validates exact graph-to-primitive parity and deterministically emits:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The loaded material stylesheet and the leaf-pure critical-paint module therefore derive from one composition graph while retaining explicit primitive ownership.

The root layout emits one React-managed critical style resource and renders the meaningful header, main content and footer directly in the server-rendered document. The page shell is not hidden behind an empty whole-document Suspense fallback.

`apps/web/next.config.mjs` enables Next production CSS inlining. Initial production HTML contains the application CSS as inline style resources and contains no render-blocking external stylesheet link. The document paints through `var(--surface-canvas)` and `var(--text-ink-high)` without inline ownership of those custom properties, preserving the approved dawn, dusk and night cascade.

## Independently reproduced settlement findings

The final-settlement audit findings were reproduced against the authorised PR before repair:

1. the former whole-page Suspense boundary could leave public content blank or hidden when reveal scripts were unavailable;
2. the manually emitted critical style followed Next's render-blocking stylesheet link and therefore did not prove an actual unblocked first frame;
3. CSS declaration ownership did not fully cover escaped structural characters, malformed recovery cases and all protected owner forms;
4. protected `@property` registrations were not inventoried;
5. common application mutation channels could create competing protected owners outside static CSS;
6. verdict-producing workflow integrity needed full Action-SHA and structure recurrence protection;
7. parser-only assertions needed correlation with Chromium rather than being treated as browser truth by declaration alone.

## Repair implemented

### Meaningful SSR and render-unblocking CSS delivery

- Removed the whole-page empty Suspense fallback.
- Preserved meaningful server-rendered header, main and footer content outside hidden streamed containers.
- Proved public pages remain visible with JavaScript disabled and when inline reveal scripts are blocked by CSP.
- Enabled production CSS inlining and guarded that configuration against removal.
- Required initial HTML and browser requests to contain zero external stylesheet resources.
- Compared no-hydration frames with fully hydrated frames across the route and viewport matrix.
- Captured and decoded real PNG screenshots, sampling the viewport for opaque canonical canvas pixels.

### One CSS parser authority

`packages/champagne-tokens/scripts/css-declarations.v1.mjs` is the shared declaration parser imported by the generator and surface guard.

It now handles or fails closed on:

- direct and hexadecimal identifier escapes;
- escape-terminating whitespace;
- escaped structural characters, including closing braces;
- comments, strings and escaped newlines;
- bad-string newline recovery;
- parentheses, brackets and matched custom-property brace components;
- nested `@media`, `@supports` and `@layer` structures;
- declarations without trailing semicolons;
- malformed comments, strings, blocks and component values.

Chromium differential fixtures classify cases as browser-effective owners, browser-invalid syntax or conservative parser rejection and assert that no actual guard bypass exists.

### Complete static owner and registration closure

The recursive CSS guard scans the protected token and application trees and rejects file or directory symlinks. Its exact ownership contract covers:

- literal primitives: `--ink`, `--brand-teal`, `--brand-magenta`, `--smh-white`;
- generated owners: `--smh-ink-navy`, `--brand-ink`, `--surface-canvas`, `--bg-ink`, `--text-ink-high`;
- transitive alias: `--ink-100`;
- immutable primitives: `--brand-gold`, `--brand-gold-keyline`;
- only the three exact approved dawn, dusk and night `--surface-canvas` overrides.

Direct, escaped and comment-separated competing declarations are rejected. Canonical owner counts, paths and values must match exactly.

Protected `@property` registrations are inventoried through nested at-rules. Direct, escaped, comment-separated, ambiguous and malformed protected registrations fail closed. Unrelated registrations remain permitted.

### Statically discoverable application mutation closure

The governed application and package source trees are inventoried for concrete mutation channels:

- `style.setProperty(...)`;
- CSSStyleSheet `replaceSync(...)` and `insertRule(...)`;
- stylesheet-named receiver `.replace(...)` calls;
- style text injection through `textContent`, `innerText` or `innerHTML`;
- `setAttribute("style", ...)`;
- protected custom-property keys in React or ordinary style objects.

Static protected writes and constructed stylesheet text are rejected; unrelated runtime custom properties remain permitted. This is a recurrence guard for statically discoverable common channels and does not claim to solve arbitrary dynamically computed code.

### Workflow integrity

Verdict-producing Action references in `.github/workflows/verify.yml` are pinned to full reviewed commit SHAs. The surface guard requires:

- a coherent `critical-paint-generated` job;
- one pinned checkout and setup-node authority in that job;
- no mutable Action tag or branch reference;
- no alternate checkout source, ref, repository, path, sparse checkout or unsafe pull-request checkout;
- no job-level checkout or setup-node indirection;
- no unapproved network, download, package-install or remote-execution step in the protected job;
- explicit generator freshness, adversarial tests and byte-clean regeneration;
- all jobs that influence the final `verify` verdict to remain structurally connected.

## Adversarial proof contract

The Node suite proves 27 deterministic cases, including:

- one shared parser implementation;
- direct, escaped and comment-separated ownership attacks for every protected owner;
- brace-component and escaped-brace recovery;
- bad-string recovery and malformed-CSS fail-closed behaviour;
- literal primitive parity and immutable-owner protection;
- exact time-of-day owner exemptions;
- protected `@property` registration closure;
- concrete runtime mutation-channel closure;
- file and directory symlink rejection;
- missing references, cycles, opaque canvas output and stable serialization;
- deterministic write mode, generated freshness and byte-clean regeneration;
- workflow Action pinning and protected-job structural coherence.

The Stage B Chromium suite proves 25 browser cases, including:

- no-hydration versus fully hydrated canvas and foreground equality;
- zero external stylesheet requests and zero blocking stylesheet links;
- actual opaque PNG frame evidence;
- meaningful raw SSR outside hidden stream containers;
- JavaScript-disabled visibility;
- CSP-blocked reveal-script resilience;
- home, implant-treatment, contact and internal-lab routes;
- mobile, desktop, reduced-motion and normal-motion cases;
- dawn, dusk and night semantic canvas continuity;
- public Hero V2 direct-load, navigation, back/forward and one-stack continuity;
- parser-versus-Chromium differential classification.

## Functional implementation evidence

The functional implementation head immediately preceding this receipt is:

`41d372786f5a53fdd87564b5b860fc7166a7b76a`

Successful exact-head evidence at that head:

- Champagne CI run `31030442866`: successful
- Full umbrella `verify`: successful
- Generator and adversarial Node suite: `27/27 passed`
- Stage B real-internal-HTML route proof: successful
- Stage B Chromium matrix: `25/25 passed`
- Generated-byte freshness and byte-clean regeneration: successful
- Production web build: successful
- Lint and TypeScript: successful
- Workspace, canon, Hero, rogue-colour, surface-semantics, token-binding and complete guard chain: successful
- CodeQL run `31030443244`: successful
- Semgrep run `31030442533`: successful
- Trivy run `31030441560`: successful
- Gitleaks run `31030442167`: successful
- SBOM run `31030442391`: successful

Because this receipt is itself tracked, every mandatory CI and security workflow must rerun successfully against the receipt-bound exact head. Earlier-head success is evidence for the functional implementation and is not substituted for final exact-head closure.

## Advanced Security distinction

The mutable Action references were substantively removed and recurrence is guarded. Successful CodeQL and Semgrep workflow execution is recorded above.

The connected GitHub App does not have code-scanning alert-list permission. This receipt therefore does not claim that historical Advanced Security alert records are closed, dismissed or marked outdated. Alert lifecycle state remains a separate permission-dependent verification.

## Evidence classification

- Parser, owner, registration, mutation-channel, workflow and generator fixtures: `FIXTURE_PROVEN`
- Visitor-facing and internal-lab browser behaviour: `LIVE_READ_PROVEN`
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Governance and next gate

PR #865 must remain open, draft and unmerged. After the receipt-bound exact head is green:

1. update the pull-request description with the exact head, exact 17-path inventory and final run evidence;
2. post exactly one fresh top-level `@codex review` request against that exact head;
3. freeze the branch immediately after the request;
4. do not repair further findings in this settlement loop.

Any further Codex finding ends this repair loop and moves the work to a separate independent ChatGPT audit. Independent read-only audit and later Founder exact-head merge authority remain mandatory.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it; `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. Frozen PR #864 is evidence only and is not a rollback merge source.
