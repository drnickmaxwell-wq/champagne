# Champagne PR #864 Canvas Material Generation Architecture V1

## Decision status and scope

This document is the Phase 1 architecture decision for the Founder-authorised first-paint repair on PR #864. It preserves the currently approved visual result and does not select or calibrate the final Persian Midnight colour.

The target architecture replaces the transitional `critical-paint.v1.json` snapshot, handwritten TypeScript CSS template, and custom CSS-variable value resolver. It does not change Hero, motion, routes, manifests, page content, product behaviour, deployment, or the time-of-day theme contract.

## One authoritative source

The only editable owner of the default Champagne dark canvas material will be:

`packages/champagne-tokens/src/canvas-material.v1.json`

The file will be strict structured data, not a CSS expression string. Its closed schema will contain:

- a fixed schema version and material identifier;
- `finalPersianMidnightSelection: false` until separately authorised;
- a named expression graph made only from validated colour literals, `transparent`, references, and weighted `color-mix` nodes;
- a closed colour-space enum;
- integer weights with explicit bounds and opacity rules;
- named `canvas` and readable `foreground` outputs.

Selectors, CSS property names, style-element markup, output paths, generated-file banners, and package export names are generator-owned constants. They are not source-controlled strings and therefore cannot become injection surfaces.

Unknown keys, malformed colours, unsupported functions, missing references, duplicate node identifiers, cycles, invalid weights, context-dependent colours, and a non-opaque canvas fail before output is rendered. The currently approved values will be transcribed into the graph without visual calibration.

## Deterministic generated outputs

One generator will render exactly two committed artefacts from that source:

1. `packages/champagne-tokens/styles/champagne/canvas-material.generated.css`
   - the sole normal loaded-CSS owner of the material expression and its default ownership chain: `--smh-ink-navy`, `--brand-ink`, `--surface-canvas`, `--bg-ink`, and `--text-ink-high`;
   - imported once at the token layer so both web and direct token consumers receive it;
   - normal `:root` specificity, preserving the loaded theme's authority over the low-specificity critical seed.
2. `packages/champagne-tokens/src/critical-paint.generated.ts`
   - a leaf-pure module with no imports, re-exports, filesystem access, JSON loading, CSS side effects, or top-level calls;
   - exports only deterministic literal constants and validation metadata;
   - contains the low-specificity `:where(:root)` token seed plus `html`/`body` background and readable foreground painters.

Both files will use UTF-8, LF endings, stable node/property ordering, one final newline, no timestamps, and a warning naming the source path and regeneration command. A stable semantic source digest may be included as metadata, but exact byte comparison—not the digest alone—will decide drift.

Repeated generation from the same source must be byte-identical. A semantic source change must change both outputs.

## Package and runtime boundary

The tokens package will expose a public pure subpath:

`@champagne/tokens/critical-paint`

That subpath will map directly to `critical-paint.generated.ts`. `apps/web/app/layout.tsx` will import `champagneCriticalPaintCss` only from the pure subpath. It will not import the side-effectful bare `@champagne/tokens` entry.

The bare tokens entry may retain its existing theme compatibility behaviour for other consumers, but it will contain no handwritten critical CSS expression. The web workspace will declare its tokens workspace dependency explicitly so TypeScript, Next, and package resolution agree on the public boundary.

The generated CSS fragment will be imported by `packages/champagne-tokens/styles/champagne/tokens.css`, before handwritten rules consume the generated bindings. The superseded handwritten `--smh-ink-navy` expression and the `--brand-ink`, `--surface-canvas`, `--bg-ink`, and `--text-ink-high` ownership declarations will be removed. Existing general-purpose brand primitives may retain equal literal values because they own the wider brand palette, not the canvas material; no handwritten file may retain the canvas expression graph. Importing only from web `globals.css` or only from `theme.css` is prohibited because non-web consumers also load `tokens.css` directly.

## Generator and commands

The implementation command contract will be:

- `pnpm run generate:critical-paint` — validate the source and atomically write only the two allowlisted generated paths;
- `pnpm run check:critical-paint-generated` — render both outputs in memory and byte-compare them with the committed artefacts without modifying the worktree;
- a generator test command covering schema, graph, determinism, drift, and mutation fixtures.

The generator implementation will live under `packages/champagne-tokens/scripts/` and will expose pure validation/rendering functions for tests. Write mode may replace only the two explicit output files and must use temporary sibling files plus atomic rename. Check mode is read-only.

The root `verify` command will run the read-only generated check before guards, lint, typecheck, and build. CI will expose generation verification as a named step and will also run write-mode generation on a clean checkout followed by a path-limited `git diff --exit-code`. CI remains read-only with respect to the remote branch.

## Validation ownership

Generation replaces value parsing; it does not replace loaded-cascade validation.

The final surface guard will:

- validate the structured source and exact generated bytes through the shared generator library;
- use standards-based CSS and TypeScript ASTs to validate the generated fragment, pure module, package subpath, layout import, and one style injection;
- enforce exactly one generated default owner and the existing closed time-of-day owner allowlist;
- decode protected property identifiers and reject conditional, escaped, duplicate, unapproved, or `!important` owners in loaded import order;
- retain browser proof as the final computed-cascade oracle.

The final guard will not contain the current balanced-text/regular-expression CSS-variable resolver. It will not attempt to emulate CSS value resolution.

## Required failure semantics

| Mutation | Required failure |
| --- | --- |
| Invalid JSON, schema version, unknown/missing key, node type, colour space, colour or weight | source validation fails closed |
| Missing graph reference | deterministic `REF_MISSING` failure |
| Self-reference or multi-node cycle | deterministic `REF_CYCLE` failure |
| Transparent or context-dependent canvas | semantic opacity/self-containment failure |
| Same source generated twice | outputs are byte-identical |
| Canonical source material change | both generated outputs change |
| Stale/missing/renamed CSS or TypeScript output | read-only byte check fails |
| Manual generated-file edit | read-only byte check fails |
| Second default owner or later loaded override | AST ownership guard fails |
| Route-specific loaded divergence | direct-route browser equality fails |
| Removed or duplicated critical style | layout AST and browser count fail |
| Import added to the generated TypeScript leaf | pure-subpath validation fails |

Mutation fixtures must operate in temporary directories or detached disposable worktrees. No deliberate breakage may remain in the implementation branch.

## Phased migration boundary

- Phase 1 records this decision only; the existing implementation remains transitional and guarded.
- Phase 2 adds the structured source, shared generator, generated outputs, deterministic tests, commands, and dirty-generation enforcement.
- Phase 3 changes loaded CSS and layout ownership, exposes the pure package subpath, deletes `critical-paint.v1.json`, removes the handwritten template, and removes the bespoke resolver.
- Phase 4 validates the integrated outputs with the strict held-stylesheet browser proof.
- Phase 5 completes the bounded adversarial mutation matrix.
- Phase 6 runs exact-head verification and refreshes PR truth.

No phase may temporarily create an unguarded runtime path. The existing guarded path remains active until the generated path is ready to replace it atomically in Phase 3.

## Future Persian Midnight workflow

After separate Founder colour authority, the one material edit point will be:

`packages/champagne-tokens/src/canvas-material.v1.json`

The regeneration command will be:

`pnpm run generate:critical-paint`

The contributor must then run the read-only generated check, repository verification, strict browser matrix, and the applicable exact-head review gate. No other file should receive a manually copied colour expression.
