# Scoped AGENTS.md — Champagne web application

This file narrows the root Champagne `AGENTS.md` for `apps/web/**`.

## Application boundary

- This is the Champagne public website application, not the Router, WEOS runtime, Zone A chatbot engine, patient portal, patient AI service, PMS, or operations portal.
- Preserve the canonical page-builder, page-family, route, layout, token, content, SEO, accessibility, performance, analytics-privacy, and chatbot-integration contracts.
- Read the Stage 1 programme index and machine canon before planning any website, content, design, media, SEO, accessibility, performance, or chatbot-integration change.
- No stage inherits authority from another stage.
- No PHI collection, diagnosis, personalised clinical advice, autonomous booking/clinical action, or patient-service logic.
- The website may integrate through approved versioned contracts; it must not duplicate or mutate the chatbot engine or Zone B services.
- Treat layouts, globals, routing, metadata, JSON-LD, analytics, forms, headers/footers, and integration proxies as protected surfaces requiring exact scope.
- Preserve token-only styling and semantic surface meaning; visual success does not excuse canon or accessibility drift.
- Do not touch Sacred Hero files from this subtree unless the task explicitly grants the exact Hero authority required by the root and Hero-scoped instructions.
- No merge, deploy, publication, production configuration, domain/DNS, credential, or cross-repository mutation authority.

## Verification

Run focused tests/guards for the changed surface, then the applicable root proving commands. For broad application work this normally includes lint, typecheck, Champagne contract guards, SEO/launch safety where relevant, and production build.

Stop on canon conflict, page-family uncertainty, clinical meaning uncertainty, integration-contract drift, inaccessible behaviour, or scope expansion.
