# 🚀 Production Deployment Guide

Руководство по развертыванию Adevi Backend Django в production окружении.

## 📋 Предварительные требования

### Сервер
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Минимум 4GB RAM (рекомендуется 8GB для ML)
- 20GB+ свободного места
- Docker 20.x+
- Docker Compose 1.29+

### Домен и SSL
- Зарегистрированный домен
- DNS записи настроены на ваш сервер
- SSL сертификат (Let's Encrypt рекомендуется)

## 🔧 Шаг 1: Подготовка сервера

### Установка Docker

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавление Docker GPG ключа
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление Docker репозитория
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# Проверка
docker --version
docker-compose --version
```

### Установка дополнительных инструментов

```bash
# Git
sudo apt install -y git

# Nginx (для reverse proxy, если не используете Docker nginx)
sudo apt install -y nginx

# Certbot для Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
```

## 📦 Шаг 2: Клонирование проекта

```bash
# Создание директории для проектов
sudo mkdir -p /opt/apps
sudo chown $USER:$USER /opt/apps
cd /opt/apps

# Клонирование репозитория
git clone <your-repo-url> adevi-backend
cd adevi-backend
```

## 🔐 Шаг 3: Настройка окружения

### Создание .env файла

```bash
# Копирование примера
cp env.example .env

# Генерация SECRET_KEY
python3 docker/generate_secret_key.py

# Редактирование .env
nano .env
```

### Критически важные настройки в .env:

```bash
# Django
SECRET_KEY=<сгенерированный-ключ>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

# Database
DB_NAME=adevi_db_prod
DB_USER=adevi_user_prod
DB_PASSWORD=<сильный-пароль>
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<сильный-пароль>

# CORS
CORS_ORIGIN_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# URLs
BASE_URL=https://api.yourdomain.com
DOMAIN=yourdomain.com

# External Services (заполните реальные ключи)
STRIPE_API_SECRET=<your-stripe-key>
STREAM_API_KEY=<your-stream-key>
STREAM_API_SECRET=<your-stream-secret>
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
SENTRY_DSN=<your-sentry-dsn>
```

### Создание директорий

```bash
mkdir -p backups logs ssl
chmod 755 backups logs
```

## 🌐 Шаг 4: Настройка SSL

### Вариант 1: Let's Encrypt (рекомендуется)

```bash
# Остановите nginx если запущен
sudo systemctl stop nginx

# Получение SSL сертификата
sudo certbot certonly --standalone -d api.yourdomain.com

# Копирование сертификатов
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem ssl/
sudo chown $USER:$USER ssl/*

# Настройка автообновления
sudo certbot renew --dry-run
```

### Вариант 2: Собственный SSL сертификат

```bash
# Копируйте ваши сертификаты в директорию ssl/
cp /path/to/your/fullchain.pem ssl/
cp /path/to/your/privkey.pem ssl/
```

### Обновление nginx.conf для SSL

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... остальная конфигурация
}

# Редирект HTTP -> HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🚀 Шаг 5: Запуск приложения

### Сборка и запуск

```bash
# Сборка образов (это займет время)
docker-compose -f docker-compose.prod.yml build

# Запуск контейнеров
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps
```

### Инициализация базы данных

```bash
# Применение миграций
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate

# Сбор статики
docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput

# Создание суперпользователя
docker-compose -f docker-compose.prod.yml exec web python manage.py createsuperuser
```

### Загрузка ML моделей

```bash
# Скачайте обученные модели на сервер
scp -r trained_models/* user@server:/opt/apps/adevi-backend/apps/virtualize_simple/mask_rcnn/trained_models/

# Или используйте wget/curl
cd apps/virtualize_simple/mask_rcnn/trained_models/
wget https://your-storage.com/model.h5
```

## 🔍 Шаг 6: Проверка

```bash
# Проверка health endpoint
curl http://localhost/health/

# Проверка через домен
curl https://api.yourdomain.com/health/

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f web

# Проверка всех сервисов
docker-compose -f docker-compose.prod.yml ps
```

Откройте в браузере:
- https://api.yourdomain.com/api/v1/schema/
- https://api.yourdomain.com/admin/

## 🔄 Шаг 7: Настройка автозапуска

### Создание systemd service

```bash
sudo nano /etc/systemd/system/adevi-backend.service
```

Содержимое файла:

```ini
[Unit]
Description=Adevi Backend Django
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/apps/adevi-backend
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Активация:

```bash
sudo systemctl daemon-reload
sudo systemctl enable adevi-backend.service
sudo systemctl start adevi-backend.service
sudo systemctl status adevi-backend.service
```

## 📊 Шаг 8: Мониторинг и логирование

### Настройка логирования

```bash
# Ротация логов
sudo nano /etc/logrotate.d/adevi-backend
```

```
/opt/apps/adevi-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Мониторинг с Sentry

Убедитесь, что `SENTRY_DSN` настроен в `.env`.

### Prometheus + Grafana (опционально)

Для расширенного мониторинга добавьте в docker-compose.prod.yml:

```yaml
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
```

## 🗄️ Шаг 9: Backup и восстановление

### Автоматический backup базы данных

Создайте cron job:

```bash
crontab -e
```

Добавьте:

```cron
# Backup БД каждый день в 3:00
0 3 * * * cd /opt/apps/adevi-backend && docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U adevi_user_prod adevi_db_prod | gzip > /opt/apps/adevi-backend/backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz

# Удаление старых backup'ов (старше 30 дней)
0 4 * * * find /opt/apps/adevi-backend/backups -name "*.sql.gz" -mtime +30 -delete
```

### Восстановление из backup

```bash
# Распаковка
gunzip backup_20240101_030000.sql.gz

# Восстановление
docker-compose -f docker-compose.prod.yml exec -T db psql -U adevi_user_prod adevi_db_prod < backup_20240101_030000.sql
```

## 🔄 Шаг 10: Обновление приложения

```bash
# 1. Backup перед обновлением
docker-compose -f docker-compose.prod.yml exec db pg_dump -U adevi_user_prod adevi_db_prod > backup_before_update.sql

# 2. Получить последние изменения
git pull origin main

# 3. Пересобрать образы
docker-compose -f docker-compose.prod.yml build

# 4. Остановить контейнеры
docker-compose -f docker-compose.prod.yml down

# 5. Запустить новые контейнеры
docker-compose -f docker-compose.prod.yml up -d

# 6. Применить миграции
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate

# 7. Собрать статику
docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput

# 8. Проверить health
curl https://api.yourdomain.com/health/
```

## 🛡️ Безопасность

### Firewall

```bash
# UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Регулярные обновления

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Обновление Docker образов
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Оптимизация производительности

### PostgreSQL tuning

Отредактируйте `postgresql.conf` для production:

```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
work_mem = 6553kB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Gunicorn workers

Рекомендуемая формула: `(2 x CPU cores) + 1`

Для 4 cores: `--workers 9`

### Redis memory limit

```bash
# В docker-compose.prod.yml
command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

## 📞 Поддержка

При проблемах:
1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs`
2. Проверьте health: `curl https://api.yourdomain.com/health/detailed/`
3. Проверьте Sentry для ошибок приложения
4. Проверьте метрики сервера: `htop`, `docker stats`

---

**Готово!** Ваше приложение развернуто в production 🎉

