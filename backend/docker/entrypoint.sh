#!/bin/bash

set -e

echo "==================================="
echo "Adevi Backend Django - Starting..."
echo "==================================="

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USER:-adevi_user}" > /dev/null 2>&1; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done
echo "PostgreSQL is up!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! redis-cli -h "${REDIS_HOST:-redis}" -p "${REDIS_PORT:-6379}" ping > /dev/null 2>&1; do
    echo "Redis is unavailable - sleeping"
    sleep 2
done
echo "Redis is up!"

# Create necessary directories
mkdir -p /app/media /app/static /app/collectstatic /app/logs

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput || echo "Migration failed, continuing..."

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear || echo "Collectstatic failed, continuing..."

# Create superuser if needed (only in development)
if [ "$DEBUG" = "True" ] && [ ! -z "$DJANGO_SUPERUSER_EMAIL" ]; then
    echo "Creating superuser..."
    python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='$DJANGO_SUPERUSER_EMAIL').exists():
    User.objects.create_superuser(
        username='$DJANGO_SUPERUSER_USERNAME',
        email='$DJANGO_SUPERUSER_EMAIL',
        password='$DJANGO_SUPERUSER_PASSWORD'
    )
    print('Superuser created!')
else:
    print('Superuser already exists')
END
fi

echo "==================================="
echo "Starting application..."
echo "==================================="

# Execute the main command
exec "$@"

