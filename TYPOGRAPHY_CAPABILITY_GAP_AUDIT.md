# TYPOGRAPHY_CAPABILITY_GAP_AUDIT

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Executive finding

Champagne currently has typography declarations but lacks a full typography system capability. The strongest implemented capability is a global body font stack and a small CSS utility vocabulary. Missing capabilities include font loading, semantic tokens, Tailwind integration, component contracts, guards, and performance budgets.

## Capability matrix

| Capability | Current state | Gap |
| --- | --- | --- |
| Body font stack | Implemented in theme CSS. | Web font source not controlled. |
| Display/title utility classes | Implemented in typography CSS. | Not globally applied; fallback incomplete; font not loaded. |
| Semantic font variables | Not found. | Need `--font-display`, `--font-body`, `--font-ui`, etc. if selected. |
| Type scale tokens | Partial class sizes only. | No comprehensive scale/line-height/tracking token system. |
| Tailwind typography integration | Empty `theme.extend`; no plugins. | Need mapped font families and semantic type utilities if Tailwind remains API. |
| Next/font or self-hosted loading | Not found. | Need deterministic loading strategy. |
| Heading binding | Not found. | Need global or component-level heading contract. |
| Hero display binding | Not found in hero frame. | Need chosen display token applied safely if authorized. |
| Component contract | Not found. | Need standardized `Eyebrow`, `SectionTitle`, `BodyCopy`, etc. or equivalent. |
| Typography guard | Not found. | Need no-drift guard after contract exists. |
| Font performance budget | Not found. | Need max bytes/weights/subsets/preload rules. |
| License/provenance registry | Not found. | Need source/license record for chosen fonts. |
| Accessibility type checks | Not found. | Need legibility/contrast/zoom/reflow checks once fonts chosen. |

## Structural gaps

### 1. Authority gap

The repo contains conflicting typography evidence and no active file that explicitly resolves it.

### 2. Loading gap

The repo names fonts but does not load font assets. This makes brand typography dependent on local machine fonts or system fallback.

### 3. Token model gap

The active typography file uses classes, not a semantic variable system. This limits reuse in Tailwind, inline styles, CSS modules, and component props.

### 4. Component API gap

Sections and hero components independently define sizes and weights. There is no shared typography primitive layer.

### 5. Guard gap

No guard prevents future font-family drift, unapproved font loading, raw arbitrary type values, or heading/display token bypass.

### 6. Performance governance gap

No font performance budget exists. A future implementation could add too many weights or block rendering unless constrained.

### 7. Product-surface gap

Marketing site, patient portal, stock app, concierge, and future cockpit surfaces do not have documented typography inheritance/exception rules.

## Gap priority

| Priority | Gap | Why |
| --- | --- | --- |
| P0 | Authority gap | Cannot safely implement without choosing active canon. |
| P0 | Loading gap | Declared fonts are not deterministic. |
| P1 | Hero/display binding gap | Primary brand surface may not use intended display typography. |
| P1 | Token model gap | Component migrations need a shared API. |
| P1 | Guard gap | Drift will continue silently. |
| P2 | Tailwind integration gap | Needed if Tailwind remains component authoring surface. |
| P2 | Performance budget gap | Needed before adding font files. |
| P2 | Product-surface exception gap | Needed for portal/ops/cockpit consistency. |

## Capability readiness conclusion

Champagne typography is currently at **declaration maturity**, not **system maturity**. It can support an audit and decision pack. It should not yet support a broad typography implementation without prior canon and guard work.
