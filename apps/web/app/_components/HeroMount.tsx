import { HeroRenderer } from "../components/hero/HeroRenderer";
import {
  HeroContentV2,
  HeroRendererV2,
  HeroV2Frame,
  type HeroRendererV2Props,
} from "../components/hero/v2/HeroRendererV2";
import { buildHeroV2Model } from "../components/hero/v2/buildHeroV2Model";
import { HeroContentFade, HeroSurfaceStackV2 } from "../components/hero/v2/HeroV2Client";
import type { HeroRendererProps } from "../components/hero/HeroRenderer";

export async function HeroMount(props: HeroRendererProps) {
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const rawPersistFlag = process.env.NEXT_PUBLIC_HERO_V2_PERSIST;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const normalizedPersistFlag = (rawPersistFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const usePersist = normalizedPersistFlag === "1";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;

  if (useV2) {
    const v2Props = props as HeroRendererV2Props;
    const v2Model = await buildHeroV2Model(v2Props);
    if (usePersist) {
      return (
        <div
          data-hero-engine="v2"
          data-hero-flag={rawFlag ?? ""}
          data-hero-flag-normalized={normalized}
          style={{ minHeight: "72vh" }}
        >
          <HeroRendererV2
            {...v2Props}
            initialModel={v2Model}
            initialPathnameKey={v2Props.pageSlugOrPath}
          />
        </div>
      );
    }
    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
        style={{ minHeight: "72vh" }}
      >
        {v2Model ? (
          <HeroV2Frame
            layout={v2Model.layout}
            gradient={v2Model.gradient}
            rootStyle={{ ...v2Props.rootStyle, ...v2Model.surfaceStack.surfaceVars }}
            heroId={v2Model.surfaceStack.heroId}
            variantId={v2Model.surfaceStack.variantId}
            particlesPath={v2Model.surfaceStack.particlesPath}
            particlesOpacity={v2Model.surfaceStack.particlesOpacity}
            motionCount={v2Model.surfaceStack.motionLayers.length}
            prm={v2Model.surfaceStack.prmEnabled}
            debug={v2Props.debug}
          >
            <HeroSurfaceStackV2 surfaceRef={v2Props.surfaceRef} {...v2Model.surfaceStack} />
            <HeroContentFade>
              <HeroContentV2 content={v2Model.content} layout={v2Model.layout} />
            </HeroContentFade>
          </HeroV2Frame>
        ) : (
          <HeroRendererV2 {...v2Props} />
        )}
      </div>
    );
  }

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
      style={{ minHeight: "72vh" }}
    >
      <Renderer {...props} />
    </div>
  );
}
