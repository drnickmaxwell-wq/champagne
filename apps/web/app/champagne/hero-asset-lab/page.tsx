import { ensureHeroAssetPath, getHeroRuntime } from "@champagne/hero";

const loopComparisons = [
  {
    id: "wave-caustics",
    title: "Rounded turquoise waves",
    original: "/assets/champagne/motion/wave-caustics.webm",
    corrected: "/assets/champagne/motion/wave-caustics-seamless.webm",
  },
  {
    id: "gold-dust-drift",
    title: "Gold particles",
    original: "/assets/champagne/motion/gold-dust-drift.webm",
    corrected: "/assets/champagne/motion/gold-dust-drift-seamless.webm",
  },
] as const;

const synchronizedLoopScript = `(() => {
  const videos = Array.from(document.querySelectorAll('[data-loop-video]'));
  const restart = document.querySelector('[data-loop-restart]');
  const toggle = document.querySelector('[data-loop-toggle]');
  const counters = new Map();
  let playing = true;

  videos.forEach((video) => {
    counters.set(video, { loops: 0, previousTime: 0 });
    video.addEventListener('timeupdate', () => {
      const state = counters.get(video);
      if (!state) return;
      if (video.currentTime + 0.25 < state.previousTime) {
        state.loops += 1;
        const output = document.querySelector('[data-loop-count="' + video.dataset.loopVideo + '"]');
        if (output) output.textContent = String(state.loops);
      }
      state.previousTime = video.currentTime;
    });
  });

  const restartAll = async () => {
    videos.forEach((video) => {
      const state = counters.get(video);
      if (state) {
        state.loops = 0;
        state.previousTime = 0;
      }
      video.currentTime = 0;
      const output = document.querySelector('[data-loop-count="' + video.dataset.loopVideo + '"]');
      if (output) output.textContent = '0';
    });
    playing = true;
    if (toggle) toggle.textContent = 'Pause all';
    await Promise.allSettled(videos.map((video) => video.play()));
  };

  restart?.addEventListener('click', restartAll);
  toggle?.addEventListener('click', async () => {
    if (playing) {
      videos.forEach((video) => video.pause());
      playing = false;
      toggle.textContent = 'Play all';
      return;
    }
    await Promise.allSettled(videos.map((video) => video.play()));
    playing = true;
    toggle.textContent = 'Pause all';
  });

  restartAll();
})();`;

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

      <section
        aria-labelledby="loop-seam-title"
        style={{
          display: "grid",
          gap: "1rem",
          border: "1px solid var(--surface-ink-soft)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-ink)",
          padding: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            Isolated loop-seam demonstrator
          </p>
          <h2 id="loop-seam-title" style={{ fontSize: "clamp(1.45rem, 2vw, 1.9rem)" }}>
            Original hard loop versus corrected continuous loop
          </h2>
          <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.5 }}>
            All four clips start together. Let them run through several numbered loops and compare each left-hand reset with the
            corrected version on the right. No Hero styling, lighting or runtime behaviour is changed here.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
            <button type="button" data-loop-restart>
              Restart together
            </button>
            <button type="button" data-loop-toggle>
              Pause all
            </button>
          </div>
        </div>

        {loopComparisons.map((comparison) => (
          <article key={comparison.id} style={{ display: "grid", gap: "0.7rem" }}>
            <h3 style={{ fontSize: "1.1rem" }}>{comparison.title}</h3>
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              }}
            >
              {([
                ["original", comparison.original],
                ["corrected", comparison.corrected],
              ] as const).map(([version, source]) => {
                const videoId = `${comparison.id}-${version}`;
                return (
                  <figure key={version} style={{ margin: 0, display: "grid", gap: "0.45rem" }}>
                    <video
                      src={source}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="auto"
                      data-loop-video={videoId}
                      aria-label={`${comparison.title}: ${version} loop`}
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-ink)",
                      }}
                    />
                    <figcaption style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                      <strong style={{ textTransform: "capitalize" }}>{version}</strong>
                      <span style={{ color: "var(--text-medium)" }}>
                        Loops: <output data-loop-count={videoId}>0</output>
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <script dangerouslySetInnerHTML={{ __html: synchronizedLoopScript }} />

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
