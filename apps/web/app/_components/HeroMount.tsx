import { headers } from "next/headers";
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
import { HeroOverlayContent } from "./HeroOverlayContent";
import { resolveHeroOverlay } from "./heroOverlay";

export async function HeroMount(props: HeroRendererProps) {
  const headersList = await headers();
  const requestUrl = headersList.get("next-url") ?? "";
  const pathname = (requestUrl.split("?")[0] || "/") || "/";
  const debugEnabled = requestUrl.includes("heroDebug=1") || pathname.startsWith("/champagne/hero-debug");
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;
  const overlay = await resolveHeroOverlay({
    pathname,
    mode: props.mode,
    treatmentSlug: props.treatmentSlug,
    pageCategory: props.pageCategory,
  });
  const shouldRenderOverlay = Boolean(
    overlay.content.headline ||
      overlay.content.subheadline ||
      overlay.content.eyebrow ||
      overlay.content.cta ||
      overlay.content.secondaryCta,
  );

  if (useV2) {
    const v2Props = props as HeroRendererV2Props;
    const model = await buildHeroV2Model(props);

    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
        style={{ position: "relative" }}
      >
        {shouldRenderOverlay ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .hero-renderer .hero-content,
                .hero-renderer-v2 .hero-content {
                  display: none !important;
                }
              `,
            }}
          />
        ) : null}
        {model ? (
          <HeroV2Frame layout={model.layout} gradient={model.gradient} rootStyle={v2Props.rootStyle}>
            <HeroSurfaceStackV2 surfaceRef={props.surfaceRef} {...model.surfaceStack} />
            {shouldRenderOverlay ? (
              <HeroOverlayContent
                content={overlay.content}
                layout={overlay.layout}
                source={overlay.source}
                debugEnabled={debugEnabled}
                debugPayload={{ source: overlay.source, content: overlay.content, debug: overlay.debug }}
              />
            ) : (
              <HeroContentFade>
                <HeroContentV2 content={model.content} layout={model.layout} />
              </HeroContentFade>
            )}
          </HeroV2Frame>
        ) : (
          <>
            <HeroRendererV2 {...props} />
            {shouldRenderOverlay ? (
              <HeroOverlayContent
                content={overlay.content}
                layout={overlay.layout}
                source={overlay.source}
                debugEnabled={debugEnabled}
                debugPayload={{ source: overlay.source, content: overlay.content, debug: overlay.debug }}
              />
            ) : null}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
      style={{ position: "relative" }}
    >
      {shouldRenderOverlay ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .hero-renderer .hero-content {
                display: none !important;
              }
            `,
          }}
        />
      ) : null}
      <Renderer {...props} />
      {shouldRenderOverlay ? (
        <HeroOverlayContent
          content={overlay.content}
          layout={overlay.layout}
          source={overlay.source}
          debugEnabled={debugEnabled}
          debugPayload={{ source: overlay.source, content: overlay.content, debug: overlay.debug }}
        />
      ) : null}
    </div>
  );
}
