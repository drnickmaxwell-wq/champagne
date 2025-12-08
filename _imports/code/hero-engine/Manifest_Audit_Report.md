# Manifest Audit Report

## File List
| Path | Purpose |
| --- | --- |
| `public/manifest.json` | Progressive Web App (PWA) manifest with routes, shortcuts, and launch behaviors. |
| `public/brand/manifest.json` | Brand surface manifest declaring tokens, gradients, textures, and motion assets. |
| `public/assets/champagne/manifest.json` | Component manifest for the Champagne Hero experience, including tokens, layers, and assets. |
| `public/brand/champagne_machine_manifest_full.json` | Expanded brand package manifest specifying hero presets, guard rails, and asset freezes. |
| `public/brand/manus_import_unified_manifest_20251104.json` | Unified import manifest covering effects, React components, assets, and guard requirements from Manus AI drops. |
| `public/brand/chat-ui.json` | Champagne theming manifest for chat UI panels and gradients. |
| `styles/champagne/manifest.json` | Local copy of the Champagne Hero manifest for style workstreams. |
| `docs/Brand_Canon_Packet/manifest.styles.champagne.json` | Documentation copy of the Champagne Hero manifest. |
| `docs/Brand_Canon_Packet/manifest.public.brand.json` | Documentation copy of the brand surface manifest. |
| `docs/Brand_Canon_Packet/Brand_Canon.json` | Canonical cross-reference of tokens, gradients, and duplicates across manifests. |
| `docs/director-control.json` | Director control matrix linking manifests, guard commands, and program phases. |

## Manifest Details
### `public/manifest.json`
- **Components/Pages/Routes**: Registers PWA start URL `/` and shortcuts to `/emergency-dentist`, `/contact`, `/ai-smile-quiz`, and `/treatments`, signalling mobile deep links for those pages.
- **Manus/Codex Linkage**: Captures AI-centric route `AI Smile Quiz`, implying Manus AI driven assessment touchpoint; protocol handler for `tel` integrates with emergency workflow.
- **Dependencies**: Requires icon set under `public/icons/`, screenshots, and honours tokens referenced via CSS custom properties in `background_color` and `theme_color`.

### `public/brand/manifest.json`
- **Components/Effects**: Defines brand-level assets (gradients, wave masks, textures, particles, motion sequences) used by Champagne experiences but no React components directly.
- **Manus/Codex Linkage**: Provides asset paths consumed by Manus AI delivered hero modules; gradient variables align with Canon tokens for Codex guardrails.
- **Dependencies**: Depends on `/styles/tokens/smh-champagne-tokens.css`, `/assets/champagne/**` for dynamic media, and `/brand/**` fallbacks for static rendering.

### `public/assets/champagne/manifest.json`
- **Components/Effects**: Registers `ChampagneHero` component with layered effects (`gradient-base`, `wave-caustics`, `wave-mask`, `glass-shimmer`, `particles-static`, `particles-drift`, `gold-dust-drift`, `film-grain`, `content`) and parallax configuration.
- **Manus/Codex Linkage**: Authored by Manus AI; enforces accessibility and compliance fields suitable for Codex audits (e.g., `prefers-reduced-motion`, `brandTokens`).
- **Dependencies**: References Champagne tokens, CSS radius/shadow tokens, and asset bundle under `public/assets/champagne/` (webm, webp) with performance guidance.

### `styles/champagne/manifest.json` & `docs/Brand_Canon_Packet/manifest.styles.champagne.json`
- **Components/Effects**: Mirror the `ChampagneHero` manifest to keep styling workspaces and documentation aligned; same layer stack and compliance rules.
- **Manus/Codex Linkage**: Share Manus AI authorship, acting as source-of-truth for Codex-driven linting and guard rails.
- **Dependencies**: Duplicate asset references ensure designers and auditors can work offline; rely on the same token set and asset directories.

### `docs/Brand_Canon_Packet/manifest.public.brand.json`
- **Components/Effects**: Documentation snapshot of brand textures, wave assets, and dynamic particle catalogue.
- **Manus/Codex Linkage**: Reinforces gradient and token naming to keep Codex validations in sync with Manus exports.
- **Dependencies**: Mirrors `/public/brand/manifest.json`, ensuring docs point to both `/assets/champagne/` and `/brand/` static archives.

### `public/brand/champagne_machine_manifest_full.json`
- **Components/Effects**: Packages `hero` configuration with wave, motion, particle assets plus blend/opacity hints for effect tuning; includes guard directives (`freeze`, `brand_lock_assertions`).
- **Manus/Codex Linkage**: Provides guard lists aligning with Codex guard commands (`hero_freeze`) and Manus gradient identifiers.
- **Dependencies**: Depends on Champagne wave/motion assets and freeze lists to maintain canonical visuals.

### `public/brand/manus_import_unified_manifest_20251104.json`
- **Components/Effects**: Enumerates multiple effect modules (`fx-waves`, `fx-grain`, `fx-particles-soft`, `fx-caustics`) and React components (`header-champagne`, `footer-champagne`, `hero-champagne-v2`) with preview routes.
- **Pages/Routes**: Supplies preview endpoints under `/preview/*` for QA of each module.
- **Manus/Codex Linkage**: Derived from Manus AI import (`source_zips` list) and prescribes Codex-oriented checks (playwright scenarios, guard freezes, brand assertions).
- **Dependencies**: Relies on style sheets under `styles/champagne/**`, React component entries in `components/imports/**`, and numerous brand assets including motion posters and freeze requirements.

### `public/brand/chat-ui.json`
- **Components/Effects**: Defines theming variables for chat UI glass panels and gradients.
- **Manus/Codex Linkage**: Uses Champagne tokens to keep Manus AI chatbot surfaces aligned with Codex guard rails.
- **Dependencies**: Requires token variables (`--smh-bg`, `--smh-accent-gold`, etc.) defined in the Champagne token set.

### `docs/Brand_Canon_Packet/Brand_Canon.json`
- **Components/Effects**: Acts as cross-manifest inventory; no direct component, but lists duplicates and gradients used across modules.
- **Manus/Codex Linkage**: Points to manifest sources and highlights duplication/resolution needs for Codex-managed token hygiene.
- **Dependencies**: References `smh-champagne-tokens.css`, `manifest.styles.champagne.json`, and `manifest.public.brand.json` as primary sources.

### `docs/director-control.json`
- **Components/Pages/Routes**: Maps preview routes (`/preview/hero-gilded`, `/preview/chat`, `/preview/footer-luxe`) and program phases (e.g., `telemedicine`, `ai_smile_quiz`).
- **Manus/Codex Linkage**: Binds guard commands (`pnpm run brand:guard`, `pnpm run guard:hero`) and Codex restrictions (`no_binaries_in_codex_pr`, `never_touch`).
- **Dependencies**: Points directly to core manifests ensuring the Director can orchestrate updates with guard automation.

## Integration Map
- **ChampagneHero Stack**: `public/assets/champagne/manifest.json`, `styles/champagne/manifest.json`, and `docs/Brand_Canon_Packet/manifest.styles.champagne.json` share identical layer and asset definitions, ensuring design, implementation, and documentation remain synchronized.
- **Brand Surface**: `public/brand/manifest.json` and its doc mirror provide the texture, wave, and motion definitions consumed by Champagne components and referenced by `champagne_machine_manifest_full.json` and the unified Manus import manifest.
- **Guard & QA Pipeline**: `public/brand/manus_import_unified_manifest_20251104.json` feeds component entries and Playwright checks, while `docs/director-control.json` maps those manifests to guard commands and preview routes for the Director.
- **Chat Experience**: `public/brand/chat-ui.json` layers on top of Champagne tokens, tying into phases like `chatbot_ui` in the director control file.
- **PWA Entry Points**: `public/manifest.json` exposes user-facing routes that align with program phases (`ai_smile_quiz`, emergency care) ensuring mobile shortcuts map to Manus-built experiences.

## Coordination Value for the Director
- Centralized guard commands and manifest pointers in `docs/director-control.json` let the Director trigger Manus AI and Codex guardrails per phase while keeping preview routes ready for reviews.
- Duplicate manifest copies in `/styles` and `/docs` provide offline references for Codex auditors and designers, reducing ambiguity during AI-driven build iterations.
- Unified import manifest enumerates all Manus AI asset drops, enabling the Director to verify freeze coverage and ensure Codex compliance steps (tests, tokenization) remain actionable.

## Recommendations for New Modules
1. **AI Concierge**
   - Extend `public/brand/manus_import_unified_manifest_20251104.json` with a new React entry (e.g., `concierge-champagne`) pointing to concierge UI components and reuse chat UI theming for consistency.
   - Register a `/preview/concierge` route and add guard assertions in `docs/director-control.json` to incorporate concierge checks alongside existing preview pages.
2. **Patient Portal**
   - Introduce portal-specific manifest section referencing secure asset bundles and add portal shortcuts to `public/manifest.json` for mobile deep linking.
   - Update the unified Manus import manifest to include portal modules with Playwright tests ensuring authentication flows respect Champagne tokens.
3. **Telemedicine**
   - Leverage the existing `telemedicine` phase in `docs/director-control.json` by defining component manifests for video consult surfaces, reusing brand gradients and adding reduced-motion fallbacks.
   - Include telemedicine assets in `public/brand/champagne_machine_manifest_full.json` freeze lists to maintain compliance.
4. **3D/AR Showcase**
   - Expand brand manifests with dedicated `dynamic` entries for AR models or WebGL environments and document new assets within `docs/Brand_Canon_Packet/Brand_Canon.json` to track token usage.
   - Add PWA shortcut entries and Manus import components for AR viewers, ensuring guard assertions cover performance and accessibility for immersive content.
