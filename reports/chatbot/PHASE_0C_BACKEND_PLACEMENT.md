# PHASE 0C — Backend Placement Decision (Evidence Only)

## Evidence Summary (Apps Under `/apps`)

### apps/chat-ui
- **Purpose:** Placeholder Champagne Concierge UI shell.
  - Evidence: “Champagne Concierge UI – Placeholder” and placeholder shell text.【F:apps/chat-ui/app/page.tsx†L1-L8】
- **Runtime:** Next.js app (Next scripts + dependencies).
  - Evidence: `next` dependency and `next dev/build/start` scripts.【F:apps/chat-ui/package.json†L4-L18】
- **Safe to add chatbot backend logic:** **NO** — This is a frontend Next app intended as a UI shell; adding backend session/state logic would entangle it with Vercel-style web builds.
  - Evidence: UI-only placeholder description and Next.js runtime configuration.【F:apps/chat-ui/app/page.tsx†L1-L8】【F:apps/chat-ui/package.json†L4-L18】

### apps/portal
- **Purpose:** Placeholder Patient Portal UI shell.
  - Evidence: “Patient Portal – Placeholder” and placeholder shell text.【F:apps/portal/app/page.tsx†L1-L8】
- **Runtime:** Next.js app (Next scripts + dependencies).
  - Evidence: `next` dependency and `next dev/build/start` scripts.【F:apps/portal/package.json†L4-L18】
- **Safe to add chatbot backend logic:** **NO** — This is a frontend portal shell; backend session/state logic here would mix with the portal’s Next.js UI runtime.
  - Evidence: placeholder UI intent and Next.js runtime configuration.【F:apps/portal/app/page.tsx†L1-L8】【F:apps/portal/package.json†L4-L18】

### apps/stock
- **Purpose:** Stock workflow UI with stub routes (scan/item/reorder).
  - Evidence: “Stock Module” and stub route links for scan/item/reorder.【F:apps/stock/app/page.tsx†L1-L16】
- **Runtime:** Next.js app (Next dependency; app routing).
  - Evidence: `next` dependency in package.json.【F:apps/stock/package.json†L8-L14】
- **Safe to add chatbot backend logic:** **NO** — This is a UI workflow app with Next.js runtime; adding chatbot session/state logic would couple unrelated concerns.
  - Evidence: stock UI route stubs and Next runtime dependency.【F:apps/stock/app/page.tsx†L1-L16】【F:apps/stock/package.json†L8-L14】

### apps/web
- **Purpose:** Primary Champagne website app, using `ChampagnePageBuilder` for root route.
  - Evidence: page uses `ChampagnePageBuilder` for `/` route.【F:apps/web/app/page.tsx†L1-L5】
- **Runtime:** Next.js app (Next scripts + dependencies).
  - Evidence: `next` dependency and `next dev/build/start` scripts.【F:apps/web/package.json†L4-L19】
- **Safe to add chatbot backend logic:** **NO** — This is the production web app (Vercel-style builds implied by Next runtime); backend session/state logic must remain isolated from web builds.
  - Evidence: Next.js runtime configuration and root page builder usage.【F:apps/web/package.json†L4-L19】【F:apps/web/app/page.tsx†L1-L5】

## Placement Decision

### Recommended option: **C) External standalone repo**
**Reasoning (evidence-based):**
- All inspected apps under `/apps` are Next.js UI applications (chat-ui, portal, stock, web). Each is configured as a Next runtime with `next` build/start scripts and/or a UI placeholder page, indicating they are frontend apps and not designed for backend session/state logic.【F:apps/chat-ui/package.json†L4-L18】【F:apps/portal/package.json†L4-L18】【F:apps/stock/package.json†L8-L14】【F:apps/web/package.json†L4-L19】
- UI pages explicitly describe placeholder shells or UI routes, reinforcing frontend scope only (e.g., Concierge UI placeholder, Patient Portal placeholder, Stock Module routes, web page builder).【F:apps/chat-ui/app/page.tsx†L1-L8】【F:apps/portal/app/page.tsx†L1-L8】【F:apps/stock/app/page.tsx†L1-L16】【F:apps/web/app/page.tsx†L1-L5】

**Placement**: External standalone repo dedicated to the chatbot backend service (Railway deployable), keeping it isolated from the monorepo’s Next.js UI apps and avoiding any shared runtime with ops-api or engine.

## Responsibility Boundaries (External Repo)
- **Minimal responsibility:** HTTP API for chatbot session/state orchestration (session lifecycle, state transitions, request/response handling) with Railway deployment.
- **Must NOT import or depend on:** any Next.js UI apps under `/apps` (chat-ui, portal, stock, web), or any app-specific runtime code from this monorepo. This avoids coupling to Vercel builds and aligns with the “no shared runtime” constraint.
  - Evidence: all `/apps` inspected are Next.js UI apps configured via Next runtime scripts/dependencies.【F:apps/chat-ui/package.json†L4-L18】【F:apps/portal/package.json†L4-L18】【F:apps/stock/package.json†L8-L14】【F:apps/web/package.json†L4-L19】

## Explicit Confirmations
- **No impact to Vercel production builds:** External standalone repo is outside `/apps/web` and other Next apps; no changes to their build pipelines or runtime. Evidence of Next runtime in apps reinforces separation.【F:apps/web/package.json†L4-L19】
- **No impact to existing monorepo guards:** External repo avoids changes to the monorepo; guard scopes remain untouched. (No monorepo file changes required.)
- **No coupling to ops-api or engine:** External service is isolated and does not share runtime with monorepo apps.

