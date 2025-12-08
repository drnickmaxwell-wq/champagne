import Link from "next/link";

const treatments = [
  { slug: "dental-implants", name: "Dental Implants" },
  { slug: "clear-aligners", name: "Clear aligner orthodontics (Spark and other systems)" },
  { slug: "smile-makeovers", name: "Smile Makeovers" },
  { slug: "teeth-whitening", name: "Teeth Whitening" },
  { slug: "3d-dentistry-scanning", name: "3D Dentistry & Scanning" },
];

export default function TreatmentsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Treatments</p>
        <h1 className="text-3xl font-semibold text-neutral-50">Explore our care options</h1>
        <p className="max-w-2xl text-neutral-300">
          A snapshot of the services planned for St Mary&apos;s House Dental. Select a treatment to learn more.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {treatments.map((treatment) => (
          <Link
            key={treatment.slug}
            href={`/treatments/${treatment.slug}`}
            className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700 hover:bg-neutral-900"
          >
            <p className="text-lg font-semibold text-neutral-50">{treatment.name}</p>
            <p className="text-sm text-neutral-300">Learn more about {treatment.name.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
