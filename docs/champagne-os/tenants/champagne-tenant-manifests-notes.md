# Champagne Tenant → Manifest Linking Notes

This document explains how tenants map to manifests and how overrides work,
compatible with:

- `@champagne/canon`
- `@champagne-manifests`
- `@champagne-3d`
- `@champagne-ai`

No PHI is stored in these manifests; they describe structure, content slots,
and assets – not individual patients.

---

## 1. Directory Structure

Core idea: **global → vertical → tenant → environment**.

Suggested structure inside the monorepo:

```text
/manifests/
  core/
    pages/
      home.json
      about.json
      contact.json
    treatments/
      veneers.json
      implants.json
      aligners.json
    components/
      hero-default.json
      cta-primary.json
  verticals/
    cosmetic/
      treatments/
        veneers.json
        whitening.json
    implant-centre/
      treatments/
        full-arch.json
  tenants/
    smh/
      pages/
        home.json
        veneers.json
        implants.json
      treatments/
        veneers.json
        implants.json
        smile-makeover.json
      3d/
        veneers-hero.json
        implant-exploded.json
      ai/
        concierge-flows.json
        persona-matrix.json
    demo.cosmetic-uk/
      pages/
        home.json
      treatments/
        veneers.json
    demo.implant-centre-eu/
      pages/
        home.json
        implants.json
      treatments/
        implants.json
        full-arch.json
