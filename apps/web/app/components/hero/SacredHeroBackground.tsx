export function SacredHeroBackground() {
  return (
    <div className="sacred-hero-bg" aria-hidden data-hero-mode="sacred">
      <span
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "0.5rem",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-high)",
          opacity: 0.6,
          pointerEvents: "none",
          zIndex: 9,
        }}
      >
        Sacred Mode
      </span>
      <div className="hero-gradient-base" />
      <div className="hero-wave-caustics hero-motion-layer">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="/assets/champagne/motion/wave-caustics.webm" type="video/webm" />
        </video>
      </div>
      <div className="hero-glass-shimmer hero-motion-layer">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="/assets/champagne/motion/glass-shimmer.webm" type="video/webm" />
        </video>
      </div>
      <div className="hero-particles-drift hero-motion-layer">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="/assets/champagne/motion/particles-drift.webm" type="video/webm" />
        </video>
      </div>
      <div className="hero-gold-dust-drift hero-motion-layer">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="/assets/champagne/motion/gold-dust-drift.webm" type="video/webm" />
        </video>
      </div>
      <div className="hero-wave-mask" />
      <div className="hero-particles-static" />
      <div className="hero-film-grain" />
    </div>
  );
}
