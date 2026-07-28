# Champagne Stage 1 Documentation Acceptance V1

## Stage

`0_CANONICAL_DOCUMENTATION`

## Required exact authority phrase

`CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`

## Stage purpose

Control acceptance of the Champagne programme direction without changing product
behaviour.

## Controlling acceptance wrapper

This document is the Main Directorate and Founder controlling acceptance
wrapper.

- The V2 document remains `FOUNDER_REVIEW_DRAFT_NON_MUTATING` source direction.
- Programme direction is accepted only through this wrapper.
- Acceptance is subject to `CHAMP-S1-A01` through `CHAMP-S1-A06`.
- The Master Truth Amendment is accepted and additive as a product-local overlay.
- Receipts are evidence only and do not override canon.

## Authority boundary

Exact Stage 0 authority may permit a documentation branch, documentation/canon
commits and a draft pull request only when explicitly granted.

This wrapper grants no:

- runtime authority;
- merge authority;
- deployment authority;
- Stage B authority;
- Router authority;
- WEOS authority;
- chatbot-engine authority.

No stage inherits authority from another stage.

## Acceptance criteria

- Preserve the V2 plan as draft source direction and preserve its history.
- Keep the accepted product-local amendment separate and additive.
- Declare precedence and conflict handling.
- Preserve the freeze SHA and use verified Git object identity for operational
  freeze comparison.
- Grant no Stage B authority.
- Change no product, Router, WEOS or chatbot-engine source.
- Direct every future agent to the programme index.
- Produce a receipt containing:
  - inputs;
  - sources;
  - decisions;
  - changed fields;
  - tests;
  - human approvals;
  - rollback.

## Failure

Stage 1 fails if:

- the V2 draft is presented as independently accepted controlling canon;
- the accepted amendment is presented as company-wide platform canon;
- documentation authority is treated as product authority;
- receipts are allowed to override canon;
- authority is inherited across stages;
- runtime or deployment changes are made.
