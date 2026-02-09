import { describe, expect, it } from "vitest";
import {
  transitionDraftStatus,
  type DraftStatus
} from "../draftStatus";

describe("transitionDraftStatus", () => {
  it("moves draft to frozen on mark-reviewed", () => {
    const status: DraftStatus = "draft";
    expect(transitionDraftStatus(status, { type: "mark-reviewed" })).toBe(
      "frozen"
    );
  });

  it("moves frozen to draft on unfreeze", () => {
    const status: DraftStatus = "frozen";
    expect(transitionDraftStatus(status, { type: "unfreeze" })).toBe("draft");
  });

  it("keeps frozen when mark-reviewed is repeated", () => {
    const status: DraftStatus = "frozen";
    expect(transitionDraftStatus(status, { type: "mark-reviewed" })).toBe(
      "frozen"
    );
  });
});
