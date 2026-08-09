import registry from "../data/v27-registry.json";

const rooms = ["surfaces", "ctas", "cards", "sections", "bands", "headers", "footers", "heritage", "media", "captain", "whole-pages", "sequences"];

export function RegistryBrowser({ room }: { room?: string }) {
  const items = registry.items.filter((item) => !room || item.labRoom.toLowerCase().includes(room.replace("whole-pages", "whole")));
  return <section aria-labelledby="registry-heading"><h2 id="registry-heading">V27 evidence registry</h2><p>{registry.totals.items} canonical records · productionBinding=false</p><nav aria-label="Evidence rooms">{rooms.map((value, index) => <a key={value} href={`/champagne/design-lab/rooms/${value}`}>{String(index + 1).padStart(2, "0")} {value}</a>)}</nav><div className="dl-registry">{items.map((item) => <article key={item.id}><h3>{item.id}</h3><p>{item.title}</p><p><strong>SOURCE_PREVIEW_UNAVAILABLE</strong></p><small>{item.technicalStatus} · implementationAvailable={String(item.implementationAvailable)}</small></article>)}</div></section>;
}
