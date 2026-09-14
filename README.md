# Auto Lincoln — адмін-панель каталогу автозапчастин

React 19 + TypeScript + Vite, TanStack Query для серверного стану,
Firebase (Auth + Firestore + Storage) як бекенд.

## Запуск

```bash
npm install
cp .env.example .env.local   # заповнити ключами з Firebase Console
npm run dev                  # http://localhost:5173
```

Щоб увійти, у Firebase Console має бути ввімкнений
**Authentication → Sign-in method → Email/Password** і створений користувач.

## Скрипти

| Команда | Що робить |
| --- | --- |
| `npm run dev` | дев-сервер |
| `npm run build` | перевірка типів + продакшн-збірка |
| `npm run lint` | oxlint |
| `npm run preview` | локальний перегляд зібраного |

## Документація

- [`docs/product.md`](docs/product.md) — що за продукт і які розділи
- [`docs/architecture.md`](docs/architecture.md) — структура `src/`, шари, auth flow
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — специфікація сторінки каталогу
- [`docs/roadmap.md`](docs/roadmap.md) — порядок робіт і технічний борг
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — токени та конвенції UI
- [`CLAUDE.md`](CLAUDE.md) — правила для роботи з Claude Code
