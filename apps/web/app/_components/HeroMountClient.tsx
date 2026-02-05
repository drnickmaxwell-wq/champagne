"use client";

import { usePathname } from "next/navigation";
import { HeroRendererV2, type HeroRendererV2Props } from "../components/hero/v2/HeroRendererV2";

export function HeroMountClient(props: HeroRendererV2Props) {
  const pathname = usePathname() || "/";
  return <HeroRendererV2 {...props} pageSlugOrPath={pathname} />;
}
