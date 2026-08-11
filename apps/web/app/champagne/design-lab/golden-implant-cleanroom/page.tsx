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

function Eyebrow({ children, index }: { children: ReactNode; index: string }) {
  return <p className={styles.eyebrow}><span>{index}</span>{children}</p>;
}

function Links({ ctas, quiet = false }: { ctas: ReadonlyArray<{ label: string; href: string }>; quiet?: boolean }) {
  return <div className={quiet ? styles.quietLinks : styles.links}>{ctas.map((cta, index) => <a href={cta.href} key={`${cta.href}-${cta.label}`} data-primary={index === 0 || undefined}>{cta.label}<span aria-hidden="true">→</span></a>)}</div>;
}

function WaveCurrent({ quiet = false }: { quiet?: boolean }) {
  return <div className={quiet ? styles.waveCurrentQuiet : styles.waveCurrent} aria-hidden="true" />;
}

function GoldenImplantFooter() {
  return <footer className={styles.footer}>
    <div className={styles.footerPorcelain}>
      <div className={styles.footerBrand}><strong>St Mary’s House<br />Dental Care</strong><span>Going the extra smile</span></div>
      <nav aria-label="Footer pathways">
        <a href="/treatments">Explore treatments <span aria-hidden="true">→</span></a>
        <a href="/about">Meet the team <span aria-hidden="true">→</span></a>
        <a href="/contact">Plan your visit <span aria-hidden="true">→</span></a>
      </nav>
    </div>
    <div className={styles.footerDescent} aria-hidden="true"><WaveCurrent /></div>
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
  return <main className={styles.page} data-candidate="CHAMPAGNE_GOLDEN_IMPLANT_CLEANROOM_CANDIDATE_V1" data-production-binding="false">
    <section className={styles.hero} data-semantic-id="implants.hero"><HeroV2LabAdapter route="/treatments/dental-implants" /></section>

    <section className={styles.opening} data-semantic-id={directAnswer.sectionId}>
      <div className={styles.openingDepth} aria-hidden="true"><WaveCurrent /></div>
      <div className={styles.openingCopy}>
        <Eyebrow index="01">{directAnswer.eyebrow}</Eyebrow>
        <h1>{directAnswer.heading}</h1>
        <div className={styles.reading}>{paragraphs(directAnswer.visibleCopy.standard)}</div>
      </div>
      <div className={styles.openingConstellation} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <aside className={styles.openingRoles} aria-label="The three roles in an implant restoration">
        <span><b>Fixture</b>support within the jaw</span>
        <span><b>Abutment</b>the connecting component</span>
        <span><b>Restoration</b>the replacement tooth or teeth</span>
      </aside>
    </section>

    <section className={styles.components} data-semantic-id={components.sectionId}>
      <div className={styles.componentsCopy}>
        <Eyebrow index="02">{components.eyebrow}</Eyebrow>
        <h2>{components.heading}</h2>
        <div className={styles.reading}>{paragraphs(components.visibleCopy.standard)}</div>
        {"componentCards" in components && components.componentCards ? <ol className={styles.componentList}>{components.componentCards.map((card, index) => <li key={card.answerObjectId}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{card.label}</strong><p>{card.copy}</p></div></li>)}</ol> : null}
      </div>
      <div className={styles.futureStage} aria-label="Reserved future interactive Implant model stage">
        <div className={styles.stageOrbit} aria-hidden="true"><i /><i /><i /><b /><b /><b /></div>
        <div className={styles.stagePlane}>
          <span>Future interactive education stage</span>
          <strong>Relationships,<br />not a diagnosis.</strong>
          <p>Reserved for the approved Champagne Implant model. No rejected procedural anatomy or generated Implant media is present.</p>
          <small>Static poster · interactive model · complete text alternative</small>
        </div>
      </div>
      <WaveCurrent />
    </section>

    <section className={styles.assessment} data-semantic-id={assessment.sectionId}>
      <div className={styles.assessmentArc} aria-hidden="true"><WaveCurrent quiet /></div>
      <div className={styles.assessmentTitle}><Eyebrow index="03">{assessment.eyebrow}</Eyebrow><h2>{assessment.heading}</h2></div>
      <div className={styles.assessmentCopy}>{paragraphs(assessment.visibleCopy.standard)}{"ctas" in assessment && assessment.ctas ? <Links ctas={assessment.ctas} quiet /> : null}</div>
      <p className={styles.assessmentStatement}>The factors interact.<br /><span>No public page can decide for you.</span></p>
    </section>

    <section className={styles.planning} data-semantic-id={planning.sectionId}>
      <div className={styles.planningCopy}>
        <Eyebrow index="04">{planning.eyebrow}</Eyebrow>
        <h2>{planning.heading}</h2>
        <div className={styles.reading}>{paragraphs(planning.visibleCopy.standard)}</div>
        {"ctas" in planning && planning.ctas ? <Links ctas={planning.ctas} quiet /> : null}
      </div>
      <figure className={styles.questionMap}>
        <figcaption>Each record begins with a question</figcaption>
        <div aria-hidden="true" className={styles.questionRings}><i /><i /><i /><i /></div>
        <ol>
          <li><span>01</span><strong>Conversation</strong><small>What matters, and what needs understanding?</small></li>
          <li><span>02</span><strong>Examination</strong><small>What is healthy, changing or relevant?</small></li>
          <li><span>03</span><strong>Records</strong><small>What additional information is justified?</small></li>
          <li><span>04</span><strong>Explanation</strong><small>What are the realistic choices and trade-offs?</small></li>
        </ol>
      </figure>
    </section>

    <section className={styles.biology} data-semantic-id={stages.sectionId}>
      <div className={styles.biologyIntro}><Eyebrow index="05">{stages.eyebrow}</Eyebrow><h2>{stages.heading}</h2><p>{stages.visibleCopy.standard}</p></div>
      {"steps" in stages && stages.steps ? <ol className={styles.biologicalFlow}>{stages.steps.map((step, index) => <li key={step.contentStageId}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.copy}</p></div></li>)}</ol> : null}
      <WaveCurrent quiet />
    </section>

    <section className={styles.options} data-semantic-id={comparison.sectionId}>
      <div className={styles.optionsIntro}><Eyebrow index="06">{comparison.eyebrow}</Eyebrow><h2>{comparison.heading}</h2><p>{comparison.visibleCopy.standard}</p></div>
      {"comparisonRows" in comparison && comparison.comparisonRows ? <div className={styles.comparisonFrame}><table><thead><tr><th>Pathway</th><th>What it does</th><th>Neighbouring teeth</th><th>Fixed or removable</th><th>Maintenance</th><th>Broad limitations</th></tr></thead><tbody>{comparison.comparisonRows.map((row) => <tr key={row.option}><th scope="row">{row.option}</th><td>{row.purpose}</td><td>{row.adjacentTeeth}</td><td>{row.removability}</td><td>{row.maintenance}</td><td>{row.broadLimitations}</td></tr>)}</tbody></table></div> : null}
    </section>

    <section className={styles.balance} data-semantic-id={benefitsRisks.sectionId}>
      <div className={styles.balanceHalo} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.balanceTitle}><Eyebrow index="07">{benefitsRisks.eyebrow}</Eyebrow><h2>{benefitsRisks.heading}</h2></div>
      <div className={styles.balanceCopy}>{paragraphs(benefitsRisks.visibleCopy.standard)}</div>
      <p className={styles.balanceMarker}>Potential benefit <span>must be weighed with</span> limitation and risk</p>
    </section>

    <section className={styles.cost} data-semantic-id={cost.sectionId}>
      <div className={styles.costSteps} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.costCopy}><Eyebrow index="08">{cost.eyebrow}</Eyebrow><h2>{cost.heading}</h2><div className={styles.reading}>{paragraphs(cost.visibleCopy.standard)}</div>{"ctas" in cost && cost.ctas ? <Links ctas={cost.ctas} quiet /> : null}</div>
      <aside className={styles.costAside}><span>A responsible fee conversation follows</span><strong>Assessment</strong><i /><strong>Options</strong><i /><strong>A written plan</strong></aside>
    </section>

    <section className={styles.aftercare} data-semantic-id={aftercare.sectionId}>
      <div className={styles.aftercareCopy}><Eyebrow index="09">{aftercare.eyebrow}</Eyebrow><h2>{aftercare.heading}</h2><div className={styles.reading}>{paragraphs(aftercare.visibleCopy.standard)}</div></div>
      <div className={styles.careOrbit} aria-hidden="true"><i /><i /><i /><span>clean</span><span>review</span><span>respond</span></div>
      {"ctas" in aftercare && aftercare.ctas ? <Links ctas={aftercare.ctas} /> : null}
      <WaveCurrent />
    </section>

    <section className={styles.faq} data-semantic-id={faq.sectionId}>
      <div className={styles.faqIntro}><Eyebrow index="10">{faq.eyebrow}</Eyebrow><h2>{faq.heading}</h2><p>{faq.visibleCopy.standard}</p></div>
      {"faqs" in faq && faq.faqs ? <div className={styles.faqList}>{faq.faqs.map((item, index) => <details key={item.answerObjectId} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div> : null}
      <div className={styles.faqPersian} aria-hidden="true"><WaveCurrent quiet /></div>
    </section>

    <section className={styles.closing} data-semantic-id={nextStep.sectionId}>
      <WaveCurrent />
      <div className={styles.closingCopy}><Eyebrow index="11">{nextStep.eyebrow}</Eyebrow><h2>{nextStep.heading}</h2><p>{nextStep.visibleCopy.standard}</p>{"ctas" in nextStep && nextStep.ctas ? <Links ctas={nextStep.ctas} /> : null}</div>
    </section>

    <GoldenImplantFooter />
  </main>;
}
