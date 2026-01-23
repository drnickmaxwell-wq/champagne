"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { getPageManifest } from "@champagne/manifests";
import type { HeroMode } from "@champagne/hero";
import { HeroRenderer } from "../components/hero/HeroRenderer";
import { HeroRendererV2, type HeroRendererV2Props } from "../components/hero/v2/HeroRendererV2";
import type { HeroRendererProps } from "../components/hero/HeroRenderer";

export function HeroMount(props: HeroRendererProps) {
  const pathname = usePathname() ?? "/";
  const normalizedPathname = useMemo(() => {
    const trimmed = pathname.trim();
    if (!trimmed) return "/";
    const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
    if (!normalized) return "/";
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }, [pathname]);
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;
  const isPublicPage = !normalizedPathname.startsWith("/champagne/");
  const manifest = getPageManifest(normalizedPathname);

  const { mode, treatmentSlug, pageCategory } = useMemo(() => {
    let resolvedMode: HeroMode | undefined;
    let resolvedTreatmentSlug: string | undefined;
    let resolvedPageCategory: string | undefined;

    if (normalizedPathname.startsWith("/treatments/")) {
      resolvedMode = "treatment";
      resolvedTreatmentSlug = normalizedPathname.split("/")[2] || undefined;
      resolvedPageCategory = "treatment";
    } else if (normalizedPathname.startsWith("/team/")) {
      resolvedPageCategory = "profile";
    } else if (normalizedPathname === "/team") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/about") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/contact") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/blog") {
      resolvedPageCategory = "editorial";
    } else if (normalizedPathname === "/treatments") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/fees") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/smile-gallery") {
      resolvedPageCategory = "utility";
    } else if (normalizedPathname === "/") {
      resolvedPageCategory = "home";
    } else {
      resolvedPageCategory = (manifest as { category?: string })?.category;
    }

    return {
      mode: resolvedMode,
      treatmentSlug: resolvedTreatmentSlug,
      pageCategory: resolvedPageCategory,
    };
  }, [manifest, normalizedPathname]);

  if (!isPublicPage) {
    return null;
  }

  if (useV2) {
    const v2Props = {
      ...props,
      mode,
      treatmentSlug,
      pageCategory,
    } as HeroRendererV2Props;
    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
      >
        <HeroRendererV2 {...v2Props} />
      </div>
    );
  }

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
    >
      <Renderer {...props} mode={mode} treatmentSlug={treatmentSlug} pageCategory={pageCategory} />
    </div>
  );
}
