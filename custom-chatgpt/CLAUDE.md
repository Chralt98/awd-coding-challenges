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

- **Never import `lib/openai.ts` (or otherwise call the OpenAI client) from a `"use client"` component.** The client reads `OPENAI_API_KEY`; it must stay server-only, reached exclusively through the `"use server"` functions in `app/actions.ts`. Importing it into client code would leak the key into the browser bundle.

## Configuration

- `OPENAI_API_KEY` must be set in `.env.local` (already gitignored). Next.js loads it automatically — there is no `dotenv`. It is read only in `lib/openai.ts`.
- `@/*` path alias maps to the project root (`tsconfig.json`).

## Architecture

A single-page ChatGPT-style app built as a learning exercise (see `README.md` for the three progressive challenge stages: basic chat → multiple chats w/ sidebar → streaming). The whole UI lives at `app/page.tsx` → `ChatApp`.

**Data flow — client state, server-side model call, streamed back:**

- `lib/openai.ts` — the single shared OpenAI SDK client (server-only; reads the API key).
- `app/actions.ts` — the **`"use server"`** boundary. `streamChat(messages)` prepends the game-master `systemPrompt`, calls `openai.chat.completions.create` (model `gpt-4o-mini`, `stream: true`), and adapts the SDK's async iterator into a `ReadableStream<string>` of `delta.content` tokens returned to the client. `Message` type is defined here and imported by the components.
- `app/components/ChatApp.tsx` — **`"use client"`**, owns all state. Chats are a `Chat[]` (`{ id, title, messages }`) persisted to `localStorage` under the key `"chats"` via `use-local-storage-state`. `activeChatId` is plain `useState` and falls back to the first chat. On send it optimistically appends the user message, derives the chat title from the first user message, calls `streamChat`, then reads the stream chunk-by-chunk, rebuilding the assistant message and calling `updateChat` on every chunk so text grows live and stays persisted.
- `app/components/Chat.tsx` — presentational: renders the message list (`role: content`) and the input form; lifts submit up via `onSend`.

**Important current-state quirk:** `streamChat` requests a **structured `json_schema` response** (`{ reply, followups }`), but the client streams and renders `delta.content` verbatim as plain text. So the UI currently displays the raw streamed JSON rather than parsing out `reply`/`followups`. Keep this in mind — reconciling the server's response format with the client's rendering is the natural next step, and any change to one side must account for the other.
