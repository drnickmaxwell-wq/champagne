import Link from "next/link";
import { BaseChampagneSurface } from "@champagne/hero";
import { getTreatmentPages } from "@champagne/manifests";

import { HeroRenderer } from "../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../featureFlags";

const FAMILY_LABELS: Record<string, string> = {
  implants: "Implants",
  whitening: "Whitening",
  "3d-tech": "3D & tech",
  aligners: "Orthodontics & aligners",
  comfort: "Comfort & anxiety care",
  other: "More care options",
};

const FAMILY_ORDER = ["implants", "whitening", "3d-tech", "aligners", "comfort", "other"];

function inferFamily(slug: string) {
  if (slug.startsWith("implants")) return "implants";
  if (slug.includes("whitening")) return "whitening";
  if (slug === "clear-aligners" || slug === "orthodontics") return "aligners";
  if (slug.startsWith("3d-") || slug.includes("3d-")) return "3d-tech";
  if (slug.startsWith("cbct")) return "3d-tech";
  if (slug === "digital-smile-design") return "3d-tech";
  if (slug.includes("painless-numbing")) return "comfort";
  return "other";
}

function buildDescription(label?: string) {
  if (!label) return "Explore this treatment.";
  return `Learn more about ${label.toLowerCase()}.`;
}

export default function TreatmentsPage() {
  const isHeroEnabled = isBrandHeroEnabled();
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

  const cardStyle = {
    display: "grid",
    gap: "0.35rem",
    padding: "1rem 1.1rem",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--champagne-keyline-gold, rgba(255,215,137,0.22))",
    background: "linear-gradient(145deg, rgba(12,15,22,0.8), rgba(8,9,14,0.76))",
  } as const;

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8 px-2 sm:px-0">
      {isHeroEnabled && <HeroRenderer mode="treatment" pageCategory="treatment" />}

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Treatments</p>
        <h1 className="text-3xl font-semibold text-neutral-50">Clinical care, mapped to the canon</h1>
        <p className="max-w-3xl text-neutral-300">
          Browse the current Champagne treatment set. Each page is powered by the manifest canon and routes into the Champagne builder experience.
        </p>
      </header>

      <BaseChampagneSurface
        variant="inkGlass"
        className="border border-neutral-800/70 shadow-lg"
        style={{ background: "linear-gradient(145deg, rgba(12,15,22,0.9), rgba(8,9,14,0.82))", padding: "1.5rem 1.75rem" }}
      >
        <div className="space-y-8">
          {orderedGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-[0.8rem] uppercase tracking-[0.18em] text-neutral-400">{group.items.length} pages</p>
                  <h2 className="text-xl font-semibold text-neutral-50">{group.label}</h2>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((treatment) => (
                  <BaseChampagneSurface key={treatment.slug} variant="glass" className="h-full">
                    <Link
                      href={`/treatments/${treatment.slug}`}
                      className="group block h-full"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div style={cardStyle} className="transition hover:-translate-y-0.5">
                        <p className="text-lg font-semibold text-neutral-50 group-hover:text-white">
                          {treatment.label ?? treatment.slug.replace(/-/g, " ")}
                        </p>
                        <p className="text-sm text-neutral-300">{buildDescription(treatment.label)}</p>
                      </div>
                    </Link>
                  </BaseChampagneSurface>
                ))}
              </div>
            </section>
          ))}
        </div>
      </BaseChampagneSurface>
    </div>
  );
}
