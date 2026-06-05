# M28B_CHAMPAGNE_002_BOOKING_HANDOFF_FALLBACK_REPORT_V1

## Packet

M28B-CHAMPAGNE-002-BOOKING-HANDOFF-FALLBACK.

## Files changed

- `apps/web/app/components/concierge/_handoff/HandoffModal.tsx`
- `apps/web/app/components/concierge/_handoff/HandoffModal.module.css`
- `apps/web/app/components/concierge/_handoff/postbackRouter.ts`
- `apps/web/app/components/concierge/_handoff/HandoffModal.fallback-copy.test.ts`
- `reports/M28B_CHAMPAGNE_002_BOOKING_HANDOFF_FALLBACK_REPORT_V1.md`

## Public handoff surface located

- Public Captain concierge shell: `apps/web/app/components/concierge/ConciergeShell.tsx`
- Public Captain concierge layer and handoff modal entry: `apps/web/app/components/concierge/ConciergeLayer.tsx`
- Booking/contact handoff modal: `apps/web/app/components/concierge/_handoff/HandoffModal.tsx`
- Safe fallback contact surface verified: `/contact` route in `apps/web/app/contact/page.tsx`

## Exact handoff/fallback copy added or verified

Added/verified visible handoff notice copy:

- "Captain can guide you to contact or booking options, but Captain does not confirm appointments."
- "This form sends a request/handoff to the practice team only, unless a separate governed confirmed-booking flow tells you otherwise."
- "Please do not include personal health information or sensitive details."
- "For urgent dental issues, contact the practice directly."
- "Contact the practice directly"

Updated modal status/field copy:

- "Share contact details and a preferred time window for a practice team call-back."
- "Thanks — your booking request was sent to the practice team. It is not a confirmed appointment."
- "Share contact details so the team can call you back quickly; contact the practice directly for urgent dental issues."
- "Thanks — your emergency callback request was sent to the practice team."
- "Share contact details and what you are looking for without sensitive details."
- "Thanks — your new patient enquiry was sent to the practice team."
- "Reason (no personal health information or sensitive details)"
- "Brief issue summary (no personal health information or sensitive details)"
- "What are you looking for? (no sensitive details)"

Existing public-boundary wording verified in `ConciergeShell.tsx`:

- "Captain is our public concierge, not a clinician."
- "Captain cannot diagnose, triage, or provide treatment-specific clinical advice."
- "Please do not enter personal health information or sensitive details."
- "For urgent dental problems, contact the practice directly or follow emergency guidance."
- "Captain can help with general navigation, service information, and safe signposting."
- "Contact or booking handoffs send a request to the team; they do not confirm an appointment."

## Tests run

- `pnpm exec vitest run apps/web/app/components/concierge/ConciergeShell.boundary-copy.test.ts apps/web/app/components/concierge/_handoff/postbackRouter.test.ts apps/web/app/components/concierge/_handoff/HandoffModal.fallback-copy.test.ts`
- `pnpm run lint`
- `pnpm run build`
- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

## Remaining blockers

- None identified for M28B-CHAMPAGNE-002 booking/contact handoff fallback closure.
- M29 remains NOT_READY_FOR_M29; this packet does not approve launch or production certification.

## Explicit exclusions

This packet introduced no PHI storage, no memory, no model calls, no agent runtime calls, no PMS mutation, no Dentally mutation, no receptionist logic, no recall logic, and no treatment coordinator logic.

## Packet status

PASS
