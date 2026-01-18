# Hero V2 Runtime Truth Report (HOME)

Status: **UNKNOWN — EVIDENCE NOT PRESENT**

The HOME route `/` appears to be using Hero V1 (data-hero-engine="v1" observed in console output). The V2 client logger was not mounted, so no V2 truth logs were emitted. This report captures the attempted runtime logging and the empty JSON payloads for V2-prefixed console logs across the required navigation loop (`/` → `/contact` → `/`).

## Logging location

- `apps/web/app/components/hero/v2/HeroV2Client.tsx` (lines 145–268) — `HERO_V2_TRUTH_SURFACES`, `HERO_V2_TRUTH_CONTENT`, `HERO_V2_TRUTH_BG` loggers added in the HeroSurfaceStackV2 component.

## Raw captured JSON blocks

> The Playwright capture produced **no** V2-prefixed console logs. Raw log payload array is included verbatim below.

```json
[]
```

## Commands used

- Dev server:
  - `pnpm --filter web dev --hostname 0.0.0.0 --port 3000`
- Log capture (Playwright):
  - `python /tmp/codex_browser_invocations/.../script.py`
    - Navigates to `/` → `/contact` → `/` with 1500ms+ settle waits.
    - Captures console logs that start with `HERO_V2_TRUTH_`.

## Rollback instructions

```bash
git checkout -- apps/web/app/components/hero/v2/HeroV2Client.tsx
rm reports/hero/hero-v2-truth-report.md
```
