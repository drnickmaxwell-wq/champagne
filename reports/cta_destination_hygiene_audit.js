const fs = require("fs");
const path = require("path");

const manifestDir = path.join(__dirname, "../packages/champagne-manifests/data/sections/smh");
const machineManifest = require("../packages/champagne-manifests/data/champagne_machine_manifest_full.json");
const journeyPlan = require("../packages/champagne-manifests/data/sections/smh/treatment_journeys.json");
const intentManifest = require("../packages/champagne-manifests/data/sections/smh/cta_intents.json");

const TREATMENT_PATH_ALIASES = {
  "/treatments/retainers": "/treatments/dental-retainers",
  "/treatments/dental-implants": "/treatments/implants",
  "/treatments/hygiene": "/treatments/preventative-and-general-dentistry",
  "/treatments/3d-printed-implant-restorations": "/treatments/3d-implant-restorations",
};

const allowedStaticRoutes = new Set([
  "/contact",
  "/treatments",
  "/patient-portal",
  "/practice-plan",
  "/video-consultation",
  "/finance",
  "/smile-gallery",
  "/team",
  "/blog",
  "/dental-checkups-oral-cancer-screening",
]);

const canonicalTreatments = [...Object.values(machineManifest.pages || {}), ...Object.values(machineManifest.treatments || {})]
  .filter((entry) => typeof entry?.path === "string" && entry.path.startsWith("/treatments/"));

const treatmentLabelMap = new Map();
const treatmentPaths = new Set();
canonicalTreatments.forEach((entry) => {
  if (!entry?.path) return;
  treatmentPaths.add(entry.path);
  const slug = entry.path.split("/").filter(Boolean).pop();
  const labels = new Set();
  labels.add(normalizeText(slug || ""));
  if (entry.label) labels.add(normalizeText(String(entry.label)));
  if (entry.title) labels.add(normalizeText(String(entry.title)));
  treatmentLabelMap.set(entry.path, labels);
});

const explicitKeywordMap = new Map([
  ["cbct", "/treatments/cbct-3d-scanning"],
  ["cbct planning", "/treatments/cbct-3d-scanning"],
  ["cbct 3d", "/treatments/cbct-3d-scanning"],
  ["3d printed dentures", "/treatments/3d-printed-dentures"],
  ["implant retained denture", "/treatments/implant-retained-dentures"],
  ["implant retained dentures", "/treatments/implant-retained-dentures"],
  ["retained dentures", "/treatments/implant-retained-dentures"],
  ["oral surgery planning", "/treatments/extractions-and-oral-surgery"],
]);

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveHref(rawHref) {
  if (!rawHref) return { rawHref, resolvedHref: "", valid: false, reason: "missing" };
  try {
    const url = new URL(rawHref, "https://example.com");
    const normalizedPath = url.pathname;
    const aliased = TREATMENT_PATH_ALIASES[normalizedPath] || normalizedPath;
    const base = aliased + (url.search || "");
    const valid = treatmentPaths.has(aliased) || allowedStaticRoutes.has(aliased);
    return { rawHref, resolvedHref: base, valid, reason: valid ? undefined : "unregistered" };
  } catch (error) {
    return { rawHref, resolvedHref: rawHref, valid: false, reason: "parse_error" };
  }
}

function matchTreatment(label) {
  const normalized = normalizeText(label);
  const explicitMatches = new Set();
  explicitKeywordMap.forEach((path, keyword) => {
    if (normalized.includes(keyword)) {
      explicitMatches.add(path);
    }
  });

  if (explicitMatches.size > 0) {
    return Array.from(explicitMatches);
  }

  const matches = new Set();
  for (const [pathKey, labels] of treatmentLabelMap.entries()) {
    for (const candidate of labels) {
      if (!candidate) continue;
      if (candidate.length < 4) continue;
      if (normalized.includes(candidate)) {
        matches.add(pathKey);
      }
    }
  }

  return Array.from(matches);
}

function isMachineLabel(label) {
  if (!label) return false;
  const normalized = label.trim();
  if (/[A-Z]/.test(normalized)) return false;
  if (!/\s/.test(normalized) && /[._]/.test(normalized)) return true;
  if (/treatments?\./i.test(normalized)) return true;
  return false;
}

function loadTreatmentFiles() {
  return fs
    .readdirSync(manifestDir)
    .filter((file) => file.startsWith("treatments.") && file.endsWith(".json"))
    .map((file) => path.join(manifestDir, file));
}

function routeIdToPath(routeId) {
  if (!routeId) return undefined;
  return "/" + routeId.replace(/^treatments\./, "treatments/");
}

function collectJourneyLookup() {
  const lookup = new Map();
  (journeyPlan.treatments || []).forEach((entry) => {
    if (!entry?.routeId) return;
    lookup.set(entry.routeId, entry);
  });
  return lookup;
}

function collectIntentLookup() {
  const lookup = new Map();
  const intents = intentManifest?.cta_intents || {};
  Object.entries(intents).forEach(([key, value]) => lookup.set(key, String(value)));
  return lookup;
}

function analyzeCTA({ label, href, route, routePath, source, sourceFile }) {
  const { resolvedHref, valid, reason, rawHref } = resolveHref(href);
  let matches = matchTreatment(label);
  if (routePath && matches.length > 1 && matches.includes(routePath)) {
    matches = [routePath];
  }
  const mentionsTreatment = matches.length > 0;
  const contactFallback = rawHref?.startsWith("/contact");
  const machineLabel = isMachineLabel(label);
  const issue = !valid ? "invalid" : mentionsTreatment && contactFallback ? "contact_fallback" : undefined;
  return { label, href, resolvedHref, valid, issue, matches, mentionsTreatment, contactFallback, machineLabel, route, source, sourceFile };
}

function audit() {
  const files = loadTreatmentFiles();
  const journeyLookup = collectJourneyLookup();
  const intentLookup = collectIntentLookup();

  const report = {
    treatmentsAudited: 0,
    totalCTAs: 0,
    invalidHrefCount: 0,
    contactMentions: 0,
    machineLabelCount: 0,
    fixes: [],
    ambiguous: [],
    entries: [],
    invalidEntries: [],
  };

  files.forEach((filePath) => {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const routeId = data.routeId || "";
    const routePath = routeIdToPath(routeId);
    if (!routePath) return;
    const slug = routePath.split("/").filter(Boolean).pop();
    report.treatmentsAudited += 1;

    let hasMidSection = false;
    let hasClosingSection = false;

    const fileCTAs = [];

    (data.sections || []).forEach((section) => {
      const component = section.componentId || section.type;
      const role = section.seoRole;
      const ctas = Array.isArray(section.ctas) ? section.ctas : [];
      const sectionId = section.instanceId || section.id || component || "section";
      if (component === "treatment_mid_cta") {
        hasMidSection = true;
        ctas.forEach((cta) =>
          fileCTAs.push({ ref: cta, ...cta, source: `mid (section ${sectionId})`, sourceFile: filePath, routePath }),
        );
      }
      if ((component && component.includes("cta") && role === "cta") || component === "treatment_closing_cta") {
        hasClosingSection = true;
        ctas.forEach((cta) =>
          fileCTAs.push({ ref: cta, ...cta, source: `closing (section ${sectionId})`, sourceFile: filePath, routePath }),
        );
      }
    });

    const journey = journeyLookup.get(routeId);
    if (journey) {
      const midJourney = journey?.journey?.mid_page_cta;
      if (midJourney?.href && midJourney?.label) {
        fileCTAs.push({ ...midJourney, source: "mid (journey)", sourceFile: "treatment_journeys.json", routePath });
      }
      const targets = journey?.cta_targets || {};
      ["primary", "secondary", "tertiary"].forEach((slot) => {
        const target = targets[slot];
        if (target?.label && target?.href) {
          fileCTAs.push({ ...target, source: `closing (journey ${slot})`, sourceFile: "treatment_journeys.json", routePath });
        }
      });
      const intents = journey?.journey || {};
      ["primary_intent", "secondary_intent", "reassurance_intent"].forEach((intentKey) => {
        const intent = intents[intentKey];
        if (intent && intentLookup.has(intent)) {
          fileCTAs.push({
            label: intentLookup.get(intent),
            href: undefined,
            source: `intent (${intentKey})`,
            sourceFile: "cta_intents.json",
            routePath,
          });
        }
      });
    }

    if (!hasMidSection) {
      report.entries.push({ route: slug, note: "missing mid cta" });
    }
    if (!hasClosingSection) {
      report.entries.push({ route: slug, note: "missing closing cta" });
    }

    fileCTAs.forEach((cta) => {
      if (!cta.href) return;
      const result = analyzeCTA({ ...cta, route: slug, source: cta.source, sourceFile: cta.sourceFile, routePath });
      const willFix = result.matches.length === 1 && result.contactFallback;
      const finalValid = willFix ? true : result.valid;

      report.totalCTAs += 1;
      if (!finalValid) {
        report.invalidHrefCount += 1;
        report.invalidEntries.push({ route: slug, label: cta.label, href: cta.href, source: cta.source });
      }
      if (result.machineLabel) report.machineLabelCount += 1;
      if (result.contactFallback && result.mentionsTreatment && !willFix) report.contactMentions += 1;

      if (willFix) {
        const target = result.matches[0];
        const newHref = target;
        if (newHref && newHref !== cta.href) {
          report.fixes.push({ route: slug, label: cta.label, oldHref: cta.href, newHref, source: cta.source, sourceFile: cta.sourceFile, targetPath: target });
          cta.__nextHref = newHref;
        }
      }

      if (result.matches.length > 1 && result.contactFallback) {
        report.ambiguous.push({ route: slug, label: cta.label, href: cta.href, candidates: result.matches });
      }
    });

    const pendingWrites = new Map();
    fileCTAs
      .filter((cta) => cta.__nextHref && cta.sourceFile === filePath && cta.ref)
      .forEach((cta) => {
        pendingWrites.set(filePath, true);
        cta.ref.href = cta.__nextHref;
      });

    if (pendingWrites.has(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    }
  });

  return report;
}

function renderReport(report) {
  const lines = [];
  lines.push("# CTA Destination Hygiene Report");
  lines.push("");
  lines.push("## Summary");
  lines.push(`- Total treatment slugs audited: ${report.treatmentsAudited}`);
  lines.push(`- Total CTAs checked (mid + closing): ${report.totalCTAs}`);
  lines.push(`- Invalid hrefs: ${report.invalidHrefCount}`);
  lines.push(`- /contact fallbacks that mention a known treatment: ${report.contactMentions}`);
  lines.push(`- Machine-id labels: ${report.machineLabelCount}`);
  lines.push(`- Fixed automatically: ${report.fixes.length}`);
  lines.push(`- Ambiguous (needs clinician choice): ${report.ambiguous.length}`);
  lines.push("");

  lines.push("## Applied fixes");
  lines.push("");
  if (report.fixes.length === 0) {
    lines.push("_No automatic fixes applied._");
  } else {
    lines.push("| Route | CTA label | Old href | New href | Source |");
    lines.push("| --- | --- | --- | --- | --- |");
    report.fixes.forEach((fix) => {
      lines.push(`| ${fix.route} | ${fix.label} | ${fix.oldHref} | ${fix.newHref} | ${fix.source} |`);
    });
  }
  lines.push("");

  lines.push("## Ambiguous items");
  lines.push("");
  if (report.ambiguous.length === 0) {
    lines.push("_None_\n");
  } else {
    report.ambiguous.forEach((entry) => {
      lines.push(`- ${entry.route}: ${entry.label} (${entry.href}) → candidates: ${entry.candidates.join(", ")}`);
    });
    lines.push("");
  }

  lines.push("## Invalid CTA targets");
  lines.push("");
  if (report.invalidEntries.length === 0) {
    lines.push("_None_");
  } else {
    lines.push("| Route | CTA label | Href | Source |");
    lines.push("| --- | --- | --- | --- |");
    report.invalidEntries.forEach((entry) => {
      lines.push(`| ${entry.route} | ${entry.label} | ${entry.href} | ${entry.source ?? ""} |`);
    });
  }

  lines.push("");

  const destination = path.join(__dirname, "../REPORTS/CTA_DESTINATION_HYGIENE_REPORT.md");
  fs.writeFileSync(destination, lines.join("\n"));
}

const report = audit();
renderReport(report);
