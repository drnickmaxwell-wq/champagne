import { notFound } from "next/navigation";
import { HeroV2LabAdapter } from "../../_components/HeroV2LabAdapter";
import { HomepagePrototype } from "../../_components/HomepagePrototype";
import { SectionSpecimen } from "../../_components/SectionSpecimen";
import { FLOWS, getFlow, visibleSections } from "../../data/flows";

const visualDirections = {
  "home-a": { page: "CVA-PAGE-B036-E01", sequence: "CVA-SEQUENCE-B005-E01", sections: ["CVA-SECTION-B034-E01", "CVA-SECTION-B025-E01", "CVA-SECTION-B033-E02", "CVA-SECTION-B011-E01", "CVA-SECTION-B007-E01", "CVA-SECTION-B031-E06"] },
  "home-b": { page: "CVA-PAGE-B021-E01", sequence: "CVA-SEQUENCE-B010-E01", sections: ["CVA-SECTION-B033-E01", "CVA-SECTION-B025-E06", "CVA-SECTION-B034-E03", "CVA-SECTION-B011-E05", "CVA-SECTION-B007-E03", "CVA-SECTION-B031-E04"] },
  "implants-a": { page: "CVA-PAGE-B018-E01", sequence: "CVA-SEQUENCE-B017-E01", sections: ["CVA-SECTION-B029-E02", "CVA-SECTION-B029-E03", "CVA-SECTION-B029-E01", "CVA-SECTION-B029-E04", "CVA-SECTION-B029-E05", "CVA-SECTION-B029-E06"] },
  "implants-b": { page: "CVA-PAGE-B023-E01", sequence: "CVA-SEQUENCE-B009-E01", sections: ["CVA-SECTION-B011-E03", "CVA-SECTION-B011-E04", "CVA-SECTION-B034-E02", "CVA-SECTION-B025-E05", "CVA-SECTION-B031-E02", "CVA-SECTION-B034-E06"] },
  "bonding-a": { page: "CVA-PAGE-B035-E01", sequence: "CVA-SEQUENCE-PERSIAN-RECOLOR-E01", sections: ["CVA-SECTION-B002-E01", "CVA-SECTION-B007-E02", "CVA-SECTION-B011-E06", "CVA-SECTION-B025-E02", "CVA-SECTION-B031-E01", "CVA-SECTION-B034-E04"] },
  "bonding-b": { page: "CVA-PAGE-B030-E01", sequence: "CVA-SEQUENCE-PERSIAN-HOME-E01", sections: ["CVA-SECTION-B002-E02", "CVA-SECTION-B007-E03", "CVA-SECTION-B011-E08", "CVA-SECTION-B025-E04", "CVA-SECTION-B031-E03", "CVA-SECTION-B034-E05"] },
} as const;

export function generateStaticParams() { return FLOWS.map(({ slug }) => ({ slug })); }

export default async function ExemplarPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ frame?: string; motion?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]); const flow = getFlow(slug); if (!flow) notFound();
  const frame = ["desktop", "tablet", "mobile"].includes(query.frame ?? "") ? query.frame : "desktop";
  const motion = query.motion === "reduce" ? "reduce" : "full";
  const sections = visibleSections(flow); const visuals = visualDirections[slug as keyof typeof visualDirections];
  if (slug === "home-a" || slug === "home-b") return <main className="dl-exemplar-main"><HomepagePrototype variant={slug === "home-a" ? "A" : "B"} /></main>;
  return <main className="dl-main dl-exemplar-main"><nav className="dl-specimen-controls" aria-label="Specimen controls"><a href="?frame=desktop">Desktop</a><a href="?frame=tablet">Tablet</a><a href="?frame=mobile">Mobile</a><a href={`?frame=${frame}&motion=reduce`}>Reduced motion</a></nav><article className="dl-specimen" data-frame={frame} data-motion={motion}><header className="dl-specimen-meta"><p className="dl-kicker">{flow.id}</p><h1>{flow.family === "home" ? "Homepage" : flow.family === "implants" ? "Dental Implants" : "Composite Bonding"} · Direction {flow.variant}</h1><p>A visual composition study using recovered V27 evidence and the settled semantic architecture.</p><dl><div><dt>Header</dt><dd>{flow.headerId}</dd></div><div><dt>Canonical route</dt><dd>{flow.route}</dd></div><div><dt>Visible jobs</dt><dd>{sections.length}</dd></div></dl></header><section className="dl-direction-board"><div><p className="dl-kicker">WHOLE-PAGE DIRECTION</p><img src={`/assets/champagne/design-lab/v27/${visuals.page}.png`} alt="Recovered V27 whole-page visual direction" /></div><div><p className="dl-kicker">PACING AND SEQUENCE</p><img src={`/assets/champagne/design-lab/v27/${visuals.sequence}.png`} alt="Recovered V27 page-sequence visual direction" /></div></section><HeroV2LabAdapter route={flow.route} />{sections.filter((section) => !section.id.endsWith("hero") && section.id !== "home.hero.v2").map((section, index) => <SectionSpecimen key={section.id} section={section} visualId={visuals.sections[index % visuals.sections.length]} />)}<section className="dl-section dl-footer-evidence" data-material="persian"><h2>Footer direction</h2><p>{flow.footerIds.join(" · ")}</p><div>{flow.footerIds.map((id) => <img key={id} src={`/assets/champagne/design-lab/v27/${id}.png`} alt={`V27 footer direction ${id}`} />)}</div></section></article></main>;
}
