import { ensureHeroAssetPath, getHeroRuntime } from "@champagne/hero";

function getAssetForToken(
  token: string,
  runtime: Awaited<ReturnType<typeof getHeroRuntime>>,
): { id: string; path?: string; type: "video" | "image" | "gradient" | "none"; className?: string } {
  const { surfaces } = runtime;
  if (token === "gradient.base") {
    return { id: "gradient.base", path: surfaces.gradient, type: "gradient" };
  }
  if (token === "field.waveBackdrop") {
    return {
      id: surfaces.background?.desktop?.id ?? token,
      path: surfaces.background?.desktop?.path ?? ensureHeroAssetPath(surfaces.background?.desktop?.id),
      type: surfaces.background?.desktop?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.background?.desktop?.className,
    };
  }
  if (token === "mask.waveHeader") {
    return {
      id: surfaces.waveMask?.desktop?.asset?.id ?? token,
      path: surfaces.waveMask?.desktop?.path ?? ensureHeroAssetPath(surfaces.waveMask?.desktop?.asset?.id),
      type: surfaces.waveMask?.desktop?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.waveMask?.desktop?.className,
    };
  }
  if (token === "field.waveRings") {
    return {
      id: surfaces.overlays?.field?.asset?.id ?? token,
      path: surfaces.overlays?.field?.path ?? ensureHeroAssetPath(surfaces.overlays?.field?.asset?.id),
      type: surfaces.overlays?.field?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.overlays?.field?.className,
    };
  }
  if (token === "field.dotGrid") {
    return {
      id: surfaces.overlays?.dots?.asset?.id ?? token,
      path: surfaces.overlays?.dots?.path ?? ensureHeroAssetPath(surfaces.overlays?.dots?.asset?.id),
      type: surfaces.overlays?.dots?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.overlays?.dots?.className,
    };
  }
  if (token === "overlay.particles") {
    return {
      id: surfaces.particles?.asset?.id ?? token,
      path: surfaces.particles?.path ?? ensureHeroAssetPath(surfaces.particles?.asset?.id),
      type: surfaces.particles?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.particles?.className,
    };
  }
  if (token === "overlay.filmGrain") {
    return {
      id: surfaces.grain?.desktop?.asset?.id ?? token,
      path: surfaces.grain?.desktop?.path ?? ensureHeroAssetPath(surfaces.grain?.desktop?.asset?.id),
      type: surfaces.grain?.desktop?.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: surfaces.grain?.desktop?.className,
    };
  }
  if (token === "hero.contentFrame") {
    return { id: token, type: "none" };
  }

  const motionEntry = (surfaces.motion ?? []).find((entry) => entry.id === token);
  if (motionEntry) {
    return {
      id: motionEntry.asset?.id ?? token,
      path: motionEntry.path ?? ensureHeroAssetPath(motionEntry.asset?.id),
      type: motionEntry.path?.match(/\.(webm|mp4)$/) ? "video" : "image",
      className: motionEntry.className,
    };
  }

  return { id: token, type: "none" };
}

function renderPreview(asset: { id: string; path?: string; type: string }) {
  if (!asset.path && asset.type === "gradient") {
    return <div style={{ background: asset.path ?? "var(--smh-gradient)", height: "180px", borderRadius: "var(--radius-md)" }} />;
  }

  if (asset.type === "video" && asset.path) {
    return (
      <video
        src={asset.path}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
      />
    );
  }

  if (asset.path) {
    return <img src={asset.path} alt={asset.id} style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />;
  }

  return (
    <div
      style={{
        height: "180px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-ink-soft)",
        display: "grid",
        placeItems: "center",
        color: "var(--text-medium)",
      }}
    >
      No asset
    </div>
  );
}

export default async function HeroAssetLabPage() {
  const runtime = await getHeroRuntime({ mode: "home", variantId: "default" });
  const stack = runtime.surfaces.surfaceStack ?? [];
  const seen = new Set<string>();
  const layers = stack.filter((layer) => {
    const token = layer.token ?? layer.id;
    if (!token) return false;
    if (seen.has(token)) return false;
    seen.add(token);
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Hero asset lab</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.3rem)" }}>Sacred hero surface registry</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.5 }}>
          Raw previews for each resolved sacred home hero surface. Images and videos are shown without the gradient or glass shell
          so we can see the exact asset pixels coming from the manifests.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {layers.map((layer) => {
          const token = layer.token ?? layer.id ?? "layer";
          const asset = getAssetForToken(token, runtime);
          const preview = renderPreview(asset);
          return (
            <div
              key={token}
              style={{
                border: "1px solid var(--surface-ink-soft)",
                borderRadius: "var(--radius-lg)",
                background: "var(--surface-ink)",
                padding: "0.75rem",
                display: "grid",
                gap: "0.65rem",
              }}
            >
              <div>{preview}</div>
              <div style={{ display: "grid", gap: "0.2rem", fontSize: "0.95rem" }}>
                <strong style={{ letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.85rem" }}>{token}</strong>
                <span style={{ color: "var(--text-medium)" }}>
                  Asset: <code style={{ color: "var(--text-high)" }}>{asset.id}</code>
                </span>
                {asset.path && (
                  <span style={{ color: "var(--text-medium)", wordBreak: "break-all" }}>
                    URL: <code style={{ color: "var(--text-high)" }}>{asset.path}</code>
                  </span>
                )}
                {layer.className && (
                  <span style={{ color: "var(--text-medium)" }}>
                    Class: <code style={{ color: "var(--text-high)" }}>{layer.className}</code>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
