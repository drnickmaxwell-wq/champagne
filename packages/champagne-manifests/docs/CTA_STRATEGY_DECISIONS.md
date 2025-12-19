CTA_STRATEGY_DECISIONS.md

Champagne Ecosystem — CTA Governance & Intent Framework

Purpose

This document defines how Calls To Action (CTAs) are designed, positioned, and routed across the Champagne Ecosystem.

Its goals are to:

Prevent accidental over-selling, compliance issues, or UX confusion

Ensure CTAs support patient decision-making, not pressure

Maintain a calm, premium, consultation-first experience

Future-proof the system for portal features (tele-medicine, finance, plans)

This document governs intent, not styling. Visual design may evolve later.

Core Principles (Non-Negotiable)

CTAs guide, they do not push
The system must feel advisory, not transactional.

Consultation-first is the default
Most journeys eventually pass through a human consultation, even if remote.

Mode ≠ Treatment
Tele-medicine, finance, and plans are ways of engaging, not treatments.

Public ≠ Portal
Sensitive actions occur in authenticated, consented environments.

Secondary CTAs are not weaker — they are safer
Many important options must never be primary.

CTA Classification System

All CTAs fall into one or more intent classes.
Each class has rules governing visibility and routing.

1. Treatment CTAs

Intent: Begin a treatment journey.

Examples:

“Book a veneer consultation”

“Discuss implant options”

Rules:

May be primary on treatment pages

Usually route to /contact or consultation intake

Must not promise outcomes

Must not bypass assessment

Allowed Destinations:

/contact

/contact?topic=…

Future: portal consultation booking

2. Assessment / Diagnostic CTAs

Intent: Evaluate suitability, risks, or next steps.

Examples:

“Book an orthodontic assessment”

“Check implant suitability”

Rules:

May be primary or secondary

Preferred over “Book now” language

Especially important for implants, ortho, complex care

Allowed Destinations:

/contact

/treatments/implant-consultation

Future: portal triage flows

3. Support & Reassurance CTAs

Intent: Reduce anxiety, answer questions, build trust.

Examples:

“Ask a question”

“Talk things through”

“Learn about recovery”

Rules:

Typically secondary

Must never escalate pressure

Often paired with primary CTAs

Allowed Destinations:

/contact

Related educational treatment pages

4. Tele-medicine CTAs (Remote Consultation)

Intent: Offer remote access as a mode of consultation.

Examples:

“Start remotely”

“Initial video consultation”

“Discuss suitability from home”

Rules:

❌ Never primary on treatment pages

✅ Secondary only

❌ Never route directly to video tools from public site

Must clearly state limitations (assessment required)

Allowed Destinations:

/contact (with remote context)

Future: portal tele-consult scheduling

Notes:
Tele-medicine is a modifier, not a funnel.
It reduces friction but does not replace diagnosis.

5. Finance CTAs (Tabeo & Payment Options)

Intent: Reduce financial uncertainty without triggering commitment.

Examples:

“Explore payment options”

“See how finance works”

“Talk through costs”

Rules:

❌ Never primary on treatment pages

❌ Never “Apply now” on public pages

Must be educational and optional

Portal handles eligibility and agreements

Allowed Destinations:

Finance explainer page (future)

/contact?topic=finance

Portal finance tools (authenticated only)

Notes:
Finance CTAs unlock decisions — they must be handled gently.

6. Membership / Practice Plan CTAs

Intent: Explain and invite long-term care relationships.

Examples:

“Learn about Practice Plan”

“Is a dental plan right for me?”

“Ask about membership options”

Rules:

❌ Never primary on cosmetic or implant pages

Typically secondary or tertiary

Must route to explanation before commitment

Allowed Destinations:

/practice-plan (planned page)

/contact?topic=practice-plan

Notes:
Practice Plan is a relationship model, not a discount tool.

CTA Placement Rules
Hero CTAs

One primary, one optional secondary

Primary must align with page intent

No finance or membership CTAs here

Mid-Page CTAs

May branch to adjacent treatments

Good location for reassurance or education CTAs

Closing CTAs

Reinforce the page’s core decision

May repeat hero intent

Secondary CTA should reduce hesitation, not redirect wildly

CTA Routing Rules

/contact is acceptable as a hub, not a dumping ground

Topic-tagged contact routes are preferred where intent is clear

Circular loops are acceptable but should not dominate journeys

Future portal routes must replace contact gradually, not abruptly

Treatment Hub & Card Rules

Cards represent navigation, not decisions

Cards must never imply booking or commitment

Cards link only to treatment pages, not contact or finance

Known Gaps (Accepted, Planned)

Dedicated finance explainer page

Practice Plan page

Portal-level tele-medicine flows

Structured diagnostic triage before booking

These gaps are intentional and do not block current progress.

Change Control

Any new CTA type, destination, or escalation path must:

Fit one of the defined intent classes

Respect visibility rules

Be documented here before rollout

This prevents silent UX drift.

Summary

This CTA strategy ensures:

Calm, premium patient journeys

Strong SEO without aggressive selling

GDPR-safe future expansion

A system that scales with portal, finance, and tele-medicine features

CTAs are guides, not levers.
