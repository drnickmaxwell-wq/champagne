import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";

const schema = "CHAMPAGNE_ATELIER_R4_8_GOLDEN_HOMEPAGE_CONCIERGE_VISUAL_QA_V1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.8-golden-homepage-concierge-qa";
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
    await previewFrame().locator(".dl48-concierge-invitation,.dl48-concierge-closed").evaluateAll((nodes, visible) => nodes.forEach(node => { node.style.visibility = visible ? "visible" : "hidden"; }), index === 0);
    await page.mouse.move(1799, 1);
    const buffer = await previewIframe().screenshot();
    const metadata = await sharp(buffer).metadata();
    assert.equal(metadata.width, device.width, `${device.id} slice is not native ${device.width}px evidence`);
    assert.equal(metadata.height, device.height, `${device.id} slice changed the real inner viewport height`);
    const nextPosition = scrollPositions[index + 1] ?? metrics.scrollHeight;
    const sliceHeight = nextPosition - requestedPosition;
    const slice = await sharp(buffer).extract({ left: 0, top: 0, width: device.width, height: sliceHeight }).toBuffer();
    segments.push({ input: slice, top: requestedPosition, left: 0 });
  }
  await previewFrame().locator(".dl48-concierge-invitation,.dl48-concierge-closed").evaluateAll(nodes => nodes.forEach(node => { node.style.visibility = "visible"; }));
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
  await page.mouse.move(1799, 1);
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
await previewFrame().locator("body").evaluate(body => body.ownerDocument.defaultView.scrollTo(0, 0));
const conciergeEvidence = [];
const captureConcierge = async (state, filename) => {
  assert.equal(await previewFrame().locator(`[data-concierge-state="${state}"]`).count(), 1);
  await page.mouse.move(1799, 1);
  const buffer = await previewIframe().screenshot({ path: `${output}/${filename}` });
  const dimensions = pngDimensions(buffer);
  assert.deepEqual(dimensions, { width: 1440, height: 900 });
  conciergeEvidence.push({ state, filename, ...dimensions, device: "desktop", evidence: "SYNTHETIC_SIMULATION_ONLY" });
};
await captureConcierge("invited", "concierge-01-invited.png");
await previewFrame().getByRole("button", { name: "Not now", exact: true }).click();
await captureConcierge("closed", "concierge-00-closed.png");
await previewFrame().getByRole("button", { name: "Open Champagne Concierge", exact: true }).click();
await captureConcierge("host", "concierge-02-host-open.png");
assert.equal(await previewFrame().getByRole("button", { name: "Close Champagne Concierge", exact: true }).evaluate(node => node === node.ownerDocument.activeElement), true);
await previewFrame().getByRole("button", { name: "Explore by what you need", exact: true }).click();
await previewFrame().getByRole("button", { name: /Replace a missing tooth/ }).click();
await captureConcierge("answer", "concierge-03-answer.png");
assert.equal(await previewFrame().getByRole("link", { name: "Open /treatments/implants", exact: true }).getAttribute("href"), "/treatments/implants");
await previewFrame().getByRole("button", { name: "Sources and evidence", exact: true }).click();
assert.equal(await previewFrame().locator(".dl48-concierge-layer").getAttribute("data-source-open"), "true");
await captureConcierge("answer", "concierge-04-answer-source.png");
await previewFrame().getByRole("button", { name: "See how the parts fit", exact: true }).click();
await captureConcierge("threeD", "concierge-05-synthetic-3d.png");
await previewFrame().getByRole("button", { name: "Abutment", exact: true }).click();
assert.equal(await previewFrame().locator(".dl48-model").getAttribute("data-part"), "abutment");
await previewFrame().getByRole("button", { name: "Continue to human contact", exact: true }).click();
await captureConcierge("human", "concierge-06-human-handoff.png");
assert.equal(await previewFrame().getByRole("link", { name: "Open the contact page", exact: true }).getAttribute("href"), "/contact");
const lastFocus = previewFrame().getByRole("button", { name: "Human contact", exact: true });
await lastFocus.focus();
await lastFocus.press("Tab");
assert.equal(await previewFrame().getByRole("button", { name: "Speak to the practice", exact: true }).evaluate(node => node === node.ownerDocument.activeElement), true);
await previewFrame().locator(".dl48-concierge-panel").press("Escape");
assert.equal(await previewFrame().locator('[data-concierge-state="closed"]').count(), 1);

await page.getByRole("button", { name: "Return to studio", exact: true }).click();
await page.getByLabel("Device preset", { exact: true }).selectOption("iphone");
await page.getByRole("button", { name: "Clean preview", exact: true }).click();
await previewFrame().getByRole("button", { name: "Open Champagne Concierge", exact: true }).click();
const mobileOpenBuffer = await previewIframe().screenshot({ path: `${output}/concierge-07-mobile-host-open.png` });
assert.deepEqual(pngDimensions(mobileOpenBuffer), { width: 390, height: 844 });
const mobilePanel = await previewFrame().locator(".dl48-concierge-panel").evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, viewportHeight: node.ownerDocument.defaultView.innerHeight }));
assert.equal(mobilePanel.width, 390);
assert.ok(mobilePanel.height <= mobilePanel.viewportHeight * .83);
conciergeEvidence.push({ state: "host", filename: "concierge-07-mobile-host-open.png", width: 390, height: 844, device: "iphone", evidence: "SYNTHETIC_SIMULATION_ONLY" });

assert.ok(responsiveMetrics.desktop.pathwaysColumns > 1 && responsiveMetrics.desktop.stepsColumns > 1);
assert.equal(responsiveMetrics.iphone.pathwaysColumns, 1);
assert.equal(responsiveMetrics.iphone.stepsColumns, 1);
assert.ok(responsiveMetrics.desktop.practicePaddingLeft > responsiveMetrics.iphone.practicePaddingLeft * 2);
assert.deepEqual(consoleErrors, []);

await writeFile(`${output}/manifest.json`, JSON.stringify({
  schema, branchHeadSha, executionSha, branchHeadTree, executionTree,
  base: process.env.ATELIER_BASE_SHA, generatedAt: new Date().toISOString(),
  evidence: "EXACT_TREE_GOLDEN_HOMEPAGE_CONCIERGE_AND_TRUE_IFRAME_RESPONSIVE_EVIDENCE_PROVEN",
  productionBinding: false, expectedHomepageOrder, excludedSemanticIds: ["home.proof"],
  beforeAfterSectionHeights: { baseline: "R4.5.2_FIXED_WIDTH_PARENT_VIEWPORT_PROJECTION", before390: beforeSectionHeights, after390: responsiveMetrics.iphone.sectionMetrics.map(({ semanticId, height }) => ({ semanticId, height })) },
  responsiveMetrics, captures, conciergeEvidence,
  governance: { zone: "PUBLIC_NON_PHI", privacyZone: "A", booking: "NAVIGATION_ONLY", engine: "SYNTHETIC_SIMULATION_ONLY", liveEndpointConnected: false, heroAuthorityConflict: "UNRESOLVED_PRESERVED", homepageArtDirection: "R4.7_ACCEPTED_FOUNDATION", founderApprovalClaimed: false },
}, null, 2));
await browser.close();
