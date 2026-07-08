import sql from "./db";

export type Language = "english" | "german";

export type Story = {
  id: number;
  title: string;
  created: Date;
  language: Language;
};

export type Role = "system" | "user" | "assistant";

export type StoredMessage = {
  id: number;
  role: Role;
  content: string;
  followups: string[] | null;
  ended: boolean | null;
};

export class NotFoundError extends Error {
  constructor(message = "Story not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function createStory(
  title: string,
  language: Language,
  userId: number,
): Promise<Story> {
  const [story] = await sql<Story[]>`
    INSERT INTO stories (title, language, user_id)
    VALUES (${title}, ${language}, ${userId})
    RETURNING id, title, created, language
  `;
  return story;
}

/**
 * Inserts only if `storyId` is owned by `userId` (WHERE EXISTS guards the
 * INSERT), so a non-owner's call inserts nothing rather than leaking rows
 * into another user's story.
 */
export async function appendMessage(
  storyId: number,
  role: Role,
  content: string,
  followups: string[] | null = null,
  ended: boolean | null = null,
  userId: number,
): Promise<StoredMessage> {
  const [message] = await sql<StoredMessage[]>`
    INSERT INTO messages (story_id, role, content, followups, ended)
    SELECT ${storyId}, ${role}, ${content}, ${followups ? sql.json(followups) : null}, ${ended}
    WHERE EXISTS (
      SELECT 1 FROM stories WHERE id = ${storyId} AND user_id = ${userId}
    )
    RETURNING id, role, content, followups, ended
  `;
  if (!message) throw new NotFoundError();
  return message;
}

async function assertStoryOwnership(
  storyId: number,
  userId: number,
): Promise<void> {
  const rows = await sql`
    SELECT id FROM stories WHERE id = ${storyId} AND user_id = ${userId}
  `;
  if (rows.length === 0) throw new NotFoundError();
}

export async function getStoryMessages(
  storyId: number,
  userId: number,
): Promise<StoredMessage[]> {
  await assertStoryOwnership(storyId, userId);
  // `id` is a monotonic identity column, so it doubles as insertion order.
  return sql<StoredMessage[]>`
    SELECT id, role, content, followups, ended
    FROM messages
    WHERE story_id = ${storyId}
    ORDER BY id
  `;
}

export async function listStories(userId: number): Promise<Story[]> {
  return sql<Story[]>`
    SELECT id, title, created, language
    FROM stories
    WHERE user_id = ${userId}
    ORDER BY created DESC
  `;
}

export async function updateStoryTitle(
  storyId: number,
  title: string,
  userId: number,
): Promise<void> {
  const rows = await sql`
    UPDATE stories
    SET title = ${title}
    WHERE id = ${storyId} AND user_id = ${userId}
    RETURNING id
  `;
  if (rows.length === 0) throw new NotFoundError();
}

export async function deleteStory(
  storyId: number,
  userId: number,
): Promise<void> {
  const rows = await sql`
    DELETE FROM stories
    WHERE id = ${storyId} AND user_id = ${userId}
    RETURNING id
  `;
  if (rows.length === 0) throw new NotFoundError();
}
