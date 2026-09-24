# `@auto-lincoln/contracts` — експорти та таблиця імпортів

## Карта експортів

| Subpath | Джерело (старе) | Нове джерело | dist | Середовище |
| --- | --- | --- | --- | --- |
| `@auto-lincoln/contracts` (`.`) | `packages/shared/src` | `src/shared` | `dist/shared/index.{js,d.ts}` | браузер + Node, **без Node-залежностей** |
| `@auto-lincoln/contracts/auth` | `packages/auth/src` | `src/auth` | `dist/auth/index.{js,d.ts}` | тільки Node (`node:crypto`, `jose`) |
| `@auto-lincoln/contracts/db` | `packages/db/src` | `src/db` | `dist/db/index.{js,d.ts}` | тільки Node (`@prisma/*`) |

`package.json` → `exports`:
```json
{
  ".":      { "types": "./dist/shared/index.d.ts", "default": "./dist/shared/index.js" },
  "./auth": { "types": "./dist/auth/index.d.ts",   "default": "./dist/auth/index.js" },
  "./db":   { "types": "./dist/db/index.d.ts",     "default": "./dist/db/index.js" }
}
```

Що експортує кожен subpath (без змін відносно старих пакетів):

- `.` — `API_PREFIX`, `API_ROUTES`, `BACKENDS`, `Backend`, `AUTH_COOKIE_NAME`,
  `HealthResponse`, `LoginRequest`, `AuthUser`, `ApiErrorBody`, доменні типи
  з `models.ts` (`Category`, `Carmaker`, `CarModel`, `Engine`, `Part`,
  `PartsFilters`, `Currency`, `AppUser`, `UserRole`).
- `./auth` — `hashPassword`, `verifyPassword`, `signSession`,
  `verifySession`, `SESSION_MAX_AGE_MS`.
- `./db` — усе з згенерованого `client.js` (`PrismaClient`, `User`, …) і
  `createPrismaClient(url)`.

## Правило заміни

| Старий імпорт | Новий імпорт |
| --- | --- |
| `'@auto-lincoln/shared'` | `'@auto-lincoln/contracts'` |
| `'@auto-lincoln/auth'` | `'@auto-lincoln/contracts/auth'` |
| `'@auto-lincoln/db'` | `'@auto-lincoln/contracts/db'` |

Імпортовані імена, `import type` / `type`-модифікатори та лапки/крапки з
комою в рядку не змінюються — тільки специфікатор.

## Усі знайдені імпорти (23 файли, 29 рядків)

Отримано: `grep -rn "@auto-lincoln/" packages apps --include='*.ts' --include='*.tsx'`
(без `node_modules`, `dist`, `generated`).

### Всередині контрактів (стають відносними — це тепер один пакет)

| Старий файл:рядок | Старий імпорт | Новий файл | Новий імпорт |
| --- | --- | --- | --- |
| `packages/auth/src/session.ts:1` | `import type { UserRole } from '@auto-lincoln/shared'` | `src/auth/session.ts` | `import type { UserRole } from '../shared/index.js'` |
| `packages/db/prisma/seed.ts:2` | `import { hashPassword } from '@auto-lincoln/auth'` | `prisma/seed.ts` | `import { hashPassword } from '../src/auth/index.js'` |
| `packages/db/prisma/seed.ts:3` | `import { createPrismaClient } from '../src/index.js'` | `prisma/seed.ts` | `import { createPrismaClient } from '../src/db/index.js'` |

(Рядок 3 у `seed.ts` — не `@auto-lincoln/*`, але шлях змінюється через нову
структуру папок.)

### `auto-lincoln-api-express` (9 файлів)

| Файл (відносно `src/`) | Старий імпорт | Новий імпорт |
| --- | --- | --- |
| `lib/apiError.ts:1` | `import type { ApiErrorBody } from '@auto-lincoln/shared';` | `… from '@auto-lincoln/contracts';` |
| `app.ts:1` | `import { API_PREFIX } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `middleware/requireAuth.ts:2` | `import { AUTH_COOKIE_NAME } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `middleware/requireAuth.ts:3` | `import { verifySession } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `routes/health.ts:1` | `import { API_ROUTES, type HealthResponse } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `modules/auth/auth.router.ts:1` | `import { SESSION_MAX_AGE_MS, signSession, verifyPassword } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `modules/auth/auth.router.ts:2` | `import { API_ROUTES, AUTH_COOKIE_NAME } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `types/express.d.ts:1` | `import type { UserRole } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `lib/prisma.ts:1` | `import { createPrismaClient } from '@auto-lincoln/db'` | `… from '@auto-lincoln/contracts/db'` |
| `modules/auth/auth.types.ts:1` | `import type { verifySession } from "@auto-lincoln/auth";` | `… from "@auto-lincoln/contracts/auth";` |
| `modules/auth/toAuthUser.ts:1` | `import type { User } from "@auto-lincoln/db";` | `… from "@auto-lincoln/contracts/db";` |
| `modules/auth/toAuthUser.ts:2` | `import type { AuthUser } from "@auto-lincoln/shared";` | `… from "@auto-lincoln/contracts";` |

### `auto-lincoln-api-nest` (8 файлів)

| Файл (відносно `src/`) | Старий імпорт | Новий імпорт |
| --- | --- | --- |
| `main.ts:4` | `import { API_PREFIX } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `auth/auth.service.ts:1` | `import { verifyPassword } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `auth/auth.service.ts:2` | `import { PrismaClient, type User } from '@auto-lincoln/db'` | `… from '@auto-lincoln/contracts/db'` |
| `auth/auth.controller.ts:1` | `import { SESSION_MAX_AGE_MS, signSession } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `auth/auth.controller.ts:2` | `import { API_ROUTES, AUTH_COOKIE_NAME } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `auth/auth.controller.ts:3` | `import type { AuthUser, LoginRequest } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` (лишається `import type` — TS1272) |
| `auth/to-auth-user.ts:1` | `import type { User } from '@auto-lincoln/db'` | `… from '@auto-lincoln/contracts/db'` |
| `auth/to-auth-user.ts:2` | `import type { AuthUser } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `prisma/prisma.module.ts:1` | `import { createPrismaClient, PrismaClient } from '@auto-lincoln/db'` | `… from '@auto-lincoln/contracts/db'` (value-імпорт — потрібен для DI) |
| `auth/auth.guard.ts:1` | `import { verifySession } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `auth/auth.guard.ts:2` | `import { AUTH_COOKIE_NAME } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `auth/auth.types.ts:1` | `import type { verifySession } from '@auto-lincoln/auth'` | `… from '@auto-lincoln/contracts/auth'` |
| `health/health.controller.ts:1` | `import { API_ROUTES, type HealthResponse } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |

### `test-pr` web (4 файли) — рішення: варіант B

Ключ у `package.json` web: `"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"`.
Пакет скрізь називається однаково, 4 рядки імпорту змінюються (етап 4).

| Файл (відносно `src/`) | Старий імпорт | Новий імпорт |
| --- | --- | --- |
| `features/auth/api/authApi.ts:2` | `import { API_ROUTES, type AuthUser, type LoginRequest } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `components/layout/BackendSwitcher.tsx:4` | `import { BACKENDS, type Backend } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `lib/apiClient.ts:1` | `import { API_PREFIX, type ApiErrorBody } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
| `lib/backend.ts:1` | `import { BACKENDS, type Backend } from '@auto-lincoln/shared'` | `… from '@auto-lincoln/contracts'` |
