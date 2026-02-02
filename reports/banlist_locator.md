# Banlist Locator Report

## Summary
- No dedicated banlist file present (no standalone list of banned phrases found).
- Matches found are rule/guard constraints (forbidden operations/tokens/targets) or generated reports referencing hard-banned phrases.

## Matches (rules/constraints)

### _imports/code/hero-engine/config/champagne/codex-editor-constraints.json
```
"forbiddenOperations": [
  "write-raw-hex-colours",
  "create-new-layout-outside-layout-template-map",
  "modify-sacred-hero-layer-stack",
  "change-gradient-angle-away-from-135deg",
  "add-new-gold-colour-tokens",
  "delete-or-rename-canon-docs"
]

"message": "Raw hex colours are forbidden. Use Champagne tokens only."
```

### _imports/code/hero-engine/config/champagne/champagne-canon.lock.json
```
"forbidden": ["raw-hex-values-in-components", "inline-css-gradients"]

"forbidden": ["infinite-spins", "flashing", "strobe"]
```

### packages/champagne-cta/src/CTARegistry.ts
```
const forbiddenTarget = `/${"book"}`;
...
throw new Error(`Forbidden CTA target detected: ${href}`);
```

## Matches (generated reports referencing hard-banned phrases)

### reports/content_readiness_report.json
```
"Contains hard-banned phrase: \"tailored\"."
"Contains hard-banned phrase: \"designed to\"."
"Contains hard-banned phrase: \"leading\"."
```

### reports/hero_cta_canon_audit.md
```
- Hard-banned phrases (case-insensitive)
```
