import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import type { ReactNode } from "react";
import { HeroV2LabAdapter } from "../_components/HeroV2LabAdapter";
import implantBundle from "../data/authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json";
import styles from "./page.module.css";

type ImplantSection = (typeof implantBundle.sections)[number];
type ImplantSectionId = ImplantSection["sectionId"];
type GovernedSection = ImplantSection & { visibleCopy: { standard: string } };

const byId = (id: ImplantSectionId) => {
  const section = implantBundle.sections.find((candidate) => candidate.sectionId === id);
  if (!section?.visibleCopy?.standard) throw new Error(`Missing governed Implant section: ${id}`);
  return section as GovernedSection;
};

const directAnswer = byId("implants.direct-answer");
const components = byId("implants.components-3d");
const assessment = byId("implants.assessment-factors");
const planning = byId("implants.planning");
const stages = byId("implants.stages");
const comparison = byId("implants.options-comparison");
const benefitsRisks = byId("implants.benefits-risks");
const cost = byId("implants.cost");
const aftercare = byId("implants.aftercare");
const faq = byId("implants.faq-sources");
const nextStep = byId("implants.next-step");

const paragraphs = (copy: string) => copy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>);

function Chapter({ index, children, light = false }: { index: string; children: ReactNode; light?: boolean }) {
  return <p className={styles.chapter} data-light={light || undefined}><span>{index}</span>{children}</p>;
}

function Links({ ctas, light = false }: { ctas: ReadonlyArray<{ label: string; href: string }>; light?: boolean }) {
  return <div className={styles.links} data-light={light || undefined}>{ctas.map((cta, index) => <a href={cta.href} key={`${cta.href}-${cta.label}`} data-primary={index === 0 || undefined}>{cta.label}<span aria-hidden="true">→</span></a>)}</div>;
}

function Wave({ className = "" }: { className?: string }) {
  return <div className={`${styles.wave} ${className}`} aria-hidden="true" />;
}

function GoldenImplantFooter() {
  return <footer className={styles.footer} data-reference="CVA-FOOTER-F03-E02">
    <div className={styles.footerPorcelain}>
      <div className={styles.footerBrand}>
        <strong>St Mary’s House<br />Dental Care</strong>
        <span>Going the extra smile</span>
      </div>
      <nav aria-label="Footer pathways">
        <a href="/treatments">Explore treatments <span>→</span></a>
        <a href="/about">Your first visit <span>→</span></a>
        <a href="/about">Meet our team <span>→</span></a>
        <a href="/insights">Read our insights <span>→</span></a>
      </nav>
    </div>
    <div className={styles.footerDescent} aria-hidden="true"><Wave /></div>
    <div className={styles.footerPersian}>
      <div><strong>Care</strong><a href="/treatments">Treatments</a><a href="/treatments/implants">Dental implants</a><a href="/treatments/composite-bonding">Composite dentistry</a></div>
      <div><strong>Your visit</strong><a href="/contact">Contact</a><a href="/fees">Fees</a><a href="/about">Our practice</a></div>
      <div><strong>Information</strong><a href="/insights">Insights</a><a href="/legal/privacy">Privacy</a><a href="/accessibility">Accessibility</a></div>
      <a className={styles.footerAction} href="/contact"><span>Begin your next step</span>Request an implant assessment</a>
    </div>
    <div className={styles.footerLegal}><span>St Mary’s House Dental Care · Shoreham-by-Sea</span><span>Founder review · production binding off</span></div>
  </footer>;
}

export default function GoldenImplantCleanroomPage() {
  const componentCards = "componentCards" in components ? components.componentCards : undefined;
  const assessmentLinks = "ctas" in assessment ? assessment.ctas : undefined;
  const planningLinks = "ctas" in planning ? planning.ctas : undefined;
  const steps = "steps" in stages ? stages.steps : undefined;
  const comparisonRows = "comparisonRows" in comparison ? comparison.comparisonRows : undefined;
  const costLinks = "ctas" in cost ? cost.ctas : undefined;
  const aftercareLinks = "ctas" in aftercare ? aftercare.ctas : undefined;
  const faqs = "faqs" in faq ? faq.faqs : undefined;
  const nextLinks = "ctas" in nextStep ? nextStep.ctas : undefined;

  return <main className={styles.page} data-candidate="CHAMPAGNE_GOLDEN_IMPLANT_CLEANROOM_CANDIDATE_V1" data-production-binding="false">
    <section className={styles.hero} data-semantic-id="implants.hero"><HeroV2LabAdapter route="/treatments/dental-implants" /></section>

    <section className={styles.opening} data-semantic-id={directAnswer.sectionId} data-reference="CVA-SECTION-B011-E01">
      <div className={styles.openingCopy}>
        <Chapter index="01">{directAnswer.eyebrow}</Chapter>
        <h1>{directAnswer.heading}</h1>
        <div className={styles.reading}>{paragraphs(directAnswer.visibleCopy.standard)}</div>
      </div>
      <Wave className={styles.openingWave} />
      <aside className={styles.roleRail} aria-label="The three roles in an implant restoration">
        <div><span>01</span><strong>Fixture</strong><p>Support within the jaw</p></div>
        <div><span>02</span><strong>Abutment</strong><p>The connecting component</p></div>
        <div><span>03</span><strong>Restoration</strong><p>The replacement tooth or teeth</p></div>
      </aside>
    </section>

    <section className={styles.components} data-semantic-id={components.sectionId} data-reference="CVA-SECTION-B032-E01">
      <header className={styles.componentsIntro}>
        <Chapter index="02" light>{components.eyebrow}</Chapter>
        <h2>{components.heading}</h2>
      </header>
      <div className={styles.modelStage} aria-label="Reserved future interactive Implant model stage">
        <div className={styles.modelTabs} aria-hidden="true"><span>Assembled</span><strong>Exploded</strong><span>Planning</span></div>
        <div className={styles.modelVoid}><span>Future approved interactive model</span><small>Static poster · interactive model · complete text alternative</small></div>
        <ol>{componentCards?.map((card, index) => <li key={card.answerObjectId}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{card.label}</strong><p>{card.copy}</p></div></li>)}</ol>
      </div>
      <div className={styles.componentsCopy}>
        <div className={styles.reading}>{paragraphs(components.visibleCopy.standard)}</div>
        <p className={styles.modelBoundary}>Generic education only · never patient-specific</p>
      </div>
    </section>

    <section className={styles.assessment} data-semantic-id={assessment.sectionId} data-reference="CVA-SURFACE-B038-E02">
      <div className={styles.assessmentCopy}>
        <Chapter index="03">{assessment.eyebrow}</Chapter>
        <h2>{assessment.heading}</h2>
        <div className={styles.reading}>{paragraphs(assessment.visibleCopy.standard)}</div>
        {assessmentLinks ? <Links ctas={assessmentLinks} /> : null}
      </div>
      <div className={styles.assessmentConstellation} aria-hidden="true" />
      <p className={styles.assessmentStatement}>The factors interact.<span>No public page can decide suitability for you.</span></p>
    </section>

    <section className={styles.planning} data-semantic-id={planning.sectionId} data-reference="CVA-SECTION-B029-E03">
      <div className={styles.planningCopy}>
        <Chapter index="04" light>{planning.eyebrow}</Chapter>
        <h2>{planning.heading}</h2>
        <div className={styles.reading}>{paragraphs(planning.visibleCopy.standard)}</div>
        {planningLinks ? <Links ctas={planningLinks} light /> : null}
      </div>
      <figure className={styles.planningStage}>
        <figcaption>Approved clinical planning media stage</figcaption>
        <div className={styles.planningField} aria-hidden="true"><i /><i /><i /><i /></div>
        <ol>
          <li><span>01</span><strong>Conversation</strong><small>What matters and needs understanding?</small></li>
          <li><span>02</span><strong>Examination</strong><small>What is healthy, changing or relevant?</small></li>
          <li><span>03</span><strong>Records</strong><small>What additional information is justified?</small></li>
          <li><span>04</span><strong>Explanation</strong><small>What are the realistic choices and trade-offs?</small></li>
        </ol>
      </figure>
    </section>

    <section className={styles.biology} data-semantic-id={stages.sectionId} data-reference="CVA-SECTION-B034-E04">
      <div className={styles.biologyIntro}>
        <Chapter index="05">{stages.eyebrow}</Chapter>
        <h2>{stages.heading}</h2>
        <p>{stages.visibleCopy.standard}</p>
      </div>
      <ol className={styles.biologicalFlow}>{steps?.map((step, index) => <li key={step.contentStageId}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.copy}</p></div></li>)}</ol>
      <Wave className={styles.biologyWave} />
    </section>

    <section className={styles.options} data-semantic-id={comparison.sectionId} data-reference="F06">
      <header className={styles.optionsIntro}>
        <div><Chapter index="06">{comparison.eyebrow}</Chapter><h2>{comparison.heading}</h2></div>
        <p>{comparison.visibleCopy.standard}</p>
      </header>
      <div className={styles.comparisonFrame}>
        <table>
          <thead><tr><th>Pathway</th><th>What it does</th><th>Neighbouring teeth</th><th>Fixed or removable</th><th>Maintenance</th><th>Broad limitations</th></tr></thead>
          <tbody>{comparisonRows?.map((row) => <tr key={row.option}><th scope="row">{row.option}</th><td>{row.purpose}</td><td>{row.adjacentTeeth}</td><td>{row.removability}</td><td>{row.maintenance}</td><td>{row.broadLimitations}</td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section className={styles.balance} data-semantic-id={benefitsRisks.sectionId} data-reference="F02">
      <div className={styles.balanceTitle}><Chapter index="07">{benefitsRisks.eyebrow}</Chapter><h2>{benefitsRisks.heading}</h2></div>
      <div className={styles.balanceCopy}>{paragraphs(benefitsRisks.visibleCopy.standard)}</div>
      <div className={styles.balancePersian}><Wave /><p>Potential benefit <span>must be weighed with</span> limitation and risk</p></div>
    </section>

    <section className={styles.cost} data-semantic-id={cost.sectionId}>
      <div className={styles.costCopy}><Chapter index="08">{cost.eyebrow}</Chapter><h2>{cost.heading}</h2><div className={styles.reading}>{paragraphs(cost.visibleCopy.standard)}</div>{costLinks ? <Links ctas={costLinks} /> : null}</div>
      <aside className={styles.costRail}><span>A responsible fee conversation follows</span><strong>Assessment</strong><i /><strong>Options</strong><i /><strong>A written plan</strong></aside>
    </section>

    <section className={styles.aftercare} data-semantic-id={aftercare.sectionId} data-reference="CVA-SECTION-B011-E02">
      <div className={styles.aftercareCopy}><Chapter index="09" light>{aftercare.eyebrow}</Chapter><h2>{aftercare.heading}</h2><div className={styles.reading}>{paragraphs(aftercare.visibleCopy.standard)}</div>{aftercareLinks ? <Links ctas={aftercareLinks} light /> : null}</div>
      <div className={styles.careRail} aria-label="Long-term care themes"><div><span>01</span><strong>Clean</strong></div><div><span>02</span><strong>Review</strong></div><div><span>03</span><strong>Respond</strong></div></div>
      <Wave className={styles.aftercareWave} />
    </section>

    <section className={styles.faq} data-semantic-id={faq.sectionId} data-reference="CVA-SEQUENCE-B009-E01">
      <div className={styles.faqIntro}><Chapter index="10" light>{faq.eyebrow}</Chapter><h2>{faq.heading}</h2><p>{faq.visibleCopy.standard}</p></div>
      <div className={styles.faqList}>{faqs?.map((item, index) => <details key={item.answerObjectId} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div>
    </section>

    <section className={styles.closing} data-semantic-id={nextStep.sectionId} data-reference="CVA-BAND-B020-E03">
      <Wave />
      <div className={styles.closingCopy}><Chapter index="11">{nextStep.eyebrow}</Chapter><h2>{nextStep.heading}</h2><p>{nextStep.visibleCopy.standard}</p>{nextLinks ? <Links ctas={nextLinks} /> : null}</div>
    </section>

    <GoldenImplantFooter />
  </main>;
}
