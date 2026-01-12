"use client";

import { useEffect } from "react";
import type { HeroRendererProps } from "../components/hero/HeroRenderer";
import { HeroRenderer } from "../components/hero/HeroRenderer";
import { HeroRendererV2 } from "../components/hero/v2/HeroRendererV2";

export function HeroMount(props: HeroRendererProps) {
  const flag = process.env.NEXT_PUBLIC_HERO_ENGINE;
  const useV2 = flag === "v2";
  const Renderer = useV2 ? HeroRendererV2 : HeroRenderer;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[HeroMount] engine=${useV2 ? "v2" : "v1"}`);
    }
  }, [useV2]);

  return (
    <div data-hero-engine={useV2 ? "v2" : "v1"}>
      <Renderer {...props} />
    </div>
  );
}
