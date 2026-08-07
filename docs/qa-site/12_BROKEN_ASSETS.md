# Аудит ассетов

## Результат: **битых/отсутствующих ассетов нет**

Все 12 логотипов брендов из требований существуют и загружаются (e2e: naturalWidth > 0):

| Бренд | Файл | Размеры | Формат | Вес |
|---|---|---|---|---|
| Cisco | cisco.png | 572×317 | PNG+alpha (прозрачный фон) | 15 KB |
| Hikvision | hikvision.png | 572×101 | PNG+alpha | 11 KB |
| MikroTik | mikrotik.png | 572×163 | PNG+alpha | 13 KB |
| Dahua | dahua.png | 572×193 | PNG+alpha | 22 KB |
| HP | hp.png | 572×572 | PNG+alpha | 22 KB |
| Dell | dell.png | 572×572 | PNG+alpha | 27 KB |
| Huawei | huawei.png | 571×572 | PNG+alpha | 58 KB |
| Ubiquiti | ubiquiti.png | 572×460 | PNG+alpha | 24 KB |
| Bosch | bosch.png | 572×152 | PNG+alpha | 20 KB |
| APC | apc.png | 572×175 | PNG+alpha | 11 KB |
| ZKTeco | zkteco.png | 572×157 | PNG+alpha | 12 KB |
| Legrand | legrand.png | 572×168 | PNG+alpha | 11 KB |

- Отображение: `object-fit:contain`, `max-height` — логотипы **не растягиваются**, пропорции сохраняются при любой ширине ячейки (проверено на 320–1920). После фикса `minmax(0,1fr)` ячейки корректно сжимаются на узких экранах.
- `alt` — имя бренда; `loading="lazy"` — есть на обеих страницах с логотипами. PASS.
- Missing assets: **нет** — фиктивные логотипы не создавались (не требовалось).

## Остальные изображения

| Файл | Использование | Статус |
|---|---|---|
| img/logo.svg (5 KB) | шапка всех страниц | OK |
| img/hero-desktop.jpg 957×1644 (165 KB) | hero index (desktop) | OK, fetchpriority=high |
| img/hero-mobile.jpg 1774×887 (183 KB) | hero index (≤1060px, `<picture>`) | OK |
| img/hero.jpg 1774×887 (263 KB) | hero about, partners | OK |
| img/company-home.jpg 1537×1023 (327 KB) | index, about, services, solutions | OK, lazy там, где ниже фолда |
| img/company-new.jpg 1536×1024 (235 KB) | index, services, contacts | **создан в аудите** из company-new.png (2 289 KB) — PNG удалён, ссылки обновлены |
| og-image.png 1200×630 (57 KB) | og:image | OK, не битый, подходит для соцпревью |
| favicon.svg | все страницы | OK, 404 нет |
| img/about-company.jpg 1536×1024 (330 KB) | **не используется ни одной страницей** | кандидат на удаление (оставлен, решение за владельцем) |

Файлов с проблемой регистра (Logo.svg vs logo.svg) нет — все пути в нижнем регистре и совпадают с файлами (Linux-хостинг безопасен).
