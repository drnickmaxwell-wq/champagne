"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HeroRenderer, type HeroRendererProps } from "../components/hero/HeroRenderer";
import { HeroRendererV2 } from "../components/hero/v2/HeroRendererV2";

export function HeroMount() {
  const pathname = usePathname() ?? "/";
  const instanceId = useRef(`hero-mount-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const id = instanceId.current;
    console.info("HERO_MOUNT_PERSIST_PROOF", { id });
    return () => {
      console.info("HERO_MOUNT_UNMOUNT_PROOF", { id });
    };
  }, []);

  let pageCategory: HeroRendererProps["pageCategory"];
  let mode: HeroRendererProps["mode"];
  let treatmentSlug: string | undefined;

  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (pathname === "/treatments") {
    pageCategory = "utility";
  } else if (pathname === "/fees") {
    pageCategory = "utility";
  } else if (pathname === "/smile-gallery") {
    pageCategory = "utility";
  } else if (pathname === "/") {
    pageCategory = "home";
  }

  const resolvedProps: HeroRendererProps = {
    mode,
    treatmentSlug,
    pageCategory,
  };
  const rawFlag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const normalized = (rawFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const useV2 = normalized === "v2";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;

  if (useV2) {
    return (
      <div
        data-hero-engine="v2"
        data-hero-flag={rawFlag ?? ""}
        data-hero-flag-normalized={normalized}
      >
        <HeroRendererV2 {...resolvedProps} />
      </div>
    );
  }

  return (
    <div
      data-hero-engine="v1"
      data-hero-flag={rawFlag ?? ""}
      data-hero-flag-normalized={normalized}
    >
      <Renderer {...resolvedProps} />
    </div>
  );
}
