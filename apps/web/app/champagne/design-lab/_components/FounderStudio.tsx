"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { PERSIAN_CANDIDATES, PORCELAIN_CANDIDATES } from "../data/materials";

type StudioMode = "persian" | "porcelain";
type LabStyle = CSSProperties & Record<`--${string}`, string>;
const colour = (channels: readonly number[]) => `${["r", "g", "b"].join("")}(${channels.join(" ")})`;
const FEEDBACK: Record<StudioMode, string[]> = {
  persian: ["Favourite", "Keep", "Reject", "Too dark", "Too bright", "Too purple", "Too cold", "Too flat"],
  porcelain: ["Favourite", "Keep", "Reject", "Too white", "Too cream", "Too clinical", "Too dull", "Too warm", "Too cold"],
};

export function FounderStudio({ hero }: { hero: ReactNode }) {
  const [mode, setMode] = useState<StudioMode>("persian");
  const [persianIndex, setPersianIndex] = useState(0);
  const [porcelainIndex, setPorcelainIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  useEffect(() => {
    try { setResponses(JSON.parse(localStorage.getItem("champagne-design-lab-material-feedback") ?? "{}")); } catch { /* Ignore invalid old state. */ }
  }, []);
  const candidates = mode === "persian" ? PERSIAN_CANDIDATES : PORCELAIN_CANDIDATES;
  const index = mode === "persian" ? persianIndex : porcelainIndex;
  const candidate = candidates[index];
  const key = `${mode}:${candidate.id}`;
  const selectedResponses = responses[key] ?? [];
  const setIndex = (next: number) => mode === "persian" ? setPersianIndex(next) : setPorcelainIndex(next);
  const move = (delta: number) => setIndex((index + delta + candidates.length) % candidates.length);
  const chooseResponse = (response: string) => setResponses((current) => {
    const existing = current[key] ?? [];
    const next = { ...current, [key]: existing.includes(response) ? existing.filter((item) => item !== response) : [...existing, response] };
    localStorage.setItem("champagne-design-lab-material-feedback", JSON.stringify(next));
    return next;
  });
  const persian = PERSIAN_CANDIDATES[persianIndex];
  const porcelain = PORCELAIN_CANDIDATES[porcelainIndex];
  const primaryValue = mode === "persian" ? colour(persian.canvas) : colour(porcelain.base);
  const style: LabStyle = {
    "--surface-ink": colour(persian.canvas),
    "--surface-ink-soft": colour(persian.elevated),
    "--bg-ink": colour(persian.canvas),
    "--bg-ink-soft": colour(persian.elevated),
    "--surface-0": colour(porcelain.base),
    "--surface-1": colour(porcelain.elevated),
  };

  return <>
    <section className="dl-start" aria-labelledby="studio-start-heading">
      <h1 id="studio-start-heading">Where would you like to start?</h1>
      <div className="dl-start-groups">
        <StudioGroup title="Start with the brand" links={[["Choose Persian Velvet Blue", "#material-studio"], ["Choose Porcelain", "#material-studio"], ["View Hero V2", "#material-studio"]]} onSelect={(label) => setMode(label.includes("Porcelain") ? "porcelain" : "persian")} />
        <StudioGroup title="Build the page" links={[["Headers", "/champagne/design-lab/rooms/headers"], ["Sections", "/champagne/design-lab/rooms/sections"], ["CTAs", "/champagne/design-lab/rooms/ctas"], ["Cards", "/champagne/design-lab/rooms/cards"], ["Bands", "/champagne/design-lab/rooms/bands"], ["Heritage", "/champagne/design-lab/rooms/heritage"], ["Footers", "/champagne/design-lab/rooms/footers"]]} />
        <StudioGroup title="View complete ideas" links={[["Homepage A", "/champagne/design-lab/exemplars/home-a"], ["Homepage B", "/champagne/design-lab/exemplars/home-b"], ["Implants", "/champagne/design-lab/exemplars/implants-a"], ["Composite Bonding", "/champagne/design-lab/exemplars/bonding-a"]]} />
        <StudioGroup title="Compose" links={[["Room 11", "#room-11"]]} />
      </div>
    </section>
    <section id="material-studio" className="dl-material-studio" style={style} aria-labelledby="material-heading">
      <div className="dl-material-tabs" role="tablist" aria-label="Brand material"><button type="button" role="tab" aria-selected={mode === "persian"} onClick={() => setMode("persian")}>Persian Velvet Blue</button><button type="button" role="tab" aria-selected={mode === "porcelain"} onClick={() => setMode("porcelain")}>Porcelain</button></div>
      <div className="dl-material-heading"><div><h2 id="material-heading">{mode === "persian" ? "Choose your Persian Velvet Blue" : "Choose your Porcelain"}</h2><p>{mode === "persian" ? "Compare each blue against Hero V2—not against a tiny swatch." : "Judge each Porcelain alongside the Hero and its transition into the page."}</p></div><label><span>Choose a candidate</span><select value={index} onChange={(event) => setIndex(Number(event.target.value))}>{candidates.map((item, itemIndex) => <option key={item.id} value={itemIndex}>{item.name}</option>)}</select></label></div>
      <div className="dl-candidate-nav"><button type="button" onClick={() => move(-1)} aria-label="Previous candidate">← <span>Previous</span></button><strong>{candidate.name}<small>{index + 1} of {candidates.length}</small></strong><button type="button" onClick={() => move(1)} aria-label="Next candidate"><span>Next</span> →</button></div>
      <div className="dl-material-context" data-material={mode}><div className="dl-material-sample" aria-hidden="true"><span>Persian depth</span><span>Porcelain canvas</span></div><div className="dl-hero-context">{hero}</div></div>
      <div className="dl-feedback" aria-label={`Feedback for ${candidate.name}`}>{FEEDBACK[mode].map((response) => <button key={response} type="button" aria-pressed={selectedResponses.includes(response)} onClick={() => chooseResponse(response)}>{response === "Favourite" ? "♡ " : ""}{response}</button>)}</div>
      <details className="dl-technical"><summary>Technical details</summary><dl><div><dt>Candidate</dt><dd>{candidate.name}</dd></div><div><dt>Primary value</dt><dd>{primaryValue}</dd></div><div><dt>Supporting value</dt><dd>{colour(candidate.elevated)}</dd></div><div><dt>Note</dt><dd>{candidate.note}</dd></div><div><dt>Production binding</dt><dd>Off</dd></div></dl></details>
    </section>
  </>;
}

function StudioGroup({ title, links, onSelect }: { title: string; links: string[][]; onSelect?: (label: string) => void }) {
  return <section><h2>{title}</h2>{links.map(([label, href]) => <a key={label} href={href} onClick={() => onSelect?.(label)}><span>{label}</span><span aria-hidden="true">→</span></a>)}</section>;
}
