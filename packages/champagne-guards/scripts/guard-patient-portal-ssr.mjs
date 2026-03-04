#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const port = process.env.PORTAL_SSR_PORT || 4110;
const SERVER_READY_TIMEOUT_MS = 90000;
const REQUEST_TIMEOUT_MS = 30000;
const RETRY_DELAY_MS = 1000;
const WARMUP_TIMEOUT_MS = 90000;

async function fetchPage(url, timeoutMs = REQUEST_TIMEOUT_MS) {
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

async function waitForServer(url, totalTimeoutMs = SERVER_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastError = null;

  while (Date.now() - start < totalTimeoutMs) {
    try {
      const { response } = await fetchPage(url, 10000);
      if (response.ok || response.status < 500) {
        return;
      }
      lastError = new Error(`Probe readiness returned status ${response.status}`);
    } catch (error) {
      lastError = error;
      await delay(1000);
    }
  }

  throw new Error(
    lastError?.message
      ? `Readiness timed out: ${lastError.message}`
      : 'Readiness timed out before probe server became available.'
  );
}

async function waitForReadiness(baseUrl) {
  let readinessStep = 'health';

  try {
    await waitForServer(`${baseUrl}/api/health`);
    return { bootDetected: true, readinessStep };
  } catch (healthError) {
    readinessStep = 'patient-portal';
    try {
      await waitForServer(`${baseUrl}/patient-portal?intent=login`);
      return { bootDetected: true, readinessStep };
    } catch (error) {
      throw new Error(
        `Readiness timed out at step "${readinessStep}" (health error: ${healthError.message}; route error: ${error.message})`
      );
    }
  }
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
      await delay(RETRY_DELAY_MS);
    }
  }

  throw lastError ?? new Error('Unable to render patient portal intent page before timeout.');
}

let lastTargetUrl = null;
let runStart = null;
let currentStep = 'init';
let bootDetected = false;
let invokedCommand = '';

async function run() {
  const command = ['--filter', 'web', 'dev', '--hostname', '127.0.0.1', '--port', String(port)];
  invokedCommand = `pnpm ${command.join(' ')}`;
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
    currentStep = 'readiness';
    const readiness = await waitForReadiness(`http://127.0.0.1:${port}`);
    bootDetected = readiness.bootDetected;

    currentStep = 'patient-portal-warmup';
    const warmup = await fetchPage(targetUrl, WARMUP_TIMEOUT_MS);
    if (!warmup.response.ok) {
      throw new Error(`Patient portal warmup returned ${warmup.response.status}`);
    }

    currentStep = 'patient-portal-probe';
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
  console.error(`❌ Command: ${invokedCommand || 'unknown'}`);
  if (lastTargetUrl) {
    console.error(`❌ URL: ${lastTargetUrl}`);
  }
  console.error(`❌ Step: ${currentStep}`);
  console.error(`❌ Timeout(request/readiness/warmup): ${REQUEST_TIMEOUT_MS}ms/${SERVER_READY_TIMEOUT_MS}ms/${WARMUP_TIMEOUT_MS}ms`);
  console.error(`❌ Server boot detected: ${bootDetected ? 'yes' : 'no'}`);
  console.error(`❌ Last error: ${error.message}`);
  console.error(`❌ Elapsed: ${elapsedMs}ms`);
  process.exit(1);
});
