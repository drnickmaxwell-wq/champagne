#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const port = process.env.PORTAL_SSR_PORT || 4110;

async function fetchPage(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const body = await response.text();
    return { response, body };
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForResponse(url, totalTimeoutMs = 45000) {
  const start = Date.now();
  let lastError = null;

  while (Date.now() - start < totalTimeoutMs) {
    try {
      return await fetchPage(url);
    } catch (error) {
      lastError = error;
      await delay(1000);
    }
  }

  throw new Error(
    lastError?.message
      ? `Unable to render patient portal intent page: ${lastError.message}`
      : 'Unable to render patient portal intent page before timeout.'
  );
}

async function run() {
  const command = ['--filter', 'web', 'dev', '--hostname', '127.0.0.1', '--port', String(port)];
  console.log(`Starting patient portal SSR probe server on port ${port}...`);
  const dev = spawn('pnpm', command, {
    cwd: repoRoot,
    stdio: ['ignore', 'ignore', 'inherit'],
    detached: true,
  });

  const targetUrl = `http://127.0.0.1:${port}/patient-portal?intent=login`;

  try {
    const { response, body } = await waitForResponse(targetUrl);

    if (!response.ok) {
      throw new Error(`Patient portal SSR probe returned ${response.status}`);
    }

    if (body.toLowerCase().includes('application error')) {
      throw new Error('Patient portal SSR probe returned an application error shell.');
    }

    console.log('✅ Patient portal SSR smoke test passed.');
  } finally {
    const processGroupId = dev.pid ? -dev.pid : null;

    if (processGroupId) {
      process.kill(processGroupId, 'SIGINT');
    } else {
      dev.kill('SIGINT');
    }

    const exited = await Promise.race([once(dev, 'exit').then(() => true), delay(5000).then(() => false)]);

    if (!exited) {
      if (processGroupId) {
        process.kill(processGroupId, 'SIGKILL');
      } else {
        dev.kill('SIGKILL');
      }
      await Promise.race([once(dev, 'exit'), delay(2000)]);
    }

    try {
      execSync(`pkill -f "--port ${port}"`, { stdio: 'ignore' });
    } catch {
      // ignore if no matching process is running
    }
  }
}

run().catch((error) => {
  console.error('❌ Patient portal SSR smoke test failed:', error.message);
  process.exit(1);
});
