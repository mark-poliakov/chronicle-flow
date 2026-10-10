# Правила роботи з Git (Git Workflow)

## 1. Формат повідомлень комітів (Commit Messages)
### Структура коміту:
`<type>: <дієслово в інфінітиві> <стислий опис змін>`

### Основні типи (`<type>`):
- `feat:` — додавання нового функціоналу (Feature).
- `fix:` — виправлення багу.
- `docs:` — зміни в документації або файлах папки `standards/`.
- `style:` — правки форматування (пробіли, дужки), які не впливають на логіку.
- `refactor:` — переписання коду без зміни його зовнішньої поведінки.
- `chore:` — оновлення пакетів, налаштування Husky, ESLint тощо.

### Приклади правильних комітів:
- `feat: add retroactive editing feature`
- `fix: fix date validation issue in DTO`
- `docs: create coding and architecture standards`
- `chore: set Husky and lint-staged for validating before commit`

## 2. Правила роботи з гілками (Branching Strategy)
- `main` — стабільна версія проєкту. Запрямий коміт у `main` заборонений.
- Всі нові фічі розробляються в окремих гілках, створених від `main`:
  - `feature/add-entry-editor`
  - `fix/calendar-date-offset`
  - `chore/update-dependencies`
- Злиття в `main` відбувається виключно через **Pull Request (PR)** після перевірки лінтерами.