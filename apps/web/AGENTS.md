# Scoped Instructions — Champagne Web Application

**Status:** `ACTIVE_SCOPED_CONSTRAINTS_NO_AUTHORITY`

Applies to `apps/web/**`. It narrows the root instructions and grants no authority.

- This is the public website, not Router, WEOS runtime, chatbot engine, patient
  portal, patient AI service, PMS or operations portal.
- Preserve page-builder, page-family, route, layout, token, content, SEO,
  accessibility, performance, analytics-privacy and approved integration
  contracts.
- Layouts, globals, routing, metadata, JSON-LD, analytics, forms, headers,
  footers and integration proxies are protected surfaces requiring exact path
  scope.
- No PHI collection, diagnosis, personalised clinical advice, autonomous
  booking/clinical action or patient-service logic.
- Do not duplicate or mutate chatbot-engine or Zone B services.
- Do not touch Sacred Hero paths without fresh exact Founder authority naming
  those paths and Hero scope.
- Preserve token-only styling and semantic surface meaning.
- Run focused application tests and the applicable root proving ladder.
- Stop on canon conflict, page-family uncertainty, clinical meaning uncertainty,
  integration drift, inaccessible behaviour or scope expansion.
