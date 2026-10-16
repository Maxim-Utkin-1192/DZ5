# Rick & Morty Portal

Веб-приложение для просмотра, поиска и создания персонажей вселенной Rick and Morty. Проект выполнен на React + Vite с интеграцией Supabase (Auth + Database) и внешнего Rick and Morty API.

## 🚀 Функционал

- 🔍 Просмотр персонажей из Rick and Morty API с пагинацией
- 🔎 Поиск по имени (по API и по созданным пользователями персонажам)
- 📄 Пагинация (по 20 персонажей на страницу)
- ⭐ Добавление персонажей в избранное (с сохранением в Supabase)
- 👤 Детальная страница персонажа (с эпизодами)
- ➕ Создание собственных персонажей (сохранение в БД)
- 📊 Аналитика (просмотры, поиски, добавления)
- 🗑 Управление данными (очистка истории, избранного, созданных персонажей)
- 🔐 Регистрация и вход через Supabase Auth
- 📱 Адаптивный дизайн (Tailwind CSS)

## 🛠 Стек технологий

| Технология | Назначение |
|------------|------------|
| React 18 | UI-фреймворк |
| Vite 4 | Сборщик |
| React Router 6 | Маршрутизация |
| Tailwind CSS 3 | Стилизация |
| Supabase | Backend (Auth + DB) |
| Rick and Morty API | Внешний источник данных |
| Vitest | Тесты (для Node.js 18+) |
| JavaScript (ES6+) | Логика приложения |

## 📁 Структура проекта

rick-and-morty-portal/
├── src/
│   ├── api/
│   │   ├── supabaseClient.js
│   │   ├── rickAndMortyApi.js
│   │   └── dbApi.js
│   ├── components/
│   │   └── CharacterCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── CharactersPage.jsx
│   │   ├── CharacterDetailPage.jsx
│   │   ├── AddCharacterPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── test/
│   │   ├── CharacterCard.test.jsx
│   │   ├── LoginPage.test.jsx
│   │   └── rickAndMortyApi.test.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests.html
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js

## ⚙️ Установка и запуск

### Требования
- Node.js 16+ (для Windows 8.1 — максимум Node.js 16.20.2)
- npm 8+
- Аккаунт Supabase

### Шаги

1. Клонируйте репозиторий:
   git clone https://github.com/ВАШ_ЛОГИН/DZ5.git
   cd DZ5

2. Установите зависимости:
   npm install

3. Создайте `.env.local` в корне проекта:
   VITE_SUPABASE_URL=https://ваш-проект.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=ваш_публичный_ключ

4. Запустите dev-сервер:
   npm run dev

5. Откройте в браузере: http://localhost:3000

## 🔑 Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_SUPABASE_URL` | URL проекта Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Публичный ключ Supabase |

## 🧪 Тестирование

### Вариант 1: Vitest (требует Node.js 18+)

    npm run test:run

### Вариант 2: Браузерные тесты (для Node.js 16)

Откройте `tests.html` в браузере — 28 тестов на чистом JavaScript, которые проверяют ключевую логику приложения.

## 🌐 Деплой

Приложение задеплоено на Vercel: [ссылка на Vercel]

## 📄 Документация

- [development_report.md](./development_report.md) — отчёт о разработке
- [backend_documentation.md](./backend_documentation.md) — документация по Supabase

## 👤 Автор

**Максим Уткин**  
Студент КАИ, 4 курс  
GitHub: [@Maxim-Utkin-1192](https://github.com/Maxim-Utkin-1192)
