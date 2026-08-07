# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_BOUNDED_JSX_ENTITY_SEMANTICS_CLOSURE_READY`

This receipt records the Founder-authorised bounded JSX-entity semantics closure on top of the enumerated static-key closure, collector-policy closure, static TypeScript-wrapper closure, bounded embedded-style ownership closure and Route B settlement for Champagne PR #865. The pull request was already ready when this closure was authorised. This transaction does not toggle draft state, select a final Persian Midnight material, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#865`
- Base branch: `main`
- Exact authorised and unchanged base: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Exact authorised starting head: `01cd68f56c83c76869ad0cb321dde0190d661418`
- Authorised starting state: open, ready, unmerged and undeployed; 99 commits above base and exactly 17 changed paths
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

The guard now uses the repository's existing TypeScript tooling only to traverse JSX/TSX syntax trees beneath `apps/web/app/**` and `packages/**`. It recovers stylesheet payloads from directly represented ordinary `<style>` children and the enumerated literal `dangerouslySetInnerHTML.__html` property forms described below, including directly represented string and template CSS values. Dynamic template values are replaced with an inert syntactically valid CSS value so a directly represented declaration name remains inspectable. Source is neither evaluated nor executed, and diagnostics retain the TSX/JSX path and style-block location.

Recovered stylesheet text is fed into the same shared CSS declaration parser, material-owner contract and protected `@property` registration contract used for `.css` files. Test/spec files and genuine ignored build, dependency and coverage trees remain excluded, while source-tree symlinks and malformed source fail closed.

This extractor governs CSS recovered from those finite JSX/TSX `<style>` forms. It is not a restoration of the removed JavaScript lexical scanner, does not discover arbitrary runtime mutation calls, and does not claim that dynamically constructed declaration names or general JavaScript/TypeScript semantics are closed.

## Static TypeScript-wrapper closure

A fresh exact-head Codex review of `b5f6f8a68b60f24ea320761049c46db4bbd4c6c7` identified that legal compile-time TypeScript wrappers could hide otherwise static embedded-style payloads from the direct AST classification. The finding was accepted as valid. No live rogue protected declaration was found; the defect was bounded static extraction completeness.

One deterministic expression normalisation authority now recursively unwraps `ParenthesizedExpression`, `AsExpression`, `SatisfiesExpression`, `TypeAssertionExpression` and `NonNullExpression` nodes. The same normalisation is applied before classifying the whole `dangerouslySetInnerHTML` expression and before recovering static string or template text from `__html` initializers and ordinary style children. Angle-bracket assertions are covered at the TypeScript-expression layer where that syntax is valid; JSX/TSX itself does not permit that assertion spelling.

The normaliser does not execute source or resolve identifiers, calls, imports, aliases, comma expressions, control flow or arbitrary data flow. After transparent wrappers are removed, the existing bounded static extraction and shared CSS ownership and registration contracts remain the only classification authorities.

## Terminal collector-policy closure

A fresh exact-head Codex review of `1ee3119a1da2bbdbb50e475b41729a7e2aba8fd1` identified that the shared source collector blanket-excluded every directory literally named `generated` or `vendor`. That policy could omit first-party static CSS or JSX/TSX embedded styles placed beneath those names. The finding was accepted as a valid collector-policy defect. No current executable Champagne defect in either directory topology was identified.

Only those two unsafe name-based exclusions have been removed. Static CSS and JSX/TSX embedded styles beneath first-party `generated` and `vendor` directories inside the already governed roots now pass through the same collectors, AST extractor, shared CSS parser, protected-owner contract and protected-registration contract as equivalent first-party source elsewhere. Existing exclusions for `node_modules`, `.next`, `dist`, `build`, `coverage`, `.git`, `.turbo`, `__tests__` and test/spec source files are unchanged.

This correction does not add an import graph, dependency reachability, another parser, identifier or alias resolution, data-flow analysis, interprocedural analysis, JavaScript runtime-mutation scanning or traversal outside the governed first-party roots.

## Final enumerated static-key closure

The terminal exact-head Codex review of `b9d3d89892af1064d077f3ad19cc6ca56cb3b15d` returned P2 `Recognize computed __html keys in style objects`. The finding was independently reproduced: a browser-effective `<style dangerouslySetInnerHTML={{ ["__html"]: ":root{--surface-canvas:red}" }} />` payload was omitted because the former property-name helper did not classify a TypeScript `ComputedPropertyName`. No corresponding protected declaration was identified in current executable first-party Champagne source at that exact head.

One deterministic static property-name normaliser now recognises only the following object-literal property forms as `__html`: the identifier `__html`; direct single- or double-quoted string literals; computed single- or double-quoted string literals; and a computed no-substitution template literal. For computed names, the expression may be enclosed only by the already-approved transparent parentheses, `as`, `satisfies`, type-assertion and non-null wrappers. Existing ordinary `__html` behaviour is unchanged.

The normaliser does not execute or interpret unsupported expressions. It does not constant-fold concatenation or other binary expressions, resolve identifiers or aliases, inspect property access, call functions, follow imports, evaluate template substitutions, or perform control-flow or data-flow analysis. Unsupported computed property expressions resolve to no static property name. General JavaScript or TypeScript runtime-mutation detection remains outside PR #865 and deferred to a separately governed AST/source-hardening change.

## Bounded JSX-entity semantics closure

The automatic Codex review triggered when PR #865 was marked ready reviewed exact head `01cd68f56c83c76869ad0cb321dde0190d661418` and returned P2 `Decode JSX entities before parsing style text`. The finding was independently reproduced: TypeScript compiles `<style>:root &#123; --surface-&#99;anvas:red; &#125;</style>` to browser-effective CSS equivalent to `:root { --surface-canvas:red; }`, while the former ordinary-style extraction passed the raw entity-bearing `JsxText.text` to the CSS parser.

The installed TypeScript `5.9.3` compiler was used as a read-only semantic oracle before implementation. It showed that valid decimal references and lowercase-`x` hexadecimal references are cooked; supported named references such as `&gt;` and `&amp;` are cooked; unknown names, malformed digits, missing semicolons and uppercase-`X` hexadecimal spellings remain literal; surrogate and null code points are emitted as their decoded code units; and an out-of-range code point makes the TypeScript JSX transform throw.

The public TypeScript scanner exposes only raw JSX text. The correction therefore uses the public `transpileModule` compiler API on one synthetic, expression-free `<style>` fixture for each ordinary `JsxText` node and structurally accepts only the expected single static string emitted through a private synthetic JSX factory name. The compiler-cooked string then enters the existing shared CSS parser and ownership/registration contracts. Compiler diagnostics, transform exceptions or an unexpected emitted shape fail closed with `EMBEDDED_STYLE_ENTITY_DECODE` provenance.

This bounded correction neither executes application source nor introduces an entity table, browser DOM dependency, HTML parser, CSS parser, JavaScript scanner, runtime-mutation discovery, constant folding, identifier/import/alias resolution, data-flow analysis or import-graph analysis. Template and expression reconstruction, `dangerouslySetInnerHTML`, transparent TypeScript wrappers, enumerated computed keys and source collection retain their existing boundaries.

## Narrowed acceptance claim

> First-party static CSS files and JSX/TSX `<style>` payloads using TypeScript-cooked ordinary JSX text, directly represented string/template CSS and enumerated literal `dangerouslySetInnerHTML.__html` object-property forms are governed by the shared CSS ownership and protected-registration contract. Canonical material ownership, generated first-paint artefact integrity and render-unblocking first-paint delivery remain governed. General JavaScript and TypeScript runtime-mutation detection is not claimed by PR #865 and is deferred to a separately governed AST/source-hardening change.

PR #865 governs only the explicitly implemented and tested first-paint architecture, generated artefacts, static CSS declarations, directly represented string/template embedded styles, enumerated literal `__html` property forms, registrations, ownership and delivery channels. It does not claim arbitrary computed property-name evaluation, constant folding, identifier or alias resolution, import or data-flow analysis, broad statically discoverable application-mutation closure, every future source topology, dynamic code, runtime mutation or general JavaScript parser equivalence.

## Retained first-paint architecture

`packages/champagne-tokens/src/canvas-material.v1.json` remains the sole human-editable first-paint composition graph. Primitive owners remain separately maintained in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`.

One deterministic generator continues to validate graph-to-primitive parity and emit:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The root layout continues to emit one React-managed critical style resource and meaningful server-rendered header, main and footer content. Next production CSS inlining remains enabled. Initial production HTML continues to avoid a render-blocking external stylesheet link, while HTML and body paint through cascade-resolved variables so dawn, dusk and night overrides remain effective.

The shared CSS declaration parser remains the single CSS parser authority used by the generator and surface guard. Protected owners in `.css` files and recovered JSX/TSX style sheets, protected `@property` registrations, literal primitives, generated owners, immutable-gold owners, `--ink-100`, exact time-of-day canvas owners, malformed CSS and protected-source-tree symlinks remain governed.

Hero V2, mobile and desktop behaviour, normal and reduced motion, JavaScript-disabled usefulness, CSP-interference resilience, meaningful SSR, actual screenshot pixels, generated-file drift rejection, stable serialisation, workflow integrity and pinned actions remain in the retained validation scope.

## Settlement test inventory

- Generator and contract Node suite: exactly `60` tests
- Added bounded JSX-entity semantics tests: exactly `8` tests, covering benign literal text, decimal and hexadecimal braces and protected names, a supported named entity, encoded protected registration, mixed raw/entity CSS, malformed or unsupported literal preservation and unsafe numeric code-point failure behaviour
- Added final enumerated static-key tests: exactly `5` tests, covering all supported property spellings, transparent wrappers, protected owners and registrations, benign computed-literal CSS, unsupported concatenation and non-execution
- Added collector-policy temporary-tree tests: exactly `8` tests
- Added transparent TypeScript-wrapper tests: exactly `8` tests
- Added bounded embedded-style ownership tests: exactly `8` tests
- Removed scanner-only generator tests: exactly `13` tests
- Retained surface-semantics Playwright declarations: exactly `5` tests, including the dawn/dusk/night parameterisation
- Removed scanner-only surface-semantics browser demonstrations: exactly `2` tests
- No replacement lexical scanner or general runtime-mutation test family was added

## Executed evidence

Evidence is recorded here only after execution against the settlement worktree.

- `node --check packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs`: successful
- `node --check tests/champagne-critical-first-paint-generator.test.mjs`: successful
- `pnpm run test:critical-paint-generator`: `60/60 passed`, `0 failed`, `0 skipped`
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

Every required pnpm command was executed with the already cached exact pnpm `9.15.4` binary. Localhost-dependent canon and browser checks ran outside the filesystem/network sandbox so their required loopback servers could bind.

Non-failing pre-existing notices observed during verification were: legacy workspace-dependency allowlist warnings; SEO inventory `78` versus live manifest `79`; manifest-sync skipped because its optional manifests were absent; chatbot-copy fallback because its optional QA report and conversation files were absent; and internal-lab server warnings for currently unregistered `implant_crown_3d_viewer` and `treatment_mid_cta` components. None was treated as successful proof or silently repaired.

Exact-head CI/security evidence and both Vercel contexts remain pending until the single repair commit is pushed. They will be recorded in the final lane packet because post-push evidence cannot be embedded in the commit it identifies.

## Evidence classification

- Static CSS parser, file and embedded-style owner, registration, generator and workflow contracts: `FIXTURE_PROVEN`
- Visitor-facing first-paint, SSR, pixel, navigation, motion and surface behaviour: `LIVE_READ_PROVEN` only where the retained browser suites complete successfully
- General JavaScript or TypeScript runtime-mutation detection: not claimed
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Residual risk

PR #865 does not govern general JavaScript or TypeScript runtime mutation of protected custom properties, dependency or build-output trees outside the governed first-party roots, or arbitrary import reachability. Arbitrary computed property names such as `["__" + "html"]`, computed identifiers, imported constants, function-returned names, template expressions with substitutions, runtime style mutation and data-flow-derived CSS remain explicitly outside the enumerated embedded-style contract.

The risk is explicit and deferred. It must not be described as closed by scanner fixtures, browser demonstrations, absence of a current production match, CodeQL, Semgrep or a positive Codex review.

## Advanced Security distinction

Exact-head CodeQL, Semgrep, Trivy, Gitleaks and SBOM conclusions will be recorded after the settlement push. Successful execution does not establish historical alert lifecycle closure.

## Acceptance ceiling and final gate

After the single repair commit is pushed and exact-head evidence is recorded:

1. do not change the pull-request title, body, base, draft state or review-thread state;
2. do not post another manual Codex review request without fresh Main Director authority;
3. freeze the branch after the exact-head remote check state is recorded; and
4. do not perform another automatic repair cycle.

PR #865 must remain open, ready, unmerged and undeployed. After this bounded JSX-entity correction, no further PR #865 source repair is authorised by this transaction. Additional observations belong to the separately commissioned finite static-style audit lane. A positive review is not merge authority.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it. Champagne `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. PR #864 remains evidence only and is not a rollback merge source.
