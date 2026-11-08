date: 2026-11-08
decision-makers: Mark
---

# What database to use?

## Context and Problem Statement

A database should be chosen.

## Considered Options

* SQLite
* PostgreSQL
* SQL Server
* MongoDB

## Decision Outcome

Chosen option: "SQLite", because the application is simple and the developer does not have PostgreSQL installed on their machine. MongoDB is NoSQL database which is not necessary to introduce in the application. SQLite is a good starting option, migrating to PostgreSQL later is possible and acceptable.