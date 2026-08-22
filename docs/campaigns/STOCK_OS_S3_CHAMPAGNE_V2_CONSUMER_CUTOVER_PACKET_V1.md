# STOCK_OS_S3_CHAMPAGNE_V2_CONSUMER_CUTOVER_PACKET_V1

Status: prepared; no merge or deployment performed.

## Exact heads

- Champagne base target: `origin/main` as reconstructed locally at `a00f718a` (the Director-observed `f0280b683fa9721287fdc5cdcdb227b40af4f095` was not present in this clone).
- Champagne working head: `3e3821634c0a548b7d083262f4ca677151a64ea4` before this tranche.
- Stock candidate compatibility target: `1590b616baba38aa60f4e966020984ed0463b73b` (PR #50).

## Contract and configuration

The producer implements `docs/canon/stock/TENANT_HEADER_AND_SIGNATURE_SPEC_V2.json` from the Stock candidate. It uses exact raw body bytes and exact transmitted origin-form path+query in the V2 canonical string, strict padded Base64 secret/signature encoding, and `x-internal-signature-version: v2`.

Required producer configuration names:

- `STOCK_SERVICE_URL`
- `STOCK_SERVICE_KEY_ID`
- `STOCK_SERVICE_INTERNAL_KEYS`
- `STOCK_SERVICE_SUBJECT`

The key ID must match an own property in the JSON key map. No secret values belong in this packet. `INTERNAL_HMAC_SECRET` is not read.

Current dedicated Stock producers are `/api/stock/events`, `/api/stock/events/read`, and `/api/stock/qr/decode`; unrelated `ops-api` endpoints remain unchanged. Browser `x-tenant-id` remains the current transport boundary only; S4 must later supply verified tenant/actor context.

## Coordinated cutover

Deploy/configure the Stock V2 verifier and Champagne V2 producer in a controlled sequence with a matching key ID. Champagne V1 → Stock V2 fails because V1 lacks the version header and signs a different canonical form. Champagne V2 → old Stock V1 fails because old Stock does not accept V2. Therefore activation requires coordinated deployment; rollback is required on signature-version rejection, authentication spikes, body/target mismatch, or any non-PHI contract failure. Rollback must keep producer and verifier versions paired.

Non-PHI staging matrix: signed empty GET; signed POST with whitespace-preserved JSON; repeated query parameters; reordered query parameters; percent-encoded query; long query; wrong secret; wrong key ID; body mutation; query mutation; malformed target; and missing/legacy version header. Verify both forwarded target and body bytes at the Stock candidate.

## Boundary

NO MERGE. NO DEPLOYMENT. NO Railway mutation. NO hosting mutation. NO production secret mutation. NO Stock-service mutation. No production activation is implied by this packet.
