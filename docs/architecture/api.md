# API

## API Контракт

- `/api/v1` - глобальний префікс API
  - `/diary` - основний модуль щоденника
    - `/entries` GET - повертає всі сутності днів, у яких наявні записи
    - `/records/:targetDate` GET - повертає всі записи за вказаний (Params) день
    - `/` POST - створює запис, приймає entryId та content | повертає створений запис
    - `/:id` PATCH - редагує запис за вказаний (Params) день, приймає content | повертає відредагований запис
    - `/:id` DELETE - видаляє запис за вказаний (Params) день | повертає null
  - `/auth` -
    - `/register` POST - реєструє користувача, приймає email та password | повертає JWT-токен
    - `/login` POST - входить в систему, приймає email та password | повертає JWT-токен
    - `/me` GET - повертає id та email поточного користувача (за токеном)

_Всі шляхи API, окрім `/api/v1/auth/register` та `/api/v1/auth/login` вимагають JWT-токен._

## Приклади запитів

GET `/api/v1/diary/entries`
GET `/api/v1/diary/records/2026-11-23`
PATCH `/api/v1/diary/adsasd4asdgh5`
POST `/api/v1/auth/login`
