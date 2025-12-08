import { mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function runGuard(root) {
  const result = spawnSync('node', ['scripts/brand-guard.cjs'], {
    env: { ...process.env, BRAND_GUARD_ROOT: root },
    stdio: 'inherit',
  });
  if (result.error) {
    throw result.error;
  }
  return result.status;
}

function main() {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'brand-guard-smoke-'));
  ensureDir(join(tmpRoot, 'app'));
  ensureDir(join(tmpRoot, 'public/brand'));
  ensureDir(join(tmpRoot, 'styles/tokens'));

  const tokensPath = join(tmpRoot, 'styles/tokens/smh-champagne-tokens.css');
  writeFileSync(
    tokensPath,
    `:root {\n  --smh-gradient: linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%);\n}\n`
  );

  const okFile = join(tmpRoot, 'app/ok.tsx');
  writeFileSync(
    okFile,
    "const Ok = () => <div style={{ color: 'var(--smh-ink)' }}>ok</div>;\nexport default Ok;\n"
  );

  const manifestPath = join(tmpRoot, 'public/brand/example-manifest.json');
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        name: 'Example',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        description: 'Includes legacy gradient fallback',
        brandGradient: '#D94BC6 → #00C2C7',
      },
      null,
      2
    )
  );

  const statusA = runGuard(tmpRoot);
  if (statusA !== 0) {
    console.error(`FAIL smoke A: expected exit 0 but received ${statusA}`);
    process.exit(1);
  }
  console.log('PASS smoke A');

  const rogueFile = join(tmpRoot, 'app/rogue.tsx');
  writeFileSync(
    rogueFile,
    "const Rogue = () => <span style={{ color: '#C2185B' }}>nope</span>;\nexport default Rogue;\n"
  );

  const statusB = runGuard(tmpRoot);
  if (statusB !== 1) {
    console.error(`FAIL smoke B: expected exit 1 but received ${statusB}`);
    process.exit(1);
  }
  console.log('PASS smoke B');
}

try {
  main();
} catch (error) {
  console.error('Brand guard smoke test encountered an error:', error);
  process.exit(1);
}
