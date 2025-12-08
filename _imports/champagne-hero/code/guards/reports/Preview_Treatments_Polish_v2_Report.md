# Preview Treatments Polish v2 Report

## Overview
- Refreshed preview home and treatments hub spacing to match the Champagne preview canvas and introduced consistent typography tokens across headings, leads, and body copy.
- Updated glass treatments for cards and pills to align with the chromatic inset/soft keyline spec while keeping CTA hierarchy clear.

## Before / After Notes
- Section shells now breathe with wider vertical rhythm and aligned header stacks, mirroring the preview color canvas.
- Eyebrows, section titles, and lead text share unified sizing via new `text-*` preview typography tokens.
- Glass cards and pills pick up the correct alpha, keyline, and gradient treatment; CTAs read as magenta→teal primary and ink-glass secondary.
- Concern rails, how-it-works steps, finance band, stories, and FAQ rails in the treatments hub inherit matching spacing, with mobile stacking cleaned up.

## Files Touched
- app/preview/home/page.tsx
- app/preview/treatments/page.tsx
- components/preview/preview-typography.css
- components/preview/sections/treatments/preview-treatments.module.css
- components/preview/PreviewHero.tsx
- components/preview/sections/treatments/*
- components/sections/home/*

## Design Inconsistencies Observed
- No new inconsistencies noted after the polish pass; remote reference added locally so preview-only guard could calculate merge base.

## Guards
- pnpm test
- pnpm brand:guard
- node scripts/guard-rogue-hex.mjs
- node scripts/guard-preview-only.mjs
- node scripts/guard-manifest-sync.mjs
- node scripts/guard-asset-size.mjs
