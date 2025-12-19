# CTA_PATHWAY_MAP.md
Version: CTA_PATHWAY_MAP.v1
Status: CANONICAL (Phase: Homepage Logic → Portal CTA Wiring)
Owner: Managing Director (MD)
Date: 2025-12-19

## 0) Prime Directive
CTAs must resolve to **canonical runtime routes** only.
**No CTA may target legacy/unknown routes** (e.g. `/book`) unless explicitly defined in this map.

If a CTA target is not in this map:
- DEV/PREVIEW: fail loud (console error + heroDebug receipt if applicable)
- PROD: fail safe (fallback to `/contact`) AND emit detectable event/log

---

## 1) Canonical CTA Targets (Allowed)
These are the **only** CTA href targets allowed by default.

### Primary booking / contact
- `/contact`  
  Use for: “Book a consultation”, “Speak to the team”, “Request a call back”, “Ask a question”.

### Treatments discovery
- `/treatments`  
  Use for: “Explore treatments”, “See all options”, “Browse services”.

### Treatment hubs (examples – only if pages exist)
- `/treatments/implants`
- `/treatments/whitening`
- `/treatments/composite-bonding`
- `/treatments/veneers`
- `/treatments/nervous-patients`
- `/treatments/emergency-dentistry`

### Authority / assessment pages (only if present)
- `/treatments/dental-check-ups-oral-cancer-screening`
- `/treatments/digital-smile-design` (or canonical DSD slug if different)

### Practice Plan
- `/practice-plan`

### Portal / patient flows (preferred pattern)
If the portal is not yet public, these can temporarily redirect to `/contact` with intent text.

- `/portal` (or canonical portal entry route)
- `/portal?intent=video-consult`
- `/portal?intent=finance`
- `/portal?intent=uploads`
- `/portal?intent=appointments`
- `/portal?intent=treatment-plan`

**Rule:** If `/portal` is not live, use `/contact` and append intent via query:
- `/contact?intent=video-consult`
- `/contact?intent=finance`
- `/contact?intent=uploads`

---

## 2) Forbidden Targets (Blocklist)
These must be removed or rewritten if found anywhere in manifests/components:

- `/book`  ❌ (legacy / unknown route)
- `/booking` ❌ unless explicitly implemented later
- `/ai-smile-analysis` ❌ unless explicitly implemented and promoted
- `/ai-smile-quiz` ❌ unless explicitly implemented and promoted
- `/preview/*` ❌
- `/_legacy_route_stubs/*` ❌
- Any external URLs unless explicitly approved (Phase-gated)

**Enforcement rule:** Any CTA pointing to a forbidden target is a governance violation.

---

## 3) CTA Copy → Target Mapping (Canonical)
Use this mapping when generating or correcting CTAs.

### Universal CTAs
- “Book a consultation” → `/contact`
- “Call us” → `/contact` (or tel link only if allowed by component)
- “Email us” → `/contact` (or mailto only if allowed by component)
- “Ask a question” → `/contact`

### Discovery / education CTAs
- “Explore treatments” → `/treatments`
- “View treatment options” → `/treatments`
- “Learn about sedation” → `/treatments/sedation-dentistry`
- “Nervous patient options” → `/treatments/nervous-patients`

### ABC pathway (Align → Bleach → Composite)
These CTAs should appear across Aligners/Sparks/Whitening/Bonding/Veneers/Smile Makeover pages:

- “Aligners / Braces options” → `/treatments/orthodontics` (or canonical ortho slug)
- “Teeth whitening” → `/treatments/whitening`
- “Composite bonding” → `/treatments/composite-bonding`
- “Veneers” → `/treatments/veneers`
- “3D / digitally designed veneers” → `/treatments/digitally-designed-veneers` (or canonical 3D veneers slug)
- “Smile makeover” → `/treatments/smile-makeover` (if present)
- “Digital Smile Design” → `/treatments/digital-smile-design`

### Implant trust signals / conversion
- “Implant consultation” → `/treatments/implant-consultation`
- “Implant aftercare” → `/treatments/implant-aftercare`
- “Bone grafting” → `/treatments/bone-grafting`
- “Teeth in a day” → `/treatments/teeth-in-a-day` (if present)

### Portal conversion CTAs (future-proof SaaS)
- “Video consultation” → `/portal?intent=video-consult`
- “Finance options” → `/portal?intent=finance` (Tabeo)
- “Upload photos / documents” → `/portal?intent=uploads`
- “Manage appointments” → `/portal?intent=appointments`

---

## 4) CTA Component Types (Design Note)
This repo currently contains at least two CTA behaviours:

1) **Section-level CTAs** (manifest-provided)
   - Must render exactly what the manifest provides.
   - Must not silently substitute fallback links.

2) **Preset / fallback CTAs** (component-level defaults)
   - Only allowed if the manifest provides *no CTAs*.
   - Presets must use **only** canonical targets from Section 1.
   - Presets must never point at `/book`.

**Policy:** Prefer manifest-provided CTAs for treatment pages.

---

## 5) Verification Checklist (Before Merge)
### Repo-wide CTA grep
Search for forbidden targets:
- `/book`
- `href="/book"`
- `"to": "/book"`
- `"href": "/book"`

Expected result: **zero hits**.

### Runtime smoke test
- Home: click “Book a consultation” in hero + any CTA blocks → must go `/contact`
- Nervous Patients: “Read about sedation” → sedation page slug must resolve
- Whitening hub: CTAs must resolve to whitening subpages and/or `/treatments/composite-bonding`, `/treatments/veneers`, `/treatments/digital-smile-design` as mapped
- Portal CTAs (if not live): temporarily route to `/contact?intent=…`

---

## 6) Phase Gates (Do Not Auto-Add Yet)
These routes are planned but must not be referenced until implemented and promoted:

- AI Smile Analysis
- AI Smile Quiz
- Downloads
- Newsletter
- Blog

When promoted, this file must be version-bumped and targets moved from blocklist → allowed list.

END.
