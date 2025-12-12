import { HeroRenderer } from "../../_components/HeroRenderer/HeroRenderer";
import { buildLayerStack, type RuntimeLayer } from "../../_components/HeroRenderer/layerUtils";
import { ensureHeroAssetPath, getHeroRuntime } from "@champagne/hero";

function parseToggle(value: string | string[] | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  if (Array.isArray(value)) value = value[0];
  const lowered = value.toLowerCase();
  return lowered === "true" || lowered === "1" || lowered === "on";
}

function isStrongDebug(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.includes("strong");
  return value === "strong";
}

function surfacePathForToken(token: string, runtime: Awaited<ReturnType<typeof getHeroRuntime>>): {
  assetId?: string;
  path?: string;
  motion?: boolean;
} {
  const surfaces = runtime.surfaces;
  if (token === "gradient.base") return { assetId: "css", path: surfaces.gradient };
  if (token === "field.waveBackdrop") {
    const background = surfaces.background?.desktop;
    return { assetId: background?.asset?.id ?? background?.id, path: background?.path ?? ensureHeroAssetPath(background?.id) };
  }
  if (token === "mask.waveHeader") {
    const mask = surfaces.waveMask?.desktop;
    return { assetId: mask?.asset?.id ?? mask?.id, path: mask?.path ?? ensureHeroAssetPath(mask?.id) };
  }
  if (token === "field.waveRings") {
    const field = surfaces.overlays?.field;
    return { assetId: field?.asset?.id ?? field?.id, path: field?.path ?? ensureHeroAssetPath(field?.id) };
  }
  if (token === "field.dotGrid") {
    const dots = surfaces.overlays?.dots;
    return { assetId: dots?.asset?.id ?? dots?.id, path: dots?.path ?? ensureHeroAssetPath(dots?.id) };
  }
  if (token === "overlay.particles") {
    const particles = surfaces.particles;
    return { assetId: particles?.asset?.id ?? particles?.id, path: particles?.path ?? ensureHeroAssetPath(particles?.id) };
  }
  if (token === "overlay.filmGrain") {
    const grain = surfaces.grain?.desktop;
    return { assetId: grain?.asset?.id ?? grain?.id, path: grain?.path ?? ensureHeroAssetPath(grain?.id) };
  }

  const motion = (surfaces.motion ?? []).find((entry) => entry.id === token);
  if (motion) {
    return { assetId: motion.asset?.id ?? motion.id, path: motion.path, motion: true };
  }

  return {};
}

function describeLayer(layer: RuntimeLayer) {
  return {
    id: layer.id ?? "unknown",
    role: layer.role ?? "",
    type: layer.type ?? "unknown",
    opacity: layer.opacity,
    blendMode: layer.blendMode,
    zIndex: layer.zIndex,
    prmSafe: layer.prmSafe,
    url: layer.url,
    suppressedReason: layer.suppressedReason,
  };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HeroDebugPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (await searchParams) ?? {};
  const mockPrm = (() => {
    const value = resolved.mockPrm;
    if (Array.isArray(value)) return value.includes("on") ? true : value.includes("off") ? false : undefined;
    if (typeof value === "string") return value === "on" ? true : value === "off" ? false : undefined;
    return undefined;
  })();
  const prm = mockPrm ?? parseToggle(resolved.prm, false);
  const particles = parseToggle(resolved.particles, true);
  const filmGrain = parseToggle(resolved.filmGrain, true);
  const strongDebug = isStrongDebug(resolved.debug);
  const opacityBoost = strongDebug ? 1.6 : 1;

  const runtime = await getHeroRuntime({ mode: "home", prm, particles, filmGrain, variantId: "default" });
  const layerStack = buildLayerStack({ runtime, mode: "home", particles, filmGrain, opacityBoost });
  const surfaceStack = runtime.surfaces.surfaceStack ?? [];
  const layerDiagnostics = layerStack.layerDiagnostics ?? layerStack.resolvedLayers;
  const surfaceSummaries = surfaceStack.map((entry) => {
    const token = entry.token ?? entry.id ?? "layer";
    const surfaceAsset = surfacePathForToken(token, runtime);
    return {
      token,
      role: entry.role,
      prmSafe: entry.prmSafe,
      suppressed: entry.suppressed,
      ...surfaceAsset,
    };
  });

  const prmSource = mockPrm !== undefined ? `mocked (${mockPrm ? "on" : "off"})` : "system";

  return (
    <div
      data-debug-strong={strongDebug ? "true" : "false"}
      className="hero-debug-page"
      style={{ display: "grid", gap: "1.5rem", padding: "clamp(1.5rem, 4vw, 2.5rem)", background: "var(--bg-ink)", color: "var(--text-high)" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-debug-page { min-height: 100vh; }
            .hero-debug-grid { display: grid; gap: 1rem; }
            .hero-debug-hero-shell { position: relative; min-height: 85vh; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 80%, transparent); }
            .hero-debug-panel { border-radius: var(--radius-lg); border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 70%, transparent); padding: 1rem 1.25rem; overflow: auto; display: grid; gap: 0.75rem; }
            .hero-debug-panel h2 { margin: 0; font-size: 1.1rem; }
            .hero-debug-panel table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
            .hero-debug-panel th, .hero-debug-panel td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--champagne-keyline-gold, var(--surface-ink-soft)) 50%, transparent); }
            .hero-debug-panel th { letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-medium); font-size: 0.8rem; }
          `,
        }}
      />

      <header style={{ display: "grid", gap: "0.35rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Sacred hero debug</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.4rem)" }}>Runtime surface inspector</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.55 }}>
          This page renders the Sacred Home hero variant used on the landing page and exposes the resolved layer stack and surface tokens.
          Add <code style={{ padding: "0 0.35rem", borderRadius: "var(--radius-sm)", background: "var(--surface-ink-soft)" }}>?debug=strong</code> to multiply non-content opacity, or
          <code style={{ padding: "0 0.35rem", borderRadius: "var(--radius-sm)", background: "var(--surface-ink-soft)", marginLeft: "0.35rem" }}>?mockPrm=on</code> to simulate prefers-reduced-motion.
        </p>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.45 }}>
          Variant: <strong>{runtime.variant?.id ?? "default"}</strong> · PRM ({prmSource}):
          <strong style={{ marginLeft: "0.35rem" }}>{runtime.flags.prm ? "on" : "off"}</strong>
          {mockPrm !== undefined ? " (mocked for this view)" : ""}
        </p>
      </header>

      <div className="hero-debug-grid">
        <div className="hero-debug-hero-shell">
          <HeroRenderer prm={prm} particles={particles} filmGrain={filmGrain} debugOpacityBoost={opacityBoost} />
        </div>

        <div className="hero-debug-panel">
          <h2>Active surface layers</h2>
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {layerDiagnostics.map((layer) => {
              const detail = describeLayer(layer);
              const backgroundImage = detail.type === "gradient"
                ? detail.url
                : detail.url
                  ? `url(${detail.url})`
                  : undefined;
              const suppressed = Boolean(detail.suppressedReason);
              return (
                <div
                  key={detail.id}
                  data-suppressed={suppressed ? "true" : "false"}
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
                    padding: "0.75rem",
                    background: "color-mix(in srgb, var(--surface-ink-soft) 55%, transparent)",
                    display: "grid",
                    gap: "0.5rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      height: "120px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      backgroundImage,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: suppressed ? "grayscale(1) opacity(0.35)" : undefined,
                    }}
                  />
                  <div style={{ display: "grid", gap: "0.25rem", fontSize: "0.95rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.35rem" }}>
                      <strong>{detail.id}</strong>
                      <span style={{ color: "var(--text-medium)", fontSize: "0.85rem" }}>{detail.role || "—"}</span>
                    </div>
                    <div style={{ color: "var(--text-medium)", fontSize: "0.9rem" }}>
                      Type: {detail.type} · Blend: {detail.blendMode ?? "—"}
                    </div>
                    <div style={{ color: "var(--text-medium)", fontSize: "0.9rem" }}>
                      Opacity: {detail.opacity !== undefined ? detail.opacity.toFixed(2) : "—"}
                      {suppressed ? " (suppressed)" : ""}
                    </div>
                    <div style={{ color: "var(--text-medium)", fontSize: "0.9rem" }}>
                      Z: {detail.zIndex ?? "auto"} · PRM safe: {detail.prmSafe === undefined ? "—" : detail.prmSafe ? "Yes" : "No"}
                    </div>
                    {suppressed ? (
                      <div style={{ color: "var(--warning-amber, #f8d87c)", fontSize: "0.9rem" }}>
                        {detail.suppressedReason}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hero-debug-panel">
          <h2>Runtime flags</h2>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "grid", gap: "0.25rem" }}>
            <li>Mode: {runtime.flags.mode}</li>
            <li>Time of day: {runtime.flags.timeOfDay ?? "default"}</li>
            <li>Treatment slug: {runtime.flags.treatmentSlug ?? "—"}</li>
            <li>Particles: {particles ? "enabled" : "disabled"}</li>
            <li>Film grain: {filmGrain ? `enabled (opacity ${runtime.filmGrain.opacity ?? "—"})` : "disabled"}</li>
            <li>PRM: {runtime.flags.prm ? "on" : "off"}</li>
          </ul>
        </div>

        <div className="hero-debug-panel">
          <h2>Resolved layer stack</h2>
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Role</th>
                <th>Type</th>
                <th>Opacity</th>
                <th>Blend</th>
                <th>PRM safe</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {layerStack.resolvedLayers.map((layer) => {
                const detail = describeLayer(layer);
                return (
                  <tr key={detail.id}>
                    <td>{detail.id}</td>
                    <td>{detail.role || "—"}</td>
                    <td>{detail.type}</td>
                    <td>{detail.opacity !== undefined ? detail.opacity.toFixed(2) : "—"}{strongDebug ? " (boosted)" : ""}</td>
                    <td>{detail.blendMode ?? "—"}</td>
                    <td>{detail.prmSafe === undefined ? "—" : detail.prmSafe ? "Yes" : "No"}</td>
                    <td style={{ color: "var(--text-medium)", fontSize: "0.9rem", wordBreak: "break-all" }}>{detail.url ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="hero-debug-panel">
          <h2>Surface tokens</h2>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Role</th>
                <th>Asset</th>
                <th>URL</th>
                <th>PRM safe</th>
                <th>Suppressed</th>
              </tr>
            </thead>
            <tbody>
              {surfaceSummaries.map((detail) => (
                <tr key={detail.token}>
                  <td>{detail.token}</td>
                  <td>{detail.role ?? "—"}</td>
                  <td>{detail.assetId ?? "—"}{detail.motion ? " · motion" : ""}</td>
                  <td style={{ color: "var(--text-medium)", fontSize: "0.9rem", wordBreak: "break-all" }}>{detail.path ?? "—"}</td>
                  <td>{detail.prmSafe === undefined ? "—" : detail.prmSafe ? "Yes" : "No"}</td>
                  <td>{detail.suppressed ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
