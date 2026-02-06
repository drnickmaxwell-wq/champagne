# PHASE 0A — Repo Truth Probe (Chatbot Build)

## Scope & Constraints
- No code changes; report-only per instructions.
- Excluded `apps/ops-api` and `apps/engine` from modification (no edits made).

## Commands Run + Outputs

### Directory tree: `apps` (depth 3)
Command:
```bash
find apps -maxdepth 3 -type d
```
Output:
```
apps
apps/engine
apps/engine/node_modules
apps/engine/node_modules/.bin
apps/engine/src
apps/ops-api
apps/ops-api/node_modules
apps/ops-api/node_modules/.bin
apps/ops-api/node_modules/@champagne
apps/ops-api/node_modules/@types
apps/ops-api/src
apps/portal
apps/portal/node_modules
apps/portal/node_modules/.bin
apps/portal/app
apps/chat-ui
apps/chat-ui/node_modules
apps/chat-ui/node_modules/.bin
apps/chat-ui/app
apps/stock
apps/stock/node_modules
apps/stock/node_modules/.bin
apps/stock/node_modules/@champagne
apps/stock/node_modules/@types
apps/stock/app
apps/stock/app/reorder
apps/stock/app/scan
apps/stock/app/item
apps/stock/app/lib
apps/web
apps/web/node_modules
apps/web/node_modules/.bin
apps/web/node_modules/@champagne
apps/web/node_modules/@types
apps/web/public
apps/web/public/assets
apps/web/app
apps/web/app/contact
apps/web/app/fees
apps/web/app/treatments
apps/web/app/dental-checkups-oral-cancer-screening
apps/web/app/_components
apps/web/app/api
apps/web/app/(champagne)
apps/web/app/sections
apps/web/app/patient-portal
apps/web/app/team
apps/web/app/(site)
apps/web/app/components
apps/web/app/champagne
apps/web/app/blog
```

### Directory tree: `packages` (depth 3)
Command:
```bash
find packages -maxdepth 3 -type d
```
Output:
```
packages
packages/champagne-stock-shared
packages/champagne-stock-shared/node_modules
packages/champagne-stock-shared/src
packages/champagne-cta
packages/champagne-cta/node_modules
packages/champagne-cta/node_modules/@champagne
packages/champagne-cta/src
packages/champagne-hero
packages/champagne-hero/node_modules
packages/champagne-hero/node_modules/@champagne
packages/champagne-hero/src
packages/champagne-hero/src/hero-engine
packages/champagne-3d
packages/champagne-3d/src
packages/champagne-guards
packages/champagne-guards/node_modules
packages/champagne-guards/locks
packages/champagne-guards/src
packages/champagne-guards/tools
packages/champagne-guards/tools/guard
packages/champagne-guards/config
packages/champagne-guards/scripts
packages/champagne-guards/public
packages/champagne-guards/public/brand
packages/champagne-guards/public/assets
packages/champagne-guards/tests
packages/champagne-guards/reports
packages/champagne-guards/components
packages/champagne-guards/components/hero
packages/champagne-guards/components/sections
packages/champagne-canon
packages/champagne-canon/manifests
packages/champagne-canon/canon
packages/champagne-canon/canon/motion
packages/champagne-canon/canon/ai
packages/champagne-canon/canon/fx
packages/champagne-canon/canon/environment
packages/champagne-canon/canon/behaviour
packages/champagne-canon/canon/3d
packages/champagne-canon/canon/dental
packages/champagne-canon/canon/system
packages/champagne-canon/canon/sensory
packages/champagne-canon/canon/emotion
packages/champagne-canon/canon/governance
packages/champagne-canon/canon/visual
packages/champagne-canon/canon/continuity
packages/champagne-canon/canon/narrative
packages/champagne-canon/src
packages/champagne-canon/tokens
packages/champagne-orchestrator
packages/champagne-orchestrator/src
packages/champagne-stock-db
packages/champagne-stock-db/migrations
packages/champagne-stock-db/node_modules
packages/champagne-stock-db/node_modules/.bin
packages/champagne-stock-db/src
packages/champagne-sections
packages/champagne-sections/node_modules
packages/champagne-sections/node_modules/@champagne
packages/champagne-sections/src
packages/champagne-sections/src/sections
packages/champagne-sections/src/__tests__
packages/champagne-sections/src/types
packages/champagne-tokens
packages/champagne-tokens/src
packages/champagne-tokens/styles
packages/champagne-tokens/styles/tokens
packages/champagne-tokens/styles/champagne
packages/champagne-manifests
packages/champagne-manifests/src
packages/champagne-manifests/src/__tests__
packages/champagne-manifests/scripts
packages/champagne-manifests/docs
packages/champagne-manifests/schema
packages/champagne-manifests/reports
packages/champagne-manifests/data
packages/champagne-manifests/data/media-decks
packages/champagne-manifests/data/hero
packages/champagne-manifests/data/ia
packages/champagne-manifests/data/sections
packages/champagne-governance
packages/champagne-governance/cta
packages/champagne-ai
packages/champagne-ai/src
```

### Path existence checks
Command:
```bash
[ -d apps/chat-ui ] && echo "apps/chat-ui TRUE" || echo "apps/chat-ui FALSE"
[ -d apps/engine ] && echo "apps/engine TRUE" || echo "apps/engine FALSE"
[ -d apps/ops-api ] && echo "apps/ops-api TRUE" || echo "apps/ops-api FALSE"
```
Output:
```
apps/chat-ui TRUE
apps/engine TRUE
apps/ops-api TRUE
```

### Search: exact `chat-ui` references
Command:
```bash
rg -n "chat-ui" --glob '!**/node_modules/**'
```
Output:
```
_champagne-extraction/extraction-inventory.md:450:- `assets-core/public/brand/chat-ui.json`
apps/chat-ui/app/page.tsx:6:        This is the placeholder shell for the <code>chat-ui</code> app inside the champagne-core monorepo.
apps/chat-ui/app/layout.tsx:6:  description: "Placeholder shell for the chat-ui app in the champagne-core monorepo.",
apps/chat-ui/package.json:2:  "name": "chat-ui",
package.json:11:    "dev:chat-ui": "pnpm --filter chat-ui dev",
pnpm-lock.yaml:51:  apps/chat-ui:
_imports/code/hero-engine/Manifest_Audit_Report.md:11:| `public/brand/chat-ui.json` | Champagne theming manifest for chat UI panels and gradients. |
_imports/code/hero-engine/Manifest_Audit_Report.md:55:### `public/brand/chat-ui.json`
_imports/code/hero-engine/Manifest_Audit_Report.md:74:- **Chat Experience**: `public/brand/chat-ui.json` layers on top of Champagne tokens, tying into phases like `chatbot_ui` in the director control file.
_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md:11:| `public/brand/chat-ui.json` | Champagne theming manifest for chat UI panels and gradients. |
_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md:55:### `public/brand/chat-ui.json`
_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md:74:- **Chat Experience**: `public/brand/chat-ui.json` layers on top of Champagne tokens, tying into phases like `chatbot_ui` in the director control file.
_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts:10:  const res = await fetch("/brand/chat-ui.json", { cache: "force-cache" });
_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts:11:  if (!res.ok) throw new Error("chat-ui manifest missing");
_imports/champagne-hero/docs/hero-file-inventory.md:201:| 194 | `lib/brand/chat-ui.ts` | `code/fx-system/lib/brand/chat-ui.ts` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/docs/hero-file-inventory.md:253:| 246 | `public/brand/chat-ui.json` | `code/fx-system/public/brand/chat-ui.json` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/code/fx-system/reports/Manifest_Schema_Check.md:38:## public/brand/chat-ui.json
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1115:      "path": "public/brand/chat-ui.json",
docs/champagne-import-phase1.md:29:- `apps/chat-ui/**`
docs/champagne-os/security/champagne-security-todo.md:13:  - chat-ui
docs/champagne-os/security/champagne-security-architecture.md:26:### 1.2 chat-ui (Champagne Concierge UI)
docs/champagne-os/security/champagne-security-architecture.md:65:    - chat-ui
docs/champagne-os/security/champagne-security-architecture.md:180:1. User interacts with **chat-ui** (in apps/web or separate).
docs/champagne-os/security/champagne-security-architecture.md:187:4. LLM response returned to engine → chat-ui → user.
docs/champagne-os/security/champagne-security-architecture.md:191:- chat-ui calling LLM directly from browser.
```

### Search: chatbot-related keywords
Keywords: concierge, orchestrator, chatbot, chat, assistant, messages, session, state machine

Command:
```bash
rg -n -i "concierge|orchestrator|chatbot|chat|assistant|messages|session|state machine" --glob '!**/node_modules/**'
```
Output (truncated only by display limit; raw terminal output below):
```
Total output lines: 516

packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:18:        "Course planning (often 2–3 sessions) with clear intervals",
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:48:        "Course design (typically two initial sessions 3–4 weeks apart)",
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:78:        "Treatment sessions: microdroplet injections with numbing support if needed",
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:79:        "Review: follow-up after the initial sessions to assess hydration and skin feel",
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:82:      "strapline": "Skin boosters build gradually. We do not rush sessions or stack products when the skin needs time to respond."
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json:131:          "answer": "Most patients notice improved hydration and suppleness after the first sessions, with further gains after the second or third treatment."
packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json:93:        "Comfort chat and plan for numbing",
packages/champagne-stock-shared/src/index.ts:5:export type StockScanSession = {
packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json:115:      "eyebrow": "When we suggest an orthodontic chat",
_champagne-extraction/extraction-inventory.md:167:- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingPlanSessionSection.tsx`
_champagne-extraction/extraction-inventory.md:219:- `preview-treatments-canonical/styles/preview/chat-tokens.css`
_champagne-extraction/extraction-inventory.md:450:- `assets-core/public/brand/chat-ui.json`
packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json:58:      "title": "A preview-driven planning session",
packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json:95:        "Review session to adjust proportions",
packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json:79:        "People facing longer restorative or implant sessions who want extra comfort",
_champagne-extraction/guards-and-scripts/Guards_Baseline_Report.md:13:- `styles/ai/chat-preview.css`
_champagne-extraction/guards-and-scripts/Guards_Baseline_Report.md:25:- `.json` files emit `WARN` messages when they are allowlisted manifests; other JSON diffs still fail if rogue HEX remains.
_champagne-extraction/guards-and-scripts/Guards_Baseline_Report.md:29:- Allowlisted paths log explicit `WARN` messages when HEX is still present, keeping visibility without blocking merges.
_champagne-extraction/guards-and-scripts/scripts/guard-rogue-hex.allow.json:10:    "styles/ai/chat-preview.css",
packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json:50:        "Clear plan for staged treatment rather than large single sessions"
packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json:135:          "answer": "We favour subtle changes and staged sessions. Photography and proportion checks help us avoid overfilling."
packages/champagne-manifests/data/sections/smh/treatment_journeys.json:5400:        "How many sessions are recommended?",
packages/champagne-manifests/data/sections/smh/treatment_journeys.json:5405:        "Plan session schedule",
packages/champagne-manifests/data/sections/smh/treatment_journeys.json:5630:        "How many sessions are needed?",
packages/champagne-manifests/data/sections/smh/treatment_journeys.json:5636:        "Plan session schedule",
packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json:62:        "Use desensitising products as advised between sessions",
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:49:        "Clear spacing between sessions (often 2–4 weeks) to allow healing",
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:50:        "Written aftercare and escalation guidance before the first session"
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:64:        "People prepared for a staged course with reviews rather than a single-session change",
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:79:        "Review: assessments to track skin response and comfort after each session",
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:92:      "body": "Polynucleotides are placed in superficial planes with fine needles to spread evenly and minimise bulk. Depth, spacing, and product amount are recorded so future sessions can be adjusted accurately.",
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:107:        "Follow-up visits confirm healing before any further sessions"
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:131:          "answer": "Skin often feels more supple within weeks, with further improvements over a staged course. We review progress after each session."
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json:143:          "answer": "Effects are gradual and course-based. We review after each session and can pause further treatment if expectations are not aligned."
REPORTS/CTA_JOURNEY_COVERAGE_AUDIT.md:279:    - Book a design session → /contact?topic=digital-dentistry
REPORTS/CTA_JOURNEY_COVERAGE_AUDIT.md:369:    - Book a planning session → /contact
packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json:47:        "Honest chat about when PEEK is and isn’t ideal",
REPORTS/CTA_JOURNEY_INVENTORY.md:259:  - Book a planning session → /contact (manifest (full_smile_makeover_closing_cta))
packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json:80:        "Planned whitening sessions at home",
packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json:115:          "label": "Book a planning session",
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:693:            "Comfort measures layered throughout the session",
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:718:              "description": "Comfort steps help reduce heat and sensitivity during the session."
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:730:          "quote": "Planning the shade and pacing the session keeps the experience calm while achieving a brighter finish.",
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:757:              "answer": "Cooling aids and pacing breaks are built in to keep the session comfortable."
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:768:          "title": "Plan an in-surgery whitening session",
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:977:          "strapline": "Book a planning session or preview a digital roadmap.",
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json:979:            { "label": "Book a planning session", "href": "/contact", "preset": "primary" },
packages/champagne-manifests/data/champagne_machine_manifest_full.json:2850:          "copy": "You’re welcome to contact the practice by phone or by using the enquiry form on this page.\n\nIf your question is straightforward, our reception team can usually help directly. If it’s more clinical, we’ll make sure it’s passed to the right person.\n\nMessages are read during normal opening hours and we aim to respond as promptly as we can. Email and online enquiries aren’t suitable for urgent dental problems.\n\nAny information provided before an appointment is general in nature and can’t replace a clinical assessment. Treatment recommendations, where appropriate, are only made after we’ve seen you and discussed your individual circumstances."
packages/champagne-manifests/data/champagne_machine_manifest_full.json:3253:          "copy": "Our patient portal is designed to keep key information in one secure place — helping you stay organised before, during and after appointments. Depending on what you’re using it for, the portal may include appointment details, forms, messages, treatment plans, and helpful aftercare information. If you’re not sure whether the portal is relevant for your situation, our team can guide you. We also keep communication simple: if you prefer to speak to us directly, you can always call the practice. The portal is an optional support tool, built around clarity and convenience rather than complexity."
packages/champagne-manifests/data/champagne_machine_manifest_full.json:5581:            "Planned whitening sessions at home",
packages/champagne-manifests/data/champagne_machine_manifest_full.json:5783:            "Use desensitising products as advised between sessions",
packages/champagne-manifests/data/champagne_machine_manifest_full.json:6146:              "label": "Book a planning session",
packages/champagne-manifests/data/champagne_machine_manifest_full.json:8736:          "eyebrow": "When we suggest an orthodontic chat",
packages/champagne-manifests/reports/CTA_INVENTORY_COSMETIC.md:36:     * Primary: “Book a planning session” → `/contact`
packages/champagne-manifests/reports/CTA_INVENTORY_COSMETIC.md:48:     * Primary: “Book a design session” → `/contact?topic=digital-dentistry`
apps/chat-ui/app/page.tsx:4:      <h1 className="text-2xl font-semibold">Champagne Concierge UI – Placeholder</h1>
apps/chat-ui/app/page.tsx:6:        This is the placeholder shell for the <code>chat-ui</code> app inside the champagne-core monorepo.
apps/chat-ui/app/layout.tsx:5:  title: "Champagne Concierge UI – Placeholder",
apps/chat-ui/app/layout.tsx:6:  description: "Placeholder shell for the chat-ui app in the champagne-core monorepo.",
apps/chat-ui/app/layout.tsx:10:  // NOTE: This UI-only shell for the Champagne Concierge; PHI and chat logs must be handled by the engine service.
apps/chat-ui/package.json:2:  "name": "chat-ui",
package.json:11:    "dev:chat-ui": "pnpm --filter chat-ui dev",
page-truth/treatments-dermal-fillers.txt:32:Clear plan for staged treatment rather than large single sessions
page-truth/treatments-dermal-fillers.txt:60:We favour subtle changes and staged sessions. Photography and proportion checks help us avoid overfilling.
page-truth/treatments-polynucleotides.txt:32:Clear spacing between sessions (often 2–4 weeks) to allow healing
page-truth/treatments-polynucleotides.txt:33:Written aftercare and escalation guidance before the first session
page-truth/treatments-polynucleotides.txt:47:Polynucleotides are placed in superficial planes with fine needles to spread evenly and minimise bulk. Depth, spacing, and product amount are recorded so future sessions can be adjusted accurately.
page-truth/treatments-polynucleotides.txt:59:Skin often feels more supple within weeks, with further improvements over a staged course. We review progress after each session.
page-truth/treatments-polynucleotides.txt:65:Effects are gradual and course-based. We review after each session and can pause further treatment if expectations are not aligned.
page-truth/treatments-childrens-dentistry.txt:38:When we suggest an orthodontic chat
page-truth/treatments-childrens-dentistry.txt:106:When we suggest an orthodontic chat
page-truth/contact.txt:27:Messages are read during normal opening hours and we aim to respond as promptly as we can. Email and online enquiries aren’t suitable for urgent dental problems.
packages/champagne-orchestrator/package.json:2:  "name": "@champagne/orchestrator",
page-truth/treatments-digital-smile-design.txt:29:A preview-driven planning session
page-truth/patient-portal.txt:3:Our patient portal is designed to keep key information in one secure place — helping you stay organised before, during and after appointments. Depending on what you’re using it for, the portal may include appointment details, forms, messages, treatment plans, and helpful aftercare information. If you’re not sure whether the portal is relevant for your situation, our team can guide you. We also keep communication simple: if you prefer to speak to us directly, you can always call the practice. The portal is an optional support tool, built around clarity and convenience rather than complexity.
page-truth/treatments-skin-boosters.txt:19:Course planning (often 2–3 sessions) with clear intervals
page-truth/treatments-skin-boosters.txt:31:Course design (typically two initial sessions 3–4 weeks apart)
page-truth/treatments-skin-boosters.txt:42:Skin boosters build gradually. We do not rush sessions or stack products when the skin needs time to respond.
page-truth/treatments-skin-boosters.txt:59:Most patients notice improved hydration and suppleness after the first sessions, with further gains after the second or third treatment.
page-truth/treatments-full-smile-makeover.txt:69:Book a planning session
page-truth/treatments-full-smile-makeover.txt:137:Book a planning session
packages/champagne-canon/canon/behaviour/cognitive-load-engine.md:14:- expresses worry in chat
packages/champagne-canon/canon/ai/01_persona_matrix.md:1:# Champagne Concierge Persona Matrix
reports/treatment_cta_audit.json:586:              "label": "Book a design session",
reports/treatment_cta_audit.json:860:              "label": "Book a planning session",
packages/champagne-guards/Guards_Baseline_Report.md:13:- `styles/ai/chat-preview.css`
packages/champagne-guards/Guards_Baseline_Report.md:25:- `.json` files emit `WARN` messages when they are allowlisted manifests; other JSON diffs still fail if rogue HEX remains.
packages/champagne-guards/Guards_Baseline_Report.md:29:- Allowlisted paths log explicit `WARN` messages when HEX is still present, keeping visibility without blocking merges.
packages/champagne-guards/scripts/guard-hero.mjs:44:  const forbiddenTokens = ['fetch(', 'axios.', 'document.', 'window.', 'localStorage', 'sessionStorage'];
reports/hero/phase1-hero-v2-truth-table-upgrade.md:11:**Evidence required by task:** a single table after settle that includes the computed compositing fields for each surface, plus content z-index. This logger is now installed inside `HeroRendererV2.tsx`, scoped to `HERO_V2_DEBUG` or `?heroTruth=1` sessions. This phase makes no visual changes.
reports/hero/phase1-hero-v2-truth-table-upgrade.md:53:**After (Phase 1):** Logger is installed. Runtime capture is **pending** until a V2 homepage session is exercised with `HERO_V2_DEBUG=1` or `?heroTruth=1`.
reports/hero/sacred-stability-report.md:87:- **Repeated opacity resets prevented** in the same session:
_imports/code/hero-components/components/sections/home/Hero_Ai24.tsx:26:          Elevate every appointment with immersive previews, real-time treatment planning, and concierge-level follow up. The
_imports/code/hero-components/components/sections/home/Hero_Ai24.tsx:66:            ['Patient Concierge', 'Automated check-ins that feel bespoke.'],
reports/hero_cta_inventory.md:1822:  - Button: Book a planning session (/contact)
_imports/code/hero-engine/Repo_Audit.json:30:      "path": "/api/chat",
_imports/code/hero-engine/Repo_Audit.json:31:      "file": "app/api/chat/route.ts",
_imports/code/hero-engine/Repo_Audit.json:112:      "path": "/preview/chat",
_imports/code/hero-engine/Repo_Audit.json:113:      "file": "app/preview/chat/page.tsx",
_imports/code/hero-engine/Repo_Audit.json:114:      "component": "ChatPreviewPage",
_imports/code/hero-engine/Manifest_Audit_Report.md:11:| `public/brand/chat-ui.json` | Champagne theming manifest for chat UI panels and gradients. |
_imports/code/hero-engine/Manifest_Audit_Report.md:55:### `public/brand/chat-ui.json`
_imports/code/hero-engine/Manifest_Audit_Report.md:56:- **Components/Effects**: Defines theming variables for chat UI glass panels and gradients.
_imports/code/hero-engine/Manifest_Audit_Report.md:57:- **Manus/Codex Linkage**: Uses Champagne tokens to keep Manus AI chatbot surfaces aligned with Codex guard rails.
_imports/code/hero-engine/Manifest_Audit_Report.md:66:- **Components/Pages/Routes**: Maps preview routes (`/preview/hero-gilded`, `/preview/chat`, `/preview/footer-luxe`) and program phases (e.g., `telemedicine`, `ai_smile_quiz`).
_imports/code/hero-engine/Manifest_Audit_Report.md:74:- **Chat Experience**: `public/brand/chat-ui.json` layers on top of Champagne tokens, tying into phases like `chatbot_ui` in the director control file.
_imports/code/hero-engine/Manifest_Audit_Report.md:83:1. **AI Concierge**
_imports/code/hero-engine/Manifest_Audit_Report.md:84:   - Extend `public/brand/manus_import_unified_manifest_20251104.json` with a new React entry (e.g., `concierge-champagne`) pointing to concierge UI components and reuse chat UI theming for consistency.
_imports/code/hero-engine/Manifest_Audit_Report.md:85:   - Register a `/preview/concierge` route and add guard assertions in `docs/director-control.json` to incorporate concierge checks alongside existing preview pages.
reports/hero_cta_inventory.json:4494:          "label": "Book a planning session",
reports/content_readiness_report.json:135:      "excerpt": "Our patient portal is designed to keep key information in one secure place — helping you stay organised before, during and after appointments. Depending on what you’re using it for, the portal may include appointment details, forms, messages, treatment plans, and helpful aftercare information. If you’re not sure whether the portal is relevant for your situation, our team can guide you. We also keep communication simple: if you prefer to speak to us directly, you can always call the practice. The portal is an optional support tool, built around clarity and convenience rather than complexity."
reports/content_readiness_report.md:256:> Our patient portal is designed to keep key information in one secure place — helping you stay organised before, during and after appointments. Depending on what you’re using it for, the portal may include appointment details, forms, messages, treatment plans, and helpful aftercare information. If you’re not sure whether the portal is relevant for your situation, our team can guide you. We also keep communication simple: if you prefer to speak to us directly, you can always call the practice. The portal is an optional support tool, built around clarity and convenience rather than complexity.
_imports/code/hero-engine/reports/Repo_Audit.json:34:      "path": "/api/chat",
_imports/code/hero-engine/reports/Repo_Audit.json:35:      "file": "app/api/chat/route.ts",
_imports/code/hero-engine/reports/Repo_Audit.json:124:      "path": "/preview/chat",
_imports/code/hero-engine/reports/Repo_Audit.json:125:      "file": "app/preview/chat/page.tsx",
_imports/code/hero-engine/reports/Repo_Audit.json:126:      "component": "ChatPreviewPage",
_imports/code/hero-engine/reports/Repo_Audit.json:745:        "components/ai/luxury-chatbot.tsx",
_imports/code/hero-engine/reports/Repo_Audit.json:748:        "styles/ai/chat-preview.css",
_imports/code/hero-engine/reports/Champagne_Repo_Recon_Report.md:8:- **Preview sandboxes:** `/champagne-preview` mirrors the locked hero; `/preview/home` composes full home sections for experimentation; `/preview/hero-gilded` hosts experimental gold/motion toggles with PRM handling; additional preview canvases exist for chat, treatments, technology, footer, and brand lock. 【F:app/champagne-preview/page.tsx†L1-L10】【F:app/preview/home/page.tsx†L1-L78】【F:app/preview/hero-gilded/page.tsx†L1-L143】
_imports/code/hero-engine/reports/Preview_Treatments_Canvas_Final_Lock_Report.md:39:(Commands may be unavailable in the current …9679 tokens truncated…, /preview/FooterLuxePreview.tsx, /preview/HeroGilded.tsx, /preview/TreatmentBanner.tsx, /preview/ai24-home, /preview/ai24-home/page.tsx, /preview/brand-live, /preview/brand-live/page.tsx, /preview/brand-lock, /preview/brand-lock/page.tsx, /preview/champagne, /preview/champagne-phase2, /preview/champagne-phase2/page.tsx, /preview/champagne/footer.css, /preview/champagne/layers.css, /preview/champagne/page.css, /preview/champagne/page.tsx, /preview/chat, /preview/chat/page.tsx, /preview/footer-luxe, /preview/footer-luxe/page.tsx, /preview/hero-gilded, /preview/hero-gilded/page.tsx, /preview/lux, /preview/lux/gallery, /preview/lux/gallery/page.tsx, /preview/lux/legal, /preview/lux/legal/cookies, /preview/lux/legal/cookies/page.tsx, /preview/lux/legal/page.tsx, /preview/lux/legal/privacy, /preview/lux/legal/privacy/page.tsx, /preview/lux/legal/terms, /preview/lux/legal/terms/page.tsx, /preview/lux/locations/brighton, /preview/lux/locations/hove, /preview/lux/locations/hove/page.tsx, /preview/lux/locations/lancing, /preview/lux/locations/lancing/page.tsx, /preview/lux/locations/shoreham-by-sea, /preview/lux/locations/shoreham-by-sea/page.tsx, /preview/lux/locations/steyning, /preview/lux/locations/steyning/page.tsx, /preview/lux/locations/worthing, /preview/lux/locations/worthing/page.tsx, /preview/lux/page.tsx, /preview/lux/patient-stories, /preview/lux/patient-stories/page.tsx, /preview/lux/referrals, /preview/lux/referrals/page.tsx, /preview/lux/smile-ai, /preview/lux/smile-ai/page.tsx, /preview/lux/team, /preview/lux/team/, /preview/lux/team/page.tsx, /preview/lux/technology, /preview/lux/technology/page.tsx, /preview/manus-audit, /preview/manus-audit/page.tsx, /preview/manus-manifest, /preview/manus-manifest/page.tsx, /preview/treatments, /preview/treatments/3d-dentistry, /preview/treatments/3d-dentistry/page.tsx, /preview/treatments/composite-bonding, /preview/treatments/composite-bonding/page.tsx, /preview/treatments/cosmetic, /preview/treatments/cosmetic/page.tsx, /preview/treatments/dental-implants, /preview/treatments/dental-implants/page.tsx, /preview/treatments/general, /preview/treatments/general/page.tsx, /preview/treatments/implants, /preview/treatments/implants/page.tsx, /preview/treatments/orthodontics, /preview/treatments/orthodontics/page.tsx, /preview/treatments/page.tsx, /preview/treatments/technology, /preview/treatments/technology/page.tsx, /preview/treatments/veneers, /preview/treatments/veneers/page.tsx, /preview/treatments/whitening, /preview/treatments/whitening/page.tsx, /preview/why-hero-grey, /preview/why-hero-grey/page.tsx, public/assets/champagne/manifest.json, public/brand/manifest.json
_imports/champagne-hero/code/fx-system/reports/TECHNOLOGY_IMPORT_AUDIT.md:98:├ ƒ /api/chat                                               0 B            0 B
_imports/champagne-hero/code/fx-system/reports/seo/SEO_Content_Plan.md:8:- Meet Your AI Concierge  
_imports/champagne-hero/code/fx-system/reports/Manifest_Framework_Report.md:14:- `config/champagne/manus/Manus_Section_Catalog.json` — Guard-safe Manus section catalog listing hero/value/stories/treatment/portal/chatbot sections with status + layer/tokens/motion budgets (active for knowledge index and audits; assets largely missing, so implementations are dormant).
_imports/champagne-hero/code/fx-system/reports/Manifest_Framework_Report.md:19:**Intended use:** Manus catalogs describe the desired section inventory (hero, value-trio, treatments, portal/chatbot) with readiness flags; Atlas docs guide how Manus drops should map into preview routes and future portal work. Current code doesn’t wire sections automatically, leaving many definitions dormant until assets arrive.
update_treatment_journeys.py:895:            "secondary_intent": link("Plan skin booster sessions", "skin-boosters"),
pnpm-lock.yaml:51:  apps/chat-ui:
pnpm-lock.yaml:257:  packages/champagne-orchestrator: {}
_imports/champagne-hero/code/fx-system/advanced-web-features-audit.md:77:    - OpenAI GPT-4 for chat assistance
_imports/champagne-hero/docs/hero-file-inventory.md:85:| 78 | `components/ai/luxury-chatbot.tsx` | `code/fx-system/components/ai/luxury-chatbot.tsx` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/docs/hero-file-inventory.md:201:| 194 | `lib/brand/chat-ui.ts` | `code/fx-system/lib/brand/chat-ui.ts` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/docs/hero-file-inventory.md:253:| 246 | `public/brand/chat-ui.json` | `code/fx-system/public/brand/chat-ui.json` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/docs/hero-file-inventory.md:403:| 396 | `styles/ai/chat-preview.css` | `code/fx-system/styles/ai/chat-preview.css` | `fx-system` | FX / motion / layer stack related code |
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:579:            "chatbot-backend-railway.zip",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:580:            "chatbot-luxury-ui-pack.zip",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1070:          "chatbot-backend-railway.zip",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1071:          "chatbot-luxury-ui-pack.zip",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1115:      "path": "public/brand/chat-ui.json",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1116:      "type": "chat_ui",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:1117:      "label": "Chat UI Manifest",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2042:            "path": "/api/chat",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2043:            "file": "app/api/chat/route.ts",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2132:            "path": "/preview/chat",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2133:            "file": "app/preview/chat/page.tsx",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2134:            "component": "ChatPreviewPage",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2753:              "components/ai/luxury-chatbot.tsx",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2756:              "styles/ai/chat-preview.css",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2814:          "/preview/chat",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2815:          "/preview/chat/page.tsx",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2902:          "/preview/chat",
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json:2903:          "/preview/chat/page",
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:42:- Guard-safe catalog enumerates portal/chatbot/teleconsult/finance/FAQ and multiple treatment sections, most marked **missing** with empty `assetRefs`, indicating design intent without delivered assets.【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L390】
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:54:### Chatbot / Concierge UI
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:55:- `/ai-concierge` section marked **ready** with assetRefs pointing to Manus chatbot guides/components not present in repo; no chatbot UI imports under Manus naming exist, leaving the concept dormant.【F:config/champagne/manus/Manus_Section_Catalog.json†L198-L207】
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:67:  - Composite bonding preview catalog and guard-safe catalog entries for treatments/portal/chatbot/finance/etc. have no corresponding components; manifests reference non-existent entries (dormant definitions).【F:config/champagne/Manus_Section_Catalog.json†L1-L78】【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:75:- **Safe to Re-render via Manus:** Catalog entries marked **ready** (hero, 3d-ar, ai-concierge, footer) can be regenerated from Manus exports without conflicting local code because no overlapping implementations exist; ensure tokenized gradients and PRM gating per catalog specs.【F:config/champagne/manus/Manus_Section_Catalog.json†L5-L59】【F:config/champagne/manus/Manus_Section_Catalog.json†L393-L429】
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:77:- **Needs Re-generation:** Missing treatment/portal/chatbot sections marked **missing** in catalogs should be re-generated by Manus before wiring (no source assets exist).【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md:98:3. Revive dormant section definitions (value-trio, patient-stories, priority-treatments, portal/chatbot/finance) by requesting Manus exports matching catalog specs and hooking them into preview pages with tokenized gradients and PRM support.【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L390】
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Audit_Report.md:238:3. **Chatbot main panel integrated into site design**  
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Audit_Report.md:275:| / | ai-concierge | ready | SoftwareApplication | Compliant structure; ensure tokenised colours and AA contrast. |
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Integration_Roadmap.md:315:## 3. Chatbot Panel (Champagne Integrated)  
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Integration_Roadmap.md:378:- Wire hero (immutable), value-trio, patient-stories, priority-treatments, 3d-ar, ai-concierge, teleconsult, finance, faq, local-proof, footer.
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md:381:7. **Chatbot Panel (Champagne Integrated)**  
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md:410:    "CHATBOT_PANEL_CHAMPAGNE_V1",
_imports/champagne-hero/manus/notes/public/brand/manus_import_unified_manifest_20251104.json:24:      "chatbot-backend-railway.zip",
_imports/champagne-hero/manus/notes/public/brand/manus_import_unified_manifest_20251104.json:25:      "chatbot-luxury-ui-pack.zip",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:15:      "notes": "Patient portal home with cards for treatment plans, documents, payments, messages. Use Champagne hero logic but lighter, app-feel glass.",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:36:      "id": "CHATBOT_PANEL_CHAMPAGNE_V1",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:37:      "routeContext": "/ai/concierge",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:38:      "componentKind": "chatbot-shell",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:39:      "referenceAtlasSection": "gaps.chatbot-panel",
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json:41:      "notes": "Champagne-branded chatbot panel for future AI Concierge. Dockable in bottom-right; can expand to full-height panel on mobile.",
_imports/champagne-hero/manus/notes/config/champagne/Manus_Section_Catalog.json:36:      "id": "compositeBondingPlanSession",
_imports/champagne-hero/manus/notes/config/champagne/Manus_Section_Catalog.json:37:      "label": "Composite Bonding Plan Session",
_imports/champagne-hero/manus/notes/config/champagne/Manus_Section_Catalog.json:40:        "app/preview/treatments/composite-bonding/_sections/CompositeBondingPlanSessionSection.tsx"
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:210:      "id": "/:ai-concierge",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:212:      "section": "ai-concierge",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:238:        "EXTRAMANUS/luxury-chatbot-engine.ts",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:239:        "EXTRAMANUS/luxury-chatbot-widget.tsx",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:240:        "MANUSCOMPONENTS/AI-CHATBOT-IMPLEMENTATION-GUIDE.md",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:241:        "MANUSCOMPONENTS/components/ai/luxury-chatbot.tsx",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:242:        "MANUSCOMPONENTS/luxury-chatbot-engine.ts",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:243:        "MANUSCOMPONENTS/luxury-chatbot-widget.tsx",
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json:244:        "MANUSCOMPONENTS/luxury-chatbot.tsx"
_truth_output/cta_text_truth.json:7122:    "currentText": "Book a planning session",
_truth_output/cta_text_truth.json:7125:      "startsWith": "Book a planning session",
_truth_output/cta_text_truth.json:7126:      "endsWith": "Book a planning session"
_truth_output/page_content_truth.json:1942:    "currentText": "You’re welcome to contact the practice by phone or by using the enquiry form on this page.\n\nIf your question is straightforward, our reception team can usually help directly. If it’s more clinical, we’ll make sure it’s passed to the right person.\n\nMessages are read during normal opening hours and we aim to respond as promptly as we can. Email and online enquiries aren’t suitable for urgent dental problems.\n\nAny information provided before an appointment is general in nature and can’t replace a clinical assessment. Treatment recommendations, where appropriate, are only made after we’ve seen you and discussed your individual circumstances."
_truth_output/page_content_truth.json:3801:    "currentText": "Our patient portal is designed to keep key information in one secure place — helping you stay organised before, during and after appointments. Depending on what you’re using it for, the portal may include appointment details, forms, messages, treatment plans, and helpful aftercare information. If you’re not sure whether the portal is relevant for your situation, our team can guide you. We also keep communication simple: if you prefer to speak to us directly, you can always call the practice. The portal is an optional support tool, built around clarity and convenience rather than complexity."
_truth_output/page_content_truth.json:18409:    "currentText": "When we suggest an orthodontic chat",
_truth_output/page_content_truth.json:18413:      "endsWith": "ggest an orthodontic chat"
_truth_output/page_content_truth.json:27759:    "currentText": "Clear plan for staged treatment rather than large single sessions",
_truth_output/page_content_truth.json:27763:      "endsWith": "han large single sessions"
_truth_output/page_content_truth.json:28155:    "currentText": "We favour subtle changes and staged sessions. Photography and proportion checks help us avoid overfilling.",
_truth_output/page_content_truth.json:28595:    "currentText": "A preview-driven planning session",
_truth_output/page_content_truth.json:28599:      "endsWith": "w-driven planning session"
_truth_output/page_content_truth.json:28738:    "currentText": "Review session to adjust proportions",
_truth_output/page_content_truth.json:28741:      "startsWith": "Review session to adjust "
_truth_output/page_content_truth.json:37351:    "currentText": "Planned whitening sessions at home",
_truth_output/page_content_truth.json:37354:      "startsWith": "Planned whitening session",
_truth_output/page_content_truth.json:37355:      "endsWith": "hitening sessions at home"
_truth_output/page_content_truth.json:50518:    "currentText": "Comfort chat and plan for numbing",
_truth_output/page_content_truth.json:50521:      "startsWith": "Comfort chat and plan for",
_truth_output/page_content_truth.json:50522:      "endsWith": "chat and plan for numbing"
_truth_output/page_content_truth.json:51068:    "currentText": "Honest chat about when PEEK is and isn’t ideal",
_truth_output/page_content_truth.json:51071:      "startsWith": "Honest chat about when PE",
_truth_output/page_content_truth.json:52630:    "currentText": "Clear spacing between sessions (often 2–4 weeks) to allow healing",
_truth_output/page_content_truth.json:52641:    "currentText": "Written aftercare and escalation guidance before the first session",
_truth_output/page_content_truth.json:52645:      "endsWith": " before the first session"
_truth_output/page_content_truth.json:52729:    "currentText": "People prepared for a staged course with reviews rather than a single-session change",
_truth_output/page_content_truth.json:52733:      "endsWith": "n a single-session change"
_truth_output/page_content_truth.json:52806:    "currentText": "Review: assessments to track skin response and comfort after each session",
_truth_output/page_content_truth.json:52810:      "endsWith": "omfort after each session"
_truth_output/page_content_truth.json:52850:    "currentText": "Polynucleotides are placed in superficial planes with fine needles to spread evenly and minimise bulk. Depth, spacing, and product amount are recorded so future sessions can be adjusted accurately.",
_truth_output/page_content_truth.json:52960:    "currentText": "Follow-up visits confirm healing before any further sessions",
_truth_output/page_content_truth.json:52964:      "endsWith": "fore any further sessions"
_truth_output/page_content_truth.json:53015:    "currentText": "Skin often feels more supple within weeks, with further improvements over a staged course. We review progress after each session.",
_truth_output/page_content_truth.json:53019:      "endsWith": "gress after each session."
_truth_output/page_content_truth.json:53081:    "currentText": "Effects are gradual and course-based. We review after each session and can pause further treatment if expectations are not aligned.",
_truth_output/page_content_truth.json:54412:    "currentText": "People facing longer restorative or implant sessions who want extra comfort",
_truth_output/page_content_truth.json:56337:    "currentText": "Course planning (often 2–3 sessions) with clear intervals",
_truth_output/page_content_truth.json:56491:    "currentText": "Course design (typically two initial sessions 3–4 weeks apart)",
_truth_output/page_content_truth.json:56495:      "endsWith": "sessions 3–4 weeks apart)"
_truth_output/page_content_truth.json:56667:    "currentText": "Treatment sessions: microdroplet injections with numbing support if needed",
_truth_output/page_content_truth.json:56670:      "startsWith": "Treatment sessions: micro"
_truth_output/page_content_truth.json:56678:    "currentText": "Review: follow-up after the initial sessions to assess hydration and skin feel",
_truth_output/page_content_truth.json:56700:    "currentText": "Skin boosters build gradually. We do not rush sessions or stack products when the skin needs time to respond.",
_truth_output/page_content_truth.json:56887:    "currentText": "Most patients notice improved hydration and suppleness after the first sessions, with further gains after the second or third treatment.",
_truth_output/page_content_truth.json:63300:    "currentText": "Use desensitising products as advised between sessions",
_truth_output/page_content_truth.json:63304:      "endsWith": " advised between sessions"
```

## Results With Notes (Paths + 1–2 Line Notes)

### Exact `chat-ui` references (unique files)
Command used to extract unique file list:
```bash
rg -n "chat-ui" --glob '!**/node_modules/**' | awk -F: '{print $1}' | sort -u
```
Output:
```
_champagne-extraction/extraction-inventory.md
_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts
_imports/champagne-hero/code/fx-system/reports/Manifest_Schema_Check.md
_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md
_imports/champagne-hero/docs/hero-file-inventory.md
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json
_imports/code/hero-engine/Manifest_Audit_Report.md
apps/chat-ui/app/layout.tsx
apps/chat-ui/app/page.tsx
apps/chat-ui/package.json
docs/champagne-import-phase1.md
docs/champagne-os/security/champagne-security-architecture.md
docs/champagne-os/security/champagne-security-todo.md
package.json
pnpm-lock.yaml
```

Notes:
- `_champagne-extraction/extraction-inventory.md` — Inventory references `chat-ui` assets; contains a line mentioning `chat-ui.json` in extraction list.
- `_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts` — Helper code references `/brand/chat-ui.json` manifest; mentions `chat-ui` in fetch/error string.
- `_imports/champagne-hero/code/fx-system/reports/Manifest_Schema_Check.md` — Report section on `public/brand/chat-ui.json` schema.
- `_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md` — Audit report mentions `chat-ui` manifest and chat experience notes.
- `_imports/champagne-hero/docs/hero-file-inventory.md` — Inventory table lists chat-ui related files.
- `_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json` — Snapshot includes `chat-ui` manifest path.
- `_imports/code/hero-engine/Manifest_Audit_Report.md` — Audit report mentions `chat-ui` manifest in hero-engine docs copy.
- `apps/chat-ui/app/layout.tsx` — Placeholder app metadata includes `chat-ui` description.
- `apps/chat-ui/app/page.tsx` — Placeholder UI copy includes `chat-ui` name.
- `apps/chat-ui/package.json` — Package name is `chat-ui`.
- `docs/champagne-import-phase1.md` — Docs include `apps/chat-ui/**` in import scope list.
- `docs/champagne-os/security/champagne-security-architecture.md` — Security architecture includes `chat-ui` references and flow notes.
- `docs/champagne-os/security/champagne-security-todo.md` — Security TODO list includes a `chat-ui` item.
- `package.json` — Root scripts include `dev:chat-ui`.
- `pnpm-lock.yaml` — Lockfile includes `apps/chat-ui` entry.

### Chatbot-related keyword search (unique files)
Command used to extract unique file list:
```bash
rg -n -i "concierge|orchestrator|chatbot|chat|assistant|messages|session|state machine" --glob '!**/node_modules/**' | awk -F: '{print $1}' | sort -u
```
Output:
```
REPORTS/CTA_JOURNEY_COVERAGE_AUDIT.md
REPORTS/CTA_JOURNEY_INVENTORY.md
_champagne-extraction/extraction-inventory.md
_champagne-extraction/guards-and-scripts/Guards_Baseline_Report.md
_champagne-extraction/guards-and-scripts/scripts/guard-rogue-hex.allow.json
_imports/champagne-hero/code/fx-system/advanced-web-features-audit.md
_imports/champagne-hero/code/fx-system/components/ai/ai-smile-analysis.tsx
_imports/champagne-hero/code/fx-system/components/ai/luxury-chatbot.tsx
_imports/champagne-hero/code/fx-system/components/home/home-page-client.tsx
_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts
_imports/champagne-hero/code/fx-system/reports/Manifest_Framework_Report.md
_imports/champagne-hero/code/fx-system/reports/Manifest_Schema_Check.md
_imports/champagne-hero/code/fx-system/reports/TECHNOLOGY_IMPORT_AUDIT.md
_imports/champagne-hero/code/fx-system/reports/seo/SEO_Content_Plan.md
_imports/champagne-hero/code/fx-system/styles/ai/chat-preview.css
_imports/champagne-hero/code/guards/Guards_Baseline_Report.md
_imports/champagne-hero/code/guards/README.md
_imports/champagne-hero/code/guards/docs/Changelog.md
_imports/champagne-hero/code/guards/docs/DEPARTMENTS.md
_imports/champagne-hero/code/guards/docs/Director_Launch.md
_imports/champagne-hero/code/guards/reports/Champagne_Page_Strategy_Report.md
_imports/champagne-hero/code/guards/reports/Repo_Audit_Report.md
_imports/champagne-hero/code/guards/reports/Route_Framework_Report.md
_imports/champagne-hero/code/guards/reports/Scaffold_Report.md
_imports/champagne-hero/code/guards/scripts/guard-rogue-hex.allow.json
_imports/champagne-hero/code/hero-components/components/sections/home/Hero_Ai24.tsx
_imports/champagne-hero/code/hero-engine/DIRECTOR.md
_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md
_imports/champagne-hero/code/hero-engine/Repo_Audit.json
_imports/champagne-hero/code/hero-engine/docs/Blueprint.md
_imports/champagne-hero/code/hero-engine/docs/Champagne_Page_Architecture.md
_imports/champagne-hero/code/hero-engine/docs/director-control.json
_imports/champagne-hero/code/hero-engine/reports/Champagne_Repo_Recon_Report.md
_imports/champagne-hero/code/hero-engine/reports/Preview_Treatments_Canvas_Final_Lock_Report.md
_imports/champagne-hero/code/hero-engine/reports/Repo_Audit.json
_imports/champagne-hero/docs/hero-file-inventory.md
_imports/champagne-hero/manus/notes/config/champagne/Manus_Section_Catalog.json
_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json
_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Integration_Roadmap.md
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Audit_Report.md
_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md
_imports/champagne-hero/manus/notes/public/brand/manus_import_unified_manifest_20251104.json
_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md
_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json
_imports/code/hero-components/components/sections/home/Hero_Ai24.tsx
_imports/code/hero-engine/DIRECTOR.md
_imports/code/hero-engine/Manifest_Audit_Report.md
_imports/code/hero-engine/Repo_Audit.json
_imports/code/hero-engine/docs/Blueprint.md
_imports/code/hero-engine/docs/Champagne_Page_Architecture.md
_imports/code/hero-engine/docs/director-control.json
_imports/code/hero-engine/reports/Champagne_Repo_Recon_Report.md
_imports/code/hero-engine/reports/Preview_Treatments_Canvas_Final_Lock_Report.md
_imports/code/hero-engine/reports/Repo_Audit.json
_truth_output/cta_text_truth.json
_truth_output/page_content_truth.json
apps/chat-ui/app/layout.tsx
apps/chat-ui/app/page.tsx
apps/chat-ui/package.json
docs/champagne-import-phase1.md
docs/champagne-os/ai/champagne-ai-persona-matrix.md
docs/champagne-os/ai/champagne-ai-personas.json
docs/champagne-os/emotion/champagne-emotional-hooks-notes.md
docs/champagne-os/emotion/champagne-emotional-lighting-canon.md
docs/champagne-os/security/champagne-ai-gateway-config.json
docs/champagne-os/security/champagne-ai-gateway-policy.md
docs/champagne-os/security/champagne-data-classes.json
docs/champagne-os/security/champagne-retention-and-access.json
docs/champagne-os/security/champagne-security-architecture.md
docs/champagne-os/security/champagne-security-todo.md
docs/champagne-os/tenants/champagne-bundles.json
docs/champagne-os/tenants/champagne-saas-onboarding-notes.md
docs/champagne-os/tenants/champagne-tenant-manifests-notes.md
docs/champagne-os/tenants/champagne-tenants.json
package.json
packages/champagne-canon/canon/ai/01_persona_matrix.md
packages/champagne-canon/canon/behaviour/cognitive-load-engine.md
packages/champagne-guards/Guards_Baseline_Report.md
packages/champagne-guards/scripts/guard-hero.mjs
packages/champagne-manifests/data/champagne_machine_manifest_full.json
packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json
packages/champagne-manifests/data/sections/smh/treatment_journeys.json
packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json
packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json
packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json
packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json
packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json
packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json
packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json
packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json
packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json
packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json
packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json
packages/champagne-manifests/reports/CTA_INVENTORY_COSMETIC.md
packages/champagne-orchestrator/package.json
packages/champagne-stock-shared/src/index.ts
page-truth/contact.txt
page-truth/patient-portal.txt
page-truth/treatments-childrens-dentistry.txt
page-truth/treatments-dermal-fillers.txt
page-truth/treatments-digital-smile-design.txt
page-truth/treatments-full-smile-makeover.txt
page-truth/treatments-polynucleotides.txt
page-truth/treatments-skin-boosters.txt
pnpm-lock.yaml
reports/content_readiness_report.json
reports/content_readiness_report.md
reports/hero/phase1-hero-v2-truth-table-upgrade.md
reports/hero/sacred-stability-report.md
reports/hero_cta_inventory.json
reports/hero_cta_inventory.md
reports/patient_content_audit/content_truth_map.json
reports/treatment_cta_audit.json
update_treatment_journeys.py
```

Notes (per file):
- `REPORTS/CTA_JOURNEY_COVERAGE_AUDIT.md` — Matches `session` in CTA audit text (planning/design session labels).
- `REPORTS/CTA_JOURNEY_INVENTORY.md` — Matches `session` in CTA inventory entries.
- `_champagne-extraction/extraction-inventory.md` — Contains `chat`/`chat-ui` asset references in extraction inventory.
- `_champagne-extraction/guards-and-scripts/Guards_Baseline_Report.md` — Includes `chat-preview` references in guards report.
- `_champagne-extraction/guards-and-scripts/scripts/guard-rogue-hex.allow.json` — Allowlist includes `chat-preview` path.
- `_imports/champagne-hero/code/fx-system/advanced-web-features-audit.md` — Mentions chat assistance in audit notes.
- `_imports/champagne-hero/code/fx-system/components/ai/ai-smile-analysis.tsx` — Contains `assistant`/AI wording in component code (keyword match).
- `_imports/champagne-hero/code/fx-system/components/ai/luxury-chatbot.tsx` — Contains `chatbot` references in component code.
- `_imports/champagne-hero/code/fx-system/components/home/home-page-client.tsx` — Contains `chat`/concierge wording in home page client code.
- `_imports/champagne-hero/code/fx-system/lib/brand/chat-ui.ts` — References `chat-ui` manifest in brand helper.
- `_imports/champagne-hero/code/fx-system/reports/Manifest_Framework_Report.md` — Mentions portal/chatbot sections and readiness.
- `_imports/champagne-hero/code/fx-system/reports/Manifest_Schema_Check.md` — Contains `chat-ui` manifest schema note.
- `_imports/champagne-hero/code/fx-system/reports/TECHNOLOGY_IMPORT_AUDIT.md` — Mentions `/api/chat` in audit list.
- `_imports/champagne-hero/code/fx-system/reports/seo/SEO_Content_Plan.md` — Mentions AI concierge content.
- `_imports/champagne-hero/code/fx-system/styles/ai/chat-preview.css` — `chat-preview` stylesheet reference.
- `_imports/champagne-hero/code/guards/Guards_Baseline_Report.md` — Contains `chat-preview` references.
- `_imports/champagne-hero/code/guards/README.md` — Mentions chat/assistant/concierge terms in guard docs.
- `_imports/champagne-hero/code/guards/docs/Changelog.md` — Contains chat/assistant mentions in changelog notes.
- `_imports/champagne-hero/code/guards/docs/DEPARTMENTS.md` — Contains chat/assistant mentions in department docs.
- `_imports/champagne-hero/code/guards/docs/Director_Launch.md` — Mentions chat/concierge in launch docs.
- `_imports/champagne-hero/code/guards/reports/Champagne_Page_Strategy_Report.md` — Mentions chat/concierge in strategy notes.
- `_imports/champagne-hero/code/guards/reports/Repo_Audit_Report.md` — Includes chat-related route references in audit.
- `_imports/champagne-hero/code/guards/reports/Route_Framework_Report.md` — Mentions chat/preview routes.
- `_imports/champagne-hero/code/guards/reports/Scaffold_Report.md` — Mentions chat-related scaffold items.
- `_imports/champagne-hero/code/guards/scripts/guard-rogue-hex.allow.json` — Allowlist includes `chat-preview` path.
- `_imports/champagne-hero/code/hero-components/components/sections/home/Hero_Ai24.tsx` — Contains concierge wording in hero copy.
- `_imports/champagne-hero/code/hero-engine/DIRECTOR.md` — Mentions chat/concierge in director docs.
- `_imports/champagne-hero/code/hero-engine/Manifest_Audit_Report.md` — Mentions `chat-ui` and chatbot/concierge references.
- `_imports/champagne-hero/code/hero-engine/Repo_Audit.json` — Includes `/api/chat` and `/preview/chat` route references.
- `_imports/champagne-hero/code/hero-engine/docs/Blueprint.md` — Contains chat/assistant references in blueprint text.
- `_imports/champagne-hero/code/hero-engine/docs/Champagne_Page_Architecture.md` — Mentions chat/concierge elements in architecture notes.
- `_imports/champagne-hero/code/hero-engine/docs/director-control.json` — Contains `chatbot`/chat phase entries.
- `_imports/champagne-hero/code/hero-engine/reports/Champagne_Repo_Recon_Report.md` — Mentions preview routes for chat and concierge.
- `_imports/champagne-hero/code/hero-engine/reports/Preview_Treatments_Canvas_Final_Lock_Report.md` — References `/preview/chat` among preview routes.
- `_imports/champagne-hero/code/hero-engine/reports/Repo_Audit.json` — Includes `/api/chat` and `/preview/chat` route references.
- `_imports/champagne-hero/docs/hero-file-inventory.md` — Inventory includes chat-related files.
- `_imports/champagne-hero/manus/notes/config/champagne/Manus_Section_Catalog.json` — Catalog includes chatbot/concierge sections.
- `_imports/champagne-hero/manus/notes/config/champagne/manus-v2-briefs.json` — Briefs mention chatbot panel and concierge route.
- `_imports/champagne-hero/manus/notes/config/champagne/manus/Manus_Section_Catalog.json` — Manus catalog includes chatbot assets/section IDs.
- `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Integration_Roadmap.md` — Roadmap references chatbot panel integration.
- `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Audit_Report.md` — Audit references chatbot panel integration.
- `_imports/champagne-hero/manus/notes/docs/manus-atlas/v1/Manus_Design_Atlas_v1.md` — Design atlas references chatbot panel.
- `_imports/champagne-hero/manus/notes/public/brand/manus_import_unified_manifest_20251104.json` — Manifest includes chatbot assets list.
- `_imports/champagne-hero/manus/notes/reports/Manus_Asset_Discovery_Report.md` — Report includes chatbot/concierge asset notes.
- `_imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json` — Snapshot includes chatbot asset filenames and routes.
- `_imports/code/hero-components/components/sections/home/Hero_Ai24.tsx` — Contains concierge wording in hero copy.
- `_imports/code/hero-engine/DIRECTOR.md` — Mentions chat/concierge in director docs.
- `_imports/code/hero-engine/Manifest_Audit_Report.md` — Mentions `chat-ui` and chatbot/concierge references.
- `_imports/code/hero-engine/Repo_Audit.json` — Includes `/api/chat` and `/preview/chat` route references.
- `_imports/code/hero-engine/docs/Blueprint.md` — Contains chat/assistant references in blueprint text.
- `_imports/code/hero-engine/docs/Champagne_Page_Architecture.md` — Mentions chat/concierge elements in architecture notes.
- `_imports/code/hero-engine/docs/director-control.json` — Contains `chatbot`/chat phase entries.
- `_imports/code/hero-engine/reports/Champagne_Repo_Recon_Report.md` — Mentions preview routes for chat and concierge.
- `_imports/code/hero-engine/reports/Preview_Treatments_Canvas_Final_Lock_Report.md` — References `/preview/chat` among preview routes.
- `_imports/code/hero-engine/reports/Repo_Audit.json` — Includes `/api/chat` and `/preview/chat` route references.
- `_truth_output/cta_text_truth.json` — Contains `session` text in CTA truth map.
- `_truth_output/page_content_truth.json` — Contains `chat`/`messages`/`session` text in content truth.
- `apps/chat-ui/app/layout.tsx` — Placeholder app metadata references concierge/chat.
- `apps/chat-ui/app/page.tsx` — Placeholder UI copy references chat/concierge.
- `apps/chat-ui/package.json` — Package metadata for chat-ui.
- `docs/champagne-import-phase1.md` — Import plan includes `apps/chat-ui`.
- `docs/champagne-os/ai/champagne-ai-persona-matrix.md` — AI concierge persona content mentions assistant/concierge.
- `docs/champagne-os/ai/champagne-ai-personas.json` — Persona definitions mention concierge/assistant.
- `docs/champagne-os/emotion/champagne-emotional-hooks-notes.md` — Emotional hooks mention chat/assistant phrasing.
- `docs/champagne-os/emotion/champagne-emotional-lighting-canon.md` — Contains assistant/concierge terminology.
- `docs/champagne-os/security/champagne-ai-gateway-config.json` — Contains assistant/chat in AI gateway config.
- `docs/champagne-os/security/champagne-ai-gateway-policy.md` — Mentions chat/assistant in policy text.
- `docs/champagne-os/security/champagne-data-classes.json` — Includes messages/session terminology in data classification.
- `docs/champagne-os/security/champagne-retention-and-access.json` — Mentions messages/session retention.
- `docs/champagne-os/security/champagne-security-architecture.md` — Contains chat-ui and concierge flow notes.
- `docs/champagne-os/security/champagne-security-todo.md` — Includes chat-ui/concierge TODOs.
- `docs/champagne-os/tenants/champagne-bundles.json` — Mentions assistant/chat terms in bundle definitions.
- `docs/champagne-os/tenants/champagne-saas-onboarding-notes.md` — Includes chat/assistant notes.
- `docs/champagne-os/tenants/champagne-tenant-manifests-notes.md` — Mentions chatbot/assistant in tenant notes.
- `docs/champagne-os/tenants/champagne-tenants.json` — Mentions assistant/chat in tenant definitions.
- `package.json` — Scripts include chat-ui dev command.
- `packages/champagne-canon/canon/ai/01_persona_matrix.md` — Persona matrix references concierge/assistant.
- `packages/champagne-canon/canon/behaviour/cognitive-load-engine.md` — Mentions chat in behavioral notes.
- `packages/champagne-guards/Guards_Baseline_Report.md` — Contains `chat-preview` references.
- `packages/champagne-guards/scripts/guard-hero.mjs` — Contains `sessionStorage` in forbidden tokens list (keyword match).
- `packages/champagne-manifests/data/champagne_machine_manifest_full.json` — Contains `messages`/`session`/`chat` in content text.
- `packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json` — Contains `session` in content text.
- `packages/champagne-manifests/data/sections/smh/treatment_journeys.json` — Contains `session` text in treatment journeys.
- `packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json` — Contains `chat` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json` — Contains `session` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json` — Contains `session` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.full-smile-makeover.json` — Contains `session` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json` — Contains `sessions` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json` — Contains `chat` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json` — Contains `chat` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json` — Contains `session` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json` — Contains `sessions` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json` — Contains `session`/`sessions` in copy.
- `packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json` — Contains `sessions` in copy.
- `packages/champagne-manifests/reports/CTA_INVENTORY_COSMETIC.md` — CTA report includes planning/design session labels.
- `packages/champagne-orchestrator/package.json` — Package name includes `orchestrator`.
- `packages/champagne-stock-shared/src/index.ts` — Defines `StockScanSession` type.
- `page-truth/contact.txt` — Contains `Messages` in contact copy.
- `page-truth/patient-portal.txt` — Contains `messages` in portal copy.
- `page-truth/treatments-childrens-dentistry.txt` — Contains `chat` in copy.
- `page-truth/treatments-dermal-fillers.txt` — Contains `sessions` in copy.
- `page-truth/treatments-digital-smile-design.txt` — Contains `session` in copy.
- `page-truth/treatments-full-smile-makeover.txt` — Contains `session` in copy.
- `page-truth/treatments-polynucleotides.txt` — Contains `session`/`sessions` in copy.
- `page-truth/treatments-skin-boosters.txt` — Contains `session`/`sessions` in copy.
- `pnpm-lock.yaml` — Lockfile includes chat-ui/orchestrator entries.
- `reports/content_readiness_report.json` — Contains `messages`/`session` references in content readiness data.
- `reports/content_readiness_report.md` — Contains `messages`/`session` references in content readiness notes.
- `reports/hero/phase1-hero-v2-truth-table-upgrade.md` — Contains `session` references in debug instructions.
- `reports/hero/sacred-stability-report.md` — Contains `session` references in stability notes.
- `reports/hero_cta_inventory.json` — Contains `session` labels in CTA inventory data.
- `reports/hero_cta_inventory.md` — Contains `session` labels in CTA inventory report.
- `reports/patient_content_audit/content_truth_map.json` — Contains `messages`/`session` references in content truth map.
- `reports/treatment_cta_audit.json` — Contains `session` labels in CTA audit data.
- `update_treatment_journeys.py` — Contains `sessions` in treatment journey update logic.

