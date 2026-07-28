# Scoped AGENTS.md — Champagne guards

This file narrows the root Champagne `AGENTS.md` for `packages/champagne-guards/**`.

## Guard law

- Guards are enforcement code, not obstacles to be weakened when product work fails.
- Preserve fail-closed behaviour, deterministic output, stable reason codes, exact path coverage, and CI visibility.
- Do not delete, skip, soften, invert, hide, mock, or broadly exempt a guard to make a patch pass.
- A new exemption requires exact Founder/stage authority, named files, narrow rationale, deterministic tests, expiry/stop condition where temporary, and proof that protected semantics remain intact.
- Do not allow documentation, generated files, alternate extensions, path encoding, symlinks, deletions, or renamed files to bypass coverage.
- Guard changes must test both valid behaviour and adversarial failure cases.
- Preserve Hero, canon, token, semantic-surface, workspace, contract, SEO/launch, no-PHI, and integration boundaries relevant to the changed guard.
- Guard output must not expose secrets, PHI, raw patient data, environment values, or sensitive file content.
- Do not mutate product code, manifests, Router, chatbot engine, or another repository from guard scope unless separately authorised.
- No merge, deploy, publication, production, or credential authority.

Run focused guard tests, the changed guard directly, `pnpm run guard:all`, and the relevant consuming verification/build. A green build where the intended guard did not execute is failure.
