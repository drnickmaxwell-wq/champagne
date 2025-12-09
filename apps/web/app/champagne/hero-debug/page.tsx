import { HeroRenderer } from "../../components/hero/HeroRenderer";
import { getHeroRuntime } from "@champagne/hero";

type HeroSurfaceStackLayer = NonNullable<
  Awaited<ReturnType<typeof getHeroRuntime>>["surfaces"]["surfaceStack"]
>[number];

function normalizeBoolean(value: string | string[] | undefined, defaultValue: boolean): boolean {
  if (Array.isArray(value)) return value.includes("true") ? true : value.includes("false") ? false : defaultValue;
  if (typeof value === "string") return value === "true";
  return defaultValue;
}

function isStrongDebug(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.includes("strong");
  return value === "strong";
}

function resolveSurfaceAsset(
  token: string | undefined,
  stackLayer: HeroSurfaceStackLayer,
  surfaces: Awaited<ReturnType<typeof getHeroRuntime>>["surfaces"],
  runtimeOpacity?: number,
): { assetId: string; path?: string; disabled?: boolean; opacity?: number; motion?: boolean } {
  if (!token) return { assetId: stackLayer.id ?? "unknown" };
  if (token === "gradient.base") return { assetId: "gradient.base (CSS)", path: surfaces.gradient };
  if (token === "field.waveBackdrop")
    return { assetId: surfaces.background?.desktop?.id ?? "field.waveBackdrop", path: surfaces.background?.desktop?.path };
  if (token === "mask.waveHeader") return { assetId: surfaces.waveMask?.desktop?.id ?? token, path: surfaces.waveMask?.desktop?.path };
  if (token === "field.waveRings") return { assetId: surfaces.overlays?.field?.asset?.id ?? token, path: surfaces.overlays?.field?.path };
  if (token === "field.dotGrid") return { assetId: surfaces.overlays?.dots?.asset?.id ?? token, path: surfaces.overlays?.dots?.path };
  if (token === "overlay.caustics") {
    const causticsMotion = surfaces.motion?.find((entry) => entry.id === "overlay.caustics");
    return {
      assetId: causticsMotion?.asset?.id ?? token,
      path: causticsMotion?.path,
      disabled: !causticsMotion,
      motion: true,
      opacity: runtimeOpacity,
    };
  }
  if (token === "overlay.particles")
    return {
      assetId: surfaces.particles?.asset?.id ?? token,
      path: surfaces.particles?.path,
      disabled: !surfaces.particles,
      opacity: runtimeOpacity,
    };
  if (token === "overlay.filmGrain")
    return {
      assetId: surfaces.grain?.desktop?.asset?.id ?? token,
      path: surfaces.grain?.desktop?.path,
      disabled: !surfaces.grain?.desktop,
      opacity: runtimeOpacity,
    };
  return { assetId: stackLayer.id ?? token, path: undefined };
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
  const prm = mockPrm ?? normalizeBoolean(resolved.prm, false);
  const particles = normalizeBoolean(resolved.particles, true);
  const filmGrain = normalizeBoolean(resolved.filmGrain, true);
  const strongDebug = isStrongDebug(resolved.debug);
  const opacityBoost = strongDebug ? 1.6 : 1;
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);

  const runtime = await getHeroRuntime({ mode: "home", prm, particles, filmGrain });
  const surfaces = runtime.surfaces;
  const surfaceStack = surfaces.surfaceStack ?? [];
  const causticsOpacity = applyBoost(
    surfaces.motion?.find((entry) => entry.id === "overlay.caustics")?.opacity ?? surfaces.overlays?.field?.opacity ?? 0.35,
  );
  const filmGrainOpacity = applyBoost((runtime.filmGrain.opacity ?? 0.3) * (surfaces.grain?.desktop?.opacity ?? 1));
  const particlesOpacity = applyBoost((runtime.motion.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1) * 0.35);
  const waveBackdropOpacity = applyBoost(surfaces.background?.desktop?.opacity ?? 0.55);
  const waveRingsOpacity = applyBoost(surfaces.overlays?.field?.opacity ?? 1);
  const dotGridOpacity = applyBoost(surfaces.overlays?.dots?.opacity ?? 1);
  const prmSource = mockPrm !== undefined ? `mocked (${mockPrm ? "on" : "off"})` : "system";

  const surfaceDetails = surfaceStack.map((layer) => {
    const token = layer.token ?? layer.id;
    const resolvedAsset = resolveSurfaceAsset(
      token,
      layer,
      surfaces,
      token === "overlay.caustics"
        ? causticsOpacity
        : token === "overlay.filmGrain"
          ? filmGrainOpacity
          : token === "overlay.particles"
            ? particlesOpacity
            : token === "field.waveBackdrop"
              ? waveBackdropOpacity
              : token === "field.waveRings"
                ? waveRingsOpacity
                : token === "field.dotGrid"
                  ? dotGridOpacity
                  : undefined,
    );
    return {
      token,
      role: layer.role,
      assetId: resolvedAsset.assetId,
      path: resolvedAsset.path,
      prmSafe: layer.prmSafe,
      motion: layer.motion ?? resolvedAsset.motion,
      suppressed: layer.suppressed,
      opacity: resolvedAsset.opacity,
      disabled: resolvedAsset.disabled,
    };
  });

  return (
    <div
      data-debug-strong={strongDebug ? "true" : "false"}
      className="hero-debug-page"
      style={{ display: "grid", gap: "1.25rem", padding: "clamp(1.5rem, 4vw, 2.5rem)", background: "var(--bg-ink)", color: "var(--text-high)" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-debug-page {
              min-height: 100vh;
            }
            .hero-debug-grid {
              display: grid;
              gap: 1rem;
            }
            .hero-debug-hero-shell {
              position: relative;
              min-height: 85vh;
              border-radius: var(--radius-xl);
              overflow: hidden;
              border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft));
              background: color-mix(in srgb, var(--bg-ink) 80%, transparent);
            }
            .hero-debug-panel {
              border-radius: var(--radius-lg);
              border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft));
              background: color-mix(in srgb, var(--bg-ink) 70%, transparent);
              padding: 1rem 1.25rem;
              overflow: auto;
            }
            .hero-debug-panel table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.95rem;
            }
            .hero-debug-panel th,
            .hero-debug-panel td {
              text-align: left;
              padding: 0.35rem 0.5rem;
              border-bottom: 1px solid color-mix(in srgb, var(--champagne-keyline-gold, var(--surface-ink-soft)) 50%, transparent);
            }
            .hero-debug-panel th {
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--text-medium);
              font-size: 0.8rem;
            }
          `,
        }}
      />

      <header style={{ display: "grid", gap: "0.25rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Sacred hero debug</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.4rem)" }}>Surface activation proof</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.55 }}>
          This page renders the same Sacred Home hero variant used on the landing page and lists each resolved surface with its
          asset URL. Add
          <code style={{ padding: "0 0.4rem", borderRadius: "var(--radius-sm)", background: "var(--surface-ink-soft)" }}>
            ?debug=strong
          </code>
          to multiply non-content layer opacity (×{opacityBoost.toFixed(1)}), or
          <code style={{ padding: "0 0.4rem", borderRadius: "var(--radius-sm)", background: "var(--surface-ink-soft)", marginLeft: "0.35rem" }}>
            ?mockPrm=on
          </code>
          to simulate prefers-reduced-motion.
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
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Asset</th>
                <th>URL</th>
                <th>Opacity</th>
                <th>Motion</th>
                <th>PRM Safe</th>
                <th>Suppressed</th>
              </tr>
            </thead>
            <tbody>
              {surfaceDetails.map((detail) => (
                <tr key={detail.token}>
                  <td>{detail.token}</td>
                  <td>
                    {detail.assetId}
                    {detail.disabled ? " (prm disabled)" : ""}
                  </td>
                  <td style={{ color: "var(--text-medium)", fontSize: "0.9rem", wordBreak: "break-all" }}>
                    {detail.path ?? "—"}
                  </td>
                  <td>{detail.opacity ? detail.opacity.toFixed(2) : "—"}{strongDebug ? " (boosted)" : ""}</td>
                  <td>{detail.motion ? "Yes" : "No"}</td>
                  <td>{detail.prmSafe ? "Yes" : "No"}</td>
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
