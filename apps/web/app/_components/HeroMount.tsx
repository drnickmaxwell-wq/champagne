"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  HeroRendererV2,
  type HeroRendererV2Props,
} from "../components/hero/v2/HeroRendererV2";
import type { HeroMode } from "@champagne/hero";
import { getPageManifest } from "@champagne/manifests";
import { isBrandHeroEnabled } from "../featureFlags";

type HeroRouteInfo = {
  mode?: HeroMode;
  treatmentSlug?: string;
  pageCategory?: HeroRendererV2Props["pageCategory"];
};

const resolveHeroRouteInfo = (pathname: string): HeroRouteInfo => {
  const manifest = getPageManifest(pathname);

  if (pathname.startsWith("/treatments/")) {
    return {
      mode: "treatment",
      treatmentSlug: pathname.split("/")[2] || undefined,
      pageCategory: "treatment",
    };
  }

  if (pathname.startsWith("/team/")) {
    return { pageCategory: "profile" };
  }

  if (pathname === "/team") return { pageCategory: "utility" };
  if (pathname === "/about") return { pageCategory: "utility" };
  if (pathname === "/contact") return { pageCategory: "utility" };
  if (pathname === "/blog") return { pageCategory: "editorial" };
  if (pathname === "/treatments") return { pageCategory: "utility" };
  if (pathname === "/fees") return { pageCategory: "utility" };
  if (pathname === "/smile-gallery") return { pageCategory: "utility" };
  if (pathname === "/") return { pageCategory: "home" };

  return { pageCategory: (manifest as { category?: HeroRendererV2Props["pageCategory"] })?.category };
};

export function HeroMount() {
  const pathname = usePathname() ?? "/";
  const normalizedPathname = pathname.split("?")[0] || "/";
  const isPublicPage = !normalizedPathname.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const { mode, treatmentSlug, pageCategory } = useMemo(
    () => resolveHeroRouteInfo(normalizedPathname),
    [normalizedPathname],
  );

  if (!isPublicPage || !isHeroEnabled) {
    return null;
  }

  return (
    <div
      data-hero-engine={useV2 ? "v2" : "v1"}
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
    >
      <HeroRendererV2 mode={mode} treatmentSlug={treatmentSlug} pageCategory={pageCategory} />
    </div>
  );
}
