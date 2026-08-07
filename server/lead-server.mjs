/* ============================================================
   IT-HONA — приём заявок с сайта на собственном VPS.

   Использует ту же проверенную логику, что и Cloudflare Worker
   (worker/telegram-worker.js): валидация, honeypot, лимиты,
   Origin-контроль и отправка уведомлений (email через ZeptoMail
   и/или Telegram — что настроено переменными окружения).

   Запуск:  node server/lead-server.mjs
   Слушает: 127.0.0.1:8787 (наружу отдаётся через nginx — см. README.md)

   Переменные окружения (см. server/README.md):
     MAIL_TO, MAIL_FROM, ZEPTO_TOKEN [, ZEPTO_URL]  — почта
     BOT_TOKEN, CHAT_ID                              — Telegram (необязательно)
     PORT                                            — порт (по умолчанию 8787)
   ============================================================ */
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import worker from '../worker/telegram-worker.js';

const MAX_BODY = 70 * 1024;

export function createLeadServer(env = process.env) {
  return createServer(async (req, res) => {
    try {
      // читаем тело с жёстким лимитом
      const chunks = [];
      let size = 0;
      for await (const c of req) {
        size += c.length;
        if (size > MAX_BODY) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'too_large' }));
          req.destroy();
          return;
        }
        chunks.push(c);
      }
      const body = Buffer.concat(chunks);

      // переводим Node-запрос в Fetch-Request и отдаём той же логике, что у Worker
      const request = new Request(`http://localhost${req.url}`, {
        method: req.method,
        headers: Object.fromEntries(
          Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v]),
        ),
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
      });
      const response = await worker.fetch(request, env);

      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'internal' }));
    }
  });
}

// прямой запуск: node server/lead-server.mjs
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 8787);
  createLeadServer().listen(port, '127.0.0.1', () => {
    console.log(`ithona lead-server: http://127.0.0.1:${port}`);
  });
}
