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
import { headers } from "next/headers";

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

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
    const headersList = await headers();
    const requestUrl = headersList.get("next-url") ?? "";
    let pathname = "/";
    let heroDebugEnabled = false;

    if (requestUrl) {
      try {
        const url = new URL(requestUrl, "http://localhost");
        pathname = url.pathname || "/";
        const heroDebugValue = url.searchParams.get("heroDebug");
        heroDebugEnabled =
          heroDebugValue === "1" || heroDebugValue === "true" || url.searchParams.has("heroDebug");
      } catch {
        pathname = requestUrl.split("?")[0] || "/";
        const query = requestUrl.split("?")[1] ?? "";
        const params = new URLSearchParams(query);
        const heroDebugValue = params.get("heroDebug");
        heroDebugEnabled = heroDebugValue === "1" || heroDebugValue === "true" || params.has("heroDebug");
      }
    }

    const v2Props = props as HeroRendererV2Props;
    const v2PropsWithPath = { ...v2Props, pageSlugOrPath: pathname };
    const v2Model = await buildHeroV2Model(v2PropsWithPath);
    const pathnameKey = normalizeHeroPathname(pathname);
    const heroIdentityKey =
      v2Model?.surfaceStack.variantId ??
      v2Model?.surfaceStack.heroId ??
      (v2Model?.surfaceStack.boundVariantId ? `binding:${v2Model.surfaceStack.boundVariantId}` : undefined) ??
      (v2PropsWithPath.pageCategory ? `category:${v2PropsWithPath.pageCategory}` : undefined);
    const heroDebugAttributes = heroDebugEnabled
      ? {
          "data-hero-pathname-key": pathnameKey,
          "data-hero-identity-key": heroIdentityKey ?? "",
          "data-hero-has-model": v2Model ? "1" : "0",
        }
      : {};
    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
        style={{ minHeight: "72vh" }}
        {...heroDebugAttributes}
      >
        {v2Model ? (
          <HeroV2Frame
            layout={v2Model.layout}
            gradient={v2Model.gradient}
            rootStyle={{ ...v2PropsWithPath.rootStyle, ...v2Model.surfaceStack.surfaceVars }}
            heroId={v2Model.surfaceStack.heroId}
            variantId={v2Model.surfaceStack.variantId}
            particlesPath={v2Model.surfaceStack.particlesPath}
            particlesOpacity={v2Model.surfaceStack.particlesOpacity}
            motionCount={v2Model.surfaceStack.motionLayers.length}
            prm={v2Model.surfaceStack.prmEnabled}
            debug={v2PropsWithPath.debug}
          >
            <HeroSurfaceStackV2
              surfaceRef={v2PropsWithPath.surfaceRef}
              {...v2Model.surfaceStack}
            />
            <HeroContentFade identityKey={heroIdentityKey}>
              <HeroContentV2 content={v2Model.content} layout={v2Model.layout} />
            </HeroContentFade>
          </HeroV2Frame>
        ) : (
          <HeroRendererV2 {...v2PropsWithPath} />
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
