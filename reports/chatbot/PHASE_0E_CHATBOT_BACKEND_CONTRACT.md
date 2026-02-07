PHASE_0E_CHATBOT_BACKEND_CONTRACT
VERSION: 1
ASCII_ONLY: true

SERVICE_PURPOSE:
- Provide an external, Railway-deployable chatbot backend responsible for session and state handling, separate from the monorepo UI surface.
- Keep backend responsibilities outside the monorepo, which is UI-only per prior phase locks.

ALLOWED_RESPONSIBILITIES:
- Session handling (session-only; no PHI).
- State handling (explicit enumerated states only).
- Request/response handling for backend operations.
- Health endpoint for service status.

FORBIDDEN_RESPONSIBILITIES:
- Import or depend on monorepo UI applications.
- Provide UI rendering or frontend routing.
- Include PHI in session data.

SESSION_MODEL:
- session_only: true
- phi_allowed: false

STATE_MODEL:
- states:
  - UNSPECIFIED

HTTP_ENDPOINTS:
- GET /health : Service health check.
- POST /resolve-hero : Resolve hero config from provided experience data.

REQUEST_SHAPES:
- POST /resolve-hero
  - fields:
    - experience

RESPONSE_SHAPES:
- GET /health
  - fields:
    - status
- POST /resolve-hero
  - fields:
    - sceneId
    - variantId
    - surfaceToken

NON_GOALS:
- No UI implementation.
- No monorepo app dependencies.
- No PHI handling.

EVIDENCE_REFERENCES:
- Orchestrator export surface and resolveHeroConfig output fields: sceneId, variantId, surfaceToken.【F:packages/champagne-orchestrator/src/index.ts†L3-L14】
- Suggested minimal endpoints (health, resolve-hero) and external backend separation in phase evidence reports.【F:reports/chatbot/PHASE_0B_ORCHESTRATOR_PACKAGE_TRUTH.md†L37-L46】【F:reports/chatbot/PHASE_0C_BACKEND_PLACEMENT.md†L27-L41】【F:reports/chatbot/PHASE_0D_CHATBOT_ARCHITECTURE_LOCK.md†L15-L23】
