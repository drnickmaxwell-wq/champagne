/**
 * Validates a WordPress URL inventory CSV for cutover readiness.
 * Fails closed: exits non-zero on any missing, empty, or invalid data.
 *
 * Usage: node scripts/validate-cutover-inventory.mjs <path-to-csv>
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REQUIRED_COLUMNS = [
  'url',
  'page_type',
  'title',
  'http_status',
  'has_canonical',
  'meta_description_present',
];

const VALID_PAGE_TYPES = ['home', 'hub', 'standard', 'legacy', '404', 'redirect'];
const VALID_HTTP_STATUSES = ['200', '301', '302', '404', '410'];

function fail(message) {
  console.error(`[CUTOVER-INVENTORY-VALIDATOR] FAIL: ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`[CUTOVER-INVENTORY-VALIDATOR] WARN: ${message}`);
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

function validateInventory(csvPath) {
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

  for (const { lineNumber, data } of rows) {
    // url must be present and start with https://
    if (!data.url) {
      errors.push(`Row ${lineNumber}: "url" is empty.`);
    } else if (!data.url.startsWith('https://')) {
      errors.push(`Row ${lineNumber}: "url" must start with https://, got: ${data.url}`);
    }

    // page_type must be a known value
    if (!data.page_type) {
      errors.push(`Row ${lineNumber}: "page_type" is empty.`);
    } else if (!VALID_PAGE_TYPES.includes(data.page_type.toLowerCase())) {
      warn(`Row ${lineNumber}: "page_type" "${data.page_type}" is not in the standard set: ${VALID_PAGE_TYPES.join(', ')}`);
    }

    // title must be present
    if (!data.title) {
      errors.push(`Row ${lineNumber}: "title" is empty.`);
    }

    // http_status must be a known value
    if (!data.http_status) {
      errors.push(`Row ${lineNumber}: "http_status" is empty.`);
    } else if (!VALID_HTTP_STATUSES.includes(data.http_status)) {
      errors.push(`Row ${lineNumber}: "http_status" "${data.http_status}" is not valid. Expected one of: ${VALID_HTTP_STATUSES.join(', ')}`);
    }

    // has_canonical must be true or false
    if (!data.has_canonical) {
      errors.push(`Row ${lineNumber}: "has_canonical" is empty.`);
    } else if (!['true', 'false'].includes(data.has_canonical.toLowerCase())) {
      errors.push(`Row ${lineNumber}: "has_canonical" must be "true" or "false", got: ${data.has_canonical}`);
    }

    // meta_description_present must be true or false
    if (!data.meta_description_present) {
      errors.push(`Row ${lineNumber}: "meta_description_present" is empty.`);
    } else if (!['true', 'false'].includes(data.meta_description_present.toLowerCase())) {
      errors.push(`Row ${lineNumber}: "meta_description_present" must be "true" or "false", got: ${data.meta_description_present}`);
    }
  }

  if (errors.length > 0) {
    console.error('[CUTOVER-INVENTORY-VALIDATOR] Validation errors:');
    errors.forEach((e) => console.error(`  - ${e}`));
    fail(`${errors.length} validation error(s) found. Fix all errors before proceeding.`);
  }

  console.log(`[CUTOVER-INVENTORY-VALIDATOR] PASS: ${rows.length} rows validated with no errors.`);
}

// Entry point
const args = process.argv.slice(2);
if (args.length === 0) {
  fail('Usage: node scripts/validate-cutover-inventory.mjs <path-to-csv>');
}

validateInventory(args[0]);
