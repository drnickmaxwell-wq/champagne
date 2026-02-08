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
        violations.push({
          path: path.relative(rootDir, packageJsonPath),
          depName,
          version,
        });
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
    if (trimmed.endsWith(":")) {
      importers.add(trimmed.slice(0, -1));
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
  for (const issue of lockfileIssues) {
    console.error(`- ${issue.message}`);
  }
  process.exit(1);
}

console.log("Workspace dependency guard passed.");
