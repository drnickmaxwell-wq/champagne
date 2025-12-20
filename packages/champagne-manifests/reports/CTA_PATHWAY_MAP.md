# CTA_PATHWAY_MAP.md
Version: CTA_PATHWAY_MAP.v2
Status: Canonical — phase-home-cta-lock
Owner: Managing Director (MD)
Date: 2025-12-19

## 0) Prime Directive
CTAs must resolve to **canonical runtime routes** only. `/book` is forbidden.
If a CTA target is not in this map:
- DEV/PREVIEW: fail loud (console error + guard failure where applicable)
- PROD: fail safe (fallback to `/contact`) AND emit a detectable event/log

---

## 1) Canonical CTA Targets (Allowed)
These are the approved destinations for presets and manifest-authored CTAs.

### Primary booking / contact
- `/contact` — default for consultation, questions, and calm follow-up.
- `/contact?intent=video` — remote-first inquiry without forcing portal auth.
- `/contact?intent=finance` — finance pre-qualification conversations.

### Treatments discovery
- `/treatments`
- Treatment hubs (examples — use only where the page exists):
  - `/treatments/implants`
  - `/treatments/veneers`
  - `/treatments/orthodontics`
  - `/treatments/nervous-patients`
  - `/treatments/emergency-dentistry`

### Portal / patient flows
- `/patient-portal?intent=login` — default portal entry.
- `/patient-portal?intent=video` — video consultation intent (still auth-gated).
- `/patient-portal?intent=finance` — finance / plan intent (auth-gated).
- `/patient-portal?intent=uploads` — secure uploads intent (auth-gated).

### Practice plan / education
- `/practice-plan`
- `/video-consultation` (if surfaced as education, otherwise prefer portal intent)

---

## 2) Forbidden Targets (Blocklist)
These must be removed or rewritten if found anywhere in manifests/components:
- `/book` and any derivative/legacy booking endpoints.
- Legacy preview or stub routes (e.g. `/preview/*`, `/_legacy_route_stubs/*`).
- External URLs unless explicitly approved and documented.

---

## 3) CTA Copy → Target Mapping (Canonical)
Use this mapping when generating or correcting CTAs.

### Universal CTAs
- “Book a consultation” → `/contact`
- “Plan your visit” → `/contact`
- “Ask a question” → `/contact`

### Discovery / education CTAs
- “Explore treatments” → `/treatments`
- “View treatment options” → `/treatments`
- “Nervous patient options” → `/treatments/nervous-patients`
- “Emergency dentistry” → `/treatments/emergency-dentistry`

### Portal intent CTAs (authenticated)
- “Patient portal” / “Log in” → `/patient-portal?intent=login`
- “Video consultation” → `/patient-portal?intent=video`
- “Finance options” → `/patient-portal?intent=finance`
- “Upload photos/documents” → `/patient-portal?intent=uploads`

### Remote-friendly but unauthenticated
If the visitor has not authenticated, prefer these contact intents instead of routing straight to the portal:
- “Start remotely” → `/contact?intent=video`
- “Talk through finance” → `/contact?intent=finance`

---

## 4) CTA Component Behaviour
- **Section-level CTAs:** Render exactly as provided in the manifest. Do not override or inject presets when a section already defines CTAs.
- **Presets / fallbacks:** Only apply when the manifest omits CTA groups. Presets must choose from the allowed targets above and prefer `/contact` when uncertain.
- **Accessibility:** Labels must remain readable at AA contrast with existing tokens; avoid color-only distinctions.

---

## 5) Verification Checklist
- Repo-wide `/book` grep must be clean; guards should fail if it reappears.
- Home hero and CTA blocks route to `/contact`, `/treatments`, or portal intent routes.
- Portal CTAs respect the intent query and avoid unauthenticated deep-links when that would bypass consent.

---

## 6) Phase Gates
Planned but not yet live (do not surface without explicit promotion):
- AI Smile Analysis / Smile Quiz
- Newsletter and downloads
- Blog index until editorial routes are shipped

END.
