import type { CSSProperties, ReactNode } from "react";
import styles from "./reconstructed.module.css";

export const A2_COMPONENT_IDS = [
  "A2-DECISION-CLARITY-01",
  "A2-CLINICIAN-INSIGHT-01",
  "A2-SPECTRUM-CLOSING-BAND-01",
  "A2-PORCELAIN-DESCENT-FOOTER-01",
  "A2-ARCHITECTURAL-CTA-01",
  "A2-CLINICIAN-CREDENTIAL-CARD-01",
  "A2-PORCELAIN-CONSTELLATION-STRIP-01",
  "A2-QUESTION-FIRST-PANEL-01",
] as const;

export type A2ComponentId = (typeof A2_COMPONENT_IDS)[number];

type LinkSlot = { label: string; href: string };
type EvidenceItem = { label: string; detail: string };

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M14 7l5 5-5 5" /></svg>;
}

function QuestionIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 0 1 4.6 1c0 2-2.4 2.1-2.4 4M12 17.5v.1" /></svg>;
}

function DecisionIcon({ kind }: { kind: "heart" | "alert" | "arrows" | "question" }) {
  if (kind === "heart") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.8c-2.2-2.2-5.7-1.9-7.6.5L12 6.8l-1.2-1.5C8.9 2.9 5.4 2.6 3.2 4.8.8 7.2 1 11 3.6 13.4L12 21l8.4-7.6c2.6-2.4 2.8-6.2.4-8.6Z" /></svg>;
  if (kind === "alert") return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 6.8v7M12 17.2v.1" /></svg>;
  if (kind === "arrows") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h15M15 3l4 4-4 4M20 17H5M9 13l-4 4 4 4" /></svg>;
  return <QuestionIcon />;
}

function PracticeMark() {
  return <svg className={styles.practiceMark} aria-hidden="true" viewBox="0 0 64 64"><g>{Array.from({ length: 8 }, (_, index) => <ellipse key={index} cx="32" cy="16" rx="7" ry="14" transform={`rotate(${index * 45} 32 32)`} />)}</g><circle cx="32" cy="32" r="8" /></svg>;
}

function HouseLineArt() {
  return <svg className={styles.houseLineArt} aria-hidden="true" viewBox="0 0 360 150" preserveAspectRatio="xMidYMax meet"><path d="M18 140h324M38 140V61l28-16h83l22 16v79M62 45V22h13v23M143 45V17h14v34M48 71h112M49 93h111M49 116h111M82 140V93h43v47M57 78h15v15H57zM88 78h15v15H88zM120 78h15v15h-15zM135 100h15v16h-15zM181 140V79l25-13h73l29 17v57M198 89h92M194 112h101M215 140v-36h40v36M202 94h14v14h-14zM266 94h14v14h-14z" /></svg>;
}

export function ArchitecturalCta({ label, href, variant = "gold", compact = false }: LinkSlot & { variant?: "gold" | "teal" | "magenta"; compact?: boolean }) {
  return (
    <a className={`${styles.architecturalCta} ${styles[variant]}`} data-compact={compact} href={href}>
      <span>{label}</span><i aria-hidden="true"><ArrowIcon /></i>
    </a>
  );
}

export function DecisionClaritySection({
  eyebrow = "Porcelain risks & decisions", chapter = "05", heading, intro, benefits, limitations, alternatives, questions, summary, action,
}: {
  eyebrow?: string; chapter?: string; heading: string; intro: string; benefits: string[]; limitations: string[]; alternatives: string[];
  questions: string[]; summary: string; action: LinkSlot;
}) {
  const columns = [
    { title: "Benefits", items: benefits, tone: "teal", icon: "heart" as const },
    { title: "Limitations", items: limitations, tone: "gold", icon: "alert" as const },
    { title: "Alternatives", items: alternatives, tone: "teal", icon: "arrows" as const },
    { title: "Questions to ask", items: questions, tone: "teal", icon: "question" as const },
  ];
  return (
    <section className={styles.decisionClarity} data-a2-component="A2-DECISION-CLARITY-01" aria-labelledby="decision-clarity-heading">
      <header><span>{chapter}</span><div><small>{eyebrow}</small><h2 id="decision-clarity-heading">{heading}<i aria-hidden="true">◆</i></h2><p>{intro}</p></div></header>
      <div className={styles.decisionColumns}>
        {columns.map((column) => <section key={column.title} data-tone={column.tone}><h3><DecisionIcon kind={column.icon} /><span>{column.title}</span></h3><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
        <aside><strong>In summary <i aria-hidden="true">◆</i></strong><p>{summary}</p><a href={action.href}>{action.label}<ArrowIcon /></a></aside>
      </div>
    </section>
  );
}

export function ClinicianInsightSection({
  heading, body, related, portrait, credentials,
}: {
  heading: string; body: string; related: LinkSlot; portrait?: ReactNode; credentials: EvidenceItem[];
}) {
  return (
    <section className={styles.clinicianInsight} data-a2-component="A2-CLINICIAN-INSIGHT-01" aria-labelledby="clinician-insight-heading">
      <div className={styles.insightEditorial}>
        <h2 id="clinician-insight-heading">{heading}</h2><p>{body}</p>
        <a href={related.href}><span>Related treatment</span><strong>{related.label}</strong><ArrowIcon /></a>
      </div>
      <div className={styles.insightProof}>
        <div className={styles.portraitSlot}>{portrait ?? <span aria-label="Approved clinician portrait required"><b>DM</b>Approved portrait slot</span>}</div>
        <dl>{credentials.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl>
      </div>
    </section>
  );
}

export function SpectrumConsultationBand({ heading, action }: { heading: string; action: LinkSlot }) {
  return (
    <section className={styles.spectrumBand} data-a2-component="A2-SPECTRUM-CLOSING-BAND-01" aria-labelledby="spectrum-band-heading">
      <div className={styles.spectrumCurrents} aria-hidden="true"><i /><i /><i /><span>{Array.from({ length: 18 }, (_, index) => <b key={index} style={{ "--current": index } as CSSProperties} />)}</span></div>
      <h2 id="spectrum-band-heading">{heading}</h2><div className={styles.spectrumRule} aria-hidden="true"><i /></div><a className={styles.spectrumAction} href={action.href}>{action.label}</a>
    </section>
  );
}

export function PorcelainDescentFooter({
  practiceName, tagline, groups, utilityLinks = [], closingAction, legalLinks,
}: {
  practiceName: string; tagline: string; groups: Array<{ heading: string; links: LinkSlot[] }>;
  utilityLinks?: LinkSlot[]; closingAction: LinkSlot; legalLinks: LinkSlot[];
}) {
  return (
    <footer className={styles.descentFooter} data-a2-component="A2-PORCELAIN-DESCENT-FOOTER-01">
      <div className={styles.footerLedge}>
        <HouseLineArt />
        <div className={styles.footerIdentity}><PracticeMark /><div><strong>{practiceName}</strong><span>{tagline}</span></div></div>
        <nav className={styles.footerUtilities} aria-label="Footer shortcuts">{utilityLinks.map((link) => <a key={link.label} href={link.href}>{link.label}<ArrowIcon /></a>)}</nav>
      </div>
      <div className={styles.footerWave} aria-hidden="true">{Array.from({ length: 11 }, (_, index) => <i key={index} style={{ "--strand": index } as CSSProperties} />)}</div>
      <div className={styles.footerDepth}>
        <nav aria-label="Footer navigation">{groups.map((group) => <section key={group.heading}><h2>{group.heading}</h2>{group.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</section>)}</nav>
        <a className={styles.footerAction} href={closingAction.href}><strong>{closingAction.label}</strong><span>Arrange a consultation<br />in confidence.</span></a>
      </div>
      <div className={styles.footerLegal}><nav aria-label="Legal information">{legalLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav><span>© {practiceName}</span></div>
    </footer>
  );
}

export function ClinicianCredentialCard({ portrait, name, role, credentials }: { portrait?: ReactNode; name: string; role: string; credentials: EvidenceItem[] }) {
  return (
    <article className={styles.credentialCard} data-a2-component="A2-CLINICIAN-CREDENTIAL-CARD-01">
      <div className={styles.credentialPortrait}>{portrait ?? <span aria-label="Approved clinician portrait required"><b>{name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</b>Portrait slot</span>}</div>
      <div><header><h2>{name}</h2><p>{role}</p></header><dl>{credentials.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl></div>
    </article>
  );
}

export function PorcelainConstellationStrip({ heading, body, proofItems }: { heading: string; body: string; proofItems: EvidenceItem[] }) {
  return (
    <section className={styles.constellationStrip} data-a2-component="A2-PORCELAIN-CONSTELLATION-STRIP-01" aria-labelledby="constellation-heading">
      <div className={styles.dotField} aria-hidden="true" />
      <header><span>02</span><h2 id="constellation-heading">{heading}</h2><p>{body}</p></header>
      <dl>{proofItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.detail}</dd></div>)}</dl>
    </section>
  );
}

export function QuestionFirstPanel({ question, action }: { question: string; action: LinkSlot }) {
  return (
    <aside className={styles.questionPanel} data-a2-component="A2-QUESTION-FIRST-PANEL-01">
      <QuestionIcon /><div><p>{question}</p><a href={action.href}>{action.label}<ArrowIcon /></a></div>
    </aside>
  );
}
