# Champagne Tenant Blueprint Extraction Plan V1

Status: `DESIGN_ONLY`  
Purpose: define what may become reusable tenant architecture and what must remain SMH/Champagne-specific.

## Extraction posture

Champagne can inform a reusable Website OS tenant blueprint, but extraction must not dilute the Champagne Canon or copy SMH-specific clinical, brand, or operational truth into generic tenants.

## Reusable tenant architecture candidates

| Candidate | Reusable boundary | Exclusion |
| --- | --- | --- |
| Import/export envelope | Contract version, source hashes, guard state, data class declarations | Champagne-specific report names become examples only. |
| Safe patch packet schema | Operation taxonomy, validation gates, rollback structure | No Champagne sacred file paths in generic schema except as tenant-supplied locks. |
| Evidence-review workflow | Founder/clinical/brand/SEO/launch-proof roles | Reviewer names, SMH policies, and claims remain tenant-local. |
| Editable zone registry | Zone IDs, field paths, allowed operations, source hashes | Champagne section IDs and route families remain tenant data. |
| Sacred-zone mechanism | Tenant declares locked paths/manifests/components | Champagne hero engine is not reusable default code. |
| Token boundary rules | Token-only styling and semantic surface mapping | Champagne token names are an adapter, not universal primitives. |
| Guard visibility model | Required guard command registry and CI receipts | Actual guard scripts remain repo-specific unless extracted deliberately. |
| Rollback contract | Prior hash/value, affected routes, guard commands | Tenant-specific rollback owners and files remain tenant data. |

## Must remain SMH/Champagne-specific

- Champagne Canon, brand chroma, Persian Midnight/porcelain/glass semantics, and emotional material language.
- Sacred Hero Engine implementation, sacred manifests, hero renderer, hero diagnostics, and hero variant identities.
- SMH treatment content, clinical copy, fees, FAQs, patient stories, local geography, CTAs, and Dentally/portal semantics.
- Campaign 007 artifacts and PR #850 audit findings as Champagne evidence, not generic proof.
- Any founder-approved tone, launch gaps, weak-copy registers, and review outcomes.
- Any practice/provider IDs, booking destinations, operational workflows, or clinical governance decisions.

## Extraction boundaries

### Layer 1: Generic contract kernel

Extract later into a tenant-neutral package only after design approval:

- JSON schema for import/export envelopes.
- JSON schema for patch packets.
- Review-state machine.
- Editable-zone registry interface.
- Fail-closed validator interface.

### Layer 2: Tenant adapter

Champagne-specific adapter should provide:

- sacred-zone list;
- guard command list;
- token map;
- section capability map;
- route/page inventory imports;
- evidence-review role mapping.

### Layer 3: Runtime implementation

Runtime implementation remains outside this design packet. Later Codex work must be scoped to docs/contracts first, then validators, then UI preview surfaces. No runtime app edits are authorized by this plan.

## Exact implementation slices for later Codex work

1. **Schema slice**: add JSON schemas for Website OS import/export envelopes and patch packets under a docs/contracts or ops/contracts schema path.
2. **Validator slice**: implement a CLI validator that reads a packet and fails closed on missing hashes, forbidden files, raw styles, or missing review gates.
3. **Editable-zone registry slice**: produce a read-only registry generator from existing page/section truth exports.
4. **Review workflow slice**: add review-state fixtures and validation examples for founder, clinical, brand, SEO, and launch-proof review.
5. **Live Canvas preview receipt slice**: define and validate preview receipt artifacts without touching runtime preview UI.
6. **Tenant adapter slice**: design a Champagne adapter file containing sacred zones, guard commands, token boundaries, and data-class exclusions.
7. **CI visibility slice**: add non-runtime contract validation as a named CI step only after schemas and fixtures exist.
8. **Documentation slice**: document how Website OS/Live Canvas packets move from proposal to Codex implementation.

## Non-goals

- No deployment automation.
- No provider calls.
- No PMS mutation.
- No runtime UI implementation.
- No hero refactor.
- No launch-readiness certification.
