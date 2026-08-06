# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_DRAFT_IMPLEMENTATION_EVIDENCE`

This receipt records the final Founder-authorised matcher-replacement and acceptance-closure lane for Champagne PR #865. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#865`
- Authorised base and unchanged Champagne `main`: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Original settlement starting head: `b0ae7c45c9e99d28bcf37418db250332b312ae42`
- CSSStyleDeclaration closure starting head: `b57407a9e87ebe46b161c739121c2243290a0c34`
- Final matcher-replacement starting head: `714906819d43a1398cd1eced19a1dd1378443deb`
- Functional lexical-scanner closure head: `83b856888388ecadf6f8e36db22cfe1f48287803`
- Frozen PR #861 head: `b800e58134c6ef4f8b9a3196223379b0c47e4075`
- Frozen PR #863 head: `f29f0f10c08ab31374ba698a1d26a8a632fc13a9`
- Frozen evidence PR #864 head: `4c1548744e8d7afdac70a02e1f42c29fb4a2d2d6`
- Informational read-only `drnickmaxwell-wq/agent` main: `ba88b3ab5e649793a38a5b300dfa9da297751dfb`
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

## Settled first-paint architecture

`packages/champagne-tokens/src/canvas-material.v1.json` remains the sole human-editable first-paint composition graph. Primitive owners remain separately maintained in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`.

One deterministic generator validates graph-to-primitive parity and emits:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The root layout emits one React-managed critical style resource and meaningful server-rendered header, main and footer content. The page shell is not hidden behind a whole-document empty Suspense fallback.

Next production CSS inlining remains enabled. Initial production HTML contains no render-blocking external stylesheet link, while HTML and body paint through cascade-resolved variables so dawn, dusk and night overrides remain effective.

`packages/champagne-tokens/scripts/css-declarations.v1.mjs` remains the one shared CSS declaration-parser authority used by the generator and surface guard. Protected static owners, protected `@property` registrations, literal primitives, generated owners, immutable gold owners, `--ink-100`, the three exact time-of-day canvas owners, malformed CSS and CSS-tree symlinks remain governed.

## Final matcher replacement

The independent settlement audit reproduced one remaining concentrated defect family in repository-facing JavaScript runtime-mutation recognition:

1. JavaScript comments were not accepted as legal trivia throughout recognised structural forms.
2. Optional calls were omitted.
3. `CSSStyleSheet.replace()` discovery depended on preferred receiver spellings.
4. the 4,096-byte extractor could return an incomplete candidate and discard a later protected payload without failing the guard.

The correction at `83b856888388ecadf6f8e36db22cfe1f48287803` removes the fragmented discovery regex authority and replaces it with one bounded JavaScript lexical scanner shared by:

1. repository-facing runtime-mutation candidate discovery; and
2. downstream mutation-channel classification.

The scanner:

- treats spaces, tabs, newlines, line comments and block comments as JavaScript trivia;
- recognises dot, optional-dot and static bracket member access;
- canonicalises static property names, including JavaScript Unicode identifier escapes;
- recognises ordinary and optional calls;
- recognises `=`, `+=`, `||=`, `??=` and `&&=` for string-capable `cssText` and style-text mutation channels;
- excludes irrelevant arithmetic and bitwise assignment operators from the declared string-mutation contract;
- discovers `replace`, `replaceSync` and `insertRule` independently of receiver variable spelling;
- preserves `setProperty`, `setAttribute("style", ...)`, `cssText`, style `textContent`, `innerText`, `innerHTML`, and existing React/static style-object channels;
- handles static string, static template and statically concatenated payloads;
- excludes dynamic computed members and does not claim runtime object identity or interprocedural data-flow proof;
- scans to a complete statement boundary within a declared 64 KiB ceiling;
- fails closed with `RUNTIME_CANDIDATE_BOUND_EXCEEDED` if that ceiling is reached before a trustworthy boundary, rather than returning a truncated successful candidate.

The truthful bounded contract remains:

> Protected static CSS declarations, protected registrations and statically discoverable common application mutation channels are governed.

## Functional exact-head evidence

The functional implementation head immediately preceding this receipt is:

`83b856888388ecadf6f8e36db22cfe1f48287803`

Successful evidence bound to that exact head:

- Champagne CI run `31072141939`: successful
- Full umbrella `verify`: successful
- Generator and adversarial Node suite: `38/38 passed`
- Comment-trivia mutation fixtures: successful
- Ordinary and optional call fixtures: successful
- Receiver-independent `replace`, `replaceSync` and `insertRule` fixtures: successful
- Static dot, bracket and Unicode-escaped member canonicalisation fixtures: successful
- Five relevant `cssText` assignment-operator fixtures: successful
- Dynamic-member, regex, comment and dynamic-template decoy fixtures: successful
- Protected payload beyond the former 4,096-byte slice: successful
- Configured-bound exhaustion fail-closed fixture: successful
- Unrelated static runtime payload allowance: successful
- Generated freshness and byte-clean regeneration: successful
- Stage B real-internal-HTML route proof: successful
- Stage B Chromium matrix: `27/27 passed`
- Browser-effective comment-trivia `cssText` proof: successful
- Browser-effective receiver-independent optional `CSSStyleSheet.replace` proof: successful
- JavaScript-disabled shell and actual-frame proof: successful
- CSP-blocked reveal-script proof: successful
- Production CSS-inlining and zero external stylesheet proof: successful
- Dawn, dusk and night continuity: successful
- Hero V2 direct load, navigation, reduced motion and one-stack continuity: successful
- Surface-semantics, token-binding, purity, canon, Hero, workspace and rogue-colour guards: successful
- Lint, TypeScript and production web build: successful
- CodeQL run `31072141936`: successful
- Semgrep run `31072141933`: successful
- Trivy run `31072142017`: successful
- Gitleaks run `31072141956`: successful
- SBOM run `31072141967`: successful
- Vercel `champagne-web`: successful
- Vercel `champagne-stock`: successful

Because this receipt is tracked, every mandatory CI, security and preview check must rerun successfully against the commit containing this receipt. Earlier-head success is functional evidence and is not substituted for final receipt-bound exact-head closure.

## Evidence classification

- Parser, owner, registration, generator, lexical-scanner, runtime-candidate and workflow fixtures: `FIXTURE_PROVEN`
- Visitor-facing, internal-lab and browser-effective mutation behaviour: `LIVE_READ_PROVEN`
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Advanced Security distinction

Successful CodeQL and Semgrep execution is recorded. Exact-head check runs reported no new alerts in code changed by PR #865. This receipt does not claim that historical Advanced Security alerts are closed, dismissed or outdated.

## Acceptance ceiling and final gate

This receipt closes the authorised source-repair loop. After the receipt-bound exact head is green:

1. update the pull-request description with the actual final exact head, 17-path inventory, actual test counts and final run evidence;
2. post exactly one fresh top-level `@codex review` request against that exact head;
3. freeze the branch immediately after that request;
4. do not perform another automatic repair cycle.

PR #865 must remain open, draft and unmerged. Any new P1 or P2 ends mutation and requires a fresh independent read-only audit and new Founder authority. Independent audit and later Founder exact-head merge authority remain mandatory.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it; Champagne `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. Frozen PR #864 is evidence only and is not a rollback merge source.
