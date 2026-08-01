"use client";

import { getMainNavItems } from "@champagne/manifests";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

function StableNavigationLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function Header() {
  const navItems = getMainNavItems();
  const headerStyle = {
    borderBottom: "1px solid color-mix(in srgb, var(--bg-ink) 72%, transparent)",
    background: "color-mix(in srgb, var(--bg-ink) 85%, transparent)",
  } as const;

  return (
    <header className="border-b" style={headerStyle}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <StableNavigationLink
            href="/"
            className="text-lg font-semibold tracking-tight text-[var(--text-high)]"
          >
            St Mary&apos;s House Dental
          </StableNavigationLink>
          <p className="mt-1 text-xs text-[var(--text-medium)]">Private dental care in Shoreham-by-Sea</p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-[var(--text-medium)]">
          {navItems.map((item) => (
            <StableNavigationLink
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 transition-none hover:bg-[color-mix(in_srgb,var(--bg-ink)_82%,transparent)] hover:text-[var(--text-high)]"
            >
              {item.label}
            </StableNavigationLink>
          ))}
          <StableNavigationLink
            href="/contact"
            className="rounded-full border border-[color:var(--border-subtle)] px-3 py-1.5 text-[var(--text-high)] transition-none hover:bg-[color-mix(in_srgb,var(--bg-ink)_82%,transparent)]"
          >
            Arrange a consultation
          </StableNavigationLink>
        </nav>
      </div>
    </header>
  );
}
