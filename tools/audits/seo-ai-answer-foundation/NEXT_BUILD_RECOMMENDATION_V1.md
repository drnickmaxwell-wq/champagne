# NEXT_BUILD_RECOMMENDATION_V1

## Recommended next mission

Run **SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1**.

## Why

The foundation now exists, but it is intentionally only partially populated. The highest-value next step is a clinician-reviewed, priority-service answer packet that maps each approved priority service to one short direct answer, one expanded answer, a small FAQ set, and approved treatment facts where source evidence exists.

## Guardrails

- Do not perform mass page rewrites.
- Do not change visual design.
- Do not mutate chatbot runtime behaviour.
- Do not invent clinical, fee, duration, recovery or finance claims.
- Preserve the approved-facts evidence chain for every answer.

## Build order

1. Fill missing AI answer entries for approved priority services.
2. Add clinician-reviewed treatment facts only where evidence exists.
3. Map each priority question to an approved answer.
4. Extend zero-click QA to verify FAQPage and voice-readiness eligibility.
5. Only then consider schema consumption for entries with approved_for_schema set to true.
