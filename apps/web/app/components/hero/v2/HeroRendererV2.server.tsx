import { headers } from "next/headers";
import type { HeroRendererV2Props } from "./HeroRendererV2.types";
import { HeroContentV2, HeroFallback, HeroV2Frame } from "./HeroRendererV2.shared";
import { HeroContentFade, HeroSurfaceStackV2 } from "./HeroV2Client";
import { buildHeroV2Model } from "./buildHeroV2Model";

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export async function HeroRendererV2(props: HeroRendererV2Props) {
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
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

  const v2PropsWithPath = { ...props, pageSlugOrPath: pathname };
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
          <HeroSurfaceStackV2 surfaceRef={v2PropsWithPath.surfaceRef} {...v2Model.surfaceStack} />
          <HeroContentFade>
            <HeroContentV2 content={v2Model.content} layout={v2Model.layout} />
          </HeroContentFade>
        </HeroV2Frame>
      ) : (
        <HeroFallback />
      )}
    </div>
  );
}
