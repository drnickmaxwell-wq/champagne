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
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
      >
        {model ? (
          <HeroV2Frame layout={model.layout} gradient={model.gradient} rootStyle={v2Props.rootStyle}>
            <HeroSurfaceStackV2 surfaceRef={props.surfaceRef} {...model.surfaceStack} />
            <HeroContentFade>
              <HeroContentV2 content={model.content} layout={model.layout} />
            </HeroContentFade>
          </HeroV2Frame>
        ) : (
          <HeroRendererV2 {...props} />
        )}
      </div>
    );
  }

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
    >
      <Renderer {...props} />
    </div>
  );
}
