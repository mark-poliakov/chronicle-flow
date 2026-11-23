date: 2026-11-23
decision-makers: Mark
---

# Implementation of logger with Business-process ID

## Context and Problem Statement

Logger with Business-process ID is listed in requirements. Concrete implementation should be chosen.

## Decision Drivers

- The implementation shouldn't consume a lot of time, deadlines are too close
- No implementation is known to the developer

## Considered Options

- AsyncLocalStorage — a middleware creates context, logger reads the ID from it
  - pros: it is proposed in review, it is described briefly there
  - cons: it may be not the best option for the project

## Decision Outcome

Chosen option: "AsyncLocalStorage...", because to be fair it is only options that is condered. Pros greatly outweights cons and perfectly meets the decision drivers.

### Consequences

- Good, because it satisfies the decision drivers and it was proposed straightly
- Potentially not the best solution, might be even the worst (but it is doubted since passing context as parameters in each function seems much worse)
