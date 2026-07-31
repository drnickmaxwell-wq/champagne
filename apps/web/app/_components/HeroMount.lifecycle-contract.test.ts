import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const mountSource = readFileSync(join(currentDir, "HeroMount.tsx"), "utf8");

describe("HeroMount V2 lifecycle contract", () => {
  it("hands the server-built first frame to the persistent client renderer", () => {
    expect(mountSource).toContain("initialModel={v2Model}");
    expect(mountSource).toContain("initialPathname={pathnameKey}");
    expect(mountSource).toContain("<HeroRendererV2");
  });

  it("does not directly own the V2 surface stack or content-fade lifecycle", () => {
    expect(mountSource).not.toContain("HeroSurfaceStackV2");
    expect(mountSource).not.toContain("HeroContentFade");
    expect(mountSource).not.toContain("<HeroV2Frame");
  });
});
