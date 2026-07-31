import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const headerSource = readFileSync(join(currentDir, "Header.tsx"), "utf8");

describe("Header navigation contract", () => {
  it("hydrates the public header and routes ordinary clicks through the Next client router", () => {
    expect(headerSource).toMatch(/^"use client";/);
    expect(headerSource).toContain('import { useRouter } from "next/navigation"');
    expect(headerSource).toContain("event.preventDefault()");
    expect(headerSource).toContain("router.push(href)");
  });

  it("preserves native browser behaviour for modified and non-primary clicks", () => {
    expect(headerSource).toContain("event.button !== 0");
    expect(headerSource).toContain("event.metaKey");
    expect(headerSource).toContain("event.ctrlKey");
    expect(headerSource).toContain("event.shiftKey");
    expect(headerSource).toContain("event.altKey");
  });
});
