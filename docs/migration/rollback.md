# Відкат

> Після етапу 4 проєкти лежать у `~/Documents/programing/auto-lincoln/`,
> `test-pr` перейменовано на `auto-lincoln-web`. Повний відкат до монорепо:
> зупинити dev-процеси; `docker compose down` в
> `auto-lincoln/auto-lincoln-contracts`; `mv test-pr.backup-before-stage4 test-pr`
> (у `~/Documents/programing`); `cd test-pr && npm run dev`. Папку
> `auto-lincoln/` після цього можна видалити. Шляхи в розділах нижче —
> історичні, до переносу.

Загальний принцип: до етапу 4 `test-pr` не змінюється (крім
`docs/migration/`), тому відкат етапів 0–3 = видалити нові папки. Git не
використовується, отже **перед етапом 4 потрібна копія `test-pr`** — це
єдина точка, після якої відкат без копії неможливий.

## Етап 0
`rm -rf test-pr/docs/migration` — більше нічого не змінювалось.

## Етап 1 — contracts
1. Якщо піднімалась база з нової папки:
   `cd auto-lincoln-contracts && docker compose down` (без `-v`, якщо дані
   ще потрібні; з `-v` — видалити новий volume).
2. Якщо зупинявся старий контейнер test-pr — підняти його назад:
   `cd test-pr && npm run db:up` (volume `test-pr_postgres-data` не
   видаляється, дані на місці).
3. `rm -rf ~/Documents/programing/auto-lincoln-contracts`.

## Етап 2 — api-express
1. Зупинити процес на 3001.
2. `rm -rf ~/Documents/programing/auto-lincoln-api-express`.
Контракти й test-pr не зачеплені.

## Етап 3 — api-nest
1. Зупинити процес на 3002.
2. `rm -rf ~/Documents/programing/auto-lincoln-api-nest`.

## Етап 4 — test-pr web-only
Перед початком етапу: повна копія
`cp -a test-pr test-pr.backup-before-stage4` (з `node_modules`, `.env`,
`.git`, щоб відкат був миттєвим).

Відкат: `rm -rf test-pr && mv test-pr.backup-before-stage4 test-pr`, потім
`cd test-pr && npm run dev` (як раніше: `predev` підніме базу монорепо).
Якщо в цей час працює база з `auto-lincoln-contracts` на 5432 — спочатку
`docker compose down` там.

## Етап 5 — наскрізна перевірка і документація
Код не змінюється, тільки docs/CLAUDE.md. Відкат документації в test-pr —
з бекапу етапу 4 (`docs/`, `CLAUDE.md`); у нових папках — видалити/
перезаписати файли документації.

## Повний відкат до стану "до міграції"
1. Зупинити всі dev-процеси (5173, 3001, 3002).
2. `docker compose down` в `auto-lincoln-contracts`.
3. Відновити `test-pr` з бекапу (якщо етап 4 був виконаний).
4. `rm -rf auto-lincoln-contracts auto-lincoln-api-express auto-lincoln-api-nest`.
5. `cd test-pr && npm run dev`.
