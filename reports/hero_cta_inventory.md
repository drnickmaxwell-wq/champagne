# Hero + CTA Inventory

Sources:
- packages/champagne-manifests/data/champagne_machine_manifest_full.json
- packages/champagne-cta/src/CTARegistry.ts
- packages/champagne-sections/src/treatmentMidCtaPlan.ts
- packages/champagne-sections/src/treatmentClosingCtaPlan.ts
- packages/champagne-manifests/data/sections/smh/*.json

## /

### HERO
- Headline: Home
- Subhead: What to expect from home.
- Primary CTA: Book a consultation (/contact)
  - Source: packages/champagne-cta/src/CTARegistry.ts -> registry.book-consultation
  - Engine: CTARegistry
- Secondary CTA: Explore treatments (/treatments)
  - Source: packages/champagne-cta/src/CTARegistry.ts -> registry.view-treatments
  - Engine: CTARegistry
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> home.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan your visit
  - Body: Book a calm consultation or explore treatment pathways.
  - Button: Book a consultation (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> home.sections[21].ctas[0]
  - Engine: page manifest section ctas
- Section: Plan your visit
  - Body: Book a calm consultation or explore treatment pathways.
  - Button: Explore treatments (/treatments)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> home.sections[21].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: / (hash: 13985fb364f90f1b5aa7b6189ea73ac9c946da2c)
- same-CTAs-as-other-pages: / (hash: dcf9d7c01710d530a9da3e37fd8793a29f731522)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /about

### HERO
- Headline: About
- Subhead: What to expect from about.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> about.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /about (hash: fb85233420466bdbcddc84aed7efb3097955a566)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /blog

### HERO
- Headline: Blog
- Subhead: What to expect from blog.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> blog.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /blog (hash: 23360b0dd4d8910651f79668320fcd87b2cea85b)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /contact

### HERO
- Headline: Contact
- Subhead: What to expect from contact.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> contact.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Need urgent help?
  - Body: For pain, swelling, trauma, or accidents, follow the emergency pathway or contact the team for next steps.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> contact.sections[5].ctas[0]
  - Engine: page manifest section ctas
- Section: Need urgent help?
  - Body: For pain, swelling, trauma, or accidents, follow the emergency pathway or contact the team for next steps.
  - Button: Contact the practice (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> contact.sections[5].ctas[1]
  - Engine: page manifest section ctas
- Section: Plan a visit
  - Button: Request a call back (/patient-portal)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> contact.sections[6].ctas[0]
  - Engine: page manifest section ctas
- Section: Plan a visit
  - Button: Message the team (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> contact.sections[6].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /contact (hash: 5933c8f3a5f4e17513fcd0f23db534d695bb89e4)
- same-CTAs-as-other-pages: /contact (hash: 96c8c0dfd626bea0256d1e2963df4d5bb8019067)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /dental-checkups-oral-cancer-screening

### HERO
- Headline: Dental Check-Ups & Oral Cancer Screening
- Subhead: What to expect from dental check-ups & oral cancer screening.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Stay on track between check-ups
  - Body: Keep hygiene, preventative care, and family visits on a steady rhythm.
  - Button: Hygiene and gum care (/treatments/periodontal-gum-care)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[6].ctas[0]
  - Engine: page manifest section ctas
- Section: Stay on track between check-ups
  - Body: Keep hygiene, preventative care, and family visits on a steady rhythm.
  - Button: Preventative & general dentistry (/treatments/preventative-and-general-dentistry)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[6].ctas[1]
  - Engine: page manifest section ctas
- Section: Stay on track between check-ups
  - Body: Keep hygiene, preventative care, and family visits on a steady rhythm.
  - Button: Children’s dental care (/treatments/childrens-dentistry)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[6].ctas[2]
  - Engine: page manifest section ctas
- Section: Stay on track between check-ups
  - Body: Keep hygiene, preventative care, and family visits on a steady rhythm.
  - Button: Senior smile care (/treatments/senior-mature-smile-care)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[6].ctas[3]
  - Engine: page manifest section ctas
- Section: Arrange your routine dental check-up
  - Body: Book a calm examination with oral cancer screening included. Tell us if you would like a slower pace or extra reassurance.
  - Button: Arrange a routine check-up (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[8].ctas[0]
  - Engine: page manifest section ctas
- Section: Arrange your routine dental check-up
  - Body: Book a calm examination with oral cancer screening included. Tell us if you would like a slower pace or extra reassurance.
  - Button: Support for anxious visitors (/treatments/nervous-patients)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening.sections[8].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /dental-checkups-oral-cancer-screening, /treatments/dental-checkups-oral-cancer-screening (hash: ff14e1bb693bf9354ddde5c478316cbd7ecc1148)
- same-CTAs-as-other-pages: /dental-checkups-oral-cancer-screening, /treatments/dental-checkups-oral-cancer-screening (hash: 8757a52f23037e63b155a988aaef2ee1b23a9bc8)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /downloads

### HERO
- Headline: Downloads
- Subhead: What to expect from downloads.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> downloads.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Questions about your aftercare?
  - Button: Contact the practice (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> downloads.sections[1].ctas[0]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /downloads (hash: 20e8e279dfe9de66968f9a51e346996323cca260)
- same-CTAs-as-other-pages: /downloads, /newsletter (hash: 12a1a6fdd66cc1d6bb60f10122a0837d0e61d879)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /fees

### HERO
- Headline: Fees
- Subhead: What to expect from fees.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> fees.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /fees (hash: d721b932d2ad12db3485caa9ba3375d9e922e59f)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /finance

### HERO
- Headline: Finance
- Subhead: What to expect from finance.
- Primary CTA: Review finance options (/patient-portal?intent=finance)
  - Source: packages/champagne-cta/src/CTARegistry.ts -> registry.portal-finance
  - Engine: CTARegistry
- Secondary CTA: Implant treatment information (/treatments/implants)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> finance.ctas.heroCTAs[1]
  - Engine: manifest inline
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> finance.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Discuss finance with the team
  - Button: Review finance options (/patient-portal?intent=finance)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> finance.sections[5].ctas[0]
  - Engine: CTARegistry
- Section: Discuss finance with the team
  - Button: See fees and pricing guidance (/fees)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> finance.sections[5].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /finance (hash: 84627a26375ba2a5572189233a8b7d1d3121179d)
- same-CTAs-as-other-pages: /finance (hash: 69376ac6c9db25bc8c03b0de010e99414090e6f7)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /legal/accessibility

### HERO
- Headline: Accessibility
- Subhead: What to expect from accessibility.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> accessibility.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /legal/accessibility (hash: f6408da2f5259604f25fc2b7ba370694139561e3)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /legal/complaints

### HERO
- Headline: Complaints
- Subhead: What to expect from complaints.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> complaints.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /legal/complaints (hash: 5546a722905dac3215fad4784fe8ea501e43729b)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /legal/cookies

### HERO
- Headline: Cookies
- Subhead: What to expect from cookies.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> cookies.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /legal/cookies (hash: f292b5f7c0dbea23f1115585f88c68fa08cc253a)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /legal/privacy

### HERO
- Headline: Privacy Policy
- Subhead: What to expect from privacy policy.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> privacy.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /legal/privacy (hash: d628a9ce160cf085bf5ff59728323857d5fed249)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /legal/terms

### HERO
- Headline: Website terms
- Subhead: What to expect from website terms.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> terms.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /legal/terms (hash: 8cdd0bda9351e8ab352c96971fb31a3a5b4b93f2)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /newsletter

### HERO
- Headline: Newsletter
- Subhead: What to expect from newsletter.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> newsletter.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Contact the practice
  - Button: Contact the practice (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> newsletter.sections[1].ctas[0]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /newsletter (hash: bc11a1db4022e007cfba283b572d6336b6c80863)
- same-CTAs-as-other-pages: /downloads, /newsletter (hash: 12a1a6fdd66cc1d6bb60f10122a0837d0e61d879)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /patient-portal

### HERO
- Headline: Patient portal
- Subhead: What to expect from patient portal.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> patient_portal.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Check back soon
  - Button: Patient portal (/patient-portal?intent=login)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> patient_portal.sections[2].ctas[0]
  - Engine: CTARegistry
- Section: Check back soon
  - Button: Upload documents securely (/patient-portal?intent=upload)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> patient_portal.sections[2].ctas[1]
  - Engine: CTARegistry
- Section: Check back soon
  - Button: Contact the team (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> patient_portal.sections[2].ctas[2]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /patient-portal (hash: e3100d7de11cc219e54485164f0f0029a46419a1)
- same-CTAs-as-other-pages: /patient-portal (hash: 4b857488840e918b80bcf03f8e84d73b2ca01b4f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /practice-plan

### HERO
- Headline: Practice Plan
- Subhead: What to expect from practice plan.
- Primary CTA: Ask about Practice Plan (/contact?topic=practice-plan)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> practice_plan.ctas.heroCTAs[0]
  - Engine: manifest inline
- Secondary CTA: What’s included in a check-up? (/dental-checkups-oral-cancer-screening)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> practice_plan.ctas.heroCTAs[1]
  - Engine: manifest inline
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> practice_plan.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Ask about joining
  - Button: Ask about Practice Plan (/contact?topic=practice-plan)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> practice_plan.sections[4].ctas[0]
  - Engine: page manifest section ctas
- Section: Ask about joining
  - Button: What’s included in a check-up? (/dental-checkups-oral-cancer-screening)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> practice_plan.sections[4].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /practice-plan (hash: 4e4cac7d6af7a7f945f45092062e2c7214b3d544)
- same-CTAs-as-other-pages: /practice-plan (hash: c209648c59690b8684fcc5a6016a06de2592ddc7)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /smile-gallery

### HERO
- Headline: Smile gallery
- Subhead: What to expect from smile gallery.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> smile_gallery.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /smile-gallery (hash: 6b69919fa8f1d24b1c34a4d7503d6c6d0f16b30d)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /team

### HERO
- Headline: Team
- Subhead: What to expect from team.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Connect with the team
  - Button: Plan a visit (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team.sections[4].ctas[0]
  - Engine: page manifest section ctas
- Section: Connect with the team
  - Button: Patient portal (/patient-portal)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team.sections[4].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /team (hash: 3ffe851a24fc7f88904a236d22d6db61a6f9810f)
- same-CTAs-as-other-pages: /team, /team/nick-maxwell, /team/sara-burden, /team/sylvia-krafft (hash: b255bff6d4b3799f3dfb9ff4436da5657354edb6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /team/nick-maxwell

### HERO
- Headline: Dr Nick Maxwell
- Subhead: What to expect from dr nick maxwell.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_nick_maxwell.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Connect with the team
  - Button: Plan a visit (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_nick_maxwell.sections[5].ctas[0]
  - Engine: page manifest section ctas
- Section: Connect with the team
  - Button: Patient portal (/patient-portal)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_nick_maxwell.sections[5].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /team/nick-maxwell (hash: 3e51578ad447e74322dc91f12905c076fea7b1c0)
- same-CTAs-as-other-pages: /team, /team/nick-maxwell, /team/sara-burden, /team/sylvia-krafft (hash: b255bff6d4b3799f3dfb9ff4436da5657354edb6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /team/sara-burden

### HERO
- Headline: Sara Burden
- Subhead: What to expect from sara burden.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sara_burden.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Connect with the team
  - Button: Plan a visit (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sara_burden.sections[5].ctas[0]
  - Engine: page manifest section ctas
- Section: Connect with the team
  - Button: Patient portal (/patient-portal)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sara_burden.sections[5].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /team/sara-burden (hash: 08685d41458a52ff8cb9e9cddfe35fe6faffa5b1)
- same-CTAs-as-other-pages: /team, /team/nick-maxwell, /team/sara-burden, /team/sylvia-krafft (hash: b255bff6d4b3799f3dfb9ff4436da5657354edb6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /team/sylvia-krafft

### HERO
- Headline: Dr Sylvia Krafft
- Subhead: What to expect from dr sylvia krafft.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sylvia_krafft.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Connect with the team
  - Button: Plan a visit (/contact)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sylvia_krafft.sections[5].ctas[0]
  - Engine: page manifest section ctas
- Section: Connect with the team
  - Button: Patient portal (/patient-portal)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> team_sylvia_krafft.sections[5].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /team/sylvia-krafft (hash: 90509ce1829594b515db9a491f79827e3180f7ce)
- same-CTAs-as-other-pages: /team, /team/nick-maxwell, /team/sara-burden, /team/sylvia-krafft (hash: b255bff6d4b3799f3dfb9ff4436da5657354edb6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /technology

### HERO
- Headline: Technology
- Subhead: What to expect from technology.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> technology_hub.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /technology (hash: f0114156bef7f0eefa62f280cbf4dca87be1af07)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments

### HERO
- Headline: Treatments hub
- Subhead: What to expect from treatments hub.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> treatments_hub.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /treatments (hash: 86809cc858ddc56a8ddd8ddc14fa55cde274a5ac)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-dentistry-and-technology

### HERO
- Headline: 3D dentistry & technology
- Subhead: What to expect from 3d dentistry & technology.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> 3d_dentistry_and_technology.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: See your options digitally before you commit
  - Body: Book a calm digital consultation or ask about 3D printed options tailored to your case.
  - Button: Plan a clinician-led 3d dentistry and technology review (/treatments/3d-dentistry-and-technology)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-dentistry-and-technology.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: See your options digitally before you commit
  - Body: Book a calm digital consultation or ask about 3D printed options tailored to your case.
  - Button: Consider alternatives like CBCT scanning (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-dentistry-and-technology.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/3d-dentistry-and-technology (hash: 56c223663dead840651a0d9107b55f169d6595cd)
- same-CTAs-as-other-pages: /treatments/3d-dentistry-and-technology (hash: d188e225900867903452dfe67683e917145c8b7f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-digital-dentistry

### HERO
- Headline: 3D & digital dentistry
- Subhead: What to expect from 3d & digital dentistry.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> technology_digital_dentistry.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: See your options digitally before you commit
  - Body: Book a calm digital consultation or ask about 3D printed options tailored to your case.
  - Button: Plan a clinician-led 3d digital dentistry review (/treatments/3d-digital-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-digital-dentistry.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: See your options digitally before you commit
  - Body: Book a calm digital consultation or ask about 3D printed options tailored to your case.
  - Button: Consider alternatives like CBCT scanning (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-digital-dentistry.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/3d-digital-dentistry (hash: b17c69e27bd82db359c4c803efd83f8a192745ec)
- same-CTAs-as-other-pages: /treatments/3d-digital-dentistry (hash: 59ff23bf8b52c92e9071395a73131fa5d9422066)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-implant-restorations

### HERO
- Headline: 3D implant restorations
- Subhead: What to expect from 3d implant restorations.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> 3d_implant_restorations.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan your implant restoration with clarity
  - Body: Book a consultation to review digital designs, material choices, and whether in-house or lab-made options high standards suit your long-term goals.
  - Button: Plan a clinician-led 3d implant restorations review (/treatments/3d-implant-restorations)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-implant-restorations.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan your implant restoration with clarity
  - Body: Book a consultation to review digital designs, material choices, and whether in-house or lab-made options high standards suit your long-term goals.
  - Button: Consider alternatives like Hygiene and maintenance (/treatments/implant-aftercare)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-implant-restorations.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/3d-implant-restorations (hash: f070feb740e2a98d0fb069cd0f51ef3a5beb4f01)
- same-CTAs-as-other-pages: /treatments/3d-implant-restorations (hash: 08f751265226618e00fcfe1f75d2cfd475edbee3)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-printed-dentures

### HERO
- Headline: 3D printed dentures
- Subhead: What to expect from 3d printed dentures.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> printed_dentures_3d.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan digital dentures with clinician oversight
  - Body: Book a consultation to see how digital scanning and in-house printing could support a comfortable, stable denture fit.
  - Button: Plan a clinician-led 3d printed dentures review (/treatments/3d-printed-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printed-dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan digital dentures with clinician oversight
  - Body: Book a consultation to see how digital scanning and in-house printing could support a comfortable, stable denture fit.
  - Button: Consider alternatives like Implant-retained dentures (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printed-dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/3d-printed-dentures (hash: 239786cfaefa5cef7f84b9264c1643c4d261ac24)
- same-CTAs-as-other-pages: /treatments/3d-printed-dentures (hash: 98bfaecd2683cd5953bc5fe652fbe35b5a7e124b)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-printed-veneers

### HERO
- Headline: 3D printed veneers
- Subhead: What to expect from 3d printed veneers.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> 3d_printed_veneers.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Veneer Consultation & Smile Design
  - Body: If you’re considering printed resin veneer restorations, we’ll start with a calm, clinician-led assessment and digital preview. We’ll talk you through suitability, alternatives (including ceramic veneers), and how to keep results looking natural and stable over time.
  - Button: Plan your consultation (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printed-veneers.json -> sections[13].ctas[0]
  - Engine: section manifest ctas
- Section: Veneer Consultation & Smile Design
  - Body: If you’re considering printed resin veneer restorations, we’ll start with a calm, clinician-led assessment and digital preview. We’ll talk you through suitability, alternatives (including ceramic veneers), and how to keep results looking natural and stable over time.
  - Button: Explore digital smile design (/treatments/digital-smile-design)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printed-veneers.json -> sections[13].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/3d-printed-veneers (hash: a128a59de24325d43fe3a65f3dd65f46b792ab5e)
- same-CTAs-as-other-pages: /treatments/3d-printed-veneers (hash: 84e85fb726b7efa95aa2c6833df4ee50d3f93e98)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/3d-printing-lab

### HERO
- Headline: 3D printing lab
- Subhead: What to expect from 3d printing lab.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> 3d_printing_lab.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: See what our 3D printing lab can make for you
  - Body: Book a digital consultation to review whether in-house printing, provisional work, or lab ceramics will high standards support your treatment.
  - Button: Plan a clinician-led 3d printing lab review (/treatments/3d-printing-lab)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printing-lab.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: See what our 3D printing lab can make for you
  - Body: Book a digital consultation to review whether in-house printing, provisional work, or lab ceramics will high standards support your treatment.
  - Button: Consider alternatives like 3D printed dentures (/treatments/3d-printed-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.3d-printing-lab.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/3d-printing-lab (hash: e28814643f4677cd2b44ad2261a144c520d2204f)
- same-CTAs-as-other-pages: /treatments/3d-printing-lab (hash: 39db008d0b549071a30f57d8c376bd3254a848ac)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/acrylic-dentures

### HERO
- Headline: Acrylic dentures
- Subhead: What to expect from acrylic dentures.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> acrylic_dentures.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan comfortable acrylic dentures
  - Body: Book a consultation to shape your acrylic dentures with clear expectations on fit, maintenance, and future stabilisation options.
  - Button: Plan a clinician-led acrylic dentures review (/treatments/acrylic-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.acrylic-dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan comfortable acrylic dentures
  - Body: Book a consultation to shape your acrylic dentures with clear expectations on fit, maintenance, and future stabilisation options.
  - Button: Consider alternatives like implant retained dentures (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.acrylic-dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/acrylic-dentures (hash: d0f43c6622476a03a8b7a0479891d621cc9eaac6)
- same-CTAs-as-other-pages: /treatments/acrylic-dentures (hash: 96176f4d0f5710f9f1522a9a7b9f7093b032d11f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/anti-wrinkle-treatments

### HERO
- Headline: Anti-wrinkle treatments
- Subhead: What to expect from anti-wrinkle treatments.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> anti_wrinkle_treatments.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial therapeutics consultation
  - Body: Explore whether prescription anti-wrinkle treatment is right for you with a prescriber who favours careful dosing and clear follow-up.
  - Button: Plan a clinician-led anti wrinkle treatments review (/treatments/anti-wrinkle-treatments)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.anti-wrinkle-treatments.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial therapeutics consultation
  - Body: Explore whether prescription anti-wrinkle treatment is right for you with a prescriber who favours careful dosing and clear follow-up.
  - Button: Consider alternatives like Skin boosters (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.anti-wrinkle-treatments.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/anti-wrinkle-treatments (hash: 0bbbe91dc5bf8e8824cf152f93c589a1e1421a7e)
- same-CTAs-as-other-pages: /treatments/anti-wrinkle-treatments (hash: ec2eb01d48022feb33252a4c8c6283d31cca7d36)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/broken-chipped-cracked-teeth

### HERO
- Headline: Broken, chipped or cracked teeth
- Subhead: What to expect from broken, chipped or cracked teeth.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_broken_chipped_teeth.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book care for a chipped or cracked tooth
  - Body: We will protect the tooth, relieve sensitivity, and plan the right repair.
  - Button: Call for an emergency visit (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.broken-chipped-cracked-teeth.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Book care for a chipped or cracked tooth
  - Body: We will protect the tooth, relieve sensitivity, and plan the right repair.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.broken-chipped-cracked-teeth.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/broken-chipped-cracked-teeth (hash: bc9c7fca0974dbfdafd960e66e5908e2f65b4983)
- same-CTAs-as-other-pages: /treatments/broken-chipped-cracked-teeth (hash: 1c5de9aa9dcdbc928329e115a1d26fe55b7aa0ff)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/bruxism-and-jaw-clenching

### HERO
- Headline: Bruxism (grinding) and jaw clenching
- Subhead: What to expect from bruxism (grinding) and jaw clenching.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> bruxism_jaw_clenching.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a bruxism assessment
  - Body: Discuss clenching, tooth wear, and jaw tension with a clinician who prioritises conservative care and safety.
  - Button: Plan a clinician-led bruxism and jaw clenching review (/treatments/bruxism-and-jaw-clenching)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.bruxism-and-jaw-clenching.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a bruxism assessment
  - Body: Discuss clenching, tooth wear, and jaw tension with a clinician who prioritises conservative care and safety.
  - Button: Consider alternatives like TMJ treatment pathways (/treatments/tmj-disorder-treatment)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.bruxism-and-jaw-clenching.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/bruxism-and-jaw-clenching (hash: 1ec8f8a803ca48af2e8daa2f62bf1d6503081edf)
- same-CTAs-as-other-pages: /treatments/bruxism-and-jaw-clenching (hash: 8a5e52f0a2f294d16ad156449c1f93a6a5464063)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/cbct-3d-scanning

### HERO
- Headline: CBCT / 3D scanning
- Subhead: What to expect from cbct / 3d scanning.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> cbct_3d_scanning.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a 3D scan with clinician guidance
  - Body: Contact us if you’d like to discuss whether 3D scanning is appropriate for you.
  - Button: Plan a clinician-led cbct 3d scanning review (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.cbct-3d-scanning.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a 3D scan with clinician guidance
  - Body: Contact us if you’d like to discuss whether 3D scanning is appropriate for you.
  - Button: Consider alternatives like implants (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.cbct-3d-scanning.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/cbct-3d-scanning (hash: a90247dbf61b3b65301ed5f260f7cad8e6c7d8c8)
- same-CTAs-as-other-pages: /treatments/cbct-3d-scanning (hash: df68efdecb53b1f026fa8db8dd6b2c2982ef0a56)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/childrens-dentistry

### HERO
- Headline: Children’s dentistry
- Subhead: What to expect from children’s dentistry.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> childrens_dentistry.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Plan a clinician-led childrens dentistry review (/treatments/childrens-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Consider alternatives like Orthodontic monitoring (/treatments/orthodontics)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Plan next steps with Family check-ups (/treatments/preventative-and-general-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[2]
  - Engine: section manifest ctas
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Plan next steps with emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[3]
  - Engine: section manifest ctas
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Plan next steps with Nervous patient care (/treatments/nervous-patients)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[4]
  - Engine: section manifest ctas
- Section: Book a gentle check-up for your child
  - Body: We’ll keep things calm, answer your questions, and map out a prevention plan that fits family life.
  - Button: Plan next steps with fixed braces (/treatments/fixed-braces)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json -> sections[10].ctas[5]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/childrens-dentistry (hash: 71a3dc97cfc8a92968427abfdf33c8caca55cd11)
- same-CTAs-as-other-pages: /treatments/childrens-dentistry (hash: e4042dba6c04554a89ae776ff1a3f5256ac9f128)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/chrome-dentures

### HERO
- Headline: Chrome dentures
- Subhead: What to expect from chrome dentures.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> chrome_dentures.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan slim, steady chrome dentures
  - Body: Book a consultation to design a chrome framework that balances strength, discretion, and fit. If you later want added stability, we can discuss implant-retained options gently.
  - Button: Plan a clinician-led chrome dentures review (/treatments/chrome-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.chrome-dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan slim, steady chrome dentures
  - Body: Book a consultation to design a chrome framework that balances strength, discretion, and fit. If you later want added stability, we can discuss implant-retained options gently.
  - Button: Consider alternatives like implant retained dentures (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.chrome-dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/chrome-dentures (hash: 8fb1780a7411bf562e9e0a74adc266596dee9321)
- same-CTAs-as-other-pages: /treatments/chrome-dentures (hash: 80126a41aae65d6cc2c7c66f3d0de73ef2ce4a11)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/clear-aligners

### HERO
- Headline: Clear Aligners in Shoreham-by-Sea
- Subhead: Discreet, removable aligners planned digitally with regular check-ins.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> clear_aligners.label
  - subhead: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> clear_aligners.intro
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a clear aligner assessment
  - Body: Confirm suitability and map whitening and retention plans.
  - Button: Plan a clinician-led clear aligners review (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Book a clear aligner assessment
  - Body: Confirm suitability and map whitening and retention plans.
  - Button: Consider alternatives like clear aligners spark (/treatments/clear-aligners-spark)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners.json -> sections[11].ctas[1]
  - Engine: section manifest ctas
- Section: Book a clear aligner assessment
  - Body: Confirm suitability and map whitening and retention plans.
  - Button: Plan next steps with Finishing with teeth whitening (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners.json -> sections[11].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/clear-aligners (hash: 0f4fc975f79d0040faada1f5689f899e125682fe)
- same-CTAs-as-other-pages: /treatments/clear-aligners (hash: 317808c60e8acf3c0ede36b4d67243fea4f0ad90)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/clear-aligners-spark

### HERO
- Headline: Spark clear aligners in Shoreham-by-Sea
- Subhead: What to expect from spark clear aligners in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> clear_aligners_spark.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book an Orthodontic Assessment
  - Body: Meet a clinician to review your scans, plan Spark stages, and agree on monitoring, refinements, and retention before you commit.
  - Button: Discuss clear aligners before deciding (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[13].ctas[0]
  - Engine: section manifest ctas
- Section: Book an Orthodontic Assessment
  - Body: Meet a clinician to review your scans, plan Spark stages, and agree on monitoring, refinements, and retention before you commit.
  - Button: Consider alternatives like Finishing with teeth whitening (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[13].ctas[1]
  - Engine: section manifest ctas
- Section: Book an Orthodontic Assessment
  - Body: Meet a clinician to review your scans, plan Spark stages, and agree on monitoring, refinements, and retention before you commit.
  - Button: Plan next steps with Digital smile planning (/treatments/digital-smile-design)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[13].ctas[2]
  - Engine: section manifest ctas
- Section: Explore Spark aligner treatment
  - Body: Review how Spark aligners compare and what retention looks like.
  - Button: Plan a clinician-led clear aligners spark review (/treatments/clear-aligners-spark)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[16].ctas[0]
  - Engine: section manifest ctas
- Section: Explore Spark aligner treatment
  - Body: Review how Spark aligners compare and what retention looks like.
  - Button: Consider alternatives like clear aligners (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[16].ctas[1]
  - Engine: section manifest ctas
- Section: Explore Spark aligner treatment
  - Body: Review how Spark aligners compare and what retention looks like.
  - Button: Plan next steps with Digital smile planning (/treatments/digital-smile-design)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json -> sections[16].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/clear-aligners-spark (hash: 003a59e92b156d01eb15dab13559c24d36640981)
- same-CTAs-as-other-pages: /treatments/clear-aligners-spark (hash: 3455828778f6f334b58522f0ddeded31117f224a)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/composite-bonding

### HERO
- Headline: Composite bonding
- Subhead: What to expect from composite bonding.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> composite_bonding.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Related care to explore
  - Body: Discuss whether composite bonding is right for you
  - Button: Discuss whether composite bonding is right for you (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Related care to explore
  - Body: Discuss whether composite bonding is right for you
  - Button: Teeth whitening (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[8].ctas[1]
  - Engine: section manifest ctas
- Section: Related care to explore
  - Body: Discuss whether composite bonding is right for you
  - Button: Veneers (/treatments/veneers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[8].ctas[2]
  - Engine: section manifest ctas
- Section: Book a Cosmetic Assessment
  - Body: We assess your teeth, review bite forces, and explain whether composite bonding, veneers, whitening, or aligners best fit your goals.
  - Button: Cosmetic Assessment (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Book a Cosmetic Assessment
  - Body: We assess your teeth, review bite forces, and explain whether composite bonding, veneers, whitening, or aligners best fit your goals.
  - Button: Veneers (/treatments/veneers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[11].ctas[1]
  - Engine: section manifest ctas
- Section: Book a Cosmetic Assessment
  - Body: We assess your teeth, review bite forces, and explain whether composite bonding, veneers, whitening, or aligners best fit your goals.
  - Button: Teeth whitening (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[11].ctas[2]
  - Engine: section manifest ctas
- Section: Book a Cosmetic Assessment
  - Body: We assess your teeth, review bite forces, and explain whether composite bonding, veneers, whitening, or aligners best fit your goals.
  - Button: Clear aligners (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.composite-bonding.json -> sections[11].ctas[3]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/composite-bonding (hash: f5d66bb9fcfb157b4ab2743470ab5a7fd44dfed4)
- same-CTAs-as-other-pages: /treatments/composite-bonding (hash: 1b29cd1130b357bc2e2cc8653f99716fa1bc7e1f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-abscess-infection

### HERO
- Headline: Dental abscess & infection
- Subhead: What to expect from dental abscess & infection.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_dental_abscess.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Get help for swelling or infection
  - Body: Call now so we can assess and relieve the infection safely.
  - Button: Call the practice (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-abscess-infection.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Get help for swelling or infection
  - Body: Call now so we can assess and relieve the infection safely.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-abscess-infection.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/dental-abscess-infection (hash: 536b0c91466537258c61b3991ca3989d3ef48f19)
- same-CTAs-as-other-pages: /treatments/dental-abscess-infection (hash: 3e73663dd21fe52d57896af8b930357bd2b75027)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-bridges

### HERO
- Headline: Dental bridges
- Subhead: What to expect from dental bridges.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_bridges.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- None

### FLAGS
- same-hero-as-other-pages: /treatments/dental-bridges (hash: 5bbc39e7e805cc086d56cd3497b03d94f708d29a)
- same-CTAs-as-other-pages: /about, /blog, /fees, /legal/accessibility, /legal/complaints, /legal/cookies, /legal/privacy, /legal/terms, /smile-gallery, /technology, /treatments, /treatments/dental-bridges (hash: b37ef20d4f4aba902b7497648d595d13931f683d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-checkups-oral-cancer-screening

### HERO
- Headline: Dental Check-Ups & Oral Cancer Screening
- Subhead: What to expect from dental check-ups & oral cancer screening.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_checkups_oral_cancer_screening_treatments.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Stay on track between check-ups
  - Body: Arrange a routine dental check-up
  - Button: Hygiene and gum care (/treatments/periodontal-gum-care)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[6].ctas[0]
  - Engine: section manifest ctas
- Section: Stay on track between check-ups
  - Body: Arrange a routine dental check-up
  - Button: Preventative & general dentistry (/treatments/preventative-and-general-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[6].ctas[1]
  - Engine: section manifest ctas
- Section: Stay on track between check-ups
  - Body: Arrange a routine dental check-up
  - Button: Children’s dental care (/treatments/childrens-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[6].ctas[2]
  - Engine: section manifest ctas
- Section: Stay on track between check-ups
  - Body: Arrange a routine dental check-up
  - Button: Senior smile care (/treatments/senior-mature-smile-care)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[6].ctas[3]
  - Engine: section manifest ctas
- Section: Arrange your routine dental check-up
  - Body: Book a calm examination with oral cancer screening included. Tell us if you would like a slower pace or extra reassurance.
  - Button: Arrange a routine check-up (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Arrange your routine dental check-up
  - Body: Book a calm examination with oral cancer screening included. Tell us if you would like a slower pace or extra reassurance.
  - Button: Support for anxious visitors (/treatments/nervous-patients)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-checkups-oral-cancer-screening.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /dental-checkups-oral-cancer-screening, /treatments/dental-checkups-oral-cancer-screening (hash: ff14e1bb693bf9354ddde5c478316cbd7ecc1148)
- same-CTAs-as-other-pages: /dental-checkups-oral-cancer-screening, /treatments/dental-checkups-oral-cancer-screening (hash: 8757a52f23037e63b155a988aaef2ee1b23a9bc8)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-crowns

### HERO
- Headline: Dental crowns
- Subhead: What to expect from dental crowns.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_crowns.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan a restorative consultation
  - Body: Contact us to discuss whether a crown is the right option for your tooth.
  - Button: Plan a clinician-led dental crowns review (/treatments/dental-crowns)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-crowns.json -> sections[12].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a restorative consultation
  - Body: Contact us to discuss whether a crown is the right option for your tooth.
  - Button: Consider alternatives like Tooth wear repairs (/treatments/inlays-onlays)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-crowns.json -> sections[12].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/dental-crowns (hash: 95a89294d9e1044ac5f649d76e06d607c1aea3ab)
- same-CTAs-as-other-pages: /treatments/dental-crowns (hash: f15c9d5d66b786168e895a97f1512ea96db0355e)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-fillings

### HERO
- Headline: Dental fillings
- Subhead: What to expect from dental fillings.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_fillings.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: When a filling needs extra support
  - Body: If the tooth is heavily broken down or the nerve is affected, we guide you through the next restorative steps.
  - Button: Explore onlays and inlays (/treatments/inlays-onlays)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[7].ctas[0]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)
- Section: When a filling needs extra support
  - Body: If the tooth is heavily broken down or the nerve is affected, we guide you through the next restorative steps.
  - Button: See when crowns are safer (/treatments/dental-crowns)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[7].ctas[1]
  - Engine: section manifest ctas
- Section: When a filling needs extra support
  - Body: If the tooth is heavily broken down or the nerve is affected, we guide you through the next restorative steps.
  - Button: Understand root canal options (/treatments/endodontics-root-canal)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[7].ctas[2]
  - Engine: section manifest ctas
- Section: Plan a calm filling appointment
  - Body: Contact us to discuss whether a filling is the right option for you.
  - Button: Book fillings consultation (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a calm filling appointment
  - Body: Contact us to discuss whether a filling is the right option for you.
  - Button: Explore onlays and inlays (/treatments/inlays-onlays)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)
- Section: Plan a calm filling appointment
  - Body: Contact us to discuss whether a filling is the right option for you.
  - Button: Explore crowns (/treatments/dental-crowns)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json -> sections[10].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/dental-fillings (hash: 586cd6b8a219cf0a45bf9b58f857b39f4b4467cc)
- same-CTAs-as-other-pages: /treatments/dental-fillings (hash: d0e343195bf49c3a526956a3025dc90e9700af39)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-retainers

### HERO
- Headline: Retainers
- Subhead: What to expect from retainers.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dental_retainers.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan retention that lasts
  - Body: Book a visit to finalise your retention plan and choose between removable, bonded, and 3D printed tooth-coloured retainers with clear care guidance.
  - Button: Plan a clinician-led dental retainers review (/treatments/dental-retainers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-retainers.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Plan retention that lasts
  - Body: Book a visit to finalise your retention plan and choose between removable, bonded, and 3D printed tooth-coloured retainers with clear care guidance.
  - Button: Consider alternatives like Orthodontic treatment (/treatments/orthodontics)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-retainers.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/dental-retainers (hash: 2920f23fc713e05fb26184e3c4347b2d0943efb2)
- same-CTAs-as-other-pages: /treatments/dental-retainers (hash: ea31f188663f369aad0da5df4c463c1ff0a40734)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dental-trauma-accidents

### HERO
- Headline: Dental trauma & accidents
- Subhead: What to expect from dental trauma & accidents.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_dental_trauma.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Arrange care after dental trauma
  - Body: We will check for hidden issues, stabilise your teeth, and guide recovery.
  - Button: Call for urgent care (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-trauma-accidents.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Arrange care after dental trauma
  - Body: We will check for hidden issues, stabilise your teeth, and guide recovery.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dental-trauma-accidents.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/dental-trauma-accidents (hash: 42c773659db1b881aeff4e32c11a8af27b35c0ff)
- same-CTAs-as-other-pages: /treatments/dental-trauma-accidents (hash: f9fb074e38d9efd4823601db14e33cff5d2c6e38)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dentures

### HERO
- Headline: Dentures & tooth replacement
- Subhead: What to expect from dentures & tooth replacement.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dentures.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan a denture that feels secure
  - Body: Contact us to discuss whether dentures are appropriate for you.
  - Button: Plan a clinician-led dentures review (/treatments/dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a denture that feels secure
  - Body: Contact us to discuss whether dentures are appropriate for you.
  - Button: Consider alternatives like implant retained dentures (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/dentures (hash: e2c444eab1513c53490646ba09d23d10ef8bb569)
- same-CTAs-as-other-pages: /treatments/dentures (hash: 2d6f4243d8c447dcb5783c8346b9e0c0112289d5)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/dermal-fillers

### HERO
- Headline: Dermal fillers
- Subhead: What to expect from dermal fillers.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> dermal_fillers.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial therapeutics consultation
  - Body: Discuss whether conservative dermal filler treatment is right for you with a clinician who keeps anatomy, safety, and reversibility front of mind.
  - Button: Plan a clinician-led dermal fillers review (/treatments/dermal-fillers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial therapeutics consultation
  - Body: Discuss whether conservative dermal filler treatment is right for you with a clinician who keeps anatomy, safety, and reversibility front of mind.
  - Button: Consider alternatives like Skin boosters (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/dermal-fillers (hash: 11f323c7e31d7b4cbcca32f98c8d29b6aed154cd)
- same-CTAs-as-other-pages: /treatments/dermal-fillers (hash: 025d2ced76c957e5fafd32be0b65d1b934092353)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/digital-smile-design

### HERO
- Headline: Digital smile design
- Subhead: What to expect from digital smile design.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> digital_smile_design.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Start with a digital smile preview
  - Body: Book a calm design consultation to see your options before any treatment, with clear guidance on printed and porcelain pathways.
  - Button: Plan a clinician-led digital smile design review (/treatments/digital-smile-design)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Start with a digital smile preview
  - Body: Book a calm design consultation to see your options before any treatment, with clear guidance on printed and porcelain pathways.
  - Button: Consider alternatives like Veneer planning (/treatments/veneers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/digital-smile-design (hash: e465ead2b0f083571a5a605821f9e7b3b2d2448e)
- same-CTAs-as-other-pages: /treatments/digital-smile-design (hash: c2390b5ef76cd1e0b86ae8be37d8ba9b34fd8d5c)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/emergency-dental-appointments

### HERO
- Headline: Emergency dental appointments
- Subhead: What to expect from emergency dental appointments.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_dental_appointments.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Call for an emergency appointment
  - Body: Tell us what has happened so we can reserve time and guide you before you travel.
  - Button: Call now (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dental-appointments.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Call for an emergency appointment
  - Body: Tell us what has happened so we can reserve time and guide you before you travel.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dental-appointments.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/emergency-dental-appointments (hash: 1ae823ff067739989c4a3158f41160d7119a2ef8)
- same-CTAs-as-other-pages: /treatments/emergency-dental-appointments, /treatments/knocked-out-tooth (hash: 39da92989dc929f98d361bebcff31f61fcbb265e)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/emergency-dentistry

### HERO
- Headline: Emergency dentistry
- Subhead: What to expect from emergency dentistry.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_dentistry.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Common emergency situations
  - Button: Emergency dental appointments (/treatments/emergency-dental-appointments)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[0]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Severe toothache & dental pain (/treatments/severe-toothache-dental-pain)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[1]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Dental abscess & infection (/treatments/dental-abscess-infection)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[2]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Broken, chipped or cracked teeth (/treatments/broken-chipped-cracked-teeth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[3]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Knocked-out (avulsed) tooth (/treatments/knocked-out-tooth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[4]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Lost crowns, veneers & fillings (/treatments/lost-crowns-veneers-fillings)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[5]
  - Engine: section manifest ctas
- Section: Common emergency situations
  - Button: Dental trauma & accidents (/treatments/dental-trauma-accidents)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[4].ctas[6]
  - Engine: section manifest ctas
- Section: After an emergency visit
  - Body: Following emergency care, further treatment may be recommended to address the underlying cause.

We’ll explain any findings clearly and discuss whether monitoring, further investigation, or planned treatment is appropriate.

You’ll have time to consider options once the immediate situation has settled.
  - Button: Book a check-up (/dental-checkups-oral-cancer-screening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[6].ctas[0]
  - Engine: section manifest ctas
- Section: Call for emergency dental care
  - Body: Contact the practice for urgent advice
  - Button: Contact the practice for urgent advice (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Call for emergency dental care
  - Body: Contact the practice for urgent advice
  - Button: See emergency options (/treatments)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.emergency-dentistry.json -> sections[9].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/emergency-dentistry (hash: 605f59a6ab40242a891759422fa01e4f843c85ce)
- same-CTAs-as-other-pages: /treatments/emergency-dentistry (hash: 5fb86df924a5605c4991169f6ae057ac451fac41)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/endodontics-root-canal

### HERO
- Headline: Endodontics & root canal care
- Subhead: What to expect from endodontics & root canal care.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> endodontics_root_canal.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Need relief from tooth pain?
  - Body: Book an endodontic assessment so we can calm the tooth, protect your smile, and plan any follow-up care together.
  - Button: Plan a clinician-led endodontics root canal review (/treatments/endodontics-root-canal)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.endodontics-root-canal.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Need relief from tooth pain?
  - Body: Book an endodontic assessment so we can calm the tooth, protect your smile, and plan any follow-up care together.
  - Button: Consider alternatives like Crown restoration (/treatments/dental-crowns)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.endodontics-root-canal.json -> sections[11].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/endodontics-root-canal (hash: b33fc18272576e88abd08084d839c9bb025072cb)
- same-CTAs-as-other-pages: /treatments/endodontics-root-canal (hash: e23deaf2e8ebe141bb33e9bd66c2f246fa890468)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/extractions-and-oral-surgery

### HERO
- Headline: Extractions & oral surgery
- Subhead: What to expect from extractions & oral surgery.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> extractions_and_oral_surgery.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Need advice about a troublesome tooth?
  - Body: We’ll review your options, plan comfortable removal if needed, and map the best path to restore your smile.
  - Button: Plan a clinician-led extractions and oral surgery review (/treatments/extractions-and-oral-surgery)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.extractions-and-oral-surgery.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Need advice about a troublesome tooth?
  - Body: We’ll review your options, plan comfortable removal if needed, and map the best path to restore your smile.
  - Button: Consider alternatives like Implant consultation (/treatments/implant-consultation)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.extractions-and-oral-surgery.json -> sections[11].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/extractions-and-oral-surgery (hash: 404432a741132735a9a0eb76a50797bee832d64a)
- same-CTAs-as-other-pages: /treatments/extractions-and-oral-surgery (hash: c9ea445258ff415557744af19a69231195e6c217)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/facial-aesthetics

### HERO
- Headline: Facial aesthetics
- Subhead: What to expect from facial aesthetics.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> facial_aesthetics.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial aesthetics consultation
  - Body: Discuss anti-wrinkle care, dermal fillers, skin boosters, or polynucleotides with a prescriber who prioritises safety and realism.
  - Button: Plan a clinician-led facial aesthetics review (/treatments/facial-aesthetics)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-aesthetics.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial aesthetics consultation
  - Body: Discuss anti-wrinkle care, dermal fillers, skin boosters, or polynucleotides with a prescriber who prioritises safety and realism.
  - Button: Consider alternatives like Dermal fillers (/treatments/dermal-fillers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-aesthetics.json -> sections[9].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/facial-aesthetics (hash: 61da83a8b236322af63a7369ef4b2a5a2468339c)
- same-CTAs-as-other-pages: /treatments/facial-aesthetics (hash: 7515c6aef5aeb78a4a382bfc21ece4f526e81c68)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/facial-pain-and-headache

### HERO
- Headline: Facial pain and headache pathways
- Subhead: What to expect from facial pain and headache pathways.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> facial_pain_headache.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial pain consultation
  - Body: Discuss headaches, jaw discomfort, or facial pain with a clinician who prioritises safe diagnosis and conservative care.
  - Button: Plan a clinician-led facial pain and headache review (/treatments/facial-pain-and-headache)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-pain-and-headache.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial pain consultation
  - Body: Discuss headaches, jaw discomfort, or facial pain with a clinician who prioritises safe diagnosis and conservative care.
  - Button: Consider alternatives like TMJ disorder treatment (/treatments/tmj-disorder-treatment)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-pain-and-headache.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/facial-pain-and-headache (hash: 918a2408b0faf03bbe53e948251f61b788f600e2)
- same-CTAs-as-other-pages: /treatments/facial-pain-and-headache (hash: c29053fa79c6e26c9a8d6d5a6c8292e1395c3385)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/facial-therapeutics

### HERO
- Headline: Facial therapeutics in Shoreham-by-Sea
- Subhead: What to expect from facial therapeutics in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> facial_therapeutics.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a clinical facial therapeutics consultation
  - Body: Discuss jaw tension, facial pain, or therapeutic injectables with a prescriber who prioritises safety and conservative care first.
  - Button: Plan a clinician-led facial therapeutics review (/treatments/facial-therapeutics)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-therapeutics.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Book a clinical facial therapeutics consultation
  - Body: Discuss jaw tension, facial pain, or therapeutic injectables with a prescriber who prioritises safety and conservative care first.
  - Button: Consider alternatives like Therapeutic injectables (/treatments/therapeutic-facial-injectables)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.facial-therapeutics.json -> sections[11].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/facial-therapeutics (hash: ac900432c1bcbc94f9d561a54a2746b8559fd483)
- same-CTAs-as-other-pages: /treatments/facial-therapeutics (hash: 0d2b6dbdb51c5c0429fcb39ab00e8f6e211f8c92)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/failed-implant-replacement

### HERO
- Headline: Failed implant replacement in Shoreham-by-Sea
- Subhead: What to expect from failed implant replacement in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_failed_replacement.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Concerned about an implant that hasn’t worked?
  - Body: Book a calm implant review in Shoreham-by-Sea and we’ll explain your options clearly and carefully.
  - Button: Plan a clinician-led failed implant replacement review (/treatments/failed-implant-replacement)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Concerned about an implant that hasn’t worked?
  - Body: Book a calm implant review in Shoreham-by-Sea and we’ll explain your options clearly and carefully.
  - Button: Consider alternatives like implant consultation (/treatments/implant-consultation)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/failed-implant-replacement (hash: edce3966c4871baa7872d986a899b8a79ab316e4)
- same-CTAs-as-other-pages: /treatments/failed-implant-replacement (hash: af3059f67f8d821babde630505c18df4bb931186)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/fixed-braces

### HERO
- Headline: Fixed braces
- Subhead: What to expect from fixed braces.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> fixed_braces.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book an Orthodontic Assessment
  - Body: Meet the team, review metal versus ceramic options, and leave with a clear plan for movement, monitoring, and retention before you commit.
  - Button: Plan a clinician-led fixed braces review (/treatments/fixed-braces)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.fixed-braces.json -> sections[14].ctas[0]
  - Engine: section manifest ctas
- Section: Book an Orthodontic Assessment
  - Body: Meet the team, review metal versus ceramic options, and leave with a clear plan for movement, monitoring, and retention before you commit.
  - Button: Consider alternatives like Alternatives with aligners (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.fixed-braces.json -> sections[14].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/fixed-braces (hash: 7447265d05f535432e06aa36d38538ecefc7ea56)
- same-CTAs-as-other-pages: /treatments/fixed-braces (hash: c78f0c7933aaded4882ffc0f600cca345c1996b6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/full-smile-makeover

### HERO
- Headline: Full smile makeover
- Subhead: What to expect from full smile makeover.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> full_smile_makeover.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan a full smile makeover
  - Body: A consultation is an opportunity to ask questions, understand your options, and decide what feels right for you, without any obligation to proceed.
  - Button: Book a planning session (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json -> sections[7].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a full smile makeover
  - Body: A consultation is an opportunity to ask questions, understand your options, and decide what feels right for you, without any obligation to proceed.
  - Button: Digital smile design (/treatments/digital-smile-design)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json -> sections[7].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/full-smile-makeover (hash: 025bebe1d1382fab7798d325896a47e623602964)
- same-CTAs-as-other-pages: /treatments/full-smile-makeover (hash: 0509ecbf0ce3b5ffaf11e17667a30ff455690e31)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/home-teeth-whitening

### HERO
- Headline: Home teeth whitening
- Subhead: What to expect from home teeth whitening.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> home_teeth_whitening.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Set up your home whitening plan
  - Body: Book a dentist-led whitening assessment and tray fit.
  - Button: Plan a clinician-led home teeth whitening review (/treatments/home-teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Set up your home whitening plan
  - Body: Book a dentist-led whitening assessment and tray fit.
  - Button: Consider alternatives like In-practice whitening discussions (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json -> sections[8].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/home-teeth-whitening (hash: a606e7267e108e76de259c5121fe76334286b3f0)
- same-CTAs-as-other-pages: /treatments/home-teeth-whitening (hash: c9a5e01cb0bd26a2070ea7bebce352bdaba44f3c)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implant-aftercare

### HERO
- Headline: Implant aftercare & recovery in Shoreham-by-Sea
- Subhead: What to expect from implant aftercare & recovery in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_aftercare.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Want implant care with clear support at every stage?
  - Body: Book a consultation in Shoreham-by-Sea and we’ll explain the process, aftercare, and timelines in plain English — with no pressure.
  - Button: Plan a clinician-led implant aftercare review (/treatments/implant-aftercare)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Want implant care with clear support at every stage?
  - Body: Book a consultation in Shoreham-by-Sea and we’ll explain the process, aftercare, and timelines in plain English — with no pressure.
  - Button: Consider alternatives like implant consultation (/treatments/implant-consultation)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/implant-aftercare (hash: 0cca026e83e601ba64acccf0e60f9c86330ff27b)
- same-CTAs-as-other-pages: /treatments/implant-aftercare (hash: 484b47e7612e96c6f5c14cefda8b882103853874)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implant-consultation

### HERO
- Headline: Implant consultation & planning in Shoreham-by-Sea
- Subhead: What to expect from implant consultation & planning in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_consultation.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book implant consultation & planning
  - Body: Assess bone support, digital scans, and sedation needs before treatment.
  - Button: Schedule an implant consultation (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implant-consultation.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book implant consultation & planning
  - Body: Assess bone support, digital scans, and sedation needs before treatment.
  - Button: Single-tooth implants (/treatments/implants-single-tooth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implant-consultation.json -> sections[10].ctas[1]
  - Engine: section manifest ctas
- Section: Book implant consultation & planning
  - Body: Assess bone support, digital scans, and sedation needs before treatment.
  - Button: Implants Bone Grafting (/treatments/implants-bone-grafting)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implant-consultation.json -> sections[10].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/implant-consultation (hash: 74abfac2c4a4c8b776fd455dc633cc5058990d30)
- same-CTAs-as-other-pages: /treatments/implant-consultation (hash: 61b7dfccc413fde704a2f6e0bb9f67acde655bbe)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implant-retained-dentures

### HERO
- Headline: Implant-retained dentures
- Subhead: What to expect from implant-retained dentures.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implant_retained_dentures.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: A realistic, supportive plan
  - Body: Our role is to help you choose a solution that improves comfort and function, fits your lifestyle, and can be maintained long-term. Sometimes the simpler option is the better one.
  - Button: Plan a clinician-led implant retained dentures review (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: A realistic, supportive plan
  - Body: Our role is to help you choose a solution that improves comfort and function, fits your lifestyle, and can be maintained long-term. Sometimes the simpler option is the better one.
  - Button: Consider alternatives like implants (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/implant-retained-dentures (hash: ff2b86920463c890f4462eec85819b0ef631b33e)
- same-CTAs-as-other-pages: /treatments/implant-retained-dentures (hash: 591bbe5d449152eb97af0912d7899bd4e008dc8d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implants

### HERO
- Headline: Dental Implants in Shoreham-by-Sea
- Subhead: Secure implant placement with guided planning and careful aftercare.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants.label
  - subhead: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants.intro
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book an implant assessment
  - Body: If you’re considering implants, we’ll assess suitability, explain options and costs, and help you decide with confidence.
  - Button: Request an appointment (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants.json -> sections[13].ctas[0]
  - Engine: section manifest ctas
- Section: Book an implant assessment
  - Body: If you’re considering implants, we’ll assess suitability, explain options and costs, and help you decide with confidence.
  - Button: Explore alternatives and planning options (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants.json -> sections[13].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/implants (hash: b28cc016cf3635f08846abe7278d8d5c48631785)
- same-CTAs-as-other-pages: /treatments/implants (hash: 9562850832eff324b73f9d08df666b405b245bc2)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implants-bone-grafting

### HERO
- Headline: Bone grafting for dental implants
- Subhead: What to expect from bone grafting for dental implants.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_bone_grafting.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Ready to plan implants with confidence?
  - Body: Book an assessment in Shoreham-by-Sea and we’ll map the safest route — including whether grafting is needed.
  - Button: Plan a clinician-led implants bone grafting review (/treatments/implants-bone-grafting)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-bone-grafting.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Ready to plan implants with confidence?
  - Body: Book an assessment in Shoreham-by-Sea and we’ll map the safest route — including whether grafting is needed.
  - Button: Consider alternatives like Implant placement (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-bone-grafting.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/implants-bone-grafting (hash: fd924475582e3e85fe60cccb3b44e0160c8cc208)
- same-CTAs-as-other-pages: /treatments/implants-bone-grafting (hash: e533614ddcd6407a91f8e2714c5c06ed8928d264)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implants-full-arch

### HERO
- Headline: Full arch implant rehabilitation
- Subhead: What to expect from full arch implant rehabilitation.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_full_arch.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Ready for fixed full-arch confidence?
  - Body: Book a full-arch implant consultation in Shoreham-by-Sea or speak to the team about staged and financing options.
  - Button: Plan a clinician-led implants full arch review (/treatments/implants-full-arch)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-full-arch.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Ready for fixed full-arch confidence?
  - Body: Book a full-arch implant consultation in Shoreham-by-Sea or speak to the team about staged and financing options.
  - Button: Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-full-arch.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/implants-full-arch (hash: becec0d2818ae493f2923572eb943c6f3aa4f5d9)
- same-CTAs-as-other-pages: /treatments/implants-full-arch (hash: 854fdbaa4dda829863c05054ac76275d30b6f8b5)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implants-multiple-teeth

### HERO
- Headline: Multiple teeth implant options
- Subhead: What to expect from multiple teeth implant options.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_multiple_teeth.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Ready for a stable solution to several missing teeth?
  - Body: Book a multi-tooth implant consultation in Shoreham-by-Sea or ask how implant-supported bridges work.
  - Button: Plan a clinician-led implants multiple teeth review (/treatments/implants-multiple-teeth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-multiple-teeth.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Ready for a stable solution to several missing teeth?
  - Body: Book a multi-tooth implant consultation in Shoreham-by-Sea or ask how implant-supported bridges work.
  - Button: Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-multiple-teeth.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/implants-multiple-teeth (hash: 88e5ae57a35f5fba16ab97ab5a116ef12abe0afe)
- same-CTAs-as-other-pages: /treatments/implants-multiple-teeth (hash: a8c3a8142965931d55334dc2f27bb58ea57af2d6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/implants-single-tooth

### HERO
- Headline: Single-tooth dental implants in Shoreham-by-Sea
- Subhead: What to expect from single-tooth dental implants in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_single_tooth.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Ready to replace a missing tooth securely?
  - Body: Book a single-tooth implant consultation in Shoreham-by-Sea or ask how the process works.
  - Button: Plan a clinician-led implants single tooth review (/treatments/implants-single-tooth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-single-tooth.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Ready to replace a missing tooth securely?
  - Body: Book a single-tooth implant consultation in Shoreham-by-Sea or ask how the process works.
  - Button: Consider alternatives like CBCT 3D scanning (/treatments/cbct-3d-scanning)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-single-tooth.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/implants-single-tooth (hash: 97ade510d874abfea96409dd5c5b35560cd1f8b8)
- same-CTAs-as-other-pages: /treatments/implants-single-tooth (hash: f7ef4d34958c9eed43dfeddf806bc7a4e846cb66)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/injection-moulded-composite

### HERO
- Headline: Injection-moulded composite
- Subhead: What to expect from injection-moulded composite.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> injection_moulded_composite.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan an injection-moulded composite consultation
  - Body: We review your teeth, discuss how composite bonding, veneers, whitening, or alignment fit together, and build a guided plan that matches your goals.
  - Button: Book a consultation (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.injection-moulded-composite.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Plan an injection-moulded composite consultation
  - Body: We review your teeth, discuss how composite bonding, veneers, whitening, or alignment fit together, and build a guided plan that matches your goals.
  - Button: Full smile makeover (/treatments/full-smile-makeover)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.injection-moulded-composite.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/injection-moulded-composite (hash: e4c3542cfe1379b12be1c05b176b3bee47c3cb77)
- same-CTAs-as-other-pages: /treatments/injection-moulded-composite (hash: 537f7409cc853d1e6f520a5454e8fd49f877e225)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/inlays-onlays

### HERO
- Headline: Inlays & onlays
- Subhead: What to expect from inlays & onlays.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> inlays_onlays.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Strengthen your tooth with a precise fit
  - Body: Book a calm assessment to see whether an inlay or onlay is right for you, and understand the materials we’d recommend.
  - Button: Plan a clinician-led inlays onlays review (/treatments/inlays-onlays)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.inlays-onlays.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Strengthen your tooth with a precise fit
  - Body: Book a calm assessment to see whether an inlay or onlay is right for you, and understand the materials we’d recommend.
  - Button: Consider alternatives like Occlusal splint for protection (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.inlays-onlays.json -> sections[11].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/inlays-onlays (hash: 81601ef3a7b7edb00f92e48295a1a01d5f464534)
- same-CTAs-as-other-pages: /treatments/inlays-onlays (hash: 20bfd8ad224f7da4bb980a0572f152c1d2f5b6ec)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/knocked-out-tooth

### HERO
- Headline: Knocked-out (avulsed) tooth
- Subhead: What to expect from knocked-out (avulsed) tooth.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_knocked_out_tooth.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Call immediately about a knocked-out tooth
  - Body: We will guide you on safe handling and prepare to see you as soon as possible.
  - Button: Call now (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.knocked-out-tooth.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Call immediately about a knocked-out tooth
  - Body: We will guide you on safe handling and prepare to see you as soon as possible.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.knocked-out-tooth.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/knocked-out-tooth (hash: 71eaa2915d7596d4a6589a96340510ed0cc2ea7f)
- same-CTAs-as-other-pages: /treatments/emergency-dental-appointments, /treatments/knocked-out-tooth (hash: 39da92989dc929f98d361bebcff31f61fcbb265e)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/lost-crowns-veneers-fillings

### HERO
- Headline: Lost crowns, veneers & fillings
- Subhead: What to expect from lost crowns, veneers & fillings.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_lost_crowns.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book help for a lost restoration
  - Body: We will protect the tooth, discuss repair options, and get you back to comfort.
  - Button: Arrange an emergency visit (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.lost-crowns-veneers-fillings.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Book help for a lost restoration
  - Body: We will protect the tooth, discuss repair options, and get you back to comfort.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.lost-crowns-veneers-fillings.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/lost-crowns-veneers-fillings (hash: 8fa7832ca80d01ba20edb9612a3126bb74153d8f)
- same-CTAs-as-other-pages: /treatments/lost-crowns-veneers-fillings (hash: f907475f72b8aa9ad6b3263fc744c40711f8baa0)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/mouthguards-and-retainers

### HERO
- Headline: Mouthguards and retainers
- Subhead: What to expect from mouthguards and retainers.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> mouthguards_and_retainers.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Need a custom guard or retainer?
  - Body: We will help you choose the right appliance, explain fabrication options, and set review points so it stays comfortable and effective.
  - Button: Plan a clinician-led mouthguards and retainers review (/treatments/mouthguards-and-retainers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.mouthguards-and-retainers.json -> sections[7].ctas[0]
  - Engine: section manifest ctas
- Section: Need a custom guard or retainer?
  - Body: We will help you choose the right appliance, explain fabrication options, and set review points so it stays comfortable and effective.
  - Button: Consider alternatives like Night guards for clenching (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.mouthguards-and-retainers.json -> sections[7].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/mouthguards-and-retainers (hash: 6100631a27ca1dddc5bd4b8fd1fc6273ceb32523)
- same-CTAs-as-other-pages: /treatments/mouthguards-and-retainers (hash: c75075dcddd835cbaef3dc8661cd5f6920baa80d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/nervous-patients

### HERO
- Headline: Nervous patients
- Subhead: What to expect from nervous patients.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> nervous_patients.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Support options when anxiety is significant
  - Body: For some people, extra support helps — longer appointments, staged planning, or sedation where appropriate, assessed carefully.
  - Button: Plan a clinician-led nervous patients review (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.nervous-patients.json -> sections[5].ctas[0]
  - Engine: intent:primary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)
- Section: Support options when anxiety is significant
  - Body: For some people, extra support helps — longer appointments, staged planning, or sedation where appropriate, assessed carefully.
  - Button: Consider alternatives like Sedation dentistry (/treatments/sedation-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.nervous-patients.json -> sections[5].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)
- Section: Ready to talk through a calmer visit?
  - Body: Book an appointment to talk things through at your own pace.
  - Button: Plan a clinician-led nervous patients review (/treatments/nervous-patients)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.nervous-patients.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Ready to talk through a calmer visit?
  - Body: Book an appointment to talk things through at your own pace.
  - Button: Consider alternatives like Sedation dentistry (/treatments/sedation-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.nervous-patients.json -> sections[8].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/nervous-patients (hash: bc81378149ce370aa900f90f48281247176d4619)
- same-CTAs-as-other-pages: /treatments/nervous-patients (hash: 4a1d95764c2183d80113a439c05f7dbedac468d9)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/night-guards-occlusal-splints

### HERO
- Headline: Night guards (occlusal splints)
- Subhead: What to expect from night guards (occlusal splints).
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> night_guards_occlusal_splints.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan a night guard that suits your bite
  - Body: Contact us to discuss whether a night guard or splint is appropriate for you.
  - Button: Plan a clinician-led night guards occlusal splints review (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.night-guards-occlusal-splints.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a night guard that suits your bite
  - Body: Contact us to discuss whether a night guard or splint is appropriate for you.
  - Button: Consider alternatives like Bruxism assessment (/treatments/bruxism-and-jaw-clenching)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.night-guards-occlusal-splints.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/night-guards-occlusal-splints (hash: efda42fc8e94f63abcf0b067437b3aa3f3ca60ba)
- same-CTAs-as-other-pages: /treatments/night-guards-occlusal-splints (hash: 9d2ca05d9ed7ace27dbfccac743607dceff8d73c)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/orthodontics

### HERO
- Headline: Orthodontics
- Subhead: What to expect from orthodontics.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> orthodontics.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book an Orthodontic Assessment
  - Body: Contact us to discuss whether orthodontic treatment is suitable for you.
  - Button: Plan a clinician-led orthodontics review (/treatments/orthodontics)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.orthodontics.json -> sections[14].ctas[0]
  - Engine: section manifest ctas
- Section: Book an Orthodontic Assessment
  - Body: Contact us to discuss whether orthodontic treatment is suitable for you.
  - Button: Consider alternatives like Alternatives with aligners (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.orthodontics.json -> sections[14].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/orthodontics (hash: d11b8b70b057930cf06836daeb59a2a0c8b28040)
- same-CTAs-as-other-pages: /treatments/orthodontics (hash: 36cb645a5f7017ef0060871353ae6ce377aa6254)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/painless-numbing-the-wand

### HERO
- Headline: The Wand numbing system
- Subhead: What to expect from the wand numbing system.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> painless_numbing_the_wand.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Choose gentler numbing for your visit
  - Body: Book a comfort consult to see if The Wand or other calming options suit your treatment—whether routine care, restorative work, or implants.
  - Button: Plan a clinician-led painless numbing the wand review (/treatments/painless-numbing-the-wand)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Choose gentler numbing for your visit
  - Body: Book a comfort consult to see if The Wand or other calming options suit your treatment—whether routine care, restorative work, or implants.
  - Button: Consider alternatives like Sedation dentistry (/treatments/sedation-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json -> sections[9].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/painless-numbing-the-wand (hash: 42057dae43ad33bb017e57e3b53f7d7a925b8a4a)
- same-CTAs-as-other-pages: /treatments/painless-numbing-the-wand (hash: 3c07e6edfa7f8e1dc3b868d6bca4b4d75aa8a85f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/peek-partial-dentures

### HERO
- Headline: PEEK partial dentures
- Subhead: What to expect from peek partial dentures.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> peek_partial_dentures.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan discreet PEEK partial dentures
  - Body: Book a consultation to explore PEEK’s metal-free feel with clear guidance on fit, care, and future stabilisation options if you need them.
  - Button: Plan a clinician-led peek partial dentures review (/treatments/peek-partial-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Plan discreet PEEK partial dentures
  - Body: Book a consultation to explore PEEK’s metal-free feel with clear guidance on fit, care, and future stabilisation options if you need them.
  - Button: Consider alternatives like implant retained dentures (/treatments/implant-retained-dentures)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/peek-partial-dentures (hash: 5637b27292b06d43e88927bee3cb16bf1ce1ae3b)
- same-CTAs-as-other-pages: /treatments/peek-partial-dentures (hash: c86a70098bc967801e50bd017740e37b7dd77851)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/periodontal-gum-care

### HERO
- Headline: Gum disease
- Subhead: What to expect from gum disease.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> periodontal_gum_care.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a periodontal assessment
  - Body: Let’s map your gum health and plan steady, preventative care. Related care you may find helpful: Dental Implants (/treatments/implants), Preventative & General Dentistry (/treatments/preventative-and-general-dentistry), Dental check-ups & oral cancer screening (/treatments/preventative-and-general-dentistry), Nervous Patients (/treatments/nervous-patients).
  - Button: Plan a clinician-led periodontal gum care review (/treatments/periodontal-gum-care)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.periodontal-gum-care.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a periodontal assessment
  - Body: Let’s map your gum health and plan steady, preventative care. Related care you may find helpful: Dental Implants (/treatments/implants), Preventative & General Dentistry (/treatments/preventative-and-general-dentistry), Dental check-ups & oral cancer screening (/treatments/preventative-and-general-dentistry), Nervous Patients (/treatments/nervous-patients).
  - Button: Consider alternatives like Implant suitability (/treatments/implant-consultation)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.periodontal-gum-care.json -> sections[10].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/periodontal-gum-care (hash: 33fa6c6adfdc53e848151261af602cbbb6868c18)
- same-CTAs-as-other-pages: /treatments/periodontal-gum-care (hash: b11321313c9f13e78ecd4d8416c9fc25661d109d)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/polynucleotides

### HERO
- Headline: Polynucleotides (skin quality support)
- Subhead: What to expect from polynucleotides (skin quality support).
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> polynucleotides.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial therapeutics consultation
  - Body: Explore whether a polynucleotide course is appropriate for your skin with a clinician who prioritises safety, sequencing, and conservative dosing.
  - Button: Plan a clinician-led polynucleotides review (/treatments/polynucleotides)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial therapeutics consultation
  - Body: Explore whether a polynucleotide course is appropriate for your skin with a clinician who prioritises safety, sequencing, and conservative dosing.
  - Button: Consider alternatives like Skin boosters (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/polynucleotides (hash: 4e53ddd5d5e12ff391faa00f87fb43c7bc2424c0)
- same-CTAs-as-other-pages: /treatments/polynucleotides (hash: fc92f741944da5a5f60918c300275491c7ad02ae)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/preventative-and-general-dentistry

### HERO
- Headline: Preventative & general dentistry
- Subhead: What to expect from preventative & general dentistry.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> preventative_and_general_dentistry.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Dental Check-Ups & Oral Cancer Screening
  - Body: Comprehensive exams, digital assessment, and a visual oral cancer check at every visit.
  - Button: Plan a clinician-led preventative and general dentistry review (/dental-checkups-oral-cancer-screening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Book your comprehensive dental exam
  - Body: Speak to us about a prevention-first plan. If you’re anxious, tell us — we’ll tailor the visit and pace it carefully.
  - Button: Plan a clinician-led preventative and general dentistry review (/dental-checkups-oral-cancer-screening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json -> sections[12].ctas[0]
  - Engine: section manifest ctas
- Section: Book your comprehensive dental exam
  - Body: Speak to us about a prevention-first plan. If you’re anxious, tell us — we’ll tailor the visit and pace it carefully.
  - Button: Consider alternatives like Gum care (/treatments/periodontal-gum-care)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json -> sections[12].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/preventative-and-general-dentistry (hash: 692de7a827635ecf96b8148b65efe148fd9c9434)
- same-CTAs-as-other-pages: /treatments/preventative-and-general-dentistry (hash: 7e7f69faaf5b9b2b8c8ecec1cbc971f7ee7df147)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/sedation-dentistry

### HERO
- Headline: Sedation dentistry
- Subhead: What to expect from sedation dentistry.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> sedation_dentistry.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Talk through sedation calmly first
  - Body: Book a consultation to discuss sedation, nervous patient support, or comfort options like The Wand before planning treatment.
  - Button: Plan a clinician-led sedation dentistry review (/treatments/sedation-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Talk through sedation calmly first
  - Body: Book a consultation to discuss sedation, nervous patient support, or comfort options like The Wand before planning treatment.
  - Button: Consider alternatives like Oral surgery planning (/treatments/extractions-and-oral-surgery)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json -> sections[9].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/sedation-dentistry (hash: 8d0ca5b12359a3f031602e5182cb286e9332f76b)
- same-CTAs-as-other-pages: /treatments/sedation-dentistry (hash: 82aa2e2a79ec4ad6ab8934bcfee2f8cc91eea5d7)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/sedation-for-implants

### HERO
- Headline: Sedation for dental implant treatment in Shoreham-by-Sea
- Subhead: What to expect from sedation for dental implant treatment in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_sedation.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Nervous about implants? You’re not alone.
  - Body: Book a calm implant consultation in Shoreham-by-Sea and talk through sedation options at your own pace.
  - Button: Plan a clinician-led sedation for implants review (/treatments/sedation-for-implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-sedation.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Nervous about implants? You’re not alone.
  - Body: Book a calm implant consultation in Shoreham-by-Sea and talk through sedation options at your own pace.
  - Button: Consider alternatives like implants (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.implants-sedation.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/sedation-for-implants (hash: 1240e117389d50f68850d8d7daa81a12474e356e)
- same-CTAs-as-other-pages: /treatments/sedation-for-implants (hash: e750add739260d779f103d3436e18935517fe428)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/senior-mature-smile-care

### HERO
- Headline: Senior and mature smile care
- Subhead: What to expect from senior and mature smile care.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> senior_mature_smile_care.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a mature smile assessment
  - Body: Let’s plan prevention-first, comfortable care that suits how you want to be treated. Related care: Periodontal & Gum Care (/treatments/periodontal-gum-care), Dental Crowns (/treatments/dental-crowns), Dental Bridges (/treatments/dental-bridges), Dentures (/treatments/dentures), Dental Implants (/treatments/implants), Check-Ups & Oral Cancer Screening (/treatments/preventative-and-general-dentistry).
  - Button: Plan a clinician-led senior mature smile care review (/treatments/senior-mature-smile-care)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.senior-mature-smile-care.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Book a mature smile assessment
  - Body: Let’s plan prevention-first, comfortable care that suits how you want to be treated. Related care: Periodontal & Gum Care (/treatments/periodontal-gum-care), Dental Crowns (/treatments/dental-crowns), Dental Bridges (/treatments/dental-bridges), Dentures (/treatments/dentures), Dental Implants (/treatments/implants), Check-Ups & Oral Cancer Screening (/treatments/preventative-and-general-dentistry).
  - Button: Consider alternatives like Implant consultation (/treatments/implant-consultation)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.senior-mature-smile-care.json -> sections[9].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/senior-mature-smile-care (hash: 9505e06cf89ded26cec12222bfc06e436771b0df)
- same-CTAs-as-other-pages: /treatments/senior-mature-smile-care (hash: 2d2afb4d1344a6d8ebbe491248a95f3cde18abd6)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/severe-toothache-dental-pain

### HERO
- Headline: Severe toothache & dental pain
- Subhead: What to expect from severe toothache & dental pain.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> emergency_severe_toothache.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Arrange urgent toothache care
  - Body: We will guide you on immediate steps and bring you in quickly to relieve pain.
  - Button: Call for support (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.severe-toothache-dental-pain.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Arrange urgent toothache care
  - Body: We will guide you on immediate steps and bring you in quickly to relieve pain.
  - Button: Emergency dentistry (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.severe-toothache-dental-pain.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/severe-toothache-dental-pain (hash: 5195179a84cf70a67d7b4abb54f374ed0f2b1a92)
- same-CTAs-as-other-pages: /treatments/severe-toothache-dental-pain (hash: 5b960c7362caa725e3dd21f9b7c288cb19c1c611)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/sinus-lift

### HERO
- Headline: Sinus lift for dental implants in Shoreham-by-Sea
- Subhead: What to expect from sinus lift for dental implants in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_sinus_lift.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Discuss sinus lift care
  - Body: Check if a sinus lift is needed before your implant placement.
  - Button: Book a sinus lift consultation (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sinus-lift.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Discuss sinus lift care
  - Body: Check if a sinus lift is needed before your implant placement.
  - Button: Implant dentistry (/treatments/implants)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sinus-lift.json -> sections[10].ctas[1]
  - Engine: section manifest ctas
- Section: Discuss sinus lift care
  - Body: Check if a sinus lift is needed before your implant placement.
  - Button: Teeth In A Day (/treatments/teeth-in-a-day)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sinus-lift.json -> sections[10].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/sinus-lift (hash: b1d582a0410d3b7f288f050cd760892645cf3699)
- same-CTAs-as-other-pages: /treatments/sinus-lift (hash: f6a5c738f371beda8a6d6bc6758058338272633f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/skin-boosters

### HERO
- Headline: Skin boosters (hydration and elasticity)
- Subhead: What to expect from skin boosters (hydration and elasticity).
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> skin_boosters.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a facial therapeutics consultation
  - Body: Discuss a planned course of skin boosters with a clinician who keeps barrier health and conservative dosing at the centre of care.
  - Button: Plan a clinician-led skin boosters review (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a facial therapeutics consultation
  - Body: Discuss a planned course of skin boosters with a clinician who keeps barrier health and conservative dosing at the centre of care.
  - Button: Consider alternatives like Skin boosters (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/skin-boosters (hash: fa0bffc1fcaae15adda48148076578d71657f600)
- same-CTAs-as-other-pages: /treatments/skin-boosters (hash: 49d2ba6f51d075b637dc0079e8fc55c41c049b73)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/sports-mouthguards

### HERO
- Headline: Sports mouthguards
- Subhead: What to expect from sports mouthguards.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> sports_mouthguards.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a fitting for your sports mouthguard
  - Body: Arrange a consultation to capture your bite and organise a lab-made mouthguard tailored to your sport.
  - Button: Plan a clinician-led sports mouthguards review (/treatments/sports-mouthguards)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sports-mouthguards.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Book a fitting for your sports mouthguard
  - Body: Arrange a consultation to capture your bite and organise a lab-made mouthguard tailored to your sport.
  - Button: Consider alternatives like Night guards for grinding (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.sports-mouthguards.json -> sections[8].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/sports-mouthguards (hash: 067c98ff8f5255846cb91a9ad264f95809fec905)
- same-CTAs-as-other-pages: /treatments/sports-mouthguards (hash: f83688f6f16578ec86cbc95c4d3efe002e829c2b)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/teeth-in-a-day

### HERO
- Headline: Teeth-in-a-Day implants in Shoreham-by-Sea
- Subhead: What to expect from teeth-in-a-day implants in shoreham-by-sea.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> implants_teeth_in_a_day.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Explore Teeth-in-a-Day
  - Body: See if same-day placement suits your case and what aftercare involves.
  - Button: Book a Teeth-in-a-Day consult (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-in-a-day.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Explore Teeth-in-a-Day
  - Body: See if same-day placement suits your case and what aftercare involves.
  - Button: Plan implant aftercare (/treatments/implant-aftercare)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-in-a-day.json -> sections[10].ctas[1]
  - Engine: section manifest ctas
- Section: Explore Teeth-in-a-Day
  - Body: See if same-day placement suits your case and what aftercare involves.
  - Button: Full arch implants (/treatments/implants-full-arch)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-in-a-day.json -> sections[10].ctas[2]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/teeth-in-a-day (hash: 96a46f8abee152f3f6c9fda90a5cddeacda0ad4c)
- same-CTAs-as-other-pages: /treatments/teeth-in-a-day (hash: 6c5a1cd4caa0e500dc7dae0bd7f459354f21832f)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/teeth-whitening

### HERO
- Headline: Teeth whitening
- Subhead: What to expect from teeth whitening.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> whitening_hub.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Start with a whitening consultation
  - Body: Plan a calm, dentist-led whitening routine or pair it with wider smile design.
  - Button: Plan a clinician-led teeth whitening review (/treatments/teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening.json -> sections[8].ctas[0]
  - Engine: section manifest ctas
- Section: Start with a whitening consultation
  - Body: Plan a calm, dentist-led whitening routine or pair it with wider smile design.
  - Button: Consider alternatives like composite bonding (/treatments/composite-bonding)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening.json -> sections[8].ctas[1]
  - Engine: section manifest ctas
- Section: Start with a whitening consultation
  - Body: Plan a calm, dentist-led whitening routine or pair it with wider smile design.
  - Button: Plan next steps with veneers (/treatments/veneers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening.json -> sections[8].ctas[2]
  - Engine: section manifest ctas
- Section: Start with a whitening consultation
  - Body: Plan a calm, dentist-led whitening routine or pair it with wider smile design.
  - Button: Plan next steps with clear aligners (/treatments/clear-aligners)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening.json -> sections[8].ctas[3]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/teeth-whitening (hash: d75ef5989d8b13c4fb83aa03d73524e4db08a3c0)
- same-CTAs-as-other-pages: /treatments/teeth-whitening (hash: 793ab46ff4d84f8410e80aa52af1bfb241c23d0e)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/teeth-whitening-faqs

### HERO
- Headline: Teeth whitening FAQs
- Subhead: What to expect from teeth whitening faqs.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> whitening_faq.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan whitening with a dentist
  - Body: Ask your questions in person and receive a tailored whitening plan.
  - Button: Plan a clinician-led teeth whitening faqs review (/treatments/teeth-whitening-faqs)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening-faqs.json -> sections[4].ctas[0]
  - Engine: section manifest ctas
- Section: Plan whitening with a dentist
  - Body: Ask your questions in person and receive a tailored whitening plan.
  - Button: Consider alternatives like Top-up arrangements (/treatments/whitening-top-ups)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening-faqs.json -> sections[4].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/teeth-whitening-faqs (hash: 2cdf362c3b027e25e1094e97136e7e77bf913684)
- same-CTAs-as-other-pages: /treatments/teeth-whitening-faqs (hash: f78c30dde822eba8147050de0317f751b9be9b27)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/therapeutic-facial-injectables

### HERO
- Headline: Therapeutic facial injectables
- Subhead: What to expect from therapeutic facial injectables.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> therapeutic_facial_injectables.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a therapeutic injectable consultation
  - Body: Discuss whether prescription injectables are appropriate for your facial muscle symptoms. Safety, suitability, and conservative care come first.
  - Button: Plan a clinician-led therapeutic facial injectables review (/treatments/therapeutic-facial-injectables)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.therapeutic-facial-injectables.json -> sections[11].ctas[0]
  - Engine: section manifest ctas
- Section: Book a therapeutic injectable consultation
  - Body: Discuss whether prescription injectables are appropriate for your facial muscle symptoms. Safety, suitability, and conservative care come first.
  - Button: Consider alternatives like Skin boosters (/treatments/skin-boosters)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.therapeutic-facial-injectables.json -> sections[11].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/therapeutic-facial-injectables (hash: 297c87e31d7b4bc06baa26d9cf71ac8927bcae90)
- same-CTAs-as-other-pages: /treatments/therapeutic-facial-injectables (hash: 49b94fddf988e31a9ccf10f3fd27eae20934cbb2)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/tmj-disorder-treatment

### HERO
- Headline: TMJ disorder treatment
- Subhead: What to expect from tmj disorder treatment.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> tmj_disorder_treatment.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Book a TMJ disorder assessment
  - Body: Discuss locking, clicking, or jaw pain with a clinician who prioritises reversible care and clear escalation pathways.
  - Button: Plan a clinician-led tmj disorder treatment review (/treatments/tmj-disorder-treatment)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tmj-disorder-treatment.json -> sections[10].ctas[0]
  - Engine: section manifest ctas
- Section: Book a TMJ disorder assessment
  - Body: Discuss locking, clicking, or jaw pain with a clinician who prioritises reversible care and clear escalation pathways.
  - Button: Consider alternatives like Occlusal splints (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tmj-disorder-treatment.json -> sections[10].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/tmj-disorder-treatment (hash: 9714503124ade74fdeb601c4c2b0a612b77c1d46)
- same-CTAs-as-other-pages: /treatments/tmj-disorder-treatment (hash: eaa86782f7832b2c56980552916cd6ffbbfd9db1)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/tmj-jaw-comfort

### HERO
- Headline: Jaw joint (TMJ) comfort
- Subhead: What to expect from jaw joint (tmj) comfort.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> tmj_jaw_comfort.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan your TMJ care with a calm consult
  - Body: Contact us to discuss your symptoms and appropriate next steps.
  - Button: Plan a clinician-led tmj jaw comfort review (/treatments/tmj-jaw-comfort)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tmj-jaw-comfort.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Plan your TMJ care with a calm consult
  - Body: Contact us to discuss your symptoms and appropriate next steps.
  - Button: Consider alternatives like TMJ disorder treatment (/treatments/tmj-disorder-treatment)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tmj-jaw-comfort.json -> sections[9].ctas[1]
  - Engine: intent:secondary_intent (treatmentMidCtaPlan/treatmentClosingCtaPlan)

### FLAGS
- same-hero-as-other-pages: /treatments/tmj-jaw-comfort (hash: c7d1f8e6c12c632d9e629a05d1c8d0099eadd9c1)
- same-CTAs-as-other-pages: /treatments/tmj-jaw-comfort (hash: fd88cf1912fcb00a41ea8140b8679ccfb9b31cb4)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/tooth-wear-broken-teeth

### HERO
- Headline: Tooth Wear & Broken Teeth
- Subhead: What to expect from tooth wear & broken teeth.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> tooth_wear_broken_teeth.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Book a tooth wear assessment (/contact)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[0]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: TMJ & Jaw Care (/treatments/tmj-jaw-comfort)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[1]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Night guards (occlusal splints) (/treatments/night-guards-occlusal-splints)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[2]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Dental Crowns (/treatments/dental-crowns)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[3]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Inlays & Onlays (/treatments/inlays-onlays)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[4]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Composite Bonding (/treatments/composite-bonding)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[5]
  - Engine: section manifest ctas
- Section: Plan a calm review for tooth wear or broken edges
  - Body: Contact us to discuss concerns about tooth wear and appropriate next steps.
  - Button: Nervous Patients (/treatments/nervous-patients)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.tooth-wear-broken-teeth.json -> sections[9].ctas[6]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/tooth-wear-broken-teeth (hash: 1d4be2dbedb8bf3826d97e1b876db028c2abf7f6)
- same-CTAs-as-other-pages: /treatments/tooth-wear-broken-teeth (hash: 763a61a8cf6a107eda140f45dd756c5dbe3834c2)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/veneers

### HERO
- Headline: Treatments/Veneers
- Subhead: What to expect from treatments/veneers.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: derived from route
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Veneer Consultation & Smile Design
  - Body: Review digital designs, material choices, and alternatives with a clinician-led plan.
  - Button: Plan a clinician-led veneers review (/treatments/veneers)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.veneers.json -> sections[14].ctas[0]
  - Engine: section manifest ctas
- Section: Veneer Consultation & Smile Design
  - Body: Review digital designs, material choices, and alternatives with a clinician-led plan.
  - Button: Consider alternatives like full smile makeover (/treatments/full-smile-makeover)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.veneers.json -> sections[14].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/veneers (hash: f1fb8587af6d3bcf224634193fb0f2f36283d99c)
- same-CTAs-as-other-pages: /treatments/veneers (hash: 28f6d4aac58ddf3827c581a3585fae908d2b4728)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/whitening-sensitive-teeth

### HERO
- Headline: Sensitive teeth & whitening
- Subhead: What to expect from sensitive teeth & whitening.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> whitening_sensitivity.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Plan whitening that respects sensitivity
  - Body: Book a review so we can tailor gel strength, pacing, and aftercare to your comfort.
  - Button: Plan a clinician-led whitening sensitive teeth review (/treatments/whitening-sensitive-teeth)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json -> sections[6].ctas[0]
  - Engine: section manifest ctas
- Section: Plan whitening that respects sensitivity
  - Body: Book a review so we can tailor gel strength, pacing, and aftercare to your comfort.
  - Button: Consider alternatives like Home whitening guidance (/treatments/home-teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json -> sections[6].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/whitening-sensitive-teeth (hash: c880f73d67ab89bb7143b3622d33b6367fb716f5)
- same-CTAs-as-other-pages: /treatments/whitening-sensitive-teeth (hash: 31b8dc057e9a70a845c31af6c3bd5ab95aa9b239)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /treatments/whitening-top-ups

### HERO
- Headline: Whitening top-ups & maintenance
- Subhead: What to expect from whitening top-ups & maintenance.
- Primary CTA: —
- Secondary CTA: —
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> whitening_topups.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Schedule a maintenance review
  - Body: Refresh your whitening plan with dentist guidance and the trays you already have.
  - Button: Plan a clinician-led whitening top ups review (/treatments/whitening-top-ups)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.whitening-top-ups.json -> sections[6].ctas[0]
  - Engine: section manifest ctas
- Section: Schedule a maintenance review
  - Body: Refresh your whitening plan with dentist guidance and the trays you already have.
  - Button: Consider alternatives like Home whitening plans (/treatments/home-teeth-whitening)
  - Source: packages/champagne-manifests/data/sections/smh/treatments.whitening-top-ups.json -> sections[6].ctas[1]
  - Engine: section manifest ctas

### FLAGS
- same-hero-as-other-pages: /treatments/whitening-top-ups (hash: 386f4d33226d34188a769760e45bd68dccfdf3ea)
- same-CTAs-as-other-pages: /treatments/whitening-top-ups (hash: 1d8a9d2be7b72af668e650d9c88d615f3418ba83)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

## /video-consultation

### HERO
- Headline: Video Consultation
- Subhead: What to expect from video consultation.
- Primary CTA: Start a video consultation (/patient-portal?intent=video)
  - Source: packages/champagne-cta/src/CTARegistry.ts -> registry.video-consultation-portal
  - Engine: CTARegistry
- Secondary CTA: Emergency? See urgent care (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> video_consultation.ctas.heroCTAs[1]
  - Engine: manifest inline
- Hero sources:
  - headline: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> video_consultation.label
  - subhead: derived fallback
  - eyebrow: derived fallback

### PAGE CTAs
- Section: Start with a video consultation
  - Button: Start a video consultation (/patient-portal?intent=video)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> video_consultation.sections[5].ctas[0]
  - Engine: CTARegistry
- Section: Start with a video consultation
  - Button: Emergency? See urgent care (/treatments/emergency-dentistry)
  - Source: packages/champagne-manifests/data/champagne_machine_manifest_full.json -> video_consultation.sections[5].ctas[1]
  - Engine: page manifest section ctas

### FLAGS
- same-hero-as-other-pages: /video-consultation (hash: eb20ad6290093d955a420f75294039158ccf982c)
- same-CTAs-as-other-pages: /video-consultation (hash: 34b42db2c136f9d71ec5eeade200600d60ecb70c)
- suspicious/generic CTA language: none
- broken link / non-live route target: none

