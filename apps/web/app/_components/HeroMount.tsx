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

    let model: Awaited<ReturnType<typeof buildHeroV2Model>> = null;

    try {
      model = await buildHeroV2Model({
        mode: v2Props.mode,
        treatmentSlug: v2Props.treatmentSlug,
        pageSlugOrPath: v2Props.pageSlugOrPath ?? "/",
        debug: v2Props.debug,
        prm: v2Props.prm,
        timeOfDay: v2Props.timeOfDay,
        particles: v2Props.particles,
        filmGrain: v2Props.filmGrain,
        diagnosticBoost: v2Props.diagnosticBoost,
        pageCategory: v2Props.pageCategory,
        glueVars: v2Props.glueVars,
      });
    } catch {
      model = null;
    }

    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
      >
        {model ? (
          <HeroV2Frame
            layout={model.layout}
            gradient={model.gradient}
            rootStyle={{ ...v2Props.rootStyle, ...model.surfaceStack.surfaceVars }}
            heroId={model.surfaceStack.heroId}
            variantId={model.surfaceStack.variantId}
            particlesPath={model.surfaceStack.particlesPath}
            particlesOpacity={model.surfaceStack.particlesOpacity}
            motionCount={model.surfaceStack.motionLayers?.length ?? 0}
            prm={model.surfaceStack.prmEnabled}
            debug={Boolean(v2Props.debug)}
          >
            <HeroSurfaceStackV2 surfaceRef={v2Props.surfaceRef} {...model.surfaceStack} />
            <HeroContentFade>
              <HeroContentV2 content={model.content} layout={model.layout} />
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
    >
      <Renderer {...props} />
    </div>
  );
}
