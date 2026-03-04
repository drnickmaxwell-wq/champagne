# HUMAN REPORT — Canon Guard Patient-Portal SSR Probe Stabilization

## Mission
Stabilize the patient-portal SSR smoke probe used by `guard:canon`/`guard:all` in CI/container contexts without weakening the guard.

## Files changed
- `packages/champagne-guards/scripts/guard-patient-portal-ssr.mjs`
- `HUMAN_REPORT.md`
- `TRUTH_REPORT.json`

## What changed (smallest-diff guard hardening)
- Added deterministic readiness sequencing before the probe:
  - first waits for local `GET /api/health`
  - if needed, falls back to waiting on `GET /patient-portal?intent=login`
- Added bounded timeout constants and explicit step tracking:
  - request timeout (`REQUEST_TIMEOUT_MS`)
  - readiness timeout (`SERVER_READY_TIMEOUT_MS`)
  - warmup timeout (`WARMUP_TIMEOUT_MS`)
- Kept the patient-portal probe mandatory and active (not skipped).
- Added single-retry behavior for aborts (existing behavior retained and parameterized).
- Added an explicit warmup request to compile/prime patient-portal SSR before the final smoke assertion.
- Expanded failure diagnostics to print:
  - command invoked
  - probed URL
  - step where failure occurred
  - timeout values used
  - whether server boot was detected
  - last error string

## Why this stabilizes the probe
The previous probe often hit an abort on the first patient-portal render while Next dev server route compilation was still settling. The new readiness + warmup flow preserves strict SSR verification while reducing nondeterministic startup races.

## Proof results
- `pnpm run guard:canon` ✅ pass
- `pnpm run guard:all` ✅ pass
- `pnpm run build:web` ✅ pass

## Constraint compliance
- Probe was **not removed**.
- Probe is **not skipped by default**.
- No bypass flags or weakening logic introduced.
- Changes are localized to guard probe reliability and diagnostics.
