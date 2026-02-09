import { getExpiryStatus, type LocalStockLot } from "../stockLots/localLots";

export type VarianceConfidence =
  | {
      level: "high";
      label: "High confidence";
      helperText: "Baseline and local lot data with known expiry dates.";
    }
  | {
      level: "medium";
      label: "Medium confidence";
      helperText: "Estimate includes near-expiry or partial lot data.";
    }
  | {
      level: "low";
      label: "Low confidence";
      helperText: "Estimate inferred from scan session activity only.";
    }
  | {
      level: "unknown";
      label: "Unknown";
      helperText: "Missing baseline or estimate inputs.";
    };

export type VarianceEstimateSource = "lots" | "session" | "unknown";

type VarianceConfidenceInput = {
  baselineExists: boolean;
  estimateSource: VarianceEstimateSource;
  hasCurrentEstimate: boolean;
  lots: LocalStockLot[];
};

const HIGH_CONFIDENCE: VarianceConfidence = {
  level: "high",
  label: "High confidence",
  helperText: "Baseline and local lot data with known expiry dates."
};

const MEDIUM_CONFIDENCE: VarianceConfidence = {
  level: "medium",
  label: "Medium confidence",
  helperText: "Estimate includes near-expiry or partial lot data."
};

const LOW_CONFIDENCE: VarianceConfidence = {
  level: "low",
  label: "Low confidence",
  helperText: "Estimate inferred from scan session activity only."
};

const UNKNOWN_CONFIDENCE: VarianceConfidence = {
  level: "unknown",
  label: "Unknown",
  helperText: "Missing baseline or estimate inputs."
};

export const computeVarianceConfidence = (
  input: VarianceConfidenceInput
): VarianceConfidence => {
  if (!input.baselineExists || !input.hasCurrentEstimate) {
    return UNKNOWN_CONFIDENCE;
  }

  if (input.estimateSource === "unknown") {
    return UNKNOWN_CONFIDENCE;
  }

  if (input.estimateSource === "session") {
    return LOW_CONFIDENCE;
  }

  if (input.lots.length === 0) {
    return UNKNOWN_CONFIDENCE;
  }

  const hasNearOrUnknownExpiry = input.lots.some((lot) => {
    const status = getExpiryStatus(lot.expiryDate);
    return status === "near-expiry" || status === "unknown";
  });

  if (hasNearOrUnknownExpiry) {
    return MEDIUM_CONFIDENCE;
  }

  return HIGH_CONFIDENCE;
};
