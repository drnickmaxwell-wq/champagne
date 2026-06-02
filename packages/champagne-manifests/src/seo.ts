import localIdentityData from "../data/seo/local-identity.smh.json";
import teamRegistryData from "../data/seo/team-registry.smh.json";
import approvedFactsData from "../data/seo/approved-facts.smh.json";
import { getPageManifest, getTreatmentManifest } from "./helpers";

export const localIdentity = localIdentityData;
export const teamRegistry = teamRegistryData;
export const approvedPublicFacts = approvedFactsData;

const canonicalOrigin = localIdentity.canonicalOrigin;
const practiceName = localIdentity.publicBrand.name;
const legalEntityName = localIdentity.legalEntity.name;
const defaultDescription = "Private dental care in Shoreham-by-Sea, with calm planning and clear patient guidance.";

export type SchemaNode = Record<string, unknown>;

function absoluteUrl(path = "/") {
  if (path.startsWith("https://") || path.startsWith("http://")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${canonicalOrigin}${normalizedPath}`;
}

function graphId(fragment: string) {
  return `${canonicalOrigin}/#${fragment}`;
}

function stripUndefined<T extends SchemaNode>(node: T): T {
  return Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined && value !== null)) as T;
}

function personId(memberId: string) {
  return graphId(`person-${memberId}`);
}

export function getCanonicalOrigin() {
  return canonicalOrigin;
}

export function getPracticeName() {
  return practiceName;
}

export function getDefaultSeoDescription() {
  return defaultDescription;
}

export function getVerifiedTeamMembers() {
  return teamRegistry.members.filter((member) => member.verifiedForSchema);
}

export function getTeamMemberByPath(path: string) {
  return getVerifiedTeamMembers().find((member) => member.profilePath === path);
}

export function buildOrganizationNode(): SchemaNode {
  return {
    "@type": "Organization",
    "@id": graphId("organization"),
    name: legalEntityName,
    legalName: legalEntityName,
    url: canonicalOrigin,
    brand: {
      "@type": "Brand",
      name: practiceName,
    },
  };
}

export function buildDentistNode(): SchemaNode {
  return {
    "@type": ["Dentist", "LocalBusiness"],
    "@id": graphId("dentist"),
    name: practiceName,
    legalName: legalEntityName,
    url: canonicalOrigin,
    telephone: localIdentity.contact.telephone,
    email: localIdentity.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: localIdentity.address.streetAddress,
      addressLocality: localIdentity.address.addressLocality,
      addressRegion: localIdentity.address.addressRegion,
      postalCode: localIdentity.address.postalCode,
      addressCountry: localIdentity.address.addressCountry,
    },
    openingHoursSpecification: localIdentity.openingHours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${entry.dayOfWeek}`,
      opens: entry.opens,
      closes: entry.closes,
    })),
    areaServed: [localIdentity.primaryMarket.name, ...localIdentity.supportMarkets.map((market) => market.name)],
    parentOrganization: {
      "@id": graphId("organization"),
    },
    employee: getVerifiedTeamMembers().map((member) => ({ "@id": personId(member.id) })),
  };
}

export function buildWebsiteNode(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": graphId("website"),
    name: practiceName,
    url: canonicalOrigin,
    description: defaultDescription,
    publisher: {
      "@id": graphId("organization"),
    },
  };
}

export function buildWebPageNode(path: string, name: string, description?: string, type = "WebPage"): SchemaNode {
  return stripUndefined({
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@id": graphId("website"),
    },
    about: {
      "@id": graphId("dentist"),
    },
  });
}

export function buildPersonNode(member: (typeof teamRegistry.members)[number]): SchemaNode {
  return stripUndefined({
    "@type": member.schemaRole === "Dentist" ? ["Person", "Dentist"] : "Person",
    "@id": personId(member.id),
    name: member.name,
    jobTitle: member.role,
    identifier: member.gdcNumber
      ? {
          "@type": "PropertyValue",
          propertyID: "GDC",
          value: member.gdcNumber,
        }
      : undefined,
    alumniOf: member.qualifications?.length ? member.qualifications.join("; ") : undefined,
    knowsAbout: member.treatmentInterests,
    url: member.profilePath ? absoluteUrl(member.profilePath) : undefined,
    worksFor: {
      "@id": graphId("dentist"),
    },
  });
}

export function buildServiceNode(service: (typeof localIdentity.priorityServices)[number]): SchemaNode | null {
  const routePath = service.routePath;
  if (!routePath) return null;

  const treatmentSlug = routePath.startsWith("/treatments/") ? routePath.replace("/treatments/", "") : undefined;
  const manifest = treatmentSlug ? getTreatmentManifest(treatmentSlug) : getPageManifest(routePath);
  if (!manifest?.path) return null;

  const name = manifest.label ?? service.name;
  const description =
    (manifest as { description?: string; intro?: string }).description ??
    (manifest as { description?: string; intro?: string }).intro;

  return stripUndefined({
    "@type": "Service",
    "@id": `${absoluteUrl(manifest.path)}#service`,
    name,
    description,
    url: absoluteUrl(manifest.path),
    areaServed: localIdentity.primaryMarket.name,
    provider: {
      "@id": graphId("dentist"),
    },
  });
}

export function buildPriorityServiceNodes(): SchemaNode[] {
  return localIdentity.priorityServices.map(buildServiceNode).filter((node): node is SchemaNode => Boolean(node));
}

export function buildBreadcrumbNode(items: { name: string; path: string }[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildSiteSchemaGraph(path = "/", pageName = practiceName, pageDescription = defaultDescription): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(),
      buildDentistNode(),
      buildWebsiteNode(),
      buildWebPageNode(path, pageName, pageDescription),
      ...getVerifiedTeamMembers().map(buildPersonNode),
      ...buildPriorityServiceNodes(),
    ],
  };
}

export function buildTreatmentSchemaGraph(path: string, treatmentTitle: string, treatmentDescription: string): SchemaNode {
  const service = buildServiceNode({
    id: path.replace(/^\//, "").replaceAll("/", "-"),
    name: treatmentTitle,
    routePath: path,
    sources: [],
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageNode(path, treatmentTitle, treatmentDescription),
      ...(service ? [service] : []),
      buildBreadcrumbNode([
        { name: "Treatments", path: "/treatments" },
        { name: treatmentTitle, path },
      ]),
    ],
  };
}

export function buildTeamMemberProfileSchema(path: string, fallbackName: string): SchemaNode {
  const member = getTeamMemberByPath(path);
  const name = member?.name ?? fallbackName;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageNode(path, name, `Profile for ${name}.`, "ProfilePage"),
      ...(member ? [buildPersonNode(member)] : []),
    ],
  };
}
