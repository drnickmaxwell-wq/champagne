# Guards Baseline Update

## Allowlisted Paths
The rogue HEX guard now understands glob patterns and extension-based allowances. Files currently matched by the allowlist include:

- `app/api/integrations/email/route.ts`
- `app/globals/hero-polish.css`
- `app/treatments/composite-bonding/composite-bonding.module.css`
- `app/treatments/technology/components/technology-hero.css`
- `app/treatments/technology/technology.module.css`
- `components/effects/luxury-text-effects.tsx`
- `components/navigation/breadcrumbs.module.css`
- `styles/ai/chat-preview.css`
- `styles/champagne/hero.css`
- `styles/preview/champagne/footer.css`
- `styles/preview/champagne/layers.css`
- `styles/preview/champagne/page.css`
- `docs/**` (documentation updates never block)
- `styles/champagne/manifest.json`
- `public/brand/manifest.json`
- `public/assets/champagne/manifest.json`

## Extension Rules
- `.md` files are skipped entirely with an `ALLOW extension` log so copy edits never fail the guard.
- `.json` files emit `WARN` messages when they are allowlisted manifests; other JSON diffs still fail if rogue HEX remains.

## Guard Behaviour Summary
- The guard diff-only scan now anchors against the PR base merge commit, mirroring GitHub’s comparison view.
- Allowlisted paths log explicit `WARN` messages when HEX is still present, keeping visibility without blocking merges.
- Non-allowlisted files continue to fail fast whenever rogue HEX is introduced.

## Next Steps
- Continue retokenising the allowlisted UI surfaces and remove their globs once clean.
- Convert the champagne manifests to token references so they can graduate from the warn-only bucket.
- Audit remaining docs for token usage consistency even though they are skipped by the guard.
