import { PlaceholderHero } from "../components/PlaceholderHero";

export default function TestPage() {
  return (
    <main className="flex min-h-screen flex-col gap-12 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Web App Visual Test</h1>
        <span className="text-xs text-neutral-400">/test route</span>
      </header>

      <PlaceholderHero />

      <section className="mx-auto max-w-2xl space-y-2 text-sm text-neutral-300">
        <p>
          This test page exists purely to confirm that the base layout, placeholder hero,
          and wave-mask layer render correctly in a running Next.js 15 app.
        </p>
        <p>
          When you integrate the real Champagne hero and token system, this page can be
          reused as a safe playground for visual checks.
        </p>
      </section>
    </main>
  );
}