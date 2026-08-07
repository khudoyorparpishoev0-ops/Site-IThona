# Исправленные дефекты

Итог: **19 из 20** зарегистрированных дефектов исправлено (SITE-007 требует URL задеплоенного Worker — действие владельца).

| ID | Sev | Фикс | Файлы | Регрессионный тест | Результат |
|---|---|---|---|---|---|
| SITE-001 | P1 | `minmax(0,1fr)` сетки логотипов, `min-width:0` детям гридов, мобильный clamp H1, overflow-wrap | editorial.css | e2e responsive (9 ширин × 6 стр × 3 языка) | PASS |
| SITE-002 | P1 | clamp H1 index, gap `.ed-dir` на ≤680 | editorial.css | e2e responsive | PASS |
| SITE-003 | P1 | mobile padding-top 92px у hero/page-hero | editorial.css | e2e «контент не прячется под header» | PASS |
| SITE-004 | P1 | Origin вне белого списка → 403 до обработки | telegram-worker.js | unit ×2 (403 + Telegram не вызван) | PASS |
| SITE-005 | P2 | лимит тела 64KB (Content-Length + фактическая длина) → 413 | telegram-worker.js | unit «слишком большой payload» | PASS |
| SITE-006 | P2 | серверный honeypot: `website` заполнен → мнимый успех без отправки | telegram-worker.js | unit «honeypot» | PASS |
| SITE-008 | P2 | PNG 2 289 KB → JPEG 235 KB (q82 progressive), ссылки обновлены (index/services/contacts), PNG удалён | img/company-new.jpg, 3 HTML | e2e «изображения загружаются» | PASS |
| SITE-009 | P2 | удалён дублирующий `@import` шрифта | style.css | статический аудит + e2e консоль | PASS |
| SITE-010 | P2 | role="button", tabindex=0, Enter/Space для `[data-lang]` | i18n.js | e2e «переключатель доступен с клавиатуры» | PASS |
| SITE-011 | P2 | Escape + возврат фокуса, scroll-lock (`html.menu-open`), aria-expanded | main.js, style.css | e2e «мобильное меню …Escape» | PASS |
| SITE-012 | P2 | удалены ложные hreflang со всех страниц и из sitemap | 6 HTML, sitemap.xml | статический аудит (canonical/sitemap-сверка) | PASS |
| SITE-013 | P2 | `scroll-padding-top:96px` | style.css | ручная проверка якорей #contacts/#solutions | PASS |
| SITE-014 | P3 | `'noopener'` во всех window.open | main.js, widget.js | код-ревью + grep | PASS |
| SITE-015 | P3 | loading="lazy" decoding="async" + width/height ниже фолда; hero — width/height + fetchpriority=high | 4 HTML | e2e images + responsive | PASS |
| SITE-016 | P3 | word-joiner `&#8288;` между последним словом H1 и точкой | 6 HTML | скриншоты 320/375 | PASS |
| SITE-017 | P3 | создана 404.html (бренд, noindex, ссылка на главную) | 404.html | e2e «несуществующая страница отдаёт 404» + статический аудит | PASS |
| SITE-018 | P3 | JSON-LD ProfessionalService (только реальные данные) на главной | index.html | валидность JSON проверена | PASS |
| SITE-019 | P3 | @media prefers-reduced-motion: отключены fadeUp и smooth-scroll | editorial.css | код-ревью | PASS |
| SITE-020 | P3 | padding бургера 6→10px (тач-цель ~44px) | style.css | скриншот/размеры | PASS |

Сопутствующее: подняты версии кэша всех изменённых ассетов (`style.css?v=6`, `editorial.css?v=8`, `main.js?v=5`, `i18n.js?v=5`, `widget.js?v=3`); добавлен `<main>` на все страницы.

Финальный регресс после всех фиксов: статический аудит — 0 ошибок; Worker unit — 15/15; e2e — 86 passed / 0 failed (Chromium desktop + mobile).
