"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { prefetchHeroV2ModelForPath } from "../hero/v2/HeroRendererV2";

type NavPrefetchLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function NavPrefetchLink({ href, className, children }: NavPrefetchLinkProps) {
  const handlePrefetch = () => {
    const info = prefetchHeroV2ModelForPath(href);
    if (process.env.NODE_ENV !== "production") {
      console.info("HERO_V2_PREFETCH", { href, ...info });
    }
  };

  return (
    <Link href={href} className={className} onMouseEnter={handlePrefetch} onFocus={handlePrefetch}>
      {children}
    </Link>
  );
}
