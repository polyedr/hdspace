# Postman Collections для Adevi Backend API

Этот каталог содержит коллекции Postman для тестирования и работы с Adevi Backend API.

## 📦 Коллекции

### 1. **Adevi Backend - Authentication & Authorization**
   - Файл: `Adevi_Backend_Auth.postman_collection.json`
   - Эндпоинты для:
     - Health checks (`/health/`, `/health/detailed/`)
     - JWT аутентификация (login, refresh, verify)
     - Djoser user management (регистрация, управление профилем, сброс пароля)

### 2. **Adevi Backend - Accounts**
   - Файл: `Adevi_Backend_Accounts.postman_collection.json`
   - Эндпоинты для:
     - Управление пользователями (`/api/v1/accounts/users/`)
     - Управление профилями (`/api/v1/accounts/profiles/`)
     - Shared links (`/api/v1/accounts/sharedlinks/`)

### 3. **Adevi Backend - Projects**
   - Файл: `Adevi_Backend_Projects.postman_collection.json`
   - Эндпоинты для:
     - CRUD операций с проектами
     - Управление экранами (screens)
     - Управление колонками и задачами (columns, tasks)
     - Управление участниками проекта (members)
     - Разрешения (permissions)
     - Сценарии и элементы (scenario elements)

### 4. **Adevi Backend - Virtualize Simple (ML)**
   - Файл: `Adevi_Backend_Virtualize_Simple.postman_collection.json`
   - Эндпоинты для:
     - Распознавание экранов (`/recognize/`)
     - Mask R-CNN детекция (`/maskrcnn/`) - для forms, headers, footers
     - Сборка элементов из аннотаций (`/assemble/`)
     - Сборка элементов из free canvas (`/freecanvas/`)

## 🚀 Быстрый старт

### 1. Импорт коллекций в Postman

1. Откройте Postman
2. Нажмите **Import** (или `Ctrl+O`)
3. Выберите файлы `.postman_collection.json` из этой папки
4. Импортируйте все коллекции

### 2. Настройка переменных окружения

#### Создание Environment

1. В Postman нажмите на **Environments** (или `Ctrl+E`)
2. Создайте новый environment: **Adevi Backend Local**
3. Добавьте следующие переменные:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:18000` | `http://localhost:18000` |
| `username` | `admin` | `admin` |
| `password` | `changeme123` | `changeme123` |
| `access_token` | *(пусто)* | *(пусто, заполнится автоматически)* |
| `refresh_token` | *(пусто)* | *(пусто, заполнится автоматически)* |

#### Переменные для конкретных коллекций

В каждой коллекции есть свои переменные (например, `project_id`, `screen_id`), которые можно переопределить в environment или установить вручную.

### 3. Аутентификация

#### Шаг 1: Получение токена

1. Откройте коллекцию **Authentication & Authorization**
2. Выполните запрос **"Login (JWT) - Obtain Token Pair"**
3. Токены автоматически сохранятся в переменные `access_token` и `refresh_token`

#### Шаг 2: Использование токена

Все запросы, требующие аутентификации, используют Bearer token автоматически через переменную `{{access_token}}`.

### 4. Тестирование эндпоинтов

После получения токена вы можете:

1. Использовать эндпоинты из коллекции **Accounts** для работы с пользователями
2. Использовать эндпоинты из коллекции **Projects** для работы с проектами
3. Использовать эндпоинты из коллекции **Virtualize Simple** для ML операций

## 📝 Особенности коллекций

### Автоматическое сохранение токенов

Запрос **"Login (JWT) - Obtain Token Pair"** автоматически сохраняет полученные токены в переменные окружения через Postman Test Scripts:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.access) {
        pm.environment.set("access_token", jsonData.access);
    }
    if (jsonData.refresh) {
        pm.environment.set("refresh_token", jsonData.refresh);
    }
}
```

### Health Checks

Коллекция **Authentication & Authorization** включает тесты для health checks:
- Проверка статуса ответа
- Проверка наличия обязательных полей в JSON ответе

### Примеры запросов

Все коллекции содержат примеры запросов с правильной структурой данных:
- Создание проектов
- Добавление участников
- Работа с экранами и элементами
- ML распознавание элементов интерфейса

## 🔧 Настройка для разных окружений

### Development (локально)
```
base_url = http://localhost:18000
```

### Staging
```
base_url = https://api-staging.adevi.io
```

### Production
```
base_url = https://api.adevi.io
```

Создайте отдельные environments для каждого окружения.

## 📋 Полезные ссылки

- **Swagger UI**: `http://localhost:18000/api/v1/schema/`
- **Health Check**: `http://localhost:18000/health/`
- **Detailed Health Check**: `http://localhost:18000/health/detailed/`

## 🐛 Troubleshooting

### Токен не сохраняется автоматически

Проверьте:
1. Что вы выбрали правильный environment в Postman
2. Что environment не заблокирован (lock icon)
3. Что запрос выполнен успешно (статус 200)

### 401 Unauthorized

1. Выполните запрос **"Login (JWT)"** заново
2. Убедитесь, что переменная `access_token` заполнена
3. Проверьте, что токен не истек (lifetime: 12 часов для access token)

### 404 Not Found

Убедитесь, что:
1. Backend запущен и доступен на `{{base_url}}`
2. Вы используете правильные пути к эндпоинтам
3. Переменные (например, `{{project_id}}`) заполнены корректными значениями

## 📚 Дополнительная информация

Для получения полной документации API:
1. Откройте Swagger UI: `http://localhost:18000/api/v1/schema/`
2. Или используйте интерактивную документацию в Postman

---

**Примечание**: Убедитесь, что backend запущен перед тестированием эндпоинтов. См. `QUICKSTART.md` в корне проекта для инструкций по запуску.

