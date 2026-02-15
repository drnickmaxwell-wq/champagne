import styles from "./concierge.module.css";

type ConsultationModeLayerProps = {
  active: boolean;
};

export function ConsultationModeLayer({ active }: ConsultationModeLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={[styles.consultationLayer, active ? styles.consultationLayerOpen : ""].filter(Boolean).join(" ")}
    />
  );
}
