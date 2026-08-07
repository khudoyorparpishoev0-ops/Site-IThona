# Аудит страниц

Карта сайта (6 страниц + сервисная 404):

| Страница | Title | H1 | Canonical | Статус |
|---|---|---|---|---|
| index.html | IT-HONA — системный IT-интегратор полного цикла | «Надёжная инфраструктура.» | https://it-hona.tj/ | PASS |
| about.html | О компании — IT-HONA | «Инженерная надёжность для сложных объектов.» | …/about.html | PASS |
| services.html | Услуги — IT-HONA | «Полный цикл.» | …/services.html | PASS |
| solutions.html | Решения — IT-HONA | «Решения по отраслям.» | …/solutions.html | PASS |
| partners.html | Партнёры — IT-HONA | «Оборудование мировых производителей.» | …/partners.html | PASS |
| contacts.html | Контакты — IT-HONA | «Обсудим ваш проект?» | …/contacts.html | PASS |
| 404.html (создана) | Страница не найдена — IT-HONA | «Страница не найдена» | — (noindex) | PASS |

## Общие для всех страниц проверки (статический аудит + e2e)

- `<!DOCTYPE html>`, `html lang="ru"` (динамически меняется i18n на tg/en), `charset UTF-8`, viewport — PASS.
- Уникальные title и meta description, корректные canonical — PASS.
- OG-теги (type/site_name/title/description/url/image) + twitter:card — PASS; og-image существует (1200×630, 57KB) — PASS.
- Favicon (SVG) подключён и загружается — PASS.
- Ровно один H1; иерархия H1→H2 логична; `<header>/<nav>/<main>/<footer>` — PASS (`<main>` добавлен в рамках аудита).
- Дубликатов id нет; кнопок внутри ссылок нет; ссылок без href в контенте нет (переключатель языка `a[data-lang]` — сознательный паттерн, дооснащён `role="button"` + tabindex); у всех `<img>` есть alt; у iframe карт есть title — PASS.
- Незакрытых тегов не обнаружено (страницы парсятся браузером без ошибок восстановления, e2e-снапшоты структуры корректны).
- Header/footer идентичны на всех страницах (diff-проверка блоков), логотип ведёт на index.html, активный пункт меню соответствует странице — PASS (e2e).
- Console errors: 0 на каждой странице (desktop + mobile Chromium) — PASS.
- Изображения: `naturalWidth > 0` для всех (включая lazy) — PASS.
- Контент-аудит: lorem ipsum / TODO / FIXME / test / demo / placeholder / example.com / localhost — не найдено — PASS. Примечание: `cp.ph_email: "you@example.com"` в словарях i18n — это placeholder для поля email (нормальная практика), в HTML не используется.

## Постранично

### index.html
Hero (заголовок, лид, 2 CTA, статистика 32+/50/24-7), направления (8 ссылок → services/solutions), услуги (6), о компании, решения (3 карточки), партнёры (12 логотипов), контакты + форма + карта, footer. CTA `#contacts`, `#solutions` — якоря работают, заголовки не прячутся под header (добавлен scroll-padding). «Оставить заявку» — форма на этой же странице. PASS.

### about.html
Hero + фото, текстовый блок с преимуществами (3), полоса статистики (32+/5/50/24-7), отрасли (4), CTA → contacts.html. «5 лет работы» согласуется с «Est. 2021» (2026). PASS.

### services.html
6 услуг с чипами, фотополоса, «Как мы работаем» (4 этапа), CTA → contacts.html. Карточки без пустых/дублей. PASS.

### solutions.html
3 отраслевых решения с составом систем (банки, гостиницы, БЦ+госсектор), CTA → contacts.html. Проверен только фактический контент, новые услуги не добавлялись. PASS.

### partners.html
3 группы × 4 логотипа = 12 вендоров, все файлы существуют (см. 12_BROKEN_ASSETS.md). CTA → contacts.html. PASS.

### contacts.html
Телефон (tel:), email (mailto:), график, адрес, форма, карта (Яндекс, lazy, title), кнопки Google Maps / Яндекс / 2GIS / маршрут (все target=_blank c rel=noopener). PASS.
