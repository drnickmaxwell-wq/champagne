# PHASE 0D — Chatbot Architecture Lock (Evidence Only)

## 1) Evidence Confirmations

### apps/chat-ui is UI-only
- `apps/chat-ui/app/page.tsx` renders a placeholder UI shell for the Concierge UI and contains no backend logic.
  - Evidence: “Champagne Concierge UI – Placeholder” and placeholder shell copy in the page component.【F:apps/chat-ui/app/page.tsx†L1-L8】

### No backend chatbot logic exists in the monorepo
- The only API route under `apps/web/app/api` is a health endpoint; no chatbot route handlers exist in the web app’s API surface.
  - Evidence: `apps/web/app/api/health/route.ts` defines a simple health response and is the only file under `apps/web/app/api`.【F:apps/web/app/api/health/route.ts†L1-L3】

## 2) FINAL Responsibility Split

### Monorepo (UI only)
- **Scope:** UI shells and presentation-only routes.
- **Evidence for UI scope:** `apps/chat-ui` is a UI placeholder; `apps/web` exposes only a health check API route (no chatbot logic).【F:apps/chat-ui/app/page.tsx†L1-L8】【F:apps/web/app/api/health/route.ts†L1-L3】

### External Chatbot Backend Service (Railway)
- **Scope:** All chatbot backend responsibilities (session/state, request/response handling, orchestration) live outside the monorepo.
- **Evidence for separation:** No chatbot backend route exists in the monorepo’s API surface; only health route is present in `apps/web` API. This requires a separate service for backend behavior.【F:apps/web/app/api/health/route.ts†L1-L3】

## 3) External Service — MAY / MUST NOT

### External Service MAY do
- Implement chatbot session/state orchestration and request/response handling.
- Provide Railway-deployable HTTP endpoints for chatbot backend operations.

### External Service MUST NOT do
- **MUST NOT** import or depend on monorepo UI apps (`apps/chat-ui`, `apps/web`, etc.).
- **MUST NOT** share runtime with ops-api or engine.
- **MUST NOT** impact Vercel builds (no coupling to `apps/web`).
- **Evidence basis:** Monorepo UI apps are UI-only shells (e.g., `apps/chat-ui`) and `apps/web` API surface is limited to health. Backend responsibilities are intentionally absent from monorepo apps.【F:apps/chat-ui/app/page.tsx†L1-L8】【F:apps/web/app/api/health/route.ts†L1-L3】

## 4) Monorepo — MAY / MUST NOT

### Monorepo MAY do
- Host UI-only shells and frontend routes for chat UX.
- Present UI placeholders or UI composition (e.g., Concierge UI page).【F:apps/chat-ui/app/page.tsx†L1-L8】

### Monorepo MUST NOT do
- **MUST NOT** implement chatbot backend session/state logic within monorepo apps.
- **MUST NOT** add chatbot backend API routes to `apps/web` (currently only health exists).【F:apps/web/app/api/health/route.ts†L1-L3】

## 5) Zero-Impact Confirmations

- **Vercel builds:** No changes required to `apps/web` runtime (only health route exists); backend logic remains external.【F:apps/web/app/api/health/route.ts†L1-L3】
- **ops-api:** External service is isolated; no coupling or shared runtime with ops-api.
- **Existing guards:** No changes to monorepo guard surfaces; UI-only scope remains intact.

