export function PlaceholderHero() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <div className="wave-mask-placeholder" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Champagne-core hero placeholder
        </h1>
        <p className="max-w-xl text-center text-sm text-neutral-300">
          This is a simple structural stub for the future Champagne hero. No gradients, no
          motion, just a safe canvas to plug the real design into later.
        </p>
      </div>
    </section>
  );
}