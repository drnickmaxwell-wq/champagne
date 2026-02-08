# Stock ↔ Financial Engine Contract (Draft)

## Overview
This document defines the contract between the Stock System and the external Financial Engine hosted on Railway.

The Financial Engine is the source of cost, pricing, and supplier truth.
The Stock System remains the source of physical inventory state.

## Direction of Data Flow

### Stock → Financial Engine
- Product SKU
- Batch number (if applicable)
- Quantity received
- Timestamp
- Location ID
- Event reference ID

### Financial Engine → Stock
- Unit cost
- Supplier identity
- Invoice reference
- Price effective date
- Cost corrections (non-destructive)

## Identity Mapping
- Stock SKU ↔ Supplier SKU is many-to-many
- Mapping is explicit and versioned
- No automatic inference

## Batch & Invoice Linking
- Batch numbers may be linked to one or more invoices
- Invoice linkage is optional but recommended
- Historical corrections must not mutate stock history

## Cost Semantics
- Cost is advisory to stock system
- Stock system may compute valuations
- Financial engine owns authoritative cost reporting

## Failure Modes
- Stock must function without financial engine availability
- Missing cost data must not block stock operations

## Security & Scope
- No PHI exchanged
- No patient identifiers exchanged
- No treatment identifiers exchanged

## Future Extensions (Non-binding)
- Supplier optimisation
- Margin modelling
- Treatment cost attribution (via PMS, not stock)
