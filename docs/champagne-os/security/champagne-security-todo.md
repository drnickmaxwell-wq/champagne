# Champagne Security TODO Checklist

> Implementation roadmap for engineers + legal review.  
> Not an exhaustive compliance list.

---

## 1. Core Web Security Headers

- [ ] Implement strict Content Security Policy (CSP) for:
  - apps/web (marketing)
  - apps/portal (patient)
  - chat-ui
- [ ] Add HTTP Strict Transport Security (HSTS) with preload-ready configuration.
- [ ] Configure Permissions-Policy (formerly Feature-Policy) to disable unnecessary browser features.
- [ ] Set X-Frame-Options / frame-ancestors to prevent clickjacking.
- [ ] Ensure X-Content-Type-Options and X-XSS-Protection style equivalents.

---

## 2. Authentication and Authorisation

- [ ] Standardise on OAuth2/OIDC with a well-maintained provider.
- [ ] Implement short-lived access tokens and refresh tokens with rotation.
- [ ] Enforce tenant-aware and clinic-aware scopes in tokens.
- [ ] Implement RBAC/ABAC as per `champagne-retention-and-access.json`.
- [ ] Add multi-factor authentication for:
  - admin
  - clinicians
- [ ] Session management:
  - secure, HttpOnly cookies
  - SameSite where appropriate
  - idle and absolute session timeouts.

---

## 3. PHI Segregation and Data Minimisation

- [ ] Physically/logically separate:
  - marketing database
  - clinical database
  - logging/audit store.
- [ ] Ensure clinical database is only reachable from apps/engine via private networking.
- [ ] Implement row-level security keyed by:
  - tenantId
  - clinicId
  - patientRecordId.
- [ ] Review all forms and inputs to minimise PHI collection on apps/web.

---

## 4. Data-at-Rest and In-Transit Encryption

- [ ] Ensure all production databases have:
  - encryption at rest enabled.
- [ ] All internal and external traffic:
  - TLS 1.2+.
- [ ] Encrypt application-level secrets at rest (e.g. KMS, secret manager).

---

## 5. AI Gateway Implementation

- [ ] Implement AI Gateway middleware in apps/engine only.
- [ ] Enforce that no front-end or other service can talk directly to AI providers.
- [ ] Implement config-driven redaction and whitelisting using:
  - `champagne-ai-gateway-config.json`.
- [ ] Integrate robust logging and mapping to `auditLogEntry`.
- [ ] Implement guardrails:
  - maximum prompt size
  - purpose-based routing
  - fail-closed behaviour when config is invalid.

---

## 6. Logging, Monitoring and Audit

- [ ] Standardise structured logging across:
  - apps/web
  - apps/portal
  - apps/engine.
- [ ] Ensure log events avoid direct PHI where possible.
- [ ] Implement dedicated `auditLogEntry` store for:
  - access to PHI
  - AI Gateway calls
  - security events.
- [ ] Integrate:
  - anomaly detection for suspicious access patterns.
- [ ] Create a dashboard for:
  - login failures
  - unusual token hotspots
  - cross-tenant anomalies.

---

## 7. DPIA, DPA and Legal

- [ ] Conduct a Data Protection Impact Assessment (DPIA) covering:
  - PHI processing
  - portal flows
  - chatbot flows
  - AI Gateway.
- [ ] Maintain Data Processing Agreements (DPAs) with:
  - hosting providers
  - LLM providers
  - email/SMS providers
  - payment providers
  - video providers.
- [ ] Document lawful bases for each:
  - data class
  - AI purpose.
- [ ] Produce and maintain:
  - privacy notices
  - cookie policies
  - consent mechanisms where required.

---

## 8. Backup, Disaster Recovery, and Business Continuity

- [ ] Define Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO).
- [ ] Implement encrypted, region-aware backups for:
  - clinical database
  - imaging assets
  - audit logs.
- [ ] Regularly test restoration procedures.
- [ ] Document business continuity plan for:
  - hosting outages
  - provider changes.

---

## 9. Secure Development Lifecycle

- [ ] Introduce secure coding guidelines aligned with stack.
- [ ] Add:
  - dependency scanning
  - SAST/DAST tools
  - container scans (if using containers).
- [ ] Enforce code review for:
  - security-sensitive changes
  - AI Gateway changes
  - auth and access control logic.
- [ ] Maintain threat models for:
  - apps/web
  - apps/portal
  - apps/engine
  - AI Gateway.

---

## 10. Multi-Tenant SaaS Hardening

- [ ] Implement strict tenant isolation:
  - at auth
  - at DB (row-level)
  - at logging and analytics.
- [ ] Ensure admin tooling is:
  - tenant-scoped by default.
- [ ] Add tests to confirm:
  - cross-tenant access is impossible.
- [ ] Document onboarding/offboarding procedures for clinics.

---

## 11. User Rights and Data Subject Requests

- [ ] Implement mechanisms for:
  - access
  - rectification
  - erasure (where possible)
  - restriction
  - data portability.
- [ ] Ensure system can:
  - locate all records linked to a patientRecordId.
- [ ] Implement processes for:
  - identity verification before fulfilling requests.

---
