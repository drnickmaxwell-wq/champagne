import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

type CheckStatus = 'pass' | 'fail' | 'warn';

type CheckResult = {
  name: string;
  status: CheckStatus;
  details?: string[];
};

type DiffEntry = {
  rawStatus: string;
  status: string;
  path: string;
  oldPath?: string;
};

const repoRoot = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(repoRoot, 'reports');

const allowedRoots = [
  'app/treatments/',
  'components/brand/',
  'components/ai24/',
  'styles/brand/',
  'styles/tokens/',
  'public/brand-polish/',
  'public/waves/',
  'public/textures/',
  'public/particles/',
  'reports/',
  'tools/',
  'config/',
  '.github/',
];

const allowedExact = new Set<string>(['package.json']);

const requiredAssets = [
  'public/waves/smh-wave-mask.svg',
  'public/textures/film-grain-desktop.webp',
  'public/textures/film-grain-mobile.webp',
  'public/particles/particles-gold.webp',
  'public/particles/particles-teal.webp',
  'public/particles/particles-magenta.webp',
];

const champagneTokensPath = 'styles/tokens/smh-champagne-tokens.css';
const tokenVariables = [
  '--brand-magenta',
  '--brand-teal',
  '--brand-gold',
  '--surface-0',
  '--radius',
  '--shadow-soft',
];

const guardChecks: CheckResult[] = [];
const errors: string[] = [];
const warnings: string[] = [];

function resolveDiffBase(): string {
  const envBase = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main';
  const fallbacks = ['origin/main', 'main'];
  const candidates = [envBase, ...fallbacks.filter((ref) => ref !== envBase)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (isRefValid(candidate)) {
      return candidate;
    }
  }
  return 'main';
}

function isRefValid(ref: string): boolean {
  try {
    execSync(`git rev-parse --verify ${ref}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function parseNameStatus(output: string): DiffEntry[] {
  const entries: DiffEntry[] = [];
  const lines = output.split('\n').filter(Boolean);
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 2) continue;
    const rawStatus = parts[0];
    const status = rawStatus[0];
    if (status === 'R' && parts.length >= 3) {
      entries.push({ rawStatus, status, oldPath: parts[1], path: parts[2] });
    } else {
      entries.push({ rawStatus, status, path: parts[1] });
    }
  }
  return entries;
}

function getDiffEntries(range: string): DiffEntry[] {
  const output = execSync(`git diff --name-status ${range}`, { cwd: repoRoot, encoding: 'utf-8' });
  return parseNameStatus(output);
}

function getWorkingTreeDiffEntries(): DiffEntry[] {
  const output = execSync('git diff --name-status HEAD', { cwd: repoRoot, encoding: 'utf-8' });
  return parseNameStatus(output);
}

type NumstatEntry = {
  added: string;
  deleted: string;
  path: string;
  isBinary: boolean;
};

function parseNumstat(output: string): Map<string, NumstatEntry> {
  const map = new Map<string, NumstatEntry>();
  const lines = output.split('\n').filter(Boolean);
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    const [added, deleted, pathInfo] = parts;
    const cleanPath = pathInfo.includes(' -> ') ? pathInfo.split(' -> ').pop() ?? pathInfo : pathInfo;
    map.set(cleanPath, {
      added,
      deleted,
      path: cleanPath,
      isBinary: added === '-' || deleted === '-',
    });
  }
  return map;
}

function getNumstatMap(range: string): Map<string, NumstatEntry> {
  const output = execSync(`git diff --numstat ${range}`, { cwd: repoRoot, encoding: 'utf-8' });
  return parseNumstat(output);
}

function getWorkingTreeNumstat(): Map<string, NumstatEntry> {
  const output = execSync('git diff --numstat HEAD', { cwd: repoRoot, encoding: 'utf-8' });
  return parseNumstat(output);
}

function isPathAllowed(filePath: string | undefined): boolean {
  if (!filePath) return true;
  if (allowedExact.has(filePath)) {
    return true;
  }
  return allowedRoots.some((root) => filePath.startsWith(root));
}

function addCheck(result: CheckResult) {
  guardChecks.push(result);
  if (result.status === 'fail') {
    errors.push(...(result.details ?? [`${result.name} failed`]));
  } else if (result.status === 'warn') {
    warnings.push(...(result.details ?? [`${result.name} warning`]));
  }
}

const diffBase = resolveDiffBase();
const diffRange = `${diffBase}...HEAD`;
let diffEntries: DiffEntry[] = [];
let numstatMap = new Map<string, NumstatEntry>();
let diffLoadError = false;
let diffDisplayRange = diffRange;

try {
  diffEntries = getDiffEntries(diffRange);
  numstatMap = getNumstatMap(diffRange);
} catch (error) {
  diffLoadError = true;
  errors.push(`Failed to read git diff: ${(error as Error).message}`);
  try {
    diffEntries = getWorkingTreeDiffEntries();
    numstatMap = getWorkingTreeNumstat();
    diffDisplayRange = 'HEAD (working tree)';
    diffLoadError = false;
    warnings.push('Falling back to working tree diff because base ref was unavailable');
  } catch (innerError) {
    errors.push(`Working tree diff failed: ${(innerError as Error).message}`);
  }
}

// Check B: whitelist enforcement
if (diffLoadError) {
  addCheck({
    name: 'Whitelist enforcement',
    status: 'fail',
    details: ['Unable to analyze git diff for whitelist enforcement'],
  });
} else if (diffEntries.length > 0) {
  const disallowedPaths: string[] = [];
  for (const entry of diffEntries) {
    const pathsToCheck = new Set<string>();
    if (entry.path) pathsToCheck.add(entry.path);
    if (entry.oldPath) pathsToCheck.add(entry.oldPath);
    for (const candidate of pathsToCheck) {
      if (!isPathAllowed(candidate)) {
        disallowedPaths.push(`${entry.rawStatus} ${candidate}`);
      }
    }
  }
  if (disallowedPaths.length > 0) {
    addCheck({
      name: 'Whitelist enforcement',
      status: 'fail',
      details: [
        'The following paths are outside the approved whitelist:',
        ...disallowedPaths,
      ],
    });
  } else {
    addCheck({ name: 'Whitelist enforcement', status: 'pass' });
  }
} else {
  addCheck({ name: 'Whitelist enforcement', status: 'pass', details: ['No changes detected'] });
}

// Check C: block route deletions/renames
const routeChangeViolations: string[] = [];
for (const entry of diffEntries) {
  if ((entry.status === 'D' || entry.status === 'R') && ((entry.path && entry.path.startsWith('app/treatments/')) || (entry.oldPath && entry.oldPath.startsWith('app/treatments/')))) {
    if (entry.status === 'R') {
      routeChangeViolations.push(`Renames are not allowed under app/treatments: ${entry.oldPath} -> ${entry.path}`);
    } else {
      routeChangeViolations.push(`Deletions are not allowed under app/treatments: ${entry.path || entry.oldPath}`);
    }
  }
}
if (routeChangeViolations.length > 0) {
  addCheck({ name: 'Route deletion/rename guard', status: 'fail', details: routeChangeViolations });
} else {
  addCheck({ name: 'Route deletion/rename guard', status: 'pass' });
}

// Check D: new binary files over 2 MB
const largeBinaryIssues: string[] = [];
for (const entry of diffEntries) {
  if (entry.status === 'A') {
    try {
      const filePath = path.join(repoRoot, entry.path);
      const stats = fs.statSync(filePath);
      const numstat = numstatMap.get(entry.path);
      if (numstat?.isBinary && stats.size > 2 * 1024 * 1024) {
        largeBinaryIssues.push(`Binary file ${entry.path} is ${stats.size} bytes (> 2 MB)`);
      }
    } catch (error) {
      largeBinaryIssues.push(`Unable to stat new file ${entry.path}: ${(error as Error).message}`);
    }
  }
}
if (largeBinaryIssues.length > 0) {
  addCheck({ name: 'Binary size guard', status: 'fail', details: largeBinaryIssues });
} else {
  addCheck({ name: 'Binary size guard', status: 'pass' });
}

// Check E: champagne assets and tokens
const missingAssets: string[] = [];
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(repoRoot, asset))) {
    missingAssets.push(asset);
  }
}
let tokensMissing: string[] = [];
if (!fs.existsSync(path.join(repoRoot, champagneTokensPath))) {
  missingAssets.push(champagneTokensPath);
} else {
  try {
    const tokenFile = fs.readFileSync(path.join(repoRoot, champagneTokensPath), 'utf-8');
    tokensMissing = tokenVariables.filter((token) => !tokenFile.includes(token));
  } catch (error) {
    tokensMissing.push(`Failed to read champagne tokens file: ${(error as Error).message}`);
  }
}
const champagneIssues: string[] = [];
if (missingAssets.length > 0) {
  champagneIssues.push(`Missing required assets: ${missingAssets.join(', ')}`);
}
if (tokensMissing.length > 0) {
  champagneIssues.push(`Missing required token definitions: ${tokensMissing.join(', ')}`);
}
if (champagneIssues.length > 0) {
  addCheck({ name: 'Champagne assets', status: 'fail', details: champagneIssues });
} else {
  addCheck({ name: 'Champagne assets', status: 'pass' });
}

// Check F: route allowlist verification
const allowlistPath = path.join(__dirname, 'route-allowlist.json');
let routeAllowlist: string[] = [];
let allowlistIssues: string[] = [];
try {
  const content = fs.readFileSync(allowlistPath, 'utf-8');
  routeAllowlist = JSON.parse(content) as string[];
  const missingRoutes = routeAllowlist.filter((route) => {
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    const routePath = path.join(repoRoot, 'app', cleanRoute, 'page.tsx');
    return !fs.existsSync(routePath);
  });
  if (missingRoutes.length > 0) {
    allowlistIssues = missingRoutes.map((route) => `Missing page for route ${route}`);
  }
} catch (error) {
  allowlistIssues = [`Unable to load route allowlist: ${(error as Error).message}`];
}
if (allowlistIssues.length > 0) {
  addCheck({ name: 'Route allowlist', status: 'fail', details: allowlistIssues });
} else {
  addCheck({ name: 'Route allowlist', status: 'pass' });
}

// Check G: Brand hero gradient sanity
const brandHeroPath = path.join(repoRoot, 'components/brand/BrandHeroGradient.tsx');
const brandHeroIssues: string[] = [];
if (!fs.existsSync(brandHeroPath)) {
  brandHeroIssues.push('components/brand/BrandHeroGradient.tsx is missing');
} else {
  try {
    const brandHeroContent = fs.readFileSync(brandHeroPath, 'utf-8');
    if (!brandHeroContent.includes('particles')) {
      brandHeroIssues.push('BrandHeroGradient should reference particle assets');
    }
    if (!brandHeroContent.includes('film-grain')) {
      brandHeroIssues.push('BrandHeroGradient should reference film grain textures');
    }
  } catch (error) {
    brandHeroIssues.push(`Failed to read BrandHeroGradient: ${(error as Error).message}`);
  }
}
if (brandHeroIssues.length > 0) {
  addCheck({ name: 'Brand hero gradient', status: 'fail', details: brandHeroIssues });
} else {
  addCheck({ name: 'Brand hero gradient', status: 'pass' });
}

// Check H: pnpm typecheck
const typecheckResult = spawnSync('pnpm', ['typecheck'], {
  cwd: repoRoot,
  encoding: 'utf-8',
  stdio: 'pipe',
});
const typecheckOutput = (typecheckResult.stdout ?? '') + (typecheckResult.stderr ?? '');
const typecheckPassed = typecheckResult.status === 0;
addCheck({
  name: 'pnpm typecheck',
  status: typecheckPassed ? 'pass' : 'fail',
  details: [`Exit code: ${typecheckResult.status ?? typecheckResult.signal}`, typecheckPassed ? 'Typecheck succeeded' : 'Typecheck failed'],
});
if (!typecheckPassed) {
  errors.push('pnpm typecheck failed');
}

// Check I: pnpm build (non-blocking)
const buildEnv = { ...process.env, CI: '1' };
const buildResult = spawnSync('pnpm', ['build', '--no-lint'], {
  cwd: repoRoot,
  encoding: 'utf-8',
  stdio: 'pipe',
  env: buildEnv,
});
const buildOutput = (buildResult.stdout ?? '') + (buildResult.stderr ?? '');
const buildPassed = buildResult.status === 0;
addCheck({
  name: 'pnpm build (no lint)',
  status: buildPassed ? 'pass' : 'warn',
  details: [`Exit code: ${buildResult.status ?? buildResult.signal}`, buildPassed ? 'Build succeeded' : 'Build reported issues (non-blocking)'],
});
if (!buildPassed) {
  warnings.push('pnpm build reported non-blocking issues');
}

const report = {
  generatedAt: new Date().toISOString(),
  diffBase,
  diffDisplayRange,
  checks: guardChecks,
  errors,
  warnings,
  typecheck: {
    exitCode: typecheckResult.status,
    output: typecheckOutput,
  },
  build: {
    exitCode: buildResult.status,
    output: buildOutput,
  },
  diff: diffEntries,
};

fs.mkdirSync(reportsDir, { recursive: true });

const jsonReportPath = path.join(reportsDir, 'GUARD_PRECHECK.json');
const mdReportPath = path.join(reportsDir, 'GUARD_PRECHECK.md');

fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), 'utf-8');

const statusEmoji: Record<CheckStatus, string> = {
  pass: '✅',
  fail: '❌',
  warn: '⚠️',
};

const mdLines: string[] = [];
mdLines.push('# Brand Guard Preflight Summary');
mdLines.push('');
mdLines.push(`- Generated: ${report.generatedAt}`);
mdLines.push(`- Diff range: ${diffDisplayRange}`);
mdLines.push('');
mdLines.push('| Check | Status | Details |');
mdLines.push('| --- | --- | --- |');
for (const check of guardChecks) {
  const detail = check.details?.join('<br/>') ?? '';
  mdLines.push(`| ${check.name} | ${statusEmoji[check.status]} | ${detail} |`);
}
mdLines.push('');
mdLines.push('## Command Outputs');
mdLines.push('');
mdLines.push('### pnpm typecheck');
mdLines.push('');
mdLines.push('```');
mdLines.push(typecheckOutput.trim() || '(no output)');
mdLines.push('```');
mdLines.push('');
mdLines.push('### pnpm build --no-lint (CI=1)');
mdLines.push('');
mdLines.push('```');
mdLines.push(buildOutput.trim() || '(no output)');
mdLines.push('```');

fs.writeFileSync(mdReportPath, mdLines.join('\n'), 'utf-8');

const hardFailures = guardChecks.filter((check) => check.status === 'fail');
const exitCode = hardFailures.length > 0 ? 1 : 0;

process.exit(exitCode);
