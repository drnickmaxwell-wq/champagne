import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const pageSource = readFileSync(join(currentDir, "page.tsx"), "utf8");
const motionDir = join(currentDir, "../../../public/assets/champagne/motion");

describe("Sacred Hero loop-seam demonstrator contract", () => {
  it("preserves the canonical source assets and references separate corrected derivatives", () => {
    expect(pageSource).toContain('original: "/assets/champagne/motion/wave-caustics.webm"');
    expect(pageSource).toContain('corrected: "/assets/champagne/motion/wave-caustics-seamless.webm"');
    expect(pageSource).toContain('original: "/assets/champagne/motion/gold-dust-drift.webm"');
    expect(pageSource).toContain('corrected: "/assets/champagne/motion/gold-dust-drift-seamless.webm"');
  });

  it.each(["wave-caustics-seamless.webm", "gold-dust-drift-seamless.webm"])(
    "ships a non-empty VP9 WebM derivative: %s",
    (assetName) => {
      const assetPath = join(motionDir, assetName);
      expect(existsSync(assetPath)).toBe(true);
      expect(statSync(assetPath).size).toBeGreaterThan(100_000);
      expect(readFileSync(assetPath).subarray(0, 4)).toEqual(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    },
  );

  it("starts, pauses and restarts every comparison video together", () => {
    expect(pageSource).toContain("data-loop-restart");
    expect(pageSource).toContain("data-loop-toggle");
    expect(pageSource).toContain("Promise.allSettled(videos.map((video) => video.play()))");
    expect(pageSource).toContain("videos.forEach((video) => video.pause())");
    expect(pageSource).toContain("video.currentTime = 0");
  });

  it("shows an independent repeated-loop counter for all four videos", () => {
    expect(pageSource).toContain("data-loop-video={videoId}");
    expect(pageSource).toContain("data-loop-count={videoId}");
    expect(pageSource).toContain("state.loops += 1");
    expect(pageSource).toContain("video.currentTime + 0.25 < state.previousTime");
  });

  it("uses a responsive two-column comparison that collapses safely on narrow screens", () => {
    expect(pageSource).toContain('gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))"');
    expect(pageSource).toContain('aspectRatio: "16 / 9"');
    expect(pageSource).toContain("playsInline");
  });
});
