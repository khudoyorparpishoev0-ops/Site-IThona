#!/bin/bash
# ============================================================
# IT-HONA — развёртывание сайта на чистом Ubuntu 22.04 (VPS).
# Запуск от root:  bash /opt/site-ithona/scripts/vps-setup.sh
# Скрипт идемпотентный — можно запускать повторно.
#
# Делает:
#   1) nginx + Node.js 20 + git
#   2) выкладывает сайт в /var/www/it-hona (только публичные файлы)
#   3) конфиг nginx: домены, 404, security-заголовки, кэш,
#      /api/lead -> локальный сервис заявок (rate-limit 5 р/мин)
#   4) systemd-сервис ithona-lead (email-уведомления о заявках;
#      запустится после того, как вы создадите /etc/ithona-lead.env)
#   5) безопасный скрипт обновления /usr/local/bin/update-site
#
# После скрипта вручную (по желанию):
#   - HTTPS:  apt install -y certbot python3-certbot-nginx &&
#             certbot --nginx -d it-hona.tj -d www.it-hona.tj
#   - Почта:  создать /etc/ithona-lead.env (см. server/README.md)
#             и systemctl restart ithona-lead
# ============================================================
set -euo pipefail

REPO_DIR="/opt/site-ithona"
WEB_ROOT="/var/www/it-hona"
BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)"

echo "== [1/5] Пакеты =="
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get install -y -q nginx git rsync curl ca-certificates
if ! command -v node >/dev/null || [ "$(node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo 0)" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -q nodejs
fi
echo "node: $(node --version)"

echo "== [2/5] Файлы сайта -> $WEB_ROOT =="
mkdir -p "$WEB_ROOT"
# ЗАЩИТА: цель задана жёстко, никакой подстановки переменных в путь назначения
rsync -a --delete \
  --exclude='.git' --exclude='.claude' --exclude='.github' \
  --exclude='worker' --exclude='server' --exclude='tests' \
  --exclude='scripts' --exclude='docs' --exclude='node_modules' \
  --exclude='package.json' --exclude='package-lock.json' \
  --exclude='playwright.config.mjs' --exclude='.gitignore' \
  "$REPO_DIR/" "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"
ls "$WEB_ROOT/index.html" >/dev/null && echo "index.html на месте"

echo "== [3/5] nginx =="
cat > /etc/nginx/conf.d/ithona-ratelimit.conf <<'CONF'
limit_req_zone $binary_remote_addr zone=lead:10m rate=5r/m;
CONF

cat > /etc/nginx/sites-available/it-hona <<'CONF'
server {
    listen 80;
    listen [::]:80;
    server_name it-hona.tj www.it-hona.tj ithona.tj www.ithona.tj _;

    root /var/www/it-hona;
    index index.html;
    error_page 404 /404.html;

    # security-заголовки (см. docs/qa-site/09_SECURITY_AUDIT.md)
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header X-Frame-Options SAMEORIGIN always;

    # кэш: статика — долго (версии ?v= уже используются), HTML — не кэшировать
    location ~* \.(css|js|jpg|jpeg|png|svg|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # заявки с формы -> локальный сервис
    location /api/lead {
        limit_req zone=lead burst=3 nodelay;
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Origin $http_origin;
        client_max_body_size 128k;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
CONF
ln -sf /etc/nginx/sites-available/it-hona /etc/nginx/sites-enabled/it-hona
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "== [4/5] Сервис заявок (email-уведомления) =="
cat > /etc/systemd/system/ithona-lead.service <<CONF
[Unit]
Description=IT-HONA lead form handler
After=network.target

[Service]
ExecStart=/usr/bin/node $REPO_DIR/server/lead-server.mjs
EnvironmentFile=/etc/ithona-lead.env
Restart=always
RestartSec=3
User=www-data
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
CONF
systemctl daemon-reload
if [ -f /etc/ithona-lead.env ]; then
  systemctl enable --now ithona-lead
  echo "ithona-lead: $(systemctl is-active ithona-lead)"
else
  echo "ВНИМАНИЕ: /etc/ithona-lead.env не найден — сервис заявок не запущен."
  echo "Создайте его по server/README.md (ZEPTO_TOKEN, MAIL_FROM, MAIL_TO),"
  echo "затем: systemctl enable --now ithona-lead"
fi

echo "== [5/5] Безопасный update-site =="
cat > /usr/local/bin/update-site <<UPD
#!/bin/bash
# Обновление сайта из git. Цель обновления задана жёстко.
set -euo pipefail
cd $REPO_DIR
git pull origin $BRANCH
rsync -a --delete \\
  --exclude='.git' --exclude='.claude' --exclude='.github' \\
  --exclude='worker' --exclude='server' --exclude='tests' \\
  --exclude='scripts' --exclude='docs' --exclude='node_modules' \\
  --exclude='package.json' --exclude='package-lock.json' \\
  --exclude='playwright.config.mjs' --exclude='.gitignore' \\
  $REPO_DIR/ $WEB_ROOT/
chown -R www-data:www-data $WEB_ROOT
systemctl restart ithona-lead 2>/dev/null || true
echo "Сайт обновлён: $WEB_ROOT"
UPD
chmod +x /usr/local/bin/update-site

echo
echo "================================================================"
echo "Готово. Проверка:  curl -sI http://127.0.0.1/index.html | head -1"
curl -sI http://127.0.0.1/index.html | head -1 || true
echo
echo "Дальше:"
echo "  1) HTTPS:  apt install -y certbot python3-certbot-nginx"
echo "             certbot --nginx -d it-hona.tj -d www.it-hona.tj"
echo "  2) Почта:  создать /etc/ithona-lead.env (server/README.md)"
echo "             systemctl enable --now ithona-lead"
echo "================================================================"
