import { headers } from "next/headers";

import type { HeroRendererProps } from "../components/hero/HeroRenderer";
import { buildHeroV2Model } from "../components/hero/v2/buildHeroV2Model";
import type { HeroRendererV2Props } from "../components/hero/v2/HeroRendererV2";

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

    const { HeroRendererV2 } = await import("../components/hero/v2/HeroRendererV2");
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
        <HeroRendererV2
          {...v2PropsWithPath}
          initialModel={v2Model}
          initialPathname={pathnameKey}
        />
      </div>
    );
  }

  const { HeroRenderer } = await import("../components/hero/HeroRenderer");

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
      style={{ minHeight: "72vh" }}
    >
      <HeroRenderer {...props} />
    </div>
  );
}
