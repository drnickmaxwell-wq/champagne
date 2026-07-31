import { expect, test } from "playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

test("Hero V2 survives public client navigation without a document reload", async ({ page }) => {
  const routeRequests: Array<{ resourceType: string; rsc: string | undefined }> = [];
  const pageErrors: string[] = [];
  const hydrationErrors: string[] = [];

  page.on("request", (request) => {
    if (request.url().includes("/treatments")) {
      routeRequests.push({
        resourceType: request.resourceType(),
        rsc: request.headers().rsc,
      });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|did not match|server rendered html/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto(`${BASE_URL}/?heroDebug=1`, { waitUntil: "networkidle" });
  await expect(page.locator('[data-hero-engine="v2"]')).toBeVisible();
  await expect(page.locator("[data-v2-stack-instance]")).toHaveCount(1);
  await page.waitForTimeout(500);

  const before = await page.evaluate(() => {
    const marker = crypto.randomUUID();
    const stack = document.querySelector<HTMLElement>("[data-v2-stack-instance]");
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>("[data-v2-stack-instance] video"),
    );
    window.__heroStageBDocumentMarker = marker;
    videos.forEach((video, index) => {
      video.dataset.stageBNodeMarker = `video-${index}`;
    });
    return {
      marker,
      stack: stack?.dataset.v2StackInstance ?? null,
      videos: videos.map((video) => ({
        id: video.dataset.surfaceId ?? "",
        nodeMarker: video.dataset.stageBNodeMarker ?? "",
        currentTime: video.currentTime,
      })),
    };
  });

  routeRequests.length = 0;
  await page.locator('header a[href="/treatments"]').click();
  await page.waitForURL("**/treatments");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-v2-content-fade="true"]')).toHaveCSS("opacity", "1");

  const after = await page.evaluate(() => {
    const stack = document.querySelector<HTMLElement>("[data-v2-stack-instance]");
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>("[data-v2-stack-instance] video"),
    );
    return {
      marker: window.__heroStageBDocumentMarker ?? null,
      stack: stack?.dataset.v2StackInstance ?? null,
      videos: videos.map((video) => ({
        id: video.dataset.surfaceId ?? "",
        nodeMarker: video.dataset.stageBNodeMarker ?? "",
        currentTime: video.currentTime,
      })),
    };
  });

  expect(after.marker).toBe(before.marker);
  expect(after.stack).toBe(before.stack);
  expect(routeRequests.some((request) => request.resourceType === "document")).toBe(false);
  expect(routeRequests.some((request) => request.rsc === "1")).toBe(true);
  expect(pageErrors).toEqual([]);
  expect(hydrationErrors).toEqual([]);

  const sharedVideos = before.videos.filter((beforeVideo) =>
    after.videos.some((afterVideo) => afterVideo.id === beforeVideo.id),
  );
  expect(sharedVideos.length).toBeGreaterThan(0);
  for (const beforeVideo of sharedVideos) {
    const afterVideo = after.videos.find((video) => video.id === beforeVideo.id);
    expect(afterVideo?.nodeMarker).toBe(beforeVideo.nodeMarker);
    expect(afterVideo?.currentTime ?? 0).toBeGreaterThanOrEqual(
      Math.max(0, beforeVideo.currentTime - 0.1),
    );
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("navigation").getByRole("link", { name: "Home" }).click();
  await page.waitForURL(`${BASE_URL}/`);
  await expect(page.locator('[data-v2-content-fade="true"]')).toHaveCSS("opacity", "1");
});

declare global {
  interface Window {
    __heroStageBDocumentMarker?: string;
  }
}
