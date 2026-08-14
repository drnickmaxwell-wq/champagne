import brandAuthorityJson from "../../../../../../../contracts/atelier-recovery/authority/CHAMPAGNE_FOUNDER_BRAND_DNA_V1.json";
import closureEvidenceJson from "../../../../../../../contracts/atelier-recovery/authority/CHAMPAGNE_FOUNDER_VISUAL_TASTE_INTERVIEW_RESPONSE_V1_38_OF_38_CLOSED.json";
import threeDEvidenceJson from "../../../../../../../contracts/atelier-recovery/authority/evidence/CHAMPAGNE_3D_AND_MEDICAL_VISUAL_TASTE_EVIDENCE_V1.json";
import sourceManifestJson from "../../../../../../../contracts/atelier-recovery/authority/source-manifest.v1.json";

export const CANONICAL_BRAND_AUTHORITY_ID = "CHAMPAGNE_FOUNDER_BRAND_DNA_V1@1.0.0" as const;

type JsonRecord = Record<string, unknown>;

export type CanonicalBrandAuthority = Readonly<{
  schema: "CHAMPAGNE_FOUNDER_BRAND_DNA_V1";
  version: "1.0.0";
  authorityState: "CANONICAL_CORE_WITH_BOUNDED_DOMAIN_GAPS";
  fixedColourIdentity: Readonly<{
    magenta: string;
    turquoise: string;
    gold: string;
    rule: string;
  }>;
  antiDNA: readonly string[];
  domainStatus: Readonly<Record<string, string>>;
  implementationBinding: false;
}> & JsonRecord;

function assertRecord(value: unknown, label: string): asserts value is JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function validateAuthority(value: unknown): asserts value is CanonicalBrandAuthority {
  assertRecord(value, "Founder Brand authority");
  if (value.schema !== "CHAMPAGNE_FOUNDER_BRAND_DNA_V1" || value.version !== "1.0.0") {
    throw new Error("Unexpected Founder Brand authority identity");
  }
  if (value.authorityState !== "CANONICAL_CORE_WITH_BOUNDED_DOMAIN_GAPS") {
    throw new Error("Founder Brand authority is not canonical-with-bounded-gaps");
  }
  assertRecord(value.fixedColourIdentity, "fixedColourIdentity");
  const colours = value.fixedColourIdentity;
  if (![colours.magenta, colours.turquoise, colours.gold].every((colour) => typeof colour === "string" && colour.length > 0)) {
    throw new Error("Canonical Champagne colour identity is incomplete");
  }
  if (!Array.isArray(value.antiDNA) || value.antiDNA.length === 0) {
    throw new Error("Anti-DNA is required");
  }
  assertRecord(value.domainStatus, "domainStatus");
  if (value.implementationBinding !== false) {
    throw new Error("Brand authority must remain non-production-binding");
  }
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as JsonRecord)) deepFreeze(nested);
  }
  return value as Readonly<T>;
}

validateAuthority(brandAuthorityJson);

export const FOUNDER_BRAND_AUTHORITY = deepFreeze(brandAuthorityJson);
export const FOUNDER_BRAND_CLOSURE_EVIDENCE = deepFreeze(closureEvidenceJson);
export const THREE_D_DOMAIN_EVIDENCE = deepFreeze(threeDEvidenceJson);
export const BRAND_AUTHORITY_SOURCE_MANIFEST = deepFreeze(sourceManifestJson);

export function getBrandAuthoritySummary() {
  return {
    id: CANONICAL_BRAND_AUTHORITY_ID,
    state: FOUNDER_BRAND_AUTHORITY.authorityState,
    essence: FOUNDER_BRAND_AUTHORITY.coreEssence as string,
    colours: FOUNDER_BRAND_AUTHORITY.fixedColourIdentity,
    antiDna: FOUNDER_BRAND_AUTHORITY.antiDNA,
    domains: FOUNDER_BRAND_AUTHORITY.domainStatus,
    approvedSectionSystems: FOUNDER_BRAND_AUTHORITY.compositionDNA.approvedSectionSystems,
    waveAuthority: FOUNDER_BRAND_AUTHORITY.waveAndSurfaceDNA.authority,
    closureState: FOUNDER_BRAND_CLOSURE_EVIDENCE.status,
    unresolvedThreeD: THREE_D_DOMAIN_EVIDENCE.status,
    productionBinding: false as const,
  };
}
