# DAY 1 — Critical Path Checklist (V1)

This document freezes Day-1 scope for `champagne-main` and prevents module creep.

## Canonical Operator Gate

- Required command before and after Day-1 packet execution:
  - `npm run guard:all`

## Day-1 Execution Order (Non-Negotiable)

1. Stability / Guards
2. Structural SEO spine
3. Pilot rewrites
4. Rollout
5. Schema
6. Lighthouse

## Scope Freeze (Blueprint-Only Modules)

Until pilot rewrites are shipped and verified:

- 3D work is blueprint-only.
- Media expansion is blueprint-only.
- Design expansion is blueprint-only.

No runtime implementation for the above is allowed in Day-1 packets.

## PR Discipline & Proof

- One PR per packet.
- Proof is required in each PR.
- Minimum required proof command:
  - `npm run guard:all`
