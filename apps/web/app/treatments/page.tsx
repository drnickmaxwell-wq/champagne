import Link from "next/link";
import { BaseChampagneSurface } from "@champagne/hero";
import { getTreatmentPages } from "@champagne/manifests";

const FAMILY_LABELS: Record<string, string> = {
  implants: "Implants",
  whitening: "Whitening",
  "3d-tech": "3D & tech",
  aligners: "Orthodontics & aligners",
  other: "More care options",
};

const FAMILY_ORDER = ["implants", "whitening", "3d-tech", "aligners", "other"];

function inferFamily(slug: string) {
  if (slug.startsWith("implants")) return "implants";
  if (slug.includes("whitening")) return "whitening";
  if (slug === "clear-aligners" || slug === "orthodontics") return "aligners";
  if (slug.startsWith("3d-") || slug.includes("3d-")) return "3d-tech";
  if (slug.startsWith("cbct")) return "3d-tech";
  if (slug === "digital-smile-design") return "3d-tech";
  return "other";
}

function buildDescription(label?: string) {
  if (!label) return "Explore this treatment.";
  return `Explore ${label.toLowerCase()}.`;
}

export default function TreatmentsPage() {
  const treatments = getTreatmentPages();
  const grouped = treatments.reduce<Record<string, typeof treatments>>((acc, treatment) => {
    const key = inferFamily(treatment.slug);
    acc[key] = acc[key] ? [...acc[key], treatment] : [treatment];
    return acc;
  }, {});

  const orderedGroups = FAMILY_ORDER.map((key) => ({
    key,
    label: FAMILY_LABELS[key],
    items: (grouped[key] ?? []).sort((a, b) => (a.label ?? a.slug).localeCompare(b.label ?? b.slug)),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      <header className="space-y-2 px-2 sm:px-0">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Treatments</p>
        <h1 className="text-3xl font-semibold text-neutral-50">Clinical care, mapped to the canon</h1>
        <p className="max-w-3xl text-neutral-300">
          Browse the current Champagne treatment set. Each page is powered by the manifest canon and routes into the
          Champagne builder experience.
        </p>
      </header>

      <BaseChampagneSurface
        variant="inkGlass"
        className="border border-neutral-800/70 p-6 shadow-lg sm:p-8"
        style={{ background: "linear-gradient(145deg, rgba(12,15,22,0.9), rgba(8,9,14,0.8))" }}
      >
        <div className="space-y-8">
          {orderedGroups.map((group) => (
            <section key={group.key} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold text-neutral-50">{group.label}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">{group.items.length} pages</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((treatment) => (
                  <Link
                    key={treatment.slug}
                    href={`/treatments/${treatment.slug}`}
                    className="group rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5 transition hover:border-neutral-700 hover:bg-neutral-900/70"
                  >
                    <p className="text-lg font-semibold text-neutral-50">{treatment.label ?? treatment.slug}</p>
                    <p className="text-sm text-neutral-300">{buildDescription(treatment.label)}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </BaseChampagneSurface>
    </div>
  );
}
