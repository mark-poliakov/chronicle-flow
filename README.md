# Chronicle Flow (Online Diary with Retroactive Edits)

Онлайн-щоденник із можливістю ретроспективних правок: користувач може дописувати або модифікувати записи за минулі дні, зберігаючи повну історію змін (хто, коли і що саме додав).

## Tech Stack

- **Backend:** Nest.js, TypeScript, Prisma, SQLite
- **Frontend:** React, Vite, CSS, TypeScript

## Project Structure

- `/client` — Frontend застосунок
- `/server` — Backend API
- `/standards` — Угоди команди і стандарти ведення проекту
- `/docs` — Documentation (architecture overview, ADRs, etc.)

## Local Development

Інструкції щодо запуску бекенду та фронтенду

- root folder: `npm install`
- work with frontend: `cd client`, then `npm install`; to run client side locally - `npm run dev`
- work with bacakend: `cd server`, then `npm install`; to run server side locally - `npm run start:dev`

Можна запустити одразу бекенд і фронтен однією командою: `npm run dev` із кореневої папки.
