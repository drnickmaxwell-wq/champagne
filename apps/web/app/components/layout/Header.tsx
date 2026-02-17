import { getMainNavItems } from "@champagne/manifests";
import Link from "next/link";

export function Header() {
  const navItems = getMainNavItems();
  const headerStyle = {
    borderBottom: "1px solid var(--bg-ink)",
    background: "var(--bg-ink)",
  } as const;

  return (
    <header className="border-b" style={headerStyle}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text-high)]">
          St Mary&apos;s House Dental
        </Link>
        <nav className="flex items-center gap-4 text-sm text-[var(--text-medium)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 transition-none hover:bg-[color-mix(in_srgb,var(--bg-ink)_82%,transparent)] hover:text-[var(--text-high)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
