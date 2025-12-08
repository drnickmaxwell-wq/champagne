[SEO_Validation_Checklist.md](https://github.com/user-attachments/files/23473481/SEO_Validation_Checklist.md)
# SEO_Validation_Checklist.md

## Guard & Quality Gates
- [ ] JSON‑LD validates in Google’s Rich Results Test for each route (Service, HowTo, FAQPage).  
- [ ] Minimal required properties match the schema map (`name`, `description`, `areaServed`, `provider`, `offers` for Service; `name` + `step` for HowTo; `mainEntity` for FAQPage).  
- [ ] No rogue hex values in any code samples; use brand token names only where styles are referenced (e.g., `var(--brand-magenta)`, `var(--smh-gradient)`).  
- [ ] Injection points align with route section IDs: hero → Service, how‑it‑works → HowTo, faq/faqs → FAQPage.  
- [ ] BreadcrumbList present at layout level if enabled by the site shell.

## Accessibility & Performance
- [ ] Speakable headings enabled for cost and duration FAQs on treatment pages.  
- [ ] PRM (prefers‑reduced‑motion) disables 3D auto‑orbit and heavy motion in HowTo sections.  
- [ ] Images/GIFs for steps include alt text and fixed dimensions to avoid CLS.  
- [ ] LCP assets preloaded on hub and leaf pages; 3D viewer hydrates idle.

## Tracking & Analytics
- [ ] Fire key events per schema‑map tracking: `cta_book`, `finance.open`, `faq_expand`, `model.interact`.  
- [ ] Consent gate respected before analytics load; events queued until consent.

## Content Consistency
- [ ] Copy on page matches “answer‑first” blocks; avoid jargon and keep benefits high on the page.  
- [ ] Finance wording mirrors Tabeo integration; no guaranteed‑outcome claims.  
- [ ] Last‑reviewed date and reviewer (clinician) stamped on clinical pages.
