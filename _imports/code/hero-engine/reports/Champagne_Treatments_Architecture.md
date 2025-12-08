[Champagne_Treatments_Architecture.md](https://github.com/user-attachments/files/23472057/Champagne_Treatments_Architecture.md)
# Champagne_Treatments_Architecture.md

## Route: `/treatments` (Hub)

**Section stack (top → bottom):**  
Hero → Value Grid → Featured Treatments → 3D Viewer Preview → Finance Band → FAQ Rail → Final CTA

**Build spec**  
- Components  
  - `<TreatmentHero variant="hub" />`  
  - `<ValueGrid tokens="smh" />`  
  - `<TreatmentCardGrid featuredSlugs={['veneers','implants','orthodontics/spark-aligners']} />`  
  - `<ThreeDViewer mode="preview" model="treatments-showcase.glb" poster="/brand/posters/treatments.webp" />`  
  - `<FinanceBand provider="tabeo" />`  
  - `<FAQRail group="treatments" />`  
  - `<CTASection intent="book|econsult|whatsapp" />`
- Props (union across modules)  
  - `title`, `lede`, `cards[]`, `previewModel`, `poster`, `financeId`, `faqGroup`, `cta[]`
- Tokens & layers  
  - Tokens: `var(--brand-magenta)`, `var(--brand-teal)`, `var(--brand-gold)`, `var(--brand-gold-keyline)`, `var(--ink)`, `var(--text)`, `var(--smh-gradient)`  
  - Layer stack: gradient → wave → particles → grain → glass → content
- Motion & guards  
  - Parallax ≤ `var(--parallax-max)` with PRM override; hover ≤1.03; easing `cubic-bezier(0.645,0.045,0.355,1)`  
  - Work in preview routes only; never touch sacred hero surfaces
- Performance budgets  
  - LCP ≤ 2.5s; hero ≤ 120 KB; poster images in AVIF/WEBP

**SEO spec**  
- Title: “Dental Treatments in Shoreham-by-Sea | Luxury Care & Technology”  
- Description: “Explore our smile solutions — from veneers to implants — with transparent finance and free e-consults.”  
- H1: “Our Treatments”  
- H2s: “Cosmetic Dentistry”, “Restorative Dentistry”, “Orthodontics”, “Advanced Tech”

**JSON-LD injection plan (hub)**  
- `ItemList` of `Service` items within Featured Treatments  
- `FAQPage` in FAQ Rail  
- `BreadcrumbList` in layout shell

**Accessibility notes**  
- Visible focus halo (soft-gold), heading hierarchy preserved, large tap targets on cards; PRM disables parallax and shimmer.

---

## Route: `/treatments/veneers`

**Section stack:**  
Hero → Benefits → How It Works → 3D Viewer → Pricing & Finance → Before/After Gallery → FAQs → Final CTA

**Build spec**  
- Components  
  - `<TreatmentHero slug="veneers" />`  
  - `<BenefitGrid group="veneers" />`  
  - `<HowToSteps schemaKey="veneers-process" steps={['Consultation','3D Planning','Treatment Day','Aftercare Review']} />`  
  - `<ThreeDViewer model="/3d/veneers.glb" poster="/brand/posters/veneers.webp" />`  
  - `<FinanceModule provider="tabeo" planGroup="veneers" />`  
  - `<BeforeAfterGallery group="veneers" />`  
  - `<FAQAccordion group="veneers" />`  
  - `<CTASection intent="book|econsult|whatsapp" />`
- Props  
  - `treatment`, `lede`, `benefits[]`, `steps[]`, `model`, `poster`, `priceRange`, `financeId`, `faqs[]`
- Tokens & layers  
  - Use brand tokens and the standard layer stack listed above

**SEO spec**  
- Meta title: “Veneers | Cost, Process & Results | St Mary’s House Dental”  
- Meta description: “Discover porcelain and composite veneer options with transparent pricing and free e-consults.”  
- H1: “Veneers in Shoreham-by-Sea”  
- H2s: Benefits · How It Works · Pricing & Finance · FAQs

**JSON-LD injection plan (veneers)**  
- `Service` (hero) with `areaServed` and `provider`  
- `HowTo` (How It Works) with four steps above  
- `FAQPage` (FAQ accordion)  
- `BreadcrumbList` (layout)  
- Optional `ImageObject` for gallery items  
- Tracking keys: `cta.click`, `finance.open`, `model.interact`

**Accessibility notes**  
- Each step is a focusable region with step number in `aria-label`; gallery images use descriptive alt like “Before veneers — upper laterals chipped / After veneers”.  
- PRM disables rotation/auto-orbit on 3D; provide a poster and keyboard controls.

---

## Route: `/treatments/implants`

**Section stack:**  
Hero → Benefits → How It Works → 3D Viewer (implant assembly/CBCT context) → Pricing & Finance → Before/After Gallery → FAQs → Final CTA

**Build spec**  
- Components  
  - `<TreatmentHero slug="implants" />`  
  - `<BenefitGrid group="implants" />`  
  - `<HowToSteps schemaKey="implant-process" />`  
  - `<ThreeDViewer model="/3d/implant.glb" poster="/brand/posters/implants.webp" />`  
  - `<FinanceModule provider="tabeo" planGroup="implants" />`  
  - `<BeforeAfterGallery group="implants" />`  
  - `<FAQAccordion group="implants" />`  
  - `<CTASection />`

**SEO spec**  
- Title: “Dental Implants | Permanent Tooth Replacement in Shoreham”  
- Description: “Advanced 3D-planned implants for lifelong results. View pricing and finance options online.”  
- H1/H2s patterned per treatments template

**JSON-LD**  
- `Service`, `HowTo`, `FAQPage`, `BreadcrumbList` (same injection points as veneers).

**Accessibility**  
- Ensure 3D focus management and captions where video demos are used; PRM offloads motion.

---

## Route: `/treatments/orthodontics/spark-aligners`

**Section stack:**  
Hero → Benefits → How It Works → 3D Viewer (aligner movement) → Pricing & Finance → Before/After Gallery → FAQs → Final CTA

**Build spec**  
- Components  
  - `<TreatmentHero slug="orthodontics/spark-aligners" />`  
  - `<BenefitGrid group="spark-aligners" />`  
  - `<HowToSteps schemaKey="aligner-process" />`  
  - `<ThreeDViewer model="/3d/spark-aligner.glb" poster="/brand/posters/spark.webp" />`  
  - `<FinanceModule provider="tabeo" planGroup="aligners" />`  
  - `<BeforeAfterGallery group="aligners" />`  
  - `<FAQAccordion group="aligners" />`  
  - `<CTASection />`

**SEO spec**  
- Title: “Spark Aligners | Invisible Orthodontics in Shoreham-by-Sea”  
- Description: “Discreet aligners with AI-guided tracking for precision and comfort. Free e-consult available.”  
- H1/H2s patterned per treatments template (Benefits · How It Works · Pricing & Finance · FAQs)

**JSON-LD**  
- `Service`, `HowTo`, `FAQPage`, `BreadcrumbList`.

**Accessibility**  
- Slider handles ≥ 44px; step progress announced via `aria-live="polite"`; PRM disables any looping motion.

---

### Global implementation notes (all pages)

- **Preview discipline:** build new sections in `/preview/treatments-light/` sandboxes; production heroes remain immutable.  
- **Manifests:** pull token values and any 3D asset references from `/public/brand/*.json` before wiring.  
- **Finance integration:** embed Tabeo flows with secure handoff.  
- **CWV budgets:** LCP/CLS targets; images in AVIF/WEBP; prefetch fonts; defer heavy widgets until idle.
