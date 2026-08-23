import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../../app/champagne/design-lab/data/flows.ts", import.meta.url), "utf8");
const titleAuthority = source.slice(source.indexOf("const titles"), source.indexOf("const home"));
const semanticIds = [...titleAuthority.matchAll(/^\s+"((?:home|implants|bonding)\.[a-z0-9.-]+)":/gm)].map((match) => match[1]);

test("settled semantic authority contains 40 unique jobs", () => {
  assert.equal(semanticIds.length, 40);
  assert.equal(new Set(semanticIds).size, 40);
  assert.equal(semanticIds.filter((id) => id.startsWith("home.")).length, 13);
  assert.equal(semanticIds.filter((id) => id.startsWith("implants.")).length, 14);
  assert.equal(semanticIds.filter((id) => id.startsWith("bonding.")).length, 13);
});

test("six flows project the 40 jobs into exactly 80 A/B mappings", () => {
  assert.equal((source.match(/flow\("CDP-/g) ?? []).length, 6);
  assert.equal(2 * semanticIds.length, 80);
  for (const id of ["CDP-HOME-A-V2", "CDP-HOME-B-V2", "CDP-IMPLANT-A-V2", "CDP-IMPLANT-B-V2", "CDP-BOND-A-V2", "CDP-BOND-B-V2"]) assert.match(source, new RegExp(id));
});
