// app/preview/brand-lock/page.tsx — Runtime brand probe (read-only)
"use client";

import { useEffect, useRef, useState } from "react";

type Diagnostics = {
  gradient: string;
  waves: string;
  backgroundSize: string;
  backgroundPosition: string;
};

const normalizeGradient = (value: string) =>
  value
    .replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (_, r, g, b) => {
      const toHex = (channel: string) => {
        const hex = Number(channel).toString(16).padStart(2, "0");
        return hex.toUpperCase();
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    })
    .replace(/\s+/g, "");

export default function BrandLock() {
  const surfaceRef = useRef<HTMLElement | null>(null);
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const [liveDiagnostics, setLiveDiagnostics] = useState<Diagnostics | null>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const surfaceStyles = getComputedStyle(surface);

    const backgroundImage = surfaceStyles.backgroundImage;
    const gradientMatch = backgroundImage.match(/linear-gradient\([^)]*\)/i);
    const gradient = gradientMatch ? normalizeGradient(gradientMatch[0]) : "";

    const wavesField = backgroundImage.includes("wave-field.svg");
    const wavesDots = backgroundImage.includes("wave-dots.svg");
    const waves = wavesField && wavesDots
      ? "wave-field.svg + wave-dots.svg"
      : [wavesField ? "wave-field.svg" : null, wavesDots ? "wave-dots.svg" : null]
          .filter(Boolean)
          .join(" | ");

    console.log(`gradient=${gradient}`);
    console.log(`waves=${waves}`);
    console.log(`bgSize/Pos=${surfaceStyles.backgroundSize} | ${surfaceStyles.backgroundPosition}`);

    setLiveDiagnostics({
      gradient,
      waves,
      backgroundSize: surfaceStyles.backgroundSize,
      backgroundPosition: surfaceStyles.backgroundPosition,
    });
  }, [particlesEnabled]);

  const surfaceClassName = `champagne-surface champagne-surface-lux hero flex min-h-screen items-center justify-center p-6${
    particlesEnabled ? " particles" : ""
  }`;

  return (
    <main className="min-h-screen bg-[color:var(--smh-bg)] text-[color:var(--smh-text)]">
      <section ref={surfaceRef} className={surfaceClassName}>
        <div className="champagne-glass w-full max-w-2xl p-8">
          <h2 className="font-serif text-2xl">Brand lock diagnostics</h2>
          <p className="mt-2 text-sm opacity-80">
            Values below reflect live computed styles for the champagne surface stack.
          </p>
          <label className="mt-4 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={particlesEnabled}
              onChange={(event) => setParticlesEnabled(event.target.checked)}
            />
            Particles overlay
          </label>
          <div className="mt-6 space-y-2 font-mono text-sm">
            {liveDiagnostics ? (
              <>
                <p>gradient={liveDiagnostics.gradient}</p>
                <p>waves={liveDiagnostics.waves}</p>
                <p>
                  bgSize/Pos={liveDiagnostics.backgroundSize} | {liveDiagnostics.backgroundPosition}
                </p>
              </>
            ) : (
              <p aria-live="polite">Sampling surface…</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
