export const DRAFT_STATUS = {
  draft: "DRAFT",
  frozen: "FROZEN",
  archived: "ARCHIVED"
} as const;

export type DraftStatus = (typeof DRAFT_STATUS)[keyof typeof DRAFT_STATUS];

export const DRAFT_STATUS_ACTION = {
  freeze: "freeze",
  archive: "archive"
} as const;

export type DraftStatusActionType =
  (typeof DRAFT_STATUS_ACTION)[keyof typeof DRAFT_STATUS_ACTION];

export type DraftStatusAction = { type: DraftStatusActionType };

export const canEditDraft = (status: DraftStatus) => {
  return status === DRAFT_STATUS.draft;
};

export const transitionDraftStatus = (
  current: DraftStatus,
  action: DraftStatusAction
): DraftStatus => {
  switch (action.type) {
    case DRAFT_STATUS_ACTION.freeze:
      return current === DRAFT_STATUS.draft ? DRAFT_STATUS.frozen : current;
    case DRAFT_STATUS_ACTION.archive:
      return current === DRAFT_STATUS.frozen ? DRAFT_STATUS.archived : current;
    default:
      return current;
  }
};
