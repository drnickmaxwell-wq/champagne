import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
type Rgba = [number, number, number, number];
type HeroExpectation = "present" | "absent";
type PaintContract = "public-head" | "streaming-fallback" | "loaded-streaming";
type Evidence = {
  readyState: DocumentReadyState;
  srgb: { canvas: Rgba; root: Rgba; body: Rgba; foreground: Rgba; bodyText: Rgba };
  critical: {
    count: number;
    directHeadChildren: boolean[];
    versions: Array<string | null>;
  };
  inline: {
    rootCanvas: string;
    bodyCanvas: string;
    rootForeground: string;
    bodyForeground: string;
  };
  fallback: {
    count: number;
    canvas: string | null;
    foreground: string | null;
    background: Rgba | null;
    color: Rgba | null;
    coversViewport: boolean;
  };
  stylesheets: string[];
  surfaces: { main: string | null; hero: string | null };
  hero: { engine: string | null; stackCount: number; opacity: string | null };
};
type CfpWindow = Window & {
  __cfpCapture?: () => Evidence;
  __cfpParser?: Evidence;
  __cfpEarly?: Evidence;
};

test.use({ serviceWorkers: "block" });
test.setTimeout(90_000);

const mobileReduced = { label: "mobile reduced", viewport: { width: 390, height: 844 }, reduced: true };
const mobileNormal = { label: "mobile normal", viewport: { width: 390, height: 844 }, reduced: false };
const desktopReduced = { label: "desktop reduced", viewport: { width: 1440, height: 900 }, reduced: true };
const desktopNormal = { label: "desktop normal", viewport: { width: 1440, height: 900 }, reduced: false };
const fullMatrix = [mobileReduced, mobileNormal, desktopReduced, desktopNormal] as const;
type RouteCase = {
  label: string;
  path: string;
  hero: HeroExpectation;
  requiresExternalStylesheet: boolean;
  matrix:
    | typeof fullMatrix
    | readonly [typeof mobileReduced, typeof desktopNormal]
    | readonly [typeof mobileNormal, typeof desktopReduced];
};
const routes: RouteCase[] = [
  { label: "home", path: "/", hero: "present", requiresExternalStylesheet: true, matrix: fullMatrix },
  {
    label: "treatment",
    path: "/treatments/implants",
    hero: "present",
    requiresExternalStylesheet: true,
    matrix: fullMatrix,
  },
  {
    label: "utility",
    path: "/contact",
    hero: "present",
    requiresExternalStylesheet: true,
    matrix: [mobileReduced, desktopNormal],
  },
  {
    label: "internal non-Hero",
    path: "/champagne/sections-debug",
    hero: "absent",
    requiresExternalStylesheet: false,
    matrix: [mobileNormal, desktopReduced],
  },
];

function runtimeErrors(page: Page) {
  const errors = { page: [] as string[], console: [] as string[] };
  page.on("pageerror", (error) => errors.page.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.console.push(message.text());
  });
  return errors;
}

async function installCapture(page: Page) {
  await page.addInitScript(() => {
    const toRgba = (color: string): Rgba => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("2D canvas unavailable");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data) as Rgba;
    };
    const resolveToken = (token: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${token})`;
      probe.hidden = true;
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    const capture = (): Evidence => {
      if (!document.body) throw new Error("body unavailable");
      const root = document.documentElement;
      const body = document.body;
      const rootStyle = getComputedStyle(root);
      const bodyStyle = getComputedStyle(body);
      const canvas = resolveToken("--surface-canvas");
      const foreground = resolveToken("--text-ink-high");
      const critical = Array.from(
        document.querySelectorAll<HTMLStyleElement>(
          'style[data-champagne-critical-paint="v1"]',
        ),
      );
      const fallbackElements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-champagne-critical-fallback='v1']"),
      );
      const fallback = fallbackElements[0] ?? null;
      const fallbackStyle = fallback ? getComputedStyle(fallback) : null;
      const fallbackRect = fallback?.getBoundingClientRect() ?? null;
      const hero = document.querySelector<HTMLElement>("[data-hero-engine='v2']");
      const main = document.querySelector<HTMLElement>("main");
      const content = document.querySelector<HTMLElement>("[data-v2-content-fade='true']");
      return {
        readyState: document.readyState,
        srgb: {
          canvas: toRgba(canvas),
          root: toRgba(rootStyle.backgroundColor),
          body: toRgba(bodyStyle.backgroundColor),
          foreground: toRgba(foreground),
          bodyText: toRgba(bodyStyle.color),
        },
        critical: {
          count: critical.length,
          directHeadChildren: critical.map((style) => style.parentElement === document.head),
          versions: critical.map((style) => style.dataset.champagneCriticalPaint ?? null),
        },
        inline: {
          rootCanvas: root.style.getPropertyValue("--surface-canvas").trim(),
          bodyCanvas: body.style.getPropertyValue("--surface-canvas").trim(),
          rootForeground: root.style.getPropertyValue("--text-ink-high").trim(),
          bodyForeground: body.style.getPropertyValue("--text-ink-high").trim(),
        },
        fallback: {
          count: fallbackElements.length,
          canvas: fallback?.style.getPropertyValue("--surface-canvas").trim() ?? null,
          foreground: fallback?.style.getPropertyValue("--text-ink-high").trim() ?? null,
          background: fallbackStyle ? toRgba(fallbackStyle.backgroundColor) : null,
          color: fallbackStyle ? toRgba(fallbackStyle.color) : null,
          coversViewport: Boolean(
            fallbackRect &&
              fallbackRect.top <= 0 &&
              fallbackRect.left <= 0 &&
              fallbackRect.right >= window.innerWidth &&
              fallbackRect.bottom >= window.innerHeight,
          ),
        },
        stylesheets: Array.from(
          document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet'][href]"),
          (link) => link.href,
        ),
        surfaces: {
          main: main ? getComputedStyle(main).backgroundColor : null,
          hero: hero ? getComputedStyle(hero).backgroundColor : null,
        },
        hero: {
          engine: hero?.dataset.heroEngine ?? null,
          stackCount: document.querySelectorAll("[data-v2-stack-instance]").length,
          opacity: content ? getComputedStyle(content).opacity : null,
        },
      };
    };
    const target = window as CfpWindow;
    target.__cfpCapture = capture;
    const record = () => {
      if (!document.body || target.__cfpParser) return;
      target.__cfpParser = capture();
      observer.disconnect();
      requestAnimationFrame(() => {
        target.__cfpEarly = capture();
      });
    };
    const observer = new MutationObserver(record);
    observer.observe(document, { childList: true, subtree: true });
    record();
  });
}

async function holdStylesheets(page: Page) {
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  const heldUrls: string[] = [];
  const finishedUrls: string[] = [];
  page.on("requestfinished", (request) => {
    if (heldUrls.includes(request.url())) finishedUrls.push(request.url());
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "stylesheet" || !/^https?:\/\//.test(request.url())) {
      await route.continue();
      return;
    }
    heldUrls.push(request.url());
    await barrier;
    await route.continue();
  });
  return { heldUrls, finishedUrls, release };
}

function luminance(rgb: number[]) {
  return rgb
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(foreground: Rgba, background: Rgba) {
  const alpha = foreground[3] / 255;
  const composited = foreground
    .slice(0, 3)
    .map((channel, index) => channel * alpha + background[index] * (1 - alpha));
  const light = Math.max(luminance(composited), luminance(background.slice(0, 3)));
  const dark = Math.min(luminance(composited), luminance(background.slice(0, 3)));
  return (light + 0.05) / (dark + 0.05);
}

function expectCriticalResource(evidence: Evidence) {
  expect(evidence.critical.count).toBe(1);
  expect(evidence.critical.directHeadChildren).toEqual([true]);
  expect(evidence.critical.versions).toEqual(["v1"]);
}

function expectDocumentPaint(evidence: Evidence) {
  expect(evidence.inline.rootCanvas).not.toBe("");
  expect(evidence.inline.rootCanvas).toBe(evidence.inline.bodyCanvas);
  expect(evidence.inline.rootForeground).not.toBe("");
  expect(evidence.inline.rootForeground).toBe(evidence.inline.bodyForeground);
  expect(evidence.srgb.root).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.body).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.root[3]).toBe(255);
  expect(evidence.srgb.bodyText).toEqual(evidence.srgb.foreground);
  expect(contrast(evidence.srgb.foreground, evidence.srgb.canvas)).toBeGreaterThanOrEqual(4.5);
}

function expectPaint(evidence: Evidence, contract: PaintContract) {
  if (contract === "streaming-fallback") {
    expect([0, 1]).toContain(evidence.critical.count);
    if (evidence.critical.count === 1) expectCriticalResource(evidence);
    expect(evidence.fallback.count).toBe(1);
    expect(evidence.fallback.canvas).not.toBe("");
    expect(evidence.fallback.foreground).not.toBe("");
    expect(evidence.fallback.background).not.toBeNull();
    expect(evidence.fallback.color).not.toBeNull();
    expect(evidence.fallback.coversViewport).toBe(true);
    expect(evidence.fallback.background?.[3]).toBe(255);
    expect(
      contrast(evidence.fallback.color as Rgba, evidence.fallback.background as Rgba),
    ).toBeGreaterThanOrEqual(4.5);
    return;
  }

  if (contract === "public-head") {
    expectCriticalResource(evidence);
  } else {
    expect([0, 1]).toContain(evidence.critical.count);
    if (evidence.critical.count === 1) expectCriticalResource(evidence);
  }
  expectDocumentPaint(evidence);
}

for (const route of routes) {
  for (const browser of route.matrix) {
    test(`${route.label} first paint equals loaded paint with ${browser.label}`, async ({ page }, testInfo) => {
      const errors = runtimeErrors(page);
      await page.setViewportSize(browser.viewport);
      await page.emulateMedia({ reducedMotion: browser.reduced ? "reduce" : "no-preference" });
      await installCapture(page);
      const stylesheetGate = await holdStylesheets(page);
      let parser: Evidence;
      let early: Evidence;
      try {
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "commit" });
        if (route.requiresExternalStylesheet) {
          await expect
            .poll(() => stylesheetGate.heldUrls.length, { timeout: 10_000 })
            .toBeGreaterThan(0);
          await page.waitForFunction(() => Boolean((window as CfpWindow).__cfpParser), undefined, {
            polling: 1,
          });
        } else {
          await page.waitForFunction(() => Boolean((window as CfpWindow).__cfpEarly), undefined, {
            polling: 1,
          });
        }
        parser = await page.evaluate(() => (window as CfpWindow).__cfpParser as Evidence);
        early = route.requiresExternalStylesheet
          ? parser
          : await page.evaluate(() => (window as CfpWindow).__cfpEarly as Evidence);
        expect(parser.readyState).toBe("loading");
        if (route.requiresExternalStylesheet) {
          expect(early.readyState).toBe("loading");
          expect(early.stylesheets.length).toBeGreaterThan(0);
          expect(
            stylesheetGate.heldUrls.some((url) =>
              new URL(url).pathname.startsWith("/_next/static/css/"),
            ),
          ).toBe(true);
        } else {
          expect(stylesheetGate.heldUrls).toEqual([]);
        }
        expectPaint(
          early,
          route.requiresExternalStylesheet ? "public-head" : "streaming-fallback",
        );
      } finally {
        stylesheetGate.release();
      }

      await expect
        .poll(
          () =>
            stylesheetGate.heldUrls.every((url) => stylesheetGate.finishedUrls.includes(url)),
          { timeout: 15_000 },
        )
        .toBe(true);
      await page.waitForLoadState("load", { timeout: 60_000 });
      await page.waitForFunction(() => document.readyState === "complete");
      await page.waitForLoadState("networkidle");
      const loaded = await page.evaluate(
        () => (window as CfpWindow).__cfpCapture?.() as Evidence,
      );
      expectPaint(
        loaded,
        route.requiresExternalStylesheet ? "public-head" : "loaded-streaming",
      );
      expect(loaded.fallback.count).toBe(0);
      const earlyCanvas = route.requiresExternalStylesheet
        ? early.srgb.canvas
        : (early.fallback.background as Rgba);
      const earlyForeground = route.requiresExternalStylesheet
        ? early.srgb.foreground
        : (early.fallback.color as Rgba);
      expect(loaded.srgb.canvas).toEqual(earlyCanvas);
      expect(loaded.srgb.foreground).toEqual(earlyForeground);
      expect(loaded.surfaces.main).toBe("rgba(0, 0, 0, 0)");

      if (route.hero === "present") {
        expect(loaded.surfaces.hero).toBe("rgba(0, 0, 0, 0)");
        expect(loaded.hero).toEqual({ engine: "v2", stackCount: 1, opacity: "1" });
      } else {
        expect(loaded.hero).toEqual({ engine: null, stackCount: 0, opacity: null });
      }
      expect(errors.page).toEqual([]);
      expect(errors.console).toEqual([]);
      await testInfo.attach("critical-first-paint.json", {
        body: JSON.stringify(
          {
            route,
            browser,
            heldUrls: stylesheetGate.heldUrls,
            finishedUrls: stylesheetGate.finishedUrls,
            parser,
            early,
            loaded,
          },
          null,
          2,
        ),
        contentType: "application/json",
      });
    });
  }
}
