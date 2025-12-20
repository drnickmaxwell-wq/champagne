import Link from "next/link";
import { BaseChampagneSurface } from "@champagne/hero";
import { champagneMachineManifest, getPageManifest, getTreatmentPages } from "@champagne/manifests";
import type { ChampagneTreatmentPage } from "@champagne/manifests";
import { ChampagneSectionRenderer, getSectionStack } from "@champagne/sections";

import { HeroRenderer } from "../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../featureFlags";

type PageSearchParams = { [key: string]: string | string[] | undefined };

function hasHeroDebug(searchParams?: PageSearchParams) {
  const value = searchParams?.heroDebug;

  if (Array.isArray(value)) {
    return value.some((entry) => entry && entry !== "0");
  }

  return Boolean(value && value !== "0");
}

async function resolveHeroDebug(searchParams?: Promise<PageSearchParams>) {
  const resolved = searchParams ? await searchParams : undefined;
  return hasHeroDebug(resolved);
}

function getDirectoryGroupsFromManifest(): DirectoryGroup[] {
  const hubManifest = getPageManifest("/treatments");
  const groups = (hubManifest?.directoryGroups ?? []) as DirectoryGroup[];

  if (groups.length > 0) return groups;

  return treatmentGroups
    .filter((group) => group.showOnHub !== false)
    .map((group) => ({ groupId: group.id, label: group.label, hub: group.hub, description: group.description }));
}

function resolveTreatmentSlug(slugOrPath: string) {
  return slugOrPath.replace("/treatments/", "");
}

function buildDescription(label?: string) {
  if (!label) return "Explore this treatment.";
  return `Learn more about ${label.toLowerCase()}.`;
}

type TreatmentGroupConfig = {
  id: string;
  label: string;
  hub?: string;
  slugs?: string[];
  description?: string;
  showOnHub?: boolean;
};

type DirectoryGroup = {
  groupId: string;
  label: string;
  description?: string;
  hub?: string;
};

type GroupedTreatments = {
  key: string;
  label: string;
  description?: string;
  hub?: string;
  items: ChampagneTreatmentPage[];
};

const treatmentGroups = (champagneMachineManifest.treatmentGroups ?? []) as TreatmentGroupConfig[];

export default async function TreatmentsPage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>;
}) {
  const isHeroEnabled = isBrandHeroEnabled() || (await resolveHeroDebug(searchParams));
  const treatments = getTreatmentPages();
  const hubSections = getSectionStack("/treatments");
  const directoryGroups = getDirectoryGroupsFromManifest();
  const treatmentLookup = new Map(treatments.map((entry) => [entry.slug, entry]));
  const assigned = new Set<string>();

  const orderedGroups: GroupedTreatments[] = directoryGroups
    .map((group) => {
      const groupConfig = treatmentGroups.find((entry) => entry.id === group.groupId);
      const slugs = groupConfig?.slugs ?? [];
      const items = slugs
        .map((slug) => {
          const normalized = resolveTreatmentSlug(slug);
          return treatmentLookup.get(normalized) ?? treatmentLookup.get(slug);
        })
        .filter((entry): entry is ChampagneTreatmentPage => Boolean(entry))
        .sort((a, b) => (a.label ?? a.slug).localeCompare(b.label ?? b.slug));

      items.forEach((item) => assigned.add(item.slug));

      return {
        key: group.groupId,
        label: group.label,
        description: group.description,
        hub: group.hub ?? groupConfig?.hub,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  const remaining = treatments
    .filter((treatment) => !assigned.has(treatment.slug))
    .sort((a, b) => (a.label ?? a.slug).localeCompare(b.label ?? b.slug));

  if (remaining.length > 0) {
    orderedGroups.push({
      key: "additional_treatments",
      label: "Additional treatments",
      description: "More canon routes not yet grouped above.",
      hub: undefined,
      items: remaining,
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8 px-2 sm:px-0">
      {isHeroEnabled && <HeroRenderer mode="treatment" pageCategory="treatment" />}

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Treatments</p>
        <h1 className="text-3xl font-semibold text-neutral-50">Curated treatment pathways</h1>
        <p className="max-w-3xl text-neutral-300">
          Featured pathways come first, with grouped hubs to calm the full directory. Each page is powered by the manifest canon and routes into the Champagne builder experience.
        </p>
      </header>

      {hubSections.length > 0 && (
        <BaseChampagneSurface
          variant="inkGlass"
          className="border border-neutral-800/70 shadow-lg p-5 sm:p-6"
        >
          <ChampagneSectionRenderer pageSlug="/treatments" />
        </BaseChampagneSurface>
      )}

      <BaseChampagneSurface
        variant="inkGlass"
        className="border border-neutral-800/70 shadow-lg p-6 sm:p-7"
      >
        <div className="space-y-8">
          {orderedGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-[0.8rem] uppercase tracking-[0.18em] text-neutral-400">{group.items.length} pages</p>
                  <h2 className="text-xl font-semibold text-neutral-50">{group.label}</h2>
                  {group.description && <p className="mt-1 text-sm text-neutral-400">{group.description}</p>}
                </div>
                {group.hub && (
                  <Link
                    href={group.hub}
                    className="text-sm font-medium text-neutral-200 hover:text-white"
                    aria-label={`View ${group.label} hub`}
                  >
                    View hub
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((treatment) => (
                  <BaseChampagneSurface key={treatment.slug} variant="glass" className="h-full border border-neutral-800/70">
                    <Link
                      href={treatment.path}
                      className="group block h-full no-underline text-inherit"
                    >
                      <div className="grid h-full gap-2 rounded-lg p-4 sm:p-5 transition hover:-translate-y-0.5">
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
