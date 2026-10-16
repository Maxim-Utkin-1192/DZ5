# Документация Backend — ДЗ5

## Backend + интеграция с Supabase

### 🎯 Цель

Развернуть Backend-инфраструктуру на Supabase, настроить БД с RLS-политиками и интегрировать её с Frontend-приложением.

### 🛠 Инфраструктура

Платформа: Supabase (BaaS — Backend as a Service)  
Регион: West EU (Ireland) — eu-west-1  
URL проекта: https://zwsvbflajqapgpdkcycc.supabase.co

### 🗄 Схема базы данных

#### Таблица profiles (профили пользователей)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | ID (из auth.users) |
| email | text | Email пользователя |
| username | text | Имя пользователя |
| created_at | timestamptz | Дата создания |

#### Таблица characters (созданные персонажи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Уникальный ID |
| user_id | uuid | ID создателя (FK → auth.users) |
| name | text | Имя персонажа |
| status | text | Alive / Dead / unknown |
| species | text | Вид |
| gender | text | Пол |
| image_url | text | URL изображения |
| origin | text | Происхождение |
| location | text | Локация |
| is_public | boolean | Публичный ли персонаж |
| created_at | timestamptz | Дата создания |

#### Таблица favorites (избранное)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Уникальный ID |
| user_id | uuid | ID пользователя (FK) |
| character_api_id | integer | ID персонажа из API |
| character_name | text | Имя персонажа |
| character_image | text | URL изображения |
| created_at | timestamptz | Дата добавления |

#### Таблица analytics_events (аналитика)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Уникальный ID |
| user_id | uuid | ID пользователя (FK) |
| event_type | text | view / search / add / delete |
| entity_type | text | character / episode / page |
| entity_id | text | ID сущности |
| metadata | jsonb | Доп. данные |
| created_at | timestamptz | Дата события |

### 🔐 Row Level Security (RLS)

Для всех таблиц включён RLS. Основные политики:

Пользователи видят только свои созданные персонажи (или публичные):

    create policy "Public characters are viewable by everyone"
    on public.characters for select
    using (is_public = true or auth.uid() = user_id);

Пользователи могут создавать только от своего имени:

    create policy "Users can insert their own characters"
    on public.characters for insert
    with check (auth.uid() = user_id);

Пользователи могут удалять только свои персонажи:

    create policy "Users can delete own characters"
    on public.characters for delete
    using (auth.uid() = user_id);

Избранное — только своё:

    create policy "Users can view own favorites"
    on public.favorites for select using (auth.uid() = user_id);

    create policy "Users can insert own favorites"
    on public.favorites for insert with check (auth.uid() = user_id);

    create policy "Users can delete own favorites"
    on public.favorites for delete using (auth.uid() = user_id);

Аналитика — только своя:

    create policy "Users can view own analytics"
    on public.analytics_events for select using (auth.uid() = user_id);

    create policy "Anyone can insert analytics"
    on public.analytics_events for insert with check (true);

    create policy "Users can delete own analytics"
    on public.analytics_events for delete using (auth.uid() = user_id);

### 🔑 Аутентификация

Используется Supabase Auth с провайдером Email/Password.

Настройки:
- Подтверждение email: отключено (для учебных целей)
- Allow new users to sign up: включено
- Минимальная длина пароля: 6 символов

### 🔌 API Endpoints (используются через Supabase JS)

| Метод | Назначение |
|-------|------------|
| supabase.auth.signUp() | Регистрация |
| supabase.auth.signInWithPassword() | Вход |
| supabase.auth.signOut() | Выход |
| supabase.from('characters').select() | Получение персонажей |
| supabase.from('characters').insert() | Создание персонажа |
| supabase.from('characters').delete() | Удаление персонажа |
| supabase.from('favorites').insert() | Добавление в избранное |
| supabase.from('analytics_events').insert() | Логирование события |

### 📊 Аналитика

Реализованы события:
- view — просмотр детальной страницы персонажа
- search — поиск по имени
- add — добавление в избранное

Статистика отображается на странице /analytics.

### 🚀 Развёртывание

1. Создание проекта в Supabase
2. SQL Editor — выполнение миграций (создание таблиц и политик)
3. Authentication → Providers — включение Email
4. Project Settings → API — копирование URL и Publishable Key
5. Переменные окружения — в .env.local (для локальной разработки) и в Vercel (для продакшена)

### 💡 Особенности реализации

1. Бесплатный тариф Supabase имеет лимиты на отправку email (2 письма в час), поэтому для демонстрации использован обходной путь — создание пользователей через Dashboard.
2. RLS-политики защищают данные пользователей от несанкционированного доступа.
3. analytics_events использует jsonb для гибкого хранения метаданных.

### 🔗 Ссылки

- Supabase Dashboard: https://supabase.com/dashboard/project/zwsvbflajqapgpdkcycc
- API URL: https://zwsvbflajqapgpdkcycc.supabase.co
- Frontend: [ссылка на Vercel]
