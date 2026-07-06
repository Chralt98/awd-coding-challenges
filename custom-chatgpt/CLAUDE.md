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

**Two per-chat modes.** Each chat carries a `mode: ChatMode` (`"stream" | "json"`, defined in `lib/chat.ts`) chosen at creation via the selector next to "+ New chat". The mode decides which server action runs and how replies render:
- **`stream`** — plain-text tokens streamed live (`streamChat`).
- **`json`** — one structured `json_schema` response (`completeChat`) whose `followups` render as clickable choice buttons that send the chosen text as the next user message.

**Data flow — client state, server-side model call, back to the client:**

- `lib/openai.ts` — the single shared OpenAI SDK client (server-only; reads the API key).
- `app/actions.ts` — the **`"use server"`** boundary. Both actions prepend the game-master `systemPrompt` (via `withSystemPrompt`) and call `openai.chat.completions.create` with model `gpt-4o-mini`. `streamChat(messages)` uses `stream: true` and adapts the SDK's async iterator into a **`ReadableStream<string>` of plain-text `delta.content` tokens**. `completeChat(messages)` is **non-streaming**, uses the `json_schema` `response_format`, and `JSON.parse`s the response into `{ reply, followups }` (returns empty values if content is null/refused). `Message` (with optional `followups?: string[]`) and `ChatCompletion` types are defined here.
- `app/components/ChatApp.tsx` — **`"use client"`**, owns all state. Chats are a `Chat[]` (`{ id, title, mode, messages }`) persisted to `localStorage` under the key `"chats"` via `use-local-storage-state`. `activeChatId` is plain `useState` and falls back to the first chat. On send it optimistically appends the user message, derives the title from the first user message, then **branches on `activeChat.mode ?? DEFAULT_CHAT_MODE`**: streaming reads the `ReadableStream` chunk-by-chunk and `updateChat`s on every chunk; JSON awaits `completeChat` and appends one assistant message with `followups`. A `pending` flag drives a "Thinking…" placeholder (JSON mode has no live tokens) and disables input while a reply is in flight.
- `app/components/Chat.tsx` — presentational: renders the message list, any assistant `followups` as clickable buttons (calling the same `onSend`), the pending placeholder, and the input form.

**Migration note:** chats persisted before `mode` existed have `mode === undefined` at runtime, so consumers read it as `chat.mode ?? DEFAULT_CHAT_MODE` (`"stream"`). Keep that fallback when touching mode logic.
