# 🎯 НАЧНИТЕ ЗДЕСЬ - Adevi Backend Django + Docker

## 📦 Что готово?

Docker-инфраструктура для проекта **полностью настроена и готова к запуску!**

✅ Python 3.6 + Django 2.2  
✅ TensorFlow 1.15 + ML компонент (virtualize_simple)  
✅ PostgreSQL 13 + Redis 6  
✅ Celery для асинхронных задач  
✅ Nginx для production  
✅ Health checks  
✅ Полная документация  

---

## 🚀 Запуск за 3 шага (5 минут)

### Шаг 1: Подготовка
```bash
# Скопируйте файл с настройками
cp env.example .env

# Отредактируйте .env (обязательно!)
nano .env
```

**Минимум измените:**
- `SECRET_KEY` (сгенерируйте: `python3 docker/generate_secret_key.py`)
- `DB_PASSWORD` (придумайте сильный пароль)

### Шаг 2: Запуск
```bash
# Вариант A: С Makefile (рекомендуется)
make init
make createsuperuser

# Вариант B: Без Makefile
docker-compose build
docker-compose up -d
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py collectstatic --noinput
docker-compose exec web python manage.py createsuperuser
```

### Шаг 3: Проверка
Откройте в браузере:
- 🔍 **Health**: http://localhost:8000/health/
- 📖 **Swagger API**: http://localhost:8000/api/v1/schema/
- 🔐 **Admin**: http://localhost:8000/admin/

---

## 📚 Документация

| Файл | Описание |
|------|----------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Быстрый старт (прочтите первым!) |
| **[DOCKER_README.md](DOCKER_README.md)** | 📖 Полная документация по Docker |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🚀 Production deployment |
| **[DOCKER_SETUP_SUMMARY.md](DOCKER_SETUP_SUMMARY.md)** | 📋 Что было сделано |

---

## 🔧 Полезные команды

```bash
# Управление
make up              # Запустить
make down            # Остановить
make restart         # Перезапустить
make logs            # Просмотр логов

# Разработка
make shell           # Django shell
make bash            # Bash в контейнере
make migrate         # Применить миграции
make test            # Запустить тесты

# Утилиты
make ps              # Статус контейнеров
make backup-db       # Backup БД
make help            # Все команды
```

---

## ⚠️ Важно!

### Перед первым запуском:
- [ ] Скопирован `env.example` в `.env`
- [ ] Изменен `SECRET_KEY`
- [ ] Изменен `DB_PASSWORD`
- [ ] Порты 8000, 5432, 6379 свободны

### ML модели (virtualize_simple):
Обученные модели должны быть в:
```
apps/virtualize_simple/mask_rcnn/trained_models/*.h5
```

Если их нет - скачайте с вашего сервера/хранилища.

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────┐
│          Nginx (Production)             │
│              Port 80/443                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Django Web (Gunicorn)           │
│    TensorFlow + Mask R-CNN + API        │
│              Port 8000                   │
└────┬────────────────────────────────┬───┘
     │                                │
     │                                │
┌────▼─────────┐            ┌────────▼─────┐
│  PostgreSQL  │            │     Redis     │
│   Port 5432  │            │   Port 6379   │
└──────────────┘            └───────┬───────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐          ┌──────────▼────────┐
            │ Celery Worker  │          │   Celery Beat     │
            │ (Async tasks)  │          │   (Scheduler)     │
            └────────────────┘          └───────────────────┘
```

---

## 🎯 Следующие шаги

### Development:
1. ✅ Запустите приложение (`make init`)
2. ✅ Создайте суперпользователя
3. ✅ Изучите API через Swagger
4. ✅ Загрузите ML модели
5. ✅ Протестируйте функционал

### Production:
1. 📖 Прочтите [DEPLOYMENT.md](DEPLOYMENT.md)
2. 🔒 Настройте SSL
3. 🛡️ Настройте безопасность
4. 📊 Настройте мониторинг (Sentry)
5. 💾 Настройте backup'ы

---

## 🆘 Проблемы?

### Контейнеры не запускаются:
```bash
docker-compose ps
docker-compose logs -f
```

### Порты заняты:
Измените порты в `docker-compose.yml`

### Ошибки миграций:
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec web python manage.py migrate
```

### Нужна помощь?
- 📖 См. [DOCKER_README.md](DOCKER_README.md) - FAQ
- 🐛 Проверьте логи: `make logs`
- 💡 Используйте `make help` для списка команд

---

## 📊 Мониторинг

После запуска доступны:
- **Health check**: http://localhost:8000/health/
- **Health detailed**: http://localhost:8000/health/detailed/
- **Silk profiler** (DEBUG=True): http://localhost:8000/silk/

---

## 🎉 Готово к работе!

Ваш проект готов к запуску в Docker.

**Начните с [QUICKSTART.md](QUICKSTART.md)** для быстрого старта!

---

_Создано: 2025-10-31_  
_Версия: 1.0_  
_Python 3.6 | Django 2.2 | TensorFlow 1.15_

