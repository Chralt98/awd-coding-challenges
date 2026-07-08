# Feature Refinement: User-Based Chat History

**Requested feature:** Add user-based chat history to the custom-chatgpt adventure app. A user indicator/menu should appear in the bottom-left corner of the UI (ChatGPT-style sidebar footer).

**Current state:** The app is fully anonymous/single-tenant. There is no user model, no auth, no sessions, and no API routes — every mutation goes through Server Actions in `app/actions.ts`. This is a **greenfield auth feature**, not an extension of existing user-scoping.

---

## 1. Route / Endpoint Layer (`app/actions.ts`, `app/components/*`)

All client-server communication is via `"use server"` actions in `app/actions.ts` — there are **no `app/api/**` route handlers** and **no `middleware.ts`**.

Existing actions, none of which carry a user identity today:

| Action | Location | DAL call | Notes |
|---|---|---|---|
| `startAdventure(language)` | actions.ts:15-17 | `createStory` | no user param |
| `listAdventures()` | actions.ts:19-21 | `listStories` | **global**, unfiltered — returns every story in the DB |
| `updateStoryTitle(storyId, title)` | actions.ts:23-28 | `updateStoryTitleDb` | no ownership check |
| `deleteAdventure(storyId)` | actions.ts:30-32 | `deleteStory` | no ownership check — any client can delete any story by id |
| `loadAdventureMessages(storyId)` | actions.ts:34-44 | `getStoryMessages` | no ownership check — any storyId is loadable |
| `saveMessage(storyId, role, content, followups?, ended?)` | actions.ts:46-54 | `appendMessage` | |
| `completeChat(messages, language)` | actions.ts:94-133 | OpenAI only, stateless | unaffected by user scoping |

**Component tree / where the UI goes:**
- `app/page.tsx` → renders `ChatApp` (trivial).
- `app/components/ChatApp.tsx` (`"use client"`) owns all state: `stories`, `activeStoryId`, `messages`, `pending`, `starting`, `error`, `newAdventureOrigin`, `confirmingDeleteId`. Loads `listAdventures()` on mount (unscoped).
- **Sidebar**: `<aside className="flex w-64 flex-col gap-2 p-2">` at ChatApp.tsx:136-200 — contains the "+ New adventure" control (136-167) and story list `<ul>` (168-199). This is where the bottom-left user element goes: restructure to `flex flex-col h-full`, put the story list in a `flex-1 overflow-y-auto` region, and append a new footer block (new `UserMenu.tsx` component) after the list, pinned via `mt-auto`.
- `app/components/Chat.tsx` is purely presentational (transcript, options, input) — unaffected by auth changes.
- Minor existing issue worth folding into this work: `ChatApp.tsx:112-121` calls two `saveMessage` actions via `Promise.all` from the client — Next.js 16 docs (`node_modules/next/dist/docs/01-app/02-guides/server-actions.md`) explicitly warn against parallelizing Server Action dispatches from the client (they're sequential per client); prefer combining into one action.

**Next.js 16 guidance directly applicable:** the same server-actions doc shows the canonical auth pattern — `const session = await auth(); if (!session?.user) throw new Error('Unauthorized')` inside every action, deriving identity from session rather than trusting client-supplied IDs. This maps directly onto hardening `loadAdventureMessages`/`deleteAdventure`/`updateStoryTitle`, which currently take no ownership path at all.

---

## 2. Data Layer (`lib/db.ts`, `lib/stories.ts`, `instrumentation.ts`)

- `lib/db.ts` — single shared `postgres.js` client: `postgres(process.env.DATABASE_URL!)`, no pooling/SSL config.
- `lib/stories.ts` exports: `createStory(title, language)`, `appendMessage(storyId, role, content, followups?, ended?)`, `getStoryMessages(storyId)`, `listStories()` (unfiltered `SELECT ... ORDER BY created DESC`), `updateStoryTitle(storyId, title)`, `deleteStory(storyId)`. None take a `userId`.
- `instrumentation.ts` idempotently creates `stories` and `messages` at boot, then applies additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for later schema evolution (this is the established migration pattern to follow — no formal migration tool is used).
- **Confirmed via grep**: zero existing references to `user_id`, a `users` table, or any auth library (`next-auth`, `lucia`, `iron-session`, `jose`, `bcrypt`, `jsonwebtoken`, `passport`, `auth0`, `clerk`) anywhere in the project or `package.json`. This must be selected and added fresh.

**Schema changes needed** (following the existing `instrumentation.ts` create-then-alter pattern):
1. `CREATE TABLE IF NOT EXISTS users (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL, created timestamp NOT NULL DEFAULT now())` — or a shape matching an external auth provider's adapter if one is chosen instead of hand-rolled credentials.
2. `ALTER TABLE stories ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id) ON DELETE CASCADE` — nullable initially (existing rows have no owner) or backfilled to a placeholder "anonymous" user before tightening to `NOT NULL`.

**DAL changes needed in `lib/stories.ts`:**
- `createStory(title, language, userId)` — add `user_id` to INSERT.
- `listStories(userId)` — add `WHERE user_id = ${userId}`.
- `updateStoryTitle(storyId, title, userId)` and `deleteStory(storyId, userId)` — add `userId` to the `WHERE` clause; this is the actual authorization fix (currently keyed only by `storyId`, so ownership isn't enforced at all).
- `getStoryMessages`/`appendMessage` are keyed by `storyId` only — acceptable if story ownership is verified upstream in the action, but ideally join/verify ownership here too.
- New functions: `createUser(email, passwordHash)`, `getUserByEmail(email)`, `getUserById(id)`.
- New `lib/auth.ts` (server-only, same pattern as `lib/openai.ts`/`lib/db.ts`) for password verification and session/JWT issuance — must never be imported from a `"use client"` component per this project's existing CLAUDE.md rule.

---

## 3. Test Setup & Coverage

- **Vitest config**: jsdom environment, globals enabled, `@vitejs/plugin-react` for TSX. Setup file only wires up `@testing-library/jest-dom/vitest` matchers — no fetch mocking, no `vi.mock` precedent anywhere in the repo today.
- **Existing tests**: exactly one file, `lib/chat.test.ts`, testing the pure function `deriveTitle` (plus `getAdventureIntro`, `getStorySuggestions` live in the same pure, framework-free `lib/chat.ts` module). This is the established and *only proven* testing pattern: extract logic with zero React/Next imports into `lib/*.ts`, test with plain `describe/it/expect`.
- **Component testing**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `jsdom` are all already installed as devDependencies — tooling is ready — but **no component test exists yet** (`ChatApp.tsx`, `Chat.tsx` have zero coverage). A new `UserMenu`/`UserBadge` component test would be the first of its kind in this repo; it will need `vi.mock("@/app/actions")` since components call server actions directly, and no such mock currently exists to copy from.
- **Server action / DB testing**: no test imports from `app/actions.ts`, `lib/stories.ts`, or `lib/db.ts`; `vi.mock` is not used anywhere in the codebase. Testing new auth-aware actions (`getCurrentUser`, scoped `listAdventures`, etc.) means establishing DB/session mocking from scratch (mock the `sql` tagged-template client and/or a new `lib/auth.ts` module) — new ground, not a blocker, but should be budgeted as new infra work, not a copy-paste.

**Recommended test approach for this feature:**
- Any pure derivation logic for the bottom-left badge (e.g. initials-from-email) → new `lib/*.ts` function, tested exactly like `lib/chat.test.ts`.
- New auth-aware server actions → introduce `vi.mock("@/lib/db")` (or mock `lib/auth.ts`/`lib/stories.ts` directly) — first-of-its-kind in this repo, plan for it explicitly.
- New `UserMenu` component → first component test in the repo; mock `app/actions.ts` via `vi.mock`, render with RTL, assert on session-based UI states (logged in/out).

---

## 4. Cross-Cutting Risks / Open Questions

1. **Auth strategy choice is the first decision needed**: hand-rolled email+password (bcrypt + custom session/JWT cookie) vs. an auth library (e.g. `next-auth`/Auth.js, which Next 16 docs reference directly for the Server Actions session pattern). No package is installed for either yet — this determines the shape of `users`, `lib/auth.ts`, and whether a `middleware.ts` or `app/api/auth/**/route.ts` callback route is needed (Route Handlers, not Server Actions, are the documented mechanism for OAuth callbacks/logout redirects).
2. **Authorization gap to fix regardless of auth strategy**: `deleteAdventure`, `updateStoryTitle`, and `loadAdventureMessages` currently trust a client-supplied `storyId` with no ownership check — this must be closed as part of adding `userId`, not left as a follow-up.
3. **Existing `Promise.all` double-`saveMessage` call** (ChatApp.tsx:112-121) contradicts Next 16's documented Server Action guidance and is a natural cleanup while touching this action for user-scoping.
4. **Migration approach**: no formal migration tool exists; follow `instrumentation.ts`'s idempotent `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` convention rather than introducing one.
5. **Sidebar restructure**: `ChatApp.tsx`'s `<aside>` needs a flex layout change (scrollable story list + pinned footer) to fit a bottom-left `UserMenu`, per the existing dark-mode-pairing convention in CLAUDE.md (every new styled element needs a `dark:` variant).
