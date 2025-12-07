import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

test("brand manifest exists and has static textures", () => {
  const manifestPath = "public/brand/manifest.json";
  assert.ok(fs.existsSync(manifestPath), "manifest file should exist");
  const json = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.ok(
    json.static?.textures?.filmGrain,
    "film grain texture should be defined",
  );
  assert.ok(
    json.static?.textures?.glassSoft,
    "glass soft texture should be defined",
  );
  assert.ok(
    json.static?.waves?.background,
    "wave background should be defined",
  );
  assert.ok(json.static?.waves?.mask, "wave mask should be defined");
});
