// packages/champagne-manifests/src/__tests__/useValidatedManifest.test.ts
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useValidatedManifest } from "../useValidatedManifest";
import type { ChampagneManifest } from "../types";

describe("useValidatedManifest", () => {
  it("returns empty sections when manifest is undefined", () => {
    const { result } = renderHook(() => useValidatedManifest(undefined));
    expect(result.current.sections).toEqual([]);
  });

  it("filters out invalid section entries", () => {
    const manifest: ChampagneManifest = {
      sections: [
        // valid
        { id: "one", type: "overview-rich", props: { title: "A" } },
        // missing type → should be dropped
        // @ts-expect-error – intentional invalid
        { id: "two", props: { title: "B" } },
        // nullish
        null as any,
      ],
    };

    const { result } = renderHook(() => useValidatedManifest(manifest));
    expect(result.current.sections.length).toBe(1);
    expect(result.current.sections[0].id).toBe("one");
    expect(result.current.sections[0].type).toBe("overview-rich");
  });

  it("auto-generates IDs where missing", () => {
    const manifest: ChampagneManifest = {
      sections: [
        {
          // no id on purpose
          // id: "x",
          type: "overview-rich",
          props: {},
        },
      ],
    };

    const { result } = renderHook(() => useValidatedManifest(manifest));
    expect(result.current.sections.length).toBe(1);
    expect(result.current.sections[0].id).toMatch(/^section-/);
  });
});
