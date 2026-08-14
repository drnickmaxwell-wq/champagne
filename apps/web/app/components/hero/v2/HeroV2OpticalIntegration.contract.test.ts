import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const clientSource = readFileSync(join(currentDir, "HeroV2Client.tsx"), "utf8");
const rendererSource = readFileSync(join(currentDir, "HeroRendererV2.tsx"), "utf8");

describe("Sacred Hero V2 optical integration candidate", () => {
  it("is disabled by default and requires the isolated preview gate", () => {
    expect(rendererSource).toContain("const HERO_V2_OPTICAL_PRODUCTION_BINDING = false");
    expect(rendererSource).toContain('const HERO_V2_OPTICAL_PREVIEW_PARAM = "heroOpticalCandidate"');
    expect(rendererSource).toContain('searchParams?.get(HERO_V2_OPTICAL_PREVIEW_PARAM) === "1"');
    expect(rendererSource).toContain('data-optical-candidate={opticalCandidate ? "true" : "false"}');
  });

  it("ports the accepted 24-second three-moment choreography without changing asset identity", () => {
    expect(clientSource).toContain("const OPTICAL_CHOREOGRAPHY_DURATION_MS = 24_000");
    expect(clientSource).toContain('"sacred.motion.waveCaustics": { floor: 0.1, lift: 0.38, peak: 0.16');
    expect(clientSource).toContain('"sacred.motion.glassShimmer": { floor: 0.09, lift: 0.35, peak: 0.43');
    expect(clientSource).toContain('"sacred.motion.particleDrift": { floor: 0.08, lift: 0.14, peak: 0.69');
    expect(clientSource).toContain('"sacred.motion.goldDust": { floor: 0.09, lift: 0.29, peak: 0.76');
    expect(clientSource).toContain("influence * influence * (3 - 2 * influence)");
  });

  it("recovers autoplay failure without telemetry or evidence controls", () => {
    expect(clientSource).toContain("void video.play().catch(() =>");
    expect(clientSource).toContain('video.addEventListener("canplay", handleCanPlay)');
    expect(clientSource).toContain('video.removeEventListener("canplay", handleCanPlay)');
    expect(clientSource).not.toContain("motionEvidenceControl");
    expect(clientSource).not.toContain("telemetry");
  });

  it("preserves reduced-motion by refusing candidate choreography and hiding motion", () => {
    expect(clientSource).toContain("if (!opticalCandidate || prmEnabled) return");
    expect(rendererSource).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.hero-renderer-v2 \.hero-surface--motion \{ display: none; \}/,
    );
  });

  it("protects copy with distinct desktop and mobile masks", () => {
    expect(rendererSource).toContain("linear-gradient(90deg, transparent 0 32%, currentColor 62% 100%)");
    expect(rendererSource).toContain("linear-gradient(90deg, transparent 0 40%, currentColor 59% 96%, transparent 100%)");
    expect(rendererSource).toContain("linear-gradient(180deg, transparent 0 46%, currentColor 74% 100%)");
    expect(rendererSource).toContain("linear-gradient(180deg, transparent 0 47%, currentColor 68% 97%, transparent 100%)");
  });

  it("restores distinct caustic travel and edge-shimmer motion in the real Hero composition", () => {
    expect(rendererSource).toContain("animation-name: heroOpticalCausticTravel");
    expect(rendererSource).toContain("animation-name: heroOpticalEdgeTravel");
    expect(rendererSource).toContain("@keyframes heroOpticalCausticTravel");
    expect(rendererSource).toContain("translate3d(-2.8%, 1.8%, 0) scale(1.055)");
    expect(rendererSource).toContain("@keyframes heroOpticalEdgeTravel");
    expect(rendererSource).toContain("translate3d(2.4%, -1.6%, 0) scale(1.045)");
  });

  it("keeps the candidate on the existing V2 geometry, content and assets", () => {
    expect(rendererSource).toContain("<HeroContentV2 content={activeModel.content} layout={activeModel.layout} />");
    expect(rendererSource).toContain("<HeroV2Frame");
    expect(rendererSource).toContain("<HeroSurfaceStackV2");
    expect(rendererSource).not.toContain("v2-light-depth-enhanced");
    expect(rendererSource).not.toContain("HeroV3DiagnosticLab");
  });
});
