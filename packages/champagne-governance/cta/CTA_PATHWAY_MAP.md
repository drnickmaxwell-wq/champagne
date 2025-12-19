CTA_PATHWAY_MAP.md

Champagne Ecosystem — Canonical CTA Governance

Status: ACTIVE / CANON
Applies to: SMH Dental (and future SaaS tenants)
Scope: Public site, Treatment pages, Hubs, Utilities, Portal handoff
Last updated: Phase 4 (Post-Treatment Population)

1. Purpose of This Document

This document defines where CTAs are allowed to point, what type of journey they initiate, and what must never happen.

CTAs are not decorative buttons.
They are state transitions in the patient journey.

This map ensures:

No circular CTA loops

No premature selling

No GDPR risk

No future SaaS dead-ends

Maximum SEO + trust alignment

2. Canonical CTA Pathway Types

Every CTA must belong to exactly one of the following pathway types.

2.1 Consultation Pathway

Type: Public → Human
Intent: Initiate real-world contact

Canonical Destination

/contact

Allowed CTA Labels

Book a consultation

Arrange an assessment

Speak to the team

Start your consultation

Allowed From

Homepage

All treatment pages

All hubs

Practice Plan

Video Consultation page

Emergency pages

Rules

This is always the primary CTA on treatment pages

Must never be removed

Must never be replaced by finance, AI, or portal CTAs

2.2 Exploration Pathway

Type: Public → Knowledge
Intent: Build understanding, trust, and comparison

Canonical Destinations

Other treatment pages

Relevant hubs

Aftercare / supporting info pages

Examples

Whitening → Composite Bonding → Veneers

Nervous Patients → Sedation Dentistry

Implants → Aftercare → Consultation

Aligners → Whitening → Smile Makeover

Rules

Usually secondary CTAs

Never point to contact directly unless framed as optional

Used heavily for SEO depth and dwell time

2.3 Telemedicine Pathway

Type: Public → Secure → Clinical
Intent: Remote triage without overstepping regulation

Public Entry Point

/video-consultation

Secure Execution

Portal-only (authenticated, logged, consented)

Allowed CTA Labels

Start with a video consultation

Speak to a clinician remotely

Check urgency before attending

Rules

Booking may be public

The consultation itself must occur inside the portal

No clinical advice delivered on public pages

2.4 Care Continuity Pathway (Practice Plan)

Type: Public → Long-term Relationship
Intent: Retention, prevention, predictability

Canonical Destination

/practice-plan

Allowed CTA Labels

Join our practice plan

Ongoing care made simple

Preventive care membership

Rules

Never framed as discounting

Positioned as reassurance and continuity

Can link onward to consultation or portal signup

2.5 Finance Pathway

Type: Controlled / Deferred
Intent: Accessibility without sales pressure

Canonical Destinations

/ways-to-pay (public explainer)

Portal (actual finance onboarding, e.g. Tabeo)

Allowed CTA Labels

Ways to pay

Spread the cost

View finance options

Hard Rules (Non-Negotiable)

Finance is never the primary CTA on a treatment page

No finance CTAs before consultation context

Finance activation happens inside the portal

3. CTA Placement Hierarchy
Treatment Pages

Primary: Consultation Pathway

Secondary: Exploration Pathway

Optional (lower): Practice Plan or Finance explainer

Hub Pages

Balanced mix of:

Exploration CTAs

Consultation CTA at end

No aggressive conversion stacking

Utility Pages (Practice Plan, Video Consultation)

Left-aligned CTAs are correct

Functional tone, not promotional

4. CTA Component Types (Manifest-Level)

The system currently supports two CTA classes:

A) Section-Level CTAs (Manifest-Supplied)

Explicitly defined per page

Used for treatment logic

No presets applied if present

B) Preset CTAs (Fallback Only)

Contact + AI / Smile Design

Used only when no CTAs are supplied

Must not override explicit manifests

This distinction is intentional and should be preserved.

5. Future-Safe Extensions (Approved)

The following future CTAs are pre-approved by this map:

Portal login / secure upload

Treatment plan review (portal)

Finance onboarding (portal)

Telemedicine room join

AI smile tools (public → portal handoff)

No additional pathway types may be introduced without updating this document.

6. Enforcement Rules

Codex must not invent CTA destinations

Manus must not reposition CTAs across pathway types

All CTA changes must reference this file

Any CTA audit should cite pathway type + destination

7. Status

This document is now canonical.
