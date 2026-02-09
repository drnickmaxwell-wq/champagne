# Stock ↔ Financial Engine Contract (Foundation Only)

## A. Purpose
This document defines the canonical, read-only contract between the Stock app and a future Financial Engine. It specifies the data that Stock could send and receive without introducing any runtime integration, pricing logic, or financial storage inside Stock.

This contract is informational and forward-looking only. Stock must continue to operate offline-first and independently of any Financial Engine availability or connectivity.

## B. Data entities (definitions, not implementation)
- **ProductRef**
  - `id` (string)
  - `name` (string)
  - `unitType` (string; e.g., `unit`, `box`, `case`)
  - `category` (string)
- **SupplierRef**
  - `id` (string)
  - `name` (string)
- **PackRef**
  - `packSize` (number; units per pack)
  - `packLabel` (string; e.g., `box`, `case`)
- **LocationRef**
  - `id` (string)
  - `name` (string)
- **DraftLineRef**
  - `productId` (string)
  - `qtyUnits` (number)
  - `supplier` (optional `SupplierRef`)
  - `pack` (optional `PackRef`)
- **EventRef**
  - `type` (`RECEIVE` | `WITHDRAW` | `ADJUST` | `BASELINE_COUNT`)
  - `qtyDeltaUnits` (number; positive or negative)
  - `timestamp` (ISO-8601 string)
  - `locationId` (string)

## C. Outbound messages (Stock → Financial Engine)

### 1) `stock.event.v1`
Stock emits stock movement events, scoped to a tenant and location.

```json
{
  "type": "stock.event.v1",
  "version": "1.0.0",
  "tenantKey": "tenant_123",
  "payload": {
    "event": {
      "type": "WITHDRAW",
      "qtyDeltaUnits": -4,
      "timestamp": "2024-04-12T09:14:22Z",
      "locationId": "loc_main_cupboard"
    },
    "product": {
      "id": "prod_cotton_rolls",
      "name": "Cotton Rolls",
      "unitType": "unit",
      "category": "consumables"
    }
  }
}
```

### 2) `stock.orderDraft.v1`
Stock shares a draft order (non-finalized) for enrichment or advisory use. Stock remains the source of truth and does not require any response to function.

```json
{
  "type": "stock.orderDraft.v1",
  "version": "1.0.0",
  "tenantKey": "tenant_123",
  "payload": {
    "draftId": "draft_2024_04_12_001",
    "createdAt": "2024-04-12T10:00:00Z",
    "lines": [
      {
        "productId": "prod_gloves_large",
        "qtyUnits": 120,
        "supplier": {
          "id": "sup_main",
          "name": "Primary Supplier"
        },
        "pack": {
          "packSize": 10,
          "packLabel": "box"
        }
      }
    ]
  }
}
```

### 3) `stock.baselineSnapshot.v1` (optional, counts only)
Baseline snapshot is optional and strictly counts-only. It must not contain pricing, costs, or any patient data.

```json
{
  "type": "stock.baselineSnapshot.v1",
  "version": "1.0.0",
  "tenantKey": "tenant_123",
  "payload": {
    "snapshotId": "baseline_2024_04_01",
    "capturedAt": "2024-04-01T08:30:00Z",
    "location": {
      "id": "loc_surgery_1",
      "name": "Surgery 1"
    },
    "counts": [
      {
        "productId": "prod_composite_caps",
        "qtyUnits": 24
      }
    ]
  }
}
```

## D. Inbound messages (Financial Engine → Stock)

### 1) `financial.enrichment.v1` (strictly optional metadata)
Financial Engine may send enrichment metadata. Stock must not require this data to function or render its UI.

```json
{
  "type": "financial.enrichment.v1",
  "version": "1.0.0",
  "tenantKey": "tenant_123",
  "payload": {
    "productId": "prod_gloves_large",
    "metadata": {
      "supplierRef": {
        "id": "sup_main",
        "name": "Primary Supplier"
      },
      "pack": {
        "packSize": 10,
        "packLabel": "box"
      }
    }
  }
}
```

### 2) `financial.alerts.v1` (non-blocking)
Alerts may be shown to staff but must never block Stock workflows.

```json
{
  "type": "financial.alerts.v1",
  "version": "1.0.0",
  "tenantKey": "tenant_123",
  "payload": {
    "alerts": [
      {
        "id": "alert_budget_threshold_01",
        "severity": "info",
        "message": "Budget threshold exceeded for Q2 (advisory only).",
        "createdAt": "2024-04-12T11:10:00Z"
      }
    ]
  }
}
```

## E. Versioning rules
- Contract versions use **semver**: `MAJOR.MINOR.PATCH`.
- **Backward compatibility**: Financial Engine must accept older versions of outbound messages for at least one MAJOR version, and should be tolerant of unknown fields.
- **Offline-first requirement**: Stock must function fully when the Financial Engine is offline or unavailable; inbound messages are optional and non-blocking.

## F. Forbidden fields (hard bans)
The following fields must never exist in Stock storage or Stock-originated payloads:
- `unitPrice`
- `costPrice`
- `margin`
- `supplierPrice`
- `totalCost`
- `budgetRemaining`
- invoice numbers
- any patient-linked data (PHI)

## G. Security + tenancy notes
- All messages must include a **tenancy key** (e.g., `tenantKey`) to support future SaaS separation.
- No patient identifiers or PHI are permitted.
- Transport/authentication is out of scope; a future Railway-hosted Financial Engine owns those concerns.

## References
- Stock system canon: `apps/stock/docs/STOCK_SYSTEM_CANON.md`
- Stock app overview: `apps/stock/README.md`
- This contract: `apps/stock/docs/STOCK_FINANCIAL_ENGINE_CONTRACT.md`
