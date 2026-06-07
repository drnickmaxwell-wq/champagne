import { ImplantCrownViewerShell } from "./ImplantCrownViewerShell";

const ASSET_ID = "implant_crown_hero_optimised_v1";
const GLB_PATH = "/tenants/smh/3d/implants/IMPLANT_CROWN__HERO__OPTIMISED__v1.glb";
const FALLBACK_PATH = "/tenants/smh/3d/implants/IMPLANT_CROWN__HERO__FALLBACK__WEB__v1.jpg";

export default function ImplantCrownViewerPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink, #0b0d0f)",
        color: "var(--text-high, #fff)",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <p
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-medium, #888)",
          }}
        >
          Champagne 3D viewer — Campaign 15
        </p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.3rem)" }}>
          Implant Crown Hero Asset
        </h1>
        <p
          style={{
            color: "var(--text-medium, #888)",
            maxWidth: "760px",
            lineHeight: 1.5,
          }}
        >
          Readiness proof for{" "}
          <code style={{ color: "var(--text-high, #fff)" }}>{ASSET_ID}</code>.
          Turntable mode with orbit controls. Falls back to JPEG on PRM or WebGL failure.
        </p>
      </header>

      <div
        style={{
          border: "1px solid var(--surface-ink-soft, #222)",
          borderRadius: "var(--radius-xl, 16px)",
          overflow: "hidden",
          height: "clamp(360px, 55vh, 640px)",
          background: "#0b0d0f",
        }}
      >
        <ImplantCrownViewerShell
          glbPath={GLB_PATH}
          fallbackJpegPath={FALLBACK_PATH}
          assetId={ASSET_ID}
        />
      </div>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.4rem 1.5rem",
          fontSize: "0.9rem",
          color: "var(--text-medium, #888)",
        }}
      >
        <dt>Asset ID</dt>
        <dd style={{ color: "var(--text-high, #fff)" }}>{ASSET_ID}</dd>
        <dt>GLB path</dt>
        <dd style={{ color: "var(--text-high, #fff)", wordBreak: "break-all" }}>{GLB_PATH}</dd>
        <dt>Fallback JPEG</dt>
        <dd style={{ color: "var(--text-high, #fff)", wordBreak: "break-all" }}>{FALLBACK_PATH}</dd>
        <dt>Lighting preset</dt>
        <dd style={{ color: "var(--text-high, #fff)" }}>light.beauty_front_soft</dd>
        <dt>Viewer modes</dt>
        <dd style={{ color: "var(--text-high, #fff)" }}>mode_turntable, mode_focus_tooth</dd>
        <dt>Tags</dt>
        <dd style={{ color: "var(--text-high, #fff)" }}>implants, crown, hero, luxury, patient-facing</dd>
        <dt>Canon family</dt>
        <dd style={{ color: "var(--text-high, #fff)" }}>implants / smh</dd>
      </dl>
    </div>
  );
}
