import Link from "next/link";

export default function TreatmentTechHighlight() {
  const highlights = [
    {
      title: "CBCT for precision",
      body: "3D imaging to map bone, nerves, and restorative clearances before any implant or veneer prep.",
    },
    {
      title: "3D printing & guides",
      body: "Same-day bite guards and surgical guides keep treatments predictable and time-efficient.",
    },
    {
      title: "Digital planning",
      body: "Photo and scan driven simulations so patients preview alignment, shade, and tooth proportion.",
    },
  ];

  return (
    <section className="cpv-card" aria-labelledby="treatments-tech-heading">
      <div className="cpv-card__inner cpv-card__inner--stack">
        <div className="cpv-card__header">
          <p className="cpv-card__eyebrow text-eyebrow">Technology</p>
          <div className="cpv-card__heading">
            <h2 className="cpv-card__title text-display-sm" id="treatments-tech-heading">
              Tech woven into every pathway
            </h2>
            <p className="cpv-card__lead text-lead text-body">
              Mirrors the schema map technology targets — CBCT, 3D printing, intraoral scanning — without breaking the preview shell.
            </p>
          </div>
        </div>
        <div className="tech-grid">
          {highlights.map((item) => (
            <article key={item.title} className="tech-grid__item">
              <h3 className="text-lead font-semibold">{item.title}</h3>
              <p className="text-body">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="tech-grid__cta">
          <Link className="cpv-btn cpv-btn-outline text-eyebrow" href="/technology">
            Explore digital dentistry
          </Link>
        </div>
      </div>
    </section>
  );
}
