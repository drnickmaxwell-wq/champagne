"use client";

import { useEffect, useMemo, useState } from "react";
import registry from "../data/v27-registry.json";

const rooms = ["surfaces", "ctas", "cards", "sections", "bands", "headers", "footers", "heritage", "media", "captain", "whole-pages", "sequences"] as const;
const STORAGE_KEY = "champagne-design-lab-v27-selection";
type RegistryItem = (typeof registry.items)[number];

const previewUrl = (item: RegistryItem) => `/assets/champagne/design-lab/v27/${item.id}.png`;

function roomMatches(item: RegistryItem, room?: string) {
  if (!room) return true;
  const normalized = room.replace("whole-pages", "whole").replace("surfaces", "surface");
  return item.labRoom.toLowerCase().includes(normalized);
}

export function RegistryBrowser({ room }: { room?: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [imageFailures, setImageFailures] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setSelected(saved.filter((id): id is string => typeof id === "string"));
    } catch { /* Invalid old laboratory state is ignored. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return registry.items.filter((item) => roomMatches(item, room) && (!needle || [item.id, item.title, item.family, item.purpose].some((value) => value?.toLowerCase().includes(needle))));
  }, [query, room]);
  const inspected = registry.items.find((item) => item.id === inspectedId) ?? null;
  const selectedItems = selected.map((id) => registry.items.find((item) => item.id === id)).filter((item): item is RegistryItem => Boolean(item));

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const move = (id: string, delta: number) => setSelected((current) => {
    const from = current.indexOf(id);
    const to = Math.max(0, Math.min(current.length - 1, from + delta));
    if (from < 0 || from === to) return current;
    const next = [...current]; next.splice(from, 1); next.splice(to, 0, id); return next;
  });
  const downloadSelection = () => {
    const payload = { schema: "CHAMPAGNE-DESIGN-LAB-SELECTION-V27", productionBinding: false, orderedSelection: selectedItems.map(({ id, title, labRoom, preview }) => ({ id, title, labRoom, preview })) };
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    anchor.download = "champagne-design-lab-v27-selection.json";
    anchor.click(); URL.revokeObjectURL(anchor.href);
  };

  return <section aria-labelledby="registry-heading" className="dl-library">
    <div className="dl-section-heading"><div><p className="dl-kicker">THE COMPLETE VISUAL ARCHIVE</p><h2 id="registry-heading">V27 evidence library</h2><p>{registry.totals.items} visual records · every source preview restored · productionBinding=false</p></div><label className="dl-search"><span>Search the archive</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ID, title, family or purpose" /></label></div>
    <nav className="dl-room-nav" aria-label="Evidence rooms"><a href="/champagne/design-lab">All 331</a>{rooms.map((value, index) => <a aria-current={room === value ? "page" : undefined} key={value} href={`/champagne/design-lab/rooms/${value}`}>{String(index + 1).padStart(2, "0")} {value}</a>)}</nav>

    {selectedItems.length ? <aside className="dl-selection" aria-labelledby="selection-heading"><div className="dl-selection-head"><div><p className="dl-kicker">FOUNDER SHORTLIST</p><h3 id="selection-heading">Your ordered visual choices</h3></div><div><button type="button" onClick={downloadSelection}>Download JSON brief</button><button type="button" onClick={() => setSelected([])}>Clear</button></div></div><ol>{selectedItems.map((item, index) => <li key={item.id}><img src={previewUrl(item)} alt="" /><span><strong>{index + 1}. {item.title}</strong><small>{item.id}</small></span><button type="button" onClick={() => move(item.id, -1)} aria-label={`Move ${item.id} earlier`}>↑</button><button type="button" onClick={() => move(item.id, 1)} aria-label={`Move ${item.id} later`}>↓</button><button type="button" onClick={() => toggle(item.id)}>Remove</button></li>)}</ol></aside> : null}

    <p className="dl-results">Showing {items.length} {items.length === 1 ? "design" : "designs"}{query ? ` for “${query}”` : ""}</p>
    <div className="dl-registry">{items.map((item) => {
      const isSelected = selected.includes(item.id);
      const failed = imageFailures.includes(item.id);
      return <article key={item.id} data-selected={isSelected}><button className="dl-preview-button" type="button" onClick={() => setInspectedId(item.id)} aria-label={`Inspect ${item.title}`}>{failed ? <span className="dl-preview-missing">SOURCE_PREVIEW_UNAVAILABLE</span> : <img src={previewUrl(item)} alt={`Archive preview: ${item.title}`} loading="lazy" onError={() => setImageFailures((current) => [...current, item.id])} />}</button><div className="dl-card-copy"><small>{item.labRoom}</small><h3>{item.title}</h3><p>{item.id}</p><div className="dl-card-actions"><button type="button" onClick={() => setInspectedId(item.id)}>Inspect</button><button type="button" aria-pressed={isSelected} onClick={() => toggle(item.id)}>{isSelected ? "Selected ✓" : "Add to shortlist"}</button></div></div></article>;
    })}</div>

    {inspected ? <div className="dl-inspector-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInspectedId(null); }}><section className="dl-inspector" role="dialog" aria-modal="true" aria-labelledby="inspector-title"><button className="dl-inspector-close" type="button" onClick={() => setInspectedId(null)} aria-label="Close preview">×</button><div className="dl-inspector-image"><img src={previewUrl(inspected)} alt={`Full archive preview: ${inspected.title}`} /></div><div className="dl-inspector-copy"><p className="dl-kicker">{inspected.labRoom} · {inspected.id}</p><h2 id="inspector-title">{inspected.title}</h2><p>{inspected.purpose}</p><dl><div><dt>Family</dt><dd>{inspected.family}</dd></div><div><dt>Evidence state</dt><dd>{inspected.technicalStatus}</dd></div><div><dt>Source size</dt><dd>{inspected.preview.width} × {inspected.preview.height}</dd></div><div><dt>Production binding</dt><dd>False</dd></div></dl><button type="button" aria-pressed={selected.includes(inspected.id)} onClick={() => toggle(inspected.id)}>{selected.includes(inspected.id) ? "Remove from shortlist" : "Add to Founder shortlist"}</button></div></section></div> : null}
  </section>;
}
