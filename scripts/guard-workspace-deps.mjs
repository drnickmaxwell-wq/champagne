#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const workspaceRoots = ["apps", "packages"];
const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

const rootPackageJson = readJson(path.join(rootDir, "package.json"));
const rootDeps = {
  ...rootPackageJson.dependencies,
  ...rootPackageJson.devDependencies,
};
const enforceEslint = Boolean(rootDeps.eslint);
const enforcedDeps = ["typescript", "ts-node", "@types/node"];
if (enforceEslint) {
  enforcedDeps.push("eslint");
}

const legacyAllowlist = new Map([
  ["apps/chat-ui/package.json", new Set(["typescript"])],
  ["apps/engine/package.json", new Set(["typescript", "ts-node"])],
  ["apps/ops-api/package.json", new Set(["typescript", "@types/node"])],
  ["apps/patient-portal/package.json", new Set(["typescript"])],
  ["apps/portal/package.json", new Set(["typescript"])],
  ["apps/stock/package.json", new Set(["typescript", "@types/node", "eslint"])],
  ["apps/web/package.json", new Set(["typescript", "@types/node", "eslint"])],
]);

const packageJsonPaths = [];
for (const workspaceRoot of workspaceRoots) {
  const basePath = path.join(rootDir, workspaceRoot);
  if (!fs.existsSync(basePath)) {
    continue;
  }

  for (const entry of fs.readdirSync(basePath, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageJsonPath = path.join(basePath, entry.name, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      packageJsonPaths.push(packageJsonPath);
    }
  }
}

const violations = [];
const warnings = [];
for (const packageJsonPath of packageJsonPaths) {
  const packageJson = readJson(packageJsonPath);
  for (const field of dependencyFields) {
    const deps = packageJson[field];
    if (!deps) {
      continue;
    }

    for (const depName of enforcedDeps) {
      if (!(depName in deps)) {
        continue;
      }

      const version = deps[depName];
      if (version !== "workspace:*") {
        const relPath = path.relative(rootDir, packageJsonPath);
        const allowed = legacyAllowlist.get(relPath)?.has(depName);
        const entry = {
          path: relPath,
          depName,
          version,
        };
        if (allowed) {
          warnings.push(entry);
        } else {
          violations.push(entry);
        }
      }
    }
  }
}

const lockfileIssues = [];
const lockfilePath = path.join(rootDir, "pnpm-lock.yaml");
if (!fs.existsSync(lockfilePath)) {
  lockfileIssues.push({
    message: "pnpm-lock.yaml not found (remediation: run pnpm install to update lockfile)",
  });
} else {
  const lockfile = fs.readFileSync(lockfilePath, "utf8").split(/\r?\n/);
  const importers = new Set();
  let inImporters = false;
  for (const line of lockfile) {
    if (!inImporters) {
      if (line.trim() === "importers:") {
        inImporters = true;
      }
      continue;
    }

    if (line.trim() === "") {
      continue;
    }

    if (!line.startsWith("  ")) {
      break;
    }

    if (line.startsWith("    ")) {
      continue;
    }

    const trimmed = line.trim();
    const key = trimmed.endsWith(":")
      ? trimmed.slice(0, -1)
      : trimmed.split(":")[0];
    if (key) {
      importers.add(key.trim());
    }
  }

  for (const packageJsonPath of packageJsonPaths) {
    const relDir = path
      .relative(rootDir, path.dirname(packageJsonPath))
      .replace(/\\/g, "/");
    if (!importers.has(relDir)) {
      lockfileIssues.push({
        message: `pnpm-lock.yaml missing importer for ${relDir} (remediation: run pnpm install to update lockfile)`,
      });
    }
  }
}

if (violations.length || lockfileIssues.length) {
  console.error("Workspace dependency guard failed.");
  for (const violation of violations) {
    console.error(
      `- ${violation.path}: ${violation.depName} -> ${violation.version} (remediation: use workspace:* or remove and rely on root tooling)`
    );
  }
  for (const warning of warnings) {
    console.warn(
      `- ${warning.path}: ${warning.depName} -> ${warning.version} (legacy warning: use workspace:* or remove and rely on root tooling)`
    );
  }
  for (const issue of lockfileIssues) {
    console.error(`- ${issue.message}`);
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn("Workspace dependency guard warnings (legacy allowlist):");
  for (const warning of warnings) {
    console.warn(
      `- ${warning.path}: ${warning.depName} -> ${warning.version} (legacy warning: use workspace:* or remove and rely on root tooling)`
    );
  }
}

console.log("Workspace dependency guard passed.");
