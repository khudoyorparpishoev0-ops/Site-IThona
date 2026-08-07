# Реестр найденных дефектов

P0 — не найдено. Формат сокращён для читаемости; для P1 приведён полный разбор.

---

## SITE-001

**Название:** Горизонтальный скролл и обрезка H1 на partners.html в мобильной версии
**Severity:** P1 · **Page:** partners.html (аналогичный механизм — все страницы с `.ed-page-hero--split`)
**Steps:** 1. Открыть partners.html при ширине 320–430px. 2. Посмотреть на H1 и подвал первого экрана. 3. Попробовать горизонтальный скролл.
**Expected:** Текст полностью виден, горизонтального скролла нет.
**Actual:** Страница шире вьюпорта на 38–40px, «производителей» обрезано, ячейки логотипов вылезают за экран.
**Root cause:** (а) grid-колонки `1fr` не сжимаются уже min-content: длинное слово H1 (font-size clamp min 42px) и intrinsic-ширина PNG-логотипов распирают колонку; (б) нет `min-width:0` у детей грида.
**Files:** assets/editorial.css
**Fix:** `min-width:0` детям hero-гридов; `minmax(0,1fr)` для сеток логотипов; мобильный clamp H1 `clamp(28px,9.2vw,42px)`; `overflow-wrap:break-word`.
**Regression test:** e2e `responsive` — 9 ширин × 6 страниц × RU/TJ/EN, скролл ≤ 0. **Result: PASS**

## SITE-002

**Название:** H1 «инфраструктура.» и лид обрезаются справа на index.html (mobile)
**Severity:** P1 · **Page:** index.html
**Steps:** 1. Открыть index.html при 320–430px. 2. Посмотреть на hero.
**Expected:** Заголовок и текст полностью видны.
**Actual:** Левая колонка hero 388px при вьюпорте 375px; `overflow:hidden` секции маскирует скролл, текст обрезан (видно на скриншоте).
**Root cause:** тот же min-content + крупный clamp (11vw/40px min); большой gap ряда «Направления» добавлял 3px на 320px.
**Files:** assets/editorial.css
**Fix:** clamp H1 `clamp(28px,9.2vw,56px)`; `min-width:0`; gap/padding `.ed-dir` на ≤680px.
**Regression test:** тот же responsive-тест. **Result: PASS**

## SITE-003

**Название:** Первая строка контента прячется под фиксированным header (mobile, все страницы)
**Severity:** P1 · **Page:** все 6
**Steps:** 1. Открыть любую страницу при ≤680px. 2. Посмотреть на верх страницы без прокрутки.
**Expected:** Eyebrow/заголовок начинаются ниже шапки.
**Actual:** Header фиксированный высотой 74px, а mobile padding-top секций 40–48px → первая строка частично закрыта шапкой (видно на скриншотах).
**Root cause:** контент течёт от y=0 под fixed-header; мобильные отступы меньше высоты шапки.
**Files:** assets/editorial.css
**Fix:** mobile padding-top 92px для `.ed-hero` и `.ed-page-hero`.
**Regression test:** e2e «контент не прячется под фиксированным header (mobile)» — сравнение boundingBox. **Result: PASS**

## SITE-004

**Название:** Worker отправляет в Telegram заявки с любого сайта (CORS не защищает обработку)
**Severity:** P1 (security/spam) · **Component:** worker/telegram-worker.js
**Steps:** 1. POST с `Origin: https://evil.example` на Worker. 2. Смотреть ответ и вызовы Telegram.
**Expected:** Запрос с чужого браузерного Origin отклоняется без обработки.
**Actual:** ACAO-заголовок ставился «чужим», но заявка всё равно уходила в Telegram (CORS ограничивает только чтение ответа браузером, не серверную обработку).
**Root cause:** проверка Origin использовалась только для выбора CORS-заголовка.
**Fix:** Origin присутствует и не в белом списке → 403 до какой-либо обработки.
**Regression test:** unit «чужой браузерный Origin отклоняется до отправки в Telegram». **Result: PASS**

---

## P2

| ID | Дефект | Компонент |
|---|---|---|
| SITE-005 | Нет лимита размера payload в Worker (парсился JSON любого размера) | worker |
| SITE-006 | Honeypot проверялся только на клиенте — прямой POST ботов уходил в Telegram | worker |
| SITE-007 | `CONTACTS.formEndpoint` пуст — Worker написан, но не подключён; заявки идут через WhatsApp-fallback | i18n.js / деплой |
| SITE-008 | company-new.png 2 289 KB — hero-изображение services/contacts (LCP) | assets/img |
| SITE-009 | Inter грузится дважды (`<link>` + `@import` в style.css) | style.css |
| SITE-010 | Переключатель языка недоступен с клавиатуры (`<a>` без href) | все страницы / i18n.js |
| SITE-011 | Мобильное меню: нет Escape, нет scroll-lock, нет aria-expanded | main.js |
| SITE-012 | Ложные hreflang: ru/tg/en/x-default указывают на один URL (страницы + sitemap) | HTML, sitemap.xml |
| SITE-013 | Якорные переходы прячут заголовок секции под фиксированный header | style.css |

## P3

| ID | Дефект |
|---|---|
| SITE-014 | `window.open(...,'_blank')` без noopener в main.js/widget.js |
| SITE-015 | Нет lazy/width/height у изображений ниже первого экрана (CLS/лишняя загрузка) |
| SITE-016 | Зелёная точка-акцент H1 переносится на отдельную строку (mobile) |
| SITE-017 | Нет 404-страницы |
| SITE-018 | Нет structured data (schema.org) |
| SITE-019 | fadeUp-анимации hero не уважают prefers-reduced-motion |
| SITE-020 | Тач-цель бургера ~36px (< 44px) |

Замечания без изменения кода (R1–R10) — в 15_BUGS_REMAINING.md.
