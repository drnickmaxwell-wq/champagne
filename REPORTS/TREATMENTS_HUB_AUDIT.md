# /treatments hub audit

## Initial state (observed before restructuring)
- Section stack rendered above the directory came directly from the `/treatments` manifest entry and included: Overview copy, a “How to navigate the hub” feature list, a routing card set of “Most searched treatment pathways,” an authority grid, Google reviews, and a treatment FAQ.
- Featured pathways/buttons were sourced from the `treatments_hub_pathways` routing card list inside the manifest (not hardcoded in the page component).
- The full directory was rendered in `apps/web/app/treatments/page.tsx` after the hub sections, using `getTreatmentPages()` and a manual `inferFamily` helper to bucket slugs before listing them.

## Updated state (post-restructuring)
- The manifest now holds a curated stack with refreshed overview, wayfinding guidance, explicit featured pathways, a browse-all transition, authority, reviews, and hub FAQ blocks.
- Featured pathways remain manifest-driven but are expanded to include night guards/occlusal splints, sports mouthguards, dental retainers, and main conversion routes (implants, orthodontics, emergency, whitening, veneers).
- The directory still renders after the section stack, but it now follows manifest-defined group hubs (with optional hub links) instead of keyword-based buckets.
- Group ordering and hub metadata come from the `/treatments` manifest `directoryGroups` configuration; slug membership falls back to the `treatmentGroups` list so the manifest remains the source of truth for composition.
