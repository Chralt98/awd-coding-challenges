# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project lives inside the `awd-coding-challenges` collection of independent coding-challenge
projects (see the root `CLAUDE.md`). It is self-contained: its own `package.json`, its own
lockfile, its own `node_modules`. Always run commands from inside this directory.

## Stack

- **NestJS** (TypeScript), scaffolded with `@nestjs/cli`, `@nestjs/platform-express`.
- **npm** as package manager (`package-lock.json`) — do not use Bun or yarn here.
- **Postgres** for storage, run locally via `docker-compose.yaml`, accessed through
  **TypeORM** (`@nestjs/typeorm` + `typeorm` + `pg`) — this matches the pattern already used by
  the sibling `nest-js-cyber-chat` project.
- **bcrypt** (the `bcrypt` npm package) for password hashing. Never store or log a plaintext
  password.
- **Zod** for request validation instead of NestJS's usual `class-validator`/`class-transformer`
  DTO pattern. Define a Zod schema per route and validate with a Zod-based `PipeTransform`
  (e.g. `nestjs-zod`, or a small hand-rolled `ZodValidationPipe`) rather than decorated DTO
  classes.
- **Vitest** for tests (`vitest run`, matching `nest-js-cyber-chat`'s setup — *not* Jest, which
  `real-time-chat/backend` uses instead).

## Commands

```bash
npm install          # install dependencies
npm run start:dev    # Nest dev server with watch mode
npm run build        # nest build
npm run lint         # eslint --fix
npm test             # vitest run
npm run test:watch   # vitest (watch mode)
docker compose up -d # start local Postgres before running the app
```

The verification gate before considering a change done: `npm run lint && npm test && npm run build`.

## Configuration

- `DATABASE_URL` (or equivalent discrete `POSTGRES_*` vars) is read via `@nestjs/config` and
  must live in `.env` (gitignored). No secrets are hardcoded.
- Local Postgres runs via `docker-compose.yaml`, mapped to host port **5434** — ports 5431–5433
  are already used by sibling projects in this repo (`code-snippet-library`,
  `kikis-delivery-service`, `custom-chatgpt`), so this project must not collide with them.

## Conventions

- Feature code lives under `src/<feature>/` following standard Nest module/controller/service
  layout (e.g. `src/users/`).
- Request/response shapes are defined as Zod schemas (`z.object({...})`) colocated with the
  feature (e.g. `src/users/register.schema.ts`), with TypeScript types inferred via `z.infer`.
  Do not add `class-validator`/`class-transformer` DTO classes — Zod is the single validation
  mechanism in this project.
- Password hashing always goes through `bcrypt.hash` with a fixed, named salt-round constant
  (e.g. `SALT_ROUNDS = 12`) defined once and reused — never inline a magic number at each call
  site.
- Database access goes through TypeORM repositories/entities, injected via Nest's DI — no raw
  `pg` queries scattered in controllers/services.
- Every new endpoint gets a corresponding Vitest test (unit test for the service/validation
  logic at minimum; e2e test against the controller where practical).

## Architecture

Single endpoint to start: **`POST /register`**.

- **Request body**: `{ email: string, password: string }`, validated by a Zod schema —
  `email` must be a valid email string; `password` must meet a minimum length (e.g. 8
  characters). Invalid input → `400 Bad Request` with the Zod validation errors.
- **Behavior**: hash `password` with `bcrypt` (never store or return the plaintext password),
  then persist a new user row (`id`, `email` unique, `password_hash`, `created_at`) via a
  TypeORM `User` entity/repository.
- **Duplicate email**: attempting to register an already-used email → `409 Conflict`.
- **Response**: `201 Created` with only public fields (`id`, `email`) — the response must
  never include `password` or `password_hash`.

## Never do

- **Never store or return a plaintext password.** Always hash with `bcrypt` before persisting,
  and never include `password`/`password_hash` in any API response or log line.
- **Never add `class-validator`/`class-transformer` DTOs.** Validation in this project is Zod
  schemas only — keep that consistent across every endpoint added later.
- **Never commit `.env` or real database credentials.**
