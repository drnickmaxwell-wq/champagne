# patient-ai-service (Zone B)

Governance-first scaffolding for the PHI-enabled Zone B service. This package is intentionally stub-only: no external integrations, no persistent memory, and deterministic outputs for testing.

## Zone B contract

- **Hard separation from Zone A:** no shared runtime code or imports.
- **Authentication required:** `POST /v1/converse` requires `x-patient-id`.
- **Audit on every request:** emits an audit record through `auditSink.write`.
- **No self-learning:** no storage or memory persistence.
- **Tool allowlist:** only explicit allowlisted tools can be executed.

## How PMS adapters work

PMS access is routed through a lightweight adapter contract in `src/pms/adapter.ts`. The resolver in `src/pms/index.ts` maps the default tenant (`default`) to the stub adapter and any unconfigured tenant to the null adapter, keeping responses deterministic without adding real integrations. All patient tools call the adapter so auditing can capture which adapter handled the request.

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
  "message": "hello"
}
```

Example response (tool-driven):

```json
{
  "requestId": "req-123",
  "reply": "Patient patient-001 summary: Next appointment: 2025-02-03T09:00:00.000Z (hygiene-check). Current plan summary: Routine follow-up plan with focus on preventive care and cleaning.",
  "toolResult": {
    "patientId": "patient-001",
    "nextAppointment": {
      "dateISO": "2025-02-03T09:00:00.000Z",
      "type": "hygiene-check"
    },
    "currentPlanSummary": "Routine follow-up plan with focus on preventive care and cleaning."
  }
}
```

## Adding the next tool (appointments list)

1. Add the new tool name and data shape in `src/tools/types.ts`.
2. Implement the stubbed PMS data in `src/pms/adapters/stub.ts` using deterministic logic.
3. Register the tool in `src/tools/index.ts` and export it from `runTool`.
4. Allowlist the tool in `src/server.ts` (or tests) and update `/v1/converse` to call it where needed.
5. Extend tests in `src/server.test.ts` to validate allowlist enforcement and audit metadata.

## Local development

```bash
pnpm --filter patient-ai-service dev
```

## Tests

```bash
pnpm --filter patient-ai-service test
```
