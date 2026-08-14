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
  return <svg className={styles.houseLineArt} aria-hidden="true" viewBox="0 0 360 170" preserveAspectRatio="xMinYMax meet">
    <path d="M8 160h344M24 160V77l23-15V30h11v25l27-18h118l29 20V29h12v37l28 17v77M35 83h226M35 105h226M35 132h226M48 77V62h167v15M61 55V20h13v27M190 48V14h14v35M75 160v-51h35v51M119 160v-51h35v51M164 160v-51h35v51M212 160v-46h32v46M48 89h18v16H48zM78 89h18v16H78zM109 89h18v16h-18zM140 89h18v16h-18zM171 89h18v16h-18zM202 89h18v16h-18zM232 89h18v16h-18zM49 117h17v15H49zM231 117h18v15h-18zM272 160V92l22-13 34 18v63M283 105h34M280 128h42M291 160v-37h19v37M281 112h10v12h-10zM311 112h9v12h-9z" />
    <path d="M18 160c33-8 59-9 88-5 38 5 73 5 111-1 40-6 77-6 129 3M25 75l79-50 124 31 42 27M40 71l67-39 112 28M92 37l12-18 14 16M101 19h9v12" />
  </svg>;
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
      <div className={styles.spectrumCurrents} aria-hidden="true"><i /><i /><i /><span>{Array.from({ length: 46 }, (_, index) => <b key={index} style={{ "--current-offset": `${-69 + (index * 2.75)}%`, "--current-rotation": `${-13 + (index * .3)}deg` } as CSSProperties} />)}</span></div>
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
      <svg className={styles.footerWave} aria-hidden="true" viewBox="0 0 1167 279" preserveAspectRatio="none">
        <path className={styles.footerWaveFill} d="M0 138C104 143 196 170 302 161C412 152 488 105 600 96C767 82 948 105 1167 62V279H0Z" />
        {Array.from({ length: 19 }, (_, index) => <path key={index} style={{ "--strand-offset": `${6 + (index * 1.55)}px` } as CSSProperties} d="M-18 132C98 136 193 164 300 155C411 146 487 99 599 90C766 77 950 99 1182 54" />)}
      </svg>
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
