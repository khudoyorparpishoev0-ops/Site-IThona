# IT-HONA — Итоговый QA-отчёт

Дата аудита: 2026-08-07 · Аудитор: автоматизированный QA-прогон (статический аудит + unit-тесты Worker + Playwright e2e) с ручной верификацией по скриншотам.

## Вердикт

## ✅ SITE RELEASE READY WITH WARNINGS

Сайт готов к публикации. Все найденные P1-дефекты исправлены и покрыты регрессионными тестами. Предупреждения (не блокируют релиз, но требуют действий владельца):

1. **Telegram Worker не подключён к фронтенду** — `CONTACTS.formEndpoint` в `assets/i18n.js` пуст, заявки сейчас уходят через WhatsApp-fallback (работает). Чтобы заявки шли в Telegram: задеплоить `worker/telegram-worker.js` в Cloudflare, задать secrets `BOT_TOKEN`/`CHAT_ID` и вписать URL Worker в `formEndpoint`. См. `04_TELEGRAM_WORKER_AUDIT.md`.
2. **Серверный rate-limit отсутствует** — Worker защищён Origin-проверкой, honeypot и лимитом payload, но прямые запросы (curl) не ограничены по частоте. Рекомендация: Cloudflare Rate Limiting rule (см. `09_SECURITY_AUDIT.md`).
3. **SEO для TJ/EN ограничено архитектурой** — языки переключаются JS-ом на одном URL; поисковики индексируют преимущественно русскую версию. Для полноценной индексации TJ/EN нужны отдельные URL (`/tj/`, `/en/`) — рекомендация, не внедрялась (см. `07_SEO_AUDIT.md`).

## Цифры

| Метрика | Значение |
|---|---|
| Страниц проверено | 6 (+ созданная 404.html) |
| Внутренних ссылок проверено | 170 href (все 200 OK, e2e + статический аудит) |
| Изображений проверено | 40 `<img>` в HTML + 19 файлов в assets (битых нет) |
| Языков проверено | RU / TJ / EN (покрытие ключей 100%, тесты переключения и сохранения) |
| Автотестов | 15 unit (Worker) + 86 e2e (Chromium desktop+mobile) + статический аудит — все зелёные |
| P0 найдено | 0 |
| P1 найдено | 4 → **исправлено 4** |
| P2 найдено | 9 → **исправлено 8**, осталось 1 (подключение Worker — нужен URL деплоя) |
| P3 найдено | 7 → **исправлено 7** |
| Рекомендаций (без изменения кода) | 8 (см. 15_BUGS_REMAINING.md) |

## Статусы по областям

| Область | Статус |
|---|---|
| Mobile (320–430px) | **PASS** — после фиксов SITE-001…003, 016: нет горизонтального скролла на 9 ширинах × 6 страниц × 3 языков |
| Форма заявки | **PASS** — валидация, loading, success, ошибка сети, double-submit, honeypot (e2e с mock-endpoint) |
| Telegram Worker | **PASS (unit, 15/15)** / WARNING — не подключён к фронтенду (endpoint пуст) |
| I18N RU/TJ/EN | **PASS** — 100% покрытие ключей, сохранение языка, fallback без «undefined» |
| SEO | **PASS с рекомендациями** — уникальные title/description/canonical/OG, sitemap, robots, JSON-LD; ложные hreflang удалены |
| Accessibility | **PASS (базовый уровень)** — клавиатура, Escape, focus, aria-expanded, alt, labels-связки см. отчёт |
| Performance | **IMPROVED / Lighthouse NOT TESTED** — картинка −2 МБ, дубль шрифтов убран, lazy; Lighthouse недоступен в окружении |
| Security | **PASS** — секретов в репозитории нет; Worker усилен (Origin 403, honeypot, лимит 64KB); заголовки — рекомендации |
| Браузеры | Chromium (desktop+mobile emulation) **PASS**; Firefox / WebKit (Safari) — **NOT TESTED** (бинарники недоступны в окружении) |
| Console errors | **PASS** — 0 ошибок на всех 6 страницах (внешние ресурсы недоступны только в тестовой песочнице) |

## Что изменено

Полный список: `14_BUGS_FIXED.md`. Кратко:
- Мобильная вёрстка: контент больше не прячется под фиксированный header; H1 не обрезается на 320–430px; сетки логотипов сжимаются корректно.
- Worker: отклонение чужих Origin (403), серверный honeypot, лимит payload 64KB — с тестами.
- Производительность: `company-new.png` 2.29MB → JPEG 235KB; удалён дублирующий `@import` шрифта; lazy + width/height для изображений ниже первого экрана.
- Доступность: язык переключается с клавиатуры; Escape закрывает мобильное меню; scroll-lock; `aria-expanded`; `scroll-padding-top`; prefers-reduced-motion.
- SEO: удалены ложные hreflang (все указывали на один URL); JSON-LD ProfessionalService на главной; создана 404.html.
- `window.open` с `noopener`.

## Автоматические проверки (добавлены в репозиторий)

```
npm run check        # статический аудит: ссылки, ассеты, meta, i18n-ключи, sitemap, секреты
npm run test:worker  # 15 unit-тестов Worker (Telegram мокается — реальные заявки не шлются)
npm run test:e2e     # 86 Playwright-тестов, Chromium desktop + mobile
npm test             # всё вместе
```

## Ограничения аудита (честно)

- **Lighthouse не запускался** (нет в окружении) — оценка производительности дана по составу страницы, см. `10_PERFORMANCE_AUDIT.md`. NOT TESTED.
- **Firefox/Safari не проверялись** (в окружении только Chromium). NOT TESTED.
- **Production-домен it-hona.tj не проверялся по сети** (окружение без доступа к внешнему интернету): HTTPS, реальные заголовки хостинга, кэширование, поведение деплоя — NOT TESTED, чек-лист в `16_RELEASE_CHECKLIST.md`.
- Реальная отправка в Telegram не выполнялась намеренно (защита от спама в рабочий чат) — логика Worker проверена unit-тестами с мок-API.
