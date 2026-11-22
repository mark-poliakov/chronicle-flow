# ADR

Path: `/docs/decisions/{001-decision}`

## Naming:

`<number>-<decision-title>` - use kebab-case

## Notes

_Note_: format of ADR was updated 2026.11.22, ADRs that have been made in accordance to the old format may be left unchanged.

## Proposed and recommended structure of the ADR document:

```md
date: {YYYY-MM-DD of last update}
decision-makers:
---

# {short title, representative of solved problem and found solution}

## Context and Problem Statement

{Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems.}

## Decision Drivers

- {decision driver 1, e.g., a force, facing concern, …}
- {decision driver 2, e.g., a force, facing concern, …}
- … <!-- numbers of drivers can vary -->

## Considered Options

- {title of option 1}
  - pros: {pros of option 1}
  - cons: {cons of option 1}
- {title of option 2}
  - pros: {pros of option 2}
  - cons: {cons of option 2}
- {title of option 3}
  - pros: {pros of option 3}
  - cons: {cons of option 3}
- … <!-- numbers of options can vary -->

<!-- It is a good idea to list pros and cons of each option -->

## Decision Outcome

Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.

### Consequences

- Good, because {positive consequence, e.g., improvement of one or more desired qualities, …}
- Bad, because {negative consequence, e.g., compromising one or more desired qualities, …}
- … <!-- numbers of consequences can vary -->

## More Information

<!-- This is an optional element. Feel free to remove. -->

{You might want to provide additional evidence/confidence for the decision outcome here and/or document the team agreement on the decision and/or define when/how this decision the decision should be realized and if/when it should be re-visited. Links to other decisions and resources might appear here as well.}
```
