# Director Blueprint

## Mission Snapshot
1. Anchor Smile Makeover Hub (SMH) as a cinematic, trustworthy dental destination with a consistent Director-led workflow.
2. Maintain brand guardianship through reproducible guard runs and immutable hero assets while enabling safe iteration in preview sandboxes.
3. Orchestrate Manus, Codex, and Planner AIs so that design, content, and engineering streams flow in sync with patient experience goals.
4. Preserve accessibility, performance, and compliance guard rails across every deployment and integration touchpoint.

## Brand DNA
1. Palette tokens
   - Magenta `#C2185B`
   - Teal `#40C4B4`
   - Gold `#D4AF37`
   - Soft Gold `#F9E8C3`
   - Ink `#0B0D0F`
   - Body text `#1A1A1A`
2. Gradient signature
   - Use `linear-gradient(135deg,#C2185B 0%,#40C4B4 60%,#D4AF37 100%)` as the hero and call-to-action baseline.
   - Maintain a 135° sweep for continuity between hero, cards, and callouts.
3. Type stack
   - Display: "Poppins", fallback `-apple-system`, `BlinkMacSystemFont`, "Segoe UI", `sans-serif`.
   - Body: "Inter", fallback `system-ui`, `sans-serif`.
   - Numeric: `"IBM Plex Mono", monospace` for counters and diagnostic readouts.
4. Tone
   - Confident, warm, and precise.
   - Align copy with patient outcomes, avoiding jargon.
5. Imagery guidance
   - Favor grain-coated photography and illustrated overlays provided by Manus.
   - Never commit binary assets via Codex; request uploads through GitHub UI when needed.

## Layer Stack
1. Global layering order
   1. Gradient backdrop (anchored to root container)
   2. Wave geometry (immutable SVG set, never altered via Codex)
   3. Particle shimmer (canvas/WebGL or CSS pseudo-element, follow manifest instructions)
   4. Film grain overlay (blend mode `soft-light`, adjustable opacity 8–12%)
   5. Glass panels (frosted surfaces with blur radius 24px, border highlight `rgba(249,232,195,0.35)`)
   6. Content modules (cards, typography, CTA stacks)
2. Constraints
   - Waves are immutable; reuse tokens.
   - Glass and content layers must respect 8px spacing increments.
   - Gradients snap to design tokens and must not shift hue stops without Director approval.
3. Implementation notes
   - Compose layers using CSS variables stored in `/styles/tokens/` when available.
   - Use GPU-accelerated transforms for parallax and glass transitions.

## Motion Law
1. Cinematic motion guidelines
   - Parallax displacement ≤ 6px on scroll to avoid motion sickness.
   - Use easing `cubic-bezier(0.4,0,0.2,1)` for most transitions.
   - Hover reveals should animate within 180ms.
2. Reduced motion
   - Respect `prefers-reduced-motion`; disable parallax and grain shimmer when true.
3. Video and loops
   - Use Manus-delivered seamless loop packs; ensure loops stay ≤ 12s and comply with compression guidance in manifest.

## Accessibility Standards
1. Color contrast
   - Minimum AA for text ≥ 4.5:1; large text ≥ 3:1.
   - Validate tokens using automated guard plus manual spot checks.
2. Keyboard
   - Focus order mirrors visual layout; no key traps.
   - Provide visible focus states using soft gold halo.
3. Screen readers
   - Semantic HTML first. Avoid div soup.
   - Provide `aria-live` regions for chat updates.
4. Forms
   - Associate labels with inputs, provide error states with text + icon.
5. Motion accessibility
   - Provide toggles for advanced animations in portal and chatbot when available.

## Repositories & Applications
1. Website (this repository)
   - Next.js app powering the marketing site.
   - Frozen hero routes: `/` and `/champagne/hero` remain immutable except through Director-signed updates.
   - Use preview routes for iterative work.
2. Chatbot Brain (Railway)
   - Handles dialog orchestration, scheduling flows, and CRM sync.
   - Integrates with Twilio voice/SMS and Postmark email templates.
3. Patient Portal (Railway)
   - Serves appointment tracking, treatment plans, and payments.
   - Shares brand tokens via CDN manifest.
4. Automation Engine (Railway)
   - Executes workflows: intake forms, doc signing, follow-up reminders.
   - Interfaces with Dentally API, Tabeo financing, and internal Slack alerts.
5. Shared tokens
   - All services consume `/public/brand/manifest.json` for color/typography alignment.

## Guard Rails & Rules
1. Guard commands
   - `pnpm run brand:guard` verifies token and color contract.
   - `pnpm run guard:hero` ensures hero freeze integrity.
2. Codex constraints
   - No binaries in Codex PRs.
   - Never touch `components/home/ChampagneHero.tsx` or associated live homepage CSS.
   - Work in preview directories or docs for new content.
3. Token discipline
   - When adding styles, pull from brand tokens or design manifests.
   - Document any new token requests in Manus intake.
4. Version control
   - Use feature branches; commits must detail guard status when possible.

## Key Routes
1. Production surfaces
   - `/` — Primary homepage, hero frozen.
   - `/champagne/hero` — Locked reference snapshot.
2. Preview sandboxes
   - `/preview/hero-gilded` — Safe hero exploration.
   - `/preview/chat` — Chat UI sandbox with dock/panel variations.
   - `/preview/footer-luxe` — Footer hardening space.
   - Additional preview paths should follow `/preview/{feature}` naming.
3. Future expansions
   - `/preview/treatments-light/` — Treatments hub prototypes.
   - `/preview/imports/` — Manus import staging area.

## Manifests & Asset Governance
1. Manifest list
   - `/public/assets/champagne/manifest.json` — Hero motion + layers.
   - `/public/brand/manifest.json` — Core tokens.
   - `/public/brand/champagne_machine_manifest_full.json` — Extended gradients & wave specs.
   - `/public/brand/manus_import_unified_manifest_20251104.json` — Manus bundle map.
2. Usage guidelines
   - Always consult manifest before adjusting visuals.
   - When Manus delivers a ZIP, confirm `manifest.json` alignment before merge.
3. Update process
   - Manus uploads binary assets via GitHub UI, referencing manifest paths.
   - Codex updates textual docs and configuration references only.
4. Integrity checks
   - After asset imports, run `pnpm run brand:guard` to ensure token parity.
   - Validate hero freeze via `pnpm run guard:hero` before deploy.

## Integration Plan (High Level)
1. Dentally
   - Sync patient records and treatment plans into portal.
   - Use API webhooks to trigger automation engine follow-ups.
2. Tabeo Financing
   - Embed financing options within treatments flow.
   - Provide secure handoff to Tabeo checkout.
3. Twilio
   - SMS reminders, voice scheduling prompts.
   - Chatbot brain triggers Twilio flows via webhook.
4. Postmark
   - Transactional emails for appointment confirmations and receipts.
   - Templates stored in automation engine repo.
5. Analytics stack
   - Use privacy-compliant event tracking (PostHog or Segment) with consent gating.
6. Compliance
   - Ensure HIPAA alignment for patient data touchpoints.

## Department Workflow
1. Manus Asset Delivery
   - Manus exports layered PSD/Figma to ZIP with manifest.
   - Assets uploaded manually via GitHub UI, preserving directory structure.
2. Codex Implementation
   - Codex pulls tokens from manifests, updates text-only files, templates, or configuration.
   - Guard commands run locally before PR submission.
3. Planner Strategy
   - Planner drafts specs, ADRs, and sequencing documents.
   - Coordinates dependencies between departments.
4. Upload Protocol
   - Binaries never enter Codex commits; reference uploaded filenames in docs.
5. Review Gates
   - Director verifies guard runs and documentation completeness.
   - Merge only after hero guard remains green.

## Performance Targets
1. Lighthouse baseline
   - Performance ≥ 90 on desktop preview builds.
   - Accessibility ≥ 95; SEO ≥ 95.
2. Core Web Vitals
   - LCP < 2.5s, FID/INP < 100ms, CLS < 0.1.
3. Asset budgets
   - Hero background video ≤ 2.5MB (post-compression).
   - Images served in AVIF/WEBP from Manus pipeline.
4. Caching
   - Use `stale-while-revalidate` for manifest fetches.
   - CDN cache purges coordinated with asset uploads.

## Accessibility Targets
1. Screen reader QA checklist
   - Run VoiceOver/NVDA smoke tests on hero, chat, and portal flows.
   - Provide transcripts for motion pieces where audio exists.
2. Chatbot inclusivity
   - Support text scaling up to 200% without layout break.
   - Ensure color-coded responses also have icon/label cues.
3. Portal ergonomics
   - WCAG 2.2 focus appearance, drag-and-drop alternatives, form validation states.

## Documentation Rhythm
1. Blueprint upkeep
   - Update this document when tokens, layers, or integration plans evolve.
   - Director reviews monthly.
2. Changelog
   - Log every Director-led doc update in `/docs/Changelog.md` with guard status notes.
3. Departments Index
   - Track conversation status in `/docs/DEPARTMENTS.md` and link to preview outputs.
4. ADRs
   - Store architectural decisions in `/docs/adr/` when specs exceed simple updates.

## Release Flow
1. Branching
   - Use feature branches per department initiative.
   - Prefix branches `feature/` or `docs/`.
2. Pull Requests
   - Title format: `type(scope): summary` aligned with repo conventions.
   - Include guard command output in PR description.
3. Approval
   - Director or delegate confirms guard runs and compliance with Codex constraints.
   - Squash merge recommended to maintain clean history.

## Testing Expectations
1. Automated checks
   - `pnpm run brand:guard`
   - `pnpm run guard:hero`
   - Additional unit or integration tests as relevant.
2. Manual QA
   - Review preview sandboxes for layout regressions.
   - Confirm overlays and glass layers align with manifest definitions.
3. Accessibility QA
   - Focus order audit, color contrast sampling, screen reader exploration.

## Incident Response
1. Guard failure
   - Re-run locally, inspect diffs for token drift or hero mutations.
   - If assets changed, coordinate with Manus for corrected binary upload.
2. Integration outage
   - Automation engine emits alerts to Slack.
   - Escalate to Planner for sequencing fixes and to Director for communication.
3. Rollback plan
   - Use Vercel preview history to revert to last passing build.

## Security & Compliance
1. Secrets management
   - Use Railway environment variables, never commit secrets.
   - Apply principle of least privilege per integration.
2. Data protection
   - Encrypt patient data at rest and in transit.
   - Ensure chat transcripts follow retention policy.
3. Monitoring
   - Centralize logs (Railway + DataDog or Logtail).

## Future Horizons
1. Upcoming phases
   - Homepage cinematic polish
   - Treatments hub tokenization
   - Top 6 leaves branding refresh
   - Technology page deep dive
   - Stories grid with patient narratives
   - Blog/newsletter platformization
   - Telemedicine intake
   - AI smile quiz
   - Chatbot UI refinement
   - Header/footer hardening
2. Experiment backlog
   - Micro-interactions for CTA hover states.
   - Personalization based on user location.

## Contact Protocols
1. Director AI
   - Oversees cross-department priorities and guard adherence.
2. Manus
   - Handles high-fidelity visuals, loops, and glass textures.
3. Codex
   - Implements text-only changes, automation scripts, tests.
4. Planner
   - Maps roadmap, integrations, and compliance alignment.

## Appendix — Quick Commands
1. Install deps: `pnpm install`
2. Dev server: `pnpm dev`
3. Run guards: `pnpm run brand:guard`, `pnpm run guard:hero`
4. Lint: `pnpm lint`

## Appendix — Preview Usage Checklist
1. Need hero adjustments? Work in `/preview/hero-gilded`.
2. Chat experimentation? Use `/preview/chat`.
3. Footer tuning? Use `/preview/footer-luxe`.
4. Treatments token work? Use `/preview/treatments-light/`.
5. Document progress in `/docs/DEPARTMENTS.md`.

## Appendix — Accessibility Quick Tips
1. Provide text alternatives for decorative particles when required.
2. Maintain minimum 16px body text.
3. Verify focus indicators contrast ≥ 3:1 against background.
4. Announce dynamic updates in chat panel using polite `aria-live`.

## Appendix — Performance Quick Tips
1. Prefetch fonts using `<link rel="preload">` with correct `as` attribute.
2. Compress JSON manifests before shipping; leverage gzip or brotli.
3. Inline critical CSS for hero above-the-fold content.
4. Defer non-critical scripts and hydrate chat dock lazily.

## Sign-off
1. Keep Director loop informed via changelog updates.
2. Guards green before merge.
3. Preview sandboxes are the playground; production surfaces stay pristine.
