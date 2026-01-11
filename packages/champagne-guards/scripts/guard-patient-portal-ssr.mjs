#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const port = process.env.PORTAL_SSR_PORT || 4110;

async function fetchPage(url, timeoutMs = 45000) {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const body = await response.text();
    return { response, body, elapsedMs: Date.now() - start };
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServer(url, totalTimeoutMs = 45000) {
  const start = Date.now();
  let lastError = null;

  while (Date.now() - start < totalTimeoutMs) {
    try {
      await fetchPage(url, 10000);
      return;
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

async function fetchWithRetry(url) {
  const attempts = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchPage(url);
    } catch (error) {
      lastError = error;
      const isAbort = error?.name === 'AbortError' || /aborted/i.test(error?.message || '');
      if (!isAbort || attempt === attempts) {
        throw error;
      }
      await delay(1000);
    }
  }

  throw lastError ?? new Error('Unable to render patient portal intent page before timeout.');
}

let lastTargetUrl = null;
let runStart = null;

async function run() {
  const command = ['--filter', 'web', 'dev', '--hostname', '127.0.0.1', '--port', String(port)];
  console.log(`Starting patient portal SSR probe server on port ${port}...`);
  const dev = spawn('pnpm', command, {
    cwd: repoRoot,
    stdio: ['ignore', 'ignore', 'inherit'],
    detached: true,
  });

  const targetUrl = `http://127.0.0.1:${port}/patient-portal?intent=login`;
  lastTargetUrl = targetUrl;
  runStart = Date.now();

  try {
    await waitForServer(targetUrl);
    const { response, body } = await fetchWithRetry(targetUrl);

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
  const elapsedMs = runStart ? Date.now() - runStart : 0;
  console.error('❌ Patient portal SSR smoke test failed:', error.message);
  if (lastTargetUrl) {
    console.error(`❌ URL: ${lastTargetUrl}`);
  }
  console.error(`❌ Elapsed: ${elapsedMs}ms`);
  process.exit(1);
});
