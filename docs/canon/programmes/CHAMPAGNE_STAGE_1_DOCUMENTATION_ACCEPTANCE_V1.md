# Champagne Stage 1 Documentation Acceptance V1

## Stage

`0_CANONICAL_DOCUMENTATION`

## Required exact authority phrase

`CHAMPAGNE_CANONICAL_TRANSFORMATION_PLAN_DOCUMENTATION_V1`

## Stage purpose

Install or propose the programme canon without changing product behaviour.

## Acceptance criteria

- Preserve the supplied V2 machine plan.
- Keep the amendment separate and additive.
- Declare precedence and conflict handling.
- Preserve supplied freeze SHAs.
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

- the supplied V2 plan is rewritten in place;
- the amendment is presented as already approved;
- documentation authority is treated as product authority;
- freeze evidence is altered without founder resolution;
- runtime or deployment changes are made.
