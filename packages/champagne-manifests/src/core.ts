import machineManifestData from "../data/champagne_machine_manifest_full.json";
import navManifestData from "../data/manifest.nav.main.json";
import publicBrandManifest from "../data/manifest.public.brand.json";
import stylesManifest from "../data/manifest.styles.champagne.json";
import manusImportManifest from "../data/manus_import_unified_manifest_20251104.json";

export type ChampagneManifestStatus = "unavailable" | "stub" | "ready";

export interface ChampagnePageSection {
  id?: string;
  type?: string;
  label?: string;
  ctas?: (ChampagneCTA | string)[];
  [key: string]: unknown;
}

export interface ChampagneCTA {
  id?: string;
  label?: string;
  href?: string;
  preset?: string;
  [key: string]: unknown;
}

export interface ChampagnePageCTAConfig {
  heroCTAs?: (ChampagneCTA | string)[];
  midPageCTAs?: (ChampagneCTA | string)[];
  footerCTAs?: (ChampagneCTA | string)[];
  [key: string]: unknown;
}

export interface ChampagnePageManifest {
  id?: string;
  path?: string;
  hero?: string | Record<string, unknown>;
  sections?: ChampagnePageSection[] | string[];
  surface?: string;
  category?: string;
  label?: string;
  ctas?: ChampagnePageCTAConfig;
  [key: string]: unknown;
}

export interface ChampagneMachineManifest {
  id: string;
  note?: string;
  status: ChampagneManifestStatus | string;
  version: string;
  pages?: Record<string, ChampagnePageManifest>;
  treatments?: Record<string, ChampagnePageManifest>;
  [key: string]: unknown;
}

export interface ChampagneManifestRegistry {
  core: ChampagneMachineManifest;
  public?: unknown;
  styles?: unknown;
  manusImport?: unknown;
}

export interface ChampagneStylesManifest {
  heroes?: Record<string, unknown>;
  sections?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  priority?: number;
  status?: "live" | "stub";
}

export interface ChampagneNavigationManifest {
  items?: NavItem[];
  [key: string]: unknown;
}

const champagneMachineManifest: ChampagneMachineManifest = machineManifestData;
const champagneStylesManifest: ChampagneStylesManifest = stylesManifest;
const champagneNavigationManifest: ChampagneNavigationManifest = {
  ...navManifestData,
  items: (navManifestData.items ?? []).map((item) => ({
    ...item,
    status: item.status === "stub" ? "stub" : item.status === "live" ? "live" : undefined,
  })),
};

const registry: ChampagneManifestRegistry = {
  core: champagneMachineManifest,
  public: publicBrandManifest,
  styles: stylesManifest,
  manusImport: manusImportManifest,
};

type StatusCarrier = { status?: ChampagneManifestStatus | string };

const manifestStatuses = [
  champagneMachineManifest.status,
  (registry.public as StatusCarrier | undefined)?.status,
  (registry.styles as StatusCarrier | undefined)?.status,
  (registry.manusImport as StatusCarrier | undefined)?.status,
];

const allReady = manifestStatuses.every((status) => status === "ready");

export const champagneManifestStatus: ChampagneManifestStatus = allReady
  ? "ready"
  : champagneMachineManifest.status === "ready"
    ? "stub"
    : "unavailable";

export const champagneManifestsReady = champagneManifestStatus === "ready";

export const champagneManifestRegistry: ChampagneManifestRegistry = registry;
export { champagneStylesManifest };

const pageCollections = [
  champagneMachineManifest.pages ?? {},
  champagneMachineManifest.treatments ?? {},
];

export function getMainNavItems(): NavItem[] {
  const items = champagneNavigationManifest.items ?? [];
  return [...items].sort((a, b) => {
    const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
    const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.label.localeCompare(b.label);
  });
}

export function getPageManifestBySlug(slug: string): ChampagnePageManifest | undefined {
  for (const collection of pageCollections) {
    const match = Object.values(collection).find((entry) => entry.path === slug);
    if (match) return match;
  }
  return undefined;
}

export function getHeroPresetForPage(slug: string): string | Record<string, unknown> | undefined {
  return getPageManifestBySlug(slug)?.hero;
}

export function getSectionStackForPage(slug: string): (ChampagnePageSection | string)[] | undefined {
  return getPageManifestBySlug(slug)?.sections;
}

export { champagneMachineManifest };
