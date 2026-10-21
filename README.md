# HDSpace

Визуальный конструктор сайтов (Adevi). Один репозиторий: Django API + React-редактор.

```
backend/    Python 3.12 + Django 5.2 + DRF, PostgreSQL 16, Redis 7, Celery
frontend/   React 18.3 + TypeScript 5.6 + Vite 6
```

Ветка модернизации: `upgrade/controlled-big-bang`. План: [docs-dev/modernization-plan.md](docs-dev/modernization-plan.md).

История Bitbucket сохранена: коммиты бэкенда живут в `backend/`, фронтенда — в `frontend/`.
Ветка `archive/mlnew` — снимок ML-ветки (Mask R-CNN, декабрь 2022). Для обычной работы не нужна.

## Что нужно локально (не в git)

Скопируйте с флешки / со старой машины:

| Файл | Зачем |
|------|--------|
| `backend/.env` | секреты, порты, БД |
| `backend/gkeys/*.json` | Google Vision, только если нужен OCR/импорт |

Шаблон env: `backend/env.example`. Скопируйте в `backend/.env` и поправьте значения.

Конструктор (проекты, экраны, ручное редактирование) работает **без** Google-ключей.

## Запуск

Порты в текущем `.env`: API `18000`, Postgres `15432`, Redis `16379`, фронт `8080`.

```bash
# Backend (чистая БД создаётся миграциями baseline)
cd backend
cp env.example .env   # если ещё нет своего .env
docker compose up --build

# Frontend (другой терминал; Node >= 22)
cd frontend
npm ci
npm run dev
```

- API / Swagger: http://localhost:18000/api/v1/schema/
- Health: http://localhost:18000/health/
- Admin: http://localhost:18000/admin/
- Редактор: http://localhost:8080

Фронт ходит в `http://localhost:18000` (`frontend/src/config/settings.ts`).

## Стек (после controlled big bang)

- Backend: Python 3.12, Django 5.2, DRF 3.16, PostgreSQL 16, Redis 7, Celery 5, `psycopg` 3
- Frontend: Node 22+, React 18.3, Vite 6, TypeScript 5.6, Vitest 2, Redux Saga, MUI 5
- Деревья элементов: `django-tree-queries` (вместо django-mptt)
- DnD списков: `@hello-pangea/dnd`; canvas — `react-dnd` 16
- Распознавание: OpenCV; TensorFlow / Mask R-CNN отключены

## Временно отключено

- Billing / Stripe
- Stream Chat (в UI заглушка)
- Social auth
- Mask R-CNN endpoint

Вернуть отдельными эпиками после cutover на `main`.

## Проверки

```bash
# Backend
cd backend && docker compose exec web python manage.py check
cd backend && docker compose exec web pytest tests/api/test_core_contract.py -q

# Frontend
cd frontend && npm ci && npm run typecheck && npm test && npm run build:production
```

CI: `.github/workflows/ci.yml` (backend + frontend + e2e smoke).

## GitHub

Репозиторий: https://github.com/polyedr/hdspace (private)

Ветка по умолчанию: `main`. Upgrade ведётся в `upgrade/controlled-big-bang`.
