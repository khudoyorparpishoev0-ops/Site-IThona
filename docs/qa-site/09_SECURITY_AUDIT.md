# Security-аудит

## P0: секреты — ЧИСТО

- Скан репозитория (HTML/JS/Worker/доки, включая паттерн Telegram-токена `\d{8,10}:[A-Za-z0-9_-]{35}`, api_key/secret/password): **токенов и секретов в коде нет**. Автопроверка закреплена в `scripts/check-site.mjs`.
- `BOT_TOKEN`/`CHAT_ID` — только `env.*` в Worker (Cloudflare Secrets). В git-истории секретов не обнаружено (`git log -p` grep по паттерну токена — пусто).
- Ошибки Worker не раскрывают токен/chat_id/детали Telegram клиенту (unit-тест).
- В комментариях HTML/JS паролей, internal IP, приватных заметок нет.

## Worker (детально — 04_TELEGRAM_WORKER_AUDIT.md)

Исправлено в аудите: 403 для чужих Origin (раньше CORS-заголовок ставился, но заявка обрабатывалась), серверный honeypot, лимит payload 64KB. Методы: только POST/OPTIONS (GET → 405). Пользователь не может подменить chat_id/токен/назначение (unit-тест). `_method`-override не поддерживается (нет такой логики — безопасно). Content-Type ответа — application/json.

Остаточный риск P2: нет серверного rate-limit для запросов без Origin → возможен спам в Telegram-чат при целенаправленной атаке. Рекомендация: Cloudflare Rate Limiting rule (5–10 POST/мин с IP) — настраивается в дашборде, кода не требует; Turnstile — только если спам появится реально.

## XSS

- Сайт не рендерит пользовательский ввод в DOM (значения полей уходят только в JSON-запрос; сообщение об успехе/ошибке — статические строки словаря) → отражённого/хранимого XSS нет.
- Telegram-сообщение — plain text без parse_mode → `<script>`, `*_[]` и т.п. не интерпретируются ни в Telegram, ни где-либо ещё (unit-тест).
- Виджет собирает HTML из строк **словаря** (доверенные), не из ввода пользователя. Значение select-опций — из словаря. Приемлемо.

## Внешние ссылки и окна

- Все `target="_blank"` имеют `rel="noopener"` (автопроверка). `window.open` в main.js/widget.js — добавлен параметр `'noopener'` (SITE-014).
- `javascript:`-ссылок нет; inline-обработчиков `onclick` в HTML нет (слушатели навешиваются из JS) — CSP-friendly, кроме одного inline `<script>` в конце страниц (переключение языка) и JSON-LD.

## HTTPS / mixed content

Все внешние ресурсы (fonts, карты) — HTTPS. Абсолютные http:// ссылок нет. PASS.

## Рекомендуемые security-заголовки (настройка хостинга, в код не вносились)

Для Cloudflare Pages — файл `_headers`, для nginx — add_header:

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: SAMEORIGIN   (или CSP frame-ancestors 'self')
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';        # inline-скрипт переключения языка + JSON-LD
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data:;
  frame-src https://yandex.ru;              # iframe карты
  connect-src 'self' https://<worker-url>;  # endpoint формы после подключения
  frame-ancestors 'self';
```

Telegram API из браузера не вызывается (только Worker → Telegram) — архитектура правильная, в connect-src Telegram не нужен.

## Приватность

- Тексты заявок (телефон/email) не логируются в console и не уходят в аналитику — PASS (аналитики на сайте нет).
- Debug `console.log` в production-коде отсутствуют (grep) — PASS.
- Cookie: сайт своих cookies не ставит (только localStorage: язык, cookie-согласие, rate-limit, флаг виджета). Iframe Яндекс.Карт может ставить сторонние cookies — отражено в cookie-аудите (13_BUGS_FOUND, R7): баннер честно информирует об использовании cookies; при желании строгого соответствия — грузить карту после клика (click-to-load), не внедрялось.
- Source maps не публикуются (их нет) — PASS.

## Прочее

- eval/new Function в клиентском коде нет (new Function используется только в **локальном** скрипте проверки `scripts/check-site.mjs`, в браузер не попадает).
- Git-история: чистая от секретов; удалённый company-new.png остаётся в истории (не секрет, просто вес).
