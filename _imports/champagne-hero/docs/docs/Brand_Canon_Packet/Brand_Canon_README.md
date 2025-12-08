# SMH Champagne Brand Canon Packet

## Packet Contents

- `/docs/Brand_Canon_Packet/smh-champagne-tokens.css`: Canonical CSS token library defining color, gradient, and supporting variables for St Mary's House Champagne experiences. These tokens are the contract for developers and designers—no overrides or ad-hoc hex values are permitted outside this source of truth.
- `/docs/Brand_Canon_Packet/manifest.styles.champagne.json`: Experience-level style manifest for the Champagne Hero implementation. It catalogs tokens, layered effects, assets, accessibility constraints, and compliance gates that must remain intact for any hero execution.
- `/docs/Brand_Canon_Packet/manifest.public.brand.json`: Public-facing brand manifest describing the gradient, gold usage, motion, and static assets for the champagne canon. It is the reference for downstream properties that consume brand assets at runtime.

## Intake Auditor Guidance

The Manus Design Intake Auditor must treat each file as **absolute truth** when reviewing submissions:

1. Load the CSS tokens and ensure every submitted artifact references only the provided custom properties—flag any literal color or gradient definitions that deviate from the token contract.
2. Validate the style manifest layer-by-layer, confirming assets, parallax limits, accessibility toggles, and compliance values match the specification without omission.
3. Cross-check the public brand manifest to ensure runtime endpoints, gradient metadata, and gold handling are untouched and correctly wired in delivery environments.

## Gradient & Gold Canon

- Maintain the 135° magenta→teal→gold gradient exactly as specified; gold accents must only appear on keylines, call-to-action trims, and motion highlights—never as flat fills or large backgrounds.
