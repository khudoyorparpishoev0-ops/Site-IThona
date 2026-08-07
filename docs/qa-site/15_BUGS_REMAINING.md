# Оставшиеся дефекты и рекомендации

## Требует действия владельца (WARNING релиза)

### SITE-007 · P2 · Telegram Worker не подключён к фронтенду
`CONTACTS.formEndpoint` в `assets/i18n.js` пуст → заявки идут через WhatsApp-fallback (работает, но не Telegram). Что сделать:
1. `wrangler deploy` для `worker/telegram-worker.js`;
2. secrets `BOT_TOKEN`, `CHAT_ID` в настройках Worker (НЕ в коде);
3. вписать URL Worker в `formEndpoint`, поднять `i18n.js?v=6` в 6 HTML.
Dev/prod различие endpoint'а документировано здесь и в 04_TELEGRAM_WORKER_AUDIT.md.

### R1 · P2 (риск) · Нет серверного rate-limit у Worker
Origin-фильтр + honeypot + лимит 64KB отсекают массовый браузерный и наивный бот-спам, но прямой скриптовый POST не ограничен по частоте. Рекомендация: Cloudflare Rate Limiting rule на маршрут Worker (например 5 запросов/мин с IP). Хранить счётчики в глобальной переменной Worker нельзя (изоляты) — не реализовывалось намеренно.

## Рекомендации (код не менялся осознанно)

| ID | Приоритет | Описание |
|---|---|---|
| R2 | P2 (SEO) | Один HTML на 3 языка → поисковики индексируют RU-контент. Для полноценного SEO TJ/EN — отдельные URL (/tj/, /en/) с настоящими hreflang. Архитектурное решение владельца. |
| R3 | P3 (maintainability) | Header/footer скопированы в 6 HTML — правки нужно вносить 6 раз (в аудите все правки синхронизированы скриптом). Варианты: шаблонизатор на этапе сборки (Eleventy и т.п.) — сознательно НЕ внедрён (без фреймворк-переписывания). |
| R4 | P3 | Мёртвый код: `renderForm`/`renderCallback` + ключи opt_write/opt_callback в widget.js недостижимы из меню; футер-аккордеон в main.js рассчитан на старую разметку `.footer .f-col`; часть style.css (старый дизайн: .hero, .stats-panel, .project, .quick, .partners-grid, .footer и др.) не используется v2-страницами. Работе не мешает; чистить — с осторожностью. |
| R5 | P3 | `assets/img/about-company.jpg` (330 KB) не используется — удалить из деплоя. |
| R6 | P3 (i18n) | Чипы услуг (services), списки систем (solutions), aria-label «Меню» — статичные русские строки, не переводятся на TJ/EN. Нужны ~30 новых ключей в трёх словарях (контент должен дать владелец — не выдумывался). |
| R7 | P3 (privacy) | Яндекс.Карты iframe может ставить сторонние cookies. Баннер об этом честно предупреждает; для строгого privacy — click-to-load карты. Собственных tracking-cookies и аналитики у сайта нет. |
| R8 | P2→настройка хостинга | Security-заголовки (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors) — готовый список в 09_SECURITY_AUDIT.md; кэш-политика — в 10_PERFORMANCE_AUDIT.md; 404-роутинг — в 16_RELEASE_CHECKLIST.md. |
| R9 | P3 | Email-домен ithona.tj ≠ домен сайта it-hona.tj — убедиться, что оба принадлежат компании и почта работает (из песочницы NOT TESTED). |
| R10 | P3 (a11y) | Серый #8b938f для второстепенных подписей — контраст 2.9:1 (ниже AA); label форм связать for/id; полный прогон скринридером. |

## NOT TESTED (окружение аудита)

- Lighthouse (метрики производительности на реальной сети).
- Firefox, Safari/WebKit (доступен только Chromium).
- Реальные устройства iOS/Android.
- Production-домен: HTTPS-сертификат, реальные HTTP-заголовки, поведение hosting-404, HEAD-запросы, кэширование CDN.
- Реальная доставка заявки в Telegram (намеренно, без спама в рабочий чат; логика покрыта unit-тестами).
