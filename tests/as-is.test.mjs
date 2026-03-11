import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const TEST_PORT = 3123;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let devServer;

const waitForServerReady = async (timeoutMs = 60_000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(BASE_URL);

      if (response.ok) {
        return;
      }
    } catch {
      // server is not ready yet
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  throw new Error(`Timed out waiting for Next.js server at ${BASE_URL}`);
};

before(async () => {
  devServer = spawn(
    'npm',
    ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', String(TEST_PORT)],
    {
      detached: process.platform !== 'win32',
      env: {
        ...process.env,
        OPENAI_API_KEY: ''
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  devServer.stdout.on('data', () => {
    // keep process output stream drained to avoid blocking
  });

  devServer.stderr.on('data', () => {
    // keep process output stream drained to avoid blocking
  });

  await waitForServerReady();
});

after(async () => {
  if (!devServer || devServer.killed) {
    return;
  }

  const terminateServer = (signal) => {
    if (process.platform === 'win32' || !devServer.pid) {
      devServer.kill(signal);
      return;
    }

    process.kill(-devServer.pid, signal);
  };

  terminateServer('SIGTERM');

  await Promise.race([
    once(devServer, 'exit'),
    new Promise((resolve) => {
      setTimeout(() => {
        terminateServer('SIGKILL');
        resolve();
      }, 5_000);
    })
  ]);
});

test('トップ画面に主要UI要素が表示される', async () => {
  const response = await fetch(BASE_URL);
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /One Screen AI Tool/);
  assert.match(html, /Input text/);
  assert.match(html, /Processing mode/);
  assert.match(html, /summary/);
  assert.match(html, /bullets/);
  assert.match(html, /tasks/);
  assert.match(html, /Run/);
  assert.match(html, /Result/);
});

test('APIは不正なJSONに対して400を返す', async () => {
  const response = await fetch(`${BASE_URL}/api/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{'
  });

  assert.equal(response.status, 400);
  const data = await response.json();
  assert.deepEqual(data, { error: 'Invalid JSON body.' });
});

test('APIはtextが空の場合に400を返す', async () => {
  const response = await fetch(`${BASE_URL}/api/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: '   ',
      mode: 'summary'
    })
  });

  assert.equal(response.status, 400);
  const data = await response.json();
  assert.deepEqual(data, { error: 'text must be a non-empty string.' });
});

test('APIはmodeが不正な場合に400を返す', async () => {
  const response = await fetch(`${BASE_URL}/api/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: 'テスト',
      mode: 'invalid-mode'
    })
  });

  assert.equal(response.status, 400);
  const data = await response.json();
  assert.deepEqual(data, { error: 'mode must be one of: summary, bullets, tasks.' });
});

test('APIはOPENAI_API_KEY未設定時に500を返す', async () => {
  const response = await fetch(`${BASE_URL}/api/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: '議事録の要約をお願いします',
      mode: 'summary'
    })
  });

  assert.equal(response.status, 500);
  const data = await response.json();
  assert.deepEqual(data, { error: 'AI processing failed. Please try again later.' });
});
