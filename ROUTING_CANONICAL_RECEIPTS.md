# Routing Canonical Receipts

## Canonical routes
- `/` – root layout and marketing shell.
- `/treatments` – hub page rendering manifest-driven treatment index.
- `/treatments/[slug]` – manifest-resolved treatment leaves powered by `@champagne/manifests`.

## Legacy stubs
- Former `(champagne)/treatments/*` route stubs have been moved out of Next.js routing to `apps/web/_legacy_route_stubs/treatments/`.
- Stub slug inventory recorded at `apps/web/_legacy_route_stubs/treatments-stub-slugs.json` (28 slugs preserved).

## Preview routes
- `apps/web/app/preview/*` removed; no `/preview` routes remain registered in the app directory.

## Integrity notes
- Treatments hub continues to source its list from manifest data (no stub routes involved).
- Treatment leaves resolve manifests via `@champagne/manifests`.

## Checks
- `pnpm -C apps/web lint`
- `pnpm -C apps/web typecheck`
- `pnpm -C apps/web build`
