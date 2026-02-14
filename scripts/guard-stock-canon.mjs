import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const canonDir = path.join(rootDir, 'docs', 'canon', 'stock');

const requiredFiles = [
  'STOCK_LEDGER_SPEC_V1.json',
  'RBAC_POLICY_MATRIX_V1.json',
  'TENANT_HEADER_AND_SIGNATURE_SPEC_V1.json',
  'PROJECTION_STRATEGY_V1.json',
  'STOCK_SERVICE_SCAFFOLD_PLAN_V1.json'
];

const failures = [];

const pass = (message) => console.log(`PASS: ${message}`);
const fail = (message) => {
  console.log(`FAIL: ${message}`);
  failures.push(message);
};

const loaded = new Map();

for (const fileName of requiredFiles) {
  const filePath = path.join(canonDir, fileName);
  try {
    const raw = readFileSync(filePath, 'utf8');
    pass(`Found required file ${fileName}`);
    try {
      const parsed = JSON.parse(raw);
      loaded.set(fileName, parsed);
      pass(`Parsed JSON ${fileName}`);
    } catch (error) {
      fail(`Invalid JSON in ${fileName}: ${error.message}`);
    }
  } catch (error) {
    fail(`Missing required file ${fileName}: ${error.message}`);
  }
}

const ledger = loaded.get('STOCK_LEDGER_SPEC_V1.json');
if (ledger) {
  if (ledger.document === 'STOCK_LEDGER_SPEC_V1') {
    pass('STOCK_LEDGER_SPEC_V1.document is correct');
  } else {
    fail(`STOCK_LEDGER_SPEC_V1.document must equal "STOCK_LEDGER_SPEC_V1"`);
  }

  if (Array.isArray(ledger.principles) && ledger.principles.includes('Event-first (append-only ledger)')) {
    pass('STOCK_LEDGER_SPEC_V1.principles includes Event-first (append-only ledger)');
  } else {
    fail('STOCK_LEDGER_SPEC_V1.principles must include "Event-first (append-only ledger)"');
  }

  if (
    Array.isArray(ledger.phiBoundary?.denyFieldNames) &&
    ledger.phiBoundary.denyFieldNames.includes('patientId')
  ) {
    pass('STOCK_LEDGER_SPEC_V1.phiBoundary.denyFieldNames includes patientId');
  } else {
    fail('STOCK_LEDGER_SPEC_V1.phiBoundary.denyFieldNames must include "patientId"');
  }

  const requiredIdentifiers = ['tenantId', 'userId', 'locationId', 'itemId', 'supplierId', 'orderId', 'eventId'];
  const identifiers = ledger.identifiers && typeof ledger.identifiers === 'object' ? ledger.identifiers : null;
  for (const identifier of requiredIdentifiers) {
    if (identifiers && Object.prototype.hasOwnProperty.call(identifiers, identifier)) {
      pass(`STOCK_LEDGER_SPEC_V1.identifiers includes ${identifier}`);
    } else {
      fail(`STOCK_LEDGER_SPEC_V1.identifiers missing ${identifier}`);
    }
  }
}

const tenantHeader = loaded.get('TENANT_HEADER_AND_SIGNATURE_SPEC_V1.json');
if (tenantHeader) {
  const headers = tenantHeader.requiredHeadersAllRequests;
  if (headers && Object.prototype.hasOwnProperty.call(headers, 'x-tenant-id')) {
    pass('TENANT_HEADER_AND_SIGNATURE_SPEC_V1.requiredHeadersAllRequests includes x-tenant-id');
  } else {
    fail('TENANT_HEADER_AND_SIGNATURE_SPEC_V1.requiredHeadersAllRequests missing x-tenant-id');
  }

  if (headers && Object.prototype.hasOwnProperty.call(headers, 'x-request-id')) {
    pass('TENANT_HEADER_AND_SIGNATURE_SPEC_V1.requiredHeadersAllRequests includes x-request-id');
  } else {
    fail('TENANT_HEADER_AND_SIGNATURE_SPEC_V1.requiredHeadersAllRequests missing x-request-id');
  }
}

if (failures.length > 0) {
  console.log(`\nFAIL: guard-stock-canon failed with ${failures.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('\nPASS: guard-stock-canon checks passed.');
}
