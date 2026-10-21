# HDSpace - Полный запуск проекта

> **УСТАРЕЛО (2026-10).** Пути `adevi-backend-django` / старые compose-команды больше не актуальны.
> Смотрите root [README.md](../README.md) и [modernization-plan.md](./modernization-plan.md).

## Быстрый старт (2 терминала)

### Терминал 1: Backend (Docker)

```bash
cd adevi-backend-django
docker-compose up
```

**Доступ:**
- API: http://localhost:18000/api/v1/schema/
- Admin: http://localhost:18000/admin/
- Логин: admin / admin123

---

### Терминал 2: Frontend (локально)

```bash
cd adeviio-frontend
npm run dev
```

**Доступ:**
- Frontend: http://localhost:8080

---

## 📊 Статус проектов:

| Проект | Технология | Порт | Статус |
|--------|-----------|------|--------|
| **Backend** | Django 2.2 + Python 3.6 | 18000 | ✅ Docker |
| **Frontend** | React 17 + Vite | 8080 | ✅ Локально |
| PostgreSQL | 13 | 15432 | ✅ Docker |
| Redis | 6 | 16379 | ✅ Docker |

---

## ⚙️ Ответ на вопрос: нужен ли Docker для фронтенда?

### **НЕТ, для фронтенда Docker НЕ обязателен!**

**Почему:**

✅ **У вас установлен Node.js v22.15.1**
- Фронтенд - это просто файлы HTML/CSS/JS
- Node.js нужен только для dev сервера и сборки
- Vite работает на любой версии Node.js 14+

✅ **Зависимости уже установлены**
- 3000 пакетов установлено
- `npm install` выполнен успешно

✅ **Конфигурация обновлена**
- API настроен на `http://localhost:18000`
- Все готово к работе

### Когда Docker полезен для фронтенда:

🔹 **Production deployment** - одинаковое окружение везде  
🔹 **CI/CD** - автоматизированная сборка  
🔹 **Несколько версий Node.js** - изоляция  
🔹 **Nginx для статики** - production serving  

### Для разработки:

**Локальный запуск быстрее и удобнее!**
- ⚡ Мгновенный HMR (Hot Module Reload)
- 🔧 Легче отлаживать
- 📝 Проще логи
- 🚀 Быстрее старт

---

## 🎯 Рекомендация для SUSE Tumbleweed:

### 1. Backend - Docker ✅
```bash
cd adevi-backend-django
make up  # или docker-compose up
```

**Почему:** 
- Python 3.6 (устаревший)
- TensorFlow 1.15 + ML зависимости
- PostgreSQL + Redis
- Сложная настройка окружения

### 2. Frontend - Локально ✅
```bash
cd adeviio-frontend
npm run dev
```

**Почему:**
- Node.js уже установлен
- Vite очень быстрый
- HMR работает отлично
- Нет сложных зависимостей

---

## 📝 Пошаговая инструкция:

### Шаг 1: Запуск Backend

```bash
# Перейдите в директорию backend
cd /home/admin/Desktop/hspace/hdspace/adevi-backend-django

# Запустите Docker контейнеры
docker-compose up -d

# Проверьте статус
docker-compose ps

# Проверьте API
curl http://localhost:18000/health/
```

**Ожидаемый результат:** `{"status":"ok","database":"connected","redis":"connected"}`

---

### Шаг 2: Запуск Frontend

**Откройте НОВЫЙ терминал:**

```bash
# Перейдите в директорию frontend
cd /home/admin/Desktop/hspace/hdspace/adeviio-frontend

# Запустите dev сервер
npm run dev
```

**Vite запустится и автоматически откроет браузер на http://localhost:8080**

Лог будет примерно такой:
```
  VITE v4.0.4  ready in 1234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## 🌐 Доступ к приложениям:

После запуска откройте в браузере:

1. **Frontend (главное приложение):**
   - http://localhost:8080

2. **Backend API (для разработки):**
   - Swagger: http://localhost:18000/api/v1/schema/
   - Admin: http://localhost:18000/admin/

---

## 🛑 Остановка:

### Backend (Docker):
```bash
cd adevi-backend-django
docker-compose down
```

### Frontend (локально):
- Нажмите `Ctrl+C` в терминале с `npm run dev`

---

## 🔄 Перезапуск при изменениях:

### Backend:
```bash
# После изменений в коде Python
docker-compose restart web

# После изменений в зависимостях
docker-compose build web
docker-compose up -d
```

### Frontend:
- **Автоматически!** Vite перезагрузит страницу при изменениях в коде

---

## 📋 Краткая шпаргалка:

```bash
# BACKEND (в одном терминале)
cd adevi-backend-django
docker-compose up

# FRONTEND (в другом терминале)  
cd adeviio-frontend
npm run dev
```

**Готово! Оба приложения работают!** 🎉

---

## 🆘 Если что-то не работает:

### Backend не отвечает:
```bash
cd adevi-backend-django
docker-compose logs -f web
```

### Frontend не запускается:
```bash
cd adeviio-frontend
# Попробуйте очистить кэш
rm -rf node_modules/.vite
npm run dev
```

### CORS ошибки в браузере:
Backend должен разрешать `localhost:8080` в CORS настройках.
Проверьте что в `adevi-backend-django/.env`:
```
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
```

---

## 🎊 Итог:

**Для разработки на SUSE Tumbleweed:**

- ✅ **Backend** → Docker (уже запущен)
- ✅ **Frontend** → Локально (просто `npm run dev`)

**НЕ НУЖЕН Docker для фронтенда!** 

Просто откройте терминал и выполните:
```bash
cd /home/admin/Desktop/hspace/hdspace/adeviio-frontend
npm run dev
```

**Vite запустится за несколько секунд!** ⚡

См. также: [ЗАПУСК.md](ЗАПУСК.md) для деталей по фронтенду.

