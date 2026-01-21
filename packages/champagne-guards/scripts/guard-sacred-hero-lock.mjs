#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

const lockRelativePath = 'packages/champagne-guards/locks/sacred-hero.lock.json';
const manifestRelativePath = 'packages/champagne-manifests/data/champagne_machine_manifest_full.json';
const sacredFiles = [
  'packages/champagne-manifests/data/hero/sacred_hero_base.json',
  'packages/champagne-manifests/data/hero/sacred_hero_surfaces.json',
  'packages/champagne-manifests/data/hero/sacred_hero_variants.json',
];

const expectedHeroBinding = {
  heroId: 'sacred-home-hero',
  variantId: 'default',
};

const args = new Set(process.argv.slice(2));
const shouldUpdate = args.has('--update');

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return `sha256:${hash.digest('hex')}`;
}

function readJson(absolutePath, label) {
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing ${label} at ${path.relative(repoRoot, absolutePath)}`);
  }
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${error.message}`);
  }
}

function buildLockEntries() {
  return sacredFiles.map((relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Missing sacred hero file at ${relativePath}`);
    }
    return {
      path: relativePath,
      sha256: sha256File(absolutePath),
    };
  });
}

function ensureHeroBinding() {
  const manifestPath = path.join(repoRoot, manifestRelativePath);
  const manifest = readJson(manifestPath, 'champagne_machine_manifest_full.json');
  const pages = manifest?.pages;
  if (!pages || typeof pages !== 'object') {
    throw new Error('Manifest missing "pages" object.');
  }

  const matches = Object.values(pages).filter(
    (page) => page && typeof page === 'object' && page.path === '/',
  );

  if (matches.length === 0) {
    throw new Error('Manifest missing a page entry with path "/".');
  }

  const bindingMatch = matches.find((page) => {
    const binding = page.heroBinding;
    return (
      binding &&
      binding.heroId === expectedHeroBinding.heroId &&
      binding.variantId === expectedHeroBinding.variantId
    );
  });

  if (!bindingMatch) {
    throw new Error(
      `Manifest "/" page must bind heroBinding { heroId: "${expectedHeroBinding.heroId}", variantId: "${expectedHeroBinding.variantId}" }.`,
    );
  }
}

function updateLockFile(lockPath) {
  const entries = buildLockEntries().sort((a, b) => a.path.localeCompare(b.path));
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  fs.writeFileSync(
    lockPath,
    JSON.stringify({ entries }, null, 2) + '\n',
    'utf8',
  );
  console.log(`✅ Sacred hero lock updated (${entries.length} files).`);
}

function verifyLockFile(lockPath) {
  if (!fs.existsSync(lockPath)) {
    throw new Error(
      `Missing lock file ${path.relative(repoRoot, lockPath)}. Run "pnpm --filter @champagne/guards guard:sacred-hero-lock -- --update" to create it.`,
    );
  }

  const lock = readJson(lockPath, 'sacred hero lock');
  const entries = Array.isArray(lock?.entries) ? lock.entries : null;
  if (!entries) {
    throw new Error('Lock file missing "entries" array.');
  }

  const lockedMap = new Map(
    entries.map((entry) => [entry?.path, entry?.sha256]),
  );

  const missingEntries = sacredFiles.filter((filePath) => !lockedMap.has(filePath));
  const unexpectedEntries = entries
    .map((entry) => entry?.path)
    .filter((filePath) => filePath && !sacredFiles.includes(filePath));

  const mismatched = [];
  for (const filePath of sacredFiles) {
    const absolutePath = path.join(repoRoot, filePath);
    if (!fs.existsSync(absolutePath)) {
      mismatched.push(`${filePath} (missing file)`);
      continue;
    }
    const expected = lockedMap.get(filePath);
    const actual = sha256File(absolutePath);
    if (!expected || expected !== actual) {
      mismatched.push(filePath);
    }
  }

  if (missingEntries.length || unexpectedEntries.length || mismatched.length) {
    const lines = ['Sacred hero lock mismatch detected:'];
    if (missingEntries.length) {
      lines.push(`  - Missing entries: ${missingEntries.join(', ')}`);
    }
    if (unexpectedEntries.length) {
      lines.push(`  - Unexpected entries: ${unexpectedEntries.join(', ')}`);
    }
    if (mismatched.length) {
      lines.push(`  - Hash mismatch: ${mismatched.join(', ')}`);
    }
    lines.push(
      'If you intentionally updated sacred hero manifests, regenerate the lock with:',
    );
    lines.push('  pnpm --filter @champagne/guards guard:sacred-hero-lock -- --update');
    throw new Error(lines.join('\n'));
  }
}

try {
  ensureHeroBinding();
  const lockPath = path.join(repoRoot, lockRelativePath);
  if (shouldUpdate) {
    updateLockFile(lockPath);
  } else {
    verifyLockFile(lockPath);
    console.log('✅ Sacred hero lock verified.');
  }
} catch (error) {
  console.error('❌ Sacred hero guard failed:');
  console.error(`- ${error.message}`);
  process.exit(1);
}
