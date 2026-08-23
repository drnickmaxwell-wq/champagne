import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const rooms = readFileSync(new URL("../../app/champagne/design-lab/_components/ExperienceRooms.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.5.css", import.meta.url), "utf8");
const temporal = readFileSync(new URL("../../app/champagne/design-lab/data/temporal-simulation.ts", import.meta.url), "utf8");
const heroConflict = readFileSync(new URL("../../app/champagne/design-lab/data/hero-content-authority-conflict.v1.json", import.meta.url), "utf8");

test("Founder preview matrix exports exact devices, scale, orientation, time and mode", () => {
  for (const marker of ["1440, height: 900", "768, height: 1024", "1024, height: 768", "390, height: 844", "Custom viewport width", "Display scale", "TEMPORAL_SIMULATIONS", "Two-up comparison", "Clean preview", "Fullscreen", "SIMULATION_ONLY"]) assert.match(atelier, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(atelier, /previewState:/);
  assert.match(atelier, /requestFullscreen/);
  assert.match(css, /data-clean-preview=true/);
  assert.doesNotMatch(css, /\.dl45-canvas\[data-studio-time=[^\]]+\]\{filter:/);
  for (const marker of ["dawn", "midday", "goldenHour", "inkfall", "HERO_PREVIEW_ONLY", "SIMULATION_ONLY"]) assert.match(temporal, new RegExp(marker));
  assert.match(heroConflict, /CHAMPAGNE_HERO_CONTENT_AUTHORITY_CONFLICT_V1/);
});

test("Brand decisions visibly bind to the page canvas", () => {
  for (const marker of ["data-brand-territory", "data-brand-accent", "data-brand-type", "data-brand-rhythm", "data-studio-time"]) assert.match(atelier, new RegExp(marker));
  for (const marker of ["contemporary-editorial", "warm-heritage", "luminous-digital", "data-brand-type=humanist", "data-brand-rhythm=cinematic", "data-studio-time=night"]) assert.match(css, new RegExp(marker));
});

test("Experience rooms have governed media decisions, continuous handoff and accessible dialog behavior", () => {
  for (const marker of ["mediaTreatments", "Saved to governed export", "Unavailable until a governed asset arrives", "Continue to human contact", "SYNTHETIC · NOT FINAL · NOT VISUAL AUTHORITY", "previouslyFocused", "Escape", "event.key !== \"Tab\""]) assert.match(rooms, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(atelier, /experienceDecision/);
});
