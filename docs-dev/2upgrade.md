> **УСТАРЕЛО (2026-10).** Controlled big bang выполнен на ветке `upgrade/controlled-big-bang`.
> Актуальный план: [modernization-plan.md](./modernization-plan.md). Актуальный запуск: root [README.md](../README.md).
> Ниже — исторические заметки про старый стек (Python 3.6 / Django 2 / TF1); не использовать для нового окружения.

У меня проект на Python 3.6, Django 2, Tensorflow 1, React 16. Все эти технологии уже не самые новые. Как я его разверну через Docker? 

Ты прав, это довольно старый стек, и сейчас официальные образы многих зависимостей уже не поддерживаются (например, Python 3.6 снят с поддержки, а Tensorflow 1 — сильно устарел). Тем не менее, всё это можно собрать и развернуть через Docker — просто потребуется чуть больше внимания к версиям и совместимости.

Вот пример простого Dockerfile для такого стека (Django backend + Tensorflow 1) — дальше прокомментирую ключевые моменты:

# Используем официальный образ Python 3.6 (он есть в dockerhub, но не поддерживается)
FROM python:3.6-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Создаём рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt /app/

# Устанавливаем pip, если надо
RUN python -m pip install --upgrade pip

# Устанавливаем зависимости (укажи точные версии!)
RUN pip install -r requirements.txt

# Копируем исходники
COPY . /app

# Открываем порт (например, 8000 для Django)
EXPOSE 8000

# Команда запуска сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

requirements.txt (пример):

Django==2.2
djangorestframework==3.9
tensorflow==1.15
psycopg2-binary==2.8
# ...твои другие зависимости
Ключевые моменты:
Python 3.6: Используй python:3.6-slim (он есть на Docker Hub, но если вдруг снимут — нужно будет искать или собирать свой образ).
Tensorflow 1: Только версии до 1.15 совместимы с Python 3.6. В requirements укажи явно нужную версию.
Django 2: Лучше использовать 2.2.x — это последний LTS в ветке 2.x.
Node/React (frontend): Frontend лучше запускать отдельным контейнером. Для старого React 16 можешь использовать официальный node-образ версии 12 или 14 (современные могут не работать с legacy-dependencies).
Пример Dockerfile для React 16:
FROM node:14

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
Сборка и запуск через docker-compose

docker-compose.yml:

version: '3.8'

services:
  backend:
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=myproject.settings
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"

  db:
    image: postgres:12
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
    ports:
      - "5432:5432"
Итог:
Всё реально поднять, главное — четко зафиксировать версии зависимостей.
Проверь локально, что все модули корректно ставятся под старую версию Python.
Если какие-то образы пропадут с Docker Hub — ищи форки или собирай из исходников.
Если Tensorflow не будет собираться из-за отсутствия колес под твой python-образ, попробуй использовать более «толстый» базовый образ (python:3.6, а не slim), либо предварительно собери whl под нужную ОС.

Если хочешь, могу расписать более детально под твой проект — структуру, env-переменные, деплой на сервер и т.д. Скажи, что именно интересно или с чем возникнут трудности.

Thought for 9s

Коротко: даже с самым умным IDE (Cursor, JetBrains AI, Copilot и т.п.) «мгновенно поднять всё одним махом» почти всегда обернётся длинной отладкой. Cursor ускорит рутинищу (правки, кодемоды, рефакторы, поиск несовместимостей), но стратегию лучше оставить пошаговой. Монорепа может помочь с процессом и CI, но сама по себе миграцию не «магически» упростит.

Вот как я бы делал с Cursor “на максималках”, но безопасно и быстро.

1) Монорепа — да или нет?

Можно, но не обязательно.
Когда помогает:

единые версии линтеров/форматеров, общие хуки, один CI пайплайн;
общие интерфейсы между фронтом/беком (генерация API-клиента из OpenAPI/Swagger);
удобные рефакторы “на всё дерево”.

Минусы:

настройка workspace-менеджера (pnpm/yarn) + Python-менеджера (poetry/uv/pip-tools);
потребуется аккуратная изоляция окружений.

Компромиссная структура (если решишься):

repo/
  backend/               # Django, DRF
    pyproject.toml|poetry.lock  (или requirements.in/.txt)
    manage.py
    app/ ...
  ml_service/            # (опционально) отделить TensorFlow-часть
    ...
  frontend/              # React
    package.json
  infra/
    docker/
    compose.yml
  tools/
    pre-commit-config.yaml
    openapi/             # схемы + генерация клиентов

Для Node — pnpm workspaces, для Python — poetry или uv (современный быстрый менеджер). Это не мешает поэтапно апгрейдить.

2) Почему «разом через Cursor» — рискованно

Big-bang обновление (Python 3.12, Django 4/5, DRF, React 18, Webpack→Vite и т.д.) приводит к:

каскаду несовместимостей зависимостей;
разрыву в миграциях Django;
«тихим» изменениям поведения DRF (аутентификация, пагинация, сериалайзеры);
массовым правкам, которые сложно ревьюить и тестировать.

Cursor действительно помогает переписать код быстро, но он не решит автоматически проблемы совместимости зависимостей и поведение рантайма.

3) Рекомендуемая пошаговая стратегия (с участием Cursor)
Этап A. Подготовка
Заморозь базу: теги/ветки legacy/py36-dj2.
Минимальные тесты: хотя бы smoke (healthcheck, пара API-эндпоинтов, критичные бизнес-флоу).
Линтеры и автоисправления: ruff + black (Python), eslint + prettier (JS).
Pre-commit для всего репо.

В Cursor: попроси “Add and configure ruff, black, pre-commit for backend; eslint+prettier for frontend; create pre-commit hooks. Don’t touch business code yet.”

Этап B. Python сначала, без обновления Django
Подними на Python 3.7/3.8 (максимум, который комфортен для Django 2.2).
Запусти pyupgrade и django-upgrade только с безопасными правилами (без автозамены API, меняющих поведение).

В Cursor: “Run pyupgrade and django-upgrade safe transforms across backend. Show diff per file. Exclude settings, migrations unless trivial.”

Этап C. Django 2.2 → 3.2 LTS
Пройди по релиз-нотам (middleware, URLs: url()→path(), удалённые deprecations).
Исправляй по валящимся тестам/логам.
Обнови совместимые версии DRF минимально необходимые под Django 3.2.
Зафиксируй рабочее состояние, теги, образ в Docker Registry.

В Cursor: “Scan for Django 3.x breaking changes: middleware, URLConf, on_delete, force_text→force_str, ugettext→gettext. Propose patches with references to release notes.”

Этап D. Django 3.2 → 4.2 LTS (или 5.x, если готов)
Повтори цикл: релиз-ноты → автоправки → тесты → ручные фиксы.
Обнови DRF до 3.14+.
Внеди ruff-правила «modernize-py3**» для Python 3.10+ синтаксиса, но не меняй поведение.
Этап E. Python 3.12
Теперь поднимай базовый образ до 3.12.
Гони тесты, фикси оставшиеся несовместимости (логгеры, импортирование, typing).
Этап F. TensorFlow
Лучше отделить TF1 в отдельный сервис (ml_service) и стабилизировать API контракты (gRPC/REST).
Параллельно планируй миграцию TF1→TF2/PyTorch в отдельной ветке (это другая миграция по сути).
4) Как выжать максимум из Cursor (практика)

Гарды/правила при работе с ИИ-рефакторами:

Всегда проси план и diff, а не “сделай и сохрани”.
Запрещай менять migrations/, settings.py, конфиги докера без explainer.
Проси ссылки на релиз-ноты, когда предлагается «ломающий» фикс.
Запускай Cursor-команды «батчами по каталогам», не по всему репо.

Полезные задачи для Cursor:

“Add typing hints where obvious, keep runtime behavior identical.”
“Replace deprecated Django utils (ugettext, force_text) safely; show mapping.”
“Run code search for X, list all occurrences and suggest safe replacements.”
“Write pytest smoke tests for endpoints A/B/C using existing views/routers.”
“Generate OpenAPI schema from DRF and create TS client in frontend.”
5) Frontend (React 16 → 18) — тоже по шагам
Обнови Node до LTS (18/20) и менеджер пакетов (pnpm).
Почини линтеры/типизацию, обнови React и ключевые экосистемные пакеты минимально.
Если на Webpack — сначала оживи сборку на текущем стеке; миграцию на Vite/Next делай отдельным этапом.
Пройди codemods (React), но только безопасные (deprecated lifecycle → hooks, если очевидно).

В Cursor: “Run react-codemod for deprecated lifecycles, don’t change business logic; create a checklist of breaking deps in package.json with proposed versions and links.”

6) Docker/CI — чтобы всё не сломать

Dockerfile (backend) с матрицей Python:

# аргумент для гибкости
ARG PY_VER=3.12
FROM python:${PY_VER}-slim

WORKDIR /app
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*
COPY pyproject.toml poetry.lock ./  # или requirements.in/.txt
# poetry/uv/pip-tools — выбери один подход и зафиксируй
RUN pip install -U pip && pip install uv
RUN uv pip install -r requirements.txt  # либо uv pip sync, либо poetry install

COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CI (GitHub Actions/GitLab):

Матрица по Python: 3.8 → 3.12 (на ранних этапах ловим несовместимости).
Джобы: lint → tests → build images → smoke-e2e.
Каждому этапу миграции — свой тег/релиз.
7) «Быстрый трек» (если очень хочется ускорить)
Перевести на Django 3.2 LTS + Python 3.8 (минимум входной боли).
Обновить DRF до совместимой версии, пройти тесты.
Перейти на 4.2 LTS.
Затем одним шагом — Python 3.12.
TF вынести в отдельный сервис; мигрировать уже отдельно.

Это в 3–5 итераций, а не в 20, и всё ещё контролируемо.

Вывод
Cursor — ускоритель, а не «магическая кнопка». Он отлично справится с массовыми правками, подсказками и кодемодами, но стратегия остаётся поэтапной.
Монорепа полезна, но не обязательна. Если вводить — делай это до миграций, чтобы сразу настроить общие инструменты и CI.
Делай маленькие PR, фиксируй рабочие состояния тегами/образами, держи TF отдельно.

Если хочешь, скидывай requirements.txt/pyproject.toml и ключевые package.json — накидаю конкретную матрицу версий «сейчас → целевые» и подсказки, какие пакеты ломают путь на 3.12/Django 4.2.

а без монорепы можно, но чтобы cursor видел бэкенд и фронтенд одновременно?
Thought for 9s

Да, можно. Cursor видит всю открытую рабочую папку. Значит, достаточно открыть родительский каталог, в котором лежат оба репозитория, — и он будет «понимать» бек и фронт одновременно (без монорепы и без склейки гитов).

Вот быстрый рецепт:

Как открыть два репо разом
Создай «контейнерную» папку и положи туда оба репозитория как соседние директории:
projects/
  backend/   # отдельный git-репозиторий (Django/DRF)
  frontend/  # отдельный git-репозиторий (React)
В Cursor: File → Open… и выбери projects/ (верхний уровень).
Cursor проиндексирует оба проекта и будет давать подсказки/поиск по всему дереву.
Git по-прежнему отдельный в каждой папке (projects/backend/.git, projects/frontend/.git).

Аналог VS Code «multi-root workspace»: просто открываешь общий верхний каталог.

Что настроить, чтобы Cursor работал комфортно
1) Исключи мусор из контекста

В корне projects/ добавь .cursorignore:

**/node_modules/**
**/.next/**
**/dist/**
**/build/**
**/.venv/**
**/__pycache__/**
**/.pytest_cache/**
**/migrations/**  # опционально, если шумят
**/.git/**
2) Дай ИИ правильные правила

В корне projects/ добавь .cursorrules (или в каждом репо — оба работают):

# Короткое описание, чтобы ИИ знал границы ответственности
- rule: |
    You are working with two separate repositories in one workspace:
    - backend/: Django/DRF API, Python>=3.8 target, Docker.
    - frontend/: React app, Node 18/20, pnpm.
    Keep changes repo-local unless explicitly asked to coordinate both sides.

Можно дописать гайды по стилю, версии Python/Node, запреты править миграции без причины и т.п.

3) Положи опорные документы

В корень projects/:

ARCHITECTURE.md — краткая схема сервисов и потока данных.
API_CONTRACT.md — ссылка на OpenAPI/Swagger (или сама схема).
Cursor сможет «читать» контракт и помогать генерить код клиента/сервера.
4) Пины контекста при больших задачах

Когда просишь Cursor сделать сквозную правку (например, добавить поле в API и использовать его на фронте):

В чате нажми “+ Add files” и прикрепи конкретные файлы: DRF-serializer, view/endpoint, openapi.yaml, фронтовой API-клиент, компонент.
Попроси: «Сначала обнови backend (serializer, view, schema), затем сгенерируй клиенты и используй их в frontend/...».
Это резко повышает точность изменений.
Как жить без монорепы, но при этом не страдать
Docker Compose в отдельной папке infra/ (можно третьим соседним каталогом) с путями на ../backend и ../frontend. Cursor будет видеть и infra/, и код.
OpenAPI first: генерируй фронтовый клиент из схемы (drf-spectacular/ drf-yasg → openapi → генерация TS клиента). Cursor легко автоматизирует обновление клиента после правок API.
Отдельные CI пайплайны остаются в каждом репо. Если нужно — добавь в обоих reusable workflow (GitHub Actions) или просто одинаковые джобы.
Синхронизация версий: Renovate в каждом репо (или общий конфиг-preset в отдельном repo).
Типовой рабочий процесс с Cursor (кросс-репо)
Обновить API в backend: правки в сериалайзере/вью/urls + реген OpenAPI.
Сгенерить фронтовый клиент из схемы (скрипт в frontend/package.json).
Использовать новое поле в компоненте фронта.
Прогнать локально: docker compose up из infra/ или два терминала.
Два коммита/два PR — по одному в каждый репозиторий.

В Cursor проси явные шаги: «Сначала backend (покажи diff), затем фронт (покажи diff). Не коммить автоматически».

Мини-FAQ

Можно ли делать «глобальный поиск» по обоим репо?
Да — открытая папка projects/ даёт общий поиск/индекс.

Cursor перепутает гит?
Нет. Каждый репозиторий со своим .git. В Source Control увидишь два раздела (или переключение). Коммитишь там, где менял файлы.

А если репозитории лежат в разных местах диска?
Лучше сделать «зонтичную» папку и положить туда два чек-аута (или использовать git submodules/symlink). Главное — открыть один общий корень.

Коротко: монорепа не обязательна. Открой общий родительский каталог — и Cursor будет «видеть» бек и фронт вместе. Добавь .cursorignore, .cursorrules, опорные MD-файлы и пинь нужные файлы в чат — так ИИ будет работать максимально точно, не расползаясь по лишнему коду.

Sat, Nov 1 at 6:07 PM
Только развернул hdspace бэкенд и фронтенд, кросс-репо.
Как их проверить?
Потом, наверное, наборы тестов добавлять - сразу это делать? Сейчас очень мало тестов, и на бэкенде, и на фронтенде. Из бэкенда ML модели (Tensorflow 1.15) собираюсь вынести в отдельное приложение, когда?
Дальше предстоит поднимать версии Django, Python для бэкенда.
React.js для фронтенда.
Дописывать фичи, которые не были доработаны.
Добавлять фичи с нуля.
Thought for 12s

Круто, что всё уже поднялось кросс-репо. Предлагаю короткий, практичный план: сначала «дышит/не дышит», потом минимальные тесты, затем вынос ML, и уже после — апгрейды и фичи.

1) Быстрые проверки прямо сейчас (smoke)

Backend

docker compose ps — все контейнеры up/healthy.

Healthchecks: добавь /healthz и /readiness (DB ping + миграции применены).

curl -f http://localhost:8000/healthz
curl -f http://localhost:8000/readiness

Миграции/статика:

docker compose exec backend python manage.py migrate --check
docker compose exec backend python manage.py check --deploy
OpenAPI/Swagger доступен (drf-spectacular или drf-yasg) и открывается.

Frontend

Страница / открывается, основная навигация кликается без ошибок в консоли.
ENV переменные фронта корректно указывают на backend API (проверь CORS).

Интеграция

Минимальный end-to-end: фронт → один реальный API-эндпоинт → валидный ответ.
Логи без exception-шторма (backend stdout/stderr).
2) Добавляем «минимальный набор тестов» (сразу, не откладывая)

Backend (pytest)

tests/smoke/test_health.py — /healthz и /readiness → 200 + структура JSON.
tests/smoke/test_db.py — простейший ORM запрос к критической модели.

tests/api/test_example.py — один «бизнес-эндпоинт» happy-path.

def test_healthz(client): 
    r = client.get("/healthz"); assert r.status_code == 200

Frontend (Playwright)

tests/e2e/smoke.spec.ts — открывается главная, виден ключевой элемент, один запрос к API (можно мокнуть).

test('home loads', async ({ page }) => {
  await page.goto(process.env.FRONTEND_URL!);
  await expect(page.getByText('HD Space')).toBeVisible();
});

Запуск в CI (минимум)

Джобы: lint → backend pytest → frontend playwright.
Артефакты: HTML-репорты тестов.
3) Наблюдаемость
Логи по уровням + корреляция запросов (request id).
Простой метрики-пинг (кол-во 5xx, latency p95). Даже без прометеуса — логируй.
Опционально: error tracking (Sentry/аналог) — прямо сейчас это окупится.
4) Когда выносить ML (TF 1.15) в отдельный сервис

Сразу после smoke-стабилизации и минимальных тестов, но до апгрейда Django/Python. Так ты развяжешь контуры:

Выдели интерфейс: OpenAPI или gRPC (я бы начал с REST JSON).
В backend сделай адаптер (backend → ml_service), оставь старую реализацию под фича-флагом.
Запусти shadow mode: параллельно шли запрос в новый сервис, сравнивай ответы в логах.
Когда метрика расхождений ок — переключи трафик на сервис, старую реализацию выключи.
Зафиксируй версии моделей/артефактов (папка models/ + checksum; позже — артефакт-хранилище).
5) Порядок апгрейдов (backend)
Python 3.8 + Django 3.2 LTS (минимум боли).
– починить deprecations, пройти тесты.
DRF → 3.14+ (совместимо с 3.2).
Django 4.2 LTS (или 5.x).
Python 3.12 (последним шагом).
На каждом шаге: маленькие PR, теги, образы. Тесты зелёные — едем дальше.
6) Порядок апгрейдов (frontend)
Node до LTS (18/20) + pnpm/yarn lock обновить.
React 16 → 17 → 18 (по возможности одним шагом, но через codemods).
Сборка: оставь текущий бандлер; миграцию на Vite/Next — отдельным этапом.
Мини-E2E на ключевые флоу + контрактные тесты к API-клиенту (генерируй из OpenAPI).
7) Параллель фич/рефакторинга
Фича-флаги (на бек/фронте), чтобы выпускать неполные фичи безопасно.
«Маленькие PR» + «release train» раз в N дней.
Для «доделок» старых фич: сначала довести до прод-уровня покрытием smoke, потом расширять.
8) Мини-чек-лист на ближайшие шаги
 Healthchecks, readiness, OpenAPI на бекенде.
 Smoke-тесты: backend (pytest), frontend (Playwright).
 CI с тремя джобами (lint/test бек, lint/test фронт).
 Логи + request id + базовые метрики ошибок.
 Спека API для ML и каркас ml_service + shadow mode.
 Апгрейд: Py3.8 + Django 3.2 → DRF 3.14 → Django 4.2 → Py3.12.
 React апгрейд и e2e на критичные сценарии.
 Фича-флаги для незавершённых задач.

Если хочешь, накину шаблоны health-view для Django, pytest/Playwright конфиги и пример адаптера к ml_service под твой текущий код — скажи, где у тебя основные эндпоинты и как сейчас дергается модель.
