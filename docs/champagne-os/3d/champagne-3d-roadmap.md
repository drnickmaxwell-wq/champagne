
# Champagne 3D Roadmap – Veneers, Implants, Aligners, CBCT & DSD

This roadmap is written for Director/Codex **and** for Nicko as the human with the camera, scanner and Blender itch.

The priority sequence is:

1. Ultra-thin veneer hero set
2. Implants (single + full arch + guides)
3. Spark / clear aligners & simple orthodontics
4. CBCT & 3D scanning visuals
5. Digital Smile Design overlays + 3D mockups

All assets are **generic, anonymised** and tagged for **SaaS reuse** via `tenantId` and `exportTargets`.

---

## 1. Veneers – First Wave (Signature Object)

**Goal:** create the “Champagne object” – the ultra-thin veneer – that can star everywhere:
hero videos, 3D viewer, explainers, and future AR.

### 1.1 Models to commission or sculpt first

1. `veneer_ultra_thin_single_tooth_turntable_v1`  
   - Single veneer hovering or resting on a subtle stand.  
   - Emphasise translucency and micro geometry.  
   - Match materials to `material.dental.ceramic.lithiumDisilicate.ultraThin`.

2. `veneer_ultra_thin_row_before_after_overlay_v1`  
   - Upper anterior row, before/after in one file (or easily paired states).  
   - Geometry clean enough for close-up macro.

3. `veneer_mockup_on_model_lab_scene_v1`  
   - Plaster/printed model with veneer mockups, plus a few lab tools.  
   - Used for “behind the scenes” and workflow storytelling.

**Metadata to keep with each asset:**

- `workflowStage`: e.g. `planning-mockup`, `lab-fabrication`, `final-restoration`
- `modality`: `3d-sculpt` or `scan-based`
- `exportTargets`: `web-glb`, `video-source`, `ar-preview` where appropriate
- `demoOnly`: `true` (no live PHI)

---

## 2. Implants – Education + Wow-Factor

**Goal:** show “what lives under the gum” in a way that is calm, precise and cinematic.

### 2.1 Priority models

1. `implant_single_crown_exploded_v1`  
   - Crown, abutment, implant, bone segment in one scene.  
   - Tuned to `mode_exploded` with clean component spacing.

2. `implant_full_arch_on_bar_turntable_v1`  
   - Full arch on bar, polished and hero-ready.  
   - Main wow-piece for full-arch pages.

3. `implant_surgical_guide_on_model_v1`  
   - Surgical guide on a model with sleeves visible.  
   - Good for workflow diagrams and short explainer clips.

**Metadata highlights:**

- `workflowStage`: `pre-surgical`, `treatment-explanation`, `final-restoration`
- `modality`: `scan-based` vs `3d-sculpt`
- Flags like `supportsAnnotation` for assets that will have callouts.

---

## 3. Spark & Clear Aligners + Orthodontics

**Goal:** show clarity, subtlety and progress over time.

### 3.1 Priority models

1. `spark_aligner_single_arch_turntable_v1`  
   - Spark-branded geometry using neutral tokens.  
   - Clear plastic, generic arch inside.

2. `aligner_treatment_progress_steps_v1`  
   - A single file or linked set showing stepwise tooth movement.  
   - Designed for `mode_step_sequence` and `mode_compare_before_after`.

3. `orthodontic_brackets_on_arch_v1`  
   - Simple metal brackets + archwire on a clean arch.  
   - Used for explaining fixed orthodontics, not showing a specific patient.

**Metadata to track:**

- `workflowStage`: `treatment-planning`, `final-appliance`
- `modality`: usually `3d-sculpt`
- Education flags like `supportsAnnotation`.

---

## 4. CBCT & 3D Scanning

You already live with CBCT and intraoral scans. This spec just gives them cinematic manners.

### 4.1 Priority assets

1. `cbct_jaw_segment_volume_v1`  
   - Volume or mesh representation of a jaw segment (NOT full skull).  
   - Tuned for `mode_cbct_slice` and `mode_volume_rotate`.

2. `cbct_implant_planning_overlay_v1`  
   - Volume + planned implants and paths as overlays.  
   - Needs clear separation of layers: bone, implants, guides/paths.

**Metadata to track:**

- `workflowStage`: `diagnosis`, `planning`
- `modality`: `cbct-volume`, `cbct-plus-plan`
- `supportsSliceNavigation`: true/false

---

## 5. Digital Smile Design (DSD) – Overlay + 3D Reveal

**Goal:** bridge 2D photos, overlays and full 3D mockups.

### 5.1 Priority assets

1. `dsd_smile_frame_overlay_v1`  
   - 2D/3D hybrid that sits on top of an imported photo.  
   - Smile frame lines, tooth shapes, and masks as overlay channels.

2. `dsd_3d_mockup_smile_turntable_v1`  
   - 3D smile band (lips + teeth) that can be rotated gently.  
   - Used for cinematic “this is where we’re going” moments.

**Metadata:**

- `workflowStage`: `smile-design`, `presentation`
- `modality`: `photo-plus-overlay` vs `3d-sculpt`
- `supportsPhotoImport`: for overlay-based assets.

---

## 6. Multi-Tenant & SaaS Considerations

All assets are defined under:

- `tenantId`: `"smh"` for your clinic  
- Paths like: `/tenants/smh/3d/{family}/{assetId}.glb`

To SaaS-ify later:

- Allow `tenantId: "shared"` or `tenantScope: ["smh", "shared"]` when Codex generalises assets.
- Keep `exportTargets` explicit so another clinic can choose:
  - only web,
  - web + video-source,
  - or AR-friendly assets.

---

## 7. Metadata Checklist (Per Asset)

For each GLB or scene, store at least:

- `id`
- `tenantId`
- `family` (veneers, implants, aligners, cbct, digital-smile-design, orthodontics)
- `workflowStage`
- `modality` (scan-based, 3d-sculpt, cbct-volume, photo-plus-overlay)
- `exportTargets` (web-glb, video-source, still-render, ar-preview)
- `anonymisationLevel` (always `high` for demo)
- Optional flags: `supportsAnnotation`, `supportsPhotoImport`, `supportsSliceNavigation`, `exportPriority`

---

## 8. Practical Production Order for You

If you’re doing this in waves with artists / Blender / scanners:

1. **Wave 1 – Veneer Signature Set**
   - Single ultra-thin veneer hero.
   - Before/after row.
   - Lab mockup scene.

2. **Wave 2 – Implants Core**
   - Single implant exploded.
   - Full-arch bar hero.
   - Surgical guide on model.

3. **Wave 3 – Aligners & Orthodontics**
   - Spark hero arch.
   - Progress steps sequence.
   - Brackets on arch.

4. **Wave 4 – CBCT & Planning**
   - Jaw volume.
   - Planning overlay with implants.

5. **Wave 5 – Digital Smile Design**
   - DSD overlay frame.
   - 3D smile mockup band.

Once these are in, Codex can wire them into `@champagne/3d` and your treatment manifests, and every future clinic you onboard just rides the same canon.
