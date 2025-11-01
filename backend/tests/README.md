# Тесты Adevi Backend Django

## 📋 Структура тестов

```
tests/
├── conftest.py              # Общие fixtures
├── smoke/                   # Smoke тесты (быстрые проверки)
│   ├── test_health.py      # Health check endpoints
│   └── test_db.py          # Database connectivity
├── api/                     # API endpoint тесты
│   ├── test_auth.py        # JWT аутентификация
│   └── test_projects.py    # Projects CRUD
└── virtualize_simple/       # ML компонент тесты
    └── test_endpoints.py   # Mask R-CNN endpoints
```

## 🚀 Запуск тестов

### Все тесты:
```bash
docker-compose exec web pytest
```

### Только smoke тесты (быстрые):
```bash
docker-compose exec web pytest tests/smoke/
```

### Только API тесты:
```bash
docker-compose exec web pytest tests/api/
```

### С coverage:
```bash
docker-compose exec web pytest --cov=apps --cov-report=html
```

### Specific test file:
```bash
docker-compose exec web pytest tests/smoke/test_health.py -v
```

### Через Makefile:
```bash
make test           # Все тесты
make test-cov       # С coverage отчетом
```

## 🏷️ Маркеры тестов

Тесты помечены маркерами для удобной фильтрации:

- `@pytest.mark.smoke` - быстрые smoke тесты
- `@pytest.mark.api` - API endpoint тесты  
- `@pytest.mark.ml` - ML тесты (могут быть медленными)
- `@pytest.mark.slow` - медленные тесты
- `@pytest.mark.integration` - интеграционные тесты

### Запуск по маркерам:

```bash
# Только smoke тесты
docker-compose exec web pytest -m smoke

# Без медленных тестов
docker-compose exec web pytest -m "not slow"

# Только ML тесты
docker-compose exec web pytest -m ml
```

## 📊 Покрытие тестами

### Текущее покрытие:

- **Smoke тесты**: Health checks, DB connectivity
- **API тесты**: Auth (JWT), Projects CRUD
- **ML тесты**: virtualize_simple endpoints (базовые)

### Что протестировано:

✅ Health check endpoints (/health/, /health/detailed/)  
✅ Database connectivity и ORM операции  
✅ JWT аутентификация (create, refresh)  
✅ User registration  
✅ Projects API (list, create, update, delete)  
✅ Project Screens API  
✅ virtualize_simple endpoints доступность  

### Что НЕ протестировано (требует ML модели):

⏭️ MaskRCNN распознавание с реальными изображениями  
⏭️ Полный workflow распознавания  
⏭️ Assemble/Freecanvas с данными  

## 🔧 Fixtures

Доступные фикстуры (из `conftest.py`):

- `api_client` - неаутентифицированный API клиент
- `test_user` - тестовый пользователь
- `admin_user` - админ пользователь
- `authenticated_client` - аутентифицированный клиент
- `authenticated_admin_client` - админ клиент
- `test_project` - тестовый проект
- `jwt_tokens` - JWT токены для test_user

## 📝 Примеры использования

### Простой тест:

```python
@pytest.mark.django_db
def test_my_feature(authenticated_client):
    response = authenticated_client.get('/api/v1/myendpoint/')
    assert response.status_code == 200
```

### С фикстурами:

```python
@pytest.mark.django_db
def test_with_project(authenticated_client, test_project):
    response = authenticated_client.get(
        f'/api/v1/projects/projects/{test_project.id}/'
    )
    assert response.status_code == 200
    assert response.json()['name'] == test_project.name
```

## ⚠️ Важно

### Требования для ML тестов:

Тесты с `@pytest.mark.skip` требуют:
1. Загруженные ML модели (`.h5` файлы)
2. Переменная окружения `ENV_NAME=Staging`
3. Тестовые изображения в `media/`

Чтобы запустить ML тесты:
```bash
# Загрузите модели в apps/virtualize_simple/mask_rcnn/trained_models/
# Установите ENV_NAME
docker-compose exec web bash -c "ENV_NAME=Staging pytest tests/virtualize_simple/ -v"
```

## 🎯 Следующие шаги

Для расширения тестового покрытия добавьте тесты для:

1. **Screens API** - CRUD операции
2. **Elements API** - создание и редактирование элементов
3. **Scenarios API** - работа со сценариями
4. **Permissions** - проверка прав доступа
5. **Subscriptions** - Stripe интеграция
6. **Chat** - Stream Chat функционал
7. **Activity** - логирование активности

## 📈 CI/CD Integration

Добавьте в ваш CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    docker-compose exec -T web pytest --cov=apps --cov-report=xml
    
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 🐛 Отладка тестов

```bash
# Запуск с подробным выводом
docker-compose exec web pytest -vv

# Остановка на первой ошибке
docker-compose exec web pytest -x

# Показать print statements
docker-compose exec web pytest -s

# Запуск конкретного теста
docker-compose exec web pytest tests/smoke/test_health.py::TestHealthEndpoints::test_simple_health_check -v
```

---

**Тесты готовы к использованию!** 🚀

