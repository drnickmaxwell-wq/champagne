import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Local runs:
 * V1: pnpm exec playwright test tests/hero-visual.spec.ts
 * V2: NEXT_PUBLIC_HERO_ENGINE=v2 pnpm exec playwright test tests/hero-visual.spec.ts
 */

const HERO_SELECTOR = "[data-hero-engine]";
const REQUIRED_SURFACES = [
  "[data-surface-id=\"field.waveBackdrop\"]",
  "[data-surface-id=\"field.waveRings\"]",
  "[data-surface-id=\"field.dotGrid\"]",
];

const VIEWPORTS = [
  { name: "desktop", size: { width: 1440, height: 900 } },
  { name: "mobile", size: { width: 390, height: 844 } },
];

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const ENGINE =
  process.env.NEXT_PUBLIC_HERO_ENGINE?.trim().toLowerCase() === "v2"
    ? "v2"
    : "v1";

const DISABLE_MOTION_CSS = `
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
  video[data-surface-id^="sacred.motion"],
  [data-surface-id^="sacred.motion"] video {
    display: none !important;
  }
`;

async function preparePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((css) => {
    const style = document.createElement("style");
    style.setAttribute("data-playwright", "hero-visual");
    style.textContent = css;
    const target = document.head ?? document.documentElement;
    target.appendChild(style);
  }, DISABLE_MOTION_CSS);
}

test.describe(`hero visual (${ENGINE})`, () => {
  for (const viewport of VIEWPORTS) {
    test.describe(viewport.name, () => {
      test.use({ viewport: viewport.size, deviceScaleFactor: 1 });

      test(`snapshot ${viewport.name}`, async ({ page }) => {
        await preparePage(page);

        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");
        await page.waitForFunction(
          () => document.fonts && document.fonts.status === "loaded",
        );

        const hero = page.locator(HERO_SELECTOR);
        await expect(hero).toHaveAttribute("data-hero-engine", ENGINE);
        await expect(hero).toBeVisible();

        for (const surfaceSelector of REQUIRED_SURFACES) {
          await page
            .locator(surfaceSelector)
            .first()
            .waitFor({ state: "attached" });
        }

        await page.waitForTimeout(250);

        await expect(hero.screenshot()).resolves.toMatchSnapshot(
          `hero-${ENGINE}-${viewport.name}.png`,
        );
      });
    });
  }
});
