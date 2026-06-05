# M28B_CHAMPAGNE_005_FORBIDDEN_RUNTIME_SURFACE_AUDIT_REPORT_V1

Generated: 2026-06-05

## Scope

Split packet: `M28B-CHAMPAGNE-005-FORBIDDEN-RUNTIME-SURFACE-AUDIT`.

This audit checked the champagne website repo only. It did not start M29, approve launch, approve production certification, modify any agent repo, or modify `champagne-chatbot-engine`.

## Files searched

Targeted public/runtime surfaces searched:

- `apps/web/app/api/converse/route.ts`
- `apps/web/app/api/converse/route.test.ts`
- `apps/web/app/api/handoff/_shared.ts`
- `apps/web/app/api/handoff/booking/route.ts`
- `apps/web/app/api/handoff/booking/route.test.ts`
- `apps/web/app/api/handoff/emergency-callback/route.ts`
- `apps/web/app/api/handoff/emergency-callback/route.test.ts`
- `apps/web/app/api/handoff/new-patient/route.ts`
- `apps/web/app/api/handoff/new-patient/route.test.ts`
- `apps/web/app/components/concierge/ConciergeLayer.tsx`
- `apps/web/app/components/concierge/ConciergeShell.tsx`
- `apps/web/app/components/concierge/ConciergeRoute.runtime-proof.test.ts`
- `apps/web/app/components/concierge/ConciergeShell.boundary-copy.test.ts`
- `apps/web/app/components/concierge/_helpers/converseDisplay.ts`
- `apps/web/app/components/concierge/_helpers/converseDisplay.test.ts`
- `apps/web/app/components/concierge/_helpers/sessionMemory.ts`
- `apps/web/app/components/concierge/_helpers/sessionMemory.test.ts`
- `apps/web/app/components/concierge/_handoff/HandoffModal.tsx`
- `apps/web/app/components/concierge/_handoff/HandoffModal.fallback-copy.test.ts`
- `apps/web/app/components/concierge/_handoff/postbackRouter.ts`
- `apps/web/app/components/concierge/_handoff/postbackRouter.test.ts`
- `apps/web/app/contact/page.tsx`
- `apps/web/app/champagne/hero-lab/concierge/page.tsx`
- `apps/web/app/_components/concierge/ConciergePreview.tsx`
- `apps/web/app/_components/concierge/ConciergePreview.module.css`

Broader repo scan roots searched: `apps/web/app`, `packages`, `scripts`, and `reports`.

## Search patterns used

- File locator: `rg --files apps/web/app | rg 'api/(converse|handoff)|components/concierge|contact|booking|hero-lab/concierge'`
- Forbidden runtime/public terms: `PHI|personal health information|memory|personalisation|personalization|model call|model activation|agent runtime|agent execution|PMS|Dentally|receptionist|recall|treatment coordinator|Codex|apply|dispatch|deploy|Captain.*readiness|readiness|personality|certification`
- Public concierge link/API/storage inspection: `href=|/api/|fetch\(|window\.sessionStorage|localStorage|CHATBOT_ENGINE_URL|HANDOFF_.*WEBHOOK`
- Dev bridge exposure scan: `codex|agent\s+(runtime|execution|bridge)|dev\s+(bridge|console|execution)|apply|dispatch|deploy`
- Handoff/contact safety scan: `href=|/contact|/api/handoff|resolveHandoffEndpoint|HANDOFF_.*WEBHOOK|confirmed|confirm`

## Findings

### Public concierge UI

PASS after remediation.

- Boundary copy states Captain is a public concierge, not a clinician; prohibits diagnosis, triage, treatment-specific clinical advice, and personal health information; and states handoffs do not confirm appointments.
- The UI stores only bounded session-local navigation state, intent stage, topic hints, and conversation id in `window.sessionStorage`. This is session-local UI state, not a public promise of memory/personalisation, and no PHI storage claim is rendered.
- Debug state is gated out of production (`process.env.NODE_ENV !== "production"`) and is not shown publicly in production.
- Response rendering filters forbidden user-facing text and unsafe actions before display.

### `/api/converse`

BLOCKED before remediation; PASS after remediation.

- Finding: the public API previously proxied the upstream engine JSON payload directly to the browser. That meant forbidden upstream fields or unsafe action links could become public/runtime-facing at the network response layer even if the client UI filtered visible rendering.
- Remediation: the route now normalizes successful upstream responses to safe `content`, optional `conversationId`, and safe card UI only. It drops forbidden internal metadata, forbidden text, unsafe links, unsafe postbacks, dev/Codex/deploy bridge actions, PMS/Dentally references, receptionist/recall/treatment-coordinator actions, memory/personalisation claims, PHI claims, model activation wording, and internal readiness/personality/certification wording.
- Remediation: blocked/non-OK upstream responses now return safe public wording only and do not echo internal upstream errors.
- The route still forwards to the configured chatbot engine endpoint when configured; this audit did not introduce model calls and found no direct model SDK/model-call implementation in the champagne website repo public runtime. Engine behavior remains outside this repo/packet.

### `/api/handoff/*`

PASS.

- Handoff endpoints validate narrow request schemas, use honeypot/timing/rate-limit controls, and forward to configured webhook URLs only.
- Runtime responses are canonical safe JSON such as `ok`, invalid request, rate limit, missing configuration, or failed send. They do not expose webhook bodies, Dentally/PMS internals, receptionist/recall/treatment-coordinator activation, or confirmed-booking language.
- The audit found no PMS/Dentally mutation code in these website endpoints.

### Contact/booking handoff surfaces

PASS.

- Public links remain constrained to `/contact` or governed handoff routes: `/api/handoff/booking`, `/api/handoff/emergency-callback`, and `/api/handoff/new-patient`.
- Handoff modal copy states requests are handoffs only and not confirmed appointments.
- Form labels ask for non-sensitive summaries only and warn not to include personal health information or sensitive details.

### Route/runtime proof tests

PASS.

- Existing runtime proof tests cover public concierge mounting, visible boundary copy, safe handoff routing, and absence of forbidden route/runtime strings.
- New targeted tests cover `/api/converse` response filtering and blocked upstream safe wording, plus client display fallback filtering for memory/model/PHI/readiness/internal claims.

### Broad scan false positives / future-planning only evidence

- `scripts/**` and `reports/**` contain audit/reporting/build terms such as readiness, launch disclaimers, PHI guard names, and route QA. These are not public runtime UI/API surfaces.
- `packages/champagne-manifests/data/seo-ai-answer-foundation/**` and SEO/local identity data include public content terms such as hygiene/recall as service content. This is public informational content/future planning data, not receptionist/recall activation or PMS mutation.
- Hero/debug and canon files include generic `apply` function names or canon references. These are not dev/Codex/apply/dispatch/deploy execution bridges exposed by the concierge or handoff runtime.

## Verdict

PASS after narrow remediation.

## Forbidden public/runtime surface status

- PHI collection/storage in public concierge: no forbidden PHI collection/storage found. Public copy warns users not to submit PHI/sensitive details.
- Memory/personalisation claims: no public claim after remediation; response filters block memory/personalisation wording.
- Model call activation exposed to public route: no direct public model SDK/model-call implementation found in the champagne website repo; `/api/converse` remains a configured engine proxy but now filters public responses.
- Agent runtime execution: not found in public concierge, `/api/converse`, `/api/handoff`, contact, or booking handoff runtime surfaces.
- PMS/Dentally mutation: not found in website runtime surfaces.
- Receptionist activation: not found.
- Recall activation: not found; broad references are public SEO/service content or blocked test fixtures only.
- Treatment coordinator activation: not found.
- Dev/Codex/apply/dispatch/deploy bridge exposure: not found in public concierge/handoff runtime; unsafe action links are filtered by `/api/converse` and client display normalization.
- Internal Captain readiness/personality/certification metadata rendered publicly: blocked at `/api/converse` and client display normalization after remediation.

## Public/runtime-facing vs future/planning evidence

- Public/runtime-facing evidence before remediation: `/api/converse` could echo arbitrary upstream JSON to the browser.
- Public/runtime-facing evidence after remediation: successful responses render only safe user-facing content/actions; blocked responses return safe wording only; unsafe actions/metadata are filtered or absent.
- Future/planning-only evidence: broad scan matches in `reports/**`, `scripts/**`, and SEO/canon packages are audit/build/SEO content and not public concierge/handoff runtime activation.

## Tests run

- `pnpm exec vitest run apps/web/app/api/converse/route.test.ts apps/web/app/api/handoff/booking/route.test.ts apps/web/app/api/handoff/new-patient/route.test.ts apps/web/app/api/handoff/emergency-callback/route.test.ts apps/web/app/components/concierge/_helpers/converseDisplay.test.ts apps/web/app/components/concierge/_handoff/postbackRouter.test.ts apps/web/app/components/concierge/_handoff/HandoffModal.fallback-copy.test.ts apps/web/app/components/concierge/ConciergeShell.boundary-copy.test.ts apps/web/app/components/concierge/ConciergeRoute.runtime-proof.test.ts`
- `pnpm run lint`
- `pnpm run build`
- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

## Explicit packet constraints statement

No M29 was started. No launch approval was made. No production certification was made.

This packet introduced no PHI, no memory, no model calls, no agent runtime calls, no PMS/Dentally mutation, no receptionist logic, no recall logic, no treatment coordinator logic, no dev/Codex/apply/dispatch/deploy bridge, and no public internal Captain readiness/personality/certification metadata.
