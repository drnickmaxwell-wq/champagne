# Champagne Canon Programme Index V1

## Purpose

This is the single read-first entry point for the Champagne golden-tenant programme.

It prevents drift by declaring:

- which documents are canonical;
- the order in which they must be read;
- which source has precedence;
- what authority is currently absent;
- when an agent must stop.

## Required read order

1. `ops/contracts/CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2.json`
2. `docs/canon/programmes/CHAMPAGNE_WEBSITE_CHATBOT_WEOS_CANONICAL_MASTER_PLAN_V2.md`
3. `ops/contracts/CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1.json`
4. `docs/canon/programmes/CHAMPAGNE_MASTER_TRUTH_AMENDMENT_V1.md`
5. `ops/contracts/CHAMPAGNE_AUTHORITY_AND_FREEZE_CONTRACT_V1.json`
6. `ops/contracts/CHAMPAGNE_STAGE_1_DOCUMENTATION_ACCEPTANCE_V1.json`

## Precedence

1. Exact founder authority for the current stage
2. Supplied V2 machine plan
3. Additive Master Truth Amendment
4. Stage-specific receipts and acceptance evidence

## Conflict rule

When two sources conflict:

- stop;
- preserve both sources;
- identify the exact conflict;
- request founder resolution;
- do not silently reconcile;
- do not choose the easier implementation.

## No authority inheritance

Authority granted for one stage does not apply to another stage.

Documentation authority does not permit:

- product code changes;
- Router changes;
- WEOS changes;
- chatbot-engine changes;
- branch creation;
- commits;
- pull requests;
- merges;
- deployments;
- publication.
