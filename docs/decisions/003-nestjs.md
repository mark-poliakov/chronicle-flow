date: 2026-11-22
decision-makers: Mark
---

# To use or not to use Nest.js framework

## Context and Problem Statement

Technical stack for backend should be chosen.

## Decision Drivers

- A desire to write beautiful code
- A desire to try tech stack that happened to be watched in a video (Nest.js + Prisma ORM)

## Considered Options

- Nest.js + Prisma ORM
  - pros: the frameword enforces strict architectural rules + the author is familiar with Prisma ORM
  - cons: the framework requires understanding and thus a lot of documentation reading
- Nest.js + another ORM
  - pros: the frameword enforces strict architectural rules + another ORMs have better feedbacks from some people
  - cons: the framework requires understanding and thus a lot of documentation reading + picking a new ORM and figuring out one are required
- Nest.js + plain SQL
  - pros: the frameword enforces strict architectural rules + plain SQL reduces numbers of potential confusing errors that migh occure when using ORMs
  - cons: the framework requires understanding and thus a lot of documentation reading + the author would need to recall plain SQL and then spend more time writing queries
- Pure Node.js with Express
  - pros: no bothering of learning complicated Nest.js or another framework (except Express unfortunately)
  - cons: risk of build poor architecture and spending more time writing code

## Decision Outcome

Chosen option: "Nest.js + Prisma ORM", because a framework enforces strict architectural rules which prevents mistakes and poor architecture. Prisma ORM will be used because the developer (and the only developer) knows it and knows no other ORM. In the meantime writing plan SQL queries and designing manually a database is painful and long.

### Consequences

- Good, because beautiful code is likely to be written in future and tech stack will be learned
- Bad, because it might kill any motivation due to complexity of the framework and ORM to a beginner
