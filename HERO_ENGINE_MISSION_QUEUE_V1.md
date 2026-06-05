# HERO_ENGINE_MISSION_QUEUE_V1

## Mission queue rules

This queue is audit-derived. It does not authorize hero redesign, hero replacement, or sacred file edits. Each mission must respect the Champagne Canon, sacred zones, and guard requirements.

## Mission 1 — Re-run mandatory guards

Role: Guard Operator.

Scope: no code changes.

Commands:

```bash
npm run guard:hero
npm run guard:canon
npm run verify
```

Expected output:

- pass/fail record for each command
- if a guard is missing, stop and report exactly: `Guard missing or not wired — cannot proceed.`

Why first: repository rules require these commands to exist and pass. Root `package.json` wires all three, but this audit did not treat existence as pass proof.

## Mission 2 — Fresh V2 runtime capture

Role: Hero Diagnostics.

Scope: read-only diagnostics.

Command:

```bash
NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web dev --hostname 0.0.0.0 --port 3000
```

Routes:

- `/`
- `/about`
- `/blog`
- `/contact`
- `/treatments`
- `/treatments/teeth-whitening`
- `/treatments/implants-single-tooth`
- `/treatments/3d-digital-dentistry`

Query string:

```text
?heroDebug=1&heroTruth=1&bloomDebug=1
```

Capture:

- `data-hero-engine`
- `data-hero-flag-normalized`
- route pathname in model
- bound hero ID and variant ID
- effective hero ID and variant ID
- surface IDs
- motion IDs
- computed opacity/blend/z-index
- background source logs
- motion event logs

Stop condition: if any route shows V1 while V2 is expected, stop and report engine flag truth.

## Mission 3 — Variant source ledger

Role: Manifest Validation.

Scope: read-only script/report only unless separately authorized.

Output required:

- loaded variant order
- duplicate variant IDs
- source file for each variant ID
- all route `heroBinding.variantId` values
- whether each binding resolves
- selected source file per bound route

Known issue to verify: `sacred_hero_variants.json` loads before standalone `hero.variant.*_v1.json`, so same-ID standalone family files can be shadowed.

## Mission 4 — Regenerate routing contract

Role: Runtime Inspection.

Scope: read-only report generation.

Command candidate:

```bash
node scripts/hero/hero_routing_contract_v1.mjs
```

Acceptance criteria:

- generated report reflects current manifest binding coverage
- report does not claim 5 bindings if direct manifest query still finds 101 binding objects
- route table includes bound and effective variant IDs

Stop condition: if script output remains stale, report generator is not reliable; do not use it for rollout.

## Mission 5 — Flash proof packet

Role: Hero Diagnostics.

Scope: no hero modifications.

Produce:

- first-paint screenshot or trace for representative routes
- steady-state screenshot or trace after motion reveal
- console payload archive
- PRM on/off comparison
- body/main/below-hero background capture

Acceptance criteria:

- no layer assumed missing without opacity/blend/z-index evidence
- no asset assumed missing without file/path evidence
- no V2 conclusion made from V1 runtime

## Mission 6 — Guard coverage gap report

Role: Guard Auditor.

Scope: read-only unless separately authorized for guard changes.

Document whether current guards check:

- V2 renderer existence
- `HeroMount` engine switch
- duplicate variant IDs
- every route binding resolves to a loaded variant
- stale route report detection
- standalone family manifest shadowing
- sacred manifest lock coverage beyond base/surfaces/variants

Known current truth:

- `guard-hero.mjs` checks bridge renderer and basic manifest shape.
- `guard-sacred-hero-lock.mjs` checks hashes for three sacred manifest files and the home binding.

## Mission 7 — Rollout decision memo

Role: Integration Lead.

Scope: report only.

Inputs:

- guard results
- V2 runtime capture
- variant source ledger
- regenerated routing contract
- flash proof packet
- guard coverage gap report

Decision options:

1. Continue V1 only.
2. Enable V2 only on diagnostics/lab routes.
3. Enable V2 for home only.
4. Enable V2 for category/family rollout after duplicate/shadowing proof.
5. Stop for Sacred Hero Surgeon authority if sacred runtime/manifest edits are required.

## Explicit non-missions

Do not perform these without fresh authorization:

- edit sacred hero engine files
- edit sacred hero manifests
- edit `apps/web/app/components/hero/HeroRenderer.tsx`
- replace V1 with V2 globally
- change layout routing behavior
- hard-code visual fixes
- bypass guards
