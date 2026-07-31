import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const mountSource = readFileSync(join(currentDir, "HeroMount.tsx"), "utf8");
const rendererSource = readFileSync(
  join(currentDir, "../components/hero/v2/HeroRendererV2.tsx"),
  "utf8",
);
const clientSource = readFileSync(
  join(currentDir, "../components/hero/v2/HeroV2Client.tsx"),
  "utf8",
);

describe("HeroMount V2 lifecycle contract", () => {
  it("hands the server-built first frame to the persistent client renderer", () => {
    expect(mountSource).toContain("initialModel={v2Model}");
    expect(mountSource).toContain("initialPathname={pathnameKey}");
    expect(mountSource).toContain("<HeroRendererV2");
    expect(rendererSource).toContain(
      "const seededModel = initialModel ?? lastResolvedHeroV2Model",
    );
    expect(rendererSource).toContain(
      "useState<HeroV2Model | null>(() => seededModel)",
    );
    expect(rendererSource).toContain(
      "heroV2ModelCache.set(normalizedInitialPathname, initialModel)",
    );
  });

  it("does not directly own the V2 surface stack or content-fade lifecycle", () => {
    expect(mountSource).not.toContain("HeroSurfaceStackV2");
    expect(mountSource).not.toContain("HeroContentFade");
    expect(mountSource).not.toContain("<HeroV2Frame");
  });

  it("keeps one memoized surface stack with a stable continuity identity", () => {
    expect(clientSource).toContain(
      "export const HeroSurfaceStackV2 = memo(HeroSurfaceStackV2Base)",
    );
    expect(clientSource).toContain('data-v2-persistent-stack="true"');
    expect(clientSource).toContain(
      "data-v2-stack-instance={instanceId.current}",
    );
  });

  it("starts content visible and never hides it for reduced motion or a disabled fade", () => {
    expect(clientSource).toContain(
      "const [isVisible, setIsVisible] = useState(true)",
    );
    expect(clientSource).toContain(
      "if (prefersReducedMotion || !HERO_CONTENT_FADE_ENABLED)",
    );
    expect(clientSource).toMatch(
      /if \(prefersReducedMotion \|\| !HERO_CONTENT_FADE_ENABLED\) \{\s*setIsVisible\(true\)/,
    );
  });
});
