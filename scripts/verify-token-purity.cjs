const fs = require("node:fs/promises");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

const runtimeRoots = [
  "packages/champagne-sections/src",
  "packages/champagne-cta/src",
  "apps/web/app",
  "packages/champagne-hero/src",
].map((dir) => path.resolve(repoRoot, dir));

const runtimeExclusions = [
  "apps/web/app/champagne/hero-preview",
  "apps/web/app/champagne/hero-debug",
  "apps/web/app/champagne/hero-lab",
].map((dir) => path.resolve(repoRoot, dir));

const tokenSourceRoots = ["packages/champagne-tokens/styles/tokens"].map((dir) =>
  path.resolve(repoRoot, dir),
);

const tokenSourceFiles = [
  "packages/champagne-tokens/styles/champagne/gradients.css",
  "packages/champagne-tokens/styles/champagne/surface.css",
  "packages/champagne-tokens/styles/champagne/theme.css",
].map((file) => path.resolve(repoRoot, file));

const allowedExtensions = new Set([
  ".css",
  ".scss",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
]);

const offenderTypes = {
  HEX: "HEX",
  RGB: "RGB/RGBA",
  GRADIENT: "GRADIENT_LITERAL",
  VAR_FALLBACK: "VAR_FALLBACK_LITERAL",
  BOX_SHADOW: "BOX_SHADOW_LITERAL",
};

const forbiddenMatchers = {
  [offenderTypes.VAR_FALLBACK]:
    /var\(--[^,]+,\s*(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))/g,
  [offenderTypes.GRADIENT]:
    /\b(?:linear|radial)-gradient\([^)]*(#[0-9a-fA-F]{3,8}\b|rgba?\()[^)]*\)/g,
  [offenderTypes.BOX_SHADOW]:
    /\bbox-shadow\s*:[^;\n]*(#[0-9a-fA-F]{3,8}\b|rgba?\()/g,
  [offenderTypes.HEX]: /#[0-9a-fA-F]{3,8}\b/g,
  [offenderTypes.RGB]: /\brgba?\(/g,
};

const orderedTypes = [
  offenderTypes.HEX,
  offenderTypes.RGB,
  offenderTypes.GRADIENT,
  offenderTypes.VAR_FALLBACK,
  offenderTypes.BOX_SHADOW,
];

const sampleForbiddenReport = [
  {
    filePath: "path/to/file.tsx",
    line: 12,
    type: offenderTypes.HEX,
    value: "HEX_LITERAL",
    lineText: "color: HEX_LITERAL;",
  },
  {
    filePath: "path/to/styles.css",
    line: 47,
    type: offenderTypes.GRADIENT,
    value: "GRADIENT_LITERAL",
    lineText: "background: GRADIENT_LITERAL;",
  },
  {
    filePath: "path/to/file.tsx",
    line: 88,
    type: offenderTypes.VAR_FALLBACK,
    value: "VAR_FALLBACK_LITERAL",
    lineText: "background: VAR_FALLBACK_LITERAL;",
  },
];

const sampleAllowedReport = [
  {
    filePath: "packages/champagne-tokens/styles/tokens/core.css",
    line: 4,
    type: offenderTypes.HEX,
    value: "HEX_LITERAL",
    lineText: "--token-color: HEX_LITERAL;",
  },
];

const isWithin = (filePath, rootDir) => {
  const relative = path.relative(rootDir, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const isTokenSourceFile = (filePath) =>
  tokenSourceFiles.includes(filePath) ||
  tokenSourceRoots.some((root) => isWithin(filePath, root));

const isRuntimeExcluded = (filePath) =>
  runtimeExclusions.some((root) => isWithin(filePath, root));

const hasAllowedExtension = (filePath) => allowedExtensions.has(path.extname(filePath));

const collectFiles = async (rootDir, { excludeDirs = [] } = {}) => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.some((excludeDir) => isWithin(entryPath, excludeDir))) {
        continue;
      }
      const nestedFiles = await collectFiles(entryPath, { excludeDirs });
      files.push(...nestedFiles);
      continue;
    }
    if (!hasAllowedExtension(entryPath)) {
      continue;
    }
    files.push(entryPath);
  }

  return files;
};

const collectMatches = (line, index, filePath, matches) => {
  const excludeRanges = [];
  const addMatches = (type, regex) => {
    Array.from(line.matchAll(regex)).forEach((match) => {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      excludeRanges.push([start, end]);
      matches.push({
        filePath,
        line: index + 1,
        type,
        value: match[0],
        lineText: line.trim(),
      });
    });
  };

  addMatches(offenderTypes.VAR_FALLBACK, forbiddenMatchers[offenderTypes.VAR_FALLBACK]);
  addMatches(offenderTypes.GRADIENT, forbiddenMatchers[offenderTypes.GRADIENT]);
  addMatches(offenderTypes.BOX_SHADOW, forbiddenMatchers[offenderTypes.BOX_SHADOW]);

  const isExcluded = (matchIndex) =>
    excludeRanges.some(([start, end]) => matchIndex >= start && matchIndex < end);

  [offenderTypes.HEX, offenderTypes.RGB].forEach((type) => {
    const regex = forbiddenMatchers[type];
    Array.from(line.matchAll(regex)).forEach((match) => {
      const matchIndex = match.index ?? 0;
      if (isExcluded(matchIndex)) {
        return;
      }
      matches.push({
        filePath,
        line: index + 1,
        type,
        value: match[0],
        lineText: line.trim(),
      });
    });
  });
};

const scanFile = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, index) => {
    collectMatches(line, index, filePath, matches);
  });

  return matches;
};

const formatReportLine = (match) => {
  const relativePath = path.relative(repoRoot, match.filePath);
  return `${relativePath}:${match.line} [${match.type}] ${match.value} :: ${match.lineText}`;
};

const reportMatches = (label, matches, log) => {
  if (label) {
    log(label);
  }
  if (matches.length === 0) {
    log("  (none)");
    return;
  }
  orderedTypes.forEach((type) => {
    const typeMatches = matches.filter((match) => match.type === type);
    if (typeMatches.length === 0) {
      return;
    }
    log(`\n${type}`);
    typeMatches.forEach((match) => {
      log(formatReportLine(match));
    });
  });
};

const run = async () => {
  const runtimeFiles = (
    await Promise.all(
      runtimeRoots.map((root) => collectFiles(root, { excludeDirs: runtimeExclusions })),
    )
  )
    .flat()
    .filter((filePath) => !isRuntimeExcluded(filePath));
  const tokenFiles = (
    await Promise.all(tokenSourceRoots.map((root) => collectFiles(root)))
  ).flat();
  tokenSourceFiles.forEach((filePath) => {
    if (!tokenFiles.includes(filePath)) {
      tokenFiles.push(filePath);
    }
  });

  const forbiddenMatches = [];
  const allowedMatches = [];

  for (const filePath of runtimeFiles) {
    if (isTokenSourceFile(filePath)) {
      continue;
    }
    const matches = await scanFile(filePath);
    forbiddenMatches.push(...matches);
  }

  for (const filePath of tokenFiles) {
    if (!isTokenSourceFile(filePath)) {
      continue;
    }
    const matches = await scanFile(filePath);
    allowedMatches.push(...matches);
  }

  if (process.argv.includes("--demo")) {
    reportMatches("Allowed literals: token source", sampleAllowedReport, console.log);
    console.log("");
    reportMatches("Forbidden literals: runtime", sampleForbiddenReport, console.log);
    console.log("\nFAIL: token purity");
    console.log("\n(End of demo output)");
    return;
  }

  reportMatches("Allowed literals: token source", allowedMatches, console.log);

  if (forbiddenMatches.length > 0) {
    console.error("");
    reportMatches("Forbidden literals: runtime", forbiddenMatches, console.error);
    console.error("\nFAIL: token purity");
    process.exit(1);
  }

  console.log("");
  reportMatches("Forbidden literals: runtime", forbiddenMatches, console.log);
  console.log("\nPASS: token purity");
};

run().catch((error) => {
  console.error("FAIL: token purity");
  console.error(error);
  process.exit(1);
});
