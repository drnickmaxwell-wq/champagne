#!/usr/bin/env node
const { spawn } = require('node:child_process');
const { CANON_GRADIENT } = require('./brand-report.cjs');

const url = process.env.BRAND_PREVIEW_URL || 'http://localhost:3000/preview/brand-lock';

(async () => {
  // Lightweight check using Playwright test if available; otherwise curl the CSS var via a page script.
  console.log('Verifying Manus Lux gradient →', CANON_GRADIENT);
  try {
    const pw = spawn('pnpm', ['exec', 'playwright', 'test', 'tests/brand-lux.spec.ts'], { stdio: 'inherit' });
    pw.on('exit', code => process.exit(code));
  } catch {
    console.log('Fallback hue check starting...');
    // Fallback minimal check by starting dev server would be too heavy here; rely on Playwright spec.
    console.error('Playwright not found or tests failed to run.');
    process.exit(1);
  }
})();
