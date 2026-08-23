import {
  DEFAULT_CAPABILITIES,
  PRODUCTION_BINDING,
  type CapabilityKey,
  type ExemplarFlow,
  type SemanticSection,
} from "./contracts";

const titles: Record<string, string> = {
  "home.hero.v2": "Hero V2",
  "home.practice.answer": "Practice answer",
  "home.patient.pathways": "Patient-led pathways",
  "home.complex-care": "Complex care",
  "home.care-process": "Care process",
  "home.founder-authority": "Founder authority",
  "home.team-continuity": "Team continuity",
  "home.technology-purpose": "Technology with purpose",
  "home.heritage-story": "St Mary's House",
  "home.proof": "Real cases and patient voice",
  "home.visit": "Visit St Mary's House",
  "home.focused-faq": "Focused questions",
  "home.closing-invitation": "Closing invitation",
  "implants.hero": "Implants Hero V2",
  "implants.direct-answer": "A direct answer",
  "implants.components-3d": "Implant components",
  "implants.assessment-factors": "Assessment factors",
  "implants.planning": "Digital planning",
  "implants.stages": "Broad treatment stages",
  "implants.options-comparison": "Options comparison",
  "implants.benefits-risks": "Benefits and risks",
  "implants.cost": "Cost truth",
  "implants.clinician": "Your clinician",
  "implants.aftercare": "Aftercare",
  "implants.case-evidence": "Consented case evidence",
  "implants.faq-sources": "Questions and sources",
  "implants.next-step": "A considered next step",
  "bonding.hero": "Bonding Hero V2",
  "bonding.direct-answer": "A direct answer",
  "bonding.scope-limits": "Scope and limits",
  "bonding.assessment-planning": "Assessment and planning",
  "bonding.comparison": "Treatment comparison",
  "bonding.process": "The process",
  "bonding.materials-techniques": "Materials and technique",
  "bonding.risks-maintenance": "Risks and maintenance",
  "bonding.longevity": "Longevity truth",
  "bonding.cost": "Cost truth",
  "bonding.authority-cases": "Clinical authority and cases",
  "bonding.faq-sources": "Questions and sources",
  "bonding.next-step": "A calm next step",
};

const home = Object.keys(titles).filter((id) => id.startsWith("home."));
const implants = Object.keys(titles).filter((id) => id.startsWith("implants."));
const bonding = Object.keys(titles).filter((id) => id.startsWith("bonding."));

const gates: Record<string, CapabilityKey | undefined> = {
  "home.proof": "cases",
  "implants.case-evidence": "cases",
};

const media: Record<string, string> = {
  "home.practice.answer": "PRACTICE_EXTERIOR_V1",
  "home.founder-authority": "FOUNDER_ENVIRONMENTAL_V1",
  "home.team-continuity": "TEAM_GROUP_V1",
  "home.technology-purpose": "DIGITAL_PLANNING_V1",
  "home.heritage-story": "PRACTICE_EXTERIOR_V1",
  "implants.planning": "CBCT_PLANNING_V1",
  "implants.stages": "IMPLANT_WORKFLOW_V1",
  "implants.clinician": "FOUNDER_ENVIRONMENTAL_V1",
  "bonding.assessment-planning": "DIGITAL_PLANNING_V1",
  "bonding.process": "BONDING_POLISH_V1",
};

const makeSections = (ids: string[], variant: "A" | "B"): SemanticSection[] =>
  ids.map((id, index) => {
    const isHero = id.endsWith("hero") || id === "home.hero.v2";
    const isThreeD = id === "implants.components-3d";
    const concept =
      id === "home.team-continuity" && variant === "B"
        ? "CDC-HOME-TEAM-CONTINUITY-PERSIAN-V1"
        : id === "implants.cost" && variant === "A"
          ? "CDC-IMPLANT-COST-TRUTH-V1"
          : id === "bonding.materials-techniques"
            ? "CDC-BOND-TECHNIQUE-LAYERING-V1"
            : id === "bonding.longevity"
              ? "CDC-BOND-LONGEVITY-TRUTH-V1"
              : id === "bonding.cost"
                ? "CDC-BOND-COST-TRUTH-V1"
                : undefined;
    const prefix = id.startsWith("home.") ? "SECTION-B036" : id.startsWith("implants.") ? "SECTION-B037" : "SECTION-B035";
    return {
      id,
      title: titles[id] ?? id,
      material: isHero ? "luminous" : (index + (variant === "B" ? 1 : 0)) % 3 === 0 ? "persian" : "porcelain",
      evidenceIds: isHero ? ["CANONICAL-HERO-V2"] : [concept ?? `CVA-${prefix}-E${String((index % 8) + 1).padStart(2, "0")}`],
      mediaId: media[id],
      modelId: isThreeD ? "CD3D-IMPLANT-EDU-V1" : undefined,
      gate: gates[id],
      actions: isThreeD
        ? [`focus:${id}`, "3d:CD3D-IMPLANT-EDU-V1", `return:${id}`, "human:contact"]
        : [`focus:${id}`, `evidence:${id}`, `return:${id}`, "human:contact"],
      fallback: isThreeD
        ? "Static labelled implant-component diagram and transcript. No patient-specific simulation."
        : "Intentional text-led Lab state; source preview and genuine media are unavailable.",
    };
  });

const flow = (
  id: string,
  slug: string,
  family: ExemplarFlow["family"],
  variant: "A" | "B",
  route: ExemplarFlow["route"],
  ids: string[],
  headerId: string,
  footerIds: string[],
): ExemplarFlow => ({ id, slug, family, variant, route, headerId, footerIds, sections: makeSections(ids, variant), productionBinding: PRODUCTION_BINDING });

export const FLOWS: ExemplarFlow[] = [
  flow("CDP-HOME-A-V2", "home-a", "home", "A", "/", home, "CVA-HEADER-B036-E01", ["CVA-FOOTER-F03-E02", "CVA-FOOTER-B028-E01"]),
  flow("CDP-HOME-B-V2", "home-b", "home", "B", "/", home, "CVA-HEADER-B010-E01", ["CVA-FOOTER-F03-E01", "CVA-FOOTER-B019-E01"]),
  flow("CDP-IMPLANT-A-V2", "implants-a", "implants", "A", "/treatments/implants", implants, "CVA-HEADER-B017-E01", ["CVA-FOOTER-F03-E03", "CVA-FOOTER-B019-E01"]),
  flow("CDP-IMPLANT-B-V2", "implants-b", "implants", "B", "/treatments/implants", implants, "CVA-HEADER-B018-E01", ["CVA-FOOTER-F03-E02", "CVA-FOOTER-B028-E01"]),
  flow("CDP-BOND-A-V2", "bonding-a", "bonding", "A", "/treatments/composite-bonding", bonding, "CVA-HEADER-B035-E01", ["CVA-FOOTER-F03-E02", "CVA-FOOTER-B028-E01"]),
  flow("CDP-BOND-B-V2", "bonding-b", "bonding", "B", "/treatments/composite-bonding", bonding, "CVA-HEADER-B035-E01", ["CVA-FOOTER-F03-E03", "CVA-FOOTER-F03-E01"]),
];

export const getFlow = (slug: string) => FLOWS.find((item) => item.slug === slug);

export const visibleSections = (flow: ExemplarFlow, capabilities = DEFAULT_CAPABILITIES) =>
  flow.sections.filter((section) => !section.gate || capabilities[section.gate]);
