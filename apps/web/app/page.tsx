import Link from "next/link";

const quickLinks = [
  {
    title: "Treatments",
    description: "Explore the full range of restorative and cosmetic care we offer.",
    href: "/treatments",
  },
  {
    title: "Patient stories",
    description: "Hear how we support patients on their journey (coming soon).",
    href: "#",
  },
  {
    title: "Patient portal",
    description: "Manage appointments, forms, and communication in one place.",
    href: "/patient-portal",
  },
];

export default function Page() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">St Mary&apos;s House Dental</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-50 sm:text-5xl">
          High-quality dental care in a calm, modern setting.
        </h1>
        <p className="max-w-2xl text-lg text-neutral-300">
          This neutral shell previews the future Champagne Ecosystem site for St Mary&apos;s House Dental.
          Everything here is placeholder content while we prepare the full experience.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-50">Quick links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-neutral-50">{link.title}</p>
                  <p className="text-sm text-neutral-300">{link.description}</p>
                </div>
                <span className="text-neutral-500 transition group-hover:text-neutral-200">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
