import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(testDir, "../..");
const repoRoot = path.resolve(webRoot, "../..");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const dataRoot = path.join(routeRoot, "data");
const authorityRoot = path.join(repoRoot, "contracts/atelier-recovery/authority");
const publicArchive = path.join(webRoot, "public/assets/champagne/design-lab/v27");
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(dataRoot, relativePath), "utf8"));

test("clean A0 identity and preserve/retire/rebuild matrix are explicit", async () => {
  const matrix = await readJson("recovery/ATELIER_A0_PRESERVE_RETIRE_REBUILD_MATRIX_V1.json");
  assert.equal(matrix.cleanBase, "a00f718a93710028b364930566d7f6a44483bc25");
  assert.equal(matrix.forensicSourceHead, "cc3f7fabff0af8ec6137c0a778b557e5bf79fb9e");
  assert.equal(matrix.recoveryRoute, "OPTION_B");
  assert.ok(matrix.entries.length >= 25);
  assert.ok(matrix.entries.some((entry) => entry.subsystem.includes("Aperture") && entry.classification === "RETIRE_FROM_ACTIVE_AUTHORITY"));
  assert.ok(matrix.invariants.includes("NO_GENERIC_LEGACY_FAMILY_FALLBACK"));
});

test("all 331 stable CVA assets and exact hashes survive extraction", async () => {
  const registry = await readJson("archive/v27-registry.json");
  const inventory = await readJson("archive/ATELIER_A0_PRESERVED_ARCHIVE_INVENTORY_V1.json");
  const files = (await readdir(publicArchive)).filter((file) => file.endsWith(".png")).sort();
  assert.equal(registry.items.length, 331);
  assert.equal(inventory.items.length, 331);
  assert.equal(files.length, 331);
  assert.equal(new Set(registry.items.map((item) => item.id)).size, 331);
  assert.deepEqual(files, registry.items.map((item) => `${item.id}.png`).sort());
  for (const row of inventory.items) {
    const bytes = await readFile(path.join(repoRoot, "apps/web/public", row.assetPath.replace(/^\//, "")));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), row.sha256, row.cvaId);
    assert.equal(row.implementationAvailable, false);
    assert.equal(row.usableInPageComposition, false);
    assert.equal(row.productionBinding, false);
  }
});

test("one canonical Brand authority and Anti-DNA load with exact provenance", async () => {
  const authority = JSON.parse(await readFile(path.join(authorityRoot, "CHAMPAGNE_FOUNDER_BRAND_DNA_V1.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(authorityRoot, "source-manifest.v1.json"), "utf8"));
  assert.equal(authority.schema, "CHAMPAGNE_FOUNDER_BRAND_DNA_V1");
  assert.equal(authority.version, "1.0.0");
  assert.equal(authority.authorityState, "CANONICAL_CORE_WITH_BOUNDED_DOMAIN_GAPS");
  assert.deepEqual(authority.fixedColourIdentity, {
    magenta: "#C2185B",
    turquoise: "#40C4B4",
    gold: "#D4AF37",
    rule: authority.fixedColourIdentity.rule,
  });
  assert.ok(authority.antiDNA.length >= 10);
  assert.equal(authority.implementationBinding, false);
  assert.equal(manifest.rules.canonicalAuthorityCount, 1);
  for (const file of manifest.files) {
    const bytes = await readFile(path.join(authorityRoot, file.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, file.path);
  }
});

test("preference schema and exact import plan preserve all 38 decisions without propagation", async () => {
  const schema = await readJson("contracts/founder-visual-preference-dataset.v1.schema.json");
  const plan = await readJson("recovery/ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1.json");
  assert.equal(schema.$id, "ATELIER_FOUNDER_VISUAL_PREFERENCE_DATASET_V1");
  assert.ok(schema.$defs.decision.required.includes("supersedes"));
  assert.equal(plan.policy.speculativeMappingsAllowed, false);
  assert.equal(plan.policy.parentApprovalPropagatesToChildren, false);
  assert.equal(plan.exactImports.length, 38);
  assert.equal(new Set(plan.exactImports.map((decision) => decision.cvaId)).size, 38);
  assert.ok(plan.sources.some((source) => source.classification === "PARENT_ONLY_DO_NOT_PROPAGATE"));
  assert.ok(plan.sources.some((source) => source.classification === "AMBIGUOUS_REQUIRES_FOUNDER"));
  assert.ok(plan.sources.some((source) => source.classification === "REJECTED_SOURCE"));
});

test("component grammar and future candidate contracts validate their required boundary", async () => {
  const grammar = await readJson("contracts/component-grammar.v1.schema.json");
  const candidate = await readJson("contracts/new-component-candidate.v1.schema.json");
  assert.equal(grammar.$id, "ATELIER_COMPONENT_GRAMMAR_V1");
  assert.ok(grammar.required.includes("responsive"));
  assert.deepEqual(Object.keys(grammar.properties.responsive.properties).sort((a, b) => Number(a) - Number(b)), ["390", "768", "1024", "1440"]);
  assert.equal(grammar.properties.productionBinding.const, false);
  assert.equal(candidate.$id, "ATELIER_NEW_COMPONENT_CANDIDATE_CONTRACT_V1");
  assert.equal(candidate.properties.constraints.properties.genericFallback.const, false);
  assert.equal(candidate.properties.outputPolicy.properties.kind.const, "EXPERIMENTAL_CANDIDATE");
  assert.equal(candidate.properties.outputPolicy.properties.directProductionWrite.const, false);
  assert.equal(candidate.properties.outputPolicy.properties.missingGrammarResult.const, "BRAND_COMPONENT_GAP");
});

test("recovery UI cannot invoke the legacy fixed-family generator", async () => {
  const activeFiles = ["page.tsx", "layout.tsx", "RecoveryWorkspace.tsx", "data/contracts/contracts.ts", "data/authority/brand-authority.ts"];
  const source = (await Promise.all(activeFiles.map((file) => readFile(path.join(routeRoot, file), "utf8")))).join("\n");
  for (const family of ["aperture", "folio", "luminous", "monolith"]) {
    assert.equal(source.toLowerCase().includes(family), false, family);
  }
  assert.equal(source.includes("generateProposalSet"), false);
  assert.equal(source.includes("BRAND_COMPONENT_GAP"), true);
  assert.equal(source.includes("productionBinding: false"), true);
});

test("noindex, isolation, reduced motion and governed viewports remain active", async () => {
  const layout = await readFile(path.join(routeRoot, "layout.tsx"), "utf8");
  const css = await readFile(path.join(routeRoot, "recovery.module.css"), "utf8");
  const contracts = await readFile(path.join(routeRoot, "data/contracts/contracts.ts"), "utf8");
  assert.match(layout, /index: false/);
  assert.match(layout, /follow: false/);
  assert.match(layout, /data-production-binding="false"/);
  assert.match(css, /prefers-reduced-motion/);
  for (const viewport of [1440, 1024, 768, 390]) assert.match(contracts, new RegExp(String(viewport)));
});

test("A0 does not modify public page, Sacred Hero, governed content, media or 3D source", async () => {
  const forbiddenActiveImports = ["HeroRenderer", "HeroV2", "content-bundle-adapter", "media-slot-adapter", "implant-3d"];
  const source = await readFile(path.join(routeRoot, "RecoveryWorkspace.tsx"), "utf8");
  for (const term of forbiddenActiveImports) assert.equal(source.includes(term), false, term);
});
