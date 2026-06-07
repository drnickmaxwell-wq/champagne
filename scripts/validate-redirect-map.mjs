/**
 * Validates a WordPress-to-Next.js redirect map CSV for cutover readiness.
 * Fails closed: exits non-zero on any missing, empty, loop, or invalid data.
 *
 * Usage: node scripts/validate-redirect-map.mjs <path-to-csv>
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REQUIRED_COLUMNS = [
  'wordpress_url',
  'nextjs_route',
  'redirect_type',
  'redirect_status',
  'human_approved',
];

const VALID_REDIRECT_TYPES = ['301', '302'];

function fail(message) {
  console.error(`[REDIRECT-MAP-VALIDATOR] FAIL: ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`[REDIRECT-MAP-VALIDATOR] WARN: ${message}`);
}

function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) fail('CSV file is empty.');

  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('example_only') || firstLine.includes('template_only')) {
    fail(
      'CSV contains EXAMPLE_ONLY or TEMPLATE_ONLY marker on first line. ' +
        'Replace with real data before running the validator.'
    );
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes('example_only') || line.toLowerCase().includes('template_only')) {
      fail(`Row ${i + 1} contains EXAMPLE_ONLY or TEMPLATE_ONLY marker. Remove example rows.`);
    }
    const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? '';
    });
    rows.push({ lineNumber: i + 1, data: row });
  }

  return { headers, rows };
}

function detectLoops(rows) {
  // Build a map of wordpress_url -> nextjs_route (treating nextjs_route as a path)
  // A loop exists if any nextjs_route resolves to a wordpress_url in the same map.
  const sourcePaths = new Set(
    rows.map(({ data }) => {
      try {
        return new URL(data.wordpress_url).pathname;
      } catch {
        return data.wordpress_url;
      }
    })
  );

  const loops = [];
  for (const { lineNumber, data } of rows) {
    if (sourcePaths.has(data.nextjs_route)) {
      loops.push(
        `Row ${lineNumber}: redirect target "${data.nextjs_route}" is also a source URL — this creates a loop.`
      );
    }
  }
  return loops;
}

function validateRedirectMap(csvPath) {
  const absPath = resolve(csvPath);

  if (!existsSync(absPath)) {
    fail(`File not found: ${absPath}`);
  }

  const raw = readFileSync(absPath, 'utf8').trim();
  if (raw.length === 0) fail(`File is empty: ${absPath}`);

  const { headers, rows } = parseCSV(raw);

  if (rows.length === 0) fail('CSV has a header row but no data rows.');

  // Check required columns exist
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      fail(`Missing required column: "${col}". Headers found: ${headers.join(', ')}`);
    }
  }

  const errors = [];

  // Check for duplicate source URLs
  const seenSources = new Map();
  for (const { lineNumber, data } of rows) {
    if (data.wordpress_url) {
      if (seenSources.has(data.wordpress_url)) {
        errors.push(
          `Row ${lineNumber}: duplicate wordpress_url "${data.wordpress_url}" ` +
            `(first seen at row ${seenSources.get(data.wordpress_url)}).`
        );
      } else {
        seenSources.set(data.wordpress_url, lineNumber);
      }
    }
  }

  for (const { lineNumber, data } of rows) {
    // wordpress_url must be present and absolute
    if (!data.wordpress_url) {
      errors.push(`Row ${lineNumber}: "wordpress_url" is empty.`);
    } else if (!data.wordpress_url.startsWith('https://')) {
      errors.push(`Row ${lineNumber}: "wordpress_url" must start with https://, got: ${data.wordpress_url}`);
    }

    // nextjs_route must be present and start with /
    if (!data.nextjs_route) {
      errors.push(`Row ${lineNumber}: "nextjs_route" is empty.`);
    } else if (!data.nextjs_route.startsWith('/')) {
      errors.push(`Row ${lineNumber}: "nextjs_route" must start with /, got: ${data.nextjs_route}`);
    }

    // redirect_type must be 301 or 302
    if (!data.redirect_type) {
      errors.push(`Row ${lineNumber}: "redirect_type" is empty.`);
    } else if (!VALID_REDIRECT_TYPES.includes(data.redirect_type)) {
      errors.push(`Row ${lineNumber}: "redirect_type" must be 301 or 302, got: ${data.redirect_type}`);
    } else if (data.redirect_type === '302') {
      warn(`Row ${lineNumber}: redirect_type is 302 (temporary). Ensure this is intentional and documented.`);
    }

    // redirect_status must not be empty
    if (!data.redirect_status) {
      errors.push(`Row ${lineNumber}: "redirect_status" is empty.`);
    }

    // human_approved must be true or false
    if (!data.human_approved) {
      errors.push(`Row ${lineNumber}: "human_approved" is empty.`);
    } else if (!['true', 'false'].includes(data.human_approved.toLowerCase())) {
      errors.push(`Row ${lineNumber}: "human_approved" must be "true" or "false", got: ${data.human_approved}`);
    } else if (data.human_approved.toLowerCase() === 'false') {
      errors.push(`Row ${lineNumber}: "human_approved" is false — all redirects must be approved before deployment.`);
    }
  }

  // Loop detection
  const loops = detectLoops(rows);
  errors.push(...loops);

  if (errors.length > 0) {
    console.error('[REDIRECT-MAP-VALIDATOR] Validation errors:');
    errors.forEach((e) => console.error(`  - ${e}`));
    fail(`${errors.length} validation error(s) found. Fix all errors before proceeding.`);
  }

  console.log(`[REDIRECT-MAP-VALIDATOR] PASS: ${rows.length} redirects validated with no errors.`);
}

// Entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  fail('Usage: node scripts/validate-redirect-map.mjs <path-to-csv>');
}

validateRedirectMap(args[0]);
