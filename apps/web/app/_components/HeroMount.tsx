import { HeroRenderer, type HeroRendererProps } from "../components/hero/HeroRenderer";
import { HeroRendererV2 } from "../components/hero/v2/HeroRendererV2";

const resolveHeroEngine = () => (process.env.NEXT_PUBLIC_HERO_ENGINE === "v2" ? "v2" : "v1");

export async function HeroMount(props: HeroRendererProps) {
  const engine = resolveHeroEngine();
  const Renderer = engine === "v2" ? HeroRendererV2 : HeroRenderer;

  return (
    <div data-hero-engine={engine}>
      <Renderer {...props} />
    </div>
  );
}
