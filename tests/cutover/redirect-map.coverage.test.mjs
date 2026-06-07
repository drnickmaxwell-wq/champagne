/**
 * Test coverage for redirect map validator.
 * Verifies fail-closed behaviour: the validator must reject missing, empty,
 * example-only, and structurally invalid data.
 *
 * Run with: node --test tests/cutover/redirect-map.coverage.test.mjs
 * Or via:   pnpm run cutover:test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const VALIDATOR = fileURLToPath(new URL('../../scripts/validate-redirect-map.mjs', import.meta.url));
const TMP_DIR = fileURLToPath(new URL('../../.tmp-cutover-test/', import.meta.url));

function setup() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });
}

function teardown(filePath) {
  try { unlinkSync(filePath); } catch { /* ignore */ }
}

function runValidator(filePath) {
  return spawnSync(process.execPath, [VALIDATOR, filePath], { encoding: 'utf8' });
}

function writeTmp(name, content) {
  const filePath = join(TMP_DIR, name);
  writeFileSync(filePath, content, 'utf8');
  return filePath;
}

const VALID_HEADER = 'wordpress_url,nextjs_route,redirect_type,redirect_status,human_approved,notes';
const VALID_ROW = 'https://www.smhdental.co.uk/old/,/new,301,APPROVED,true,test redirect';

setup();

describe('redirect-map validator — fail-closed behaviour', () => {
  it('fails when the file does not exist', () => {
    const result = runValidator('/nonexistent/path/redirect-map.csv');
    assert.notEqual(result.status, 0, 'Expected non-zero exit for missing file');
    assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
  });

  it('fails when the file is empty', () => {
    const filePath = writeTmp('empty.csv', '');
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for empty file');
      assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when the first line contains EXAMPLE_ONLY', () => {
    const filePath = writeTmp('example-only.csv', `EXAMPLE_ONLY — do not use\n${VALID_HEADER}\n${VALID_ROW}`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for EXAMPLE_ONLY marker');
      assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when the first line contains TEMPLATE_ONLY', () => {
    const filePath = writeTmp('template-only.csv', `TEMPLATE_ONLY — do not use\n${VALID_HEADER}\n${VALID_ROW}`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for TEMPLATE_ONLY marker');
      assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when a data row contains EXAMPLE_ONLY', () => {
    const filePath = writeTmp('row-example.csv', `${VALID_HEADER}\nEXAMPLE_ONLY,/new,301,PENDING,false,`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for EXAMPLE_ONLY in row');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when there is a header but no data rows', () => {
    const filePath = writeTmp('header-only.csv', VALID_HEADER);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for header-only CSV');
      assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when a required column is missing', () => {
    const filePath = writeTmp('missing-col.csv', `wordpress_url,nextjs_route,redirect_type\nhttps://example.com/old/,/new,301`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for missing required column');
      assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when wordpress_url is not https://', () => {
    const filePath = writeTmp('bad-url.csv', `${VALID_HEADER}\nhttp://not-secure.com/old/,/new,301,APPROVED,true,`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for non-https URL');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when nextjs_route does not start with /', () => {
    const filePath = writeTmp('bad-route.csv', `${VALID_HEADER}\nhttps://www.smhdental.co.uk/old/,no-leading-slash,301,APPROVED,true,`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for route without leading slash');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when redirect_type is not 301 or 302', () => {
    const filePath = writeTmp('bad-type.csv', `${VALID_HEADER}\nhttps://www.smhdental.co.uk/old/,/new,200,APPROVED,true,`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for invalid redirect_type');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when human_approved is false', () => {
    const filePath = writeTmp('not-approved.csv', `${VALID_HEADER}\nhttps://www.smhdental.co.uk/old/,/new,301,PENDING,false,`);
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit when human_approved is false');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when duplicate source URLs exist', () => {
    const filePath = writeTmp('duplicates.csv',
      `${VALID_HEADER}\n` +
      `https://www.smhdental.co.uk/old/,/new,301,APPROVED,true,\n` +
      `https://www.smhdental.co.uk/old/,/other,301,APPROVED,true,`
    );
    try {
      const result = runValidator(filePath);
      assert.notEqual(result.status, 0, 'Expected non-zero exit for duplicate source URLs');
    } finally {
      teardown(filePath);
    }
  });

  it('fails when no file argument is provided', () => {
    const result = spawnSync(process.execPath, [VALIDATOR], { encoding: 'utf8' });
    assert.notEqual(result.status, 0, 'Expected non-zero exit when no argument given');
    assert.ok(result.stderr.includes('FAIL'), 'Expected FAIL in stderr');
  });

  it('passes with a valid fully-approved redirect map', () => {
    const filePath = writeTmp('valid.csv', `${VALID_HEADER}\n${VALID_ROW}`);
    try {
      const result = runValidator(filePath);
      assert.equal(result.status, 0, `Expected zero exit for valid CSV. stderr: ${result.stderr}`);
      assert.ok(result.stdout.includes('PASS'), 'Expected PASS in stdout');
    } finally {
      teardown(filePath);
    }
  });
});
