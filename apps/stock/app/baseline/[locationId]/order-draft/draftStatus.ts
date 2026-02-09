export type DraftStatus = "draft" | "frozen";

export type DraftStatusAction =
  | { type: "mark-reviewed" }
  | { type: "unfreeze" };

export const transitionDraftStatus = (
  current: DraftStatus,
  action: DraftStatusAction
): DraftStatus => {
  switch (action.type) {
    case "mark-reviewed":
      return "frozen";
    case "unfreeze":
      return "draft";
    default:
      return current;
  }
};
