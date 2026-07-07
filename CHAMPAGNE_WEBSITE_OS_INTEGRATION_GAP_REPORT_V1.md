# Champagne Website OS Integration Gap Report V1

## Readiness

PARTIAL. Champagne has manifests, contracts, guards, and a working build, but is not yet a safe Website OS production target.

## Missing contracts

- Tenant lifecycle contract.
- Manifest import/export version contract across Website OS.
- Runtime adapter for page, section, SEO, hero, media, and CTA mutations.
- Validation handoff between Website OS and Champagne guards.
- Evidence review contract tied to generated proof packets.

## Existing signals

- ops/contracts contains Website-truth and page-surface contracts.
- scripts export page/website truth.
- guards cover hero, canon, route truth, CTA, layouts, SEO safety.
