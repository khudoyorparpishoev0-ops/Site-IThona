/* ============================================================
   IT-HONA — приём заявок с сайта и рассылка уведомлений.
   Разворачивается как Cloudflare Worker.

   Каналы доставки (каждый включается своими переменными окружения,
   задаются в настройках Worker как secrets, НЕ в коде):

   Telegram:
     BOT_TOKEN — токен бота от @BotFather
     CHAT_ID   — id чата или группы, куда слать заявки

   Email (ZeptoMail — транзакционная почта Zoho):
     ZEPTO_TOKEN — Send Mail Token из ZeptoMail (Mail Agent → Setup Info)
     MAIL_FROM   — отправитель с домена, верифицированного в ZeptoMail,
                   например noreply@ithona.tj
     MAIL_TO     — куда слать уведомления, например info@ithona.tj
     ZEPTO_URL   — (необязательно) API-хост; по умолчанию
                   https://api.zeptomail.com/v1.1/email
                   (для европейского ДЦ — https://api.zeptomail.eu/v1.1/email)

   Заявка считается доставленной ({ ok: true }), если её принял
   ХОТЯ БЫ ОДИН настроенный канал; { ok: false, error: … } — если все
   каналы не сработали (сайт покажет пользователю ошибку).
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

    // браузерный запрос с чужого сайта отклоняем до какой-либо обработки
    // (запросы без Origin — например, серверные проверки — пропускаем дальше)
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return reply({ ok: false, error: 'origin' }, 403, cors);
    }

    // разумный предел размера заявки — защита от гигантских payload
    const MAX_BODY = 64 * 1024;
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY) {
      return reply({ ok: false, error: 'too_large' }, 413, cors);
    }

    let data;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY) return reply({ ok: false, error: 'too_large' }, 413, cors);
      data = JSON.parse(raw);
    } catch { return reply({ ok: false, error: 'bad_json' }, 400, cors); }

    // honeypot: скрытое поле website заполняют только боты —
    // отвечаем «успехом», но ничего не отправляем
    if (data.website) return reply({ ok: true }, 200, cors);

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

    const text = lines.join('\n');
    const channels = [];
    if (env.BOT_TOKEN && env.CHAT_ID) channels.push(sendTelegram(env, text));
    if (env.ZEPTO_TOKEN && env.MAIL_FROM && env.MAIL_TO) channels.push(sendEmail(env, name, text));
    if (!channels.length) return reply({ ok: false, error: 'not_configured' }, 500, cors);

    // каналы шлём параллельно; доставлено = успех хотя бы одного
    const results = await Promise.allSettled(channels);
    const delivered = results.some((r) => r.status === 'fulfilled' && r.value === true);
    if (delivered) return reply({ ok: true }, 200, cors);
    return reply({ ok: false, error: 'delivery' }, 502, cors);
  },
};

// Telegram: успех только если API подтвердил доставку
async function sendTelegram(env, text) {
  const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  });
  const out = await tg.json().catch(() => ({}));
  return tg.ok && out.ok === true;
}

// Email через ZeptoMail (Zoho). Тело — plain text, как и в Telegram.
async function sendEmail(env, name, text) {
  const token = env.ZEPTO_TOKEN.startsWith('Zoho-enczapikey')
    ? env.ZEPTO_TOKEN
    : 'Zoho-enczapikey ' + env.ZEPTO_TOKEN;
  const res = await fetch(env.ZEPTO_URL || 'https://api.zeptomail.com/v1.1/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({
      from: { address: env.MAIL_FROM, name: 'Сайт IT-HONA' },
      to: [{ email_address: { address: env.MAIL_TO } }],
      subject: 'Новая заявка с сайта — ' + name,
      textbody: text,
    }),
  });
  return res.ok;
}

function reply(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
