import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)"]);

type RuntimeErrors = {
  pageErrors: string[];
  consoleErrors: string[];
};

function collectRuntimeErrors(page: Page): RuntimeErrors {
  const errors: RuntimeErrors = { pageErrors: [], consoleErrors: [] };
  page.on("pageerror", (error) => errors.pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.consoleErrors.push(message.text());
  });
  return errors;
}

async function readSurfaceEvidence(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const bodyStyle = getComputedStyle(document.body);
    const main = document.querySelector<HTMLElement>("main");
    const header = document.querySelector<HTMLElement>("header");
    const hero = document.querySelector<HTMLElement>("[data-hero-engine='v2']");
    const footer = document.querySelector<HTMLElement>("footer");

    const resolveTokenAsColor = (token: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${token})`;
      probe.style.position = "fixed";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };

    const contexts = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-surface='porcelain'], [data-surface-tone='porcelain']",
      ),
    ).map((element) => ({
      color: getComputedStyle(element).color,
      textHigh: (() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--text-high)";
        element.appendChild(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      })(),
    }));

    const outerInk = document.createElement("div");
    outerInk.dataset.surface = "ink";
    const innerPorcelain = document.createElement("div");
    innerPorcelain.dataset.surface = "porcelain";
    const nestedInk = document.createElement("div");
    nestedInk.dataset.surface = "ink";
    innerPorcelain.appendChild(nestedInk);
    outerInk.appendChild(innerPorcelain);
    document.body.appendChild(outerInk);
    const nested = {
      outerInk: getComputedStyle(outerInk).color,
      porcelain: getComputedStyle(innerPorcelain).color,
      nestedInk: getComputedStyle(nestedInk).color,
    };
    outerInk.remove();

    const tokenNames = [
      "--surface-canvas",
      "--surface-ink",
      "--surface-ink-soft",
      "--surface-footer-emotion",
    ];

    return {
      tokens: Object.fromEntries(
        tokenNames.map((name) => [name, rootStyle.getPropertyValue(name).trim()]),
      ),
      resolved: {
        canvas: resolveTokenAsColor("--surface-canvas"),
        bgInk: resolveTokenAsColor("--bg-ink"),
        brandInk: resolveTokenAsColor("--brand-ink"),
        ink: resolveTokenAsColor("--surface-ink"),
        inkSoft: resolveTokenAsColor("--surface-ink-soft"),
        footerEmotion: resolveTokenAsColor("--surface-footer-emotion"),
        inkText: resolveTokenAsColor("--text-ink-high"),
        porcelainText: resolveTokenAsColor("--text-porcelain-high"),
      },
      surfaces: {
        root: rootStyle.backgroundColor,
        body: bodyStyle.backgroundColor,
        main: main ? getComputedStyle(main).backgroundColor : null,
        header: header ? getComputedStyle(header).backgroundColor : null,
        hero: hero ? getComputedStyle(hero).backgroundColor : null,
        footer: footer ? getComputedStyle(footer).backgroundColor : null,
      },
      heroEngine: hero?.dataset.heroEngine ?? null,
      stackCount: document.querySelectorAll("[data-v2-stack-instance]").length,
      contentOpacity: (() => {
        const content = document.querySelector<HTMLElement>("[data-v2-content-fade='true']");
        return content ? getComputedStyle(content).opacity : null;
      })(),
      contexts,
      nested,
    };
  });
}

function expectCanvasContinuity(evidence: Awaited<ReturnType<typeof readSurfaceEvidence>>) {
  expect(evidence.resolved.bgInk).toBe(evidence.resolved.canvas);
  expect(evidence.surfaces.root).toBe(evidence.resolved.canvas);
  expect(evidence.surfaces.body).toBe(evidence.resolved.canvas);
  expect(TRANSPARENT.has(evidence.surfaces.root)).toBe(false);
  expect(TRANSPARENT.has(evidence.surfaces.body)).toBe(false);
}

function expectSemanticEvidence(evidence: Awaited<ReturnType<typeof readSurfaceEvidence>>) {
  for (const value of Object.values(evidence.tokens)) expect(value).not.toBe("");

  expect(evidence.resolved.canvas).toBe(evidence.resolved.brandInk);
  expect(evidence.resolved.ink).toBe(evidence.resolved.brandInk);
  expectCanvasContinuity(evidence);
  expect(evidence.surfaces.header).not.toBeNull();
  expect(TRANSPARENT.has(evidence.surfaces.header ?? "")).toBe(false);
  expect(evidence.surfaces.main).toBe("rgba(0, 0, 0, 0)");
  expect(evidence.surfaces.hero).toBe("rgba(0, 0, 0, 0)");
  expect(evidence.surfaces.footer).toBe(evidence.resolved.footerEmotion);

  expect(evidence.heroEngine).toBe("v2");
  expect(evidence.stackCount).toBe(1);
  expect(evidence.contentOpacity).toBe("1");

  expect(evidence.contexts.length).toBeGreaterThan(0);
  for (const context of evidence.contexts) expect(context.color).toBe(context.textHigh);

  expect(evidence.nested.outerInk).toBe(evidence.resolved.inkText);
  expect(evidence.nested.porcelain).toBe(evidence.resolved.porcelainText);
  expect(evidence.nested.nestedInk).toBe(evidence.resolved.inkText);
}

async function expectFooterSemanticOwnership(page: Page) {
  const evidence = await page.evaluate(() => {
    const root = document.documentElement;
    const footer = document.querySelector<HTMLElement>("footer");
    const probe = document.createElement("div");
    probe.style.background = "var(--surface-1)";
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();

    const previousValue = root.style.getPropertyValue("--surface-footer-emotion");
    const previousPriority = root.style.getPropertyPriority("--surface-footer-emotion");
    root.style.setProperty("--surface-footer-emotion", "var(--surface-1)");
    const actual = footer ? getComputedStyle(footer).backgroundColor : null;

    if (previousValue) {
      root.style.setProperty("--surface-footer-emotion", previousValue, previousPriority);
    } else {
      root.style.removeProperty("--surface-footer-emotion");
    }

    return { actual, expected };
  });

  expect(evidence.actual).not.toBeNull();
  expect(evidence.actual).toBe(evidence.expected);
}

test("surface semantics remain deterministic on desktop direct loads and navigation", async ({
  page,
}) => {
  const errors = collectRuntimeErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  expectSemanticEvidence(await readSurfaceEvidence(page));
  await expectFooterSemanticOwnership(page);

  await page.locator('header a[href="/treatments"]').click();
  await page.waitForURL("**/treatments");
  await page.waitForLoadState("networkidle");
  expectSemanticEvidence(await readSurfaceEvidence(page));

  await page.goBack({ waitUntil: "networkidle" });
  expectSemanticEvidence(await readSurfaceEvidence(page));
  await page.goForward({ waitUntil: "networkidle" });
  expectSemanticEvidence(await readSurfaceEvidence(page));

  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});

for (const theme of ["dawn", "dusk", "night"] as const) {
  test(`${theme} preserves root, body and semantic canvas continuity`, async ({ page }) => {
    const errors = collectRuntimeErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.evaluate((selectedTheme) => {
      document.documentElement.dataset.theme = selectedTheme;
    }, theme);

    const evidence = await readSurfaceEvidence(page);
    expectCanvasContinuity(evidence);
    expect(evidence.heroEngine).toBe("v2");
    expect(evidence.stackCount).toBe(1);
    expect(evidence.contentOpacity).toBe("1");
    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
  });
}
