# Стандарти та стиль написання коду (Coding Style)

## 1. Базове форматування (Formal Formatting)
- **Відступи (Indentation):** Рівно **2 пробіли (2 spaces)**.
- **Дужки (Braces):** Відкриваюча фігурна дужка `{` розміщується **на тому ж рядку**, де оголошується функція, клас або умовний оператор (стиль 1TBS / K&R).
  ```typescript
  // ПРАВИЛЬНО:
  function calculateTotalAmount(): number {
    if (isValid) {
      return 100;
    }
  }

  // НЕПРАВИЛЬНО:
  function calculateTotalAmount() 
  {
    if (isValid) 
    {
      return 100;
    }
  }
  ```

## 2. Іменування змінних та функцій (Naming Conventions)
- **Змінні:** Назви є **іменниками в називному відмінку**, записані в стилі **`camelCase`**. Назва має бути самодокументованою.
  - *Правильно:* `userProfile`, `entryList`, `createdDate`.
  - *Неправильно:* `data`, `item`, `usersArray`, `getUser` (якщо це змінна, а не функція).
- **Булеві змінні (Прапорці):** Починаються з префіксів-дієслів `is`, `has`, `should`.
  - *Правильно:* `isEdited`, `hasHistory`, `shouldUpdate`.
- **Функції та методи:** Починаються з **дієслова в інфінітиві**, що описує дію, записані в `camelCase`.
  - *Правильно:* `createEntry()`, `fetchUserHistory()`, `validateToken()`.
- **Компоненти React та Класи Nest.js:** Використовують **`PascalCase`**.
  - *Правильно:* `EntryEditor.tsx`, `EntriesService.ts`, `UsersModule.ts`.
- **Константи (Global Constants):** Записуються в **`UPPER_SNAKE_CASE`**.
  - *Правильно:* `MAX_REVISION_LIMIT`, `DEFAULT_PAGE_SIZE`.

## 3. Додаткові стандарти професійної розробки (Best Practices)
- **Явна типізація (Explicit Typing):** Уникати використання типу `any`. Кожна функція повинна мати явно вказані типи аргументів та повертаного значення.
- **Раннє повернення (Early Return Pattern):** Уникати глибокої вкладеності операторів `if/else`. Якщо умова не виконується — виходьте з функції одразу.
  ```typescript
  // ПРАВИЛЬНО:
  function processEntry(entry: Entry) {
    if (!entry) {
      return;
    }
    // Основна логіка далі...
  }
  ```
- **Правило одного файлу:** Один компонент або клас — в одному файлі.