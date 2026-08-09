import { notFound } from "next/navigation";
import { HeroV2LabAdapter } from "../../_components/HeroV2LabAdapter";
import { SectionSpecimen } from "../../_components/SectionSpecimen";
import { FLOWS, getFlow, visibleSections } from "../../data/flows";

export function generateStaticParams() { return FLOWS.map(({ slug }) => ({ slug })); }

export default async function ExemplarPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ frame?: string; motion?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]); const flow = getFlow(slug); if (!flow) notFound();
  const frame = ["desktop", "tablet", "mobile"].includes(query.frame ?? "") ? query.frame : "desktop";
  const motion = query.motion === "reduce" ? "reduce" : "full";
  const sections = visibleSections(flow);
  return <main className="dl-main"><nav aria-label="Specimen controls"><a href="?frame=desktop">Desktop</a><a href="?frame=tablet">Tablet</a><a href="?frame=mobile">Mobile</a><a href={`?frame=${frame}&motion=reduce`}>Reduced motion</a></nav><article className="dl-specimen" data-frame={frame} data-motion={motion}><header className="dl-specimen-meta"><p>{flow.id}</p><h1>{flow.family} {flow.variant}</h1><dl><div><dt>Header</dt><dd>{flow.headerId}</dd></div><div><dt>Canonical route</dt><dd>{flow.route}</dd></div><div><dt>Visible jobs</dt><dd>{sections.length}</dd></div></dl></header><HeroV2LabAdapter route={flow.route} />{sections.filter((section) => !section.id.endsWith("hero") && section.id !== "home.hero.v2").map((section) => <SectionSpecimen key={section.id} section={section} />)}<section className="dl-section" data-material="persian"><h2>Footer evidence, not approval</h2><p>{flow.footerIds.join(" · ")}</p><strong>SOURCE_PREVIEW_UNAVAILABLE</strong></section></article></main>;
}
