export function normalizeLabel(label?: string) {
  if (!label) return "";
  return label
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface DedupeOptions {
  normalizeHref?: (href?: string) => string | undefined;
  max?: number;
}

export interface DedupeResult<T> {
  buttons: T[];
  dropped: { entry: T; reason: "href" | "label" | "missing" }[];
}

export function dedupeButtons<T extends { href?: string; label?: string }>(
  entries: T[],
  options: DedupeOptions = {},
): DedupeResult<T> {
  const normalizeHref = options.normalizeHref ?? ((href?: string) => href);
  const seenHrefs = new Set<string>();
  const seenLabels = new Set<string>();
  const dropped: DedupeResult<T>["dropped"] = [];
  const buttons: T[] = [];

  for (const entry of entries) {
    const normalizedHref = normalizeHref(entry.href);
    const normalizedLabel = normalizeLabel(entry.label);
    if (!normalizedHref || !normalizedLabel) {
      dropped.push({ entry, reason: "missing" });
      continue;
    }

    if (seenHrefs.has(normalizedHref)) {
      dropped.push({ entry, reason: "href" });
      continue;
    }

    if (seenLabels.has(normalizedLabel)) {
      dropped.push({ entry, reason: "label" });
      continue;
    }

    seenHrefs.add(normalizedHref);
    seenLabels.add(normalizedLabel);
    buttons.push(entry);

    if (typeof options.max === "number" && buttons.length >= options.max) {
      break;
    }
  }

  return { buttons, dropped };
}

export function dedupeSupportingLines(
  lines: string[],
  usedButtonLabels: string[],
): { lines: string[]; dropped: { label: string; reason: "button" | "line" }[] } {
  const seen = new Set<string>(usedButtonLabels.map(normalizeLabel));
  const dropped: { label: string; reason: "button" | "line" }[] = [];
  const deduped: string[] = [];

  lines.forEach((line) => {
    const normalized = normalizeLabel(line);
    if (!normalized) return;
    if (seen.has(normalized)) {
      dropped.push({ label: line, reason: "button" });
      return;
    }
    seen.add(normalized);
    deduped.push(line);
  });

  return { lines: deduped, dropped };
}
