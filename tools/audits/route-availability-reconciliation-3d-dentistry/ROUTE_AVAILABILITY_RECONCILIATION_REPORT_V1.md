# Route Availability Reconciliation Report V1

Generated: 2026-06-02T13:17:26.544Z

## Status

PASS

## Canonical Decision

A_REAL_CANONICAL_ROUTE

Canonical route: `/treatments/3d-dentistry-and-technology`.

Related route retained: `/treatments/3d-digital-dentistry`.

Redirect required: no.

## Rationale

- The machine manifest already contains /treatments/3d-dentistry-and-technology as a page with a treatment path and 3D dentistry label.
- SEO local identity, AI answer registry, treatment fact registry, and answer rendering QA reference /treatments/3d-dentistry-and-technology for the distinct 3d-dentistry service.
- The related /treatments/3d-digital-dentistry route is separately referenced for same-day crowns/veneers, so redirecting the 3D dentistry route to it would collapse two service mappings.

## Bounded Change

- Updated `packages/champagne-manifests/src/helpers.ts` so App Router treatment resolution accepts manifest entries with paths under `/treatments/` even when the manifest category is not literally `treatment`.
- No redesign, copy rewrite, schema engine change, SEO approval flag change, deployment, PHI/PMS/Dentally change, or booking workflow change was performed.

## Route QA

| Route | Manifested | Resolver eligible | Priority service | Answer packet | Treatment fact | Runtime HTTP |
| --- | --- | --- | --- | --- | --- | ---: |
| /treatments/3d-dentistry-and-technology | yes | yes | 3d-dentistry | smh-answer-priority-3d-dentistry-packet-v1 | smh-treatment-fact-3d-dentistry-v1 | 200 |
| /treatments/3d-digital-dentistry | yes | yes | same-day-crowns-veneers | smh-answer-priority-same-day-crowns-veneers-packet-v1 | smh-treatment-fact-same-day-crowns-veneers-v1 | 200 |

## Reference Audit Summary

- `/treatments/3d-dentistry-and-technology` references in runtime/source scope: 16.
- `/treatments/3d-digital-dentistry` references in runtime/source scope: 33.

## Recommendation

LIGHTHOUSE_EVIDENCE_CAN_BE_RERUN
