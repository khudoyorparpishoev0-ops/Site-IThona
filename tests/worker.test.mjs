/* ============================================================
   Unit-тесты Cloudflare Worker (worker/telegram-worker.js).
   Telegram API мокается — реальные заявки НЕ отправляются.
   Запуск: node --test tests/worker.test.mjs
   ============================================================ */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const worker = (await import('../worker/telegram-worker.js')).default;

const ENV = { BOT_TOKEN: 'TEST_TOKEN_NOT_REAL', CHAT_ID: '42' };
const ORIGIN = 'https://it-hona.tj';

// мок Telegram API
let tgCalls;
let tgResponse;
beforeEach(() => {
  tgCalls = [];
  tgResponse = { status: 200, body: { ok: true, result: { message_id: 1 } } };
  globalThis.fetch = async (url, init) => {
    tgCalls.push({ url: String(url), init });
    return new Response(JSON.stringify(tgResponse.body), {
      status: tgResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
});

const post = (body, headers = {}) =>
  worker.fetch(
    new Request('https://worker.test/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    ENV,
  );

test('OPTIONS: preflight отвечает CORS-заголовками без вызова Telegram', async () => {
  const res = await worker.fetch(new Request('https://worker.test/', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), ENV);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.match(res.headers.get('Access-Control-Allow-Methods'), /POST/);
  assert.equal(tgCalls.length, 0);
});

test('GET: метод отклоняется 405 и Telegram не вызывается', async () => {
  const res = await worker.fetch(new Request('https://worker.test/', { method: 'GET' }), ENV);
  assert.equal(res.status, 405);
  const j = await res.json();
  assert.equal(j.ok, false);
  assert.equal(tgCalls.length, 0);
});

test('POST {}: пустая заявка → 400, Telegram не вызывается', async () => {
  const res = await post({});
  assert.equal(res.status, 400);
  assert.equal((await res.json()).ok, false);
  assert.equal(tgCalls.length, 0);
});

test('POST invalid JSON → 400 bad_json', async () => {
  const res = await post('{not json');
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'bad_json');
  assert.equal(tgCalls.length, 0);
});

test('POST валидная заявка → 200 {ok:true}, сообщение уходит в нужный чат', async () => {
  const res = await post({ name: 'Худоёр', contact: '+992 88 929 5555', message: 'Нужна консультация' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(tgCalls.length, 1);
  assert.match(tgCalls[0].url, /api\.telegram\.org\/botTEST_TOKEN_NOT_REAL\/sendMessage/);
  const sent = JSON.parse(tgCalls[0].init.body);
  assert.equal(sent.chat_id, '42');
  assert.match(sent.text, /Худоёр/);
  assert.match(sent.text, /\+992 88 929 5555/);
  assert.match(sent.text, /Нужна консультация/);
});

test('Content-Type ответа — application/json', async () => {
  const res = await post({ name: 'A', contact: 'B' });
  assert.match(res.headers.get('Content-Type'), /application\/json/);
});

test('длинные значения обрезаются (сообщение ≤ 1500 символов)', async () => {
  const res = await post({ name: 'A'.repeat(5000), contact: 'B', message: 'X'.repeat(10000) });
  assert.equal(res.status, 200);
  const sent = JSON.parse(tgCalls[0].init.body);
  assert.ok(sent.text.length < 2500, `слишком длинное сообщение: ${sent.text.length}`);
});

test('пользователь не может подменить chat_id/token через поля заявки', async () => {
  await post({ name: 'A', contact: 'B', chat_id: '666', bot_token: 'HACK', destination: 'evil' });
  const sent = JSON.parse(tgCalls[0].init.body);
  assert.equal(sent.chat_id, '42');
  assert.ok(!tgCalls[0].url.includes('HACK'));
  assert.ok(!sent.text.includes('666'));
});

test('XSS/HTML в полях не ломает отправку (plain text, без parse_mode)', async () => {
  const res = await post({ name: '<script>alert(1)</script>', contact: '*_[`]<>' });
  assert.equal(res.status, 200);
  const sent = JSON.parse(tgCalls[0].init.body);
  assert.equal(sent.parse_mode, undefined); // plain text — инъекция разметки невозможна
});

test('Telegram ответил ошибкой → 502 {ok:false}, без утечки деталей', async () => {
  tgResponse = { status: 400, body: { ok: false, description: 'Bad Request: chat not found' } };
  const res = await post({ name: 'A', contact: 'B' });
  assert.equal(res.status, 502);
  const j = await res.json();
  assert.equal(j.ok, false);
  const raw = JSON.stringify(j);
  assert.ok(!raw.includes('chat not found'), 'детали Telegram утекли клиенту');
  assert.ok(!raw.includes(ENV.BOT_TOKEN), 'токен утёк клиенту');
});

test('сеть до Telegram упала → 502 {ok:false}', async () => {
  globalThis.fetch = async () => { throw new Error('network down'); };
  const res = await post({ name: 'A', contact: 'B' });
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'network');
});

test('CORS: чужой Origin не получает свой ACAO', async () => {
  const res = await post({ name: 'A', contact: 'B' }, { Origin: 'https://evil.example' });
  assert.notEqual(res.headers.get('Access-Control-Allow-Origin'), 'https://evil.example');
});

test('чужой браузерный Origin отклоняется до отправки в Telegram', async () => {
  const res = await post({ name: 'A', contact: 'B' }, { Origin: 'https://evil.example' });
  assert.equal(res.status, 403);
  assert.equal(tgCalls.length, 0, 'заявка с чужого сайта ушла в Telegram');
});

test('honeypot-поле website заполнено (бот) → «успех» без отправки в Telegram', async () => {
  const res = await post({ name: 'Bot', contact: 'spam', website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(tgCalls.length, 0, 'спам-заявка ушла в Telegram');
});

test('слишком большой payload отклоняется без парсинга', async () => {
  const big = JSON.stringify({ name: 'A', contact: 'B', message: 'X'.repeat(200_000) });
  const res = await post(big);
  assert.equal(res.status, 413);
  assert.equal(tgCalls.length, 0);
});
