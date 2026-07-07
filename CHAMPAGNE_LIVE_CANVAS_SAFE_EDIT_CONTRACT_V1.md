# Champagne Live Canvas Safe-Edit Contract V1

Status: `DESIGN_ONLY_FAIL_CLOSED`  
Purpose: define how Live Canvas may propose safe edits for Champagne without mutating runtime code directly.

## Principle

Live Canvas is a preview and proposal interface. It may collect human edits inside declared editable zones, render non-production previews, and emit Website OS patch packets. It must not directly commit runtime code, deploy, call providers, or edit sacred zones.

## Editable zones

Live Canvas editable zones must be explicit, typed, and source-hashed.

Allowed zone classes:

- `page.metadataDraft`: title, description, canonical, OpenGraph/Twitter fields.
- `page.jsonLdDraft`: structured data payloads backed by evidence.
- `content.copyField`: approved page/section copy fields.
- `content.ctaLabel`: CTA labels from approved manifests, without changing destination semantics unless separately authorized.
- `content.ctaDestinationDraft`: proposed destination changes requiring journey review.
- `section.visibilityDraft`: proposed enable/disable of approved non-sacred sections.
- `section.orderDraft`: proposed reorder of approved non-sacred sections.
- `design.tokenBindingDraft`: replacement among existing semantic tokens only.

Every editable zone must carry:

- stable `zoneId`
- route or source file identity
- JSON pointer or field path
- current source hash
- allowed operation list
- required reviewer roles
- rollback field/value

## Sacred zones

Live Canvas must mark these as locked and non-editable:

- Sacred hero engine core.
- Sacred hero manifests.
- Sacred render entry.
- Guards and CI unless the packet is explicitly guard/CI scoped.
- Token source files unless the packet explicitly has token-authorized scope.
- Provider/PMS/booking integration code.
- Runtime layout/global styling files unless fresh Director scope exists.

A locked zone may be displayed for context only if it is clearly labelled read-only.

## Token boundaries

Live Canvas design edits must obey token-only styling:

- No raw hex, RGB, RGBA, HSL, named colours, or arbitrary non-token Tailwind colour classes.
- No inline gradients.
- No new token creation from Canvas.
- No semantic misuse: glass is not a default card, ink is not a porcelain replacement, footer emotion is footer-only.
- Allowed design operation is token rebinding among pre-existing approved semantic tokens.

## Preview requirements

Before a patch packet can be emitted, Live Canvas must generate preview evidence:

1. Route preview URL or local preview artifact identifier.
2. Before/after textual diff for content and SEO fields.
3. Token-diff table for design edits.
4. Sacred-zone untouched receipt.
5. Guard plan receipt.
6. Accessibility checklist for headings, labels, links, and reduced-motion considerations.
7. SEO preview for title/description/canonical/JSON-LD when relevant.

Preview must be labelled non-production and not launch-certified.

## Rollback requirements

Every emitted packet must include rollback data:

- exact source field path or file path;
- prior value hash;
- prior value or reversible operation description;
- dependent routes/pages;
- expected guard commands after rollback;
- owner responsible for approving rollback.

Live Canvas must reject edits that cannot be rolled back precisely.

## Validation gates

A Canvas proposal can become a Website OS patch packet only after:

- source hash still matches;
- zone is editable and operation is allowed;
- sacred zones remain untouched;
- no raw colour/style residue exists in the proposal;
- required reviews are assigned;
- preview evidence exists;
- rollback evidence exists;
- packet declares required guards: `npm run guard:hero`, `npm run guard:canon`, `npm run verify`.

## Evidence-review workflow

### Founder review

Checks:

- business intent;
- patient journey fit;
- tone and trust;
- no premature launch/readiness claims.

### Clinical review

Checks:

- clinical safety;
- no diagnosis/treatment guarantee;
- no unsupported efficacy claim;
- content is general information unless explicitly clinician-approved.

### Brand review

Checks:

- Champagne canon alignment;
- token-only design;
- surface semantics;
- typography and visual tone;
- no visual guesses without diagnostics.

### SEO review

Checks:

- anti-doorway compliance;
- metadata correctness;
- structured-data evidence;
- canonical and route family consistency;
- no fabricated local/service claims.

### Launch-proof review

Checks:

- all previous reviews complete;
- guards pass;
- deployment plan exists outside Live Canvas;
- live-provider evidence, if claimed, comes from an approved separate audit;
- launch readiness remains false unless explicitly certified by a later launch packet.

## Failure handling

Live Canvas must fail closed by refusing packet emission when any gate is unknown, stale, missing, or contradictory.
