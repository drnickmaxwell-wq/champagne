# Champagne Import – Phase 1

In Phase 1 we imported the original Champagne extraction pack into this repository as a read‑only archive. The archive lives at `_champagne‑extraction/` and preserves the original file hierarchy from the uploaded pack.

## What we did

- Created a new branch `feat/champagne-extraction-archive` from the latest `main`.
- Added a new top‑level folder `_champagne‑extraction/` to hold the extraction archive.
- Imported the contents of the extraction pack into subfolders under `_champagne‑extraction/` (e.g. `tokens-and-theme`, `guards-and-scripts`) without changing any file names or hierarchy.
- Added a README in `_champagne‑extraction/` that explains the purpose of the archive and describes the subfolders.
- Committed all changes to the new branch only; the main branch remains unchanged.

## Extracted folders

The archive currently includes the following subfolders:

| Folder | Description |
| ------ | ----------- |
| `tokens-and-theme` | CSS tokens and theme definitions. |
| `guards-and-scripts` | Brand guards, rogue‑hex checks, hero freeze scripts, manifest synchronisation tasks, etc. |

Additional folders such as `manifests-and-seo`, `preview-treatments-canonical`, `heroes-and-fx`, `brand-canon-and-docs`, `reports-and-audits`, and `assets-core` will be imported in subsequent commits. For now we preserved the internal structure of the portions that have been imported.

## No runtime changes

Phase 1 intentionally avoids any changes that would affect builds, runtime behaviour or dependencies. We **did not modify** any files under the following locations:

- `apps/web/**`
- `apps/chat-ui/**`
- `apps/portal/**`
- `apps/engine/**`
- `packages/**`
- Root configuration files (`package.json`, `pnpm-lock.yaml`, `tsconfig.base.json`, `eslint.config.mjs`, `.gitignore`, `turbo.json`, `pnpm-workspace.yaml`, any `next.config.*`)

## Observations

- The extraction pack contains many nested directories and a mixture of CSS, TypeScript, JSON, and media assets.
- GitHub’s web interface restricts uploading directories, so files were uploaded in small groups per folder.

## Next Steps (Phase 2 – for future)

In Phase 2 we will create properly versioned packages under `packages/@champagne/*` to house the live implementations of tokens, guards, manifests and hero components. Selected code and assets from `_champagne‑extraction/` will be copied into those packages, and wiring into the `apps/web` and other applications will be done carefully. `_champagne‑extraction/` will remain as the original archive for reference.
