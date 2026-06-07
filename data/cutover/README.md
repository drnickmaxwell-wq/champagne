# data/cutover

**Status: BUILD-READINESS ONLY. NOT LAUNCH READY.**

This directory holds cutover data files for the WordPress-to-Next.js migration of
`smhdental.co.uk`. It contains example files only — no production data.

---

## Files

| File | Purpose |
|------|---------|
| `wordpress-url-inventory.example.csv` | Example URL inventory — EXAMPLE_ONLY, not real data |
| `redirect-map.example.csv` | Example redirect map — EXAMPLE_ONLY, not real data |

---

## How to use these files

1. Copy the example files and remove `EXAMPLE_ONLY` from the name:
   ```
   wordpress-url-inventory.csv
   redirect-map.csv
   ```
2. Fill in the copies with real data from a WordPress audit.
3. Run the validators:
   ```
   pnpm run cutover:validate
   ```
4. Run the tests:
   ```
   pnpm run cutover:test
   ```

The validators fail closed — they will exit with an error if the data is missing,
empty, or structurally invalid.

---

## What does NOT belong in this directory

- Production WordPress credentials.
- Live patient data or PHI of any kind.
- DNS configuration.
- Completed redirect map ready to deploy (that goes in `next.config.mjs` via a PR).

---

> The example files are clearly marked `EXAMPLE_ONLY` and must never be used as
> production data. Replace them with real audit data before running validators.
