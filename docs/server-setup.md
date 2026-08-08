# Развёртывание сайта IT-HONA на новом сервере

Пошаговая инструкция: от чистой Ubuntu до работающего сайта с HTTPS и защитой.
Проверено на Ubuntu 22.04. Занимает около 30 минут.

Порядок шагов важен: защита включается **последней**, чтобы не потерять доступ
посреди настройки.

---

## 0. Что понадобится

| Что | Где взять |
|---|---|
| IP нового сервера | панель хостинга |
| Пароль root | письмо от хостинга или панель |
| SSH-ключ | уже есть: `C:\Users\IT-Hona\.ssh\id_ed25519` |
| Доступ в Cloudflare | dash.cloudflare.com |
| Доступ в GitHub | репозиторий закрытый, понадобится deploy key |

Ниже вместо `NEW_IP` подставляйте адрес нового сервера.

---

## 1. Первый вход и обновление

С компьютера:

```powershell
ssh root@NEW_IP
```

На сервере:

```bash
apt update && apt upgrade -y
apt install -y nginx git rsync curl
timedatectl set-timezone Asia/Dushanbe
```

Проверка: `systemctl is-active nginx` → `active`.
В браузере `http://NEW_IP` должна открыться заглушка nginx.

---

## 2. Ключ для доступа к репозиторию

Репозиторий закрытый, поэтому серверу нужен собственный ключ **только на чтение**.

```bash
ssh-keygen -t ed25519 -f /root/.ssh/github_deploy -N "" -C "ithona-server-deploy"
ssh-keyscan -t ed25519 github.com >> /root/.ssh/known_hosts 2>/dev/null

cat > /root/.ssh/config <<'EOF'
Host github.com
  IdentityFile /root/.ssh/github_deploy
  IdentitiesOnly yes
EOF
chmod 600 /root/.ssh/config

echo "=== СКОПИРУЙТЕ ЭТУ СТРОКУ ==="
cat /root/.ssh/github_deploy.pub
```

**На GitHub:** репозиторий `Site-IThona` → **Settings** → **Deploy keys** →
**Add deploy key** → вставьте строку. Галочку «Allow write access» **не ставьте**.

---

## 3. Файлы сайта

Репозиторий клонируется в `/opt`, а не в папку сайта — так `.git` не попадает
в веб-доступ и исходники нельзя скачать через браузер.

```bash
git clone git@github.com:khudoyorparpishoev0-ops/Site-IThona.git /opt/site-ithona
mkdir -p /var/www/it-hona

cat > /usr/local/bin/deploy-site <<'EOF'
#!/bin/bash
set -e
cd /opt/site-ithona
git pull --ff-only
rsync -a --delete \
  --exclude='.git' --exclude='.github' --exclude='.claude' \
  --exclude='worker' --exclude='docs' --exclude='.gitignore' \
  /opt/site-ithona/ /var/www/it-hona/
echo "Опубликовано: $(git log --oneline -1)"
EOF
chmod +x /usr/local/bin/deploy-site

deploy-site
ls /var/www/it-hona
```

Должны появиться `index.html`, `assets` и остальные файлы сайта.

---

## 4. Конфигурация nginx

Пока только HTTP — сертификат добавим следующим шагом.

```bash
rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/it-hona <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name it-hona.tj ithona.tj _;
    root /var/www/it-hona;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
}
EOF

ln -sf /etc/nginx/sites-available/it-hona /etc/nginx/sites-enabled/it-hona
nginx -t && systemctl reload nginx
curl -sS -o /dev/null -w "порт 80: %{http_code}\n" http://127.0.0.1/
```

Ожидается `200`.

---

## 5. HTTPS: сертификат Cloudflare Origin

**В Cloudflare:** домен `ithona.tj` → **SSL/TLS** → **Origin Server** →
**Create Certificate** → всё по умолчанию (RSA 2048, 15 лет) → **Create**.

Откроется окно с двумя блоками. **Приватный ключ показывается один раз** —
не закрывайте окно, пока не перенесёте оба на сервер.

```bash
mkdir -p /etc/ssl/cloudflare && chmod 700 /etc/ssl/cloudflare
```

Наберите первую строку, нажмите Enter, вставьте блок **Origin Certificate**,
затем на новой строке напишите `EOF` и Enter:

```bash
cat > /etc/ssl/cloudflare/origin.pem <<'EOF'
```

То же самое для блока **Private Key**:

```bash
cat > /etc/ssl/cloudflare/origin.key <<'EOF'
```

```bash
chmod 600 /etc/ssl/cloudflare/origin.key

# проверка: две последние команды должны выдать ОДИНАКОВУЮ строку
openssl x509 -in /etc/ssl/cloudflare/origin.pem -noout -subject -dates
openssl x509 -noout -modulus -in /etc/ssl/cloudflare/origin.pem | openssl md5
openssl rsa  -noout -modulus -in /etc/ssl/cloudflare/origin.key | openssl md5
```

Добавляем блок 443 в конфиг:

```bash
cat >> /etc/nginx/sites-available/it-hona <<'EOF'

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name it-hona.tj ithona.tj _;
    root /var/www/it-hona;
    index index.html;

    ssl_certificate     /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    location / { try_files $uri $uri/ =404; }
    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
}
EOF

nginx -t && systemctl reload nginx
curl -skS -o /dev/null -w "порт 443: %{http_code}\n" https://127.0.0.1/
```

Ожидается `200`.

---

## 6. Cloudflare: переключить домен на новый сервер

**DNS** → найдите запись типа **A** для `ithona.tj` → **Edit** →
в поле IPv4 address впишите новый IP → **Save**.
Оранжевое облачко (Proxied) должно остаться включённым.

Затем **SSL/TLS** → **Configure encryption mode** → **Full (strict)** → Save.

Через 1–2 минуты проверьте:

```bash
curl -sS -o /dev/null -w "сайт: %{http_code}\n" https://ithona.tj/
```

---

## 7. Защита сервера

Делается **последним**, когда сайт уже работает.

### 7.1 Ваш ключ на сервер

С компьютера, одной строкой:

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@NEW_IP "mkdir -p /root/.ssh; tr -d '\r' >> /root/.ssh/authorized_keys; chmod 600 /root/.ssh/authorized_keys; cat /root/.ssh/authorized_keys"
```

**Проверьте вход по ключу в отдельном окне, не закрывая текущее:**

```powershell
ssh -i $env:USERPROFILE\.ssh\id_ed25519 -o PasswordAuthentication=no root@NEW_IP "echo KEY_OK"
```

Увидели `KEY_OK` — продолжайте. Нет — не идите дальше, иначе потеряете доступ.

### 7.2 Отключить вход по паролю

Файл называется `00-`, чтобы читаться раньше `50-cloud-init.conf`,
который на облачных образах включает пароль обратно.

```bash
cat > /etc/ssh/sshd_config.d/00-hardening.conf <<'EOF'
PasswordAuthentication no
PermitRootLogin prohibit-password
KbdInteractiveAuthentication no
MaxAuthTries 3
EOF

sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config.d/50-cloud-init.conf 2>/dev/null
sed -i 's/^ssh_pwauth:.*/ssh_pwauth: false/' /etc/cloud/cloud.cfg 2>/dev/null

sshd -t && systemctl reload ssh
sshd -T | grep -E 'passwordauthentication|permitrootlogin'
```

Должно быть `passwordauthentication no`.

### 7.3 Файрвол

`allow 22` строго до `enable`, иначе оборвёте себе сессию.

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status verbose
```

### 7.4 Защита от перебора паролей

```bash
apt install -y fail2ban
cat > /etc/fail2ban/jail.local <<'EOF'
[sshd]
enabled = true
maxretry = 3
bantime = 1h
findtime = 10m
ignoreip = 127.0.0.1/8 ::1
EOF
systemctl enable --now fail2ban
fail2ban-client status sshd
```

> Свой домашний IP можно дописать в `ignoreip` через пробел — тогда fail2ban
> не заблокирует вас при случайных ошибках.

### 7.5 Закрыть сайт от прямых обращений (необязательно)

Тогда достучаться до сервера можно будет только через Cloudflare.

```bash
V4=$(curl -s https://www.cloudflare.com/ips-v4)
V6=$(curl -s https://www.cloudflare.com/ips-v6)
if [ $(echo "$V4" | grep -c '/') -lt 5 ]; then
  echo "ОШИБКА: список Cloudflare не загрузился — правила не меняю"
else
  for ip in $V4 $V6; do ufw allow from $ip to any port 80,443 proto tcp; done
  ufw delete allow 'Nginx Full'
  ufw status
fi
```

---

## 8. Финальная проверка

```bash
systemctl is-active nginx fail2ban
ufw status | head -3
sshd -T | grep passwordauthentication
curl -sS -o /dev/null -w "сайт: %{http_code}\n" https://ithona.tj/
```

Ожидается: `active`, `active`, `Status: active`, `passwordauthentication no`, `200`.

После этого перезагрузите сервер (`reboot`) и повторите проверку — так вы
убедитесь, что настройки переживают перезапуск.

---

## 9. Как публиковать правки дальше

1. Меняете файлы через сайт GitHub или локально и делаете `git push`
2. Заходите на сервер и выполняете **одну команду**:

```bash
deploy-site
```

Если правили CSS или JS — не забудьте поднять номер версии в HTML
(`style.css?v=5` → `?v=6`), иначе браузеры и Cloudflare отдадут старую версию
из кэша.

---

## 10. Что делать, если сервер снова пропадёт

Признак: `ping` отвечает от чужого адреса «Заданный узел недоступен», а сайт
показывает ошибку **523**. Это означает, что машина выключена на стороне
хостинга — настройки тут ни при чём.

Порядок действий: панель хостинга → статус сервера → баланс и уведомления →
запуск или тикет в поддержку.

Если сервер меняется на новый — вернитесь к шагу 1 этой инструкции.
