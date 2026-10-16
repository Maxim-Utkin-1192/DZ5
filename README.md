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
│ ├── api/
│ │ ├── supabaseClient.js # Клиент Supabase
│ │ ├── rickAndMortyApi.js # API Rick and Morty
│ │ └── dbApi.js # Работа с БД Supabase
│ ├── components/
│ │ └── CharacterCard.jsx # Карточка персонажа
│ ├── context/
│ │ └── AuthContext.jsx # Контекст авторизации
│ ├── pages/
│ │ ├── CharactersPage.jsx # Список персонажей
│ │ ├── CharacterDetailPage.jsx # Детали персонажа
│ │ ├── AddCharacterPage.jsx # Создание персонажа
│ │ ├── AnalyticsPage.jsx # Аналитика
│ │ ├── LoginPage.jsx # Вход
│ │ └── RegisterPage.jsx # Регистрация
│ ├── test/
│ │ ├── CharacterCard.test.jsx
│ │ ├── LoginPage.test.jsx
│ │ └── rickAndMortyApi.test.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── tests.html # Тесты на чистом JS (для Windows 8.1)
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

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/Maxim-Utkin-1192/DZ5.git
   cd DZ5
