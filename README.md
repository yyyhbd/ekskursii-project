# Ekskursii.by — вёрстка страницы «Тысячелетний Брест»

Адаптивная вёрстка лендинга экскурсии на HTML5 + SCSS + нативном JS, собранная через Vite.

## Стек
- HTML5 (семантические теги: `header`, `main`, `section`, `footer`, `nav`, `article`, `time`)
- SCSS (структура по типу 7-1, упрощённая: abstracts / base / components / layout / sections)
- JavaScript без фреймворков и jQuery
- [Flatpickr](https://flatpickr.js.org/) — календарь для полей «Дата с / Дата по»
- Vite — сборка и дев-сервер

## Структура проекта
```
project/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── styles/
│   │   ├── main.scss           # точка входа, собирает все партиалы
│   │   ├── abstracts/          # переменные, миксины (медиазапросы)
│   │   ├── base/                # reset, базовые стили body/container
│   │   ├── components/          # button, card, review-card
│   │   ├── layout/               # header, footer
│   │   └── sections/            # hero, schedule, reviews
│   ├── scripts/
│   │   └── main.js              # вся интерактивность
│   └── assets/
│       └── images/              # логотип, фон hero, аватары отзывов
```

## Запуск проекта

```bash
# 1. Клонировать репозиторий на устройство
git clone https://github.com/yyyhbd/ekskursii-project.git

# Перейти в созданную папку проекта
cd ekskursii-project

# 2. Установить все необходимые зависимости (требуется установленный Node.js)
npm install

# 3. Запустить локальный сервер разработки (с поддержкой горячей перезагрузки)
npm run dev

# 4. Собрать проект для продакшена (опционально)
npm run build

