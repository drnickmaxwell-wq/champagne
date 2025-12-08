import PreviewChampagneCTA from "@/components/preview/shared/PreviewChampagneCTA";
import type { HeroSchema } from "@/lib/champagne/hero-schema";

type HeroCTABarProps = {
  cta: HeroSchema["cta"];
  toneVariant?: "ink-on-light" | "ink-on-dark";
};

export function HeroCTABar({ cta, toneVariant = "ink-on-light" }: HeroCTABarProps) {
  const toneClass = toneVariant === "ink-on-dark" ? "cta-tone--ink-on-dark" : "cta-tone--ink-on-light";

  return (
    <div className={`hero-cta-plate cta-plate-glass-dusk ${toneClass}`}>
      <div className="hero-cta-row">
        {cta.primaryLabel ? (
          <PreviewChampagneCTA
            ariaLabel={cta.primaryLabel}
            className={cta.primary}
            href={cta.primaryHref ?? "/contact"}
          >
            {cta.primaryLabel}
          </PreviewChampagneCTA>
        ) : null}

        {cta.secondaryLabel ? (
          <PreviewChampagneCTA
            ariaLabel={cta.secondaryLabel}
            className={cta.secondary}
            href={cta.secondaryHref ?? "/treatments"}
            variant="secondary"
          >
            {cta.secondaryLabel}
          </PreviewChampagneCTA>
        ) : null}
      </div>
    </div>
  );
}
