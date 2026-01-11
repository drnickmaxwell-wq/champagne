export function SacredHeroBackground() {
  return (
    <div className="sacred-hero-bg" aria-hidden>
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
