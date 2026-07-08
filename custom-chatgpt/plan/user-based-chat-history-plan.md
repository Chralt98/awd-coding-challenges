# Test-Driven Development Plan: User-Based Chat History

**Source:** `plan/user-based-chat-history-refinement.md`
**Auth strategy (user decision):** hand-rolled credentials — bcrypt password hashing, custom signed-session cookie issued/read via `next/headers` `cookies()`, all encapsulated in a new server-only `lib/auth.ts`. No new runtime dependency beyond a hashing lib (`bcryptjs`) and a JWT/signing lib (`jose`, already commonly bundled with Next tooling — confirm in `package.json` before adding).

**Build order (bottom-up, matches dependency direction):**
1. Pure logic (`lib/user.ts`) — no I/O, cheapest to get right first.
2. Auth core (`lib/auth.ts`) — password hashing + session token, no DB/Next imports, unit-testable in isolation.
3. Data access layer (`lib/users.ts` new, `lib/stories.ts` scoping changes) — mock the `sql` client.
4. Server actions (`app/actions.ts`) — mock `lib/auth.ts` + DAL modules.
5. Components (`UserMenu.tsx`, `AuthForm.tsx`, `ChatApp.tsx` integration) — mock `app/actions.ts`.

Each layer's tests must be green (mocking only the layer below it) before moving to the next, per this project's established `lib/chat.test.ts` pattern of pure-module-first testing.

---

## 1. Pure Logic — `lib/user.ts`

New pure function, framework-free, tested exactly like `lib/chat.ts`/`lib/chat.test.ts`.

### `getInitials(email: string): string`
Derives the 1-2 letter badge shown in the bottom-left `UserMenu` footer.

| Case | Input | Expected |
|---|---|---|
| Simple local-part | `"jane@example.com"` | `"J"` (or `"JA"` — pin exact rule before writing test) |
| Dotted local-part | `"jane.doe@example.com"` | `"JD"` (first letter of each `.`-separated segment) |
| Plus-addressed | `"jane+test@example.com"` | ignores `+suffix`, same as `"jane@..."` |
| Numeric/symbol-only local-part | `"123@example.com"` | `"1"` or `"?"` — define a fallback, don't crash |
| Empty string | `""` | returns a safe fallback (e.g. `"?"`), never throws |
| Uppercase input | `"JANE@EXAMPLE.COM"` | normalized to uppercase output regardless of input case |
| Single-char local-part | `"j@example.com"` | `"J"` |

**Decide the exact segmentation rule (split on `.` vs first-two-chars) before writing the test file** — write the test cases first, then implement to satisfy them (red → green).

---

## 2. Auth Core — `lib/auth.ts`

Server-only module (same pattern as `lib/openai.ts`/`lib/db.ts` — never imported from `"use client"`). No DB or Next.js imports at this layer; pure crypto/session logic. Add explicit `"server-only"` import guard as `lib/openai.ts`/`lib/db.ts` likely already do — verify and match.

### `hashPassword(password: string): Promise<string>`
- Returns a bcrypt hash string (starts with `$2` prefix), not the plaintext.
- Same password hashed twice produces **different** hashes (salt is random) — assert inequality, not equality.
- Rejects/throws on empty-string password (define minimum-length policy here, e.g. reject `< 8` chars) — decide policy, then test both the accept and reject boundary (7 vs 8 chars).

### `verifyPassword(password: string, hash: string): Promise<boolean>`
- Correct password against its own hash → `true`.
- Wrong password against a valid hash → `false` (not a throw).
- Malformed/garbage hash string → `false`, does not throw (bcrypt compare should be wrapped to avoid unhandled rejection on corrupt data).
- Case-sensitive: `"Password1"` vs `"password1"` → `false`.

### `createSessionToken(userId: number): string`
- Returns a signed token (JWT) containing the `userId` claim.
- Two calls for the same `userId` at different times produce different tokens (if `iat`/expiry embedded) — or same, if deterministic; pin the expected behavior and test it explicitly.
- Token round-trips through `verifySessionToken` to recover the same `userId`.

### `verifySessionToken(token: string): number | null`
- Valid, unexpired token → returns the embedded `userId`.
- Tampered token (flip one character in the payload/signature) → returns `null`, does not throw.
- Expired token → returns `null`.
- Empty string / undefined input → returns `null`.
- Token signed with a different secret → returns `null` (simulate by signing with a throwaway key in the test).

### Session cookie helpers (`setSessionCookie(userId)`, `clearSessionCookie()`, `getCurrentUserId()`)
These wrap `next/headers` `cookies()` and can only run in a Server Action/Route Handler context — test via mocking `next/headers`.
- `getCurrentUserId()` with no cookie set → returns `null` (not a throw) — this is the "logged out" path every scoped action depends on.
- `getCurrentUserId()` with a valid session cookie → returns the `userId`.
- `getCurrentUserId()` with a tampered/expired cookie value → returns `null` (delegates to `verifySessionToken`).
- `setSessionCookie`/`clearSessionCookie` — assert `cookies().set`/`cookies().delete` (or equivalent API per the installed Next version — **check `node_modules/next/dist/docs/` for the exact `cookies()` write API in Next 16 before implementing**, since it may differ from older Next.js `set`/`delete` signatures) is called with the right name/value/httpOnly/secure flags.

---

## 3. Data Access Layer

### 3a. New `lib/users.ts` (mirrors `lib/stories.ts` conventions)

Mock the `sql` tagged-template client (`vi.mock("@/lib/db")`) — first-of-its-kind in this repo; establish the mock pattern here since later DAL/action tests reuse it.

#### `createUser(email: string, passwordHash: string): Promise<User>`
- Happy path: inserts and returns a row with `id`, `email`, `created` (no `password_hash` leaking into the returned shape if the action layer forwards this to the client — decide and enforce: DAL can return it, but actions/components must never pass it further).
- Duplicate email → the DB unique-constraint violation surfaces as a distinguishable error (catch the pg unique-violation code, e.g. `23505`, and rethrow/translate to a typed `DuplicateEmailError` rather than a raw pg error) — test that this specific error shape is thrown, not a generic DB error.

#### `getUserByEmail(email: string): Promise<User | null>`
- Existing email → returns the row (including `password_hash`, needed by the action layer for `verifyPassword`).
- Non-existent email → returns `null`, not `undefined` and not a throw.
- Case sensitivity: decide whether email lookup is case-insensitive (recommended: store lowercased, query lowercased) — test that `"Jane@Example.com"` matches a user created as `"jane@example.com"`.

#### `getUserById(id: number): Promise<User | null>`
- Existing id → returns the row.
- Non-existent id → returns `null`.

### 3b. `lib/stories.ts` scoping changes

Every existing test-free function here gains a `userId` parameter and a `WHERE user_id = ...` clause — this is the actual authorization fix identified in the refinement (§4.2). Mock `sql` per-test to assert the exact query shape/params, since these are the ownership-enforcement boundary.

#### `createStory(title, language, userId)`
- Inserted row includes the given `user_id`.

#### `listStories(userId)`
- Returns only stories belonging to `userId` — mock `sql` to return a mixed fixture and assert the query filters by `user_id` (since the mock controls what's "returned," the meaningful assertion is on the query/params passed to `sql`, not just the return value).
- `userId` with zero stories → returns `[]`, not `null`/throw.

#### `updateStoryTitle(storyId, title, userId)`
- Owner calls it → row updates (assert `WHERE id = storyId AND user_id = userId` shape, or equivalent).
- **Non-owner calls it with someone else's `storyId`** → zero rows affected; function must surface this as a failure the action layer can turn into a 403/no-op, not silently report success. Decide the return contract (throw `NotFoundError`/`ForbiddenError` vs. return a boolean/rowcount) and test it.

#### `deleteStory(storyId, userId)`
- Owner deletes own story → succeeds.
- **Non-owner attempts to delete another user's story** → no row deleted, same failure contract as above. This is the exact vulnerability called out in refinement §1 ("any client can delete any story by id") — the test must assert the row is *not* deleted when `userId` doesn't match, not just that the function was called with the right args.

#### `getStoryMessages(storyId, userId)` / `appendMessage(storyId, role, content, ..., userId)`
- Refinement §2 flags these as "acceptable if verified upstream" but recommends joining/verifying here too — plan assumes **ownership check moves into the DAL** for defense in depth (matches the pattern used for update/delete above): non-owner `storyId` → returns `[]`/throws rather than leaking another user's messages.

---

## 4. Server Actions — `app/actions.ts`

Mock `lib/auth.ts` (session helpers) and the DAL modules (`lib/users.ts`, `lib/stories.ts`) with `vi.mock`. This is new ground per the refinement (§3) — no `vi.mock` precedent exists yet for this file, so the first tests here also establish the mocking convention for Server Actions generally.

### `registerUser(email: string, password: string)`
- Happy path: hashes password, calls `createUser`, sets session cookie, returns the public user shape (no `password_hash`).
- Duplicate email → surfaces a user-facing error message (from the DAL's `DuplicateEmailError`), does not set a session.
- Invalid email format → rejected before hitting the DB (define validation: basic regex or a small check) — test both a clearly invalid string and a boundary case.
- Password below minimum length → rejected before hitting `hashPassword` (mirrors §2's policy) — assert `createUser`/`hashPassword` were never called.

### `loginUser(email: string, password: string)`
- Correct credentials → `verifyPassword` returns true, session cookie set, returns public user shape.
- Wrong password → generic "invalid credentials" error (do **not** leak "email exists but password wrong" vs "email not found" — same message/error shape for both, to avoid user enumeration). Test both the wrong-password and nonexistent-email paths produce an identical error message.
- Nonexistent email → same generic error as above, no session set.

### `logoutUser()`
- Clears the session cookie regardless of prior auth state.
- Calling it when already logged out → no-op, does not throw.

### `getCurrentUser()`
- Valid session → returns the current user's public shape (id, email — no hash).
- No session / invalid session → returns `null` (this is the value `ChatApp.tsx` uses to decide logged-in vs logged-out UI, so it must never throw on the "logged out" case).

### Scoped existing actions — `startAdventure`, `listAdventures`, `updateStoryTitle`, `deleteAdventure`, `loadAdventureMessages`, `saveMessage`

Per refinement §1's cited Next 16 pattern (`const session = await auth(); if (!session?.user) throw ...`): every one of these now derives `userId` from `getCurrentUserId()` server-side — **never** from a client-supplied parameter.

- Each action, called with **no active session** → throws/returns an `Unauthorized` error, and critically the DAL layer underneath is never invoked (assert the mock DAL function was not called) — this is the regression test for the authorization gap named in refinement §4.2.
- Each action, called **with a session belonging to a different user than the target `storyId`'s owner** → the DAL's ownership check (§3b) causes a `Forbidden`/no-op result; assert the action surfaces this as an error the UI can show, not a silent success.
- `listAdventures()` with a valid session → passes the session's `userId` into `listStories`, never a client-provided one.
- Happy path for each (owner, valid session) → unchanged existing behavior, still passes through to the DAL correctly.

### Cleanup folded into this work (refinement §1 / §4.3)
- Replace the `ChatApp.tsx:112-121` `Promise.all([saveMessage(...), saveMessage(...)])` double-dispatch with a single action (e.g. `saveMessages(storyId, entries[])` or a combined "append pair" action) — test that one action call persists both the user and assistant messages atomically (both rows present after one call, and — if wrapped in a DB transaction — that a failure on the second insert rolls back the first; decide whether transactional atomicity is in scope or a documented follow-up).

---

## 5. Components

First component tests in this repo (refinement §3 notes zero existing coverage for `ChatApp.tsx`/`Chat.tsx`). Use `@testing-library/react` + `@testing-library/user-event` (already installed) and `vi.mock("@/app/actions")`.

### New `UserMenu.tsx` (bottom-left sidebar footer)
- **Logged out**: renders "Log in" / "Sign up" affordance, no user info shown.
- **Logged in**: renders the badge (via `getInitials`) + email/name, no login/signup controls.
- Clicking the logged-in badge opens a menu/dropdown containing "Log out".
- Clicking "Log out" calls the `logoutUser` action (mocked) and the component reflects the logged-out state afterward (assert via re-render / callback prop, depending on where state lives — likely lifted to `ChatApp`).
- Every element added here needs a `dark:` Tailwind variant per this project's CLAUDE.md convention — include a snapshot/class-assertion test or at minimum a lint/visual check step, since RTL doesn't verify Tailwind class pairing automatically (manual review checklist item, not purely automatable).

### New `AuthForm.tsx` (login/signup form, likely modal or inline swap in place of the sidebar)
- Renders email + password fields and a submit button; label text switches between "Log in" and "Sign up" modes.
- Submitting valid credentials in login mode calls the mocked `loginUser` action with the form values.
- Submitting in signup mode calls the mocked `registerUser` action.
- Server-returned error (mock action rejects/returns an error shape) → form displays the error message, does not clear user input, does not navigate away.
- Empty-field submission → client-side validation blocks the call (assert the mocked action was **not** called) before ever hitting the server action.
- Loading/pending state: submit button disabled while the mocked action's promise is unresolved (mirrors existing `pending`/`starting` patterns already used in `ChatApp.tsx`).

### `ChatApp.tsx` integration changes
- On mount, calls `getCurrentUser()` (mocked) in addition to existing `listAdventures()` — assert both are invoked.
- Logged-out state: `listAdventures()` mock should not even be meaningfully rendered as a story list — decide the UX (e.g. show `AuthForm` gating the whole sidebar vs. anonymous browsing) **before writing this test**, since it changes the assertion target. Flag this as an open UX decision if not already settled during implementation planning.
- After a successful login/logout via `UserMenu`/`AuthForm`, `ChatApp` re-fetches `listAdventures()` scoped to the new session (assert the mocked action is called again, not just once on mount).
- Sidebar layout: `<aside>` restructure (§ refinement point 5) — flex column with scrollable story list (`flex-1 overflow-y-auto`) and `UserMenu` pinned via `mt-auto`. Test via RTL that `UserMenu`'s container has the expected structural class (or a data-testid-based DOM position assertion) rather than pixel-perfect layout, which RTL can't verify.

---

## 6. Schema / Migration (not unit-tested, verify manually)

Per `instrumentation.ts`'s existing idempotent pattern (refinement §2) — no automated test harness exists for this file today, so verify manually against a scratch DB:
- `CREATE TABLE IF NOT EXISTS users (...)` runs cleanly on both an empty DB and a DB that already has the table (idempotency).
- `ALTER TABLE stories ADD COLUMN IF NOT EXISTS user_id ...` runs cleanly against existing data — confirm the nullable-vs-backfill decision (refinement §2 flags this as open) before writing the `ALTER`, since a `NOT NULL` constraint added directly would break on any pre-existing story rows.

---

## Open decisions to pin before implementation (blocks precise test assertions above)

1. Exact `getInitials` segmentation rule (§1).
2. Password minimum-length policy (§2).
3. Session token lifetime / expiry behavior (§2).
4. Ownership-violation contract: throw a typed error vs. return `null`/`0`-rowcount from the DAL (§3b) — pick one and apply consistently across `updateStoryTitle`, `deleteStory`, `getStoryMessages`, `appendMessage`.
5. Logged-out sidebar UX: gate everything behind `AuthForm`, or allow anonymous browsing of a (now user-scoped, so empty) story list (§5).
6. Whether the `stories.user_id` column is nullable-forever (supports legacy anonymous rows) or backfilled+`NOT NULL` (§6).
