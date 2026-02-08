# patient-ai-service (Zone B)

Governance-first scaffolding for the PHI-enabled Zone B service. This package is intentionally stub-only: no external integrations, no persistent memory, and deterministic outputs for testing.

## Zone B contract

- **Hard separation from Zone A:** no shared runtime code or imports.
- **Authentication required:** `POST /v1/converse` requires `x-patient-id`.
- **Audit on every request:** emits an audit record through `auditSink.write`.
- **No self-learning:** no storage or memory persistence.
- **Tool allowlist:** only explicit allowlisted tools can be executed.

## Endpoints

### `GET /health`

Returns service status.

### `POST /v1/converse`

Requires headers:

- `x-patient-id` (required)
- `x-tenant-id` (optional; defaults to `unknown`)
- `x-request-id` (optional; generated if missing)

Request body:

```json
{
  "message": "hello",
  "toolRequest": {
    "name": "readPatientPlanSummary"
  }
}
```

Example response:

```json
{
  "requestId": "req-123",
  "reply": "Echo (Zone B): hello",
  "toolResult": {
    "name": "readPatientPlanSummary",
    "data": {
      "patientId": "patient-001",
      "summary": "Stubbed care plan summary.",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

## Local development

```bash
pnpm --filter patient-ai-service dev
```

## Tests

```bash
pnpm --filter patient-ai-service test
```
