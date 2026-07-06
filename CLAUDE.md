# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This is a collection of **independent coding-challenge projects**, one per top-level directory. There is **no root workspace / monorepo tooling** — the root `package.json` has no `workspaces` field and no build. Each subproject has its own `package.json`, its own lockfile, and its own dependency tree.

Consequence: **always `cd` into the relevant subproject before running commands.** Installing or running from the root does nothing useful for a subproject. Dependencies (`node_modules`) live inside each subproject.

The root-level `src/*.ts` files are standalone TypeScript learning exercises (`challenge-*.ts`, etc.) compiled by the root `tsconfig.json` (`src/` → `dist/`, strict, ESNext/NodeNext). They are unrelated to the subprojects.

## Package manager: determined per project by the lockfile

There are two conventions in this repo, and the lockfile present in a subproject tells you which to use:

- **`bun.lock` present → use Bun** (`bun install`, `bun run <script>`, `bun <file>`, `bun test`).
- **only `package-lock.json` present → use npm** (`npm ci` / `npm install`, `npm run <script>`, `npm test`).

Do not mix them within a project (e.g. don't run `npm install` in a Bun project) — it produces a conflicting lockfile.

A `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc` rule is present in several projects and states the preference for **new** code: prefer Bun and its built-in APIs (`Bun.serve()`, `bun:sqlite`, `Bun.file`, built-in `WebSocket`) over Node/Express/`ws`/etc., and Bun auto-loads `.env` (no `dotenv`). Follow this in Bun projects; respect the existing stack (Express, etc.) when a project already uses it.

## Common commands (run inside the subproject)

Scripts vary per project — check the project's `package.json`. Common patterns:

| Stack | Dev | Build | Test |
|---|---|---|---|
| NestJS (`nest-*`, `scoreboard-service`, `quote-api`, `real-time-chat/backend`) | `npm run start:dev` or `bun run dev` | `nest build` / `tsc` | `vitest run` or `jest` (varies) |
| Next.js (`custom-chatgpt`, `code-snippet-library`, `kikis-delivery-service`) | `npm run dev` | `npm run build` | — |
| Express / plain TS (`expressjs-app`, `burn-on-read-service`, `mvc-pattern-challenge`, `superheroes`, `book-shelf`, `software-design-*`) | `bun run dev` / `npm run dev` | `tsc` | project-specific |
| Vite React (`real-time-chat/frontend`) | `vite` | `tsc -b && vite build` | — |

**Test frameworks differ across the NestJS projects** — `nest-js-cyber-chat` uses **Vitest** (`vitest run`, single test: `vitest run <path>` or `-t "name"`), while `real-time-chat/backend` uses **Jest** (single test: `jest <path>` or `-t "name"`). Check the project before assuming.

## CI/CD — only `nest-js-cyber-chat` is wired up

`.github/workflows/ci.yaml` and `cd.yaml` are **scoped exclusively to `nest-js-cyber-chat/**`** (via `paths:` filters). No other subproject is built, tested, or deployed by CI. For that project:

- CI (Node 26, `npm ci`): runs `npm test` (Vitest) and `npm run build` (`nest build`).
- CD (on CI success, main): builds `nest-js-cyber-chat/Dockerfile`, pushes to Docker Hub, then triggers a Render deploy hook.

So changes to `nest-js-cyber-chat` must pass `npm test` and `npm run build`; changes elsewhere are not gated by CI.

## Working with Next.js projects

`custom-chatgpt/AGENTS.md` (referenced by its `CLAUDE.md`) warns that the installed Next.js version has breaking changes versus what may be in training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code**, and heed deprecation notices. The same caution applies to the other Next.js projects here.
