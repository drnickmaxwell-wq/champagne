import type { ReactNode } from "react";
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

export function ArchitecturalCta({ label, href, variant = "gold", compact = false }: LinkSlot & { variant?: "gold" | "teal" | "magenta"; compact?: boolean }) {
  return (
    <a className={`${styles.architecturalCta} ${styles[variant]}`} data-compact={compact} href={href}>
      <span>{label}</span><i aria-hidden="true"><ArrowIcon /></i>
    </a>
  );
}

export function DecisionClaritySection({
  heading, intro, benefits, limitations, alternatives, questions, summary, action,
}: {
  heading: string; intro: string; benefits: string[]; limitations: string[]; alternatives: string[];
  questions: string[]; summary: string; action: LinkSlot;
}) {
  const columns = [
    { title: "Benefits", items: benefits, tone: "teal" },
    { title: "Limitations", items: limitations, tone: "gold" },
    { title: "Alternatives", items: alternatives, tone: "magenta" },
    { title: "Questions to ask", items: questions, tone: "teal" },
  ];
  return (
    <section className={styles.decisionClarity} data-a2-component="A2-DECISION-CLARITY-01" aria-labelledby="decision-clarity-heading">
      <header><span>05</span><div><h2 id="decision-clarity-heading">{heading}</h2><p>{intro}</p></div></header>
      <div className={styles.decisionColumns}>
        {columns.map((column) => <section key={column.title} data-tone={column.tone}><h3>{column.title}</h3><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
        <aside><strong>In summary</strong><p>{summary}</p><ArchitecturalCta {...action} variant="magenta" /></aside>
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
      <div className={styles.spectrumCurrents} aria-hidden="true"><i /><i /><i /></div>
      <h2 id="spectrum-band-heading">{heading}</h2><ArchitecturalCta {...action} variant="magenta" />
    </section>
  );
}

export function PorcelainDescentFooter({
  practiceName, tagline, groups, closingAction, legalLinks,
}: {
  practiceName: string; tagline: string; groups: Array<{ heading: string; links: LinkSlot[] }>;
  closingAction: LinkSlot; legalLinks: LinkSlot[];
}) {
  return (
    <footer className={styles.descentFooter} data-a2-component="A2-PORCELAIN-DESCENT-FOOTER-01">
      <div className={styles.footerLedge}>
        <div className={styles.footerIdentity}><strong>{practiceName}</strong><span>{tagline}</span></div>
        <nav aria-label="Footer navigation">{groups.map((group) => <section key={group.heading}><h2>{group.heading}</h2>{group.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</section>)}</nav>
        <ArchitecturalCta {...closingAction} variant="gold" />
      </div>
      <div className={styles.footerWave} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.footerLegal}><span>St Mary’s House Dental Care</span><nav aria-label="Legal information">{legalLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav></div>
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
