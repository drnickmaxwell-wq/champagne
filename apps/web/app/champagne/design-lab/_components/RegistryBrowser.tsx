"use client";

import { useEffect, useMemo, useState } from "react";
import registry from "../data/v27-registry.json";

const GROUPS = [
  ["headers", "Headers"], ["sections", "Sections"], ["ctas", "CTAs"], ["cards", "Cards & decision panels"],
  ["bands", "Bands"], ["heritage", "Heritage"], ["media", "Media layouts"], ["captain", "Captain / Concierge"],
  ["surfaces", "Surfaces & materials"], ["sequences", "Page sequences"], ["whole-pages", "Whole-page compositions"], ["footers", "Footers"],
] as const;
const STORAGE_KEY = "champagne-design-lab-v27-selection";
type RegistryItem = (typeof registry.items)[number];
const previewUrl = (item: RegistryItem) => `/assets/champagne/design-lab/v27/${item.id}.png`;

function roomMatches(item: RegistryItem, room: string) {
  const normalized = room.replace("whole-pages", "whole").replace("surfaces", "surface");
  return item.labRoom.toLowerCase().includes(normalized);
}

export function RegistryBrowser({ room = "headers" }: { room?: string }) {
  const initialRoom = GROUPS.some(([id]) => id === room) ? room : "headers";
  const [group, setGroup] = useState(initialRoom);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); if (Array.isArray(saved)) setSelected(saved.filter((id): id is string => typeof id === "string")); } catch { /* Ignore invalid old state. */ } }, []);
  const items = useMemo(() => { const needle = query.trim().toLowerCase(); return registry.items.filter((item) => roomMatches(item, group) && (!needle || [item.title, item.family, item.purpose, item.id].some((value) => value?.toLowerCase().includes(needle)))); }, [group, query]);
  useEffect(() => { setIndex(0); setCompareId(null); setImageFailed(false); }, [group, query]);
  const current = items[index] ?? items[0];
  const compare = items.find((item) => item.id === compareId);
  const compareIndex = compare ? items.findIndex((item) => item.id === compare.id) : (index + 1) % items.length;
  const selectedItems = selected.map((id) => registry.items.find((item) => item.id === id)).filter((item): item is RegistryItem => Boolean(item));
  const toggle = (id: string) => setSelected((existing) => { const next = existing.includes(id) ? existing.filter((value) => value !== id) : [...existing, id]; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next; });
  const move = (delta: number) => setIndex((index + delta + items.length) % items.length);
  const exportBrief = () => { const payload = { schema: "CHAMPAGNE-DESIGN-LAB-SELECTION-V27", productionBinding: false, orderedSelection: selectedItems.map(({ id, title, labRoom, preview }) => ({ id, title, labRoom, preview })) }; const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })); anchor.download = "champagne-founder-brief.json"; anchor.click(); URL.revokeObjectURL(anchor.href); };
  if (!current) return <p>No visual designs found in this group.</p>;
  const groupLabel = GROUPS.find(([id]) => id === group)?.[1] ?? group;
  return <section className="dl-browser" aria-labelledby="component-browser-heading">
    <header><div><a href="/champagne/design-lab">← Studio home</a><h1 id="component-browser-heading">{groupLabel}</h1><p>Look at one design at a time. Keep what feels right; the evidence stays quietly underneath.</p></div><label><span>Choose a component group</span><select value={group} onChange={(event) => setGroup(event.target.value)}>{GROUPS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label></header>
    <div className="dl-browser-toolbar"><button type="button" onClick={() => move(-1)}>← Previous</button><label><span>Choose design</span><select value={index} onChange={(event) => setIndex(Number(event.target.value))}>{items.map((item, itemIndex) => <option key={item.id} value={itemIndex}>{itemIndex + 1}. {item.title}</option>)}</select></label><strong>{index + 1} / {items.length}</strong><button type="button" onClick={() => move(1)}>Next →</button></div>
    <div className="dl-visual-workspace" data-comparing={compare ? "true" : "false"}>
      <article className="dl-component-stage"><div className="dl-component-copy"><p>{compare ? "Your first choice" : groupLabel}</p><h2>{current.title}</h2><p>{current.purpose || "A recovered visual direction for Champagne."}</p></div><div className="dl-component-image">{imageFailed ? <span>Preview temporarily unavailable</span> : <a href={previewUrl(current)} target="_blank" rel="noreferrer" aria-label={`Open ${current.title} full size`}><img src={previewUrl(current)} alt={`${current.title} visual design`} onError={() => setImageFailed(true)} /></a>}</div></article>
      {compare ? <article className="dl-component-stage dl-comparison-stage" aria-label="Comparison design"><div className="dl-component-copy"><p>Compare with</p><h2>{compare.title}</h2><p>{compare.purpose || "A recovered visual direction for Champagne."}</p></div><div className="dl-component-image"><a href={previewUrl(compare)} target="_blank" rel="noreferrer" aria-label={`Open ${compare.title} full size`}><img src={previewUrl(compare)} alt={`${compare.title} comparison visual`} /></a></div></article> : null}
    </div>
    {compare ? <section className="dl-compare-controls" aria-label="Comparison controls"><label><span>Choose the second design</span><select value={compareIndex} onChange={(event) => setCompareId(items[Number(event.target.value)]?.id ?? null)}>{items.map((item, itemIndex) => <option key={item.id} value={itemIndex} disabled={item.id === current.id}>{itemIndex + 1}. {item.title}</option>)}</select></label><button type="button" onClick={() => setCompareId(null)}>Close comparison</button></section> : null}
    <div className="dl-choice-actions"><button type="button" aria-pressed={selected.includes(current.id)} onClick={() => toggle(current.id)}>♡ {selected.includes(current.id) ? "Shortlisted" : "Add to shortlist"}</button><button type="button" aria-expanded={Boolean(compare)} onClick={() => setCompareId(compare ? null : items[(index + 1) % items.length]?.id)}>{compare ? "Close comparison" : "Compare two designs"}</button><a href="/champagne/design-lab#room-11">Add choices in Room 11</a></div>
    <label className="dl-library-search"><span>Looking for something specific?</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this group by name or purpose" /></label>
    <details className="dl-technical"><summary>Technical / evidence details</summary><dl><div><dt>Stable ID</dt><dd>{current.id}</dd></div><div><dt>Family</dt><dd>{current.family}</dd></div><div><dt>Evidence state</dt><dd>{current.technicalStatus}</dd></div><div><dt>Source size</dt><dd>{current.preview.width} × {current.preview.height}</dd></div><div><dt>Production binding</dt><dd>Off</dd></div></dl></details>
    {selectedItems.length ? <aside id="shortlist" className="dl-shortlist"><div><h2>Your shortlist</h2><p>{selectedItems.length} visual {selectedItems.length === 1 ? "choice" : "choices"} saved on this device.</p></div><ol>{selectedItems.map((item, itemIndex) => <li key={item.id}><img src={previewUrl(item)} alt="" /><span><strong>{itemIndex + 1}. {item.title}</strong><small>{GROUPS.find(([id]) => roomMatches(item, id))?.[1] ?? "Design"}</small></span><button type="button" onClick={() => toggle(item.id)}>Remove</button></li>)}</ol><button type="button" onClick={exportBrief}>Export Founder brief</button></aside> : null}
  </section>;
}
