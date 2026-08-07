/* ============================================================
   Интеграционные тесты VPS-обработчика заявок (server/lead-server.mjs).
   ZeptoMail мокается локальным HTTP-сервером — письма не отправляются.
   Запуск: node --test tests/server.test.mjs
   ============================================================ */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createLeadServer } from '../server/lead-server.mjs';

let zeptoCalls = [];
let zeptoServer, leadServer, leadPort;

before(async () => {
  // мок ZeptoMail API
  zeptoServer = createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      zeptoCalls.push({
        auth: req.headers.authorization,
        body: JSON.parse(Buffer.concat(chunks).toString()),
      });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end('{}');
    });
  });
  await new Promise((r) => zeptoServer.listen(0, '127.0.0.1', r));
  const zeptoPort = zeptoServer.address().port;

  leadServer = createLeadServer({
    ZEPTO_TOKEN: 'TEST_KEY_NOT_REAL',
    MAIL_FROM: 'noreply@ithona.tj',
    MAIL_TO: 'info@ithona.tj',
    ZEPTO_URL: `http://127.0.0.1:${zeptoPort}/v1.1/email`,
  });
  await new Promise((r) => leadServer.listen(0, '127.0.0.1', r));
  leadPort = leadServer.address().port;
});

after(() => { leadServer?.close(); zeptoServer?.close(); });

const post = (body, headers = {}) =>
  fetch(`http://127.0.0.1:${leadPort}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://it-hona.tj', ...headers },
    body: JSON.stringify(body),
  });

test('заявка с сайта → письмо уходит на info@ithona.tj', async () => {
  zeptoCalls = [];
  const res = await post({ name: 'Худоёр', contact: '+992 88 929 5555', message: 'Нужен проект' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(zeptoCalls.length, 1);
  assert.match(zeptoCalls[0].auth, /^Zoho-enczapikey /);
  const mail = zeptoCalls[0].body;
  assert.equal(mail.to[0].email_address.address, 'info@ithona.tj');
  assert.match(mail.subject, /Худоёр/);
  assert.match(mail.textbody, /\+992 88 929 5555/);
  assert.match(mail.textbody, /Нужен проект/);
});

test('GET → 405, письмо не уходит', async () => {
  zeptoCalls = [];
  const res = await fetch(`http://127.0.0.1:${leadPort}/api/lead`);
  assert.equal(res.status, 405);
  assert.equal(zeptoCalls.length, 0);
});

test('OPTIONS preflight → CORS-заголовки', async () => {
  const res = await fetch(`http://127.0.0.1:${leadPort}/api/lead`, {
    method: 'OPTIONS',
    headers: { Origin: 'https://it-hona.tj' },
  });
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://it-hona.tj');
});

test('чужой Origin → 403, письмо не уходит', async () => {
  zeptoCalls = [];
  const res = await post({ name: 'A', contact: 'B' }, { Origin: 'https://evil.example' });
  assert.equal(res.status, 403);
  assert.equal(zeptoCalls.length, 0);
});

test('honeypot → мнимый успех, письмо не уходит', async () => {
  zeptoCalls = [];
  const res = await post({ name: 'Bot', contact: 'spam', website: 'http://spam' });
  assert.equal(res.status, 200);
  assert.equal(zeptoCalls.length, 0);
});

test('пустая заявка → 400', async () => {
  const res = await post({});
  assert.equal(res.status, 400);
});

test('гигантское тело → 413', async () => {
  const res = await post({ name: 'A', contact: 'B', message: 'X'.repeat(200_000) });
  assert.equal(res.status, 413);
});
