date: {2026-11-5 of last update}
decision-makers: Mark
---

# Repository setup and standards

## Context and Problem Statement

Необхідно прийняти рішення щодо організації репозиторію для проекту, тому що саме вона передує написанню власне застосунку. Це самий початок проекту, потрібно закласти всі стандарти, рекомендації і т.д.

## Considered Options

### Repository organisation:

* Монорепозиторій
* Розподілений репозиторій

### Folders for documentation:

* `/docs` + `/standards`; `/docs` -> `./decisions` + `./spec`
* `/docs`; `/docs` -> `./decisions` + `./spec` + `./standards`
* `CONTRIBUTING.md`

## Decision Outcome

### Repository organisation

Обрано "Монорепозиторій", тому що проект буде нескладним, збереження всього застосунку в одному місці полегшить роботу.

### Folders for documentation

Обрано опцію "`/docs` + `/standards`; `/docs` -> `./decisions` + `./spec`", тому що планується ретельне документування - одного файлу недостатньо. І також вирішено винести стандарти в корінь репозиторію для легшого доступу й акцентування уваги.

## More Information

Для консультації до укладення стандартів використовувався Gemini. Якщо раптом треба, посилання на діалог:
https://share.gemini.google/WgFEH74Lv6gj