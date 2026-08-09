"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CAPABILITIES, type CapabilityKey } from "../data/contracts";
import { FLOWS } from "../data/flows";

export function Room11Composer() {
  const [flowId, setFlowId] = useState(FLOWS[0].id);
  const [selected, setSelected] = useState<string[]>([]);
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES);
  const flow = FLOWS.find((item) => item.id === flowId) ?? FLOWS[0];
  const ordered = selected.length ? selected : flow.sections.map((item) => item.id);
  const exportValue = useMemo(() => ({ schema: "DL-R1-COMPOSITION-V1", productionBinding: false, flowId, orderedSectionIds: ordered, capabilities }), [flowId, ordered, capabilities]);
  const move = (id: string, delta: number) => setSelected((current) => {
    const source = current.length ? current : flow.sections.map((item) => item.id);
    const from = source.indexOf(id); const to = Math.max(0, Math.min(source.length - 1, from + delta));
    const next = [...source]; next.splice(from, 1); next.splice(to, 0, id); return next;
  });
  return (
    <section className="dl-composer" aria-labelledby="room11-heading">
      <h2 id="room11-heading">Room 11 — ordered composition</h2>
      <label>Exemplar flow<select value={flowId} onChange={(event) => { setFlowId(event.target.value); setSelected([]); }}>{FLOWS.map((item) => <option key={item.id}>{item.id}</option>)}</select></label>
      <fieldset><legend>Capability truth</legend>{(Object.keys(capabilities) as CapabilityKey[]).map((key) => <label key={key}><input type="checkbox" checked={capabilities[key]} onChange={(event) => setCapabilities((value) => ({ ...value, [key]: event.target.checked }))} />{key}</label>)}</fieldset>
      <ol>{ordered.map((id) => <li key={id}><span>{id}</span><button type="button" onClick={() => move(id, -1)} aria-label={`Move ${id} earlier`}>↑</button><button type="button" onClick={() => move(id, 1)} aria-label={`Move ${id} later`}>↓</button><button type="button" onClick={() => setSelected((current) => (current.length ? current : ordered).filter((item) => item !== id))}>Remove</button></li>)}</ol>
      <label>Bounded JSON export<textarea readOnly rows={14} value={JSON.stringify(exportValue, null, 2)} /></label>
    </section>
  );
}
