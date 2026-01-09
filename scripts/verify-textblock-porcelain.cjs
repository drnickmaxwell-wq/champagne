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
const { Section_TextBlock } = require("../packages/champagne-sections/src/Section_TextBlock");

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

const renderSection = (overrides) =>
  renderToStaticMarkup(
    React.createElement(Section_TextBlock, {
      section: {
        title: "TextBlock Semantics",
        eyebrow: "Semantic tokens",
        body: "Proof log for porcelain vs ink surfaces.",
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
        <div id="ink-root">${renderSection({ title: "Ink context" })}</div>
        <div id="porcelain-root" data-surface="porcelain">${renderSection({ title: "Porcelain context" })}</div>
      </body>
    </html>`);

  const computed = await page.evaluate(() => {
    const read = (rootId) => {
      const section = document.querySelector(`#${rootId} section`);
      const heading = section?.querySelector("h2");
      const body = section?.querySelector("p");
      const sectionStyles = section ? window.getComputedStyle(section) : null;
      return {
        background: sectionStyles?.backgroundColor ?? null,
        borderColor: sectionStyles?.borderColor ?? null,
        boxShadow: sectionStyles?.boxShadow ?? null,
        headingColor: heading ? window.getComputedStyle(heading).color : null,
        bodyColor: body ? window.getComputedStyle(body).color : null,
      };
    };

    return {
      ink: read("ink-root"),
      porcelain: read("porcelain-root"),
    };
  });

  console.log("TextBlock computed styles:");
  console.log(JSON.stringify(computed, null, 2));

  await browser.close();
};

run();
