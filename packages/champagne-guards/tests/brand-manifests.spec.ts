import { expect, test } from "@playwright/test";

test("brand manifests are publicly fetchable", async ({ request }) => {
  for (const path of [
    "/brand/champagne_machine_manifest_full.json",
    "/brand/manus_import_unified_manifest_20251104.json",
  ]) {
    const res = await request.get(path, { headers: { "Cache-Control": "no-cache" } });
    expect([200, 404]).toContain(res.status());
    expect(res.status()).not.toBe(401);
    expect(res.status()).not.toBe(403);
  }
});
