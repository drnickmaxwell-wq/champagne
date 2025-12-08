# Champagne AI Gateway Policy

> Blueprint for AI/LLM traffic. Not legal advice.  
> To be implemented by `apps/engine` and reviewed by security + legal.

---

## 1. Scope

The AI Gateway governs all outbound requests from the Champagne Ecosystem to external AI providers, including:

- Real-time chatbot responses for:
  - marketing enquiries
  - triage-style questions
  - treatment explanations
- Summarisation of:
  - treatment plans
  - clinical records (where permitted)
- Non-clinical convenience features:
  - text rewriting
  - FAQ generation
  - tone adjustment

No other service is permitted to call AI providers directly.

---

## 2. Core Principles

1. **Data Minimisation**
   - Only send the minimum necessary fields to achieve a given purpose.
   - Use concise summaries where possible instead of full records.

2. **Separation of Layers**
   - Browser and front-end apps never talk directly to AI providers.
   - apps/engine is the sole caller, via the AI Gateway.

3. **Identifier Protection**
   - Direct identifiers must be excluded or transformed into:
     - `patientRecordId`
     - `anonymisedSessionId`
     - tenant-level or clinic-level keys.

4. **Config-Driven Redaction**
   - All redaction and whitelisting rules live in a central JSON config.
   - No environment may override them without review.

5. **Purpose Limitation**
   - Each AI call declares a `purposeId` referencing a documented lawful basis.
   - Logging and review processes are aligned with those purposes.

---

## 3. Data Categories and AI Behaviour

### 3.1 Marketing / Non-PHI Conversations

Examples:
- “What are veneers?”
- “How much is whitening?”
- “Where is the clinic located?”

Policy:
- These can be handled by either:
  - local FAQ logic; or
  - external AI provider.
- No clinical records or identifiers are used.
- Sanitised `chatTranscriptNonPHI` may be retained for quality monitoring.

### 3.2 Triage / Symptom-Related Conversations

Policy:
- Treated as potentially PHI.
- Only processed:
  - through consented flows.
  - with clear user messaging that this is not a diagnosis.
- AI Gateway must:
  - avoid sending unnecessary historical clinical detail.
  - prefer summarised abstracts generated inside the engine.
- Outputs are labelled as:
  - informational
  - subject to clinician review.

### 3.3 Treatment Plan Summarisation

Policy:
- Engine constructs a minimal treatment summary.
- Fields passed to AI:
  - high-level treatment descriptions
  - timeframes
  - visit counts
- Fields not passed:
  - direct identifiers
  - billing details not required for explanation
  - extraneous historical notes.
- AI output stored as:
  - `treatmentPlanSummary` linked by `patientRecordId`.

### 3.4 Imaging and 3D Data

Policy:
- Raw imaging data and 3D models are not sent to external AI by default.
- Where used (e.g. de-identified training or pattern detection), this requires:
  - explicit legal and regulatory review.
  - separate data classes and agreements.
- Any derived metadata must strip identifiers and use `patientRecordId` references only.

---

## 4. Redaction and Whitelisting Strategy

### 4.1 Redaction Layers

**Layer 1 – Field-Level Filtering**

- For each resource type (e.g. `clinicalRecord`, `treatmentPlan`), define:
  - allowed fields (whitelist)
  - forbidden fields (blacklist)
- Fields not explicitly allowed are excluded by default.

**Layer 2 – Pattern-Based Redaction**

- Secondary pass to remove:
  - free-text mentions of direct identifiers
  - unnecessary sensitive detail beyond the AI purpose.

**Layer 3 – Contextual Truncation**

- Limit the volume of text per request.
- Prefer chronological or relevance-based pruning.

### 4.2 Whitelist-by-Purpose

Each AI use-case has a `purposeId` that maps to:

- Allowed dataClasses
- Allowed field paths
- Maximum text length
- Retention policy for AI-related data (if stored)

Examples:

- `purpose.chat.marketing.general`
- `purpose.chat.triage.assist`
- `purpose.summary.treatmentPlan`
- `purpose.summary.clinicalRecord.internal`

---

## 5. Logging and Audit

All AI Gateway activity must generate `auditLogEntry` records including:

- `timestamp`
- `tenantId`, `clinicId` (if applicable)
- `initiatorType` (patient, clinician, system)
- `purposeId`
- `dataClassIds` used
- `anonymisedSessionId`
- AI provider id and endpoint
- success/error status

No raw AI payloads are logged by default; only:

- minimal metadata
- internal identifiers
- debug hashes where strictly necessary.

---

## 6. 3D / Imagery Use-Cases

### 6.1 Visual Enhancements and Simulation

- Where AI is used for:
  - visual enhancements
  - non-diagnostic simulations
- Input images should preferably be:
  - cropped
  - minimised to the region of interest.
- Models used for demos in marketing contexts must be:
  - generic
  - non-identifiable
  - not derived from real patients without appropriate consent and agreement.

### 6.2 Future Diagnostic Support

- Any move towards diagnostic use requires:
  - regulatory review
  - explicit risk assessment
  - alignment with jurisdiction-specific requirements.

---

## 7. Multi-Tenant SaaS Considerations

- AI Gateway config must be:
  - tenant-aware
  - optionally more restrictive for certain tenants.
- Tenants must not:
  - access each other’s AI logs
  - share AI training data without explicit agreements.

---

## 8. Governance

- All changes to AI Gateway config:
  - versioned
  - reviewed by a designated security/clinical governance group.
- Regular Data Protection Impact Assessments (DPIAs) should:
  - cover AI use-cases
  - be updated when scope changes.

---
