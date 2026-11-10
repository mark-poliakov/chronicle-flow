date: 2026-11-10
decision-makers: Mark
---

# Give up on precommit hooks

## Context and Problem Statement

Every commit was checked by Prettier, which has strict rules and guidelines regarding code style, that don't fit the main developer's (Mark) preferences. So in fact, Prettier was forced to not launch before each and every commit. Pretties is useless right now, causing only inconveniences.

## Considered Options

* Remove Prettier from git-hooks
* Keep as is
* Reconfigure Prettier, switch to another formatter or remove the formatter but introduce a linter

## Decision Outcome

Chosen option: "Remove Prettier from git-hooks", because the developer team consists of only one developer, who is quite responsible for his own code. The option of introducing another tools (formatters, linters) is still available, but right now is not required.

## More Information

The decision maker (Mark) understands all risks of removing precommit hooks, keeps in mind that they should be added to the project at some point.