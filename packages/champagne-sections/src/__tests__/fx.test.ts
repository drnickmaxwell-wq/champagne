import { describe, it, expect } from "vitest";
import { computeFxProps } from "../fx";

describe("computeFxProps", () => {
  it("returns empty object for invalid input", () => {
    expect(computeFxProps(undefined)).toEqual({});
    expect(computeFxProps(null as any)).toEqual({});
    expect(computeFxProps("nope" as any)).toEqual({});
  });

  it("passes through boolean flags", () => {
    const fx = computeFxProps({
      parallax: true,
      fadeIn: true,
      spotlight: false,
      shimmer: true,
    });

    expect(fx.parallax).toBe(true);
    expect(fx.fadeIn).toBe(true);
    expect(fx.spotlight).toBe(false);
    expect(fx.shimmer).toBe(true);
  });

  it("defaults to false when fields are missing", () => {
    const fx = computeFxProps({});
    expect(fx.parallax).toBe(false);
    expect(fx.fadeIn).toBe(false);
    expect(fx.spotlight).toBe(false);
    expect(fx.shimmer).toBe(false);
  });

  it("supports numeric parallax intensity", () => {
    const fx = computeFxProps({ parallax: 0.5 });
    expect(fx.parallax).toBe(0.5);
  });
});
