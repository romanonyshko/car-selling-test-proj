# План: розділення монорепо на чотири папки

> **Оновлення 2026-09-23 (після етапу 4, на прохання власника):** усі
> чотири проєкти перенесено в спільну папку, `test-pr` перейменовано на
> `auto-lincoln-web`:
> ```
> ~/Documents/programing/auto-lincoln/
>   auto-lincoln-web/  auto-lincoln-contracts/  auto-lincoln-api-express/  auto-lincoln-api-nest/
> ```
> Шляхи нижче (`~/Documents/programing/<проєкт>`, `test-pr`) — історичні,
> на момент виконання етапів. Бекап лишився в
> `~/Documents/programing/test-pr.backup-before-stage4`.

Мета — розкласти npm-монорепо `test-pr` на чотири незалежні папки-проєкти
**без зміни логіки**. Git не використовується (жодних git-команд).

```
~/Documents/programing/
  auto-lincoln-contracts/     ← packages/{shared,auth,db} + Prisma + docker-compose
  auto-lincoln-api-express/   ← apps/api-express
  auto-lincoln-api-nest/      ← apps/api-nest
  test-pr/                    ← лишається, стає тільки фронтендом (етап 4)
```

Споживачі підключають контракти як
`"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"` (симлінк у
`node_modules`). Пізніше рядок замінюється на git-залежність.

Карта експортів і таблиця імпортів — [`contracts-api.md`](contracts-api.md).
Покрокові чек-бокси — [`checklist.md`](checklist.md).
Відкат — [`rollback.md`](rollback.md).

## Інваріанти (не змінюються на жодному етапі)

- Логіка коду, версії залежностей, набір пакетів.
- `vite.config.ts` і його проксі (`EXPRESS_API_URL`, `NEST_API_URL`).
- Cookie: ім'я `al_session`, `httpOnly`, `sameSite: 'lax'`, `path: '/'`,
  `maxAge = SESSION_MAX_AGE_MS`, `secure` у production.
- Спільний `JWT_SECRET` в обох API.
- Маршрути та DTO з `shared`.
- `test-pr` не змінюється до явного підтвердження після етапу 3
  (виняток — ця папка `docs/migration/`, створена на етапі 0).

## Що дозволено міняти (тільки механіка переносу)

- Специфікатори імпортів: `@auto-lincoln/{shared,auth,db}` → subpath-и
  `@auto-lincoln/contracts[/auth|/db]` (див. таблицю).
- Два внутрішні імпорти всередині контрактів стають відносними
  (`auth/session.ts` → `../shared/index.js`, `prisma/seed.ts` →
  `../src/auth/index.js`, `../src/db/index.js`), бо це тепер один пакет.
- Шляхи в конфігах: `output` генератора Prisma, `extends` у tsconfig
  (вміст `tsconfig.base.json` копіюється в кожен проєкт), `exports` у
  `package.json`.
- Кореневі devDependencies монорепо (`typescript`, `@types/node`, `oxlint`,
  `tsx`) розносяться по проєктах, яким вони потрібні, **з тими самими
  діапазонами версій**. Це не нові пакети.

## Етапи

### Етап 0 — план (цей файл)
Список усіх імпортів `@auto-lincoln/*`, документи в `docs/migration/`.

### Етап 1 — `auto-lincoln-contracts`
Структура:
```
auto-lincoln-contracts/
├── package.json          # @auto-lincoln/contracts, exports ".", "./auth", "./db"
├── tsconfig.json         # type-check усього (noEmit), вміст tsconfig.base.json
├── tsconfig.build.json   # src/ → dist/
├── prisma.config.ts
├── docker-compose.yml
├── .env.example          # DATABASE_URL, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
├── .gitignore
├── README.md             # "міграції запускаються ТІЛЬКИ звідси"
├── prisma/{schema.prisma, migrations/, seed.ts}
└── src/
    ├── shared/{index,api,models}.ts     → dist/shared
    ├── auth/{index,password,session}.ts → dist/auth
    └── db/index.ts + generated/prisma   → dist/db
```
Build: `prisma generate && tsc -p tsconfig.build.json`.
Перевірка: `dist/shared/**` не містить `node:`/`jose`/`@prisma`; Prisma-клієнт
є в `src/db/generated/prisma` і `dist/db/generated/prisma`.

### Етап 2 — `auto-lincoln-api-express`
Копія `apps/api-express` у корінь, свій `package.json` / `tsconfig.json` /
`.env.example`, одна залежність `file:../auto-lincoln-contracts`, імпорти за
таблицею. `npm install`, база з контрактів, запуск на 3001, curl:
health / login / me / logout (з `Set-Cookie`).

### Етап 3 — `auto-lincoln-api-nest`
Те саме, порт 3002. `import type` для типів у декорованих параметрах
(TS1272) і `@HttpCode` — лишаються як є. Порівняння статусів і тіл
відповідей з express (`diff` виводу curl).

### Етап 4 — `test-pr` стає web-only (тільки після "далі")
Видалити `apps/api-*`, `packages/*`; розібрати workspaces; підняти
`apps/web` у корінь; alias `@/` → `src/`; залежність на контракти;
`.env.example` з `EXPRESS_API_URL` / `NEST_API_URL`.

### Етап 5 — наскрізна перевірка
web 5173 + express 3001 + nest 3002, браузер: логін, перемикач, сесія
з express валідна на nest. Оновлення docs/CLAUDE.md у кожній папці,
новий борг в `open-questions.md`, фінальний стан `checklist.md`.

## Ризики, знайдені на етапі 0, і рішення власника

1. **Web: ім'я залежності.** Рішення — **B**: ключ
   `"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"`, 4 рядки
   імпорту у web змінюються (етап 4). Формулювання "імпорти в web не
   змінюються" з початкового завдання скасоване.
2. **Docker.** Рішення — **a**: `docker compose down` у test-pr **без
   `-v`** (volume `test-pr_postgres-data` лишається для відкату), нова база
   з `auto-lincoln-contracts`, `migrate deploy`, `seed`. У compose-файл, що
   переїжджає, додано `name: auto-lincoln` — ім'я docker-проєкту більше не
   залежить від назви папки (volume: `auto-lincoln_postgres-data`).
3. **Версії залежностей.** Після кожного `npm install` звіряю встановлені
   версії з `package-lock.json` test-pr і звітую про розбіжності.
4. **Vite і `server.fs.allow`.** Проксі та alias `@/` не чіпати. Якщо Vite
   заблокує симлінк на `../auto-lincoln-contracts` — дозволено додати
   `server.fs.allow` із цим шляхом; факт фіксується в звіті й тут.
   **Результат етапу 4:** не знадобилось. Vite резолвить симлінк у
   `/@fs/…/auto-lincoln-contracts/dist/shared/*.js` і віддає ці файли (200);
   `vite.config.ts` не змінено.
5. **Git-залежність у майбутньому.** `prepare`-скрипт зараз не робимо —
   записати в борг на етапі 5.
