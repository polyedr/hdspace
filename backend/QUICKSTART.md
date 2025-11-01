# 🚀 Быстрый старт - Adevi Backend Django в Docker

## За 5 минут от 0 до запущенного приложения

### 1. Подготовка (1 мин)

```bash
# Скопируйте файл с переменными окружения
cp env.example .env

# Отредактируйте .env (минимально необходимо):
# - SECRET_KEY (сгенерируйте новый)
# - DB_PASSWORD (смените пароль)
nano .env
```

### 2. Запуск (3 мин)

С помощью Makefile (рекомендуется):
```bash
# Инициализация: сборка, запуск, миграции, collectstatic
make init

# Создать суперпользователя
make createsuperuser
```

Или вручную:
```bash
# Сборка образов
docker-compose build

# Запуск контейнеров
docker-compose up -d

# Применить миграции
docker-compose exec web python manage.py migrate

# Собрать статику
docker-compose exec web python manage.py collectstatic --noinput

# Создать суперпользователя
docker-compose exec web python manage.py createsuperuser
```

### 3. Проверка (1 мин)

Откройте в браузере:
- **Swagger API**: http://localhost:8000/api/v1/schema/
- **Django Admin**: http://localhost:8000/admin/
- **Silk Profiler**: http://localhost:8000/silk/ (если DEBUG=True)

## 📋 Основные команды

```bash
# Просмотр логов
make logs

# Остановка
make down

# Перезапуск
make restart

# Django shell
make shell

# Тесты
make test
```

## 🔧 Полезные команды Makefile

```bash
make help              # Показать все доступные команды
make build             # Собрать образы
make up                # Запустить контейнеры
make down              # Остановить контейнеры
make logs              # Просмотр логов
make shell             # Django shell
make migrate           # Применить миграции
make collectstatic     # Собрать статику
make test              # Запустить тесты
make clean             # Удалить все (включая БД!)
```

## ⚠️ Важно перед первым запуском

1. **Установите Docker и Docker Compose**
2. **Скопируйте env.example в .env**
3. **Измените SECRET_KEY** (используйте генератор)
4. **Измените DB_PASSWORD**
5. **Убедитесь, что порты 8000, 5432, 6379 свободны**

## 🐛 Проблемы?

### Контейнеры не запускаются
```bash
# Проверьте статус
docker-compose ps

# Просмотрите логи
docker-compose logs
```

### Ошибка подключения к БД
```bash
# Подождите 30 секунд и попробуйте снова
docker-compose restart web
```

### Порты заняты
Измените порты в docker-compose.yml:
```yaml
ports:
  - "8001:8000"  # Вместо 8000:8000
```

## 📚 Подробная документация

См. [DOCKER_README.md](DOCKER_README.md) для детальной информации.

## 🎯 Что дальше?

1. Изучите API через Swagger UI
2. Создайте тестовый проект через API
3. Настройте интеграции (Stripe, Stream Chat, AWS)
4. Загрузите ML-модели в `apps/virtualize_simple/mask_rcnn/trained_models/`
5. Настройте production окружение

## 🔒 Безопасность для Production

Перед деплоем в production:
- [ ] `DEBUG=False`
- [ ] Уникальный `SECRET_KEY`
- [ ] Сильные пароли для БД
- [ ] Настроенный `ALLOWED_HOSTS`
- [ ] Отключен `CORS_ORIGIN_ALLOW_ALL`
- [ ] Настроен HTTPS (nginx + certbot)
- [ ] Включен Sentry для мониторинга
- [ ] Настроены backup'ы БД

---

**Готово!** 🎉 Ваше приложение запущено на http://localhost:8000

