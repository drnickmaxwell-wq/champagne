# Champagne PR #864 First-Paint Work Log V1

## Authority and boundaries

- Repository: `drnickmaxwell-wq/champagne`
- Pull request: `#864`
- Authorised branch: `agent/champagne-critical-first-paint-repair-v1`
- Mutation authority: Founder packet titled `Champagne PR #864 — First-Paint Architecture Rework and Proof Programme`
- PR #863, `main`, `drnickmaxwell-wq/agent`, Sacred Hero implementation, manifests, routes, content, motion, deployment, merge and final Persian Midnight calibration remain outside scope.
- PR #864 must remain draft until the packet's complete draft-to-ready gate is satisfied.

## Loaded governance evidence

The lead read the complete required canon sequence and applicable scoped instructions before mutation. Starting hashes:

| Input | SHA-256 |
| --- | --- |
| `AGENTS.md` | `2180f5aae37c76a930a31ade51257a532a63dd4533543a7618313fdb14fdeeac` |
| `apps/web/AGENTS.md` | `647b68d8880bafecaf292a477a9bcffbd563c237f4166ec2e98b88f7fe8af6b0` |
| `packages/champagne-guards/AGENTS.md` | `ba16c54c2c86618dbffaee9f1ed8c30e4677e5ab7b08510eab7e15e2bfcbec97` |
| `packages/champagne-hero/AGENTS.md` | `a838640561b1b1ee8c806dc57965a833534d3cad4c5fec4840f7778f204ca5b2` |
| Programme index | `a0dae7c8cfe3c110eeb11920b282e5ff690b676affb3501ddab93e7e313c500e` |
| V2 machine plan | `55556ebf39827eb8a57dfdf8d085f5023a776b20e5a5c0311702d573314e0809` |
| V2 Markdown companion | `1e8ac38e646a0e75f7229313a3ed453edf8871894c5ee85f5916a988e7ecbefa` |
| Master Truth Amendment JSON | `765373c38a9c1471b537afd669db4dd437621deda3f01524428208e005bbf0b4` |
| Master Truth Amendment Markdown | `96d6d0115a63041dbea61c684573eb242f3cbd2a4a3b0ea31658e9c13b039702` |
| Authority and freeze contract | `930cddb323a60db5dc71e7f17c50b2836b4c7bfb56ba476fea57ab71162b1d57` |
| Stage 1 acceptance contract | `7a3003c0172175dc5364f80922d0f5bbf0b38b3b417e3cbd0e9d8c1229d025f5` |

## Phase 0 — exact starting state

Recorded on 2026-08-02 before implementation mutation:

| Fact | Exact state |
| --- | --- |
| PR title | `Seed Champagne canvas before external CSS` |
| PR state | open, draft, unmerged, merge state `CLEAN` |
| PR head | `0c90ac066dc801e3f3fe516a3fbb34267bbdd143` |
| Base branch | `main` |
| Live main | `a3484e976d240aaedf88a9b13afdd6ccc8d7d267` |
| Commit count over main | `13` |
| PR #863 | open draft at `f29f0f10c08ab31374ba698a1d26a8a632fc13a9`, not mutated |
| CI/Vercel | all reported checks successful; web preview ready; stock preview skipped as expected |

Starting changed paths:

1. `apps/web/app/layout.tsx`
2. `packages/champagne-guards/scripts/guard-surface-semantics.mjs`
3. `packages/champagne-tokens/src/critical-paint.v1.json`
4. `packages/champagne-tokens/src/index.ts`

## Phase 0 — review finding ledger

| Reviewed head | Finding | Severity | Classification | Evidence | Corrective head | Replacement review |
| --- | --- | --- | --- | --- | --- | --- |
| `0c90ac066dc801e3f3fe516a3fbb34267bbdd143` | `packages/champagne-guards/scripts/guard-surface-semantics.mjs:110-111` accepts malformed outer CSS | P2 | current and valid | Removing the opening brace from the canonical `:root` rule left malformed CSS, but `guard:surface-semantics` exited zero because declaration regexes ignored stylesheet structure. | `c6cc6df5d8fc592bc83e27c178c0ecc9873d502b` | review at `c6cc6df5d8fc592bc83e27c178c0ecc9873d502b` confirmed syntax remediation but found the separate loaded-cascade gap |
| `c6cc6df5d8fc592bc83e27c178c0ecc9873d502b` | guard does not validate the complete loaded canvas cascade | P2 | current and valid | A later `--surface-canvas` owner in imported theme CSS wins in the browser while the guard consults only `tokens.css` and primitive definitions; the Phase 0 disposable mutation reproduced this false pass. | `b7af7924a378b6c81d0ac214b563257399e5d6a6` | review at `35c154413c88d4fbaf39b1df81e79d56f395ac0f` confirmed cascade remediation but found the separate color-grammar gap |
| `35c154413c88d4fbaf39b1df81e79d56f395ac0f` | resolved snapshot is not validated against the CSS color grammar | P2 | current and valid | PostCSS accepts declaration structure containing `not-a-color`; changing both the semantic terminal and snapshot to that value previously passed. A disposable mutation now fails with `CANVAS_COLOR_INVALID` through `css-tree`'s standards grammar matcher. | `87680ab65f0e90f6359e23c945d38e73b910dc4e` | review at `4cdcd199933d844775f487ddc725029b5e4ea10a` confirmed color-grammar remediation but found two separate CSS-escape bypasses |
| `4cdcd199933d844775f487ddc725029b5e4ea10a` | escaped protected canvas property name bypasses ownership filtering | P1 | current and valid | A loaded `--surface-canv\61 s` declaration is the protected property in the browser but was ignored by the raw PostCSS spelling comparison. The same disposable mutation now fails with `CANVAS_IDENTIFIER_ESCAPED` and `CANVAS_OWNER_UNAPPROVED`. | `269e061f129d3426b6cba7fb4c31301d47fcc588` | review at `3d5b7f79404b93c23afb250741029b26836d454d` confirmed the property-name remediation |
| `4cdcd199933d844775f487ddc725029b5e4ea10a` | escaped `var()` function bypasses handwritten dependency resolution | P1 | current and valid | Matching canonical source and snapshot values using `v\61 r(--ink)` previously evaded literal `var(` matching. `css-tree` now tokenises and decodes function identifiers; the mutation fails with `CANVAS_VAR_ESCAPED`. | `269e061f129d3426b6cba7fb4c31301d47fcc588` | review at `3d5b7f79404b93c23afb250741029b26836d454d` confirmed the function-token remediation but found two separate context/ancestry gaps |
| `3d5b7f79404b93c23afb250741029b26836d454d` | context-dependent terminal colors satisfy the broad `<color>` grammar | P2 | current and valid | Matching source/snapshot values of `currentColor` were grammar-valid but could compute differently before and after loaded root text styling. The mutation now fails with `CANVAS_COLOR_CONTEXT_DEPENDENT`; system colors, `transparent`, `env()`, `light-dark()` and unresolved `var()` are likewise prohibited. | `03afc832ede6c2979880a3b5b807001bd713b4e8` | review at `b31713a9ca67e8b9d8067a2818e286b5da5db7b1` confirmed context remediation but found dependency/alpha gaps |
| `3d5b7f79404b93c23afb250741029b26836d454d` | approved canvas owner can be made inactive under a false ancestor at-rule | P2 | current and valid | Wrapping the dawn owner in `@media (width < 0px)` preserved selector/value text but prevented browser application. The mutation now fails with `CANVAS_OWNER_CONDITIONAL`; protected owners must be direct unconditional rules. | `03afc832ede6c2979880a3b5b807001bd713b4e8` | review at `b31713a9ca67e8b9d8067a2818e286b5da5db7b1` confirmed ancestry remediation |
| `b31713a9ca67e8b9d8067a2818e286b5da5db7b1` | later loaded CSS can override an intermediate canvas dependency | P2 | current and valid | Appending `:root { --brand-ink: red; }` to `globals.css` previously escaped the two-property ledger. The resolved dependency set is now collected during traversal and every dependency must have exactly one unconditional canonical `:root` owner; the mutation fails with `CANVAS_DEPENDENCY_OWNER_UNAPPROVED`. | `1586b04723fc024a8b6d1ea5c2653fb329023abe` | review at `d3052d919b38e8a0468992a4d17c94d374a508c4` confirmed default-chain remediation but found themed-chain and mix-weight gaps |
| `b31713a9ca67e8b9d8067a2818e286b5da5db7b1` | partially transparent canvas color passes broad grammar and nonzero-alpha checks | P2 | current and valid | Matching source/snapshot `rgb(0 0 0 / 50%)` previously passed. The current material contract now permits only opaque literal terminals and `color-mix()` composition over opaque terminals; the mutation fails with `CANVAS_COLOR_ALPHA`. | `1586b04723fc024a8b6d1ea5c2653fb329023abe` | review at `d3052d919b38e8a0468992a4d17c94d374a508c4` confirmed literal-alpha remediation but found the separate explicit mix-weight gap |
| `d3052d919b38e8a0468992a4d17c94d374a508c4` | explicit `color-mix()` weights below 100% create an implicitly translucent result | P2 | current and valid | Matching source/snapshot `color-mix(in srgb, red 20%, blue 20%)` previously satisfied the allowed-function policy even though CSS scales the output alpha to 40%. The same disposable mutation now fails with `CANVAS_COLOR_ALPHA`; two explicit weights must total at least 100%, while a single explicit weight must remain within 0%..100%. | `442d4258a3132e23fc87e056ad260facd1c3f5e0` | review at `b61d2dc8f6da360df5b4e528a8bad62e53f04abc` confirmed mix-weight remediation but found a separate malformed-function-token gap |
| `d3052d919b38e8a0468992a4d17c94d374a508c4` | themed canvas owners do not contribute their dependencies to the ownership ledger | P2 | current and valid | Dusk and night resolve through `--ink-100`, but the ledger previously collected only the default chain. Appending `:root { --ink-100: red; }` to `globals.css` passed. Every themed owner is now resolved through the canonical token sources into the shared dependency set; the mutation fails with `CANVAS_DEPENDENCY_OWNER_UNAPPROVED`. | `442d4258a3132e23fc87e056ad260facd1c3f5e0` | review at `b61d2dc8f6da360df5b4e528a8bad62e53f04abc` confirmed themed-chain remediation but found a separate malformed-function-token gap |
| `b61d2dc8f6da360df5b4e528a8bad62e53f04abc` | handwritten resolution treats whitespace-separated `var (` as a real CSS function | P2 | current and valid | Changing an intermediate dependency to `var (--ink)` allowed the prior text matcher to substitute it even though CSS tokenizes `var` as an identifier followed by parentheses. Dependency values are now parsed first; a standalone `var` identifier fails with `CANVAS_VAR_TOKEN_INVALID`, and only a genuine literal `var(` function token enters the temporary resolver. | `97a9671d729228cf1d326e2774a28bc0fb73852b` | review at `a2cee0acfcc9635385a977f86971db034b1dbb9a` confirmed token remediation but found a separate cascade-priority gap |
| `a2cee0acfcc9635385a977f86971db034b1dbb9a` | protected canvas owners can silently gain `!important` priority | P2 | current and valid | Adding `!important` to the default `--surface-canvas` owner preserved the recorded value while causing it to outrank dawn/dusk/night owners. Protected canvas owners now fail with `CANVAS_OWNER_IMPORTANT`; canonical dependency owners likewise cannot use priority and fail with `CANVAS_DEPENDENCY_IMPORTANT`. | `d7a5dda6d2243c774e3d8fac43be839cdd29d2e6` | pending |

Five older unresolved Codex threads are technically outdated at the starting head. Their requested behaviours were implemented by later commits, but the replacement architecture will independently remove the handwritten snapshot and bespoke resolver rather than rely on those historical fixes.

## Phase 0 — baseline reproduction

The exact head was installed with the frozen lockfile using repository-pinned `pnpm@9.15.4`.

| Command/evidence | Result |
| --- | --- |
| `pnpm --filter @champagne/guards guard:surface-semantics` | pass |
| `pnpm run verify` | pass after rerun outside the filesystem sandbox so the required local SSR probe could bind |
| Existing Stage B Playwright specs, production build, one worker | `8 passed` using installed system Chrome after the Playwright cache installer stalled before installing its separate headless shell |
| Homepage initial HTML | 198,131 bytes; SHA-256 `e07808ba8d85b7caa6b311e9b6e06dfa375ec8666810f9fa482a9f4ee0383e69` |
| `/treatments/implants` initial HTML | 199,682 bytes; SHA-256 `5f4f3e237227f3b799a9189c9848ad4f2a3627cb03d2bf59e3329665358c1d6c` |
| Initial HTML critical style | one `data-champagne-critical-paint="v1"` element on each route |

Warnings were recorded without treating them as success criteria: legacy workspace dependency warnings, stale Browserslist data, broad Tailwind content glob, treatment inventory 78 vs 79, skipped missing manifest-sync inputs, missing chatbot QA report/conversations, deprecated `next lint`, missing Next ESLint plugin, Node `module.register()` deprecation and `NO_COLOR`/`FORCE_COLOR` conflict.

## Phase 0 — disposable weakness proofs

All deliberate mutations were made in a detached disposable worktree at the audited head, were not committed or pushed, and the worktree was removed after restoration checks.

| Mutation | Current detector result | Proof |
| --- | --- | --- |
| Malformed outer canonical CSS | false pass | Removing the opening `:root` brace left unmatched outer CSS; `guard:surface-semantics` still passed. |
| Later loaded-cascade override | false pass | Appending a later `:root { --surface-canvas: var(--surface-0); }` to loaded theme CSS still passed the guard. |
| Stale critical snapshot | static guard fails, current browser proof falsely passes | Changing only the critical expression weights made the static guard fail, but the existing mobile filmstrip test still passed. |
| Early/final inequality | not asserted by current browser proof | With external CSS held, the stale build reported early `oklab(0.257887 0.00070971 -0.00326884)` and final `oklab(0.25248 0.00174809 -0.00324971)` while `document.readyState` moved from `loading` to `complete`. |

Phase 0 establishes these final failure expectations:

- malformed complete CSS must fail closed through a standards-compliant CSS parser;
- unlisted later ownership or loaded-cascade divergence must fail;
- the browser proof must hold at least one real external stylesheet and compare exact computed sRGB bytes across early and loaded phases;
- generated drift must fail without mutating the worktree;
- no mutation fixture may remain applied to production sources.

## Phase ledger

| Phase | Head | Summary | Tests | Codex review | Findings/remediation |
| --- | --- | --- | --- | --- | --- |
| 0 | nine superseded reviewed heads through `a2cee0acfcc9635385a977f86971db034b1dbb9a`; corrected phase head `d7a5dda6d2243c774e3d8fac43be839cdd29d2e6` pending log commit and push | Baseline, initial HTML and disposable weakness reproduction; loaded structure/imports, decoded identifiers/functions, AST declaration ownership across default and themed dependency chains, self-contained opaque color semantics including mix weights, unconditional owner ancestry, genuine CSS function-token recognition, and priority-free protected ownership are closed. | all earlier mutations plus downstream dependency overrides, translucent terminals/mixes, whitespace-separated fake `var (` syntax, and `!important` on canvas/dependency owners fail with dedicated codes; mutations restored with no production-source diff; full `verify` pass; unchanged baseline Stage B `8 passed`; `a2cee0ac` exact-head review completed | ninth corrected exact-head review pending | P1/P2 chain corrected through `d7a5dda6d2243c774e3d8fac43be839cdd29d2e6`; replacement review must be clean before Phase 1 |
| 1 | pending | pending | pending | pending | pending |
| 2 | pending | pending | pending | pending | pending |
| 3 | pending | pending | pending | pending | pending |
| 4 | pending | pending | pending | pending | pending |
| 5 | pending | pending | pending | pending | pending |
| 6 | pending | pending | pending | pending | pending |
