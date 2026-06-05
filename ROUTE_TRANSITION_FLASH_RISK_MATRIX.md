# ROUTE_TRANSITION_FLASH_RISK_MATRIX

Mode: read-only risk matrix  
Evidence date: 2026-06-05

## Route categories

Root layout classifies public pages into categories and renders a global hero before route children when the brand hero flag is enabled. Most public route children render `ChampagnePageBuilder`, which introduces porcelain content beneath the hero.

## Risk matrix

| Route pattern | Example routes | Root/header | Hero binding/timing risk | Below-hero surface | Flash risk | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home | `/` | Ink root + sticky ink-mix header | High because home likely uses richest sacred hero stack/motion/bloom | Porcelain builder | High | Most visible candidate because hero assets/fx are richest and first impression is top-of-page. |
| Treatment detail | `/treatments/[slug]`, `/treatments/teeth-whitening`, `/treatments/implants-single-tooth` | Ink root + sticky ink-mix header | Medium-high due route-specific binding and treatment mode | Porcelain builder | High | Layout changes below hero can expose porcelain immediately after hero. |
| Treatment index | `/treatments` | Ink root + sticky ink-mix header | Medium | Porcelain builder | Medium-high | Utility category but still global hero + builder. |
| Utility public pages | `/about`, `/contact`, `/fees`, `/team`, `/smile-gallery` | Ink root + sticky ink-mix header | Medium depending on binding | Porcelain builder | Medium-high | Likely less motion-rich than home, but same surface mismatch pattern. |
| Editorial | `/blog` | Ink root + sticky ink-mix header | Medium | Porcelain builder | Medium | Editorial binding can still switch hero identity. |
| Dynamic site catch-all | `/[page]` | Ink root + sticky ink-mix header | Medium | Porcelain builder | Medium | Depends on resolved manifest path. |
| Patient portal | `/patient-portal` | Ink root + sticky ink-mix header | Medium | Route-specific content plus builder use | Medium | Includes its own portal UI before/around builder; should be separately captured. |
| Champagne tooling routes | `/champagne/hero-debug`, `/champagne/hero-preview`, `/champagne/hero-lab` | Root/header still exists, but `isPublicPage` false suppresses global hero | Low for public nav/hero flash; high only for tool diagnostics | Tool-specific | Low for reported public issue | Useful for diagnostics, not representative of public route flash. |
| Legal routes | `/legal/[slug]`, `/legal/privacy` | Ink root + sticky ink-mix header | Varies; public hero likely enabled unless path starts `/champagne/` | Porcelain builder for dynamic legal | Medium | Needs live route confirmation because route group differs. |

## Candidate cause classification by objective

| Cause class | Current assessment | Why |
| --- | --- | --- |
| CSS load order | Candidate, not proven | Theme import follows Tailwind directives and body/root background is declared in two places, but guards/build pass. |
| Hydration mismatch | Candidate, not proven | Server model path and client fallback/cache exist; no browser hydration warnings captured. |
| Root background mismatch | Strong candidate | Root/body/main behind hero are ink/transparent while content below is porcelain. |
| Nav/header surface mismatch | Strong contributor | Header is sticky and translucent over changing surfaces. |
| Hero fallback mismatch | Strong candidate | Fallback gradient and transparent frame/content can differ from root/steady hero. |
| Route-level surface mismatch | Strong candidate | Global hero before route children plus porcelain builder creates a recurring transition boundary. |
| Animation/motion timing | Contributor | V2 content fade and media readiness can expose base layers. |
| Font loading/layout shift | Secondary | No active font loading found; not primary surface-flash cause. |
| Another cause | Possible | Network asset timing, browser color-mix support, or header transparency over changing content may contribute. |

## Minimum future route capture set

1. `/`
2. `/about`
3. `/blog`
4. `/contact`
5. `/treatments`
6. `/treatments/teeth-whitening`
7. `/treatments/implants-single-tooth`
8. `/treatments/3d-digital-dentistry`

Each should be captured on direct load and by clicking from another public route, with PRM off and PRM on.
