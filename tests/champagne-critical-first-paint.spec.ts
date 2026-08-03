import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

type Rgba = [number, number, number, number];

type FirstPaintEvidence = {
  readyState: DocumentReadyState;
  tokens: {
    canvas: string;
    bgInk: string;
    brandInk: string;
    textInkHigh: string;
  };
  resolved: {
    canvas: string;
    bgInk: string;
    foreground: string;
  };
  surfaces: {
    root: string;
    body: string;
    main: string | null;
    hero: string | null;
    bodyText: string;
  };
  srgb: {
    canvas: Rgba;
    bgInk: Rgba;
    root: Rgba;
    body: Rgba;
    foreground: Rgba;
    bodyText: Rgba;
  };
  criticalStyle: {
    count: number;
    versions: Array<string | null>;
    cssText: string[];
    directHeadChildren: boolean[];
    exactCopyCount: number;
  };
  externalStylesheetLinks: string[];
  hero: {
    engine: string | null;
    stackCount: number;
    contentOpacity: string | null;
  };
};

type RuntimeErrors = {
  pageErrors: string[];
  consoleErrors: string[];
};

type FirstPaintWindow = Window & {
  __champagneCaptureCanvasEvidence?: () => FirstPaintEvidence;
  __champagneBodyAttachmentEvidence?: FirstPaintEvidence;
};

test.use({ serviceWorkers: "block" });
test.setTimeout(90_000);

function collectRuntimeErrors(page: Page): RuntimeErrors {
  const errors: RuntimeErrors = { pageErrors: [], consoleErrors: [] };
  page.on("pageerror", (error) => errors.pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.consoleErrors.push(message.text());
  });
  return errors;
}

async function installBodyAttachmentCapture(page: Page) {
  await page.addInitScript(() => {
    const capture = (): FirstPaintEvidence => {
      const root = document.documentElement;
      const body = document.body;
      if (!body) throw new Error("document.body is unavailable for first-paint capture");

      const rootStyle = getComputedStyle(root);
      const bodyStyle = getComputedStyle(body);
      const resolveTokenAsColor = (token: string) => {
        const probe = document.createElement("span");
        probe.style.color = `var(${token})`;
        probe.style.position = "fixed";
        probe.style.visibility = "hidden";
        body.appendChild(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      };
      const toSrgb = (color: string): Rgba => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("2D canvas context is unavailable");
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data) as Rgba;
      };

      const resolvedCanvas = resolveTokenAsColor("--surface-canvas");
      const resolvedBgInk = resolveTokenAsColor("--bg-ink");
      const resolvedForeground = resolveTokenAsColor("--text-ink-high");
      const rootBackground = rootStyle.backgroundColor;
      const bodyBackground = bodyStyle.backgroundColor;
      const bodyText = bodyStyle.color;
      const main = document.querySelector<HTMLElement>("main");
      const hero = document.querySelector<HTMLElement>("[data-hero-engine='v2']");
      const criticalStyles = Array.from(
        document.querySelectorAll<HTMLStyleElement>("style[data-champagne-critical-paint]"),
      );
      const criticalCss = criticalStyles[0]?.textContent ?? "";

      return {
        readyState: document.readyState,
        tokens: {
          canvas: rootStyle.getPropertyValue("--surface-canvas").trim(),
          bgInk: rootStyle.getPropertyValue("--bg-ink").trim(),
          brandInk: rootStyle.getPropertyValue("--brand-ink").trim(),
          textInkHigh: rootStyle.getPropertyValue("--text-ink-high").trim(),
        },
        resolved: {
          canvas: resolvedCanvas,
          bgInk: resolvedBgInk,
          foreground: resolvedForeground,
        },
        surfaces: {
          root: rootBackground,
          body: bodyBackground,
          main: main ? getComputedStyle(main).backgroundColor : null,
          hero: hero ? getComputedStyle(hero).backgroundColor : null,
          bodyText,
        },
        srgb: {
          canvas: toSrgb(resolvedCanvas),
          bgInk: toSrgb(resolvedBgInk),
          root: toSrgb(rootBackground),
          body: toSrgb(bodyBackground),
          foreground: toSrgb(resolvedForeground),
          bodyText: toSrgb(bodyText),
        },
        criticalStyle: {
          count: criticalStyles.length,
          versions: criticalStyles.map((style) =>
            style.getAttribute("data-champagne-critical-paint"),
          ),
          cssText: criticalStyles.map((style) => style.textContent ?? ""),
          directHeadChildren: criticalStyles.map((style) => style.parentElement === document.head),
          exactCopyCount: criticalCss
            ? Array.from(document.head.querySelectorAll<HTMLStyleElement>("style")).filter(
                (style) => style.textContent === criticalCss,
              ).length
            : 0,
        },
        externalStylesheetLinks: Array.from(
          document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet'][href]"),
          (link) => link.href,
        ),
        hero: {
          engine: hero?.dataset.heroEngine ?? null,
          stackCount: document.querySelectorAll("[data-v2-stack-instance]").length,
          contentOpacity: (() => {
            const content = document.querySelector<HTMLElement>("[data-v2-content-fade='true']");
            return content ? getComputedStyle(content).opacity : null;
          })(),
        },
      };
    };

    const target = window as FirstPaintWindow;
    target.__champagneCaptureCanvasEvidence = capture;
    const captureWhenBodyExists = () => {
      if (!document.body || target.__champagneBodyAttachmentEvidence) return;
      target.__champagneBodyAttachmentEvidence = capture();
      observer.disconnect();
    };
    const observer = new MutationObserver(captureWhenBodyExists);
    observer.observe(document, { childList: true, subtree: true });
    captureWhenBodyExists();
  });
}

async function holdExternalStylesheets(page: Page) {
  let releaseBarrier!: () => void;
  const barrier = new Promise<void>((resolve) => {
    releaseBarrier = resolve;
  });
  const heldUrls: string[] = [];
  const finishedUrls: string[] = [];
  let released = false;

  page.on("requestfinished", (request) => {
    if (heldUrls.includes(request.url())) finishedUrls.push(request.url());
  });

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = request.url();
    if (request.resourceType() !== "stylesheet" || !/^https?:\/\//.test(url)) {
      await route.continue();
      return;
    }
    heldUrls.push(url);
    await barrier;
    await route.continue();
  });

  return {
    heldUrls,
    finishedUrls,
    release() {
      if (released) return;
      released = true;
      releaseBarrier();
    },
  };
}

async function readBodyAttachmentEvidence(page: Page): Promise<FirstPaintEvidence> {
  return page.evaluate(() => {
    const evidence = (window as FirstPaintWindow).__champagneBodyAttachmentEvidence;
    if (!evidence) throw new Error("body-attachment evidence was not captured");
    return evidence;
  });
}

async function readCurrentEvidence(page: Page): Promise<FirstPaintEvidence> {
  return page.evaluate(() => {
    const capture = (window as FirstPaintWindow).__champagneCaptureCanvasEvidence;
    if (!capture) throw new Error("canvas evidence capture is unavailable");
    return capture();
  });
}

function expectOpaqueCanvas(evidence: FirstPaintEvidence) {
  expect(evidence.tokens.canvas).not.toBe("");
  expect(evidence.tokens.bgInk).not.toBe("");
  expect(evidence.resolved.bgInk).toBe(evidence.resolved.canvas);
  expect(evidence.surfaces.root).toBe(evidence.resolved.canvas);
  expect(evidence.surfaces.body).toBe(evidence.resolved.canvas);
  expect(evidence.srgb.bgInk).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.root).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.body).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.root[3]).toBe(255);
  expect(evidence.srgb.body[3]).toBe(255);
}

function contrastRatio(foreground: Rgba, background: Rgba) {
  const alpha = foreground[3] / 255;
  const composited = foreground.slice(0, 3).map(
    (channel, index) => channel * alpha + background[index] * (1 - alpha),
  );
  const luminance = (channels: number[]) =>
    channels
      .map((channel) => channel / 255)
      .map((channel) =>
        channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
      )
      .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  const foregroundLuminance = luminance(composited);
  const backgroundLuminance = luminance(background.slice(0, 3));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function expectReadableCriticalForeground(evidence: FirstPaintEvidence) {
  expect(evidence.tokens.textInkHigh).not.toBe("");
  expect(evidence.surfaces.bodyText).toBe(evidence.resolved.foreground);
  expect(evidence.srgb.bodyText).toEqual(evidence.srgb.foreground);
  expect(evidence.srgb.foreground[3]).toBeGreaterThan(0);
  expect(contrastRatio(evidence.srgb.foreground, evidence.srgb.canvas)).toBeGreaterThanOrEqual(4.5);
}

const cases = [
  { label: "mobile reduced motion", viewport: { width: 390, height: 844 }, reduced: true },
  { label: "mobile normal motion", viewport: { width: 390, height: 844 }, reduced: false },
  { label: "desktop reduced motion", viewport: { width: 1440, height: 900 }, reduced: true },
  { label: "desktop normal motion", viewport: { width: 1440, height: 900 }, reduced: false },
] as const;

for (const routePath of ["/", "/treatments/implants"] as const) {
  for (const browserCase of cases) {
    test(`critical canvas equals loaded canvas on ${routePath} with ${browserCase.label}`, async ({
      page,
    }, testInfo) => {
      const errors = collectRuntimeErrors(page);
      await page.setViewportSize(browserCase.viewport);
      await page.emulateMedia({
        reducedMotion: browserCase.reduced ? "reduce" : "no-preference",
      });
      await installBodyAttachmentCapture(page);
      const stylesheetGate = await holdExternalStylesheets(page);

      let early: FirstPaintEvidence;
      try {
        await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "commit" });
        await expect
          .poll(() => stylesheetGate.heldUrls.length, { timeout: 10_000 })
          .toBeGreaterThan(0);
        await page.waitForFunction(
          () => Boolean((window as FirstPaintWindow).__champagneBodyAttachmentEvidence),
          undefined,
          { polling: 1 },
        );
        early = await readBodyAttachmentEvidence(page);

        expect(early.readyState).toBe("loading");
        expect(early.criticalStyle.count).toBe(1);
        expect(early.criticalStyle.versions).toEqual(["v1"]);
        expect(early.criticalStyle.cssText[0]).not.toBe("");
        expect(early.criticalStyle.directHeadChildren).toEqual([true]);
        expect(early.criticalStyle.exactCopyCount).toBe(1);
        expect(early.externalStylesheetLinks.length).toBeGreaterThan(0);
        expect(
          stylesheetGate.heldUrls.some((url) =>
            new URL(url).pathname.startsWith("/_next/static/css/"),
          ),
        ).toBe(true);
        expectOpaqueCanvas(early);
        expectReadableCriticalForeground(early);
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
      const loaded = await readCurrentEvidence(page);

      expect(loaded.readyState).toBe("complete");
      expect(loaded.tokens.brandInk).not.toBe("");
      expect(loaded.criticalStyle.count).toBe(1);
      expect(loaded.criticalStyle.versions).toEqual(["v1"]);
      expect(loaded.criticalStyle.directHeadChildren).toEqual([true]);
      expect(loaded.criticalStyle.exactCopyCount).toBe(1);
      expectOpaqueCanvas(loaded);
      expect(loaded.srgb.canvas).toEqual(early.srgb.canvas);
      expect(loaded.srgb.root).toEqual(early.srgb.canvas);
      expect(loaded.srgb.body).toEqual(early.srgb.canvas);
      expect(loaded.surfaces.main).toBe("rgba(0, 0, 0, 0)");
      expect(loaded.surfaces.hero).toBe("rgba(0, 0, 0, 0)");
      expect(loaded.hero.engine).toBe("v2");
      expect(loaded.hero.stackCount).toBe(1);
      expect(loaded.hero.contentOpacity).toBe("1");
      expect(errors.pageErrors).toEqual([]);
      expect(errors.consoleErrors).toEqual([]);

      await testInfo.attach("critical-first-paint.json", {
        body: JSON.stringify(
          {
            routePath,
            browserCase,
            heldStylesheets: stylesheetGate.heldUrls,
            finishedStylesheets: stylesheetGate.finishedUrls,
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
