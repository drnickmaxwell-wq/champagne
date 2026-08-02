# Scoped Instructions — Champagne Guards

**Status:** `ACTIVE_SCOPED_CONSTRAINTS_NO_AUTHORITY`

Applies to `packages/champagne-guards/**`. It narrows the root instructions and
grants no authority.

- Guards are enforcement code, not obstacles to weaken when product work fails.
- Preserve fail-closed behaviour, deterministic output, stable reason codes,
  exact path coverage and CI visibility.
- Do not delete, skip, soften, invert, hide, mock or broadly exempt a guard to
  make a patch pass.
- Any exemption requires fresh exact Founder authority, named files, narrow
  rationale, deterministic tests, expiry/stop condition where temporary and
  proof that protected semantics remain intact.
- Prevent bypass through generated files, alternate extensions, encoding,
  symlinks, deletion or rename.
- Test valid behaviour and adversarial failure cases.
- Guard output must not expose secrets, PHI, patient data or environment values.
- Do not mutate product code, manifests or another repository from guard scope
  without separate exact authority.
- Run focused guard tests, the changed guard directly, `pnpm run guard:all` and
  the applicable consuming verification/build.
- A green build where the intended guard did not execute is failure.
