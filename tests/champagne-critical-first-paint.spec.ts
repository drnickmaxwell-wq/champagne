import { inflateSync } from "node:zlib";
import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const CRITICAL_RESOURCE = "champagne-critical-paint-v1";

type Rgba = [number, number, number, number];
type HeroExpectation = "present" | "not-applicable";
type PaintResult = { canvas: Rgba; foreground: Rgba };
type BrowserCase = {
  label: string;
  viewport: { width: number; height: number };
  reduced: boolean;
};
type RouteCase = {
  label: string;
  path: string;
  hero: HeroExpectation;
  matrix: readonly BrowserCase[];
};
type Evidence = {
  readyState: DocumentReadyState;
  srgb: {
    canvas: Rgba;
    root: Rgba;
    body: Rgba;
    foreground: Rgba;
    bodyText: Rgba;
  };
  critical: {
    count: number;
    directHeadChildren: boolean[];
    resources: Array<string | null>;
    precedences: Array<string | null>;
  };
  inline: {
    rootCanvas: string;
    bodyCanvas: string;
    rootForeground: string;
    bodyForeground: string;
  };
  fallbackCount: number;
  stylesheets: string[];
  semantics: {
    header: boolean;
    main: boolean;
    footer: boolean;
    mainTextLength: number;
    ariaHiddenAncestors: number;
  };
  surfaces: { main: string | null; hero: string | null };
  hero: { engine: string | null; stackCount: number; opacity: string | null };
};
type CfpWindow = Window & { __cfpCapture?: () => Evidence };

test.use({ serviceWorkers: "block" });
test.setTimeout(90_000);

const mobileReduced = {
  label: "mobile reduced",
  viewport: { width: 390, height: 844 },
  reduced: true,
};
const mobileNormal = {
  label: "mobile normal",
  viewport: { width: 390, height: 844 },
  reduced: false,
};
const desktopReduced = {
  label: "desktop reduced",
  viewport: { width: 1440, height: 900 },
  reduced: true,
};
const desktopNormal = {
  label: "desktop normal",
  viewport: { width: 1440, height: 900 },
  reduced: false,
};
const fullMatrix = [mobileReduced, mobileNormal, desktopReduced, desktopNormal] as const;
const routes: RouteCase[] = [
  { label: "home", path: "/", hero: "present", matrix: fullMatrix },
  {
    label: "treatment",
    path: "/treatments/implants",
    hero: "present",
    matrix: fullMatrix,
  },
  {
    label: "utility",
    path: "/contact",
    hero: "present",
    matrix: [mobileReduced, desktopNormal],
  },
  {
    label: "internal lab",
    path: "/champagne/sections-debug",
    hero: "not-applicable",
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
  await page.addInitScript((criticalResource) => {
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

    (window as CfpWindow).__cfpCapture = (): Evidence => {
      if (!document.body) throw new Error("body unavailable");
      const root = document.documentElement;
      const body = document.body;
      const rootStyle = getComputedStyle(root);
      const bodyStyle = getComputedStyle(body);
      const canvas = resolveToken("--surface-canvas");
      const foreground = resolveToken("--text-ink-high");
      const critical = Array.from(document.querySelectorAll<HTMLStyleElement>("style")).filter(
        (style) =>
          [style.getAttribute("data-href"), style.getAttribute("href")].includes(
            criticalResource,
          ),
      );
      const hero = document.querySelector<HTMLElement>("[data-hero-engine='v2']");
      const main = document.querySelector<HTMLElement>("main");
      const header = document.querySelector<HTMLElement>("header");
      const footer = document.querySelector<HTMLElement>("footer");
      const content = document.querySelector<HTMLElement>("[data-v2-content-fade='true']");
      const semanticElements = [header, main, footer].filter(Boolean) as HTMLElement[];

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
          resources: critical.map(
            (style) => style.getAttribute("data-href") ?? style.getAttribute("href"),
          ),
          precedences: critical.map(
            (style) => style.getAttribute("data-precedence") ?? style.getAttribute("precedence"),
          ),
        },
        inline: {
          rootCanvas: root.style.getPropertyValue("--surface-canvas").trim(),
          bodyCanvas: body.style.getPropertyValue("--surface-canvas").trim(),
          rootForeground: root.style.getPropertyValue("--text-ink-high").trim(),
          bodyForeground: body.style.getPropertyValue("--text-ink-high").trim(),
        },
        fallbackCount: document.querySelectorAll("[data-champagne-critical-fallback]").length,
        stylesheets: Array.from(
          document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet'][href]"),
          (link) => link.href,
        ),
        semantics: {
          header: Boolean(header),
          main: Boolean(main),
          footer: Boolean(footer),
          mainTextLength: main?.innerText.trim().length ?? 0,
          ariaHiddenAncestors: semanticElements.filter((element) =>
            element.closest('[aria-hidden="true"]'),
          ).length,
        },
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
  }, CRITICAL_RESOURCE);
}

async function holdHydrationScripts(page: Page) {
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
    if (request.resourceType() !== "script" || !/^https?:\/\//.test(request.url())) {
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
  expect(evidence.critical.resources).toEqual([CRITICAL_RESOURCE]);
  expect(evidence.critical.precedences).toEqual(["critical"]);
}

function expectMeaningfulSsr(evidence: Evidence, requireFooter: boolean) {
  expect(evidence.fallbackCount).toBe(0);
  expect(evidence.semantics.header).toBe(true);
  expect(evidence.semantics.main).toBe(true);
  if (requireFooter) expect(evidence.semantics.footer).toBe(true);
  expect(evidence.semantics.mainTextLength).toBeGreaterThan(20);
  expect(evidence.semantics.ariaHiddenAncestors).toBe(0);
}

function expectDocumentPaint(evidence: Evidence, requireFooter: boolean): PaintResult {
  expectCriticalResource(evidence);
  expect(evidence.stylesheets).toEqual([]);
  expect(evidence.inline.rootCanvas).toBe("");
  expect(evidence.inline.bodyCanvas).toBe("");
  expect(evidence.inline.rootForeground).toBe("");
  expect(evidence.inline.bodyForeground).toBe("");
  expect(evidence.srgb.root).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.body).toEqual(evidence.srgb.canvas);
  expect(evidence.srgb.root[3]).toBe(255);
  expect(evidence.srgb.body[3]).toBe(255);
  expect(evidence.srgb.bodyText).toEqual(evidence.srgb.foreground);
  expect(contrast(evidence.srgb.foreground, evidence.srgb.canvas)).toBeGreaterThanOrEqual(4.5);
  expectMeaningfulSsr(evidence, requireFooter);
  return { canvas: evidence.srgb.canvas, foreground: evidence.srgb.foreground };
}

function paeth(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodePng(buffer: Buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error("unexpected screenshot format");
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];

  for (let offset = 8; offset < buffer.length; ) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      colorType = data[9];
      if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
        throw new Error(`unsupported screenshot PNG ${bitDepth}/${colorType}`);
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * stride);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[sourceOffset + x];
      const left = x >= bytesPerPixel ? pixels[y * stride + x - bytesPerPixel] : 0;
      const above = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft =
        y > 0 && x >= bytesPerPixel ? pixels[(y - 1) * stride + x - bytesPerPixel] : 0;
      let value = raw;
      if (filter === 1) value = (raw + left) & 255;
      else if (filter === 2) value = (raw + above) & 255;
      else if (filter === 3) value = (raw + Math.floor((left + above) / 2)) & 255;
      else if (filter === 4) value = (raw + paeth(left, above, upperLeft)) & 255;
      else if (filter !== 0) throw new Error(`unsupported PNG filter ${filter}`);
      pixels[y * stride + x] = value;
    }
    sourceOffset += stride;
  }

  return {
    width,
    height,
    pixel(x: number, y: number): Rgba {
      const offset = y * stride + x * bytesPerPixel;
      return [
        pixels[offset],
        pixels[offset + 1],
        pixels[offset + 2],
        colorType === 6 ? pixels[offset + 3] : 255,
      ];
    },
  };
}

function assertScreenshotContainsCanvas(screenshot: Buffer, canvas: Rgba) {
  const image = decodePng(screenshot);
  const points = [
    [2, 2],
    [image.width - 3, 2],
    [2, image.height - 3],
    [image.width - 3, image.height - 3],
  ];
  const matches = points
    .map(([x, y]) => image.pixel(x, y))
    .filter(
      (pixel) =>
        pixel[3] === 255 &&
        pixel.slice(0, 3).every((channel, index) => Math.abs(channel - canvas[index]) <= 8),
    );
  expect(matches.length).toBeGreaterThan(0);
}

for (const route of routes) {
  for (const browserCase of route.matrix) {
    test(`${route.label} actual parser-time paint equals loaded paint with ${browserCase.label}`, async ({
      page,
    }, testInfo) => {
      const errors = runtimeErrors(page);
      const stylesheetRequests: string[] = [];
      page.on("request", (request) => {
        if (request.resourceType() === "stylesheet") stylesheetRequests.push(request.url());
      });
      await page.setViewportSize(browserCase.viewport);
      await page.emulateMedia({
        reducedMotion: browserCase.reduced ? "reduce" : "no-preference",
      });
      await installCapture(page);
      const scriptGate = await holdHydrationScripts(page);
      let early: Evidence;
      let earlyPaint: PaintResult;
      let screenshot: Buffer;

      try {
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "commit" });
        await expect.poll(() => scriptGate.heldUrls.length, { timeout: 10_000 }).toBeGreaterThan(0);
        await page.waitForFunction(
          () =>
            Boolean(
              document.body &&
                document.querySelector("main") &&
                (window as CfpWindow).__cfpCapture,
            ),
          undefined,
          { polling: 1 },
        );
        await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
        early = await page.evaluate(() => (window as CfpWindow).__cfpCapture?.() as Evidence);
        expect(early.readyState).toBe("loading");
        expect(stylesheetRequests).toEqual([]);
        earlyPaint = expectDocumentPaint(early, false);
        screenshot = await page.screenshot({ type: "png" });
        assertScreenshotContainsCanvas(screenshot, earlyPaint.canvas);
      } finally {
        scriptGate.release();
      }

      await expect
        .poll(
          () => scriptGate.heldUrls.every((url) => scriptGate.finishedUrls.includes(url)),
          { timeout: 15_000 },
        )
        .toBe(true);
      await page.waitForLoadState("load", { timeout: 60_000 });
      await page.waitForFunction(() => document.readyState === "complete");
      await page.waitForLoadState("networkidle");
      const loaded = await page.evaluate(() => (window as CfpWindow).__cfpCapture?.() as Evidence);
      const loadedPaint = expectDocumentPaint(loaded, true);
      expect(stylesheetRequests).toEqual([]);
      expect(loadedPaint.canvas).toEqual(earlyPaint.canvas);
      expect(loadedPaint.foreground).toEqual(earlyPaint.foreground);
      expect(loaded.surfaces.main).toBe("rgba(0, 0, 0, 0)");

      if (route.hero === "present") {
        expect(loaded.surfaces.hero).toBe("rgba(0, 0, 0, 0)");
        expect(loaded.hero).toEqual({ engine: "v2", stackCount: 1, opacity: "1" });
      }
      expect(errors.page).toEqual([]);
      expect(errors.console).toEqual([]);
      await testInfo.attach("critical-first-paint.json", {
        body: JSON.stringify(
          {
            route,
            browserCase,
            heldScripts: scriptGate.heldUrls,
            stylesheetRequests,
            early,
            loaded,
          },
          null,
          2,
        ),
        contentType: "application/json",
      });
      await testInfo.attach("parser-time-actual-frame.png", {
        body: screenshot,
        contentType: "image/png",
      });
    });
  }
}

test("production HTML inlines application CSS and emits no blocking stylesheet", async ({
  request,
}) => {
  for (const path of ["/", "/treatments/implants", "/contact", "/champagne/sections-debug"]) {
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const criticalMatch = /<style[^>]*(?:data-href|href)="champagne-critical-paint-v1"[^>]*>/i.exec(
      html,
    );
    expect(criticalMatch, `${path} critical resource`).not.toBeNull();
    expect(html, `${path} blocking stylesheet`).not.toMatch(
      /<link[^>]*rel="stylesheet"[^>]*>/i,
    );
    expect(html, `${path} inlined Next CSS`).toMatch(
      /<style[^>]*(?:data-precedence|precedence)="next"[^>]*>/i,
    );
  }
});

test("raw SSR contains meaningful shell content outside hidden streamed containers", async ({
  request,
}) => {
  for (const path of ["/", "/treatments/implants", "/contact"]) {
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const positions = [html.indexOf("<header"), html.indexOf("<main"), html.indexOf("<footer")];
    for (const position of positions) expect(position, `${path} semantic SSR`).toBeGreaterThan(-1);
    const firstHiddenStream = html.search(/<div[^>]+hidden[^>]+id="S:/i);
    if (firstHiddenStream >= 0) {
      for (const position of positions) {
        expect(position, `${path} shell before hidden stream`).toBeLessThan(firstHiddenStream);
      }
    }
    expect(html).not.toContain("data-champagne-critical-fallback");
  }
});

test("JavaScript-disabled public pages retain visible header main and footer", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  try {
    const page = await context.newPage();
    for (const path of ["/", "/treatments/implants", "/contact"]) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "load" });
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      expect((await page.locator("main").innerText()).trim().length).toBeGreaterThan(20);
      expect(await page.locator("link[rel='stylesheet']").count()).toBe(0);
      expect(await page.locator("[data-champagne-critical-fallback]").count()).toBe(0);
      expect(
        await page
          .locator('header[aria-hidden="true"], main[aria-hidden="true"], footer[aria-hidden="true"]')
          .count(),
      ).toBe(0);
    }
  } finally {
    await context.close();
  }
});

test("blocking inline reveal scripts cannot hide the SSR shell", async ({ page }) => {
  await page.route(`${BASE_URL}/contact`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        "content-security-policy":
          "default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:",
      },
    });
  });
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "load" });
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  expect((await page.locator("main").innerText()).trim().length).toBeGreaterThan(20);
  expect(await page.locator("link[rel='stylesheet']").count()).toBe(0);
  expect(await page.locator("[data-champagne-critical-fallback]").count()).toBe(0);
});

test("JavaScript-disabled response produces an actual painted frame without CSS requests", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const stylesheetRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "stylesheet") stylesheetRequests.push(request.url());
  });

  try {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: "commit" });
    await page.waitForSelector("main");
    const canvas = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--surface-canvas)";
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      const match = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return [match[0] ?? 0, match[1] ?? 0, match[2] ?? 0, 255] as Rgba;
    });
    assertScreenshotContainsCanvas(await page.screenshot({ type: "png" }), canvas);
    expect(stylesheetRequests).toEqual([]);
    expect(await page.locator("link[rel='stylesheet']").count()).toBe(0);
    await page.waitForLoadState("load");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  } finally {
    await context.close();
  }
});
