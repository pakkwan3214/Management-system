# Development Guide

This guide covers everything needed to run, test, and extend the Dealership
Management System locally on macOS. It assumes no prior setup and limited
developer experience — follow the steps in order.

## 1. Technology stack and why it was chosen

| Concern        | Choice                                        | Why                                                                                                                                                                                                                                                                            |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework      | **Next.js 16** (App Router)                   | One framework for both the frontend (React, component-based) and the backend (API routes / server logic), which keeps the project simpler to deploy and maintain than separate frontend/backend apps. Actively maintained, long-term supported, and widely used in production. |
| Language       | **TypeScript**                                | Type-safe development across frontend, backend, and database layers — catches whole classes of bugs before the code ever runs, which matters for a system handling customer and financial data.                                                                                |
| UI             | **React 19** (via Next.js) + **Tailwind CSS** | Component-based UI, which matches the requirement for reusable, modular pieces. Tailwind keeps styling consistent without hand-rolling a design system this early.                                                                                                             |
| Database       | **PostgreSQL** via **Prisma ORM**             | PostgreSQL is a mature, relational database well-suited to the relationships this system will need (users ↔ roles ↔ permissions, customers ↔ deals ↔ vehicles, etc.). Prisma gives type-safe queries and built-in, reliable migrations.                                        |
| Env validation | **Zod**                                       | Validates required environment variables (database URL, secrets, etc.) at startup with clear error messages, instead of failing confusingly later.                                                                                                                             |
| Linting        | **ESLint** (`eslint-config-next`)             | Next.js's official linting rules, including accessibility and React best practices.                                                                                                                                                                                            |
| Formatting     | **Prettier**                                  | Consistent code formatting across the whole team, enforced automatically.                                                                                                                                                                                                      |
| Testing        | **Vitest** + **React Testing Library**        | Fast, modern test runner with first-class TypeScript/React support, used to test that components and routes actually render and behave correctly (not just that internals were called).                                                                                        |

No experimental or unstable technology was chosen. Every tool above is
stable and has a large community and long-term support.

## 2. Prerequisites

Install these once, before the first `npm install`:

1. **Node.js 20 or later** — check with:

   ```bash
   node -v
   ```

   If you don't have it, install it from https://nodejs.org (LTS version) or via Homebrew:

   ```bash
   brew install node
   ```

2. **PostgreSQL** — a local database server. The simplest options on macOS:
   - **Postgres.app** (recommended for beginners): download from
     https://postgresapp.com, open it, click "Initialize" to create a server.
   - **Homebrew**:
     ```bash
     brew install postgresql@16
     brew services start postgresql@16
     ```

   Either way, note the connection details (host, port, username, password) —
   you'll need them in step 4.

3. **Git** (usually already installed on macOS; check with `git --version`).

## 3. Install project dependencies

From the project root:

```bash
npm install
```

This downloads all packages listed in `package.json` into `node_modules/`.

## 4. Configure environment variables

Copy the example file and fill in real local values:

```bash
cp .env.example .env
```

Open `.env` in a text editor and set:

- `DATABASE_URL` — your local PostgreSQL connection string, e.g.
  `postgresql://postgres:postgres@localhost:5432/dealership_dev`
  (adjust username/password/port to match your Postgres setup).
- `NEXT_PUBLIC_APP_URL` — leave as `http://localhost:3000` for local dev.
- `AUTH_SECRET` — a random string for now (used by a future authentication
  task). Generate one with:
  ```bash
  openssl rand -base64 32
  ```

`.env` is already excluded from version control (see `.gitignore`) — never
commit real secrets.

## 5. Set up the database

Create the database itself (name must match the one in `DATABASE_URL`):

```bash
createdb dealership_dev
```

Generate the Prisma client (this reads `prisma/schema.prisma`):

```bash
npm run db:generate
```

> Note: `prisma/schema.prisma` currently defines only the database
> connection — there are no data models yet, so there is nothing to
> migrate yet. The next Foundation task adds the User/Role/Permission
> models, at which point you'll run `npm run db:migrate` to create the
> actual tables.

## 6. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the
"Dealership Management System" welcome page. Click **Go to dashboard** (or
open http://localhost:3000/dashboard directly) to see the placeholder
dashboard.

Stop the server anytime with `Ctrl+C` in the terminal.

## 7. Run tests

```bash
npm test
```

This runs all automated tests once and prints a pass/fail summary. To keep
tests running and re-run automatically as you edit files:

```bash
npm run test:watch
```

## 8. Linting, formatting, and type checking

```bash
npm run lint          # check for code quality issues
npm run format        # auto-fix formatting
npm run format:check  # check formatting without changing files
npm run typecheck     # verify TypeScript types across the project
```

Run these before considering any task finished.

## 9. Build for production (sanity check)

```bash
npm run build
```

This compiles the full production build and is a strong signal that
nothing is broken. It does not start a server — use `npm run dev` for
local development.

## 10. Project structure

```
dealership-management-system/
├── docs/                     # Developer documentation
├── prisma/
│   └── schema.prisma         # Database connection + (future) models
├── src/
│   ├── app/                  # Next.js routes (App Router)
│   │   ├── layout.tsx        # Root layout — wraps every page in AppShell
│   │   ├── page.tsx          # Primary/home route
│   │   ├── loading.tsx       # Global loading state
│   │   ├── error.tsx         # Global error boundary
│   │   └── dashboard/
│   │       ├── page.tsx      # Dashboard route
│   │       └── loading.tsx   # Dashboard-specific loading state
│   ├── components/
│   │   ├── layout/           # AppShell, Header, Sidebar
│   │   ├── ui/                # Reusable Loading/Error/Empty states
│   │   └── dashboard/         # Dashboard-specific components
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   └── env.ts             # Environment variable validation
│   ├── types/                 # Shared TypeScript types
│   └── tests/                 # Automated tests
├── .env.example                # Environment variable template (no secrets)
└── package.json
```

## 11. Troubleshooting

If something breaks, copy the **exact** terminal output or browser error and
share it — don't guess or reinstall everything from scratch. Common issues:

- **`Invalid or missing environment variables` on startup** — you haven't
  created `.env` yet, or a value is missing. Re-check step 4.
- **Prisma can't connect to the database** — confirm PostgreSQL is running
  (`brew services list` if using Homebrew, or check Postgres.app is open),
  and that `DATABASE_URL` matches your actual username/password/port.
- **Port 3000 already in use** — stop whatever is using it, or run
  `npm run dev -- -p 3001` to use a different port.
