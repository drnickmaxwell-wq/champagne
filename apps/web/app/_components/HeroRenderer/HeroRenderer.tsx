import { BaseChampagneSurface, getHeroRuntime } from "@champagne/hero";

import type { HeroRendererProps } from "../../components/hero/HeroRenderer";
import { HeroRenderer as CanonicalHeroRenderer } from "../../components/hero/HeroRenderer";

export function HeroRenderer(props: HeroRendererProps) {
  void BaseChampagneSurface;
  void getHeroRuntime;

  return <CanonicalHeroRenderer {...props} />;
}
