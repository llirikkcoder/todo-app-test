# ToDo Application

Приложение для управления задачами с функционалом администратора.

## Технологии

- **Backend**: Node.js, Express, PostgreSQL, Sequelize
- **Frontend**: React, Redux Toolkit, TypeScript
- **Контейнеризация**: Docker, Docker Compose

## Функциональность

- Просмотр списка задач без авторизации
- Создание новых задач любым пользователем
- Пагинация (по 3 задачи на страницу)
- Сортировка по имени пользователя, email и статусу
- Авторизация администратора (логин: admin, пароль: 123)
- Редактирование и изменение статуса задач администратором
- Защита от XSS атак

## Установка и запуск

### С использованием Docker

```bash
docker-compose up
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Локальная установка

#### Backend
```bash
cd backend
npm install
# Создайте базу данных PostgreSQL "todo_db"
npm run migrate
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /api/tasks` - получение списка задач
- `POST /api/tasks` - создание новой задачи
- `PUT /api/tasks/:id` - обновление задачи (требует авторизации)
- `POST /api/auth/login` - авторизация
- `GET /api/auth/validate` - проверка токена

## Структура проекта

```
todo-app-test/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── styles/
│   │   └── types/
│   └── Dockerfile
└── docker-compose.yml
```