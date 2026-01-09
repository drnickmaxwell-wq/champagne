# sacred hero matcher (manual only)

This matcher is intentionally **manual only**. It is not wired into `verify`, `guard:hero`, `guard:canon`, or CI workflows.

## Usage

1. Ensure the reference image exists at `reference/sacred-hero.png`.
   - Optional legacy location: `/mnt/data/sacred-hero.png` (auto-copied).
2. Start the web app (or let the script start it):

```bash
pnpm --filter web dev --hostname 0.0.0.0 --port 3000
```

3. Run the matcher:

```bash
pnpm hero:match:sacred
```

Results are written to `reports/hero-match/` as `best.png` and `results.json`.
