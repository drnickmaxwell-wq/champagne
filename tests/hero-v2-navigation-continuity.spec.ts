import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const STACK_SELECTOR = "[data-v2-stack-instance]";
const CONTENT_SELECTOR = '[data-v2-content-fade="true"]';

type VideoSnapshot = {
  id: string;
  nodeMarker: string;
  currentTime: number;
  duration: number;
  paused: boolean;
};

type ContinuitySnapshot = {
  documentMarker: string | null;
  stack: string | null;
  sampledAt: number;
  videos: VideoSnapshot[];
};

function attachRuntimeErrorCollectors(page: Page) {
  const pageErrors: string[] = [];
  const relevantConsoleErrors: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|did not match|server rendered html|uncaught|runtime error/i.test(
        message.text(),
      )
    ) {
      relevantConsoleErrors.push(message.text());
    }
  });

  return { pageErrors, relevantConsoleErrors };
}

async function expectHealthyHero(page: Page) {
  await expect(page.locator('[data-hero-engine="v2"]')).toBeVisible();
  await expect(page.locator(STACK_SELECTOR)).toHaveCount(1);
  await expect(page.locator(CONTENT_SELECTOR)).toHaveCSS("opacity", "1");
}

async function markContinuity(page: Page): Promise<ContinuitySnapshot> {
  return page.evaluate(() => {
    const documentMarker = crypto.randomUUID();
    const stack = document.querySelector<HTMLElement>("[data-v2-stack-instance]");
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>("[data-v2-stack-instance] video"),
    );

    window.__heroStageBDocumentMarker = documentMarker;
    videos.forEach((video, index) => {
      video.dataset.stageBNodeMarker = `video-${index}-${crypto.randomUUID()}`;
    });

    return {
      documentMarker,
      stack: stack?.dataset.v2StackInstance ?? null,
      sampledAt: performance.now(),
      videos: videos.map((video) => ({
        id: video.dataset.surfaceId ?? "",
        nodeMarker: video.dataset.stageBNodeMarker ?? "",
        currentTime: video.currentTime,
        duration: video.duration,
        paused: video.paused,
      })),
    };
  });
}

async function readContinuity(page: Page): Promise<ContinuitySnapshot> {
  return page.evaluate(() => {
    const stack = document.querySelector<HTMLElement>("[data-v2-stack-instance]");
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>("[data-v2-stack-instance] video"),
    );

    return {
      documentMarker: window.__heroStageBDocumentMarker ?? null,
      stack: stack?.dataset.v2StackInstance ?? null,
      sampledAt: performance.now(),
      videos: videos.map((video) => ({
        id: video.dataset.surfaceId ?? "",
        nodeMarker: video.dataset.stageBNodeMarker ?? "",
        currentTime: video.currentTime,
        duration: video.duration,
        paused: video.paused,
      })),
    };
  });
}

function expectLoopAwareContinuity(
  before: ContinuitySnapshot,
  after: ContinuitySnapshot,
) {
  expect(after.documentMarker).toBe(before.documentMarker);
  expect(after.stack).toBe(before.stack);

  const sharedVideos = before.videos.filter((beforeVideo) =>
    after.videos.some((afterVideo) => afterVideo.id === beforeVideo.id),
  );
  expect(sharedVideos.length).toBeGreaterThan(0);

  const elapsedSeconds = (after.sampledAt - before.sampledAt) / 1000;
  for (const beforeVideo of sharedVideos) {
    const afterVideo = after.videos.find((video) => video.id === beforeVideo.id);
    expect(afterVideo?.nodeMarker).toBe(beforeVideo.nodeMarker);
    expect(afterVideo?.duration).toBeCloseTo(beforeVideo.duration, 2);

    if (
      !beforeVideo.paused &&
      afterVideo &&
      Number.isFinite(beforeVideo.duration) &&
      beforeVideo.duration > 0
    ) {
      const duration = beforeVideo.duration;
      const actualProgress =
        (afterVideo.currentTime - beforeVideo.currentTime + duration) % duration;
      const expectedProgress = elapsedSeconds % duration;
      const circularDistance = Math.min(
        Math.abs(actualProgress - expectedProgress),
        duration - Math.abs(actualProgress - expectedProgress),
      );

      // The same DOM node must advance as a looping clock. Allow scheduling and
      // decoding tolerance without treating a natural loop wrap as a reset.
      expect(circularDistance).toBeLessThan(1.5);
    }
  }
}

test("Hero V2 survives client navigation, a treatment child, back and forward", async ({
  page,
}) => {
  const routeRequests: Array<{
    url: string;
    resourceType: string;
    rsc: string | undefined;
  }> = [];
  const errors = attachRuntimeErrorCollectors(page);

  page.on("request", (request) => {
    if (request.url().includes("/treatments")) {
      routeRequests.push({
        url: request.url(),
        resourceType: request.resourceType(),
        rsc: request.headers().rsc,
      });
    }
  });

  await page.goto(`${BASE_URL}/?heroDebug=1`, { waitUntil: "networkidle" });
  await expectHealthyHero(page);
  await page.waitForTimeout(500);
  const before = await markContinuity(page);

  routeRequests.length = 0;
  await page.locator('header a[href="/treatments"]').click();
  await page.waitForURL("**/treatments");
  await page.waitForLoadState("networkidle");
  await expectHealthyHero(page);

  await page.locator('a[href="/treatments/implants"]').first().click();
  await page.waitForURL("**/treatments/implants");
  await page.waitForLoadState("networkidle");
  await expectHealthyHero(page);

  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(`${BASE_URL}/treatments`);
  await expectHealthyHero(page);

  await page.goForward({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(`${BASE_URL}/treatments/implants`);
  await expectHealthyHero(page);

  const after = await readContinuity(page);
  expectLoopAwareContinuity(before, after);
  expect(routeRequests.some((request) => request.resourceType === "document")).toBe(
    false,
  );
  expect(routeRequests.some((request) => request.rsc === "1")).toBe(true);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.relevantConsoleErrors).toEqual([]);
});

test("Hero V2 renders correctly on direct treatment routes", async ({ page }) => {
  const errors = attachRuntimeErrorCollectors(page);

  for (const route of ["/treatments", "/treatments/implants"]) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(`${BASE_URL}${route}`);
    await expectHealthyHero(page);
  }

  expect(errors.pageErrors).toEqual([]);
  expect(errors.relevantConsoleErrors).toEqual([]);
});

test("Hero V2 remains visible with reduced motion on desktop and mobile", async ({
  page,
}) => {
  const errors = attachRuntimeErrorCollectors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/?heroDebug=1`, { waitUntil: "networkidle" });
    await expectHealthyHero(page);

    await page.locator('header a[href="/treatments"]').click();
    await page.waitForURL("**/treatments");
    await page.waitForLoadState("networkidle");
    await expectHealthyHero(page);
  }

  expect(errors.pageErrors).toEqual([]);
  expect(errors.relevantConsoleErrors).toEqual([]);
});

declare global {
  interface Window {
    __heroStageBDocumentMarker?: string;
  }
}
