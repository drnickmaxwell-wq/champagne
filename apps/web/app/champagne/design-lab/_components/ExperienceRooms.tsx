"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONCIERGE_3D_ACTIONS, CONCIERGE_COMPONENT_CHOICES, CONCIERGE_TERRITORIES, INITIAL_CONCIERGE_MIX, type ConciergeTerritoryId } from "../data/concierge-contract";
import { IMPLANT_3D_CONTRACT } from "../data/implant-3d-contract";
import { HOME_MEDIA_SLOT_COMPATIBILITY, MEDIA_FOUNDER_CONTROLS } from "../data/media-slot-adapter";

type Room = "overview" | "media" | "concierge" | "journey" | "threeD";
type Decision = "shortlist" | "reject" | "saved";
export type ExperienceDecisionState = { mix: typeof INITIAL_CONCIERGE_MIX; decisions: Partial<Record<ConciergeTerritoryId, Decision>>; mediaTreatments: Record<string, string>; evidence: "SIMULATION_ONLY"; productionBinding: false };

export function ExperienceRooms({ onClose, onGovernedChange }: { onClose: () => void; onGovernedChange?: (state: ExperienceDecisionState) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [room, setRoom] = useState<Room>("overview");
  const [mediaId, setMediaId] = useState("home.founder-authority");
  const [primary, setPrimary] = useState<ConciergeTerritoryId>("architectural-light");
  const [secondary, setSecondary] = useState<ConciergeTerritoryId>("editorial-host");
  const [compare, setCompare] = useState(false);
  const [mix, setMix] = useState({ ...INITIAL_CONCIERGE_MIX });
  const [decisions, setDecisions] = useState<Partial<Record<ConciergeTerritoryId, Decision>>>({});
  const [journeyStep, setJourneyStep] = useState(0);
  const [modelStage, setModelStage] = useState(2);
  const [modelPart, setModelPart] = useState<"fixture" | "abutment" | "crown">("fixture");
  const [labels, setLabels] = useState(true);
  const [mediaTreatments, setMediaTreatments] = useState<Record<string, string>>({});
  const media = HOME_MEDIA_SLOT_COMPATIBILITY[mediaId];
  const activeTerritories = useMemo(() => CONCIERGE_TERRITORIES.filter((item) => item.id === primary || (compare && item.id === secondary)), [compare, primary, secondary]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("champagne.atelier.r4.4.concierge-room");
      if (!saved) return;
      const parsed = JSON.parse(saved) as { mix?: typeof mix; decisions?: typeof decisions };
      if (parsed.mix) setMix(parsed.mix);
      if (parsed.decisions) setDecisions(parsed.decisions);
    } catch { /* A corrupt private preference must never block the room. */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem("champagne.atelier.r4.4.concierge-room", JSON.stringify({ schema: "champagne.atelier.concierge-room.v1", mix, decisions, productionBinding: false })); } catch { /* The main Atelier export remains the durable fallback. */ }
  }, [mix, decisions]);

  useEffect(() => { onGovernedChange?.({ mix, decisions, mediaTreatments, evidence: "SIMULATION_ONLY", productionBinding: false }); }, [decisions, mediaTreatments, mix, onGovernedChange]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button, select, input, summary, [href], [tabindex]:not([tabindex='-1'])")].filter((item) => !item.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previouslyFocused?.focus(); };
  }, [onClose]);

  useEffect(() => { dialogRef.current?.querySelector<HTMLElement>(".dl44-room-body")?.scrollTo({ top: 0 }); }, [room]);

  return <div className="dl44-rooms" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="experience-room-heading">
    <header className="dl44-room-head"><div><span>R4.5 Founder decision loop</span><h2 id="experience-room-heading">Experience rooms</h2><p>One Champagne experience, with each lane’s authority still visible.</p></div><button ref={closeRef} onClick={onClose}>Close</button></header>
    <nav className="dl44-room-nav" aria-label="Experience rooms">{(["overview", "media", "concierge", "journey", "threeD"] as Room[]).map((id) => <button key={id} aria-current={room === id ? "page" : undefined} onClick={() => setRoom(id)}>{id === "threeD" ? "3D exhibit" : id}</button>)}</nav>
    {room === "overview" ? <Overview onOpen={setRoom} /> : null}
    {room === "media" ? <section className="dl44-room-body" data-room="media"><header><span>Media Studio / Media Lens</span><h3>Media has a job before it has an asset.</h3><p>The 40-section registry is connected. Homepage shows the first resolved set.</p></header><div className="dl44-media-studio"><label>Homepage section<select value={mediaId} onChange={(event) => setMediaId(event.target.value)}>{Object.values(HOME_MEDIA_SLOT_COMPATIBILITY).filter((item) => item.availability !== "OFF").map((item) => <option key={item.semanticSectionId} value={item.semanticSectionId}>{item.semanticSectionId}</option>)}</select></label><article><span>{media.required ? "Media required" : "Text-led is valid"}</span><h4>{media.resolvedSlotId}</h4><p>{media.job}</p><dl><div><dt>Content provenance</dt><dd>{media.contentSlotIds.join(", ") || "No older slot ID"}</dd></div><div><dt>Recommended</dt><dd>{media.recommendedType} · {media.aspectRatio}</dd></div><div><dt>Asset status</dt><dd>{media.availability.replaceAll("_", " ")}</dd></div><div><dt>Desktop</dt><dd>{media.responsive.desktop}</dd></div><div><dt>Mobile</dt><dd>{media.responsive.mobile}</dd></div><div><dt>Authenticity</dt><dd>{media.authenticity}</dd></div><div><dt>Provenance</dt><dd>{media.provenance}</dd></div><div><dt>Fallback</dt><dd>{media.fallback}</dd></div></dl><div className="dl44-control-cloud">{MEDIA_FOUNDER_CONTROLS.map((control) => { const unavailable = /choose asset|compare assets|change crop|video|3D/i.test(control) && media.availability !== "REAL_ASSET_AVAILABLE"; return <button key={control} disabled={unavailable} title={unavailable ? "Unavailable until a governed asset arrives" : undefined} aria-pressed={mediaTreatments[mediaId] === control} onClick={() => setMediaTreatments((all) => ({ ...all, [mediaId]: control }))}>{control}{unavailable ? " · unavailable" : ""}</button>; })}</div>{mediaTreatments[mediaId] ? <p role="status">Saved to governed export: {mediaTreatments[mediaId]}</p> : null}</article></div></section> : null}
    {room === "concierge" ? <section className="dl44-room-body dl451-decision-room" data-room="concierge"><header><span>Concierge Experience Room</span><h3>Compare personalities. Then mix components deliberately.</h3><p>The lane recommendation is preloaded, not imposed.</p></header><div className="dl44-concierge-tools"><label>Direction A<select value={primary} onChange={(event) => setPrimary(event.target.value as ConciergeTerritoryId)}>{CONCIERGE_TERRITORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button aria-pressed={compare} onClick={() => setCompare((value) => !value)}>Compare two</button>{compare ? <label>Direction B<select value={secondary} onChange={(event) => setSecondary(event.target.value as ConciergeTerritoryId)}>{CONCIERGE_TERRITORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}</div><div className={compare ? "dl44-territories is-compare" : "dl44-territories"}>{activeTerritories.map((item) => <article key={item.id} data-territory={item.surface}><div className="dl44-host-demo"><span className="dl44-host-mark">S</span><div><small>{item.role}</small><strong>How can I help you explore?</strong><p>{item.character}</p><button>Replace a missing tooth</button></div></div><footer>{(["shortlist", "reject", "saved"] as Decision[]).map((decision) => <button key={decision} aria-pressed={decisions[item.id] === decision} onClick={() => setDecisions((all) => ({ ...all, [item.id]: decision }))}>{decision}</button>)}</footer></article>)}</div><div className="dl44-mix"><h4>Intentional component mix</h4>{CONCIERGE_COMPONENT_CHOICES.map((choice) => <label key={choice.id}><span>{choice.label}<small>{choice.contractId}</small></span><select value={mix[choice.id]} onChange={(event) => setMix((all) => ({ ...all, [choice.id]: event.target.value as ConciergeTerritoryId }))}>{CONCIERGE_TERRITORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>)}</div></section> : null}
    {room === "journey" ? <Journey step={journeyStep} onStep={setJourneyStep} onThreeD={() => setRoom("threeD")} /> : null}
    {room === "threeD" ? <ImplantExhibit stage={modelStage} part={modelPart} labels={labels} onStage={setModelStage} onPart={setModelPart} onLabels={setLabels} onHumanContact={() => { setJourneyStep(4); setRoom("journey"); }} /> : null}
  </div>;
}

function Overview({ onOpen }: { onOpen: (room: Room) => void }) { return <section className="dl44-room-body dl44-overview"><header><span>Founder visual return</span><h3>The Homepage, Host, media and implant education now meet.</h3><p>Open a room to inspect the visual decision—not a six-lane architecture report wearing a fancy hat.</p></header><div>{[{ id: "media", title: "Media Studio", copy: "Inspect purpose, crop, provenance and truthful fallback section by section." }, { id: "concierge", title: "Concierge directions", copy: "Browse, compare, mix, shortlist, reject and save the four territories." }, { id: "journey", title: "Experience Preview", copy: "Rehearse Homepage → missing tooth → Implants → education → human contact." }, { id: "threeD", title: "Implant 3D exhibit", copy: "Use the frozen synthetic fixture with real states, labels and text parity." }].map((item) => <button key={item.id} onClick={() => onOpen(item.id as Room)}><span>{item.title}</span><small>{item.copy}</small></button>)}</div></section>; }

const JOURNEY = [
  { place: "Homepage", title: "A quiet invitation", copy: "The Architectural Host appears at the edge of the page without interrupting reading.", action: "Open the Host" },
  { place: "Architectural Host", title: "What would you like help with?", copy: "Choose a need, not a diagnosis or treatment promise.", action: "Replace a missing tooth" },
  { place: "/treatments/implants", title: "Dental implant education", copy: "The canonical treatment owner explains what implants are and what assessment considers.", action: "See how the parts fit" },
  { place: "Implant exhibit", title: "Fixture · abutment · crown", copy: "A synthetic museum-grade model supports understanding with source and text alternatives.", action: "Open 3D exhibit" },
  { place: "Human contact", title: "Continue with the practice", copy: "The journey ends in a contact request—not diagnosis, suitability or a live booking claim.", action: "Contact the practice" },
] as const;

function Journey({ step, onStep, onThreeD }: { step: number; onStep: (step: number) => void; onThreeD: () => void }) { const item = JOURNEY[step]; return <section className="dl44-room-body dl44-journey dl451-decision-room" data-room="journey"><header><span>Experience Preview · synthetic adapter</span><h3>Homepage to a human next step.</h3><p>No live engine response or booking state is claimed.</p></header><ol>{JOURNEY.map((entry, index) => <li key={entry.place} aria-current={index === step ? "step" : undefined}><button onClick={() => onStep(index)}><span>{String(index + 1).padStart(2, "0")}</span>{entry.place}</button></li>)}</ol><article><span>{item.place}</span><h4>{item.title}</h4><p>{item.copy}</p><button onClick={() => step === 3 ? onThreeD() : onStep(Math.min(step + 1, JOURNEY.length - 1))}>{item.action}</button>{step > 0 ? <button onClick={() => onStep(step - 1)}>Back</button> : null}</article></section>; }

function ImplantExhibit({ stage, part, labels, onStage, onPart, onLabels, onHumanContact }: { stage: number; part: "fixture" | "abutment" | "crown"; labels: boolean; onStage: (stage: number) => void; onPart: (part: "fixture" | "abutment" | "crown") => void; onLabels: (labels: boolean) => void; onHumanContact: () => void }) { const selected = IMPLANT_3D_CONTRACT.components.find((item) => item.id === part)!; return <section className="dl44-room-body dl44-model-room dl451-decision-room" data-room="threeD"><header><span>{IMPLANT_3D_CONTRACT.assetId} · {IMPLANT_3D_CONTRACT.evidence}</span><strong className="dl45-synthetic-label">SYNTHETIC · NOT FINAL · NOT VISUAL AUTHORITY</strong><h3>A museum-grade frame, ready for the real model.</h3><p>{IMPLANT_3D_CONTRACT.disclaimer}</p></header><div className="dl44-model-layout"><div className="dl44-model-stage" data-stage={stage}><div className="dl44-jaw"><i className="dl44-fixture" data-active={part === "fixture"} /><i className="dl44-abutment" data-active={part === "abutment"} /><i className="dl44-crown" data-active={part === "crown"} />{labels ? <><span className="label-fixture">Fixture</span><span className="label-abutment">Abutment</span><span className="label-crown">Crown</span></> : null}</div><strong>{IMPLANT_3D_CONTRACT.states[stage]}</strong><small>Code-native synthetic proxy · final GLB not present</small></div><aside><span>Selected component</span><h4>{selected.label}</h4><p>{selected.explanation}</p><div>{IMPLANT_3D_CONTRACT.components.map((item) => <button key={item.id} aria-pressed={part === item.id} onClick={() => onPart(item.id)}>{item.label}</button>)}</div><label>Teaching stage<input type="range" min="0" max="8" value={stage} onChange={(event) => onStage(Number(event.target.value))} /><small>{IMPLANT_3D_CONTRACT.states[stage]}</small></label><button onClick={() => onLabels(!labels)}>{labels ? "Hide labels" : "Show labels"}</button><details><summary>Read instead</summary><p>{IMPLANT_3D_CONTRACT.components.map((item) => `${item.label}: ${item.explanation}`).join(" ")}</p></details><button className="dl45-human-contact" onClick={onHumanContact}>Continue to human contact</button></aside></div><footer><span>Frozen action family</span><p>{CONCIERGE_3D_ACTIONS.join(" · ")}</p><small>{IMPLANT_3D_CONTRACT.replacementRule}</small></footer></section>; }
