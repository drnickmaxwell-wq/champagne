import { getMainNavItems } from "@champagne/manifests";
import { NavPrefetchLink } from "./NavPrefetchLink";

export function Header() {
  const navItems = getMainNavItems();
  const headerStyle = {
    borderBottom: "1px solid color-mix(in srgb, var(--bg-ink) 72%, transparent)",
    background: "color-mix(in srgb, var(--bg-ink) 78%, transparent)",
  } as const;

  return (
    <header className="border-b" style={headerStyle}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <NavPrefetchLink href="/" className="text-lg font-semibold tracking-tight text-[var(--text-high)]">
          St Mary&apos;s House Dental
        </NavPrefetchLink>
        <nav className="flex items-center gap-4 text-sm text-[var(--text-medium)]">
          {navItems.map((item) => (
            <NavPrefetchLink
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 transition hover:bg-[color-mix(in_srgb,var(--bg-ink)_82%,transparent)] hover:text-[var(--text-high)]"
            >
              {item.label}
            </NavPrefetchLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
