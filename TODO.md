# TODO

План работ по Osnova. Двигаемся сверху вниз; новые задачи добавляем в соответствующий раздел.

## Сейчас (фундамент)

- [x] Инициализировать git, добавить remote
- [x] Зафиксировать правила в `CLAUDE.md`
- [x] Поставить Next 16 + Payload 3 (Postgres) в `app/`
- [x] `docker-compose.yml` для Postgres в корне
- [x] `.env.example` с `DATABASE_URI`, `PAYLOAD_SECRET`
- [x] Поднять `pnpm dev`, `/admin` отдаёт `create-first-user`
- [x] Первый коммит (push в origin — ждёт подтверждения)
- [x] Создать первого пользователя руками через `/admin/create-first-user`

## Следующее (UX админки)

- [x] Доделки русификации:
  - [x] UI Payload — уже русский через `i18n.fallbackLanguage: 'ru'`
  - [x] Русские лейблы у *всех* полей коллекций (`label: '...'` на каждом field)
  - [x] Шаблон письма «забыл пароль» (русский HTML в `Users.auth.forgotPassword`); verify-email не включаем — админ создаёт редакторов сам
  - [x] Решено: второй локали (en) у контента не делаем — коробка только для русскоязычных клиентов (см. CLAUDE.md)
- [x] Минимальный набор коллекций для контентного сайта:
  - [x] `Pages` (title, slug с автогенерацией, status, layout)
  - [x] `Media` (базовая)
  - [x] `Users` с ролями `admin` / `editor`
  - [x] `Settings` (название, описание, контактный email/телефон) — лого осталось на потом
- [x] Базовые блоки контента:
  - [x] Hero (heading, subheading, CTA)
  - [x] RichText (lexical)
  - [x] Image (картинка из Media)
  - [x] Cards (плитки)
- [x] Публичный фронт: главная, страница из коллекции `Pages` (динамический `/[slug]`)
- [x] Превью изменений в админке до публикации (drafts через `versions: { drafts: true }`)

## Дальше (продакт)

- [x] Меню сайта — конструктор в админке (global `MainMenu`, один уровень подменю; шапка `SiteHeader` в `(frontend)/layout.tsx`)
- [x] SEO-поля на страницах (title/description/og)
- [x] Загрузка медиа на диск (local upload), эскизы — `Media.upload.imageSizes` (thumbnail/card/feature/og), focalPoint, adminThumbnail; на фронте через `pickMediaSize`
- [x] Резервная копия БД одной кнопкой — endpoint `/api/backup` (admin-only, `pg_dump` через child_process), ссылка в админке (`afterNavLinks`), плюс `pnpm backup` для cron/CLI
- [x] Сценарий «забыл пароль» через почту — `@payloadcms/email-nodemailer`, условно подключается при `SMTP_HOST` в `.env`; шаблон письма уже русский (`Users.auth.forgotPassword`)
- [x] «Главная» как полноценная `Page` — поле `Settings.homePage` (relationship → pages); фронт `/` рендерит её через `RenderBlocks` с draft+SEO, иначе fallback-экран первой настройки
- [x] `sitemap.xml` (`app/sitemap.ts` — published pages + `/` для homePage) и `robots.txt` (`app/robots.ts` — disallow /admin, /api, /preview)
- [x] Хлебные крошки на страницах — компонент `Breadcrumbs`, на `/[slug]` показывает «Главная / Заголовок»; на homePage не отрисовываются

## Контентные коллекции и брендирование

- [x] Коллекции под универсальный контентный сайт:
  - [x] `Новости` (slug, обложка, excerpt, RichText, SEO, drafts/autosave)
  - [x] `Документы` — uploadable, MIME PDF/DOC(X)/XLS(X)/PPT(X)/ZIP
  - [x] `Сотрудники` — ФИО (фамилия/имя/отчество + виртуальный `fullName` для заголовка), должность, фото, био, контакты, `sortOrder`
- [x] Брендирование сайта:
  - [x] Поле `Settings.logo` — широкий логотип в шапке публичного сайта
  - [x] Поле `Settings.siteIcon` — квадратная иконка, попадает во `favicon` и в угол админки (через `admin.components.graphics.Icon`)
  - [x] Login админки — собственный wordmark Osnova (хардкод, не настраивается клиентом)
- [x] UX-полировка:
  - [x] Первый пользователь через `/admin/create-first-user` автоматически получает роль `admin` (хук `Users.beforeChange`)
  - [x] Формат даты во всей админке — `dd.MM.yyyy HH:mm` (`admin.dateFormat`)
  - [x] Глобал «Главное меню» переименован в «Меню сайта»
  - [x] В блоках Pages кнопка «Добавить Блок» (поле `layout` с `labels.singular/plural`)
  - [x] Контакты в `Settings` помечены как «общие, подтягиваются в блоки и подвал» (готовится под будущие блоки)

## Отложено

### Дорога 1 — упрощённая установка для конечного завуча
*Отложено сознательно — сначала обкатываем UX.* Что туда войдёт:
- [ ] `docker-compose.prod.yml` — postgres + next в одном `up`
- [ ] Скрипт первого запуска: создание схемы, первого админа через интерактивный CLI
- [ ] Инструкция «как поставить на VPS за 15 минут» с реальным таймером
- [ ] Образ собирается под Linux x86_64/arm64

### Идеи на потом
- [ ] Готовые шаблоны страниц (лендинг, новостной сайт, корпоративный сайт) — выбор при первой настройке
- [ ] Импорт из 1С-Битрикс / WordPress
- [ ] Иерархия страниц (parent → child) и многоуровневые хлебные крошки
- [ ] Кнопка бэкапа: спрятать ссылку от non-admin (сейчас видна всем залогиненным, endpoint защищён)
- [ ] Отдельный preview-маршрут для homePage (сейчас превью открывается через slug страницы)
