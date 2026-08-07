# Аудит навигации

## Внутренние ссылки

- Собрано и проверено **170 href** по всем 6 страницам.
- Автопроверка 1: `scripts/check-site.mjs` — каждый внутренний href/src/srcset существует на диске. PASS.
- Автопроверка 2: e2e «все внутренние ссылки со всех страниц отвечают 200» — каждый уникальный внутренний href запрошен по HTTP. PASS, 404 нет.
- Переходы по всем пунктам меню в обе стороны (index ↔ about/services/solutions/partners/contacts) — e2e PASS.
- Логотип с каждой страницы ведёт на index.html — e2e PASS.
- Футерная навигация: Компания (about/partners/contacts), Услуги (4 ссылки → services.html), Контакты (tel:/mailto:) — все валидны. PASS.
- Якоря главной: `#contacts`, `#solutions` — секции существуют; после фикса `scroll-padding-top: 96px` заголовок секции не перекрывается фиксированным header. PASS.
- Пустых `href="#"` нет. `javascript:` нет. Breadcrumbs на сайте отсутствуют (не требуются для 6 страниц).

## Внешние ссылки

| Ссылка | Где | rel | Статус |
|---|---|---|---|
| Google Maps (поиск адреса) | index, contacts | `noopener` | PASS (формат URL корректен; доступность внешнего сервиса из песочницы NOT TESTED) |
| Яндекс.Карты ×2 (поиск, маршрут) | index, contacts | `noopener` | PASS (то же) |
| 2GIS | index, contacts | `noopener` | PASS (то же) |
| Яндекс map-widget (iframe) | index, contacts | loading=lazy, title | PASS |
| fonts.googleapis.com / gstatic | все | preconnect | PASS (HTTPS) |
| wa.me / t.me (из JS) | main.js, widget.js | `window.open(...,'noopener')` — добавлен | PASS |

Все внешние ресурсы — HTTPS, mixed content нет.

## Мобильное меню (e2e, 375×812; вручную по скриншотам 320/360/375/390/430)

- Открытие бургером → панель-drawer справа, затемнение — PASS.
- Клик по пункту → переход и закрытие меню, overlay не остаётся — PASS.
- Повторное открытие — PASS.
- Тап по затемнению закрывает — PASS.
- **Escape закрывает меню** — добавлено в рамках аудита (не работало), фокус возвращается на бургер — PASS.
- **Scroll-lock** под открытым меню — добавлен (`html.menu-open{overflow:hidden}`) — PASS.
- **aria-expanded** на бургере — добавлен — PASS.
- Меню не уходит за экран (width `min(320px,85vw)`), прокручивается при малой высоте — PASS.
