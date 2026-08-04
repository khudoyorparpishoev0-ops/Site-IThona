/* ============================================================
   IT-HONA — приём заявок с сайта и отправка их в Telegram.
   Разворачивается как Cloudflare Worker.

   Переменные окружения (задаются в настройках Worker, не в коде):
     BOT_TOKEN — токен бота от @BotFather
     CHAT_ID   — id чата или группы, куда слать заявки

   Ответ соответствует контракту, который ждёт assets/main.js:
     { ok: true }             — заявка доставлена
     { ok: false, error: … }  — не доставлена, сайт покажет ошибку
   ============================================================ */

const ALLOWED_ORIGINS = [
  'https://ithona.tj',
  'https://www.ithona.tj',
  'https://it-hona.tj',
  'https://www.it-hona.tj',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // предварительный запрос браузера перед POST
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return reply({ ok: false, error: 'method' }, 405, cors);

    let data;
    try { data = await request.json(); }
    catch { return reply({ ok: false, error: 'bad_json' }, 400, cors); }

    const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
    const name    = cut(data.name, 100);
    const contact = cut(data.contact || data.phone, 100);
    if (!name || !contact) return reply({ ok: false, error: 'empty' }, 400, cors);

    const lines = ['🔔 Новая заявка с сайта', '', 'Имя: ' + name, 'Контакт: ' + contact];
    if (data.kind)    lines.push('Тип: '       + cut(data.kind, 60));
    if (data.company) lines.push('Компания: '  + cut(data.company, 100));
    if (data.service) lines.push('Услуга: '    + cut(data.service, 100));
    if (data.topic)   lines.push('Тема: '      + cut(data.topic, 100));
    if (data.time)    lines.push('Время: '     + cut(data.time, 60));
    if (data.email)   lines.push('Email: '     + cut(data.email, 100));
    if (data.method)  lines.push('Связь: '     + cut(data.method, 60));
    if (data.message) lines.push('', 'Сообщение:', cut(data.message, 1500));
    if (data.page)    lines.push('', 'Страница: ' + cut(data.page, 120));

    try {
      const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text: lines.join('\n'),
          disable_web_page_preview: true,
        }),
      });
      const out = await tg.json().catch(() => ({}));
      // успех только если Telegram подтвердил доставку
      if (!tg.ok || !out.ok) return reply({ ok: false, error: 'telegram' }, 502, cors);
      return reply({ ok: true }, 200, cors);
    } catch {
      return reply({ ok: false, error: 'network' }, 502, cors);
    }
  },
};

function reply(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
