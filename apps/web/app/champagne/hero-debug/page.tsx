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
): { assetId: string; path?: string; disabled?: boolean } {
  if (!token) return { assetId: stackLayer.id ?? "unknown" };
  if (token === "gradient.base") return { assetId: "gradient.base (CSS)", path: surfaces.gradient };
  if (token === "field.waveBackdrop")
    return { assetId: surfaces.background?.desktop?.id ?? "field.waveBackdrop", path: surfaces.background?.desktop?.path };
  if (token === "mask.waveHeader") return { assetId: surfaces.waveMask?.desktop?.id ?? token, path: surfaces.waveMask?.desktop?.path };
  if (token === "field.waveRings") return { assetId: surfaces.overlays?.field?.asset?.id ?? token, path: surfaces.overlays?.field?.path };
  if (token === "field.dotGrid") return { assetId: surfaces.overlays?.dots?.asset?.id ?? token, path: surfaces.overlays?.dots?.path };
  if (token === "overlay.caustics") {
    const causticsMotion = surfaces.motion?.find((entry) => entry.id === "overlay.caustics");
    return { assetId: causticsMotion?.asset?.id ?? token, path: causticsMotion?.path, disabled: !causticsMotion };
  }
  if (token === "overlay.particles")
    return { assetId: surfaces.particles?.asset?.id ?? token, path: surfaces.particles?.path, disabled: !surfaces.particles };
  if (token === "overlay.filmGrain")
    return { assetId: surfaces.grain?.desktop?.asset?.id ?? token, path: surfaces.grain?.desktop?.path, disabled: !surfaces.grain?.desktop };
  return { assetId: stackLayer.id ?? token, path: undefined };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HeroDebugPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (await searchParams) ?? {};
  const prm = normalizeBoolean(resolved.prm, false);
  const particles = normalizeBoolean(resolved.particles, true);
  const filmGrain = normalizeBoolean(resolved.filmGrain, true);
  const strongDebug = isStrongDebug(resolved.debug);

  const runtime = await getHeroRuntime({ mode: "home", prm, particles, filmGrain });
  const surfaces = runtime.surfaces;
  const surfaceStack = surfaces.surfaceStack ?? [];

  const surfaceDetails = surfaceStack.map((layer) => {
    const token = layer.token ?? layer.id;
    const resolvedAsset = resolveSurfaceAsset(token, layer, surfaces);
    return {
      token,
      role: layer.role,
      assetId: resolvedAsset.assetId,
      path: resolvedAsset.path,
      prmSafe: layer.prmSafe,
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
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop,
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--wave-field,
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--dot-field {
              opacity: 0.85 !important;
              mix-blend-mode: screen !important;
            }
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--particles,
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--caustics,
            .hero-debug-page[data-debug-strong="true"] .hero-renderer .hero-surface-layer.hero-surface--film-grain {
              opacity: 0.6 !important;
              mix-blend-mode: screen !important;
            }
          `,
        }}
      />

      <header style={{ display: "grid", gap: "0.25rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Sacred hero debug</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.4rem)" }}>Surface activation proof</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.55 }}>
          This page renders the same Sacred Home hero as the landing page and lists each resolved surface with its asset URL. Add
          <code style={{ padding: "0 0.4rem", borderRadius: "var(--radius-sm)", background: "var(--surface-ink-soft)" }}>
            ?debug=strong
          </code>
          to boost visibility of non-content layers.
        </p>
      </header>

      <div className="hero-debug-grid">
        <div className="hero-debug-hero-shell">
          <HeroRenderer prm={prm} particles={particles} filmGrain={filmGrain} />
        </div>

        <div className="hero-debug-panel">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Asset</th>
                <th>URL</th>
                <th>PRM Safe</th>
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
                  <td>{detail.prmSafe ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
