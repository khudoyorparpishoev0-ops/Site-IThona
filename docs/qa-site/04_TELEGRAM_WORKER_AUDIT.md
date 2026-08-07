# Аудит Telegram Worker (worker/telegram-worker.js)

## Архитектура

Cloudflare Worker принимает `POST JSON` с сайта и рассылает уведомления по настроенным каналам:
- **Telegram** (`BOT_TOKEN`, `CHAT_ID`) — api.telegram.org/sendMessage;
- **Email** (`ZEPTO_TOKEN`, `MAIL_FROM`, `MAIL_TO`, опц. `ZEPTO_URL`) — ZeptoMail (транзакционная почта Zoho), добавлен по запросу владельца 2026-08.

Каналы независимы и шлются параллельно; `{ok:true}` — если доставил хотя бы один; ни один не настроен — 500 `not_configured`. Секреты — только в переменных окружения Worker, в коде/репозитории их **нет** (проверено сканом — см. 09_SECURITY_AUDIT.md).

## Проверки (20 unit-тестов, внешние API мокаются)

| Проверка | Результат |
|---|---|
| OPTIONS preflight → CORS-заголовки, Telegram не вызывается | PASS |
| GET → 405 `{ok:false,error:"method"}` | PASS |
| POST `{}` → 400 `empty`, Telegram не вызывается | PASS |
| Невалидный JSON → 400 `bad_json` | PASS |
| Валидная заявка → 200 `{ok:true}`, сообщение в нужный chat_id, текст содержит поля | PASS |
| `Content-Type: application/json` в ответах | PASS |
| Обрезка длинных значений (name 100, message 1500) | PASS |
| Подмена `chat_id`/`bot_token`/`destination` в payload игнорируется | PASS |
| XSS/markdown-символы в полях: `parse_mode` не используется (plain text) → инъекция разметки невозможна, Telegram не отклонит сообщение | PASS |
| Telegram ответил ошибкой → 502 `{ok:false}`, **детали Telegram и токен не утекают клиенту** | PASS |
| Сбой сети до Telegram → 502 `network` | PASS |
| Чужой Origin не получает свой ACAO | PASS |
| **Чужой браузерный Origin → 403 до обработки** (добавлено в аудите) | PASS |
| **Honeypot `website` на сервере → «успех» без отправки** (добавлено) | PASS |
| **Payload > 64KB → 413** (добавлено) | PASS |
| Email-канал: письмо на MAIL_TO через ZeptoMail (Authorization, from/to, subject с именем) | PASS |
| Оба канала настроены → уходит и в Telegram, и на почту | PASS |
| Telegram упал, письмо дошло → `{ok:true}` (частичная деградация) | PASS |
| Все каналы упали → 502 без утечки деталей | PASS |
| Ни один канал не настроен → 500 `not_configured` | PASS |

Успех определяется по `tg.ok && out.ok` (не только по факту fetch) — корректно. `disable_web_page_preview: true` — ссылки пользователя не разворачиваются в превью. Таймаут: Cloudflare сам ограничивает время выполнения Worker; бесконечного зависания нет (fetch → catch → 502).

## Внесённые улучшения

1. **Origin-контроль**: браузерный POST с Origin вне списка `ithona.tj / www.ithona.tj / it-hona.tj / www.it-hona.tj` → 403 без обработки (раньше заявка обрабатывалась, CORS-заголовок не защищает сервер).
2. **Серверный honeypot**: поле `website` (боты заполняют) → мнимый успех, в Telegram ничего не уходит.
3. **Лимит тела запроса 64KB** → 413 (раньше парсился payload любого размера).

## Оставшиеся риски (не блокируют релиз)

- **Rate-limit**: запросы без Origin (curl/скрипты) не ограничены по частоте. Глобальная переменная в Worker — не защита (изоляты). Рекомендация: **Cloudflare Rate Limiting rule** на маршрут Worker (например, 5 POST/мин с IP) и/или Turnstile при появлении реального спама. Зафиксировано, Captcha без необходимости не добавлялась.
- 20 быстрых POST локально (unit-цикл) обрабатываются без 429 — подтверждает отсутствие лимита. Production-стресс не проводился (запрещено спамить прод).

## Подключение к сайту (то, что осталось сделать владельцу)

1. `wrangler deploy` из каталога `worker/` (или через дашборд Cloudflare).
2. В настройках Worker: Variables → Secrets: `BOT_TOKEN`, `CHAT_ID`.
3. В `assets/i18n.js` → `CONTACTS.formEndpoint: "https://<имя-worker>.<аккаунт>.workers.dev"` (или свой роут).
4. Поднять версию `i18n.js?v=…` в 6 HTML-файлах (кэш).
Пока это не сделано, форма работает через WhatsApp-fallback — заявки не теряются.

## Реальная интеграция

Реальный вызов задеплоенного Worker и доставка в Telegram из этого окружения — **NOT TESTED** (нет доступа к продакшену и намеренно без спама в рабочий чат). Вся логика покрыта unit-тестами с мок-API.
