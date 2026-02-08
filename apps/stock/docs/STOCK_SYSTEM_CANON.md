# Stock System Canon v1.0

## Purpose
The stock system is the single source of truth for physical inventory state.
It is not a financial system, a clinical record, or a supplier platform.

## Core Principles
- Stock truth ≠ financial truth ≠ clinical intent
- Humans define meaning once; systems enforce it consistently
- No automation without explainability
- No irreversible actions by AI
- Batch and expiry are first-class concepts where applicable

## Identity Model
- Barcodes identify SKUs, not semantics
- A barcode may exist without prior meaning
- Unknown barcodes must be explicitly registered by staff
- Product identity is stable once defined

## Product Classes
- Simple consumables (no batch / expiry)
- Controlled items (batch + expiry required)
- Implant-related items (controlled + traceable)

## Stock Events
- RECEIVE
- WITHDRAW
- ADJUST / COUNT

Each event:
- Is location-scoped
- Is time-stamped
- Is attributable to a session
- Does not imply financial accounting

## Batch & Expiry Rules
- Products may be flagged as batch-tracked
- Batch-tracked items require:
  - batch number
  - expiry date
- Withdrawal defaults to FEFO (first-expiry-first-out)
- Expired stock must not be withdrawn without explicit override

## Session Model
- Stock actions occur in sessions
- Sessions provide:
  - operator clarity
  - local summaries
  - future audit hooks
- Sessions are not permanent records

## Location Model
- Stock is always associated with a location
- Locations may be physical or logical
- Usage patterns are derived, not assumed

## AI Boundary
- AI may suggest
- AI may explain
- AI may not execute irreversible actions
- AI output must always be inspectable

## Explicit Non-Goals (v1)
- No pricing logic
- No supplier optimisation
- No PMS writes
- No PHI storage

## Extension Rule
Any future capability must layer on top of this canon without violating:
- identity rules
- batch discipline
- separation of concerns
