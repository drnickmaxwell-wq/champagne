import { getMainNavItems } from "@champagne/manifests";
import Link from "next/link";

export function Header() {
  const navItems = getMainNavItems();

  return (
    <header className="border-b border-neutral-800 bg-neutral-900/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-50">
          St Mary&apos;s House Dental
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 transition hover:bg-neutral-800 hover:text-neutral-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
