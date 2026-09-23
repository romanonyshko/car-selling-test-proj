# Чекліст міграції

Позначки: `[x]` зроблено і перевірено, `[ ]` не зроблено, `[~]` зроблено
частково (пояснення поруч).

## Етап 0 — план
- [x] Прочитано `CLAUDE.md`, `docs/architecture.md`, `docs/roadmap.md`,
      `docs/open-questions.md`
- [x] Знайдено всі імпорти `@auto-lincoln/*` (23 файли)
- [x] `docs/migration/plan.md`
- [x] `docs/migration/checklist.md`
- [x] `docs/migration/rollback.md`
- [x] `docs/migration/contracts-api.md`
- [x] Рішення власника: web — варіант B
- [x] Рішення власника: Docker — варіант a + `name: auto-lincoln`
- [x] "далі" від власника

## Етап 1 — auto-lincoln-contracts
- [x] Папка створена, `src/{shared,auth,db}` скопійовано з `packages/*/src`
- [x] `package.json`: `@auto-lincoln/contracts`, `exports` `.`/`./auth`/`./db`,
      залежності з тими самими діапазонами
- [x] `tsconfig.json` (noEmit, type-check) + `tsconfig.build.json` (src → dist)
- [x] Внутрішні імпорти відносні (`auth/session.ts`, `prisma/seed.ts`)
- [x] `prisma/schema.prisma` (output → `../src/db/generated/prisma`),
      `migrations/`, `seed.ts`, `prisma.config.ts`
- [x] `docker-compose.yml` (+ `name: auto-lincoln`), `.env.example`, `.gitignore`
- [x] `README.md`: міграції — ТІЛЬКИ звідси
- [x] `npm install`; версії звірено з lock-файлом test-pr (209/209; oxlint,
      @types/node, tsx спершу приїхали новішими — повернуто до версій test-pr)
- [x] `npm run build` без помилок; `typecheck` і `lint` — exit 0
- [x] `dist/shared` не містить Node-залежностей (grep `node:`, `jose`, `@prisma`)
- [x] Prisma-клієнт згенеровано (`src/db/generated/prisma`, `dist/db/generated`)
- [x] Старий контейнер test-pr зупинено (`down` без `-v`, volume
      `test-pr_postgres-data` лишився); нова база `auto-lincoln`,
      `migrate deploy` + `seed` пройшли
- [x] "далі"

## Етап 2 — auto-lincoln-api-express
- [x] `src/` скопійовано з `apps/api-express/src`
- [x] `package.json` (одна залежність `file:../auto-lincoln-contracts`),
      `tsconfig.json`, `.env.example` (PORT=3001, DATABASE_URL, JWT_SECRET),
      `.env` скопійовано, `.gitignore`, `.oxlintrc.json`
- [x] 12 імпортів замінено за таблицею (інших змін у `src/` немає)
- [x] `npm install`; версії звірено (132/132; oxlint, @types/node, tsx
      повернуто до версій test-pr)
- [x] `npm run build` (tsc) і `oxlint` — exit 0; `dist/*.js` відрізняються
      від старих тільки специфікаторами імпорту
- [x] Запуск на 3001 (`npm run dev`)
- [x] curl `GET /api/health` → 200
- [x] curl `POST /api/auth/login` → 200 + `Set-Cookie: al_session=…; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax`
- [x] curl `GET /api/auth/me` з cookie → 200 `AuthUser`
- [x] curl `POST /api/auth/logout` → 204, cookie очищено; `me` після → 401
- [x] Еталон помилок (400/401/404) знято для порівняння з nest
- [x] "далі"

## Етап 3 — auto-lincoln-api-nest
- [x] `src/`, `nest-cli.json` скопійовано з `apps/api-nest`
- [x] `package.json`, `tsconfig.json` (decorators), `.env.example` (PORT=3002),
      `.env`, `.gitignore`, `.oxlintrc.json`
- [x] 13 імпортів замінено; `import type` у декорованих параметрах і
      `@HttpCode` збережено
- [x] `npm install`; версії звірено (217/217; NestJS 12.1.0 → 12.0.3 та ще
      8 пакетів повернуто до версій test-pr)
- [x] `nest build` і `oxlint` — exit 0; `dist/*.js` відрізняються від старих
      тільки специфікаторами імпорту
- [x] Запуск на 3002, ті самі curl: health 200, login 200 + Set-Cookie,
      me 200, logout 204
- [~] Статуси, значення полів і Set-Cookie збігаються з express у 14 кейсах;
      **байт у байт — ні**: у тілах помилок nest порядок ключів
      `message, error, statusCode`, express — `message, statusCode, error`.
      Розбіжність існувала і в монорепо (старий код на 4001/4002 дав той
      самий diff); новий express ≡ старий express, новий nest ≡ старий nest.
- [x] Сесія з express валідна на nest і навпаки (me → 200)
- [x] Явне підтвердження власника "обидва беки живі"

## Етап 4 — test-pr web-only
- [x] Бекап `../test-pr.backup-before-stage4` (повна копія з `.git`,
      `node_modules`, `.env`)
- [x] Видалено `apps/api-express`, `apps/api-nest`, `packages/*`, а також
      `tsconfig.base.json` і `docker-compose.yml` (переїхав у contracts)
- [x] Workspaces прибрано; `apps/web/*` у корені (`src`, `public`,
      `index.html`, `vite.config.ts`, `tsconfig*.json`, `.env.example`)
- [x] Шляхи в конфігах змінювати не довелося — усі вони відносні до папки
      web; alias `@/` → `./src` у `vite.config.ts` і `tsconfig.app.json`
- [x] `"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"` + 4 імпорти
- [x] `.env.example` з `EXPRESS_API_URL`, `NEST_API_URL` (перенесено з web)
- [x] `.gitignore`: прибрано рядок `packages/db/src/generated`
- [x] `npm install`; lock засіяно з lock-файла бекапу — 157/157 версій
      збігаються, пакетів беків у lock немає
- [x] `npm run build` exit 0 (684 kB JS — як до міграції), `oxlint` exit 0
- [x] Vite dev: контракти віддаються через `/@fs/…` (200), `server.fs.allow`
      не знадобився; проксі `/api/express` і `/api/nest` → 200
- [x] "далі"
- [x] (поза планом) Проєкти перенесено в `~/Documents/programing/auto-lincoln/`,
      `test-pr` → `auto-lincoln-web`; симлінки на контракти резолвляться

## Етап 5 — наскрізна перевірка
- [ ] web 5173 + express 3001 + nest 3002 одночасно
- [ ] Браузер: логін
- [ ] Браузер: перемикач бекендів
- [ ] Логін через express → перемкнути на nest → `GET /api/auth/me` 200
      з тією ж cookie
- [x] docs/ і CLAUDE.md оновлено в кожній папці (web: CLAUDE.md, README,
      architecture переписано; спеки — шляхи; `PROJECT-CONTEXT.md` видалено.
      contracts/express/nest: нові CLAUDE.md, README, docs/architecture.md)
- [x] `open-questions.md`: #9 синхронізація версій contracts, `.env` у трьох
      проєктах, загострене #3 (+ прямі запити), #7 порядок ключів,
      #10 prepare-скрипт, #11 дрейф версій
- [ ] Фінальний стан цього чекліста
