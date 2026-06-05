# CHAMPAGNE_DESIGN_AUTHORITY_INDEX_V1

Mode: `READ_ONLY_DESIGN_AUTHORITY_CONSOLIDATION`  
Evidence date: 2026-06-05  
Repository: `drnickmaxwell-wq/champagne`

## Scope and non-goals

This pack consolidates recovered Champagne design authorities and audits current background/surface state from repository evidence only. It does not implement, tune, or choose colours; it does not change hero, tokens, typography, nav, or layout behavior.

## Authority status key

- `active`: current repository authority or runtime source of truth.
- `legacy`: historical/imported reference that may contain useful design intent but is not active runtime law by itself.
- `superseded`: documented older approach replaced by later canon/runtime.
- `conflict`: evidence conflicts with other sources and needs Director resolution before use.
- `needs assimilation`: strong recovered intent that has not been promoted into active canon/runtime.

## Master authority map

| Authority document / source | Role | Current status | Confidence | Future-agent use |
| --- | --- | --- | --- | --- |
| `AGENTS.md` | Operational law, sacred-zone restrictions, guard requirements, surface semantics, allowed modification scopes. | active | High | Start every mission here; obey sacred-zone and token-only constraints before consulting design docs. |
| `docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md` | Material/token canon: immutable brand chroma, Persian Midnight target, porcelain, restrained gold, glass, cinematic hero, time-of-day boundaries. | active | High | Primary design-material authority; use for decisions, not as evidence that all tokens are implemented. |
| `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` | Primitive brand-token source containing literal chroma anchors. | active | High | Runtime token substrate; literals belong here/guard sources only. |
| `packages/champagne-tokens/styles/champagne/tokens.css` | Semantic token definitions for derived ink, porcelain ladder, glass, shadows, text aliases. | active | High | Runtime token implementation truth; audit exact definitions before any material decision. |
| `packages/champagne-tokens/styles/champagne/theme.css` | Root theme binding and page default context. | active | High | Source for active app/page background context and porcelain text-context override. |
| `apps/web/app/globals.css` | App-level CSS import and root body/html background binding. | active | High | Source for actual website body/html background after theme import. |
| `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md` | Recovered Manus design universe; declares design principles, Composite Bonding as Rosetta Stone, Phase 1B spacing. | needs assimilation | High | Use as recovered design-flow authority and reference-pattern map; do not treat raw gradient/font statements as active token law without reconciliation. |
| `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Section_Catalog.json` | Recovered section archetype catalog: hero, body, CTA, FAQ, testimonial variants. | needs assimilation | High | Use for section archetype matching and design-flow comparison, especially Composite-derived patterns. |
| `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Integration_Roadmap.md` | Historical integration plan for hero, layout, cards, tabs, and Composite-derived reusable components. | legacy / needs assimilation | Medium | Use as migration-history context only; current package architecture has diverged. |
| `_imports/code/hero-engine/docs/Champagne_Page_Architecture.md` | Canonical marketing-site architecture blueprint; V1/V1.5/V2 page requirements and Manus mappings. | legacy / needs assimilation | Medium | Use for launch-intent and route-family requirements; verify against current manifests/routes before acting. |
| `_imports/champagne-hero/code/guards/reports/Champagne_Page_Strategy_Report.md` | Older strategy framing for page hierarchy and launch priorities. | legacy | Medium | Use for historical strategy context only; current manifests and route reports supersede runtime facts. |
| `packages/champagne-manifests/data/champagne_machine_manifest_full.json` | Active route/page manifest and treatment page metadata/section stacks. | active | High | Use as route/page truth for rendered treatment pages, including Composite Bonding path and section count. |
| `packages/champagne-manifests/data/sections/smh/*.json` | Active section-stack source for treatment pages. | active | High | Use for content/section structure truth; do not infer visual design beyond component IDs and sequence. |
| `apps/web/app/treatments/[slug]/page.tsx` | Active dynamic treatment route; resolves aliases, metadata, JSON-LD, and renders builder. | active | High | Use to confirm treatment route rendering path. |
| `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx` | Active builder wrapper for manifest-rendered pages; uses porcelain surface context and SectionRenderer. | active | High | Use to evaluate current page surface behavior and treatment page structure. |
| `reports/hero/v2-surface-truth-pack.md` | Hero V2 surface-stack truth pack and home-binding evidence. | active audit / needs regeneration if hero changed | High | Use for hero surface diagnostics; regenerate rather than blindly trusting if hero files changed. |
| `REPORTS/HERO_ROUTING_CONTRACT_V1.md` and `.json` | Hero routing contracts. | needs assimilation / potentially stale | Medium | Use as historical contract; verify against direct manifest/runtime query before implementation. |
| `reports/hero/*` | Hero audit and stability reports. | active audit set / partially historical | Medium | Use to understand sacred hero risks, PRM/motion/surface governance, and past fixes; prefer latest direct code evidence for final decisions. |
| `HERO_FLASH_BLOCKER_ANALYSIS.md` | Current flash risk analysis and diagnostic protocol. | active audit | High | Use as the safest starting point for nav/hero/background flash investigation. |
| `SURFACE_TOKEN_MASTER_TRUTH_AUDIT.md` | Master truth audit for current surface-token implementation and gaps. | active audit | High | Use as current surface implementation overview; verify exact lines in token files before changes. |
| `PERSIAN_MIDNIGHT_TOKEN_DECISION_READINESS.md` | Decision-readiness report for Persian Midnight tokenization. | active audit | High | Use to frame decision questions; do not implement Persian Midnight from this alone. |
| `SURFACE_TOKEN_CAPABILITY_GAP_AUDIT.md` | Capability gap report: Persian Midnight naming, undefined tokens, nav/footer abstractions, guards. | active audit | High | Use to scope the next decision pack and guard gaps. |
| `PORCELAIN_TOKEN_DECISION_READINESS.md` and `PORCELAIN_SURFACE_DEPENDENCY_REPORT.md` | Porcelain decision/dependency audits. | active audit | Medium | Use for porcelain scope/risk framing, especially default section/card surfaces. |
| `SURFACE_STATE_INFRASTRUCTURE_AUDIT.md` | Surface-state infrastructure audit. | active audit | Medium | Use to confirm no generalized surface-state orchestrator exists before proposing one. |
| `ATMOSPHERIC_SYSTEM_MASTER_TRUTH_AUDIT.md` and `ATMOSPHERIC_SYSTEM_READINESS_REPORT.md` | Atmosphere/time-of-day truth and readiness reports. | active audit | High | Use to distinguish canon atmosphere from implemented runtime atmosphere. |
| `TYPOGRAPHY_MASTER_TRUTH_AUDIT.md` | Runtime typography truth audit. | active audit | High | Use to confirm active font/runtime state. |
| `TYPOGRAPHY_CANON_RUNTIME_MISMATCH_REPORT.md` | Typography mismatch report. | active audit | Medium | Use for conflict inventory. |
| `LUXURY_TYPOGRAPHY_DECISION_READINESS.md` | Typography decision-readiness report. | active audit | High | Use to frame a typography decision pack; do not change fonts without fresh authority. |
| `packages/champagne-canon/canon/visual/01_visual_canon_overview.md` and `03_material_tokens.json` | Packaged canon visual/material references. | active / needs alignment with docs canon | Medium | Use as supporting canon, but reconcile with the explicit material canon and runtime token files. |
| `_imports/champagne-hero/docs/docs/Brand_Canon_Packet/Brand_Canon_README.md` and related imports | Brand-canon imports, gradient/history artifacts. | legacy / needs assimilation | Medium | Use for provenance and recovered intent; current guarded token files are higher authority. |

## Current authoritative design documents

1. `AGENTS.md` is the highest repository-operational authority for this mission because it defines sacred zones, guard requirements, token-only law, and semantic surface contract.
2. `docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md` is the current design-material authority.
3. `packages/champagne-tokens/styles/champagne/*.css` and `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` are the current runtime token authorities.
4. `packages/champagne-manifests/data/champagne_machine_manifest_full.json` and `packages/champagne-manifests/data/sections/smh/*.json` are the current page/section content and routing authorities.
5. Active audit reports (`SURFACE_TOKEN_MASTER_TRUTH_AUDIT.md`, `PERSIAN_MIDNIGHT_TOKEN_DECISION_READINESS.md`, `HERO_FLASH_BLOCKER_ANALYSIS.md`, `TYPOGRAPHY_MASTER_TRUTH_AUDIT.md`, `ATMOSPHERIC_SYSTEM_MASTER_TRUTH_AUDIT.md`) should be treated as decision inputs, not implementation authorization.

## Current hero authority

- Operationally sacred hero core and renderer files remain governed by `AGENTS.md`.
- Current rendered public pages mount `HeroMount` from the root layout when public page and feature flag conditions allow it.
- Hero V2 behavior is controlled by `NEXT_PUBLIC_HERO_ENGINE=v2`; otherwise the legacy renderer path is used.
- Hero reports/contracts are useful but must be regenerated or verified against code/manifests before rollout because stale report risk is documented.

## Current atmosphere authority

- Material canon authorizes atmosphere/time-of-day only within immutable brand chroma boundaries.
- `ATMOSPHERIC_SYSTEM_MASTER_TRUTH_AUDIT.md` is the best consolidated atmosphere status report.
- Runtime atmosphere is incomplete: token CSS has limited time-of-day behavior, hero has its own stronger surface pipeline, and no global atmosphere/surface-state orchestrator was found.

## Current surface authority

- `AGENTS.md` semantic surface contract is the strongest semantic law.
- `SURFACE_TOKEN_MASTER_TRUTH_AUDIT.md` is the best surface-status synthesis.
- Token CSS is the runtime implementation truth: active root background is bound through `--bg-ink`; porcelain is implemented through `--surface-0/1/2`; several canon/runtime surface names remain undefined.

## Current typography authority

- `TYPOGRAPHY_MASTER_TRUTH_AUDIT.md` and `LUXURY_TYPOGRAPHY_DECISION_READINESS.md` are the safest current typography authorities.
- Runtime body is Inter-first/system fallback; historical Manus/Blueprint font guidance conflicts and is not implementation-ready.

## Current Manus design-flow authority

- `Manus_Design_Atlas_v1.md` and `Manus_Section_Catalog.json` are the recovered Manus design-flow authorities.
- They are not fully assimilated into active runtime law.
- Composite Bonding Phase 1B remains the clearest recovered spacing/design-flow reference, but the active Composite treatment page is now manifest-rendered and should be audited visually/structurally before being used as a production visual gold standard.

## Consolidation verdict

Champagne has enough evidence for a design-authority decision pack and safe audits. It does not have enough stable evidence for a broad implementation mission touching background, nav, typography, Persian Midnight, or hero variants. The next mission should be diagnostic/decision-focused unless the Director authorizes a narrow implementation packet with guard and visual-proof requirements.
