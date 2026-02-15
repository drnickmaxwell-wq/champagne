#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conciergeLayerPath = resolve("apps/web/app/components/concierge/ConciergeLayer.tsx");

const failures = [];

let source = "";
try {
  source = readFileSync(conciergeLayerPath, "utf8");
} catch (error) {
  failures.push(`Missing required contract consumer file: ${conciergeLayerPath}`);
}

if (source) {
  const supportsCardBodyOrDescription =
    /description:\s*card\.description\s*\?\?\s*card\.body/.test(source)
    || /description:\s*card\.body\s*\?\?\s*card\.description/.test(source);

  if (!supportsCardBodyOrDescription) {
    failures.push(
      "Concierge card contract drift: cards must support body OR description (description-only expectation detected).",
    );
  }

  const supportsStringPayload = /typeof\s+action\.payload\s*===\s*"string"/.test(source);
  const supportsObjectPayload =
    /typeof\s+action\.payload\s*===\s*"object"/.test(source)
    || /action\.payload\s*&&\s*typeof\s+action\.payload\s*===\s*"object"/.test(source);

  if (!supportsStringPayload || !supportsObjectPayload) {
    failures.push(
      "Concierge postback contract drift: action.payload must accept string OR object (string-only expectation detected).",
    );
  }
}

if (failures.length > 0) {
  console.error("[guard:concierge-contract] FAIL");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log("[guard:concierge-contract] PASS — concierge accepts card.body|description and payload string|object.");
