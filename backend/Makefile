.PHONY: help build up down restart logs shell migrate collectstatic createsuperuser test clean

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Собрать Docker образы
	docker-compose build

up: ## Запустить все контейнеры
	docker-compose up -d
	@echo "Приложение доступно на http://localhost:8000"
	@echo "Swagger API: http://localhost:8000/api/v1/schema/"

down: ## Остановить и удалить контейнеры
	docker-compose down

restart: ## Перезапустить контейнеры
	docker-compose restart

stop: ## Остановить контейнеры
	docker-compose stop

logs: ## Просмотр логов (Ctrl+C для выхода)
	docker-compose logs -f

logs-web: ## Просмотр логов web
	docker-compose logs -f web

logs-celery: ## Просмотр логов celery
	docker-compose logs -f celery_worker

shell: ## Django shell
	docker-compose exec web python manage.py shell

bash: ## Bash в контейнере web
	docker-compose exec web bash

dbshell: ## PostgreSQL shell
	docker-compose exec db psql -U adevi_user -d adevi_db

migrate: ## Применить миграции
	docker-compose exec web python manage.py migrate

makemigrations: ## Создать миграции
	docker-compose exec web python manage.py makemigrations

collectstatic: ## Собрать статические файлы
	docker-compose exec web python manage.py collectstatic --noinput

createsuperuser: ## Создать суперпользователя
	docker-compose exec web python manage.py createsuperuser

test: ## Запустить тесты
	docker-compose exec web pytest

test-cov: ## Запустить тесты с coverage
	docker-compose exec web pytest --cov=apps --cov-report=html

check: ## Проверка Django
	docker-compose exec web python manage.py check

ps: ## Статус контейнеров
	docker-compose ps

clean: ## Удалить контейнеры и volumes (ОСТОРОЖНО: удалит БД!)
	docker-compose down -v

rebuild: ## Пересобрать и перезапустить
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

redis-cli: ## Redis CLI
	docker-compose exec redis redis-cli

redis-flush: ## Очистить Redis кэш
	docker-compose exec redis redis-cli FLUSHALL

backup-db: ## Backup базы данных
	docker-compose exec db pg_dump -U adevi_user adevi_db > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup создан: backup_$$(date +%Y%m%d_%H%M%S).sql"

init: build up migrate collectstatic ## Инициализация проекта (первый запуск)
	@echo ""
	@echo "Инициализация завершена!"
	@echo "Создайте суперпользователя: make createsuperuser"
	@echo "Откройте: http://localhost:8000/api/v1/schema/"

