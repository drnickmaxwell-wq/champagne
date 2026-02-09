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

  it("disables editing when archived", () => {
    expect(canEditDraft(DRAFT_STATUS.archived)).toBe(false);
  });

  it("keeps frozen when freeze is repeated", () => {
    const status: DraftStatus = DRAFT_STATUS.frozen;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.freeze })
    ).toBe(DRAFT_STATUS.frozen);
  });

  it("moves frozen to archived on archive", () => {
    const status: DraftStatus = DRAFT_STATUS.frozen;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.archive })
    ).toBe(DRAFT_STATUS.archived);
  });

  it("keeps archived when archive is repeated", () => {
    const status: DraftStatus = DRAFT_STATUS.archived;
    expect(
      transitionDraftStatus(status, { type: DRAFT_STATUS_ACTION.archive })
    ).toBe(DRAFT_STATUS.archived);
  });
});
