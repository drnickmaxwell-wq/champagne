import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const pageSource = readFileSync(join(currentDir, "page.tsx"), "utf8");
const fullHeroSource = readFileSync(join(currentDir, "FullHeroLoopComparison.tsx"), "utf8");
const stylesSource = readFileSync(join(currentDir, "page.module.css"), "utf8");
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

  it("renders the canonical full Hero model twice without changing its runtime", () => {
    expect(pageSource).toContain('buildHeroV2Model({ pageSlugOrPath: "/", particles: true, filmGrain: true, prm: false })');
    expect(pageSource).toContain("<FullHeroLoopComparison model={heroModel} />");
    expect(fullHeroSource).toContain("<HeroV2Frame");
    expect(fullHeroSource).toContain("<HeroSurfaceStackV2 {...model.surfaceStack} />");
    expect(fullHeroSource).toContain("<HeroContentV2 content={model.content} layout={model.layout} />");
  });

  it("changes only the two corrected full-Hero motion paths", () => {
    expect(fullHeroSource).toContain('["sacred.motion.waveCaustics", "/assets/champagne/motion/wave-caustics-seamless.webm"]');
    expect(fullHeroSource).toContain('["sacred.motion.goldDust", "/assets/champagne/motion/gold-dust-drift-seamless.webm"]');
    expect(fullHeroSource).toContain("path: correctedMotionPaths.get(layer.id) ?? layer.path");
    expect(fullHeroSource).toContain('["original", model]');
    expect(fullHeroSource).toContain('["corrected", correctedModel]');
  });

  it("synchronizes, pauses and restarts both complete Heroes", () => {
    expect(fullHeroSource).toContain('querySelectorAll<HTMLVideoElement>("video")');
    expect(fullHeroSource).toContain("video.currentTime = 0");
    expect(fullHeroSource).toContain("video.pause()");
    expect(fullHeroSource).toContain("data-full-hero-restart");
    expect(fullHeroSource).toContain("data-full-hero-toggle");
  });

  it("counts wave and gold boundaries separately for each full Hero", () => {
    expect(fullHeroSource).toContain('"sacred.motion.waveCaustics"');
    expect(fullHeroSource).toContain('"sacred.motion.goldDust"');
    expect(fullHeroSource).toContain("data-full-loop-count");
    expect(fullHeroSource).toContain("current[version][kind] + 1");
  });

  it("shows two full Heroes on desktop and one per row on mobile", () => {
    expect(stylesSource).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(stylesSource).toContain("@media (max-width: 900px)");
    expect(stylesSource).toContain("grid-template-columns: 1fr");
    expect(stylesSource).toContain("min-height: 72vh");
  });
});
