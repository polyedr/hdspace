# HDSpace

Визуальный конструктор сайтов (Adevi). Один репозиторий: Django API + React-редактор.

```
backend/    Django 2.2 + DRF, PostgreSQL, Redis, Celery
frontend/   React 17 + TypeScript + Vite
```

История Bitbucket сохранена: коммиты бэкенда живут в `backend/`, фронтенда — в `frontend/`.
Ветка `archive/mlnew` — снимок ML-ветки (Mask R-CNN, декабрь 2022). Для обычной работы не нужна.

## Что нужно локально (не в git)

Скопируйте с флешки / со старой машины:

| Файл | Зачем |
|------|--------|
| `backend/.env` | секреты, порты, БД |
| `backend/gkeys/*.json` | Google Vision, только если нужен OCR/импорт |
| `backend/apps/virtualize_simple/mask_rcnn/trained_models/*.h5` | Mask R-CNN, только если поднимаете распознавание скриншотов (~513 МБ) |

Шаблон env: `backend/env.example`. Скопируйте в `backend/.env` и поправьте значения.

Конструктор (проекты, экраны, ручное редактирование) работает **без** `.h5` и без Google-ключей.

## Запуск

Порты в текущем `.env`: API `18000`, Postgres `15432`, Redis `16379`, фронт `8080`.

```bash
# Backend
cd backend
cp env.example .env   # если ещё нет своего .env
docker compose up --build

# Frontend (другой терминал)
cd frontend
npm install
npm run dev
```

- API / Swagger: http://localhost:18000/api/v1/schema/
- Health: http://localhost:18000/health/
- Admin: http://localhost:18000/admin/
- Редактор: http://localhost:8080

Фронт ходит в `http://localhost:18000` (`frontend/src/config/settings.ts`).

## Стек

- Backend: Python 3.6, Django 2.2, DRF, PostgreSQL 13, Redis, Celery
- Frontend: React 17, Vite 4, Redux Saga, MUI 5
- ML (опционально): TensorFlow 1.x, Mask R-CNN в `backend/apps/virtualize_simple`

## GitHub

Репозиторий: https://github.com/polyedr/hdspace (private)

Ветка по умолчанию: `main`.
