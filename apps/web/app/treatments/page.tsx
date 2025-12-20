import Link from "next/link";
import { BaseChampagneSurface } from "@champagne/hero";
import { champagneMachineManifest, getPageManifest, getTreatmentPages } from "@champagne/manifests";
import type { ChampagneTreatmentPage } from "@champagne/manifests";
import { ChampagneSectionRenderer, getSectionStack } from "@champagne/sections";

import treatmentHubGroups from "../../../../packages/champagne-manifests/data/ia/treatment-hub.groups.smh.json";

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

type TreatmentGroupConfig = {
  id: string;
  label: string;
  hub?: string;
  slugs?: string[];
  description?: string;
  showOnHub?: boolean;
  featuredSlugs?: string[];
  viewAllLabel?: string;
  inventory?: {
    hiddenByDefault?: boolean;
    access?: {
      label?: string;
      href?: string;
    };
    slugs?: string[];
  };
};

type GroupDefinition = {
  id: string;
  label: string;
  description?: string;
  slugs?: string[];
};

type GroupedTreatments = {
  key: string;
  label: string;
  description?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  featuredItems: ChampagneTreatmentPage[];
  hiddenCount: number;
  totalMapped: number;
};

const treatmentGroups = (champagneMachineManifest.treatmentGroups ?? []) as TreatmentGroupConfig[];
const groupManifest = (treatmentHubGroups.groups ?? []) as GroupDefinition[];

function buildDescription(label?: string) {
  if (!label) return "Explore this treatment.";
  return `Learn more about ${label.toLowerCase()}.`;
}

function normalizeSlug(slugOrPath: string) {
  return slugOrPath.replace(/^\//, "").replace(/^treatments\//, "");
}

function findTreatment(
  slugOrPath: string,
  lookup: Map<string, ChampagneTreatmentPage>,
): ChampagneTreatmentPage | undefined {
  const normalized = normalizeSlug(slugOrPath);
  return lookup.get(normalized) ?? lookup.get(`/treatments/${normalized}`) ?? lookup.get(slugOrPath);
}

export default async function TreatmentsPage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>;
}) {
  const isHeroEnabled = isBrandHeroEnabled() || (await resolveHeroDebug(searchParams));
  const treatments = getTreatmentPages();
  const hubSections = getSectionStack("/treatments");
  const hubManifest = getPageManifest("/treatments");
  const treatmentLookup = new Map<string, ChampagneTreatmentPage>();

  treatments.forEach((entry) => {
    treatmentLookup.set(entry.slug, entry);
    treatmentLookup.set(entry.path, entry);
  });

  const unknownSlugsInGrouping = new Set<string>();
  const assignedSlugToGroup = new Map<string, string>();

  const orderedGroups: GroupedTreatments[] = groupManifest.map((group) => {
    const groupConfig = treatmentGroups.find((entry) => entry.id === group.id);
    const slugs = group.slugs ?? [];
    const items: ChampagneTreatmentPage[] = [];
    const itemsBySlug = new Map<string, ChampagneTreatmentPage>();

    slugs.forEach((slug) => {
      const treatment = findTreatment(slug, treatmentLookup);

      if (!treatment) {
        unknownSlugsInGrouping.add(slug);
        return;
      }

      const alreadyAssignedGroup = assignedSlugToGroup.get(treatment.slug);
      if (alreadyAssignedGroup && alreadyAssignedGroup !== group.id) {
        throw new Error(`Treatment slug ${treatment.slug} mapped to multiple groups: ${alreadyAssignedGroup} and ${group.id}`);
      }

      assignedSlugToGroup.set(treatment.slug, group.id);
      items.push(treatment);
      itemsBySlug.set(treatment.slug, treatment);
      itemsBySlug.set(normalizeSlug(treatment.path), treatment);
    });

    const featuredSource = (groupConfig?.featuredSlugs?.length ? groupConfig.featuredSlugs : slugs).slice(0, 5);
    const featuredItems = featuredSource
      .map((slug) => itemsBySlug.get(normalizeSlug(slug)) ?? itemsBySlug.get(slug))
      .filter((entry): entry is ChampagneTreatmentPage => Boolean(entry));
    const hiddenCount = Math.max(0, items.length - featuredItems.length);

    const viewAllLabel =
      typeof groupConfig?.viewAllLabel === "string"
        ? groupConfig.viewAllLabel
        : typeof hubManifest?.viewAllLabel === "string"
          ? hubManifest.viewAllLabel
          : undefined;

    const viewAllHref =
      typeof groupConfig?.inventory?.access?.href === "string"
        ? groupConfig.inventory.access.href
        : groupConfig?.hub;

    return {
      key: group.id,
      label: group.label,
      description: group.description,
      viewAllLabel,
      viewAllHref,
      featuredItems,
      hiddenCount,
      totalMapped: items.length,
    };
  });

  const unassignedSlugs = treatments
    .map((entry) => entry.slug)
    .filter((slug) => !assignedSlugToGroup.has(slug));

  if (unknownSlugsInGrouping.size > 0 || unassignedSlugs.length > 0) {
    console.info(
      "Treatment hub grouping diagnostics",
      JSON.stringify(
        {
          unknownSlugsInGrouping: Array.from(unknownSlugsInGrouping.values()).sort(),
          unassignedSlugs: unassignedSlugs.sort(),
        },
        null,
        2,
      ),
    );
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
            <section key={group.key} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-[0.8rem] uppercase tracking-[0.18em] text-neutral-400">
                    Featured {group.featuredItems.length}
                    {group.hiddenCount ? ` · ${group.hiddenCount} hidden via View all` : ""}
                  </p>
                  <h2 className="text-xl font-semibold text-neutral-50">{group.label}</h2>
                  {group.description && <p className="mt-1 text-sm text-neutral-400">{group.description}</p>}
                </div>
                {group.viewAllHref && (
                  <Link
                    href={group.viewAllHref}
                    className="text-sm font-medium text-neutral-200 hover:text-white"
                    aria-label={`View all ${group.label} treatments`}
                  >
                    {group.viewAllLabel ?? "View all"}
                  </Link>
                )}
              </div>

              <details className="group rounded-lg border border-neutral-800/70 bg-neutral-900/40" aria-label={`${group.label} treatments`}>
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-neutral-100 hover:text-white">
                  <span>Show featured {group.label.toLowerCase()} treatments</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.15em] text-neutral-400">Collapsed</span>
                </summary>
                <div className="space-y-4 border-t border-neutral-800/70 p-4 sm:p-5">
                  {group.featuredItems.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.featuredItems.map((treatment) => (
                        <BaseChampagneSurface
                          key={treatment.slug}
                          variant="glass"
                          className="h-full border border-neutral-800/70"
                        >
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
                  ) : (
                    <p className="text-sm text-neutral-400">No mapped treatments in this group yet.</p>
                  )}
                  {group.hiddenCount > 0 && (
                    <p className="text-xs text-neutral-400">
                      {group.hiddenCount} additional treatments available via the View all link.
                    </p>
                  )}
                </div>
              </details>
            </section>
          ))}
        </div>
      </BaseChampagneSurface>
    </div>
  );
}
