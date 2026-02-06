# PHASE 0B — Orchestrator Package Truth (Evidence Only)

## Scope
- Evidence-only review of `packages/champagne-orchestrator`.
- No code changes; report-only per task constraints.

## 1) Package scripts, dependencies, entrypoints

**Package metadata + entrypoints**
- Entrypoints are declared via `main` and `types`:
  - `"main": "dist/index.js"`
  - `"types": "dist/index.d.ts"`
  - Snippet: `"main": "dist/index.js"` / `"types": "dist/index.d.ts"`.【F:packages/champagne-orchestrator/package.json†L5-L6】

**Scripts**
- Build and lint only:
  - `"build": "tsc -p tsconfig.json"`
  - `"lint": "eslint ."`
  - Snippet: `"build": "tsc -p tsconfig.json"`, `"lint": "eslint ."`.【F:packages/champagne-orchestrator/package.json†L7-L10】

**Dependencies**
- No `dependencies` or `devDependencies` sections present in `package.json`.
  - Snippet shows only `name`, `private`, `version`, `main`, `types`, `scripts`.【F:packages/champagne-orchestrator/package.json†L1-L10】

## 2) Exported functions/types (src index)

From `packages/champagne-orchestrator/src/index.ts`:
- **Exported interface:** `ResolvedHeroConfigStub` with optional fields `sceneId`, `variantId`, `surfaceToken`.
  - Snippet: `export interface ResolvedHeroConfigStub { ... }`.【F:packages/champagne-orchestrator/src/index.ts†L3-L7】
- **Exported function:** `resolveHeroConfig(experience: ChampagneExperience)` returning `ResolvedHeroConfigStub | undefined` and currently returning `experience.hero`.
  - Snippet: `export const resolveHeroConfig = ... return experience.hero;`.【F:packages/champagne-orchestrator/src/index.ts†L9-L14】
- **Imported type:** `ChampagneExperience` from `@champagne/canon`.
  - Snippet: `import type { ChampagneExperience } from "@champagne/canon";`.【F:packages/champagne-orchestrator/src/index.ts†L1】

## 3) Evidence of session handling, state machine, request/response schema

**Session handling**
- No session types or handlers are defined in the package’s only export file; the file only contains `ResolvedHeroConfigStub` and `resolveHeroConfig`.
  - Snippet: `export interface ResolvedHeroConfigStub ...` and `export const resolveHeroConfig ...`.【F:packages/champagne-orchestrator/src/index.ts†L3-L14】
- **Conclusion:** No evidence of session handling in `packages/champagne-orchestrator` source exports.

**State machine**
- No state machine types, transitions, or libraries referenced in `src/index.ts`; only hero config resolution stub.
  - Snippet: `// TODO: implement hero config resolution using canon and manifests.`【F:packages/champagne-orchestrator/src/index.ts†L12】
- **Conclusion:** No evidence of state machine implementation.

**Request/response schema**
- No schema definitions (e.g., Zod/JSON schema) or request/response types are present; `index.ts` only has `ResolvedHeroConfigStub` and `resolveHeroConfig`.
  - Snippet: `export interface ResolvedHeroConfigStub ...` and `resolveHeroConfig` signature.【F:packages/champagne-orchestrator/src/index.ts†L3-L11】
- **Conclusion:** No evidence of request/response schema in current exports.

## 4) Thinnest possible Railway-deployable “service wrapper” (recommendation)

**Recommendation (minimal shape)**
- A tiny HTTP service wrapper that:
  1. Imports `resolveHeroConfig` and accepts a JSON payload containing `ChampagneExperience` (or a subset mapped to it).
  2. Returns `resolveHeroConfig(experience)` as JSON.
  3. Exposes a health check route (e.g., `GET /health`) for Railway.
- **Why minimal:** This aligns with the current package surface (single exported function + one interface) and avoids introducing session/state machine complexity not present in the package exports.【F:packages/champagne-orchestrator/src/index.ts†L1-L14】

**Suggested endpoints (shape only, not implementation):**
- `GET /health` → `{ "status": "ok" }`
- `POST /resolve-hero` → input: `{ experience: ChampagneExperience }` → output: `ResolvedHeroConfigStub | null`

**Notes**
- This is a packaging recommendation only; no implementation changes are proposed in this report.

