Изучу проект `adevi-backend-django`, чтобы понять его назначение и оценить качество.

[4 tools called]

Изучаю структуру приложений проекта:

[3 tools called]

Изучу ключевые API views и сериализаторы для понимания архитектуры:

[10 tools called]

## Анализ проекта `adevi-backend-django`

Изучил проект подробно. Вот полный отчет:

---

## 📋 **О чем проект**

**Adevi** — это **REST API для HTML-редактора/конструктора веб-интерфейсов** с использованием машинного обучения. Основной функционал:

### Ключевые возможности:
1. **HTML редактор** — создание и редактирование веб-интерфейсов
2. **Структура**: Проекты → Screens (экраны) → Scenarios (сценарии) → Elements (элементы HTML)
3. **ML компонент** — распознавание HTML-элементов на скриншотах с помощью **Mask R-CNN**:
   - Детектирует формы (forms), заголовки (headers), футеры (footers)
   - Использует OpenCV + нейросеть для анализа изображений
4. **Коллаборация**:
   - Управление командами и проектами
   - Роли пользователей (Owner, Manager, Developer, Annotator)
   - Комментарии, задачи (Kanban-стиль), таймтрекинг
5. **Интеграции**: Stripe (подписки), Stream Chat, социальная аутентификация

---

## ⚖️ **Оценка качества проекта**

### ✅ **Сильные стороны:**

1. **Хорошая архитектура Django**
   - Модульная структура приложений (`accounts`, `projects`, `virtualize_simple`, и т.д.)
   - Использование Django REST Framework
   - Proper separation of concerns (models, serializers, apiviews, apiurls)

2. **Современный стек технологий**
   - Django 2.2 + DRF
   - PostgreSQL
   - Celery для фоновых задач
   - Redis для кэширования и очередей
   - JWT аутентификация

3. **Расширенный функционал**
   - django-guardian для object-level permissions
   - django-mppt для иерархических данных
   - Simple History для аудита изменений
   - Swagger/OpenAPI документация (drf-yasg)

4. **ML интеграция**
   - Реализован Mask R-CNN для computer vision
   - Есть обученные модели (`.h5` файлы)

5. **Инфраструктура**
   - Настроен Sentry для мониторинга ошибок
   - Silk для профилирования API
   - Celery для асинхронных задач

### ⚠️ **Проблемы и недостатки:**

#### 🔴 **Критические проблемы безопасности:**

```298:305:adevi-backend-django/project/settings/base.py
ANYMAIL = {
    "AMAZON_SES_CLIENT_PARAMS": {
        # Caution: checking secrets into settings.py is really insecure!
        "aws_access_key_id": "AKIAZRT64EMNTROKJXIV",
        "aws_secret_access_key": "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",
        "region_name": 'ap-southeast-2',
    },
}
```

```115:122:adevi-backend-django/project/settings/base.py
'''
# Stripe settings
STRIPE_TEST_PUBLIC_KEY ='pk_test_51L620rJoSQ0eiPwx1bQyVqnwgjRFtH28DKzCUJcU8aBRLf9mJDbNoym8nPisb9L0bNTJOdwfTMw5ARXaoKiyqZj700QhH5iKwO'
STRIPE_TEST_SECRET_KEY = 'sk_test_51L620rJoSQ0eiPwxeb8479Rw4QaM65WXig9JfApcad5kOKVMVtIDaK1giPp9tZ168o1RNJlue9m1N81vhQImMgHW00C0uqXOHS'
STRIPE_LIVE_MODE = False  # Change to True in production
DJSTRIPE_WEBHOOK_SECRET = "whsec_282093a53f7bbfdb42092e1431c8308736a76a94cb3438067ccba26b8b60c8da"
DJSTRIPE_FOREIGN_KEY_TO_FIELD = "id"
'''
```

**❌ API ключи и секреты прямо в коде!** AWS credentials, Stripe, Stream API, Google OAuth — все в открытом виде.

#### 🟠 **Серьезные проблемы:**

1. **Устаревшие зависимости:**
   - Django 2.2.24 (вышла из поддержки, критические уязвимости)
   - Python 3.6 (end of life)
   - TensorFlow 1.5.0 (очень старая версия)
   - Много других устаревших пакетов

2. **Дебаг-код в продакшене:**
   - **273 `print()` statements** по всему коду
   - Закомментированный код
   - Отладочная информация

```67:68:adevi-backend-django/apps/projects/serializers.py
    iclone.save()
    print(iclone)
    return iclone
```

3. **Слабое покрытие тестами:**
   - Всего 5 тестовых файлов
   - Базовые unit-тесты, почти нет интеграционных
   - Нет тестов для критичного ML кода

4. **Небезопасные настройки по умолчанию:**

```132:142:adevi-backend-django/project/settings/base.py
# Allow CORS for all domains
CORS_ORIGIN_ALLOW_ALL = True

# Set default permissions to anyone can access our API
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.CursorPagination',
    'PAGE_SIZE': 100,

    "DEFAULT_PERMISSION_CLASSES": [
        # 'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',  # Swagger is now public
    ],
```

**❌ CORS открыт для всех, API публично доступно без аутентификации**

5. **Код качество:**
   - Нет type hints
   - Inconsistent code style
   - Дублирование кода
   - Много сложной логики в сериализаторах (нарушение SRP)

6. **Документация:**
   - README базовый
   - Нет описания архитектуры
   - Нет API гайдов (только Swagger)

---

## 🎯 **Итоговая оценка: 5-6/10**

### Резюме:

**Проект функционален** и решает интересную задачу (ML для HTML редактирования), но имеет **серьезные проблемы** с:
- ❌ Безопасностью (критично!)
- ❌ Актуальностью зависимостей
- ⚠️ Качеством кода (debug print'ы, слабые тесты)
- ⚠️ Production-ready настройками

### Что нужно сделать в первую очередь:

1. **🔥 СРОЧНО**: Вынести все секреты в `.env`
2. **🔥 СРОЧНО**: Обновить Django до 4.x/5.x
3. Закрыть CORS и API permissions
4. Удалить все `print()` statements
5. Обновить Python до 3.11+
6. Добавить логирование вместо print
7. Написать тесты (минимум 60% покрытия)
8. Добавить CI/CD с проверками безопасности

**Вывод**: Проект имеет хороший фундамент и интересный функционал, но требует рефакторинга в части безопасности и современных практик разработки.
