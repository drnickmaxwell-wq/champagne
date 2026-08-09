"use client";

import { useEffect, useMemo, useState } from "react";
import registry from "../data/v27-registry.json";
import { DEFAULT_CAPABILITIES, type CapabilityKey } from "../data/contracts";
import { FLOWS } from "../data/flows";

const STORAGE_KEY = "champagne-design-lab-v27-selection";
type RegistryItem = (typeof registry.items)[number];
const previewUrl = (item: RegistryItem) => `/assets/champagne/design-lab/v27/${item.id}.png`;

export function Room11Composer() {
  const [flowId, setFlowId] = useState(FLOWS[0].id);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); if (Array.isArray(saved)) setOrderedIds(saved.filter((id): id is string => typeof id === "string")); } catch { /* Ignore invalid state. */ } }, []);
  const items = orderedIds.map((id) => registry.items.find((item) => item.id === id)).filter((item): item is RegistryItem => Boolean(item));
  const exportValue = useMemo(() => ({ schema: "DL-R2-FOUNDER-COMPOSITION-V1", productionBinding: false, flowId, orderedVisualChoices: items.map(({ id, title, labRoom }) => ({ id, title, labRoom })), capabilities }), [flowId, items, capabilities]);
  const update = (next: string[]) => { setOrderedIds(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const move = (id: string, delta: number) => { const from = orderedIds.indexOf(id); const to = Math.max(0, Math.min(orderedIds.length - 1, from + delta)); if (from < 0 || from === to) return; const next = [...orderedIds]; next.splice(from, 1); next.splice(to, 0, id); update(next); };
  const download = () => { const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(new Blob([JSON.stringify(exportValue, null, 2)], { type: "application/json" })); anchor.download = "champagne-room-11-founder-brief.json"; anchor.click(); URL.revokeObjectURL(anchor.href); };
  return <section id="room-11" className="dl-room11" aria-labelledby="room11-heading">
    <header><div><h2 id="room11-heading">Room 11</h2><p>Arrange your shortlisted visual ideas in the order you want to discuss them. Think of this as your page-making table.</p></div><button type="button" onClick={download}>Export Founder brief</button></header>
    <label className="dl-room11-flow"><span>Page you are shaping</span><select value={flowId} onChange={(event) => setFlowId(event.target.value)}>{FLOWS.map((flow) => <option key={flow.id} value={flow.id}>{flow.family === "home" ? "Homepage" : flow.family === "implants" ? "Dental Implants" : "Composite Bonding"} · Direction {flow.variant}</option>)}</select></label>
    {items.length ? <ol className="dl-room11-page">{items.map((item, index) => <li key={item.id}><span className="dl-room11-order">{String(index + 1).padStart(2, "0")}</span><img src={previewUrl(item)} alt={`${item.title} visual`} /><div><strong>{item.title}</strong><small>{item.labRoom.replace(/^Room\s*\d+\s*[—-]?\s*/i, "")}</small></div><div className="dl-room11-actions"><button type="button" onClick={() => move(item.id, -1)} disabled={index === 0} aria-label={`Move ${item.title} earlier`}>↑</button><button type="button" onClick={() => move(item.id, 1)} disabled={index === items.length - 1} aria-label={`Move ${item.title} later`}>↓</button><button type="button" onClick={() => update(orderedIds.filter((id) => id !== item.id))}>Remove</button></div></li>)}</ol> : <div className="dl-room11-empty"><h3>Your composition is waiting</h3><p>Shortlist a header, sections, bands or footer and they will appear here ready to arrange.</p><a href="/champagne/design-lab/rooms/headers">Start with headers →</a></div>}
    <details className="dl-technical"><summary>Advanced capability and export details</summary><fieldset><legend>Capability truth</legend>{(Object.keys(capabilities) as CapabilityKey[]).map((key) => <label key={key}><input type="checkbox" checked={capabilities[key]} onChange={(event) => setCapabilities((value) => ({ ...value, [key]: event.target.checked }))} />{key}</label>)}</fieldset><label>Bounded JSON preview<textarea readOnly rows={12} value={JSON.stringify(exportValue, null, 2)} /></label></details>
  </section>;
}
