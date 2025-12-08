
---

### `champagne-saas-onboarding-notes.md`

```md
# Champagne SaaS Onboarding Notes

This document describes:

- what a new clinic must provide during onboarding
- how Champagne OS applies defaults
- how we prevent Canon breakage while still allowing customisation

Tenants are **clinics**, not patients. No PHI is captured in this layer.

---

## 1. Information Required From a New Clinic

### 1.1 Clinic Identity

- Legal name
- Public-facing brand name (if different)
- Primary domain(s) and any subdomains to be mapped
- Region (e.g. `uk`, `eu`, `us`)
- Time zone and primary language (e.g. `Europe/London`, `en-GB`)
- Contact channels:
  - phone number(s)
  - email(s)
  - practice management phone line (if different)

### 1.2 Clinic Type & Services

- Clinic type:
  - cosmetic-focused
  - implant centre
  - general / family
  - orthodontic
  - mixed / NHS + private
- Key treatment categories they want to promote:
  - veneers, implants, aligners, whitening, hygiene, etc.
- Any specialties:
  - full-arch rehab, digital smile design, sedation, etc.

This mapping picks a **vertical profile**:
- e.g. `verticalId = "cosmetic"` or `verticalId = "implant-centre"`.

### 1.3 Brand & Visual Feel

Clinics provide:

- Existing logo (vector if possible)
- Brand guidelines (if any)
- Three descriptors:
  - e.g. “calm”, “precision-focused”, “warm family practice”
- Any colour constraints:
  - “we use deep blue and silver”, etc.

Champagne OS then:

- maps their colours into **Champagne token-space**:
  - `ink.*`, `glass.*`, `accent.gold.*`, `gradient.135.*`
- applies **Champagne gradient law** and motion constraints
- assigns a `brandTokenSetId` like `tokens.clinic-<slug>`.

This mapping is done at **token level**, not raw hex, to avoid Canon breakage.

### 1.4 Modules / Bundle Selection

From a non-technical view, clinics choose:

- “Website only” (Basic)
- “Website + 3D” (3D bundle)
- “Full Champagne OS” (Full bundle)

Under the hood this maps to:

- `bundle.basic`
- `bundle.3d`
- `bundle.full`

Clinics can optionally toggle:

- Concierge chat (on/off, or limited to certain pages)
- Portal modules (if they have a secure backend ready)
- 3D demos for specific treatments

The onboarding UI will **only show** modules that are:
- Available in their region
- Supported by their current regulatory/compliance setup.

### 1.5 AI & Content Preferences

- Tone preferences:
  - e.g. “reassuring and plain”, “more technical”, “very gentle”.
- Hard lines:
  - “no guilt”, “no fear-based messaging”, “no guarantees of outcomes”.
- Treatments they do **not** want promoted (even if clinically offered).

This maps into:

- `aiPersonaProfileId` for the tenant
- default persona mix for the Concierge
- constraints applied in `@champagne-ai` content modules.

---

## 2. How Champagne OS Applies Defaults

### 2.1 Tenant Creation

Once minimal data is in:

1. Assign a `tenantId`, e.g. `smh`, `demo.cosmetic-uk`.
2. Attach `bundleId` from `champagne-bundles.json`.
3. Assign default profiles:
   - `brandTokenSetId` → from brand mapping or `tokens.default-champagne`.
   - `canonProfileId` → e.g. `canon.profile.default` or vertical-specific.
   - `aiPersonaProfileId` → e.g. `ai.persona.matrix.default`.

4. Generate a base `manifestsRoot`:
   - `manifests/tenants/<tenantId>`.

5. Seed tenant manifests by copying:
   - `/manifests/core/...` → into `/manifests/tenants/<tenantId>/...`
   - optionally layering `/manifests/verticals/<verticalId>/...` in between.

### 2.2 Safeguards & Canon Enforcement

During onboarding and later edits:

- **Tokens only**:
  - clinics never see raw hex colours.
  - they pick from named brand themes that map into tokens.

- **Gradient law enforced**:
  - gradient direction and softGold coverage are validated.
  - any suggestions that violate Canon are clamped to safe presets.

- **Motion & PRM**:
  - motion is always micro and capped.
  - prefers-reduced-motion is honoured automatically.

- **Non-diagnostic policy**:
  - copy templates and AI assistants are constrained:
    - no diagnosis, no promises of cure, no unapproved claims.
  - all AI output is tagged as educational and must go through human review.

- **Module boundaries**:
  - PHI-handling modules (`module.portal.*`, some integrations) require:
    - a compliant backend engine,
    - configured encryption and audit trails,
    - explicit acceptance of terms.

If conditions are not met, those modules cannot be activated.

---

## 3. Onboarding Flow – High-Level Steps

1. **Clinic Invite & Pre-Check**
   - Clinic receives an invite to Champagne OS.
   - Simple pre-check: region, clinic type, whether they have a portal backend.

2. **Identity & Domain Step**
   - Enter clinic name, domain, region, time zone, language.
   - Verify domain control (DNS / meta tag) – owned by infra layer, not Canon.

3. **Brand & Feel Step**
   - Upload logo and optionally brand PDF.
   - Choose 3–5 brand adjectives.
   - Optional colour hints (e.g. “navy + sand”).
   - Champagne OS:
     - suggests a `brandTokenSetId`,
     - shows 2–3 preview cards with ink/glass gradient variants,
     - clinic chooses one.

4. **Modules & Bundle Step**
   - Choose one of:
     - Basic / 3D / Full.
   - See which modules are included.
   - Toggle off any modules that feel excessive initially.
   - For portal modules, a warning explains PHI implications and requirements.

5. **Services & Priorities Step**
   - Select treatment categories from a checklist.
   - Mark 3 “hero” services:
     - e.g. veneers, implants, aligners.
   - These drive which treatment manifests are prioritised and seeded first.

6. **AI & Tone Step**
   - Answer 3–5 quick questions about:
     - tone, anxiety handling, level of technicality.
   - System picks an `aiPersonaProfileId` and default Concierge persona mix.

7. **Review & Approval**
   - Summary screen of:
     - tenantId, bundle, modules,
     - brand token set,
     - vertical profile,
     - key treatments.
   - On approval, system generates:
     - tenant record in `champagne-tenants.json` (or equivalent store),
     - a new `manifests/tenants/<tenantId>` tree,
     - initial AI persona and FAQ profiles.

---

## 4. Preventing Canon Breakage Long-Term

To keep things sane as more clinics join:

- **Validation Pipelines**
  - All manifests pass through a validator:
    - token usage only,
    - lighting/motion references must exist in Canon,
    - no disallowed text patterns (diagnostic claims, etc).

- **Canon Versioning**
  - Each tenant can pin to a `canonVersion`:
    - e.g. `canonVersion: "2025.1"`.
  - Upgrades are opt-in and can be diffed.

- **Bundle & Module Constraints**
  - Some modules require:
    - a minimum Canon version,
    - a specific region or regulatory flag.

- **Edit Surfaces**
  - Clinics edit content via a controlled UI:
    - they manipulate content blocks, not raw JSON.
    - UI only exposes safe toggles and inputs mapped to schema.

---

## 5. Compatibility With Packages

- `@champagne/canon`
  - provides:
    - `canon.profile.*`
    - emotional lighting presets
    - motion presets
    - persona archetypes
  - tenant records reference these by ID.

- `@champagne-manifests`
  - ships core + vertical manifests.
  - onboarding clones these into tenant roots.

- `@champagne-3d`
  - provides the 3D asset catalogue and presets.
  - tenant manifests reference `3dAssetId` only; asset details live here.

- `@champagne-ai`
  - holds persona matrices, journeys, FAQ profiles.
  - tenant configs link via `aiPersonaProfileId` and manifest-level IDs.

This keeps the multi-tenant SaaS layer thin: **it knows who the clinics are,
what they’re allowed to use, and where their manifests live – nothing more.**
