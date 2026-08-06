# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_DRAFT_IMPLEMENTATION_EVIDENCE`

This receipt records the bounded final-settlement repair of Champagne PR #865. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#865`
- Authorised base and unchanged Champagne `main`: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Original settlement starting head: `b0ae7c45c9e99d28bcf37418db250332b312ae42`
- CSSStyleDeclaration closure starting head: `b57407a9e87ebe46b161c739121c2243290a0c34`
- Functional CSSStyleDeclaration closure head: `f13faef1dcd9e4cd211caa10df28725c6e99daa2`
- Frozen PR #861 head: `b800e58134c6ef4f8b9a3196223379b0c47e4075`
- Frozen PR #863 head: `f29f0f10c08ab31374ba698a1d26a8a632fc13a9`
- Frozen evidence PR #864 head: `4c1548744e8d7afdac70a02e1f42c29fb4a2d2d6`
- Informational read-only `drnickmaxwell-wq/agent` main: `ba88b3ab5e649793a38a5b300dfa9da297751dfb`
- Agent moved through separately merged Agent PR #6110 and was not mutated, reset or otherwise changed by Champagne PR #865.
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

## Settled architecture

`packages/champagne-tokens/src/canvas-material.v1.json` is the sole human-editable first-paint composition graph. Primitive owners remain separately maintained in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`.

One deterministic generator validates graph-to-primitive parity and emits:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The root layout emits one React-managed critical style resource and meaningful server-rendered header, main and footer content. The page shell is not hidden behind a whole-document empty Suspense fallback.

Next production CSS inlining is enabled. Initial production HTML contains no render-blocking external stylesheet link, while HTML and body paint through cascade-resolved variables so dawn, dusk and night overrides remain effective.

`packages/champagne-tokens/scripts/css-declarations.v1.mjs` remains the one shared CSS declaration-parser authority used by the generator and surface guard. Protected static owners, protected `@property` registrations, literal primitives, generated owners, immutable gold owners, `--ink-100`, the three exact time-of-day canvas owners, malformed CSS and CSS-tree symlinks remain governed.

## Final audit-confirmed CSSStyleDeclaration correction

The independent final-settlement audit reproduced one remaining bounded defect: a protected static payload assigned through `CSSStyleDeclaration.cssText` was browser-effective but absent from repository-facing runtime-mutation candidate discovery.

The correction at `f13faef1dcd9e4cd211caa10df28725c6e99daa2`:

- inventories static `.cssText` assignments through dot and static bracket notation;
- covers direct, compound, logical and conditional replacement assignment operators, including `=`, `+=`, `||=` and `??=`;
- remains object-agnostic and property-oriented, covering document element, body, ordinary element and aliased style references;
- passes static string literals, static template literals and statically resolvable string concatenations through the existing protected-token CSS inspection;
- classifies recognised `cssText` writes as a style-attribute/CSS-payload mutation channel;
- canonicalises equivalent static bracket forms of `setProperty`, `replaceSync`, `insertRule`, stylesheet-named `replace`, and `setAttribute("style", ...)`;
- preserves unrelated non-protected `cssText` payloads;
- does not claim arbitrary dynamic-data-flow or obfuscated-runtime analysis.

The truthful bounded contract remains:

> Protected static CSS declarations, protected registrations and statically discoverable common application mutation channels are governed.

## Functional exact-head evidence

The functional implementation head immediately preceding this receipt is:

`f13faef1dcd9e4cd211caa10df28725c6e99daa2`

Successful evidence bound to that head:

- Champagne CI run `31063117491`: successful
- Full umbrella `verify`: successful
- Generator and adversarial Node suite: `30/30 passed`
- Repository-facing candidate discovery for protected `cssText`: successful
- Static bracket closure for `setProperty`, `replaceSync` and `setAttribute`: successful
- Unrelated static `cssText` payload allowance: successful
- Generated freshness and byte-clean regeneration: successful
- Stage B real-internal-HTML route proof: successful
- Stage B Chromium matrix: `26/26 passed`
- Browser-effective protected `cssText` assignment proof: successful
- JavaScript-disabled shell and actual-frame proof: successful
- CSP-blocked reveal-script proof: successful
- Production CSS-inlining and zero external stylesheet proof: successful
- Dawn, dusk and night continuity: successful
- Hero V2 direct load, navigation, reduced motion and one-stack continuity: successful
- Surface-semantics, token-binding, purity, canon, Hero, workspace and rogue-colour guards: successful
- Lint, TypeScript and production web build: successful
- CodeQL run `31063117512`: successful
- Semgrep run `31063117506`: successful
- Trivy run `31063117486`: successful
- Gitleaks run `31063117480`: successful
- SBOM run `31063117503`: successful
- Vercel `champagne-web`: successful
- Vercel `champagne-stock`: successful

Because this receipt is tracked, all mandatory CI, security and preview checks must rerun successfully against the receipt-bound head. Earlier-head success is functional evidence and is not substituted for final exact-head closure.

## Evidence classification

- Parser, owner, registration, generator, runtime-candidate and workflow fixtures: `FIXTURE_PROVEN`
- Visitor-facing, internal-lab and browser-effective `cssText` behaviour: `LIVE_READ_PROVEN`
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Advanced Security distinction

Successful CodeQL and Semgrep execution is recorded. The connected GitHub App does not have code-scanning alert-list permission, so this receipt does not claim that historical Advanced Security alerts are closed, dismissed or outdated.

## Governance and next gate

PR #865 must remain open, draft and unmerged. After the receipt-bound exact head is green:

1. update the pull-request description with the actual exact head, 17-path inventory, actual test counts and final run evidence;
2. post exactly one fresh top-level `@codex review` request against that exact head;
3. freeze the branch immediately after that request;
4. do not repair any further P1 or P2 in this correction loop.

Any new P1 or P2 ends mutation and requires a fresh independent read-only audit. Independent audit and later Founder exact-head merge authority remain mandatory.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it; Champagne `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. Frozen PR #864 is evidence only and is not a rollback merge source.
