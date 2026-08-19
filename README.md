# Dealership Management System

A modern, modular web application for centralizing dealership operations:
employees, inventory, CRM, deals, vehicle sourcing, marketing, recognition,
leaderboards, reports, notifications, and settings.

This repository is being built **incrementally, one feature at a time**.
This commit represents the **Foundation phase only** — see
[`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for full setup instructions.

## Current status

- ✅ Project initialized (Next.js + TypeScript + Tailwind + Prisma + Vitest)
- ✅ Application shell (header, sidebar, main content, loading/error/empty states)
- ✅ Placeholder dashboard route
- ✅ Database connection architecture (no models yet)
- ⬜ Authentication
- ⬜ Users, roles, and permissions
- ⬜ Business modules (inventory, CRM, deals, marketing, badges, etc.)

## Quick start

See [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for full instructions.
The short version, on macOS:

```bash
npm install
cp .env.example .env
npm run dev
```

Then open **http://localhost:3000**.

## Technology stack

| Concern        | Choice                         |
| -------------- | ------------------------------ |
| Framework      | Next.js 16 (App Router)        |
| Language       | TypeScript                     |
| UI styling     | Tailwind CSS                   |
| Database ORM   | Prisma (PostgreSQL)            |
| Env validation | Zod                            |
| Linting        | ESLint (`eslint-config-next`)  |
| Formatting     | Prettier                       |
| Testing        | Vitest + React Testing Library |

See [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for the reasoning behind
each choice.
