# Security Policy

## Supported Status

This repository is under active development. Security vulnerability reports are accepted. The codebase is at a foundational security posture — it has not undergone external penetration testing and makes no certification claim.

## Reporting a Vulnerability

**Do not open a public GitHub issue to report a security vulnerability.**

Report vulnerabilities privately using GitHub's built-in private security advisory mechanism:

1. Go to the **Security** tab of this repository on GitHub.
2. Click **"Report a vulnerability"**.
3. Provide a clear description, reproduction steps, and your assessment of impact.

We aim to acknowledge reports within **5 business days** and to provide a resolution timeline within **14 business days** of acknowledgement.

## What Must Not Appear in Reports or Issues

Do not include any of the following in GitHub issues, pull requests, security advisories, comments, or any other GitHub-hosted content:

- PHI (Protected Health Information) of any kind
- Patient-identifiable data
- Secrets, API keys, tokens, credentials, or environment variables
- Log files or log excerpts containing patient or user data
- Screenshots, exports, or attachments containing patient, user, or tenant data
- PMS or Dentally data of any kind
- Tenant-specific data or configuration

Redact all sensitive data before submission. Submissions containing the above may be closed without response.

## Responsible Disclosure

We ask that reporters:

- Give us reasonable time to investigate and resolve the issue before any public disclosure.
- Avoid exploiting a vulnerability beyond what is necessary to demonstrate it.
- Avoid accessing, modifying, or deleting data that does not belong to the reporter.
- Act in good faith.

We commit to responding in good faith and to crediting responsible disclosers where appropriate.

## Security Posture

The security posture of this repository is **foundational**. This means:

- Security controls are partially audited; they are not fully implemented.
- This repository has not undergone external penetration testing.
- Compliance controls are not implemented.
- No certification (ISO 27001, SOC 2, or equivalent) is claimed.

This document is a security disclosure policy, not a security certification.

## Blocked Scopes

The following scopes remain blocked until separate, explicit, human-approved gates are opened:

- PHI processing of any kind
- Patient-identifiable data handling
- PMS / Dentally integration
- Tenant SaaS production execution

## Non-Claims

The following are explicitly **not** claimed for this repository:

- PHI readiness
- GDPR readiness
- DPIA completion
- Legal sign-off
- External penetration test completion

These items each require a separate, explicit, human-approved gated mission before any claim can be made.
