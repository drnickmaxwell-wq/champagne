#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCssDefinitions } from "./css-declarations.v1.mjs";

export const SOURCE_RELATIVE_PATH = "packages/champagne-tokens/src/canvas-material.v1.json";
export const PRIMITIVES_RELATIVE_PATH =
  "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css";
export const GENERATED_CSS_RELATIVE_PATH =
  "packages/champagne-tokens/styles/champagne/canvas-material.generated.css";
export const GENERATED_TS_RELATIVE_PATH =
  "packages/champagne-tokens/src/critical-paint.generated.ts";

const TOP_LEVEL_KEYS = new Set([
  "schemaVersion",
  "materialId",
  "status",
  "finalPersianMidnightSelection",
  "nodes",
  "outputs",
]);
const LITERAL_KEYS = new Set(["id", "type", "token", "value"]);
const KEYWORD_KEYS = new Set(["id", "type", "value"]);
const MIX_KEYS = new Set(["id", "type", "space", "left", "right"]);
const INPUT_KEYS = new Set(["ref", "weight"]);
const OUTPUT_KEYS = new Set(["canvas", "foreground"]);
const ALLOWED_SPACES = new Set(["oklab", "srgb"]);
const HEX_LITERAL = /^#[0-9A-F]{6}$/;
const PRIMITIVE_HEX_LITERAL = /^#[0-9A-Fa-f]{6}$/;
const TOKEN_NAME = /^--[a-z0-9-]+$/;
const MATERIAL_STATUS = "CURRENT_APPROVED_MATERIAL_NOT_FINAL_PERSIAN_MIDNIGHT";

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`[${label}] expected an object`);
  }
}

function assertClosedKeys(value, allowed, label) {
  assertObject(value, label);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    throw new Error(`[${label}] unknown key(s): ${unknown.join(", ")}`);
  }
}

function assertIntegerWeight(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new Error(`[${label}] weight must be an integer from 0 through 100`);
  }
}

function parsePrimitiveLiteral(css, token) {
  let values;
  try {
    values = parseCssDefinitions(css, token);
  } catch (error) {
    throw new Error(
      `[PRIMITIVE_OWNER_INVALID] ${token} CSS parse failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (values.length !== 1 || !PRIMITIVE_HEX_LITERAL.test(values[0] ?? "")) {
    throw new Error(
      `[PRIMITIVE_OWNER_INVALID] ${token} must have exactly one six-digit literal owner; found ${values.length}${values.length > 0 ? ` (${values.join(", ")})` : ""}`,
    );
  }
  return values[0].toUpperCase();
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function renderWeight(weight) {
  return weight === undefined ? "" : ` ${weight}%`;
}

function hexToColorFunction(hex) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
  return `color(srgb ${channels.map((channel) => (channel / 255).toFixed(10)).join(" ")})`;
}

function nodeMapFrom(source) {
  return new Map(source.nodes.map((node) => [node.id, node]));
}

function walkReferences(nodeId, nodes, visiting, visited, terminals) {
  if (visiting.has(nodeId)) {
    throw new Error(`[REF_CYCLE] ${[...visiting, nodeId].join(" -> ")}`);
  }
  if (visited.has(nodeId)) return;
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`[REF_MISSING] ${nodeId}`);
  visiting.add(nodeId);
  if (node.type === "mix") {
    walkReferences(node.left.ref, nodes, visiting, visited, terminals);
    walkReferences(node.right.ref, nodes, visiting, visited, terminals);
  } else {
    terminals.add(node.id);
  }
  visiting.delete(nodeId);
  visited.add(nodeId);
}

function renderNode(nodeId, nodes, mode, stack = []) {
  if (stack.includes(nodeId)) throw new Error(`[REF_CYCLE] ${[...stack, nodeId].join(" -> ")}`);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`[REF_MISSING] ${nodeId}`);
  if (node.type === "literal") {
    return mode === "loaded" ? `var(${node.token})` : hexToColorFunction(node.value);
  }
  if (node.type === "keyword") return node.value;
  const nextStack = [...stack, nodeId];
  const left = renderNode(node.left.ref, nodes, mode, nextStack);
  const right = renderNode(node.right.ref, nodes, mode, nextStack);
  return `color-mix(in ${node.space}, ${left}${renderWeight(node.left.weight)}, ${right}${renderWeight(node.right.weight)})`;
}

export function validateMaterialSource(source, primitiveCss) {
  assertClosedKeys(source, TOP_LEVEL_KEYS, "SOURCE");
  if (source.schemaVersion !== "CHAMPAGNE_CANVAS_MATERIAL_V1") {
    throw new Error("[SCHEMA_VERSION] unsupported canvas material schema");
  }
  if (typeof source.materialId !== "string" || source.materialId.length < 3) {
    throw new Error("[MATERIAL_ID] materialId must be a non-empty stable identifier");
  }
  if (source.status !== MATERIAL_STATUS) {
    throw new Error(`[MATERIAL_STATUS] status must remain ${MATERIAL_STATUS}`);
  }
  if (source.finalPersianMidnightSelection !== false) {
    throw new Error("[PERSIAN_MIDNIGHT_AUTHORITY] final selection must remain false");
  }
  if (!Array.isArray(source.nodes) || source.nodes.length === 0) {
    throw new Error("[NODES] nodes must be a non-empty array");
  }
  assertClosedKeys(source.outputs, OUTPUT_KEYS, "OUTPUTS");

  const ids = new Set();
  for (const [index, node] of source.nodes.entries()) {
    const label = `NODE_${index}`;
    assertObject(node, label);
    if (typeof node.id !== "string" || !/^[A-Za-z][A-Za-z0-9]*$/.test(node.id)) {
      throw new Error(`[${label}] invalid node id`);
    }
    if (ids.has(node.id)) throw new Error(`[NODE_DUPLICATE] ${node.id}`);
    ids.add(node.id);

    if (node.type === "literal") {
      assertClosedKeys(node, LITERAL_KEYS, label);
      if (!TOKEN_NAME.test(node.token ?? "")) throw new Error(`[${label}] invalid token`);
      if (!HEX_LITERAL.test(node.value ?? "")) {
        throw new Error(`[${label}] literal must be an uppercase six-digit colour`);
      }
      const primitiveValue = parsePrimitiveLiteral(primitiveCss, node.token);
      if (primitiveValue !== node.value) {
        throw new Error(
          `[PRIMITIVE_DRIFT] ${node.token} is ${primitiveValue} but the material source records ${node.value}`,
        );
      }
    } else if (node.type === "keyword") {
      assertClosedKeys(node, KEYWORD_KEYS, label);
      if (node.value !== "transparent") {
        throw new Error(`[${label}] only the transparent keyword is permitted`);
      }
    } else if (node.type === "mix") {
      assertClosedKeys(node, MIX_KEYS, label);
      if (!ALLOWED_SPACES.has(node.space)) throw new Error(`[${label}] unsupported colour space`);
      for (const [side, input] of [
        ["left", node.left],
        ["right", node.right],
      ]) {
        assertClosedKeys(input, INPUT_KEYS, `${label}_${side}`);
        if (typeof input.ref !== "string") throw new Error(`[${label}_${side}] ref is required`);
        if (input.weight !== undefined) assertIntegerWeight(input.weight, `${label}_${side}`);
      }
      if (node.left.weight !== undefined && node.right.weight !== undefined) {
        if (node.left.weight + node.right.weight !== 100) {
          throw new Error(`[${label}] explicit mix weights must total exactly 100`);
        }
      }
    } else {
      throw new Error(`[${label}] unsupported node type`);
    }
  }

  const nodes = nodeMapFrom(source);
  for (const outputName of OUTPUT_KEYS) {
    const nodeId = source.outputs[outputName];
    if (typeof nodeId !== "string") throw new Error(`[OUTPUTS] ${outputName} is required`);
    const visited = new Set();
    const terminals = new Set();
    walkReferences(nodeId, nodes, new Set(), visited, terminals);
    if (
      outputName === "canvas" &&
      [...terminals].some((terminalId) => {
        const terminal = nodes.get(terminalId);
        return terminal?.type === "keyword" && terminal.value === "transparent";
      })
    ) {
      throw new Error("[CANVAS_OPACITY] canvas output must not depend on transparent");
    }
  }

  return source;
}

export function renderMaterial(source, primitiveCss) {
  validateMaterialSource(source, primitiveCss);
  const nodes = nodeMapFrom(source);
  const loadedCanvas = renderNode(source.outputs.canvas, nodes, "loaded");
  const criticalCanvas = renderNode(source.outputs.canvas, nodes, "critical");
  const loadedForeground = renderNode(source.outputs.foreground, nodes, "loaded");
  const criticalForeground = renderNode(source.outputs.foreground, nodes, "critical");
  const digest = createHash("sha256").update(stableStringify(source)).digest("hex");

  const css = `/* GENERATED FILE — DO NOT EDIT.\n * Source: ${SOURCE_RELATIVE_PATH}\n * Regenerate: pnpm run generate:critical-paint\n */\n:root {\n  --smh-ink-navy: ${loadedCanvas};\n  --brand-ink: var(--smh-ink-navy);\n  --surface-canvas: var(--brand-ink);\n  --bg-ink: var(--surface-canvas);\n  --text-ink-high: ${loadedForeground};\n}\n`;

  const criticalCss = `:where(:root){--surface-canvas:${criticalCanvas};--bg-ink:var(--surface-canvas);--text-ink-high:${criticalForeground}}:where(html),:where(body){background:var(--surface-canvas);color:var(--text-ink-high)}`;
  const documentStyle = {
    background: `var(--surface-canvas, ${criticalCanvas})`,
    color: `var(--text-ink-high, ${criticalForeground})`,
  };
  const ts = `/* GENERATED FILE — DO NOT EDIT.\n * Source: ${SOURCE_RELATIVE_PATH}\n * Regenerate: pnpm run generate:critical-paint\n */\nexport const champagneCriticalPaintVersion = "v1";\nexport const champagneCriticalPaintSource = "${SOURCE_RELATIVE_PATH}";\nexport const champagneCriticalPaintSourceDigest = "sha256:${digest}";\nexport const champagneCriticalPaintCss = ${JSON.stringify(criticalCss)};\nexport const champagneCriticalPaintDocumentStyle = ${JSON.stringify(documentStyle, null, 2)} as const;\nexport const champagneCriticalPaintMetadata = {\n  schemaVersion: ${JSON.stringify(source.schemaVersion)},\n  materialId: ${JSON.stringify(source.materialId)},\n  finalPersianMidnightSelection: false,\n} as const;\n`;

  return {
    css,
    ts,
    criticalCss,
    documentStyle,
    loadedCanvas,
    criticalCanvas,
    loadedForeground,
    criticalForeground,
  };
}

export async function readInputs(repoRoot) {
  const [sourceText, primitiveCss] = await Promise.all([
    readFile(path.join(repoRoot, SOURCE_RELATIVE_PATH), "utf8"),
    readFile(path.join(repoRoot, PRIMITIVES_RELATIVE_PATH), "utf8"),
  ]);
  return { source: JSON.parse(sourceText), primitiveCss };
}

export async function renderRepository(repoRoot) {
  const { source, primitiveCss } = await readInputs(repoRoot);
  return renderMaterial(source, primitiveCss);
}

export async function checkGenerated(repoRoot) {
  const rendered = await renderRepository(repoRoot);
  const [actualCss, actualTs] = await Promise.all([
    readFile(path.join(repoRoot, GENERATED_CSS_RELATIVE_PATH), "utf8"),
    readFile(path.join(repoRoot, GENERATED_TS_RELATIVE_PATH), "utf8"),
  ]);
  const stale = [];
  if (actualCss !== rendered.css) stale.push(GENERATED_CSS_RELATIVE_PATH);
  if (actualTs !== rendered.ts) stale.push(GENERATED_TS_RELATIVE_PATH);
  if (stale.length > 0) {
    throw new Error(`[GENERATED_DRIFT] stale generated path(s): ${stale.join(", ")}`);
  }
  return rendered;
}

async function atomicWrite(targetPath, content) {
  const directory = path.dirname(targetPath);
  const tempDirectory = await mkdtemp(path.join(directory, ".critical-paint-"));
  const tempPath = path.join(tempDirectory, path.basename(targetPath));
  try {
    await writeFile(tempPath, content, "utf8");
    await rename(tempPath, targetPath);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}

export async function writeGenerated(repoRoot) {
  const rendered = await renderRepository(repoRoot);
  await atomicWrite(path.join(repoRoot, GENERATED_CSS_RELATIVE_PATH), rendered.css);
  await atomicWrite(path.join(repoRoot, GENERATED_TS_RELATIVE_PATH), rendered.ts);
  return rendered;
}

function resolveRepoRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../..");
}

async function main() {
  const mode = process.argv[2] ?? "--check";
  const repoRoot = resolveRepoRoot();
  if (mode === "--write") {
    await writeGenerated(repoRoot);
    console.log("✅ Champagne critical-paint artefacts generated deterministically.");
    return;
  }
  if (mode === "--check") {
    await checkGenerated(repoRoot);
    console.log("✅ Champagne critical-paint generated artefacts are current.");
    return;
  }
  throw new Error(`Unknown mode: ${mode}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
