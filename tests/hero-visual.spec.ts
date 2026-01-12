import { test, expect, type Page } from "playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const normalizedEngine = (process.env.NEXT_PUBLIC_HERO_ENGINE ?? "")
  .trim()
  .replace(/^"(.*)"$/, "$1")
  .replace(/^'(.*)'$/, "$1")
  .toLowerCase();
const isV2 = normalizedEngine === "v2";

const disableAnimations = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `,
  });
};

const gotoHome = async (page: Page) => {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-hero-engine]", { state: "visible" });
};

const expectHeroScreenshot = async (page: Page, name: string) => {
  const hero = page.locator("[data-hero-engine]");
  await expect(hero).toHaveScreenshot(name, { animations: "disabled" });
};

test.describe("hero visual parity - desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("hero v1 snapshot", async ({ page }) => {
    test.skip(isV2, "Requires default V1 (NEXT_PUBLIC_HERO_ENGINE unset)");
    await gotoHome(page);
    await disableAnimations(page);
    await expectHeroScreenshot(page, "hero-v1-desktop.png");
  });

  test("hero v2 snapshot", async ({ page }) => {
    test.skip(!isV2, "Requires NEXT_PUBLIC_HERO_ENGINE=v2");
    await gotoHome(page);
    await disableAnimations(page);
    await expectHeroScreenshot(page, "hero-v2-desktop.png");
  });
});

test.describe("hero visual parity - mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, reducedMotion: "reduce" });

  test("hero v1 snapshot", async ({ page }) => {
    test.skip(isV2, "Requires default V1 (NEXT_PUBLIC_HERO_ENGINE unset)");
    await gotoHome(page);
    await disableAnimations(page);
    await expectHeroScreenshot(page, "hero-v1-mobile.png");
  });

  test("hero v2 snapshot", async ({ page }) => {
    test.skip(!isV2, "Requires NEXT_PUBLIC_HERO_ENGINE=v2");
    await gotoHome(page);
    await disableAnimations(page);
    await expectHeroScreenshot(page, "hero-v2-mobile.png");
  });
});
