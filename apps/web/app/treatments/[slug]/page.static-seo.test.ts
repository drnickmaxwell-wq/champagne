import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  getTreatmentManifest,
  getTreatmentPages,
  resolveTreatmentPathAlias,
} from "../../../../../packages/champagne-manifests/src/helpers";

const currentDir = dirname(fileURLToPath(import.meta.url));
const pageSource = readFileSync(join(currentDir, "page.tsx"), "utf8");

const manifestTreatmentPages = getTreatmentPages();
const manifestTreatmentSlugs = manifestTreatmentPages.map((page) => page.slug);

describe("treatment static SEO hardening", () => {
  it("resolves every public treatment manifest page by slug", () => {
    expect(manifestTreatmentPages.length).toBeGreaterThan(0);

    for (const page of manifestTreatmentPages) {
      expect(page.slug, page.path).toBeTruthy();
      expect(getTreatmentManifest(page.slug)?.path).toBe(page.path);
    }
  });

  it("keeps treatment aliases redirecting to canonical treatment URLs", () => {
    expect(resolveTreatmentPathAlias("dental-implants")).toEqual({
      resolvedPath: "/treatments/implants",
      wasAlias: true,
    });
    expect(getTreatmentManifest("dental-implants")?.path).toBe("/treatments/implants");

    expect(resolveTreatmentPathAlias("retainers")).toEqual({
      resolvedPath: "/treatments/dental-retainers",
      wasAlias: true,
    });
    expect(getTreatmentManifest("retainers")?.path).toBe("/treatments/dental-retainers");
  });

  it("declares treatment pages as statically generatable from manifest slugs", () => {
    expect(pageSource).toContain("export function generateStaticParams()");
    expect(pageSource).toContain("getTreatmentPages()");
    expect(pageSource).toContain(".map((slug) => ({ slug }))");
    expect(manifestTreatmentSlugs).toContain("implants");
    expect(manifestTreatmentSlugs).toContain("dental-retainers");
  });

  it("does not leave public treatment pages dependent on request-time or generic fallback routing", () => {
    expect(pageSource).not.toContain('export const dynamic = "force-dynamic"');
    expect(pageSource).toContain("export const dynamicParams = false");
  });
});
