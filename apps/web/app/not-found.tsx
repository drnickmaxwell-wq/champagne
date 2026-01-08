import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
      <h1 className="text-4xl font-semibold text-[var(--text-high)]">Page not found</h1>
      <p className="text-[var(--text-medium)]">
        We couldn&apos;t find the page you were looking for. Use the links below to continue exploring the site.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/"
          className="rounded-md border border-[color-mix(in_srgb,var(--text-high)_28%,transparent)] px-4 py-2 font-medium text-[var(--text-high)] transition hover:border-[color-mix(in_srgb,var(--text-high)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-ink)_70%,transparent)]"
        >
          Return home
        </Link>
        <Link
          href="/treatments"
          className="rounded-md border border-[color-mix(in_srgb,var(--text-high)_28%,transparent)] px-4 py-2 font-medium text-[var(--text-high)] transition hover:border-[color-mix(in_srgb,var(--text-high)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-ink)_70%,transparent)]"
        >
          View treatments
        </Link>
      </div>
    </div>
  );
}
