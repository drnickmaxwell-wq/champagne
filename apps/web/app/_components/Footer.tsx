export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-neutral-900/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-sm text-neutral-300">
        <p>© {currentYear} St Mary&apos;s House Dental. All rights reserved.</p>
        <p className="text-neutral-400">Champagne Ecosystem – neutral skeleton build.</p>
      </div>
    </footer>
  );
}
