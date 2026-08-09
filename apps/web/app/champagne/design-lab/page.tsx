import { RegistryBrowser } from "./_components/RegistryBrowser";
import { Room11Composer } from "./_components/Room11Composer";
import { FLOWS } from "./data/flows";

export default function DesignLabPage() {
  return <main className="dl-main"><section className="dl-intro"><p className="dl-kicker">READ-ONLY DECISION SYSTEM</p><h1>Champagne Design Lab · DL-R1</h1><p>Six semantic exemplars, twelve evidence rooms and one bounded composition surface. Missing source artwork is declared, never invented.</p></section><section><h2>Six exemplar flows</h2><div className="dl-flow-grid">{FLOWS.map((flow) => <a key={flow.id} href={`/champagne/design-lab/exemplars/${flow.slug}`}><strong>{flow.id}</strong><span>{flow.sections.length} semantic jobs · {flow.variant}</span></a>)}</div></section><Room11Composer /><RegistryBrowser /></main>;
}
