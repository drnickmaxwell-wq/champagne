#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const { performCapture } = require('./capture-gradient.cjs');

const PREVIEW_HOST = process.env.HUE_LOCK_BASE_URL || 'http://localhost:3000';
const PREVIEW_PATHS = ['/preview/brand-lock', '/preview/brand-live'];
const TOKENS_PATH = path.join(process.cwd(), 'styles', 'tokens', 'smh-champagne-tokens.css');

function checkPreviewAvailable() {
  return new Promise((resolve, reject) => {
    let index = 0;
    const tryNext = () => {
      if (index >= PREVIEW_PATHS.length) {
        reject(new Error('Preview not available'));
        return;
      }
      const url = new URL(PREVIEW_PATHS[index], PREVIEW_HOST);
      index += 1;
      const req = http.request(url, { method: 'HEAD' }, (res) => {
        res.destroy();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          resolve(url.pathname);
        } else {
          tryNext();
        }
      });
      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH') {
          reject(error);
        } else {
          tryNext();
        }
      });
      req.setTimeout(3000, () => {
        req.destroy(new Error('Timeout'));
        tryNext();
      });
      req.end();
    };
    tryNext();
  });
}

function replaceToken(content, token, value) {
  const tokenPattern = new RegExp(`(${token}\\s*:\\s*)([^;]+);`);
  if (tokenPattern.test(content)) {
    return content.replace(tokenPattern, `$1${value};`);
  }
  const gradientMatch = content.match(/--smh-gradient:\s*[^;]+;/);
  if (gradientMatch) {
    return content.replace(gradientMatch[0], `${gradientMatch[0]}\n  ${token}: ${value};`);
  }
  return content.replace(/:root\s*\{/, `:root{\n  ${token}: ${value};`);
}

async function updateTokens(payload) {
  const gradientValue = payload.gradient;
  const sizeValue = payload.bgSize;
  const positionValue = payload.bgPosition;

  let content = fs.readFileSync(TOKENS_PATH, 'utf8');
  content = replaceToken(content, '--smh-gradient', gradientValue);
  content = replaceToken(content, '--smh-surface-bg-size', sizeValue);
  content = replaceToken(content, '--smh-surface-bg-position', positionValue);
  if (!content.endsWith('\n')) {
    content += '\n';
  }
  fs.writeFileSync(TOKENS_PATH, content, 'utf8');
}

async function main() {
  try {
    await checkPreviewAvailable();
  } catch (error) {
    console.error('[hue-lock] Preview server not reachable at http://localhost:3000');
    console.error('[hue-lock] Please run "pnpm dev" in another terminal before locking the gradient.');
    process.exit(1);
  }

  const payload = await performCapture();
  await updateTokens(payload);
  console.log(`[hue-lock] gradient=${payload.gradient}`);
  console.log(`[hue-lock] bgSize=${payload.bgSize}  bgPos=${payload.bgPosition}`);
}

main().catch((error) => {
  console.error(`[hue-lock] ${error.message}`);
  process.exit(1);
});
