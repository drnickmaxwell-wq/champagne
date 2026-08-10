import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";

const schema = "CHAMPAGNE_ATELIER_R4_7_HOMEPAGE_ART_DIRECTION_VISUAL_QA_V1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.7-art-direction-qa";
const branchHeadSha = process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL";
const executionSha = process.env.ATELIER_EXECUTION_SHA ?? process.env.GITHUB_SHA ?? "LOCAL";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
const expectedHomepageOrder = ["home.hero.v2","home.practice.answer","home.patient.pathways","home.complex-care","home.care-process","home.founder-authority","home.team-continuity","home.technology-purpose","home.heritage-story","home.visit","home.focused-faq","home.closing-invitation"];
const devices = [
  { id: "desktop", width: 1440, height: 900, orientation: "landscape" },
  { id: "ipad-portrait", width: 768, height: 1024, orientation: "portrait" },
  { id: "ipad-landscape", width: 1024, height: 768, orientation: "landscape" },
  { id: "iphone", width: 390, height: 844, orientation: "portrait" },
];
const differentiatedChapterIds = ["home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story"];

assert.equal(branchHeadTree, executionTree);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });

const pngDimensions = buffer => {
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const stageState = async () => page.locator(".dl45-preview-stage").evaluate(stage => ({
  viewportWidth: Number(stage.getAttribute("data-viewport-width")),
  viewportHeight: Number(stage.getAttribute("data-viewport-height")),
  displayScale: Number(stage.getAttribute("data-display-scale")),
  deviceFrame: stage.getAttribute("data-device-frame") === "true",
  device: stage.getAttribute("data-device"),
  orientation: stage.getAttribute("data-orientation"),
  brandTerritory: stage.getAttribute("data-brand-territory"),
  accent: stage.getAttribute("data-brand-accent"),
  typography: stage.getAttribute("data-brand-type"),
  rhythm: stage.getAttribute("data-brand-rhythm"),
  persianCandidate: stage.getAttribute("data-persian-candidate"),
  porcelainCandidate: stage.getAttribute("data-porcelain-candidate"),
  timeState: stage.getAttribute("data-studio-time"),
  timeScope: stage.getAttribute("data-time-scope"),
  fullscreenMode: stage.getAttribute("data-fullscreen-mode"),
}));
const previewFrame = () => page.frameLocator("iframe.dl46-preview-viewport").first();
const previewIframe = () => page.locator("iframe.dl46-preview-viewport").first();

const measure = async () => previewFrame().locator("body").evaluate((body, expectedOrder) => {
  const document = body.ownerDocument;
  const view = document.defaultView;
  const transparentProbe = document.createElement("div");
  document.body.appendChild(transparentProbe);
  const transparentColor = getComputedStyle(transparentProbe).backgroundColor;
  transparentProbe.remove();
  const sections = [...document.querySelectorAll("[data-semantic-id]")];
  const sectionMetrics = sections.map(section => {
    const rect = section.getBoundingClientRect();
    const contentNode = section.firstElementChild;
    const content = contentNode?.getBoundingClientRect();
    const sectionStyle = getComputedStyle(section);
    const contentStyle = contentNode ? getComputedStyle(contentNode) : null;
    const headings = [...section.querySelectorAll("h1,h2,h3")];
    const controls = [...section.querySelectorAll("a,button,summary")];
    return {
      semanticId: section.getAttribute("data-semantic-id"),
      height: Math.round(rect.height),
      contentHeight: content ? Math.round(content.height) : null,
      contentMarginTop: contentStyle ? parseFloat(contentStyle.marginTop) : null,
      contentMarginBottom: contentStyle ? parseFloat(contentStyle.marginBottom) : null,
      ownedSurface: sectionStyle.backgroundImage !== "none" || sectionStyle.backgroundColor !== transparentColor,
      width: Math.round(rect.width),
      overflowWidth: section.scrollWidth - section.clientWidth,
      clippedHeadings: headings.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent?.trim()),
      clippedControls: controls.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent?.trim()),
    };
  });
  const rects = sections.map(section => section.getBoundingClientRect());
  const gaps = rects.slice(1).map((rect, index) => Math.round(rect.top - rects[index].bottom));
  const pathways = document.querySelector(".dl44-pathways");
  const steps = document.querySelector(".dl44-steps");
  const practice = document.querySelector(".dl44-home-practice-answer");
  return {
    innerWidth: view.innerWidth,
    innerHeight: view.innerHeight,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    semanticIds: sections.map(section => section.getAttribute("data-semantic-id")),
    hasProof: Boolean(document.querySelector('[data-semantic-id="home.proof"]')),
    pathwaysColumns: pathways ? getComputedStyle(pathways).gridTemplateColumns.split(" ").length : 0,
    stepsColumns: steps ? getComputedStyle(steps).gridTemplateColumns.split(" ").length : 0,
    practicePaddingLeft: practice ? parseFloat(getComputedStyle(practice).paddingLeft) : 0,
    visibleMediaDiagnostics: [...document.querySelectorAll(".dl44-media-intent")].filter(node => getComputedStyle(node).display !== "none").length,
    gaps,
    sectionMetrics,
    orderMatches: JSON.stringify(sections.map(section => section.getAttribute("data-semantic-id"))) === JSON.stringify(expectedOrder),
  };
}, expectedHomepageOrder);

const measureLegacyProjection = async () => page.evaluate(expectedOrder => {
  const iframe = document.querySelector("iframe.dl46-preview-viewport");
  const source = iframe?.contentDocument?.querySelector(".dl46-canvas");
  if (!source) throw new Error("Truthful canvas unavailable for legacy projection");
  const legacy = source.cloneNode(true);
  legacy.classList.remove("dl46-canvas");
  legacy.setAttribute("data-r46-legacy-projection", "true");
  Object.assign(legacy.style, { position: "absolute", left: "-10000px", top: "0", width: "390px", visibility: "hidden", pointerEvents: "none" });
  document.body.appendChild(legacy);
  const heights = expectedOrder.map(id => ({ semanticId: id, height: Math.round(legacy.querySelector(`[data-semantic-id="${id}"]`).getBoundingClientRect().height) }));
  legacy.remove();
  return heights;
}, expectedHomepageOrder);

const stitchCompletePage = async (device, metrics) => {
  const segments = [];
  const maximumScroll = Math.max(0, metrics.scrollHeight - device.height);
  const scrollPositions = [];
  for (let position = 0; position < maximumScroll; position += device.height) scrollPositions.push(position);
  if (scrollPositions.at(-1) !== maximumScroll) scrollPositions.push(maximumScroll);
  for (const [index, requestedPosition] of scrollPositions.entries()) {
    const actualPosition = await previewFrame().locator("body").evaluate((body, position) => {
      const view = body.ownerDocument.defaultView;
      view.scrollTo(0, position);
      return view.scrollY;
    }, requestedPosition);
    assert.ok(Math.abs(actualPosition - requestedPosition) <= 1, `${device.id} could not reach native scroll position ${requestedPosition}`);
    const buffer = await previewIframe().screenshot();
    const metadata = await sharp(buffer).metadata();
    assert.equal(metadata.width, device.width, `${device.id} slice is not native ${device.width}px evidence`);
    assert.equal(metadata.height, device.height, `${device.id} slice changed the real inner viewport height`);
    const nextPosition = scrollPositions[index + 1] ?? metrics.scrollHeight;
    const sliceHeight = nextPosition - requestedPosition;
    const slice = await sharp(buffer).extract({ left: 0, top: 0, width: device.width, height: sliceHeight }).toBuffer();
    segments.push({ input: slice, top: requestedPosition, left: 0 });
  }
  const buffer = await sharp({ create: { width: device.width, height: metrics.scrollHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(segments).png().toBuffer();
  const filename = `${device.id}-homepage-complete.png`;
  await writeFile(`${output}/${filename}`, buffer);
  const dimensions = pngDimensions(buffer);
  assert.equal(dimensions.width, device.width);
  assert.ok(dimensions.height < (device.id === "iphone" ? 18000 : 15000), `${device.id} complete page remains implausibly tall at ${dimensions.height}px`);
  return { filename, ...dimensions, captureMethod: "NATIVE_IFRAME_VIEWPORT_SLICE_VERTICAL_STITCH_NO_RESIZE", sectionHeights: metrics.sectionMetrics.map(({ semanticId, height }) => ({ semanticId, height })) };
};

await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Homepage Atelier", exact: true }).click();
await previewIframe().waitFor();
await previewFrame().locator(".dl46-canvas").waitFor();
await page.getByLabel("Display scale", { exact: true }).fill("100");
const deviceFrameControl = page.getByLabel("Device frame", { exact: true });
if (await deviceFrameControl.isChecked()) await deviceFrameControl.uncheck();

await page.getByLabel("Device preset", { exact: true }).selectOption("iphone");
await previewFrame().locator(".dl46-canvas").waitFor();
const beforeSectionHeights = await measureLegacyProjection();
await page.getByRole("button", { name: "Clean preview", exact: true }).click();
assert.equal(await page.locator(".dl4-pages").isVisible(), false);

const captures = [];
const responsiveMetrics = {};
for (const device of devices) {
  await page.getByRole("button", { name: "Return to studio", exact: true }).click();
  await page.getByLabel("Device preset", { exact: true }).selectOption(device.id);
  await previewFrame().locator(".dl46-canvas").waitFor();
  await page.getByRole("button", { name: "Clean preview", exact: true }).click();
  await previewFrame().locator("body").evaluate(body => body.ownerDocument.defaultView.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  const state = await stageState();
  assert.deepEqual({ width: state.viewportWidth, height: state.viewportHeight, orientation: state.orientation }, { width: device.width, height: device.height, orientation: device.orientation });
  assert.equal(state.displayScale, 100);
  assert.equal(state.deviceFrame, false);
  const metrics = await measure();
  responsiveMetrics[device.id] = metrics;
  assert.equal(metrics.innerWidth, device.width);
  assert.equal(metrics.clientWidth, device.width);
  assert.ok(metrics.scrollWidth <= metrics.clientWidth, `${device.id} overflows horizontally: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  assert.equal(metrics.orderMatches, true);
  assert.equal(metrics.hasProof, false);
  assert.ok(metrics.gaps.every(gap => Math.abs(gap) <= 1), `${device.id} has an unowned inter-section gap: ${metrics.gaps}`);
  assert.ok(metrics.sectionMetrics.every(section => section.overflowWidth <= 1 && section.clippedHeadings.length === 0 && section.clippedControls.length === 0), `${device.id} contains clipped or overflowing semantic content`);
  assert.ok(metrics.sectionMetrics.every(section => section.ownedSurface), `${device.id} contains a semantic section without an owned surface`);
  assert.ok(metrics.sectionMetrics.every(section => section.contentMarginTop === 0 && section.contentMarginBottom === 0), `${device.id} contains vertical content margins that can expose the parent canvas`);
  assert.equal(metrics.visibleMediaDiagnostics, 0);
  const viewportFilename = `${device.id}-homepage-first-viewport.png`;
  const viewportBuffer = await previewIframe().screenshot({ path: `${output}/${viewportFilename}` });
  assert.deepEqual(pngDimensions(viewportBuffer), { width: device.width, height: device.height });
  const complete = await stitchCompletePage(device, metrics);
  await previewFrame().locator("body").evaluate(body => body.ownerDocument.defaultView.scrollTo(0, body.ownerDocument.documentElement.scrollHeight));
  const scrollProof = await previewFrame().locator("body").evaluate(body => ({ scrollY: body.ownerDocument.defaultView.scrollY, max: body.ownerDocument.documentElement.scrollHeight - body.ownerDocument.defaultView.innerHeight }));
  assert.ok(scrollProof.scrollY > 0 && Math.abs(scrollProof.scrollY - scrollProof.max) <= 2, `${device.id} did not scroll completely`);
  captures.push({
    artifactSchema: schema, branchHeadSha, branchHeadTree, executionSha, executionTree,
    canonicalPage: "home", productionBinding: false, displayScale: 100, deviceFrame: false,
    internalViewport: { width: device.width, height: device.height }, outerBrowserViewport: page.viewportSize(),
    devicePreset: device.id, orientation: device.orientation, mode: "CLEAN", ...state,
    firstViewport: { filename: viewportFilename, width: device.width, height: device.height }, complete,
  });
}

await page.getByRole("button", { name: "Return to studio", exact: true }).click();
await page.getByLabel("Device preset", { exact: true }).selectOption("desktop");
await previewFrame().locator(".dl47-canvas").waitFor();
await page.getByRole("button", { name: "Clean preview", exact: true }).click();
const focusedChapterEvidence = [];
for (const semanticId of differentiatedChapterIds) {
  const section = previewFrame().locator(`[data-semantic-id="${semanticId}"]`);
  await previewFrame().locator(".dl47-canvas").evaluate(canvas => canvas.classList.remove("dl47-canvas"));
  await section.evaluate(node => node.scrollIntoView({ block: "start" }));
  const beforeFilename = `before-${semanticId}.png`;
  const beforeBuffer = await previewIframe().screenshot({ path: `${output}/${beforeFilename}` });
  await previewFrame().locator(".dl46-canvas").evaluate(canvas => canvas.classList.add("dl47-canvas"));
  await section.evaluate(node => node.scrollIntoView({ block: "start" }));
  const afterFilename = `after-${semanticId}.png`;
  const afterBuffer = await previewIframe().screenshot({ path: `${output}/${afterFilename}` });
  const before = pngDimensions(beforeBuffer);
  const after = pngDimensions(afterBuffer);
  assert.equal(before.width, 1440);
  assert.equal(after.width, 1440);
  assert.equal(before.height, 900);
  assert.equal(after.height, 900);
  focusedChapterEvidence.push({ semanticId, before: { filename: beforeFilename, ...before, authority: "R4.6_RENDERED_BASELINE" }, after: { filename: afterFilename, ...after, authority: "R4.7_ART_DIRECTION" } });
}

await page.getByRole("button", { name: "Return to studio", exact: true }).click();
await page.getByRole("button", { name: "Art direction", exact: true }).click();
const artDirectionRoom = page.getByRole("dialog", { name: "Compare meaning, not decoration." });
await artDirectionRoom.waitFor();
assert.equal(await artDirectionRoom.getByText("Founder authority", { exact: true }).count() > 0, true);
await artDirectionRoom.getByRole("navigation", { name: "Art-direction chapters" }).getByRole("button").filter({ hasText: "Technology purpose" }).click();
const purposeLedger = artDirectionRoom.getByRole("article").filter({ hasText: "Purpose ledger" });
await purposeLedger.getByRole("button", { name: "Use this treatment", exact: true }).click();
assert.equal(await purposeLedger.getByRole("button", { name: "Selected for Homepage", exact: true }).getAttribute("aria-pressed"), "true");
await purposeLedger.getByRole("button", { name: "keep", exact: true }).click();
assert.equal(await purposeLedger.getByRole("button", { name: "keep", exact: true }).getAttribute("aria-pressed"), "true");
const artDirectionInteractionProof = { sectionId: "home.technology-purpose", selectedVariant: "b", treatment: "Purpose ledger", decision: "keep", status: "SYNTHETIC_QA_INTERACTION_ONLY_NOT_FOUNDER_APPROVAL" };
await artDirectionRoom.getByRole("button", { name: "Close room", exact: true }).click();

assert.ok(responsiveMetrics.desktop.pathwaysColumns > 1 && responsiveMetrics.desktop.stepsColumns > 1);
assert.equal(responsiveMetrics.iphone.pathwaysColumns, 1);
assert.equal(responsiveMetrics.iphone.stepsColumns, 1);
assert.ok(responsiveMetrics.desktop.practicePaddingLeft > responsiveMetrics.iphone.practicePaddingLeft * 2);
assert.deepEqual(consoleErrors, []);

await writeFile(`${output}/manifest.json`, JSON.stringify({
  schema, branchHeadSha, executionSha, branchHeadTree, executionTree,
  base: process.env.ATELIER_BASE_SHA, generatedAt: new Date().toISOString(),
  evidence: "EXACT_TREE_HOMEPAGE_ART_DIRECTION_AND_TRUE_IFRAME_RESPONSIVE_EVIDENCE_PROVEN",
  productionBinding: false, expectedHomepageOrder, excludedSemanticIds: ["home.proof"],
  beforeAfterSectionHeights: { baseline: "R4.5.2_FIXED_WIDTH_PARENT_VIEWPORT_PROJECTION", before390: beforeSectionHeights, after390: responsiveMetrics.iphone.sectionMetrics.map(({ semanticId, height }) => ({ semanticId, height })) },
  responsiveMetrics, captures, focusedChapterEvidence, artDirectionInteractionProof,
}, null, 2));
await browser.close();
