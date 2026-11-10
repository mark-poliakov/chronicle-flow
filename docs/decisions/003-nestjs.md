date: 2026-11-08
decision-makers: Mark
---

# To use or not to use Nest.js framework

## Context and Problem Statement

Technical stack for backend should be chosen.

## Considered Options

* Nest.js + Prisma ORM
* Nest.js + another ORM
* Nest.js + plain SQL
* Pure Node.js with Express

## Decision Outcome

Chosen option: "Nest.js + Prisma ORM", because a framework enforces strict architectural rules which prevents mistakes and poor architecture. Prisma ORM will be used because the developer (and the only developer) knows it and knows no other ORM. In the meantime writing plan SQL queries and designing manually a database is painful and long.