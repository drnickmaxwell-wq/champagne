# Hero Freeze Guard — How to Update Baseline

1. Make your intentional asset change (e.g., replace WEBM).
2. Run `pnpm run guard:hero`  
   - It should FAIL and list changed files (expected).
3. If the change is correct, update baseline:  
   `pnpm run guard:hero:baseline`
4. Commit the updated `scripts/hero-freeze.hashes.json` and open a PR.
5. CI must pass. Merge.
