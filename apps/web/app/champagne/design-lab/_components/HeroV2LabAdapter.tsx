import { HeroMount } from "../../../_components/HeroMount";

export function HeroV2LabAdapter({ route }: { route: string }) {
  const treatmentSlug = route.startsWith("/treatments/") ? route.slice("/treatments/".length) : undefined;
  return (
    <div data-design-lab-hero-adapter="canonical-v2" data-source-route={route}>
      <HeroMount
        mode={route === "/" ? "home" : "treatment"}
        treatmentSlug={treatmentSlug}
        pageCategory={route === "/" ? "home" : "treatment"}
      />
    </div>
  );
}
