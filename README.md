# Chronicle Flow (Online Diary with Retroactive Edits)

Онлайн-щоденник із можливістю ретроспективних правок: користувач може дописувати або модифікувати записи за минулі дні, зберігаючи повну історію змін (хто, коли і що саме додав).

## Tech Stack

- **Backend:** Nest.js, TypeScript, Prisma, SQLite
- **Frontend:** React, Vite, CSS, TypeScript

## Project Structure

- `/client` — Frontend застосунок
- `/server` — Backend API
- `/standards` — Архітектурна документація та угоди команди
- `/docs` — Documentation

## Local Development

Інструкції щодо запуску бекенду та фронтенду

- root folder: `npm install`
- work with frontend: `cd client`, then `npm install`; to run client side locally - `npm run dev`
- work with bacakend: `cd server`, then `npm install`; to run server side locally - `npm run start:dev`

### Tests

- backend tests (`cd server`):
  - `npm run test`: runs unit tests - fast, for development (alternatively, `npm run test:unit`, does the same)
  - `npm run test:integration`: runs integration tests
  - `npm run test:e2e`: runs e2e tests for the backend
  - `npm run test:all`: runs all kinds of tests (unit, integration and e2e)
  - `npm run test:mutation`: runs Stryker
  - `npm run test:all:with-mutation`: runs all kinds of test + mutation (Stryker) afterwards
