/* ============================================================
   IT-HONA — e2e-тесты (Playwright).
   Запуск: npx playwright test
   Заявки НЕ отправляются: endpoint формы мокается через route().
   ============================================================ */
import { test, expect } from '@playwright/test';

const PAGES = ['index.html', 'about.html', 'services.html', 'solutions.html', 'partners.html', 'contacts.html'];
const MOCK_ENDPOINT = 'https://worker.mock/submit';
const LOCAL = 'http://127.0.0.1';

// тестовое окружение без интернета: внешние ресурсы (шрифты, карты) блокируем,
// чтобы load-событие не ждало таймаутов сети; на прод-поведение не влияет
test.beforeEach(async ({ page }) => {
  await page.route('**/*', (r) => {
    const u = r.request().url();
    if (u.startsWith(LOCAL) || u.startsWith(MOCK_ENDPOINT)) return r.continue();
    return r.abort();
  });
});

// собираем ошибки консоли и сети на каждой странице
async function openClean(page, path) {
  const errors = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const loc = (m.location() && m.location().url) || '';
    if (loc && !loc.startsWith(LOCAL)) return; // заблокированный внешний ресурс — не ошибка сайта
    errors.push(`console: ${m.text()} [${loc}]`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    if (r.url().startsWith(LOCAL)) errors.push(`requestfailed: ${r.url()}`);
  });
  page.on('response', (r) => {
    if (r.url().startsWith(LOCAL) && r.status() >= 400) errors.push(`${r.status()}: ${r.url()}`);
  });
  await page.goto('/' + path);
  return errors;
}

// включает отправку формы через мок-endpoint вместо WhatsApp-fallback
async function useMockEndpoint(page) {
  await page.evaluate((ep) => { window.CONTACTS.formEndpoint = ep; }, MOCK_ENDPOINT);
}

test.describe('страницы', () => {
  for (const p of PAGES) {
    test(`${p}: открывается, 1×H1, чистая консоль, header/footer/лого`, async ({ page }) => {
      const errors = await openClean(page, p);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('header.header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('.logo-brand')).toHaveAttribute('href', 'index.html');
      // активный пункт меню соответствует странице
      await expect(page.locator('nav.nav a.active')).toHaveAttribute('href', p);
      expect(errors).toEqual([]);
    });

    test(`${p}: все изображения загружаются (naturalWidth > 0)`, async ({ page }) => {
      await page.goto('/' + p);
      // форсируем загрузку lazy-изображений и ждём завершения
      const broken = await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
        await Promise.all(
          [...document.images]
            .filter((i) => !i.complete)
            .map((i) => new Promise((res) => { i.onload = i.onerror = res; setTimeout(res, 5000); })),
        );
        return [...document.images]
          .filter((i) => i.src.startsWith(location.origin))
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.getAttribute('src'));
      });
      expect(broken).toEqual([]);
    });

    test(`${p}: нет горизонтального скролла`, async ({ page }) => {
      await page.goto('/' + p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('несуществующая страница отдаёт 404', async ({ page }) => {
    const res = await page.goto('/no-such-page.html');
    expect(res.status()).toBe(404);
  });
});

test.describe('responsive', () => {
  for (const w of [320, 360, 375, 390, 430, 768, 1024, 1366, 1920]) {
    test(`нет горизонтального скролла на ${w}px (все страницы)`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'ширины задаются вручную');
      await page.setViewportSize({ width: w, height: 900 });
      for (const p of PAGES) {
        await page.goto('/' + p);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${p} @ ${w}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test('контент не прячется под фиксированным header (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const p of PAGES) {
      await page.goto('/' + p);
      const headerBottom = await page.evaluate(() => document.querySelector('.header').getBoundingClientRect().bottom);
      const firstText = await page.evaluate(() => {
        const el = document.querySelector('main .ed-eyebrow, main h1');
        return el ? el.getBoundingClientRect().top : 9999;
      });
      expect(firstText, `${p}: первый текст под header`).toBeGreaterThanOrEqual(headerBottom);
    }
  });
});

test.describe('навигация', () => {
  test('все внутренние ссылки со всех страниц отвечают 200', async ({ page, request }) => {
    const seen = new Set();
    for (const p of PAGES) {
      await page.goto('/' + p);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map((a) => a.getAttribute('href'))
          .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h)),
      );
      for (const h of hrefs) seen.add(h.split('#')[0]);
    }
    for (const h of seen) {
      const res = await request.get('/' + h);
      expect(res.status(), `битая ссылка: ${h}`).toBe(200);
    }
  });

  test('переход по всем пунктам меню (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'меню в бургере — отдельный тест');
    await page.goto('/index.html');
    for (const p of PAGES.slice(1)) {
      await page.locator(`nav.nav a[href="${p}"]`).click();
      await expect(page).toHaveURL(new RegExp(p.replace('.', '\\.')));
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});

test.describe('мобильное меню', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('открыть → пункт → переход; повторное открытие; Escape', async ({ page }) => {
    await page.goto('/index.html');
    const burger = page.locator('.burger');
    const nav = page.locator('nav.nav');
    await expect(burger).toBeVisible();
    await expect(nav).not.toBeVisible();

    await burger.click();
    await expect(nav).toBeVisible();
    await page.locator('nav.nav a[href="contacts.html"]').click();
    await expect(page).toHaveURL(/contacts\.html/);
    await expect(page.locator('nav.nav')).not.toBeVisible(); // меню закрылось

    // повторное открытие и закрытие по Escape
    await page.locator('.burger').click();
    await expect(page.locator('nav.nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('nav.nav')).not.toBeVisible();
  });

  test('тап по затемнению закрывает меню', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.burger').click();
    await expect(page.locator('nav.nav')).toBeVisible();
    await page.mouse.click(30, 400); // область вне панели меню
    await expect(page.locator('nav.nav')).not.toBeVisible();
  });
});

test.describe('i18n', () => {
  test('RU → TJ → EN: тексты меняются, язык сохраняется между страницами и после reload', async ({ page, isMobile }) => {
    test.skip(isMobile, 'переключатель в бургере, логика та же');
    await page.goto('/index.html');
    await expect(page.locator('nav.nav a[href="index.html"]')).toHaveText('Главная');

    await page.locator('.lang a[data-lang="tj"]').click();
    await expect(page.locator('nav.nav a[href="index.html"]')).toHaveText('Асосӣ');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tg');

    // переход — язык сохраняется
    await page.locator('nav.nav a[href="services.html"]').click();
    await expect(page.locator('h1')).toContainText('Давраи пурра');

    // reload — язык сохраняется
    await page.reload();
    await expect(page.locator('h1')).toContainText('Давраи пурра');

    await page.locator('.lang a[data-lang="en"]').click();
    await expect(page.locator('h1')).toContainText('Full cycle');

    // нет "undefined"/"[object Object]" после переключений
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/undefined|\[object Object\]|null/);
  });

  test('таджикские символы отображаются без «�»', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.setItem('ithona_lang', 'tj'));
    await page.reload();
    const body = await page.locator('body').innerText();
    expect(body).toContain('Ҳалҳо');
    expect(body).not.toContain('�');
  });

  test('переключатель языка доступен с клавиатуры', async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.goto('/index.html');
    await page.locator('.lang a[data-lang="en"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('форма заявки', () => {
  test('пустая форма не отправляется (валидация)', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    let requests = 0;
    await page.route(MOCK_ENDPOINT, (r) => { requests++; r.fulfill({ json: { ok: true } }); });
    await page.locator('form.appeal button[type="submit"]').click();
    await page.waitForTimeout(300);
    expect(requests).toBe(0);
    await expect(page.locator('.form-done')).not.toBeVisible();
  });

  test('успешная отправка: loading → панель успеха → «отправить ещё одну»', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    await page.route(MOCK_ENDPOINT, async (r) => {
      await new Promise((res) => setTimeout(res, 250));
      r.fulfill({ json: { ok: true } });
    });
    await page.fill('form.appeal input[name="name"]', 'Худоёр');
    await page.fill('form.appeal input[name="contact"]', '+992 88 929 5555');
    await page.fill('form.appeal textarea[name="message"]', 'Тестовая заявка (e2e)');
    await page.locator('form.appeal button[type="submit"]').click();
    // состояние загрузки
    await expect(page.locator('form.appeal button[type="submit"]')).toBeDisabled();
    // успех
    await expect(page.locator('.form-done')).toBeVisible();
    await expect(page.locator('form.appeal')).not.toBeVisible();
    // вернуть форму
    await page.locator('.form-again').click();
    await expect(page.locator('form.appeal')).toBeVisible();
    // форма очищена
    await expect(page.locator('form.appeal input[name="name"]')).toHaveValue('');
  });

  test('двойной клик по «Отправить» — только один запрос', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    let requests = 0;
    await page.route(MOCK_ENDPOINT, async (r) => {
      requests++;
      await new Promise((res) => setTimeout(res, 400));
      r.fulfill({ json: { ok: true } });
    });
    await page.fill('form.appeal input[name="name"]', 'A');
    await page.fill('form.appeal input[name="contact"]', 'B');
    const btn = page.locator('form.appeal button[type="submit"]');
    for (let i = 0; i < 5; i++) await btn.click({ force: true }).catch(() => {});
    await expect(page.locator('.form-done')).toBeVisible();
    expect(requests).toBe(1);
  });

  test('ошибка сервера: понятное сообщение, без Failed to fetch', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    await page.route(MOCK_ENDPOINT, (r) => r.fulfill({ status: 502, json: { ok: false, error: 'telegram' } }));
    await page.fill('form.appeal input[name="name"]', 'A');
    await page.fill('form.appeal input[name="contact"]', 'B');
    await page.locator('form.appeal button[type="submit"]').click();
    const err = page.locator('.form-err');
    await expect(err).toBeVisible();
    await expect(err).toContainText('Не удалось отправить заявку');
    await expect(err).not.toContainText(/fetch|500|502/i);
    await expect(page.locator('.form-done')).not.toBeVisible();
    // форма осталась заполненной — можно повторить
    await expect(page.locator('form.appeal input[name="name"]')).toHaveValue('A');
  });

  test('сеть недоступна: понятное сообщение об ошибке', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    await page.route(MOCK_ENDPOINT, (r) => r.abort('failed'));
    await page.fill('form.appeal input[name="name"]', 'A');
    await page.fill('form.appeal input[name="contact"]', 'B');
    await page.locator('form.appeal button[type="submit"]').click();
    await expect(page.locator('.form-err')).toBeVisible();
  });

  test('honeypot: заполненное поле website блокирует отправку', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    let requests = 0;
    await page.route(MOCK_ENDPOINT, (r) => { requests++; r.fulfill({ json: { ok: true } }); });
    await page.fill('form.appeal input[name="name"]', 'Bot');
    await page.fill('form.appeal input[name="contact"]', 'spam');
    await page.evaluate(() => { document.querySelector('form.appeal input[name="website"]').value = 'http://spam'; });
    await page.locator('form.appeal button[type="submit"]').click();
    await page.waitForTimeout(300);
    expect(requests).toBe(0);
  });

  test('имена: кириллица, латиница, пробел, дефис, апостроф — принимаются', async ({ page }) => {
    await page.goto('/contacts.html');
    await useMockEndpoint(page);
    const sent = [];
    await page.route(MOCK_ENDPOINT, (r) => { sent.push(r.request().postDataJSON()); r.fulfill({ json: { ok: true } }); });
    for (const name of ['Худоёр', "O'Connor-Smith", 'Anna Maria']) {
      await page.fill('form.appeal input[name="name"]', name);
      await page.fill('form.appeal input[name="contact"]', '+992900000000');
      await page.evaluate(() => localStorage.removeItem('ith_last_send')); // сброс клиентского rate-limit
      await page.locator('form.appeal button[type="submit"]').click();
      await expect(page.locator('.form-done')).toBeVisible();
      await page.locator('.form-again').click();
    }
    expect(sent.map((s) => s.name)).toEqual(['Худоёр', "O'Connor-Smith", 'Anna Maria']);
  });
});

test.describe('cookie banner', () => {
  test('первый визит → показан; принять → скрыт; после reload не появляется', async ({ page }) => {
    await page.goto('/index.html');
    const banner = page.locator('.cookie');
    await expect(banner).toBeVisible({ timeout: 5000 });
    await page.locator('.cookie-ok').click();
    await expect(banner).toBeHidden();
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(page.locator('.cookie')).toHaveCount(0);
  });
});

test.describe('виджет связи', () => {
  test('открытие/закрытие, Escape, фокус возвращается', async ({ page }) => {
    await page.goto('/index.html');
    const fab = page.locator('.ith-fab');
    await expect(fab).toBeVisible();
    await fab.click();
    await expect(page.locator('.ith-panel')).toBeVisible();
    await expect(fab).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.ith-opt')).toHaveCount(3);
    await page.keyboard.press('Escape');
    await expect(page.locator('.ith-panel')).toBeHidden();
    await expect(fab).toHaveAttribute('aria-expanded', 'false');
  });

  test('поломка widget.js не роняет сайт (независимость модулей)', async ({ page }) => {
    await page.route('**/assets/widget.js*', (r) => r.fulfill({ status: 404, body: '' }));
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/index.html');
    await expect(page.locator('h1')).toBeVisible();
    // навигация работает (на мобильном — через бургер)
    const burger = page.locator('.burger');
    if (await burger.isVisible()) await burger.click();
    await page.locator('nav.nav a[href="about.html"]').first().click();
    await expect(page).toHaveURL(/about\.html/);
  });
});

test.describe('без JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('контент читается без JS', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('h1')).toBeVisible();
    const text = await page.locator('body').innerText();
    expect(text).toContain('инфраструктура');
    expect(text).toContain('+992 88 929 5555');
  });
});

test.describe('доступность (базовая)', () => {
  test('фиксированный header не перекрывает H1', async ({ page }) => {
    await page.goto('/about.html');
    const header = await page.locator('header.header').boundingBox();
    const h1 = await page.locator('h1').boundingBox();
    expect(h1.y).toBeGreaterThan(header.y + header.height - 2);
  });

  test('счётчики статистики доходят до целевых значений', async ({ page }) => {
    await page.goto('/index.html');
    const stat = page.locator('.ed-stats [data-count="32"]');
    await stat.scrollIntoViewIfNeeded();
    await expect(stat).toHaveText('32', { timeout: 4000 });
  });
});
