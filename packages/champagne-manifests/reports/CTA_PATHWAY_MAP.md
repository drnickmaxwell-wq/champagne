# CTA Pathway Map — Champagne / SMH Dental (Phase 1)

Purpose:
Define the canonical CTA pathways across public site pages and portal-adjacent pages.
This prevents “circular CTA loops”, avoids orphan routes, and ensures each CTA has a purposeful next step.

Scope covered (current audits + new pages):
- Ortho & aligners: /treatments/clear-aligners, /treatments/clear-aligners-spark, /treatments/orthodontics, /treatments/fixed-braces
- Cosmetic: /treatments/composite-bonding, /treatments/veneers, /treatments/full-smile-makeover, /treatments/digital-smile-design
- Implants: /treatments/implants, /treatments/implants-single-tooth, /treatments/implants-multiple-teeth, /treatments/implants-full-arch,
           /treatments/implant-retained-dentures, /treatments/implant-consultation, /treatments/teeth-in-a-day,
           /treatments/failed-implant-replacement, /treatments/implant-aftercare, /treatments/sinus-lift
- Utility pages (new): /practice-plan, /video-consultation
- Home entry (current): /

Key canonical destinations (Phase 1):
- /contact (primary conversion endpoint)
- /contact?topic=<topic> (topic-routed intent capture)
- /treatments/<slug> (education depth)
- Portal endpoints (Phase 2+): /portal/* (uploads, finance, video consult booking, treatment plan view)

---

## Canon rules (Phase 1)

1) Primary CTA should move the user forward:
   - Book / Request consultation (usually /contact or /contact?topic=...)
2) Secondary CTA should reduce friction:
   - “Ask a question” (topic form), “Check suitability”, “See costs/finance options” (when available)
3) Avoid circular loops:
   - Page A footer CTA → Page B → footer CTA back to Page A is a loop.
4) “Aftercare” pages should not behave like “new patient acquisition” pages:
   - They must include triage/support paths (Phase 2: portal + urgent guidance routing).
5) Utility pages (Practice Plan, Video Consultation, Finance) should *not* steal the main treatment journey:
   - They should support it: “How to pay”, “Remote review”, “Membership”, then return to the relevant next step.

---

## Pathway index (the map)

### 0) Home ( / )
Primary user intents:
A) “I know what I want” → treatment page
B) “I want to book” → /contact
C) “I’m unsure / anxious / urgent” → guided triage path (Phase 2: portal/telemedicine routing)

Recommended Phase 1 CTAs:
- Primary: Book a consultation → /contact
- Secondary: Explore treatments → /treatments
- Secondary: Nervous / urgent / need advice → /video-consultation (then to /contact?topic=urgent or /contact?topic=video)

Notes:
- Home hero CTA must NOT route to unknown legacy endpoints (e.g. /book) unless deliberately defined and styled as canonical.

---

### 1) Ortho & aligners

#### /treatments/clear-aligners
Primary: Book consultation → /contact
Secondary: Ask a question → /contact
Phase 2+ enhancement: “Check suitability” → quiz/ai-smile-analysis (planned)

#### /treatments/clear-aligners-spark
Primary: Book an Orthodontic Assessment → /contact
Secondary: Ask about Spark aligners → /contact?topic=aligners
Risk note:
- Requested path “/treatments/spark-clear-aligners” not present; manifest uses /treatments/clear-aligners-spark.
- Preserve canonical slugs; ensure internal links match.

#### /treatments/orthodontics
Primary: Book an Orthodontic Assessment → /contact
Secondary: Discuss brace options → /contact

#### /treatments/fixed-braces
Primary: Book an Orthodontic Assessment → /contact
Secondary: Ask a braces question → /contact

Missing:
- /treatments/retainers has no route/manifest. (Orphan topic; decide whether to create page or remove links.)

---

### 2) Cosmetic

#### /treatments/composite-bonding
Primary: Cosmetic Assessment → /contact
Secondary: Veneers → /treatments/veneers
Secondary: Teeth whitening → /treatments/teeth-whitening (if exists)
Secondary: Clear aligners → /treatments/clear-aligners

#### /treatments/veneers
Hero Primary: Book a veneers consultation → /contact
Hero Secondary: Composite vs porcelain → /contact?topic=veneers
Footer Primary: Veneer Consultation & Smile Design → /contact
Footer Secondary: Explore alternative cosmetic options → /treatments/full-smile-makeover

Missing:
- /treatments/smile-makeover route absent; closest present is /treatments/full-smile-makeover.
- Ensure internal links use the canonical existing slug.

#### /treatments/full-smile-makeover
Primary: Book a planning session → /contact
Secondary: Preview the roadmap → /treatments/digital-smile-design

#### /treatments/digital-smile-design
Hero Primary: Book a digital design consult → /contact?topic=digital-dentistry
Hero Secondary: Ask about smile previews → /contact?topic=3d-printing
Footer Primary: Book a design session → /contact?topic=digital-dentistry
Footer Secondary: Ask about mock-ups → /contact?topic=3d-printing

Notes:
- Good: strong topic routing.
- Future: connect DSD → portal upload flow (photos/scans) in Phase 2.

---

### 3) Implants

#### /treatments/implants (hub page)
Primary: Book Implant Consultation & Planning → /contact
Secondary: Ask a question → /contact?topic=implants

#### /treatments/implants-single-tooth
Primary: Book a single-implant consult → /contact
Secondary: Ask about single implants → /contact?topic=implants

#### /treatments/implants-multiple-teeth
Primary: Book a multi-implant consult → /contact
Secondary: Ask about implant bridges → /contact?topic=implants

Missing:
- /treatments/all-on-4 route/manifest entry missing (but /treatments/implants-full-arch exists).
- Decide canonical positioning: keep /treatments/implants-full-arch as canonical; optionally add “all-on-4” as alias later if permitted.

#### /treatments/implants-full-arch
Hero Primary: Book a full-arch consultation → /contact
Hero Secondary: Speak to the implant team → /contact?topic=implants
Footer Primary: Book consultation → /contact
Footer Secondary: Discuss implant options → /contact?topic=implants

Risk note:
- CTAs currently do not create a distinct “full arch” pathway; they collapse into generic contact.

#### /treatments/implant-consultation
Hero Primary: Book an implant consultation → /contact
Hero Secondary: Ask a question first → /contact?topic=implants
Footer Primary: Book an implant consultation → /contact
Footer Secondary: Explore implant treatments → /treatments/implants
Risk note:
- Footer secondary loops back to implants hub (acceptable, but can become circular if overused).

#### /treatments/teeth-in-a-day
Hero Primary: Book an implant assessment → /contact
Hero Secondary: Ask if I qualify → /contact?topic=implants
Footer Primary: Book an implant assessment → /contact
Footer Secondary: Explore implant options → /treatments/implants
Risk note:
- No dedicated “same-day” intent capture step yet; add qualification gating later (Phase 2 quiz).

#### /treatments/failed-implant-replacement
Hero Primary: Book an implant review → /contact
Hero Secondary: Ask about options → /contact?topic=implants
Footer Primary: Book now → /contact
Footer Secondary: See implant consultation details → /treatments/implant-consultation
Risk note:
- Could bypass diagnostics context; ensure content frames it as assessment-first.

#### /treatments/implant-aftercare
Primary: Book a consultation → /contact
Secondary: See implant consultation details → /treatments/implant-consultation
Risk note (important):
- Aftercare should include support/triage pathways (Phase 2: portal, phone, urgent guidance). It should not behave as purely sales acquisition.

#### /treatments/sinus-lift
Hero Primary: Book an implant assessment → /contact
Hero Secondary: Ask about suitability → /contact?topic=implants
Footer Primary: Book an implant assessment → /contact
Footer Secondary: Implant consultation → /treatments/implant-consultation

#### /treatments/implant-retained-dentures
Hero Primary: Book an implant assessment → /contact
Hero Secondary: Ask about implant-retained dentures → /contact?topic=implants
Footer Primary: Book an implant assessment → /contact
Footer Secondary: Explore implant options → /treatments/implants

Cross-link risk:
- Several implant footers loop back to /treatments/implants or /treatments/implant-consultation.
- Keep one “loop-back” link, but prefer at least one forward step (Phase 2: finance, uploads, video consult triage).

---

## Utility / Support pathways (Phase 1 → Phase 2 bridge)

### /practice-plan
Goal:
Membership education → either join enquiry or book check-up.

Phase 1 CTAs:
- Primary: Ask about Practice Plan → /contact?topic=membership
- Secondary: What’s included in a check-up? → /treatments/check-up (if exists) or /contact?topic=checkup

Phase 2 enhancements:
- “Join Practice Plan” → Portal onboarding + finance direct debit setup (or Tabeo if used for plans)

### /video-consultation (Telemedicine entry)
Goal:
Remote review to reduce friction, handle anxious/urgent queries, and pre-triage.

Phase 1 CTAs:
- Primary: Book a consultation → /contact?topic=video
- Secondary: Emergency? See urgent care → /contact?topic=urgent (or a dedicated urgent guidance page)

Phase 2 wiring:
- Book video consult → Portal scheduling + secure upload intake (photos, symptoms)
- Routing:
  - Urgent → urgent triage flow
  - Non-urgent cosmetic query → consult booking
  - Post-op issue → aftercare portal support

### Tabeo Finance (planned)
Public entry points (Phase 2):
- From high-ticket pages (implants full arch, veneer smile design) secondary CTA:
  “Finance options” → /finance (public explainer) → portal Tabeo application

Portal endpoints (Phase 2):
- /portal/finance (Tabeo application + status)
- /portal/documents (quotes, estimates, consent forms)

### Uploads (planned)
Where uploads should appear:
- Video consultation intake
- Digital Smile Design intake (photos, scans)
- Implant consult intake (referrals, CT images if appropriate process exists)

Portal endpoints (Phase 2):
- /portal/uploads (secure uploads, tagging by pathway)

---

## Known route anomalies discovered during CTA audits

1) Ortho:
- /treatments/retainers missing (no route/manifest)

2) Cosmetic:
- /treatments/smile-makeover missing; /treatments/full-smile-makeover exists

3) Implants:
- /treatments/all-on-4 missing; /treatments/implants-full-arch exists

4) Aligners slug mismatch risk:
- requested /treatments/spark-clear-aligners not present; canonical is /treatments/clear-aligners-spark

5) Unexpected /book route discovered via hero CTA click:
- treat as legacy or unintended route until explicitly canonised.

---

## Implementation notes (for Codex)

- Ensure all hero CTAs on home and utility pages resolve from the canonical manifest pathway map.
- Remove any debug/audit labels (“HERO CTAS”, “FOOTER CTAS”) from production rendering.
- Prevent route-level layouts (e.g. /book) from mutating global container sizing or body styles without cleanup.
- If /book is not canonical, remove from navigation sources and replace hero CTA href with /contact.
