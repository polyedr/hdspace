# Контролируемый big bang HDSpace

## Решение

Применяем **controlled big bang**: отдельная upgrade-ветка, один финальный переход без поддержки старой БД/API, но не один гигантский непроверяемый diff. После каждой внутренней фазы проект обязан запускаться и проходить свой набор проверок.

Целевая первая версия (cutover):

- Backend: Python 3.12, Django 5.2 LTS, DRF 3.16, Celery 5.x, PostgreSQL 16, Redis 7, `psycopg` 3.
- Frontend: Node 22+, React 18.3, TypeScript 5.6+, Vite 6, Vitest 2+.
- Core scope: auth, проекты, экраны, сценарии, элементы, редактор, import/export.
- Временно отключено: billing/Stripe, Stream Chat, social auth, старый Mask R-CNN.
- Не входит в первый cutover: React 19, Python 3.13, замена Redux Saga, полная унификация rich-text.

## Фазы

1. Baseline CI — core API contract, characterization tests, Playwright smoke, единый CI.
2. Backend big bang — Django 5.2, новая baseline-схема БД, `django-tree-queries` вместо mptt.
3. Frontend toolchain — lockfile без `--legacy-peer-deps`, typecheck, Vite 6 / Vitest 2 / TS 5.6.
4. Frontend framework — React 18.3, Router 6 (`redux-first-history`), `@hello-pangea/dnd`, MUI 5 актуальных патчей.
5. Интеграция и cutover — пустая среда, admin, CI/e2e, rollback через git tag + Docker volumes.
6. Документация — этот файл, README, пометка устаревших гайдов.

## Rollback

- Предыдущий git tag / ветка до upgrade.
- Старые Docker volumes.
- Схемы БД не совмещаются: только полный откат стека, без data migration со старой схемы.

## Статус cutover (ветка `upgrade/controlled-big-bang`)

- Backend: Django 5.2 / Python 3.12, baseline-миграции, health + core contract зелёные.
- Frontend: `npm ci` без `--legacy-peer-deps`, `tsc` / unit tests / production build зелёные.
- Rollback tags: `baseline/pre-upgrade-docker`, `pre-modern-main`.
- Ручной чеклист после merge в `main`: login → create/open project → edit/save screen → drag/drop → export; soak web/Celery.

## После cutover (отдельные эпики)

1. Social auth на актуальных SDK.
2. Chat на актуальном SDK.
3. Billing/Stripe.
4. Новая CV/ML-система вместо Mask R-CNN.
