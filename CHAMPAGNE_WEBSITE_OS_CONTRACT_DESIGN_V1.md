# Champagne Website OS Contract Design V1

Status: `DESIGN_ONLY_FAIL_CLOSED`  
Scope: Champagne repo only  
Runtime mutation: none  
Provider calls: none  
Launch readiness claim: none

## Evidence read

This contract is based on repository evidence only:

- PR #850 true-state audit reports, including hero, atmosphere, surface, token, typography, performance, and structural audits.
- Campaign 007 evidence harvest, especially `CHAMPAGNE_CAMPAIGN007_REALITY_AUDIT_V1.md`.
- Existing Website OS contracts under `ops/contracts/**`.
- Required guards: `npm run guard:hero`, `npm run guard:canon`, `npm run verify`.

Campaign 007 is treated as useful repository evidence, not live-provider proof. Website OS must therefore never infer public launch readiness from Campaign 007 alone.

## Operating posture

Website OS for Champagne is a governed import/export and proposal system. It may describe repo truth, generate candidate changes, and package review evidence. It must not directly mutate production runtime, call PMS/provider systems, deploy, or bypass guards.

The default outcome for uncertainty is rejection.

## Import contract

Website OS may import only non-secret, non-PHI repository truth exported from approved sources.

### Required import envelope

Every import must include:

- `contractVersion`
- `repo`
- `branch`
- `commitSha`
- `generatedAt`
- `sourceReports`
- `sourceHashes`
- `guardStatus`
- `scopeDeclaration`
- `dataClassDeclaration`
- `launchReadinessDeclaration`

### Allowed import data families

| Family | Allowed examples | Notes |
| --- | --- | --- |
| Route/page inventory | public routes, page IDs, manifest links | Must include source hash and stale-state marker. |
| Treatment source truth | slug, route, content hash, SEO hash | Must not contain patient records or provider data. |
| Section registry | section kind, compatibility, editable field metadata | No runtime component code in the import payload. |
| SEO metadata truth | title, description, canonical, JSON-LD presence | Claims must remain evidence-backed. |
| Token/surface capability | semantic token names, allowed surface contexts | No raw colour proposals. |
| Hero binding truth | read-only hero IDs/variant IDs/diagnostic state | Sacred hero manifests and renderer remain immutable to Website OS. |
| Evidence-review metadata | reviewer state, evidence references, decision logs | Human review gates are mandatory before implementation. |

### Forbidden import data

Website OS must reject imports containing:

- PHI, PMS data, appointment data, clinical records, enquiry payloads, or secrets.
- Provider credentials, API keys, deployment tokens, cookies, session data, or private logs.
- Raw runtime source patches disguised as imports.
- Claims of live Search Console, analytics, or provider validation unless accompanied by a separate approved evidence artifact.

## Export contract

Website OS exports must be immutable evidence bundles or proposal packets, not runtime side effects.

### Export types

1. `truth_export`: normalized repo truth for routes, manifests, content hashes, section capabilities, and guard state.
2. `patch_packet`: a proposed change packet for later Codex implementation.
3. `review_packet`: founder/clinical/brand/SEO/launch-proof review queue.
4. `tenant_blueprint_candidate`: extraction candidate with Champagne-specific exclusions.

### Export rules

- Exports must include source hashes for every editable source they reference.
- Exports must preserve sacred-zone declarations.
- Exports must mark launch readiness as `false` unless a separate future launch-proof audit authorizes otherwise.
- Exports must be deterministic JSON plus human-readable Markdown where useful.

## Safe patch packet schema

A Website OS patch packet is a proposal, not an applied diff.

### Required top-level fields

- `packetId`
- `contractVersion`
- `createdAt`
- `createdBy`
- `repo`
- `baseCommitSha`
- `objective`
- `changeClass`
- `allowedFiles`
- `forbiddenFiles`
- `sourcePreconditions`
- `proposedOperations`
- `tokenPolicy`
- `heroPolicy`
- `seoPolicy`
- `evidenceReview`
- `validationPlan`
- `rollbackPlan`
- `failureMode`

### Allowed operation types

| Operation | Meaning | Required constraints |
| --- | --- | --- |
| `content.replaceField` | Replace a manifest/content field | Requires source hash, reviewer approval, no PHI. |
| `seo.updateMetadata` | Update title/description/canonical/OG/Twitter field | Requires SEO review and route evidence. |
| `seo.addJsonLd` | Add structured data payload | Must be schema-valid and evidence-backed. |
| `design.bindToken` | Swap an existing semantic token binding | No raw colours, gradients, or new tokens unless separately authorized. |
| `section.reorderAllowed` | Reorder approved non-sacred sections | Requires layout preview and rollback. |
| `section.toggleAllowed` | Enable/disable approved non-sacred section | Requires review of content and journey impact. |
| `route.addDraftPage` | Propose a draft route/page | Requires anti-doorway, SEO, founder, and clinical review. |

### Forbidden operation types

- Direct edits to sacred hero engine files, sacred manifests, or sacred render entry.
- Provider calls, PMS writes, Dentally mutation, deployment, or production cache purge.
- Raw CSS colour literals, inline gradients, or non-token Tailwind colour utilities.
- Changes to guards that weaken enforcement.
- Claims that convert evidence into medical advice, guarantees, or launch certification.

## Validation gates

A patch packet may advance to Codex implementation only if:

1. Source hashes match current repository state.
2. Allowed files are exact and minimal.
3. Sacred zones are excluded unless explicit fresh authority exists.
4. Token policy is token-only.
5. Evidence-review statuses are complete for the change class.
6. Rollback plan names the exact files/fields to revert.
7. Required guards are present and planned: `npm run guard:hero`, `npm run guard:canon`, `npm run verify`.

## Fail-closed rejection reasons

Website OS must reject a packet if any of the following are true:

- Unknown source hash.
- Ambiguous editable zone.
- Missing reviewer approval.
- Proposed raw colour or gradient.
- Sacred-zone touch without fresh named authority.
- Missing rollback path.
- Guard missing or not wired.
- Launch-readiness claim unsupported by separate live evidence.
