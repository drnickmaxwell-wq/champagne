import { HeroV2LabAdapter } from "./HeroV2LabAdapter";

export function HomepagePrototype({ variant }: { variant: "A" | "B" }) {
  return <article className={`dl-homepage-prototype dl-homepage-${variant.toLowerCase()}`}>
    <a className="dl-back-studio" href="/champagne/design-lab">← Back to Design Studio</a>
    <HeroV2LabAdapter route="/" />
    {variant === "A" ? <HomepageA /> : <HomepageB />}
    <PrototypeFooter variant={variant} />
  </article>;
}

function HomepageA() {
  return <>
    <section className="dl-web-intro"><div><p>Dental care, considered differently</p><h1>A calm place for complex and everyday dentistry.</h1><p>Champagne brings careful planning, modern dentistry and a genuinely personal welcome together at St Mary’s House.</p><a href="#pathways">Explore your options</a></div><MediaPlaceholder title="St Mary’s House exterior photography" detail="Architectural practice image" /></section>
    <section id="pathways" className="dl-web-pathways"><header><p>Start with what matters to you</p><h2>Thoughtful pathways, not a treatment conveyor belt.</h2></header><div><Pathway number="01" title="Restore confidence" text="Explore considered restorative and cosmetic options." /><Pathway number="02" title="Replace missing teeth" text="Understand implant and non-implant pathways." /><Pathway number="03" title="Feel comfortable here" text="A calmer route for nervous patients and complex care." /></div></section>
    <section className="dl-web-founder"><MediaPlaceholder title="Founder environmental portrait" detail="Dr Nick Maxwell at St Mary’s House" /><div><p>Founder-led care</p><h2>Clinical experience with time to listen.</h2><p>Meet the people responsible for your care, beginning with the Founder and then the wider team around you.</p><a href="#team">Meet Dr Nick Maxwell</a></div></section>
    <section id="team" className="dl-web-team"><div><p>Your team</p><h2>Familiar faces. Joined-up care.</h2><p>The team chapter remains deliberately separate from Founder authority: warm, human and focused on continuity.</p></div><div className="dl-portrait-pair"><MediaPlaceholder title="Team portrait" detail="Approved team photography" /><MediaPlaceholder title="Clinical environment" detail="Team at work, without patient data" /></div></section>
    <section className="dl-web-technology"><div><p>Digital dentistry with purpose</p><h2>Technology should make care clearer—not colder.</h2><p>Planning and communication tools are presented as support for clinical judgment, never as spectacle or automated certainty.</p></div><div className="dl-tech-orbit" aria-hidden="true"><span /><span /><span /></div></section>
    <HeritageSection />
    <section className="dl-web-visit"><div><p>Visit St Mary’s House</p><h2>A distinctive practice on Shoreham’s historic high street.</h2></div><div><p>Practical arrival, access and contact details will sit here once verified for publication.</p><a href="#closing">Plan your visit</a></div></section>
    <Closing />
  </>;
}

function HomepageB() {
  return <>
    <section className="dl-web-b-opening"><div><p>Welcome to Champagne</p><h1>Precision, warmth and a different kind of dental experience.</h1><p>A more architectural direction: deeper Persian chapters, luminous transitions and concise decision points.</p></div><MediaPlaceholder title="St Mary’s House arrival film still" detail="Static until approved practice film exists" /></section>
    <section className="dl-web-b-decisions"><header><p>How can we help?</p><h2>Begin with the decision in front of you.</h2></header><div><Pathway number="A" title="I want to improve my smile" text="Explore cosmetic and restorative choices calmly." /><Pathway number="B" title="I need to replace teeth" text="Compare suitable pathways and their limits." /><Pathway number="C" title="I am anxious about treatment" text="See how a gentler visit can be planned." /><Pathway number="D" title="I need ongoing care" text="Discover a long-term relationship with the practice." /></div></section>
    <section className="dl-web-b-authority"><div><p>Complex care, made understandable</p><h2>Clarity before commitment.</h2><p>This direction gives the strongest Persian moment to explanation and authority, with a restrained gold line guiding the eye through the page.</p><a href="#founder-b">See how we plan care</a></div><div className="dl-architectural-mark" aria-hidden="true" /></section>
    <section id="founder-b" className="dl-web-b-founder"><div><p>Dr Nick Maxwell</p><h2>A Founder’s standard, shared by a team.</h2><p>Founder identity remains distinct, followed immediately by the warm team continuity that supports every visit.</p></div><MediaPlaceholder title="Founder portrait at the practice" detail="Genuine environmental portrait required" /></section>
    <section className="dl-web-b-team"><MediaPlaceholder title="Champagne team portrait" detail="Warm, editorial group photography" /><div><p>People before process</p><h2>Care feels better when it feels connected.</h2><p>A lighter Porcelain pause breaks the deeper page rhythm and makes the team chapter feel human rather than corporate.</p></div></section>
    <section className="dl-web-b-luminous"><div className="dl-tech-orbit" aria-hidden="true"><span /><span /><span /></div><div><p>See the plan</p><h2>Digital tools that help you understand your choices.</h2><p>A luminous moment for scanning, planning and communication—without fabricated clinical imagery or promises.</p></div></section>
    <HeritageSection />
    <section className="dl-web-b-faq"><div><p>Before you visit</p><h2>Questions deserve calm, direct answers.</h2></div><div><details><summary>Where should I begin?</summary><p>Start with the concern or change that matters most to you.</p></details><details><summary>Can I discuss more than one option?</summary><p>Yes. The page architecture is designed around comparison and informed decisions.</p></details><details><summary>What happens next?</summary><p>Contact and booking remain requests until the practice confirms them.</p></details></div></section>
    <Closing />
  </>;
}

function Pathway({ number, title, text }: { number: string; title: string; text: string }) { return <article><span>{number}</span><h3>{title}</h3><p>{text}</p><a href="#closing">Explore →</a></article>; }
function MediaPlaceholder({ title, detail }: { title: string; detail: string }) { return <figure className="dl-media-placeholder"><div aria-hidden="true"><span /><span /><span /></div><figcaption><strong>{title}</strong><small>{detail}</small></figcaption></figure>; }
function HeritageSection() { return <section className="dl-web-heritage"><div className="dl-house-line" aria-hidden="true"><span /><span /><span /></div><div><p>St Mary’s House</p><h2>Modern dentistry in a place with a story.</h2><p>The heritage chapter is static and architectural. Film remains off until genuine footage, rights and approval exist.</p><a href="#closing">Discover the practice</a></div></section>; }
function Closing() { return <section id="closing" className="dl-web-closing"><p>When you are ready</p><h2>Let’s make the next step feel clear.</h2><p>Ask a question, explore a treatment or request a consultation with the practice.</p><div><a href="#">Request a consultation</a><a href="#">Ask the Concierge</a></div></section>; }
function PrototypeFooter({ variant }: { variant: "A" | "B" }) { return <footer className="dl-web-footer"><div><strong>Champagne Dental Care</strong><p>St Mary’s House · Shoreham-by-Sea</p></div><div><a href="#">Treatments</a><a href="#">Our team</a><a href="#">Visit</a><a href="#">Contact</a></div><p>Homepage direction {variant} · Founder preview only</p></footer>; }

