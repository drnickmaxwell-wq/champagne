import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
      <h1 className="text-4xl font-semibold text-neutral-50">Page not found</h1>
      <p className="text-neutral-300">
        We couldn&apos;t find the page you were looking for. Use the links below to continue exploring the site.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/"
          className="rounded-md border border-neutral-800 px-4 py-2 font-medium text-neutral-100 transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          Return home
        </Link>
        <Link
          href="/treatments"
          className="rounded-md border border-neutral-800 px-4 py-2 font-medium text-neutral-100 transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          View treatments
        </Link>
      </div>
    </div>
  );
}
