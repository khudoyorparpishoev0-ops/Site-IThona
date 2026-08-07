# Приём заявок на VPS → уведомления на почту

Заявка с формы сайта уходит POST-запросом на `/api/lead` (тот же домен, без Cloudflare),
локальный сервис пересылает её письмом на `info@ithona.tj` через ZeptoMail (Zoho).
Telegram не используется (решение владельца, 2026-08); при желании включается позже
теми же переменными `BOT_TOKEN`/`CHAT_ID` — код уже умеет.

## 1. ZeptoMail (один раз)

1. Войти на https://zeptomail.zoho.com своим Zoho-аккаунтом.
2. Добавить домен `ithona.tj`, прописать выданные DNS-записи (верификация + DKIM —
   с обычной почтой Zoho Mail не конфликтуют).
3. Mail Agent → Setup Info → скопировать **Send Mail Token**.

## 2. Код и переменные на VPS

```bash
# код сайта уже должен лежать на сервере (git clone / git pull этой ветки)
# нужен Node.js 18+:  node --version   (если нет: apt install nodejs)

# файл с секретами (токен НЕ хранить в git!)
cat > /etc/ithona-lead.env <<'ENV'
ZEPTO_TOKEN=ВСТАВИТЬ_SEND_MAIL_TOKEN
MAIL_FROM=noreply@ithona.tj
MAIL_TO=info@ithona.tj
# если ZeptoMail показывает домен .eu — раскомментировать:
# ZEPTO_URL=https://api.zeptomail.eu/v1.1/email
ENV
chmod 600 /etc/ithona-lead.env
```

## 3. systemd-сервис (автозапуск и перезапуск при сбоях)

`/etc/systemd/system/ithona-lead.service` (путь `/var/www/site-ithona` замените на фактический):

```ini
[Unit]
Description=IT-HONA lead form handler
After=network.target

[Service]
ExecStart=/usr/bin/node /var/www/site-ithona/server/lead-server.mjs
EnvironmentFile=/etc/ithona-lead.env
Restart=always
RestartSec=3
User=www-data
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now ithona-lead
systemctl status ithona-lead      # должно быть active (running)
```

## 4. nginx: проброс /api/lead на сервис

В server-блок сайта добавить:

```nginx
location /api/lead {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Origin $http_origin;
    client_max_body_size 128k;
}
```

```bash
nginx -t && systemctl reload nginx
```

## 5. Проверка

```bash
# с самого сервера (без Origin — имитация серверной проверки):
curl -s -X POST http://127.0.0.1:8787/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Проверка","contact":"+992000000000","message":"тест VPS"}'
# → {"ok":true} и письмо на info@ithona.tj
```

После того как письмо пришло — включить форму на сайте:
в `assets/i18n.js` установить `formEndpoint: "/api/lead"` и поднять версию
`i18n.js?v=…` в шести HTML (делает Claude по команде).

## Тесты

`node --test tests/server.test.mjs` — 7 интеграционных тестов (ZeptoMail мокается);
`node --test tests/worker.test.mjs` — 20 тестов общей логики.
