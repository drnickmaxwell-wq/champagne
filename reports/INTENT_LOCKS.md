# INTENT_LOCKS.md

## Status
ACTIVE — HARD LOCK

This file defines non-negotiable intent boundaries for content, hero text, and CTA systems in this repository.
Any action that violates this file is invalid.

---

## 0. Purpose of This File

This file exists to:
- Prevent AI drift
- Prevent re-interpretation in future conversations
- Prevent Codex or any tool from making “helpful” changes
- Preserve clinician-led judgement and intent
- Allow work to proceed page by page without reopening earlier decisions

This file is authoritative until explicitly amended by the site owner.

---

## 1. Phase Separation Lock (GLOBAL)

Work proceeds in strict phases. No phase may modify artefacts belonging to another phase.

Phases (in order):
1. Content polishing (sentence-level only)
2. Hero text design
3. CTA logic & CTA copy
4. SEO / metadata / schema

During Phase 1:
- Hero text must not change
- CTA buttons must not change
- CTA box copy must not change
- Page structure must not change

---

## 2. Content Polishing Intent Lock (Phase 1)

Allowed:
- Sentence-level clarity improvements
- Removal of AI-generic phrasing
- Tightening language to sound clinician-led
- Preserving meaning, scope, services, structure, locality signals, and intent

Forbidden:
- Adding or removing sections
- Reordering sections
- Summarising content
- Introducing marketing language or persuasion
- Introducing reassurance padding
- Touching hero text
- Touching CTAs

This phase is text refinement only.

---

## 3. Fees Page Intent Lock

Primary intent:
- Transparency
- Reassurance through clarity
- No pressure

CTA policy:
- Soft CTA only (e.g. “Contact the practice”)

Explicit exclusions:
- No sales CTA
- No urgency framing
- No treatment upsell
- No “book now” framing

Fees pages are informational, not transactional.

---

## 4. Treatments Hub Intent Lock

Role of /treatments:
- Navigation
- Orientation
- Wayfinding
- Helping patients choose what to read next

Not allowed:
- Persuasion
- Selling outcomes
- Conversion framing

CTA posture:
- Neutral
- Exploratory
- Directional

---

## 5. Individual Treatment Page Intent Lock

Core intent:
- Clinical explanation
- Suitability and limits
- Decision support
- Long-term thinking

Required characteristics:
- Conservative tone
- Explicit boundaries
- Clear sequencing (assessment → planning → treatment)

Explicit exclusions:
- Outcome guarantees
- Lifestyle marketing language
- Cosmetic hype
- Generic dental website phrasing

Each treatment page should read like a written consultation.

---

## 6. Hero Text Intent Lock (GLOBAL)

Hero purpose:
- Frame the page
- Signal intent
- Set expectations

Hero is not:
- A sales tool
- A CTA replacement
- A marketing slogan

Rules:
- One clear idea per hero
- No hype language
- No emotional manipulation
- No generic taglines

Hero text is addressed only after content is locked.

---

## 7. CTA Engine Intent Lock

The CTA Engine is the single source of truth for:
- CTA presence
- CTA destinations
- CTA wording

Rules:
- Page content must not fight the CTA
- CTA copy must reflect page intent
- CTA logic is adjusted only after content and heroes are final

Forbidden:
- Page-local CTA improvisation
- Ad-hoc button text changes
- CTA experimentation during content phase

---

## 8. Drift Protection Rule

If a future action:
- Contradicts this file
- Requires reinterpretation
- Is “helpful but unclear”

The action is invalid.
Correct response: “Refer to INTENT_LOCKS.md”.

---

## 9. Amendment Rule

This file may only be changed if:
- The site owner explicitly requests a change
- The change is written as a diff
- The diff is approved line-by-line

No silent updates. No inferred intent.

🧠 Codex Constraints (IMPORTANT)

Tell Codex explicitly:

❌ Do not modify any existing files

❌ Do not refactor

❌ Do not normalise language

❌ Do not infer additional rules

✅ Only add this file
