const path = require("node:path");
const fs = require("node:fs/promises");
const moduleLoader = require("node:module");
const tsConfigPaths = require("tsconfig-paths");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..");
const webNodeModules = path.resolve(repoRoot, "apps/web/node_modules");

process.env.NODE_PATH = [webNodeModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
moduleLoader.Module._initPaths();

process.env.TS_NODE_PROJECT = path.resolve(repoRoot, "tsconfig.base.json");
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  jsx: "react-jsx",
  module: "CommonJS",
  moduleResolution: "Node",
});

require("ts-node/register/transpile-only");

const tsConfig = tsConfigPaths.loadConfig(process.env.TS_NODE_PROJECT);
if (tsConfig.resultType === "success") {
  tsConfigPaths.register({ baseUrl: tsConfig.absoluteBaseUrl, paths: tsConfig.paths });
}

require.extensions[".css"] = () => {};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { Section_FeatureList } = require("../packages/champagne-sections/src/Section_FeatureList");
const { Section_PatientStoriesRail } = require("../packages/champagne-sections/src/Section_PatientStoriesRail");

const stripImports = (css) =>
  css
    .split("\n")
    .filter((line) => !line.trim().startsWith("@import"))
    .join("\n");

const cssFiles = [
  path.resolve(__dirname, "../packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css"),
  path.resolve(__dirname, "../packages/champagne-tokens/styles/champagne/tokens.css"),
  path.resolve(__dirname, "../packages/champagne-tokens/styles/champagne/theme.css"),
];

const renderFeatureList = (overrides) =>
  renderToStaticMarkup(
    React.createElement(Section_FeatureList, {
      section: {
        title: "Priority treatments at a glance",
        eyebrow: "Treatment hub",
        items: [
          "Composite bonding, veneers, and full smile refinement",
          "Clear aligners with mapped movement and check-ins",
          "Implant dentistry, whitening, and restorative care",
        ],
        ...overrides,
      },
    })
  );

const renderPatientStories = (overrides) =>
  renderToStaticMarkup(
    React.createElement(Section_PatientStoriesRail, {
      section: {
        title: "Journeys through Champagne care",
        eyebrow: "Patient stories",
        stories: [
          { summary: "Closed a small gap and softened a chipped edge in one appointment.", name: "A. Morgan" },
          { summary: "Blended composite across two incisors for a balanced smile line.", name: "Sam R." },
        ],
        ...overrides,
      },
    })
  );

const run = async () => {
  const cssParts = await Promise.all(cssFiles.map(async (file) => stripImports(await fs.readFile(file, "utf8"))));
  const css = cssParts.join("\n");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(`<!doctype html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        <div id="ink-feature">${renderFeatureList()}</div>
        <div id="porcelain-feature" data-surface="porcelain">${renderFeatureList()}</div>
        <div id="ink-stories">${renderPatientStories()}</div>
        <div id="porcelain-stories" data-surface="porcelain">${renderPatientStories()}</div>
      </body>
    </html>`);

  const computed = await page.evaluate(() => {
    const readFeature = (rootId) => {
      const root = document.querySelector(`#${rootId}`);
      const section = root?.querySelector("section");
      const pill = section?.querySelector("div:nth-of-type(2) > div");
      const badge = pill?.querySelector("span");
      const text = pill?.querySelector("span:nth-of-type(2)");
      const sectionStyles = section ? window.getComputedStyle(section) : null;
      const pillStyles = pill ? window.getComputedStyle(pill) : null;
      const badgeStyles = badge ? window.getComputedStyle(badge) : null;
      const textStyles = text ? window.getComputedStyle(text) : null;
      return {
        background: sectionStyles?.backgroundColor ?? null,
        borderColor: sectionStyles?.borderColor ?? null,
        boxShadow: sectionStyles?.boxShadow ?? null,
        pillBackground: pillStyles?.backgroundColor ?? null,
        pillBorderColor: pillStyles?.borderColor ?? null,
        badgeBackground: badgeStyles?.backgroundColor ?? null,
        textColor: textStyles?.color ?? null,
      };
    };

    const readStories = (rootId) => {
      const root = document.querySelector(`#${rootId}`);
      const surface = root?.firstElementChild;
      const card = surface?.querySelector("div:nth-of-type(2) > div");
      const summary = card?.querySelector("p");
      const surfaceStyles = surface ? window.getComputedStyle(surface) : null;
      const cardStyles = card ? window.getComputedStyle(card) : null;
      const summaryStyles = summary ? window.getComputedStyle(summary) : null;
      return {
        background: surfaceStyles?.backgroundColor ?? null,
        borderColor: surfaceStyles?.borderColor ?? null,
        boxShadow: surfaceStyles?.boxShadow ?? null,
        cardBackground: cardStyles?.backgroundColor ?? null,
        cardBorderColor: cardStyles?.borderColor ?? null,
        summaryColor: summaryStyles?.color ?? null,
      };
    };

    return {
      featureList: {
        ink: readFeature("ink-feature"),
        porcelain: readFeature("porcelain-feature"),
      },
      patientStories: {
        ink: readStories("ink-stories"),
        porcelain: readStories("porcelain-stories"),
      },
    };
  });

  console.log("Feature sections computed styles:");
  console.log(JSON.stringify(computed, null, 2));

  await browser.close();
};

run();
