import { describe, expect, it } from "vitest";
import {
  computeVarianceConfidence,
  type VarianceEstimateSource
} from "../varianceConfidence";

const buildLot = (expiryDate: string) => ({
  id: "lot-1",
  productId: "product-1",
  locationId: "location-1",
  barcode: "barcode-1",
  batchNumber: "batch-1",
  expiryDate,
  createdAt: "2024-01-01T00:00:00.000Z"
});

describe("computeVarianceConfidence", () => {
  it("returns unknown when baseline is missing", () => {
    const result = computeVarianceConfidence({
      baselineExists: false,
      estimateSource: "lots",
      hasCurrentEstimate: true,
      lots: [buildLot("2999-01-01")]
    });

    expect(result.level).toBe("unknown");
  });

  it("returns unknown when estimate is missing", () => {
    const result = computeVarianceConfidence({
      baselineExists: true,
      estimateSource: "lots",
      hasCurrentEstimate: false,
      lots: [buildLot("2999-01-01")]
    });

    expect(result.level).toBe("unknown");
  });

  it("returns low when estimate comes from session summary only", () => {
    const estimateSource: VarianceEstimateSource = "session";
    const result = computeVarianceConfidence({
      baselineExists: true,
      estimateSource,
      hasCurrentEstimate: true,
      lots: []
    });

    expect(result.level).toBe("low");
  });

  it("returns medium when lots include unknown expiry", () => {
    const result = computeVarianceConfidence({
      baselineExists: true,
      estimateSource: "lots",
      hasCurrentEstimate: true,
      lots: [buildLot("unknown-date")]
    });

    expect(result.level).toBe("medium");
  });

  it("returns high when lots have known, non-near expiry", () => {
    const result = computeVarianceConfidence({
      baselineExists: true,
      estimateSource: "lots",
      hasCurrentEstimate: true,
      lots: [buildLot("2999-01-01")]
    });

    expect(result.level).toBe("high");
  });
});
