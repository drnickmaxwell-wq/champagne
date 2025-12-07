import type { ChampagneHeroManifest, ChampagnePageManifest } from "@champagne/manifests";
import { getAllPages, getHeroManifest, getPageManifest } from "@champagne/manifests";

export type HeroRegistryEntry = ChampagneHeroManifest & {
  label?: string;
  category?: ChampagnePageManifest["category"];
};

export function getHeroBySlug(pageSlug: string): HeroRegistryEntry {
  const manifest = getPageManifest(pageSlug);
  const heroManifest = manifest?.hero ? getHeroManifest(pageSlug) : undefined;

  const fallbackId = manifest?.hero && typeof manifest.hero === "string"
    ? manifest.hero
    : manifest?.id ?? pageSlug;

  return {
    id: heroManifest?.id ?? fallbackId,
    sourcePagePath: manifest?.path ?? pageSlug,
    preset: heroManifest?.preset ?? manifest?.hero,
    label: manifest?.label,
    category: manifest?.category,
  };
}

export function getAllHeroes(): HeroRegistryEntry[] {
  const heroes: HeroRegistryEntry[] = [];

  for (const page of collectPages()) {
    const heroValue = page.hero;
    if (!heroValue) continue;
    const heroId = typeof heroValue === "string" ? heroValue : (heroValue.id as string | undefined);
    if (!heroId) continue;

    heroes.push({
      id: heroId,
      sourcePagePath: page.path,
      preset: heroValue,
      label: page.label,
      category: page.category,
    });
  }

  return heroes;
}

function collectPages(): ChampagnePageManifest[] {
  return getAllPages();
}

export function resolveHeroVariant(heroId: string): HeroRegistryEntry {
  const registry = getHeroManifest(heroId);
  if (registry) {
    return registry;
  }

  return {
    id: heroId,
  };
}
