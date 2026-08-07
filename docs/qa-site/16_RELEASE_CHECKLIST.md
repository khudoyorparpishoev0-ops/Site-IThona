# Release-чек-лист

## Перед деплоем (код — готово)

- [x] Все 6 страниц открываются напрямую, H1 = 1, консоль чистая (e2e 86/86)
- [x] Все внутренние ссылки 200, ассеты существуют (двойная автопроверка)
- [x] Mobile 320–430px: без горизонтального скролла, контент не под шапкой
- [x] RU/TJ/EN: покрытие ключей 100%, сохранение выбора, fallback без undefined
- [x] Форма: валидация, loading, success, ошибка, double-submit=1 запрос, honeypot
- [x] Worker: 15/15 unit (Origin 403, лимит 64KB, honeypot, без утечки секретов)
- [x] Секретов в репозитории нет (автоскан в `npm run check`)
- [x] robots.txt, sitemap.xml, canonical, OG, favicon, 404.html
- [x] Версии кэша ассетов подняты (`?v=`)

## Деплой статического сайта

- [ ] Загрузить на хостинг: 6 HTML + 404.html + robots.txt + sitemap.xml + assets/ (Node runtime НЕ нужен; `about-company.jpg` можно исключить). Каталоги docs/, tests/, scripts/, worker/, node_modules/, package.json в деплой статики не включать.
- [ ] Настроить отдачу 404.html на несуществующие URL (Cloudflare Pages — автоматически; nginx: `error_page 404 /404.html;`).
- [ ] HTTPS активен, http→https редирект (Cloudflare делает сам).
- [ ] Проверить прямые URL: /, /about.html, /services.html, /solutions.html, /partners.html, /contacts.html → 200; /nope → 404; HEAD-запросы → 200.
- [ ] Security-заголовки из 09_SECURITY_AUDIT.md (Pages `_headers` / nginx).
- [ ] Cache-Control: HTML короткий (или no-cache), картинки длинный, CSS/JS длинный (версии `?v=` уже используются). После обновлений HTML — purge cache Cloudflare.

## Подключение Telegram Worker (снимает главный WARNING)

- [ ] `wrangler deploy` worker/telegram-worker.js
- [ ] Secrets: `BOT_TOKEN`, `CHAT_ID` (только в Cloudflare, не в git)
- [ ] `CONTACTS.formEndpoint = "https://<worker-url>"` в assets/i18n.js + поднять `i18n.js?v=6` в 6 HTML
- [ ] Cloudflare Rate Limiting rule на маршрут Worker (напр. 5 POST/мин/IP)
- [ ] Одна контрольная заявка с прод-сайта → сообщение пришло в чат → удалить тестовое
- [ ] Проверить preflight: OPTIONS с Origin https://it-hona.tj → 204/200 с CORS

## После деплоя

- [ ] Lighthouse (mobile+desktop) по всем 6 страницам — цель ≥90 по всем категориям; если ниже — см. резервы в 10_PERFORMANCE_AUDIT.md (WebP, self-host шрифтов)
- [ ] Google Search Console: подтвердить домен, отправить sitemap.xml
- [ ] Проверить соцпревью (og-image) в Telegram/WhatsApp share
- [ ] Прогнать смоук вручную в Safari (iPhone) и Firefox — в аудите NOT TESTED
- [ ] Мониторинг заявок первые дни (спам → включить Turnstile)

## Регресс перед любым следующим релизом

```
npm ci
npm run check        # статика: ссылки/меты/i18n/секреты
npm run test:worker  # 15 unit-тестов Worker
npm run test:e2e     # 86 e2e (Chromium)
```
(в окружении без установленных браузеров Playwright: `PW_CHROMIUM_PATH=<путь к chrome> npm run test:e2e`)
