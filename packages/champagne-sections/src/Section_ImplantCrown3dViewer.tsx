import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

const GLB_PATH = "/tenants/smh/3d/implants/IMPLANT_CROWN__HERO__OPTIMISED__v1.glb";
const FALLBACK_IMAGE = "/tenants/smh/3d/implants/IMPLANT_CROWN__HERO__FALLBACK__WEB__v1.jpg";

export interface SectionImplantCrown3dViewerProps {
  section?: SectionRegistryEntry;
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1rem, 2.4vw, 1.6rem)",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  alignItems: "center",
};

const imageWrapperStyle: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
  border: "1px solid var(--border-subtle)",
  minHeight: "230px",
  background: "var(--surface-2)",
  boxShadow: "var(--shadow-soft)",
};

export function Section_ImplantCrown3dViewer({ section }: SectionImplantCrown3dViewerProps = {}) {
  const title = section?.title ?? "See every component in 3D.";
  const body =
    section?.body ??
    "The implant, abutment, and crown work together as a system. Planning in three dimensions lets us confirm bone volume, nerve clearance, and final tooth position before surgery begins.";
  const eyebrow = section?.eyebrow ?? "3D implant crown";

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 2.8vw, 2.25rem)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {eyebrow && (
            <span
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-medium)",
              }}
            >
              {eyebrow}
            </span>
          )}
          <h3
            style={{
              fontSize: "clamp(1.25rem, 2vw, 1.65rem)",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text-high)",
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-medium)" }}>{body}</p>
        </div>
        <div style={imageWrapperStyle}>
          <img
            src={FALLBACK_IMAGE}
            alt="Implant crown — titanium post, abutment, and ceramic crown shown as a 3D hero render"
            data-glb={GLB_PATH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              minHeight: "230px",
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </BaseChampagneSurface>
  );
}
