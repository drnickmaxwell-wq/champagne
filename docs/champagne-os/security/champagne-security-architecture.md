# Champagne Security Architecture Overview

> Blueprint only — not legal advice and not a guarantee of compliance.  
> For review by security engineer + legal counsel.

---

## 1. High-Level Components

### 1.1 apps/web (Marketing Site, Vercel)

- Purpose:
  - Public marketing pages.
  - Lead capture forms (no mandatory clinical detail).
  - Read-only content for treatments, pricing bands, brand story.
- Hosting:
  - Vercel, static + serverless functions.
- PHI rules:
  - **Must not store PHI**.
  - Lead forms restricted to:
    - contactName (free text, but validated to discourage clinical details)
    - contactDetails (email, phone)
    - reasonForEnquiry (light, non-specific)
  - Any potentially sensitive free text is forwarded to **apps/engine** and stored in a segregated **marketing database** with strict retention.

### 1.2 chat-ui (Champagne Concierge UI)

- Purpose:
  - Front-end for conversational flows (triage, FAQs, appointment requests).
- Hosting:
  - Typically bundled with `apps/web` (Vercel) or a separate static app.
- PHI rules:
  - UI only; no direct DB access.
  - All chat traffic sent via **API → apps/engine/ai-gateway**.
  - Any PHI is:
    - Stored only in engine-side data stores.
    - Exposed to LLMs only through the AI Gateway with redaction policies.

### 1.3 apps/portal (Patient UI)

- Purpose:
  - Authenticated patient access to:
    - Appointments
    - Treatment plans
    - Secure messaging (if enabled)
    - Imaging thumbnails and viewer sessions
- Hosting:
  - Separate app (e.g. `apps/portal`) behind strong auth (OIDC or similar).
- PHI rules:
  - UI only; never connects to DB directly.
  - Talks to **apps/engine** through authenticated APIs.
  - Downloads only the minimal PHI required per screen.
  - Uses short-lived tokens and strict CORS.

### 1.4 apps/engine (PHI + Logic)

- Purpose:
  - Core application logic and all PHI handling.
  - Runs business rules, workflows, and AI orchestration.
- Hosting:
  - UK/EU-compliant infrastructure (e.g. managed Postgres in `region.uk`).
- Responsibilities:
  - Central API for:
    - portal
    - chat-ui
    - marketing lead handlers
  - PHI storage and access control.
  - AI Gateway:
    - Normalises requests.
    - Strips direct identifiers where required.
    - Applies AI Gateway Policy before calling external LLMs.

### 1.5 Databases

#### 1.5.1 Marketing Database

- Contents:
  - `marketingLead`
  - `websiteAnalyticsEvent` (pseudonymous)
- Rules:
  - **ContainsPHI = false** (by design).
  - Stored in UK/EU region.
  - Short retention (e.g. 12–24 months).
  - Accessible to:
    - marketing role
    - admin role

#### 1.5.2 Clinical Database

- Contents:
  - `portalAccount`
  - `appointmentBooking`
  - `treatmentPlan`
  - `clinicalRecord`
  - `imagingAsset`
  - `billingRecord`
  - `chatTranscriptPHI` (where necessary)
- Rules:
  - **ContainsPHI = true**.
  - Stored in UK/EU region, encrypted at rest.
  - Network-level restrictions:
    - Only `apps/engine` allowed to connect (private networking / VPC).
  - Row-level security and tenant scoping:
    - `tenantId`, `clinicId`, `patientRecordId`.

#### 1.5.3 Logging & Audit Store

- Contents:
  - `auditLogEntry`
  - `securityEvent`
  - `systemMetric`
- Rules:
  - May refer to PHI only through indirect ids (`patientRecordId`, `anonymisedSessionId`).
  - Stored separately from the main clinical DB.
  - Strict retention rules aligned with legal/audit requirements.

### 1.6 External Processors

- **LLM Provider**
  - Used for:
    - Drafting messages
    - Summarising records
    - Triage decision-support (no autonomous decisions).
  - Only receives:
    - Anonymised or minimised context per AI Gateway Policy.
- **Email Provider**
  - For transactional emails and selected marketing emails.
  - No detailed clinical content; only high-level wording.
- **SMS Provider**
  - Appointment reminders and basic alerts.
  - No clinical detail beyond “you have an appointment”.
- **Payment Provider**
  - Tokenised card details.
  - No PHI beyond any necessary references (e.g. generic invoice description).
- **Video Provider**
  - For remote consultations.
  - No recording by default; if recording is ever enabled, that becomes a PHI data class with explicit consent and retention config.

---

## 2. Data Flows (Diagram in Words)

### 2.1 Marketing Lead Flow

1. User submits lead form on **apps/web**.
2. Data is posted to **apps/engine** `/api/lead/submit`.
3. Engine:
   - Validates content.
   - Optionally applies keyword filter to detect accidental clinical overshare.
   - Stores in **marketing database** as `marketingLead`.
4. Optional:
   - Triggers an outbound email to clinic reception (no detailed PHI).
   - Creates a task in CRM system (using `marketingLeadId` only).

**Must never happen:**

- apps/web writing directly to clinical DB.
- apps/web storing form submissions locally on Vercel filesystem.

### 2.2 Portal Login & Clinical Data Access

1. Patient visits **apps/portal**.
2. Authenticates via OIDC/OAuth with engine as resource server.
3. Portal requests:
   - `/api/portal/treatment-plans`
   - `/api/portal/appointments`
4. Engine:
   - Authorises request via patient identity and tenant/clinic scope.
   - Queries **clinical database**.
   - Returns minimal JSON required for the page.
5. Portal renders results; no direct DB connection.

**Must never happen:**

- Portal directly connecting to DB.
- Long-lived tokens stored in localStorage without rotation.

### 2.3 Chatbot (Champagne Concierge)

1. User interacts with **chat-ui** (in apps/web or separate).
2. Chat messages sent to **engine** via `/api/chat/session/{anonymisedSessionId}`.
3. Engine:
   - Stores the conversation as:
     - `chatTranscriptNonPHI` (sanitised subset) for training/UX analytics.
     - Optional `chatTranscriptPHI` if explicitly part of clinical pathway.
   - Passes a **redacted** prompt to LLM via AI Gateway.
4. LLM response returned to engine → chat-ui → user.

**Must never happen:**

- chat-ui calling LLM directly from browser.
- Raw clinical record dumps sent to LLM.

### 2.4 AI Over Clinical Records

1. Clinician or patient requests a summary of a treatment plan.
2. Portal calls: `/api/ai/summarise-treatment-plan/{treatmentPlanId}`.
3. Engine:
   - Loads `treatmentPlan` and minimal linked `clinicalRecord` fields.
   - Applies AI Gateway Policy:
     - Strips or hashes direct identifiers.
     - Limits content to necessary subsets.
   - Sends to LLM provider.
4. Engine stores:
   - The query metadata.
   - Result summary.
   - Audit log entry with `anonymisedSessionId` and `patientRecordId`.

---

## 3. What Can Contain PHI vs What Must Not

### 3.1 May Contain PHI (By Design)

- Clinical Database:
  - `clinicalRecord`
  - `treatmentPlan`
  - `imagingAsset`
  - `appointmentBooking` (if linked to named patient)
  - `chatTranscriptPHI`
  - `billingRecord` (to the extent legally required)
- AI Gateway Internal Buffers:
  - Intermediate representations before redaction/whitelisting.
- Portal Responses:
  - Data needed for clinical care and patient access.

### 3.2 Must Never Contain PHI

- Marketing Website Static Assets:
  - Images, text content, demo 3D assets.
- Public Logs:
  - Standard access logs not protected as PHI.
- Frontend Error Reporting (e.g. Sentry-like tools):
  - Avoid including PHI in error messages.
- Analytics Events:
  - Use anonymised IDs instead of direct identifiers.

---

## 4. Multi-Tenant SaaS Clinics

- All PHI-related tables keyed by:
  - `tenantId`
  - `clinicId`
  - `patientRecordId`
- Engine enforces tenant boundaries at:
  - Authentication layer (tokens include tenant/clinic scope).
  - Authorisation layer (RBAC + ABAC).
  - Data access layer (row-level security rules).

Tenants must never be able to access each other’s:
- clinical records
- imaging assets
- chat transcripts
- audit logs (beyond anonymised, aggregated analytics where legal).

---
