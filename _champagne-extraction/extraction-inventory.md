# Champagne Extraction Inventory

This file describes the contents of the `_champagne-extraction` pack generated from the OLD Champagne repo.

## 0. Source repo quick map

Top-level folders & files (trimmed to the most relevant for Champagne systems):

- `.gitattributes`
- `.github`
- `.gitignore`
- `.husky`
- `.vercelignore`
- `CODEOWNERS`
- `DIRECTOR.md`
- `Guards_Audit.json`
- `Guards_Audit_Report.md`
- `Guards_Baseline_Report.md`
- `MANUS_LUX_APPLY_REPORT.md`
- `Manifest_Audit_Report.md`
- `README.md`
- `Repo_Audit.json`
- `UPLOAD_ASSETS_TODO.md`
- `_audit_inbox`
- `advanced-web-features-audit.md`
- `app`
- `brand`
- `brand-guard.cjs`
- `champagne-hero-pack`
- `components`
- `config`
- `docs`
- `eslint.config.mjs`
- `global.d.ts`
- `lib`
- `middleware.ts`
- `next-sitemap.config.js`
- `next.config.js`
- `next.config.ts`
- `package.json`
- `playwright.config.ts`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `postcss.config.js`
- `preview`
- `public`
- `reports`
- `scripts`
- `styles`
- `tailwind.config.ts`
- `tests`
- `tools`
- `tsconfig.json`

Confirmed: this repo contains preview stacks (`app/preview/**`), Champagne guards (`tools/guard`, `scripts/guard-*.mjs`), manifests (`brand/**`, `config/champagne/manifests/**`, `docs/Brand_Canon_Packet/**`), and rich audit/report material under `reports/**`.

## 1.1 `tokens-and-theme`

Champagne tokens, gradients, surfaces, and theme CSS, plus the core tokens file and related style packs.

Extracted files (paths are relative to `_champagne-extraction`):

- `tokens-and-theme/docs/Brand_Canon_Packet/smh-champagne-tokens.css`
- `tokens-and-theme/styles/champagne/cta-system-v2.css`
- `tokens-and-theme/styles/champagne/footer-preview.css`
- `tokens-and-theme/styles/champagne/glass.css`
- `tokens-and-theme/styles/champagne/gradients.css`
- `tokens-and-theme/styles/champagne/hero-core.css`
- `tokens-and-theme/styles/champagne/hero-engine.css`
- `tokens-and-theme/styles/champagne/hero-gilded-polish.css`
- `tokens-and-theme/styles/champagne/hero-gilded-tune.css`
- `tokens-and-theme/styles/champagne/hero-gilded-tweaks.css`
- `tokens-and-theme/styles/champagne/hero-gilded.css`
- `tokens-and-theme/styles/champagne/hero-polish.css`
- `tokens-and-theme/styles/champagne/hero-skeleton.css`
- `tokens-and-theme/styles/champagne/hero.css`
- `tokens-and-theme/styles/champagne/layers.css`
- `tokens-and-theme/styles/champagne/spacing.css`
- `tokens-and-theme/styles/champagne/surface.css`
- `tokens-and-theme/styles/champagne/theme.css`
- `tokens-and-theme/styles/champagne/time-of-day.css`
- `tokens-and-theme/styles/champagne/tokens.css`
- `tokens-and-theme/styles/champagne/tonal-pack.css`
- `tokens-and-theme/styles/champagne/typography.css`
- `tokens-and-theme/styles/tokens/neutrals.ts`
- `tokens-and-theme/styles/tokens/smh-champagne-tokens.css`

## 1.2 `guards-and-scripts`

Guard scripts, allowlists, and verification tools that enforce Champagne brand, gradient, and manifest safety.

Extracted files (paths are relative to `_champagne-extraction`):

- `guards-and-scripts/Guards_Audit.json`
- `guards-and-scripts/Guards_Audit_Report.md`
- `guards-and-scripts/Guards_Baseline_Report.md`
- `guards-and-scripts/scripts/brand-guard-structure.cjs`
- `guards-and-scripts/scripts/brand-guard.cjs`
- `guards-and-scripts/scripts/brand-guard.smoke.mjs`
- `guards-and-scripts/scripts/brand-lock-guard.cjs`
- `guards-and-scripts/scripts/brand-structure-guard.cjs`
- `guards-and-scripts/scripts/guard-asset-size.mjs`
- `guards-and-scripts/scripts/guard-hero-freeze.mjs`
- `guards-and-scripts/scripts/guard-manifest-sync.mjs`
- `guards-and-scripts/scripts/guard-preview-only.mjs`
- `guards-and-scripts/scripts/guard-rogue-hex.allow.json`
- `guards-and-scripts/scripts/guard-rogue-hex.mjs`
- `guards-and-scripts/scripts/guard-sacred-routes.mjs`
- `guards-and-scripts/scripts/hero-freeze.hashes.json`
- `guards-and-scripts/scripts/lock-gradient.cjs`
- `guards-and-scripts/scripts/verify-brand-tokens.ts`
- `guards-and-scripts/scripts/verify-hue.cjs`
- `guards-and-scripts/tests/brand-lock.spec.ts`
- `guards-and-scripts/tests/brand-lux.spec.ts`
- `guards-and-scripts/tests/brand-manifest.spec.ts`
- `guards-and-scripts/tests/brand-manifests.spec.ts`
- `guards-and-scripts/tools/guard/preflight.ts`
- `guards-and-scripts/tools/guard/route-allowlist.json`

## 1.3 `manifests-and-seo`

Champagne machine manifests, Manus import manifests, SEO helpers, and page architecture descriptions.

Extracted files (paths are relative to `_champagne-extraction`):

- `manifests-and-seo/Manifest_Audit_Report.md`
- `manifests-and-seo/brand/champagne_machine_manifest_full.json`
- `manifests-and-seo/brand/manus_import_unified_manifest_20251104.json`
- `manifests-and-seo/config/champagne/manifests/brand/champagne_machine_manifest_full.json`
- `manifests-and-seo/config/champagne/manifests/public/champagne_machine_manifest_full.json`
- `manifests-and-seo/config/seo/SEO_AI_Synergy_Checklist.md`
- `manifests-and-seo/config/seo/SEO_Validation_Checklist.md`
- `manifests-and-seo/docs/Brand_Canon_Packet/champagne_machine_manifest.json`
- `manifests-and-seo/docs/Brand_Canon_Packet/manifest.public.brand.json`
- `manifests-and-seo/docs/Brand_Canon_Packet/manifest.styles.champagne.json`
- `manifests-and-seo/docs/Champagne_Page_Architecture.md`
- `manifests-and-seo/lib/brand/manifest.ts`
- `manifests-and-seo/lib/seo.tsx`
- `manifests-and-seo/lib/seo/advanced-seo.ts`
- `manifests-and-seo/public/assets/champagne/manifest.json`
- `manifests-and-seo/public/brand/champagne_machine_manifest_full.json`
- `manifests-and-seo/public/brand/manifest.json`
- `manifests-and-seo/public/brand/manus_import_unified_manifest_20251104.json`
- `manifests-and-seo/public/manifest.json`
- `manifests-and-seo/reports/Champagne_Manifest_Inventory.json`
- `manifests-and-seo/reports/Champagne_Manifest_Inventory.md`
- `manifests-and-seo/reports/Guard_RogueHex_Fix_ChampagneMachineManifest.md`
- `manifests-and-seo/reports/Manifest_Framework_Report.md`
- `manifests-and-seo/reports/Manifest_Schema_Check.md`
- `manifests-and-seo/reports/Manus_Manifests_Snapshot.json`
- `manifests-and-seo/reports/seo/SEO_Content_Plan.md`
- `manifests-and-seo/reports/seo/SEO_Schema.md`
- `manifests-and-seo/styles/champagne/manifest.json`

## 1.4 `preview-treatments-canonical`

Canonical treatment preview routes, their shared components, and preview-specific CSS for the Champagne treatments canvas.

Extracted files (paths are relative to `_champagne-extraction`):

- `preview-treatments-canonical/app/preview/treatments/3d-dentistry/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/[slug]/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/README.md`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingFaqSection.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingHeroSection.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingHighlightsSection.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingPlanSessionSection.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/_sections/CompositeBondingResultsSection.tsx`
- `preview-treatments-canonical/app/preview/treatments/composite-bonding/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/cosmetic/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/dental-implants/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/general/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/implants/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/layout.tsx`
- `preview-treatments-canonical/app/preview/treatments/orthodontics/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/orthodontics/spark-aligners/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/technology/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/veneers/page.tsx`
- `preview-treatments-canonical/app/preview/treatments/whitening/page.tsx`
- `preview-treatments-canonical/components/preview/PreviewTreatmentsHero.tsx`
- `preview-treatments-canonical/components/preview/Preview_Treatments_ColorHarmony_v4.md`
- `preview-treatments-canonical/components/preview/TreatmentBanner.tsx`
- `preview-treatments-canonical/components/preview/TreatmentPreviewFrame.tsx`
- `preview-treatments-canonical/components/preview/cta/TreatmentConsultationCta.tsx`
- `preview-treatments-canonical/components/preview/home/HomeFeaturedTreatments.tsx`
- `preview-treatments-canonical/components/preview/nav/TreatmentBreadcrumb.tsx`
- `preview-treatments-canonical/components/preview/seo/TreatmentHubPreviewSchema.tsx`
- `preview-treatments-canonical/components/preview/seo/TreatmentPreviewSchema.tsx`
- `preview-treatments-canonical/components/preview/theme/ChampagneTreatmentSurface.tsx`
- `preview-treatments-canonical/components/preview/treatments/BenefitsCapsules.tsx`
- `preview-treatments-canonical/components/preview/treatments/BreadcrumbBar.tsx`
- `preview-treatments-canonical/components/preview/treatments/ChampagneTreatmentTemplate.tsx`
- `preview-treatments-canonical/components/preview/treatments/FaqAccordion.tsx`
- `preview-treatments-canonical/components/preview/treatments/FeaturedTreatmentsPreview.tsx`
- `preview-treatments-canonical/components/preview/treatments/HowToRail.tsx`
- `preview-treatments-canonical/components/preview/treatments/PreviewHero.tsx`
- `preview-treatments-canonical/components/preview/treatments/ThreeDViewerSlot.module.css`
- `preview-treatments-canonical/components/preview/treatments/ThreeDViewerSlot.tsx`
- `preview-treatments-canonical/components/preview/treatments/Viewer3DSlot.tsx`
- `preview-treatments-canonical/components/preview/treatments/champagne-treatment-template.module.css`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingAiTools.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingCTA.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingClinicianInsight.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingFaq.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingHero.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingOverview.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/CompositeBondingStories.tsx`
- `preview-treatments-canonical/components/preview/treatments/composite-bonding/composite-bonding-preview.module.css`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningAiTools.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningCTA.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningClinicianInsight.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningFaq.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningHero.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningOverview.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/WhiteningStories.tsx`
- `preview-treatments-canonical/components/preview/treatments/whitening/whitening-preview.module.css`
- `preview-treatments-canonical/styles/preview/champagne-preview.css`
- `preview-treatments-canonical/styles/preview/chat-tokens.css`
- `preview-treatments-canonical/styles/preview/dusk.css`
- `preview-treatments-canonical/styles/preview/home-champagne.css`
- `preview-treatments-canonical/styles/preview/preview-v2-treatments.css`
- `preview-treatments-canonical/styles/preview/schema-injector.css`
- `preview-treatments-canonical/styles/preview/treatments-light.css`
- `preview-treatments-canonical/styles/preview/treatments-preview.css`
- `preview-treatments-canonical/styles/preview/treatments-skin.css`
- `preview-treatments-canonical/styles/preview/treatments.css`

## 1.5 `heroes-and-fx`

Hero components, hero preview routes, and FX/particle helpers used to drive the sacred hero experiences.

Extracted files (paths are relative to `_champagne-extraction`):

- `heroes-and-fx/app/champagne-preview/page.tsx`
- `heroes-and-fx/app/champagne/hero/page.tsx`
- `heroes-and-fx/app/preview/(with-shell)/hero-gilded/LoopCrossfade.tsx`
- `heroes-and-fx/app/preview/(with-shell)/hero-gilded/PreviewHeroGildedClient.tsx`
- `heroes-and-fx/app/preview/(with-shell)/hero-gilded/README.md`
- `heroes-and-fx/app/preview/(with-shell)/hero-gilded/layout.tsx`
- `heroes-and-fx/app/preview/(with-shell)/hero-gilded/page.tsx`
- `heroes-and-fx/components/fx/Particles.tsx`
- `heroes-and-fx/components/fx/particles.module.css`
- `heroes-and-fx/components/hero/4k-hero-video.tsx`
- `heroes-and-fx/components/hero/ChampagneHero.tsx`
- `heroes-and-fx/components/hero/cinematic-hero-video.tsx`
- `heroes-and-fx/components/hero/original-hero-section.tsx`
- `heroes-and-fx/styles/champagne/effects/layers.css`
- `heroes-and-fx/styles/champagne/hero-core.css`
- `heroes-and-fx/styles/champagne/hero-engine.css`
- `heroes-and-fx/styles/champagne/hero-gilded-polish.css`
- `heroes-and-fx/styles/champagne/hero-gilded-tune.css`
- `heroes-and-fx/styles/champagne/hero-gilded-tweaks.css`
- `heroes-and-fx/styles/champagne/hero-gilded.css`
- `heroes-and-fx/styles/champagne/hero-polish.css`
- `heroes-and-fx/styles/champagne/hero-skeleton.css`
- `heroes-and-fx/styles/champagne/hero.css`

## 1.6 `brand-canon-and-docs`

Brand canon packets, design language docs, CTA systems, and director-level documentation of Champagne behaviour.

Extracted files (paths are relative to `_champagne-extraction`):

- `brand-canon-and-docs/DIRECTOR.md`
- `brand-canon-and-docs/README.md`
- `brand-canon-and-docs/brand/champagne_machine_manifest_full.json`
- `brand-canon-and-docs/brand/hue-lock.json`
- `brand-canon-and-docs/brand/manus_import_unified_manifest_20251104.json`
- `brand-canon-and-docs/docs/Blueprint.md`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/Brand_Canon.json`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/Brand_Canon_README.md`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/Brand_Canon_Report.md`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/champagne_machine_manifest.json`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/manifest.public.brand.json`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/manifest.styles.champagne.json`
- `brand-canon-and-docs/docs/Brand_Canon_Packet/smh-champagne-tokens.css`
- `brand-canon-and-docs/docs/Changelog.md`
- `brand-canon-and-docs/docs/DEPARTMENTS.md`
- `brand-canon-and-docs/docs/Director_Launch.md`
- `brand-canon-and-docs/docs/IMPLEMENTATION_GUIDE.md`
- `brand-canon-and-docs/docs/audit-and-tokens.md`
- `brand-canon-and-docs/docs/brand/SMH_Champagne_Lock.md`
- `brand-canon-and-docs/docs/champagne/Champagne_CTA_System.md`
- `brand-canon-and-docs/docs/champagne/Champagne_CTA_System_v2_Plan.md`
- `brand-canon-and-docs/docs/champagne/Champagne_Hero_Engine.md`
- `brand-canon-and-docs/docs/champagne/Champagne_Luxury_Component_Registry.md`
- `brand-canon-and-docs/docs/champagne/Champagne_Motion_Language_v1.md`
- `brand-canon-and-docs/docs/champagne/Champagne_Tonal_Pack_v1.md`
- `brand-canon-and-docs/docs/champagne/Hero_Preset_Library_v1.md`
- `brand-canon-and-docs/docs/hero-freeze.md`

## 1.7 `reports-and-audits`

Audit, diagnostic, and inventory reports describing how the system behaved over time, including manifest and hero engine readouts.

Extracted files (paths are relative to `_champagne-extraction`):

- `reports-and-audits/MANUS_LUX_APPLY_REPORT.md`
- `reports-and-audits/Repo_Audit.json`
- `reports-and-audits/reports/AUDIT-SUMMARY.md`
- `reports-and-audits/reports/Atlas_Docs_Cleanup_Report.md`
- `reports-and-audits/reports/Brand_Canon_README.md`
- `reports-and-audits/reports/CHAMPAGNE_AUDIT.md`
- `reports-and-audits/reports/CHAMPAGNE_INVENTORY.json`
- `reports-and-audits/reports/CHECKLIST.md`
- `reports-and-audits/reports/CHECKLIST_FINAL.md`
- `reports-and-audits/reports/Champagne_Audit_Readout.md`
- `reports-and-audits/reports/Champagne_CTA_Systems_Map.json`
- `reports-and-audits/reports/Champagne_CTA_Systems_Map.md`
- `reports-and-audits/reports/Champagne_Hero_Engine_Diagnostic.json`
- `reports-and-audits/reports/Champagne_Hero_Engine_Diagnostic.md`
- `reports-and-audits/reports/Champagne_Hero_Presets_Map.json`
- `reports-and-audits/reports/Champagne_Hero_Presets_Map.md`
- `reports-and-audits/reports/Champagne_Knowledge_Audit.md`
- `reports-and-audits/reports/Champagne_Lux_Triage_Report.md`
- `reports-and-audits/reports/Champagne_Manifest_Inventory.json`
- `reports-and-audits/reports/Champagne_Manifest_Inventory.md`
- `reports-and-audits/reports/Champagne_Page_Strategy_Report.md`
- `reports-and-audits/reports/Champagne_Palette_Audit_Treatments_Preview.md`
- `reports-and-audits/reports/Champagne_Particle_Inventory.json`
- `reports-and-audits/reports/Champagne_Particle_Inventory.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v2.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v3.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v4.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v5.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v6.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v7.md`
- `reports-and-audits/reports/Champagne_Preview_Fix_Audit_v8.md`
- `reports-and-audits/reports/Champagne_Preview_MoodMap_v1.md`
- `reports-and-audits/reports/Champagne_Preview_Treatments_Layout_Map_v2.md`
- `reports-and-audits/reports/Champagne_Repo_Recon_Report.md`
- `reports-and-audits/reports/Champagne_Skeleton_v1_Report.md`
- `reports-and-audits/reports/Champagne_Token_Snapshot.json`
- `reports-and-audits/reports/Champagne_Token_Snapshot.md`
- `reports-and-audits/reports/Champagne_Treatments_Architecture.md`
- `reports-and-audits/reports/Champagne_Wave_Inventory.json`
- `reports-and-audits/reports/Champagne_Wave_Inventory.md`
- `reports-and-audits/reports/Design_Log.md`
- `reports-and-audits/reports/FOOTER_FIX.diff`
- `reports-and-audits/reports/FOOTER_FIX.md`
- `reports-and-audits/reports/FOOTER_LUX_REPORT.md`
- `reports-and-audits/reports/GUARD_README.md`
- `reports-and-audits/reports/Guard_Fix_Report.md`
- `reports-and-audits/reports/Guard_RogueHex_Fix_ChampagneMachineManifest.md`
- `reports-and-audits/reports/Guardrail_Assessment.md`
- `reports-and-audits/reports/HERO_POLISH_REPORT.md`
- `reports-and-audits/reports/Header_Footer_Preview_v1.md`
- `reports-and-audits/reports/Homepage_Champagne_Debug.md`
- `reports-and-audits/reports/Homepage_Champagne_v1.md`
- `reports-and-audits/reports/Homepage_Champagne_v2.md`
- `reports-and-audits/reports/Homepage_Preview_Scaffold_Report.md`
- `reports-and-audits/reports/IMPLEMENTATION-GUIDE.md`
- `reports-and-audits/reports/Implants_Treatment_Template_Context.md`
- `reports-and-audits/reports/LUXE_FOOTER_AUDIT.md`
- `reports-and-audits/reports/Manifest_Framework_Report.md`
- `reports-and-audits/reports/Manifest_Schema_Check.md`
- `reports-and-audits/reports/Manus_Asset_Discovery_Report.md`
- `reports-and-audits/reports/Manus_Manifests_Snapshot.json`
- `reports-and-audits/reports/NAV_WIRING_NOTES.md`
- `reports-and-audits/reports/PARTICLES_FIX.diff`
- `reports-and-audits/reports/PARTICLES_FIX.md`
- `reports-and-audits/reports/Preview_Canvas_Palette_Correction_Report.md`
- `reports-and-audits/reports/Preview_Canvas_Polish_v4_Report.md`
- `reports-and-audits/reports/Preview_Canvas_UX_v1.md`
- `reports-and-audits/reports/Preview_Composite_Bonding_Render_Report.md`
- `reports-and-audits/reports/Preview_Hero_LayerSync_v1.md`
- `reports-and-audits/reports/Preview_Hero_LayerSync_v2.md`
- `reports-and-audits/reports/Preview_Hero_Overhaul_v1.md`
- `reports-and-audits/reports/Preview_Hero_Overhaul_v2.md`
- `reports-and-audits/reports/Preview_Hero_Overhaul_v3.md`
- `reports-and-audits/reports/Preview_Hero_Rebuild_v1.md`
- `reports-and-audits/reports/Preview_Hero_Rewire_v2.md`
- `reports-and-audits/reports/Preview_Implants_Visual_Design_Report.md`
- `reports-and-audits/reports/Preview_Technology_v1_Report.md`
- `reports-and-audits/reports/Preview_Theme_Runtime_Audit.md`
- `reports-and-audits/reports/Preview_Treatment_Template_Adoption_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Audit_v2.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Conflict_Scan.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Final_Lock_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Leak_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Structure.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Wiring_After.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_Wiring_Before.md`
- `reports-and-audits/reports/Preview_Treatments_Canvas_and_Hero_Alignment_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Layout_Extraction_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Layout_Wiring_Audit.md`
- `reports-and-audits/reports/Preview_Treatments_Polish_v2_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Polish_v3.md`
- `reports-and-audits/reports/Preview_Treatments_Readability_Report.md`
- `reports-and-audits/reports/Preview_Treatments_Template_Upgrade_Summary.md`
- `reports-and-audits/reports/Preview_V2_Treatments_Lab_Report.md`
- `reports-and-audits/reports/ROUTES_MIRROR.json`
- `reports-and-audits/reports/ROUTES_MIRROR_SUMMARY.md`
- `reports-and-audits/reports/ROUTES_REMAP_SUMMARY.md`
- `reports-and-audits/reports/Repo_Audit.json`
- `reports-and-audits/reports/Repo_Audit_Report.md`
- `reports-and-audits/reports/Route_Framework_Report.md`
- `reports-and-audits/reports/Safe_Build_Readme.md`
- `reports-and-audits/reports/Scaffold_Report.md`
- `reports-and-audits/reports/Security_Skeleton_v1_Report.md`
- `reports-and-audits/reports/TECHNOLOGY_ENHANCEMENTS.diff`
- `reports-and-audits/reports/TECHNOLOGY_ENHANCEMENTS.md`
- `reports-and-audits/reports/TECHNOLOGY_HERO_POLISH.diff`
- `reports-and-audits/reports/TECHNOLOGY_HERO_POLISH.md`
- `reports-and-audits/reports/TECHNOLOGY_IMPORT_AUDIT.md`
- `reports-and-audits/reports/TECHNOLOGY_IMPORT_FIX.diff`
- `reports-and-audits/reports/TECHNOLOGY_IMPORT_PLAN.md`
- `reports-and-audits/reports/Treatments_Hub_Preview_v1.md`
- `reports-and-audits/reports/ci/Preview_TreatmentsLight_PR_000.md`
- `reports-and-audits/reports/loop-seams.md`
- `reports-and-audits/reports/manual-qa.md`
- `reports-and-audits/reports/preview/CHANGELOG.md`
- `reports-and-audits/reports/routes-map.json`
- `reports-and-audits/reports/schema/Integration_Status_Treatments.json`
- `reports-and-audits/reports/schema/routes-map.json`
- `reports-and-audits/reports/seo/SEO_Content_Plan.md`
- `reports-and-audits/reports/seo/SEO_Schema.md`

## 1.8 `assets-core`

Wave masks, textures, particles, and other sacred media assets used by heroes, previews, and the overall Champagne surface.

Extracted files (paths are relative to `_champagne-extraction`):

- `assets-core/public/assets/champagne/README.md`
- `assets-core/public/assets/champagne/film-grain-desktop.webp`
- `assets-core/public/assets/champagne/manifest.json`
- `assets-core/public/assets/champagne/motion/glass-shimmer.webm`
- `assets-core/public/assets/champagne/motion/gold-dust-drift.webm`
- `assets-core/public/assets/champagne/motion/particles-drift.webm`
- `assets-core/public/assets/champagne/motion/wave-caustics.webm`
- `assets-core/public/assets/champagne/particles/gold-dust-drift.webm`
- `assets-core/public/assets/champagne/particles/home-hero-particles.webp`
- `assets-core/public/assets/champagne/textures/home-hero-film-grain.webp`
- `assets-core/public/assets/champagne/waves/wave-mask-desktop.webp`
- `assets-core/public/assets/champagne/waves/wave-mask-mobile.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-1024.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-1280.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-1600.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-1920.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-2560.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-320.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-480.webp`
- `assets-core/public/assets/champagne/waves/waves-bg-768.webp`
- `assets-core/public/brand/.gitkeep`
- `assets-core/public/brand/README.md`
- `assets-core/public/brand/champagne_machine_manifest_full.json`
- `assets-core/public/brand/chat-ui.json`
- `assets-core/public/brand/manifest.json`
- `assets-core/public/brand/manus_import_unified_manifest_20251104.json`
- `assets-core/public/brand/particles/.gitkeep`
- `assets-core/public/brand/textures/.gitkeep`
- `assets-core/public/brand/waves-bg-1024.jpg`
- `assets-core/public/brand/waves-bg-1024.webp`
- `assets-core/public/brand/waves-bg-1280.jpg`
- `assets-core/public/brand/waves-bg-1280.webp`
- `assets-core/public/brand/waves-bg-1600.jpg`
- `assets-core/public/brand/waves-bg-1600.webp`
- `assets-core/public/brand/waves-bg-1920.jpg`
- `assets-core/public/brand/waves-bg-1920.webp`
- `assets-core/public/brand/waves-bg-320.jpg`
- `assets-core/public/brand/waves-bg-320.webp`
- `assets-core/public/brand/waves-bg-480.jpg`
- `assets-core/public/brand/waves-bg-480.webp`
- `assets-core/public/brand/waves-bg-768.jpg`
- `assets-core/public/brand/waves-bg-768.webp`
- `assets-core/public/brand/waves-bg.jpg`
- `assets-core/public/brand/waves-bg.webp`
- `assets-core/public/brand/waves/.gitkeep`
- `assets-core/public/brand/waves/header-wave-mask.svg`
- `assets-core/public/brand/waves/wave-dots.svg`
- `assets-core/public/brand/waves/wave-field.svg`
- `assets-core/public/hero-poster.jpg`
- `assets-core/public/particles/particles-gold.webp`
- `assets-core/public/particles/particles-magenta.webp`
- `assets-core/public/particles/particles-teal.webp`
- `assets-core/public/textures/film-grain-desktop.webp`
- `assets-core/public/textures/film-grain-mobile.webp`
- `assets-core/public/videos/dental-hero-4k.mp4`
- `assets-core/public/waves/smh-wave-mask.svg`
- `assets-core/public/waves/waves-bg-1024.jpg`
- `assets-core/public/waves/waves-bg-1024.webp`
- `assets-core/public/waves/waves-bg-1280.jpg`
- `assets-core/public/waves/waves-bg-1280.webp`
- `assets-core/public/waves/waves-bg-1600.jpg`
- `assets-core/public/waves/waves-bg-1600.webp`
- `assets-core/public/waves/waves-bg-1920.jpg`
- `assets-core/public/waves/waves-bg-1920.webp`
- `assets-core/public/waves/waves-bg-2560.jpg`
- `assets-core/public/waves/waves-bg-2560.webp`
- `assets-core/public/waves/waves-bg-320.jpg`
- `assets-core/public/waves/waves-bg-320.webp`
- `assets-core/public/waves/waves-bg-480.jpg`
- `assets-core/public/waves/waves-bg-480.webp`
- `assets-core/public/waves/waves-bg-768.jpg`
- `assets-core/public/waves/waves-bg-768.webp`

## 2. `_audit_inbox` note

The `_audit_inbox` folder in the source repo contains large ZIP deliverables which were **not** copied into the extraction pack to keep it lightweight:

- `_audit_inbox/.keep`
- `_audit_inbox/composite-bonding-restored-champagne-2025-10-14.zip`
- `_audit_inbox/phase1b-composite-bonding-body-deliverable.zip`
- `_audit_inbox/phase1c-composite-bonding-faq-cta-polished.zip`

If you need the raw Manus / preview ZIPs later, retrieve them directly from the original repo archive.