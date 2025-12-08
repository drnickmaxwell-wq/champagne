# St Mary's House Luxury Components - Implementation Guide

**Version:** 1.0.0  
**Date:** October 26, 2025  
**Project:** SMH Luxury Components  

---

## 1. Overview

This guide provides instructions for manually integrating the `HeroLuxury` and `SmileJourney` components into the St Mary’s House Dental website codebase. These components have been built to the exact specifications of the Champagne Design System.

## 2. Prerequisites

- **Node.js & pnpm:** Ensure you have Node.js (v18+) and pnpm installed.
- **Repository:** You should have a local copy of the `drnickmaxwell-wq/please-work` repository.
- **Dependencies:** Run `pnpm install` in the project root to install all necessary dependencies.

## 3. File Structure

The updated components and their dependencies are located in the following directories:

- **Components:** `/components/sections/`
  - `HeroLuxury.tsx`
  - `SmileJourney.tsx`
- **Styles:** `/styles/`
  - `tokens.css` (Updated with all required brand tokens)
- **Assets:** `/public/assets/manus/`
  - All required images, including wave masks, particles, textures, and icons.

## 4. Integration Steps

If a manual merge is required, follow these steps to replace the existing components with the newly implemented versions.

### Step 4.1: Replace Components

1.  **Delete Existing Components:** Remove the old `HeroLuxury.tsx` and `SmileJourney.tsx` files from `/components/sections/`.
2.  **Copy New Components:** Copy the new `HeroLuxury.tsx` and `SmileJourney.tsx` files into the `/components/sections/` directory.

```bash
# Navigate to your project root
cp path/to/new/HeroLuxury.tsx components/sections/
cp path/to/new/SmileJourney.tsx components/sections/
```

### Step 4.2: Update Design Tokens

The `styles/tokens.css` file has been updated to include all necessary brand, motion, and glass morphism tokens. 

1.  **Replace Tokens File:** Overwrite the existing `styles/tokens.css` with the new version provided in this deliverable.

```bash
# Navigate to your project root
cp path/to/new/tokens.css styles/
```

### Step 4.3: Verify Assets

All visual assets (`.webp`, `.svg`) are referenced from the `/public/assets/manus/` directory.

1.  **Verify Directory:** Ensure the `/public/assets/manus/` directory exists and contains the following subdirectories:
    - `icons/`
    - `particles/`
    - `textures/`
    - `waves/`
2.  **Copy Assets:** If missing, copy the entire `manus` asset folder into your `public/assets/` directory.

### Step 4.4: Icon Colour Utilities

SVG icons in `/public/icons/` and `/public/assets/manus/icons/` now default to `stroke="currentColor"`/`fill="currentColor"` so that brand colour tokens can be applied contextually. When inlining the SVG markup (instead of `<img>`), scope the colour with the utility helpers added to `app/globals.css`:

```html
<span class="icon-brand icon-brand--magenta icon-accent--teal">
  <!-- inline SVG -->
</span>
```

- `.icon-brand` ensures the icon inherits the `color` property.
- `.icon-brand--{magenta|teal|gold}` sets the primary stroke/fill via `--icon-primary-color`.
- `.icon-accent--{magenta|teal|gold}` sets the optional accent channel used by icons with secondary fills.

When the SVG is referenced via `<img>` the embedded fallback values preserve the legacy palette, so no changes are required for existing image references.

### Step 4.5: Verify Page Integration

The main homepage at `app/page.tsx` should already be set up to import and render these components. No changes are typically needed here, but you can verify the implementation:

```tsx
// app/page.tsx

import HeroLuxury from '@/components/sections/HeroLuxury';
import SmileJourney from '@/components/sections/SmileJourney';

export default function Home() {
  return (
    <main>
      <HeroLuxury />
      <SmileJourney />
      {/* ... other components */}
    </main>
  );
}
```

## 5. Build and Test

After completing the integration steps, run the following commands to ensure everything is working correctly:

1.  **Type Check:**

    ```bash
    pnpm tsc --noEmit
    ```

2.  **Lint Check:**

    ```bash
    pnpm lint
    ```

3.  **Production Build:**

    ```bash
    pnpm build
    ```

4.  **Run Development Server:**

    ```bash
    pnpm dev
    ```

Open your browser to `http://localhost:3000` to visually inspect the `HeroLuxury` and `SmileJourney` components and confirm they render correctly.

---

## 6. Final Checklist

- [x] `HeroLuxury.tsx` component replaced.
- [x] `SmileJourney.tsx` component replaced.
- [x] `styles/tokens.css` updated with all required design tokens.
- [x] All image assets copied to `/public/assets/manus/`.
- [x] Project successfully builds without errors (`pnpm build`).
- [x] Components render correctly on the homepage in the development environment.


