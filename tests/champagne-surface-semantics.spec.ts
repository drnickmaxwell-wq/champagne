import path from "node:path";
import { pathToFileURL } from "node:url";
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
    const baseline = await readSurfaceEvidence(page);
    const expectedThemeCanvas = await page.evaluate((selectedTheme) => {
      const probe = document.createElement("span");
      probe.style.color =
        selectedTheme === "dawn"
          ? "color-mix(in srgb, var(--brand-teal) 15%, white)"
          : "var(--ink-100)";
      document.body.appendChild(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      return expected;
    }, theme);
    await page.evaluate((selectedTheme) => {
      document.documentElement.dataset.theme = selectedTheme;
    }, theme);

    const evidence = await readSurfaceEvidence(page);
    expectCanvasContinuity(evidence);
    expect(evidence.resolved.canvas).toBe(expectedThemeCanvas);
    expect(evidence.resolved.canvas).not.toBe(baseline.resolved.canvas);
    expect(evidence.heroEngine).toBe("v2");
    expect(evidence.stackCount).toBe(1);
    expect(evidence.contentOpacity).toBe("1");
    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
  });
}

test("shared parser fixtures are correlated with Chromium and expose no guard bypass", async ({ page }) => {
  const parserUrl = pathToFileURL(
    path.resolve(process.cwd(), "packages/champagne-tokens/scripts/css-declarations.v1.mjs"),
  ).href;
  const { parseCssDefinitions, parseCssPropertyRegistrations } = await import(parserUrl);
  const fixtures = [
    { name: "direct declaration", css: ":root{--surface-canvas:rgb(1 2 3)}", expected: "browser-effective owner" },
    { name: "hexadecimal escape", css: String.raw`:root{--surface-\63 anvas:rgb(1 2 3)}`, expected: "browser-effective owner" },
    { name: "escape terminating whitespace", css: String.raw`:root{--\73 urface-canvas:rgb(1 2 3)}`, expected: "browser-effective owner" },
    { name: "comment-separated name", css: ":root{--surface/**/-canvas:rgb(1 2 3)}", expected: "invalid in browser" },
    { name: "quoted decoy", css: `:root{content:"--surface-canvas:rgb(1 2 3)"}`, expected: "invalid in browser" },
    { name: "bad-string recovery", css: `:root{--decoy:"bad\n;--surface-canvas:rgb(1 2 3);/* " */}`, expected: "browser-effective owner" },
    { name: "matched brace value", css: ":root{--decoy:{x:y};--surface-canvas:rgb(1 2 3)}", expected: "browser-effective owner" },
    { name: "nested media", css: "@media(min-width:1px){:root{--surface-canvas:rgb(1 2 3)}}", expected: "browser-effective owner" },
    { name: "nested supports", css: "@supports(display:grid){:root{--surface-canvas:rgb(1 2 3)}}", expected: "browser-effective owner" },
    { name: "nested layer", css: "@layer material{:root{--surface-canvas:rgb(1 2 3)}}", expected: "browser-effective owner" },
    { name: "no trailing semicolon", css: ":root{--surface-canvas:rgb(1 2 3)}", expected: "browser-effective owner" },
    { name: "protected registration", css: "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:rgb(1 2 3)}", expected: "browser-effective owner", registration: true },
    { name: "malformed trailing comment", css: ":root{--surface-canvas:rgb(1 2 3);/*", expected: "conservative parser rejection" },
    { name: "malformed trailing string", css: `:root{--surface-canvas:rgb(1 2 3);content:"`, expected: "conservative parser rejection" },
  ] as const;

  for (const fixture of fixtures) {
    let parserDetected = false;
    let parserRejected = false;
    const isRegistration = "registration" in fixture && fixture.registration;
    try {
      parserDetected = isRegistration
        ? parseCssPropertyRegistrations(fixture.css).some((item) => item.property === "--surface-canvas")
        : parseCssDefinitions(fixture.css, "--surface-canvas").length > 0;
    } catch {
      parserRejected = true;
    }

    await page.setContent(`<style>${fixture.css}</style><div id="probe"></div>`);
    const browserEffective = await page.evaluate((registration) => {
      const target = registration ? document.querySelector("#probe") : document.documentElement;
      return Boolean(target && getComputedStyle(target).getPropertyValue("--surface-canvas").trim());
    }, isRegistration);

    const classification = parserRejected
      ? "conservative parser rejection"
      : browserEffective && parserDetected
        ? "browser-effective owner"
        : !browserEffective && parserDetected
          ? "invalid in browser"
          : browserEffective
            ? "actual guard bypass"
            : "invalid in browser";

    expect(classification, fixture.name).toBe(fixture.expected);
    expect(classification, fixture.name).not.toBe("actual guard bypass");
  }
});

test("CSSStyleDeclaration.cssText protected-token assignment is browser-effective", async ({ page }) => {
  await page.setContent('<div id="probe"></div>');
  const evidence = await page.evaluate(() => {
    const probe = document.querySelector<HTMLElement>("#probe");
    if (!probe) throw new Error("missing cssText proof element");
    probe.style.cssText = "--surface-canvas: rgb(1 2 3);";
    return {
      inline: probe.style.getPropertyValue("--surface-canvas").trim(),
      computed: getComputedStyle(probe).getPropertyValue("--surface-canvas").trim(),
    };
  });

  expect(evidence.inline).toBe("rgb(1 2 3)");
  expect(evidence.computed).toBe("rgb(1 2 3)");
});

test("comment-trivia cssText and receiver-independent optional replace are browser-effective", async ({ page }) => {
  await page.setContent('<div id="probe"></div>');
  const evidence = await page.evaluate(async () => {
    const probe = document.querySelector<HTMLElement>("#probe");
    if (!probe) throw new Error("missing lexical mutation proof element");

    probe.style[/* static member */ "cssText" /* before close */] /* before assignment */ =
      /* before payload */ "--surface-canvas: rgb(4 5 6);";

    const anything = new CSSStyleSheet();
    await anything./* member trivia */replace/* optional trivia */?.(
      /* payload trivia */ ":root{--bg-ink:rgb(7 8 9)}",
    );
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, anything];

    return {
      inlineCanvas: probe.style.getPropertyValue("--surface-canvas").trim(),
      computedCanvas: getComputedStyle(probe).getPropertyValue("--surface-canvas").trim(),
      replacedRoot: getComputedStyle(document.documentElement).getPropertyValue("--bg-ink").trim(),
    };
  });

  expect(evidence.inlineCanvas).toBe("rgb(4 5 6)");
  expect(evidence.computedCanvas).toBe("rgb(4 5 6)");
  expect(evidence.replacedRoot).toBe("rgb(7 8 9)");
});
