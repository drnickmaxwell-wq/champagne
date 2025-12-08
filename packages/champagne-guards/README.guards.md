# Champagne guard runners

The guard package ships a few internal checks that mirror the bespoke guard scripts used in CI and local development.

## Available commands
- `npm run guard:rogue-hex -w @champagne/guards` — scans for non-token HEX colors outside the allowlist and fails when new rogue values appear.
- `npm run guard:hero-freeze -w @champagne/guards` — hashes hero media and compares against the `hero-freeze.hashes.json` baseline to prevent accidental asset drift.
- `npm run guard:manifest -w @champagne/guards` — validates that champagne/public manifests only point at files that exist; skips when manifests are absent.
- `npm run guard:brand-structure -w @champagne/guards` — enforces expected class usage and grid structure in the hero and Smile Journey components.
- `npm run guard:all -w @champagne/guards` — runs the four guards above sequentially and stops on the first failure.

## Exit codes
Guards exit with `0` on success and a non-zero code when the check fails. The manifest guard exits `0` early when it detects missing manifest files so it does not block unrelated changes.
