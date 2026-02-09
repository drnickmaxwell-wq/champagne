import { describe, expect, it } from "vitest";
import {
  canEditDraft,
  DRAFT_STATUS,
  DRAFT_STATUS_ACTION,
  transitionDraftStatus,
  type DraftStatus
} from "../draftStatus";

describe("transitionDraftStatus", () => {
  it("moves draft to frozen on freeze", () => {
    const status: DraftStatus = DRAFT_STATUS.draft;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.freeze })
    ).toBe(DRAFT_STATUS.frozen);
  });

  it("disables editing when frozen", () => {
    expect(canEditDraft(DRAFT_STATUS.frozen)).toBe(false);
  });

  it("reenables editing after unfreeze", () => {
    expect(canEditDraft(DRAFT_STATUS.draft)).toBe(true);
    expect(
      canEditDraft(
        transitionDraftStatus(DRAFT_STATUS.frozen, {
          type: DRAFT_STATUS_ACTION.unfreeze
        })
      )
    ).toBe(true);
  });

  it("keeps frozen when freeze is repeated", () => {
    const status: DraftStatus = DRAFT_STATUS.frozen;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.freeze })
    ).toBe(DRAFT_STATUS.frozen);
  });

  it("moves frozen to draft on unfreeze", () => {
    const status: DraftStatus = DRAFT_STATUS.frozen;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.unfreeze })
    ).toBe(DRAFT_STATUS.draft);
  });
});
