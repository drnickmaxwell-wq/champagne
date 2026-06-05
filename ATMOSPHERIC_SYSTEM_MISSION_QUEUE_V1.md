# ATMOSPHERIC_SYSTEM_MISSION_QUEUE_V1

Mode: repository-evidence-only audit output. This is a future queue, not an implementation.

## Operating rule

Future agents must not implement any item in this queue without a fresh mission packet and explicit write scope. Sacred hero zones remain protected unless the packet grants authority.

## Queue A — truth normalization before code

### A1. Atmosphere vocabulary map

Purpose: reconcile canon, token, hero, and emotional preset vocabularies.

Inputs:

- Canon temporal states: dawn, midday, goldenHour, inkfall.
- Token CSS states: dawn, dusk, night.
- Hero runtime states: day, evening, night.
- Emotional preset tokens: studioNeutral, blueHour, goldenHour_soft, morningFresh, duskWarm.

Output: one read-only mapping report. No code changes.

### A2. Hero evening weather validation

Purpose: determine whether `overlay.goldDust` in hero weather is valid or residue compared with `overlay.goldDustDrift`.

Output: diagnostic report only unless separately authorized.

### A3. Persian Midnight calibration decision packet

Purpose: decide whether Persian Midnight remains represented by `--brand-ink`/`--bg-ink` or receives explicit semantic token naming.

Output: canon/token proposal only. No token edits without Director authority.

## Queue B — infrastructure design packets

### B1. Atmospheric state source-of-truth design

Questions:

- Is atmosphere route-authored, user-selected, clock-derived, environment-derived, or editorial?
- Does atmosphere affect only hero, or also page surfaces?
- What is allowed to change under PRM?
- What is allowed to change under accessibility constraints?

Output: architecture report.

### B2. Surface-state contract design

Questions:

- Should page surface state be separate from hero surface stack?
- Which tokens are legal for porcelain, ink, glass, footer emotion?
- Which attributes are canonical: `data-surface`, `data-surface-tone`, or both?

Output: surface contract proposal and guard requirements.

### B3. Lighting-state contract design

Questions:

- Which lighting states are runtime states versus canon-only recipes?
- Which CSS variables represent ambient warmth, vignette, lighting temperature, sheen, particles, grain, and glass opacity?
- How are hero lighting and page lighting kept separate?

Output: lighting contract proposal.

## Queue C — implementation candidates requiring future authorization

These are not authorized by this audit.

### C1. Time-of-day provider

Potential scope:

- App-level state provider.
- No hero sacred edits unless authorized.
- Token-only CSS consumption.
- Optional query/debug override.

### C2. Atmosphere manifest

Potential scope:

- Read-only route atmosphere manifest first.
- Explicit mapping from route/page category to atmosphere state.
- Guard to prevent raw color/gradient drift.

### C3. Token expansion for atmosphere variables

Potential scope:

- Define semantic variables for ambient warmth, vignette, sheen, particles, glass opacity, lighting temperature.
- No raw runtime colors.
- Must respect immutable brand chroma.

### C4. Seasonal layer

Potential scope:

- Only after time-of-day and atmosphere source of truth exist.
- Should be editorial/manifest-controlled, not automatic visual guessing.
- Must not alter clinical readability or brand chroma.

## Queue D — guard/observability candidates

### D1. Atmosphere truth exporter

Produce a report of active atmosphere state, tokens, route, hero variant, surface tone, PRM, and motion layer state.

### D2. Surface semantic guard

Detect illegal use of glass for default cards, ink for porcelain replacements, and footer emotion outside footer emotional sections.

### D3. Temporal vocabulary guard

Detect unmapped use of dawn/midday/goldenHour/inkfall/day/evening/night/dusk tokens across manifests and CSS.

## Recommended next mission

`ATMOSPHERE_VOCABULARY_MAP_AND_HERO_EVENING_VALIDATION_V1`

Type: read-only diagnostic.

Reason: the largest immediate risk is not missing implementation; it is divergent vocabulary and the possible evening motion ID mismatch.
