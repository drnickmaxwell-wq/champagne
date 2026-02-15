import type { ReactNode } from "react";
import styles from "./concierge.module.css";

export type ConciergePanelState = "closed" | "opening" | "open" | "closing";

type ConciergeMotionProps = {
  state: ConciergePanelState;
  children: (options: { panelClassName: string; keylineTraceClassName: string; showKeylineTrace: boolean }) => ReactNode;
};

export function ConciergeMotion({ state, children }: ConciergeMotionProps) {
  const panelStateClassName =
    state === "opening"
      ? styles.panelOpening
      : state === "closing"
        ? styles.panelClosing
        : styles.panelOpen;

  return children({
    panelClassName: panelStateClassName,
    keylineTraceClassName: styles.keylineTrace,
    showKeylineTrace: state === "opening",
  });
}
