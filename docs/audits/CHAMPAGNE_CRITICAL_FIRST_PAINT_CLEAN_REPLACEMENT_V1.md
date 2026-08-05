# Champagne Critical First-Paint Clean Replacement V1

## Status

`FOUNDER_AUTHORISED_DRAFT_IMPLEMENTATION_EVIDENCE`

This receipt records the bounded repair of PR #865 in `drnickmaxwell-wq/champagne`. It does not select a final Persian Midnight material, mark the pull request ready, authorise merge or deployment, mutate `drnickmaxwell-wq/agent`, or register evidence in Router or WEOS.

## Authority and exact boundary

- Authorised base: `a3484e976d240aaedf88a9b13afdd6ccc8d7d267`
- Existing branch: `agent/champagne-critical-first-paint-clean-replacement-v1`
- Frozen evidence PR #864: `4c1548744e8d7afdac70a02e1f42c29fb4a2d2d6`
- Read-only `drnickmaxwell-wq/agent` boundary: `18a3682567096e9363dcbc85fcdf0bff7858627f`
- Maximum changed paths: 17
- No lockfile, dependency, application-page design, routing, middleware, Hero V2, production, provider or spending mutation is authorised by this receipt.

## Precise architecture statement

`packages/champagne-tokens/src/canvas-material.v1.json` is the sole human-editable **first-paint composition graph**. It is not the sole human-editable source of every material primitive.

The graph references separately maintained primitive leaves in:

`packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`

The generator validates exact parity between each graph literal and its canonical primitive owner. It then deterministically emits:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
2. `packages/champagne-tokens/src/critical-paint.generated.ts`

The loaded stylesheet and direct-head critical paint therefore share one composition graph while retaining explicit, separately governed primitive ownership.

## Independently reproduced audit findings

The 5 August 2026 read-only audit findings were reproduced against starting head `2f98378fbf0515a09a7ac7fd3ecfb17772e78954` before correction:

1. A later direct or escaped declaration of protected primitive, alias, immutable or generated owners could escape the incomplete ownership closure.
2. A matched brace component in a custom-property value could be mistaken for the end of the stylesheet rule, hiding a later effective protected owner.
3. A newline-created bad string could swallow a later browser-effective protected owner.
4. The generator and guard contained independently editable parser implementations.
5. The `critical-paint-generated` workflow job used mutable major-version Action tags.
6. The former “only human-editable material source” wording overstated the architecture.

## Repair implemented

### One parser authority

`packages/champagne-tokens/scripts/css-declarations.v1.mjs` is the single CSS declaration parser authority. The generator and surface guard import the same implementation; the duplicate guard parser was removed.

The shared parser now:

- decodes CSS identifier escapes;
- ignores comments outside strings without hiding declarations;
- handles quoted strings and escaped newlines;
- recovers from CSS bad strings at unescaped newlines;
- tracks parentheses, brackets and matched brace components;
- distinguishes custom-property component braces from stylesheet rule braces;
- handles nested rules and declarations without a trailing semicolon;
- fails closed on unbalanced or unsupported input rather than returning an empty owner set.

### Complete material ownership closure

The recursive guard scans all CSS under the protected token and application trees and rejects symbolic links. Its ownership contract covers:

- literal leaves: `--ink`, `--brand-teal`, `--brand-magenta`, `--smh-white`;
- generated owners: `--smh-ink-navy`, `--brand-ink`, `--surface-canvas`, `--bg-ink`, `--text-ink-high`;
- transitive alias: `--ink-100`;
- immutable primitives: `--brand-gold`, `--brand-gold-keyline`;
- exact approved dawn, dusk and night `--surface-canvas` owners only.

Direct, escaped and comment-separated competing declarations are decoded and rejected. Canonical owner counts, paths and values must match exactly.

### Workflow immutability

The `critical-paint-generated` job pins reviewed full commit SHAs:

- `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` (`v4.2.2`)
- `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020` (`v4.4.0`)

The surface guard rejects a return to mutable major-version tags within that job.

## Adversarial proof contract

The Node suite proves:

- shared parser function identity;
- direct, escaped and comment-separated ownership attacks for every protected owner;
- brace-component recovery;
- bad-string newline recovery;
- malformed-CSS fail-closed behaviour;
- exact primitive-owner parity and drift rejection;
- exact time-of-day owner exemptions;
- file and directory symlink rejection;
- missing references, cycles, opacity, deterministic serialization, generated freshness and byte-clean regeneration.

The umbrella surface-semantics guard additionally proves the exact theme selectors and critical-head placement against the live repository bytes.

The Stage B browser matrix continues to prove real first-versus-loaded paint equality, readable foreground, time-of-day resolution, parser-time fallback, public Hero V2 continuity, direct route loads, client navigation, mobile/desktop and reduced-motion behaviour.

## Verification evidence

The functional implementation head immediately preceding this receipt was:

`793abef605e4c7138f0952f60f476acf1b66af9e`

At that head, GitHub recorded successful results for:

- Champagne CI, including full umbrella `verify`;
- generated freshness and byte-clean regeneration;
- the expanded Node adversarial suite;
- production web build, lint and TypeScript;
- workspace, canon, Hero, rogue-colour, surface-semantics and token-binding guards;
- Stage B real-internal-HTML proof and Chromium matrix;
- CodeQL, Semgrep, Trivy, Gitleaks and SBOM.

Because this receipt is itself tracked, all mandatory checks must rerun against the final receipt-bound exact head. The pull-request description and exact-head Codex request are the final binding records for those rerun results.

## Evidence classification

- Parser, ownership and generator fixtures: `FIXTURE_PROVEN`
- Visitor-facing and internal-lab browser behaviour: `LIVE_READ_PROVEN`
- WEOS runtime, Router consumption and cross-repository registration: not claimed

## Governance and next gate

PR #865 must remain draft and unmerged. After the final receipt-bound head is green, the PR description may record the exact head, 17-path boundary, exact test counts and workflow results. Exactly one fresh `@codex review` request must then be posted against that head and the branch frozen.

Any further Codex finding ends this repair loop and moves the work to a separate independent ChatGPT audit. Independent read-only audit and later Founder exact-head merge authority remain mandatory.

## Rollback

Before merge, close PR #865 and delete its branch if the Founder rejects it; `main` remains unchanged. After a separately authorised merge, revert the accepted merge commit. Frozen PR #864 is evidence only and is not a rollback merge source.
