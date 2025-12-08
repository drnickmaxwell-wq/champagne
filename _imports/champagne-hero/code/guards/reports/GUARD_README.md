# Brand Guard Reports

The Brand Guard preflight generates machine-readable and human-friendly reports inside this directory.

## Running locally

1. Install dependencies with `pnpm install` if you have not already.
2. Run the preflight: `pnpm run guard:preflight`.
3. Review the generated `reports/GUARD_PRECHECK.json` and `reports/GUARD_PRECHECK.md` outputs for details.

The script exits with a non-zero code when any guard or typecheck fails. Build warnings are captured in the reports but do not stop execution.
