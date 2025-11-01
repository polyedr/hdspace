# Adevi Backend Django - Docker Deployment

Развертывание Django-приложения Adevi Backend с помощью Docker и Docker Compose.

## 📋 Требования

- Docker Engine 20.x+
- Docker Compose 1.29+
- 4GB+ RAM (для ML-моделей)
- 10GB+ свободного места на диске

## 🚀 Быстрый старт

### 1. Подготовка окружения

Скопируйте файл с примером переменных окружения:

```bash
cp env.example .env
```

Отредактируйте `.env` и установите необходимые значения:
- `SECRET_KEY` - секретный ключ Django (сгенерируйте новый!)
- `DB_PASSWORD` - пароль для PostgreSQL
- API ключи для внешних сервисов (Stripe, Stream, AWS, etc.)

### 2. Сборка и запуск контейнеров

```bash
# Сборка образов
docker-compose build

# Запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 3. Инициализация базы данных

```bash
# Применить миграции
docker-compose exec web python manage.py migrate

# Создать суперпользователя
docker-compose exec web python manage.py createsuperuser

# Собрать статические файлы
docker-compose exec web python manage.py collectstatic --noinput
```

### 4. Проверка работы

Откройте в браузере:
- API Swagger: http://localhost:8000/api/v1/schema/
- Django Admin: http://localhost:8000/admin/

## 🏗️ Архитектура

Проект состоит из следующих сервисов:

- **web** - Django приложение (порт 8000)
- **db** - PostgreSQL 13 (порт 5432)
- **redis** - Redis 6 (порт 6379)
- **celery_worker** - Celery worker для асинхронных задач
- **celery_beat** - Celery beat для периодических задач

## 📦 Основные компоненты

### Django приложения:
- `accounts` - управление пользователями и профилями
- `projects` - проекты, экраны, сценарии
- `virtualize_simple` - ML-распознавание элементов (Mask R-CNN)
- `uploadapps` - загрузка файлов
- `phrases` - фразы и текстовый контент
- `generators` - генераторы элементов
- `schat` - интеграция Stream Chat
- `activity` - логи активности

### ML компонент (virtualize_simple):
- **TensorFlow 1.15** для inference
- **Mask R-CNN** для детекции HTML-элементов на скриншотах
- **OpenCV** для обработки изображений
- **Tesseract OCR** для распознавания текста

## 🔧 Полезные команды

### Управление контейнерами

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose stop

# Перезапуск
docker-compose restart

# Удаление контейнеров (данные сохраняются)
docker-compose down

# Удаление контейнеров и volumes (удаляет БД!)
docker-compose down -v

# Просмотр логов
docker-compose logs -f web
docker-compose logs -f celery_worker
```

### Django команды

```bash
# Миграции
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate

# Shell
docker-compose exec web python manage.py shell

# Создание суперпользователя
docker-compose exec web python manage.py createsuperuser

# Тесты
docker-compose exec web pytest
```

### Работа с базой данных

```bash
# Подключение к PostgreSQL
docker-compose exec db psql -U adevi_user -d adevi_db

# Backup базы данных
docker-compose exec db pg_dump -U adevi_user adevi_db > backup.sql

# Restore базы данных
docker-compose exec -T db psql -U adevi_user adevi_db < backup.sql
```

### Работа с Redis

```bash
# Подключение к Redis CLI
docker-compose exec redis redis-cli

# Очистка кэша
docker-compose exec redis redis-cli FLUSHALL
```

## 🐛 Отладка

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f web
docker-compose logs -f celery_worker
docker-compose logs -f db
```

### Вход в контейнер

```bash
# Вход в web контейнер
docker-compose exec web bash

# Вход в контейнер БД
docker-compose exec db bash
```

### Проверка здоровья сервисов

```bash
# Проверка PostgreSQL
docker-compose exec db pg_isready -U adevi_user

# Проверка Redis
docker-compose exec redis redis-cli ping

# Проверка Django
docker-compose exec web python manage.py check
```

## 📊 Мониторинг

### Django Silk (профилировщик)

В режиме DEBUG доступен по адресу: http://localhost:8000/silk/

### Sentry (мониторинг ошибок)

Настройте `SENTRY_DSN` в `.env` для отправки ошибок в Sentry.

## 🔒 Безопасность

### Важно перед развертыванием в production:

1. **Смените SECRET_KEY** - сгенерируйте уникальный ключ
2. **Установите DEBUG=False**
3. **Настройте ALLOWED_HOSTS** - укажите домены
4. **Отключите CORS_ORIGIN_ALLOW_ALL** - укажите конкретные домены
5. **Измените пароли БД** - используйте сильные пароли
6. **Используйте SSL/TLS** - настройте HTTPS через nginx
7. **Защитите API ключи** - не коммитьте .env в git
8. **Настройте firewall** - ограничьте доступ к портам

### Рекомендуемые настройки для production:

```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ORIGIN_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## 📝 Переменные окружения

Основные переменные (см. `env.example`):

| Переменная | Описание | Значение по умолчанию |
|-----------|----------|---------------------|
| `SECRET_KEY` | Django секретный ключ | - |
| `DEBUG` | Режим отладки | True |
| `DB_NAME` | Имя базы данных | adevi_db |
| `DB_USER` | Пользователь БД | adevi_user |
| `DB_PASSWORD` | Пароль БД | changeme |
| `REDIS_HOST` | Хост Redis | redis |
| `STRIPE_API_SECRET` | Stripe API ключ | - |
| `STREAM_API_KEY` | Stream Chat ключ | - |

## 🔄 Обновление

```bash
# Получить последние изменения
git pull

# Пересобрать образы
docker-compose build

# Применить миграции
docker-compose exec web python manage.py migrate

# Перезапустить сервисы
docker-compose restart
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
docker-compose exec web pytest

# Запуск конкретного теста
docker-compose exec web pytest apps/accounts/tests/test_models.py

# С coverage
docker-compose exec web pytest --cov=apps --cov-report=html
```

## 📚 Дополнительные ресурсы

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Проблемы и решения

### Ошибка подключения к БД

```bash
# Проверьте статус БД
docker-compose ps db

# Проверьте логи
docker-compose logs db

# Перезапустите БД
docker-compose restart db
```

### Ошибки с миграциями

```bash
# Откатите миграции
docker-compose exec web python manage.py migrate app_name zero

# Удалите файлы миграций и создайте заново
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
```

### Проблемы с ML-моделями

Убедитесь, что обученные модели находятся в:
```
apps/virtualize_simple/mask_rcnn/trained_models/*.h5
```

### Out of Memory (OOM)

ML-модели требуют много памяти. Увеличьте лимиты Docker:
- Минимум 4GB RAM
- Рекомендуется 8GB+ RAM

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус: `docker-compose ps`
3. Проверьте настройки в `.env`

