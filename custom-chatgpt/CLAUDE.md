# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js version caution (read first)

This project runs **Next.js 16.2.10** with **React 19** and the **App Router**. Per `AGENTS.md`, this version has breaking changes relative to older Next.js — **read the relevant guide in `node_modules/next/dist/docs/` before writing App Router / server-action code**, and heed deprecation notices. Do not rely on training-data conventions.

## Commands

npm is the package manager (only `package-lock.json` is present — do not use Bun here).

```bash
npm run dev      # dev server with Turbopack at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next)
npm test         # run the Vitest suite once
npm run test:watch  # Vitest in watch mode
```

Tests run on **Vitest** (jsdom environment, globals enabled — config in `vitest.config.ts`, setup in `vitest.setup.ts`). Run a single file with `npx vitest run <path>`, or a single case with `npx vitest run -t "<name>"`. Pure, framework-free logic is extracted into plain modules (e.g. `lib/chat.ts`) so it can be unit-tested without rendering React; keep that split when adding testable logic. The full verification gate before considering a change done is `npm run lint && npm test && npm run build`.

## Coding conventions

- **Every styled element pairs a light style with an explicit `dark:` Tailwind variant** (e.g. `bg-white … dark:bg-zinc-900`). Match this when adding UI — never ship a class that only looks right in one theme.

## Never do

- **Never import `lib/openai.ts` or `lib/stories.ts` (or otherwise call the OpenAI/DB clients) from a `"use client"` component.** The OpenAI client reads `OPENAI_API_KEY` and the DB client reads `DATABASE_URL`; both must stay server-only, reached exclusively through the `"use server"` functions in `app/actions.ts`. Importing them into client code would leak secrets into the browser bundle.

## Configuration

- `OPENAI_API_KEY` and `DATABASE_URL` must be set in `.env.local` (already gitignored). Next.js loads it automatically — there is no `dotenv`. `OPENAI_API_KEY` is read only in `lib/openai.ts`; `DATABASE_URL` only in `lib/db.ts`.
- **Postgres runs in Docker** (`docker-compose.yaml`): `docker compose up -d` before `npm run dev`. This project's container maps host port **5433** (5432/5431 are used by sibling projects). `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` also live in `.env.local` for the compose file.
- `@/*` path alias maps to the project root (`tsconfig.json`).

## Architecture

A single-page **choose-your-own-adventure** game (a text-adventure "game master"). The whole UI lives at `app/page.tsx` → `ChatApp`. State lives in the client; the model call and all persistence go through the `"use server"` boundary; adventures are stored in **Postgres**.

**Persistence — two tables** (created idempotently at server boot by `instrumentation.ts`'s `register()`): `stories` (`id`, `title`, `created`) and `messages` (`id`, `story_id` FK `ON DELETE CASCADE`, `role`, `content`). Note `messages` stores only `role`/`content` — **not** the per-beat `options`/`ended`.

- `lib/openai.ts` / `lib/db.ts` — the single shared OpenAI SDK client and postgres.js `sql` client (both server-only).
- `lib/stories.ts` — the server-only data-access layer: `createStory`, `appendMessage`, `getStoryMessages` (ordered by `id`), `listStories`, `updateStoryTitle`.
- `app/actions.ts` — the **`"use server"`** boundary and the only thing the client talks to. `completeChat(messages)` prepends the game-master `systemPrompt` (via `withSystemPrompt`) and calls `gpt-4o-mini` **non-streaming** with a `json_schema` `response_format`, `JSON.parse`ing the reply into `{ story, options, ended }` (`ChatCompletion`). Thin wrappers over the DAL: `startAdventure`, `listAdventures`, `loadAdventureMessages`, `saveMessage`, `updateStoryTitle`. The `Message` type (`role`/`content` + optional `followups?`/`ended?`) and `Story` are defined/re-exported here.
- `app/components/ChatApp.tsx` — **`"use client"`**, owns all state (`stories`, `activeStoryId`, `messages`, `pending`, `starting`). On mount it `listAdventures()` for the sidebar. `handleNewAdventure` → `startAdventure` (new story row). `handleSelectStory` → `loadAdventureMessages` (resume). `handleSend` (used by opening prompt, option clicks, and free text) optimistically appends the user message, derives+persists the story title on the first message (`deriveTitle` + `updateStoryTitle`), calls `completeChat`, appends the assistant `Message` (folding the beat's `story`/`options`/`ended` into `content`/`followups`/`ended`), and `saveMessage`s both to the DB.
- `app/components/Chat.tsx` — presentational: renders the transcript, the current beat's `options` as clickable buttons (**only on the last message**, via `followups`), a "Thinking…" pending bubble, and either the text input or — when `ended` — a "Start new adventure" button (`onNewAdventure`).
- `lib/chat.ts` — the one piece of pure, unit-tested logic: `deriveTitle` (+ `TITLE_MAX_LENGTH`, `NEW_ADVENTURE_TITLE`).

**Known limitation:** because `options`/`ended` aren't persisted, a **resumed** adventure shows its last saved narration with the free-text input rather than the original option buttons (no live beat until the next turn). The empty-`options`/`ended` end state offers a new adventure instead of choices.
