date: 2026-11-08
decision-makers: Mark
---

# Simplification of the app's logic

## Context and Problem Statement

The plan was to introduce strict rules (e.g. INITIAL record can be created only in the same day as targeted day, editing is available only during the day of creation), but they are too complicated, hard to implement consistently (what if user presses button at 23:59 when it is still available and sends a record (desired as INITIAL) to server at 00:01 the next day? Logic breaks.). Also it is not a good idea to put a user into strictly limited boundaries - they may give up the application.

## Considered Options

* Simplify the app's logic, enable all CRUD operations without restrictions
* Keep previous logic and try to implement it
* Redesign previous logic, come up with another rules that are still strict but works perhaps better

## Decision Outcome

Chosen option: "Simplify the app's logic...", because a user is responsible for their actions when using the applications, we cannot enforce them to some behavior, we can only give some recommendations to them. That is, enable all CRUD operations on records regargless of current date and target date, keep the option of adding retrospective (it's just another record to the same day, that is not empty).