import { HeroRenderer } from "../components/hero/HeroRenderer";
import {
  HeroContentV2,
  HeroRendererV2,
  HeroV2Frame,
  buildHeroV2Model,
  type HeroRendererV2Props,
} from "../components/hero/v2/HeroRendererV2";
import type { HeroRendererProps } from "../components/hero/HeroRenderer";
import { HeroContentFade, HeroSurfaceStackV2 } from "../components/hero/v2/HeroV2Client";

export async function HeroMount(props: HeroRendererProps) {
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;

  if (useV2) {
    const v2Props = props as HeroRendererV2Props;
    const model = await buildHeroV2Model(props);

    return (
      <HeroV2Frame
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
      >
        <HeroSurfaceStackV2
          model={model}
          surfaceRef={v2Props.surfaceRef}
          rootStyle={v2Props.rootStyle}
        />
        <HeroContentFade />
        <HeroContentV2 {...v2Props} />
      </HeroV2Frame>
    );
  }

  return <Renderer {...props} />;
}
