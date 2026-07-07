import sql from "./db";

export type Story = {
  id: number;
  title: string;
  created: Date;
};

export type Role = "system" | "user" | "assistant";

export type StoredMessage = {
  id: number;
  role: Role;
  content: string;
  followups: string[] | null;
  ended: boolean | null;
};

export async function createStory(title: string): Promise<Story> {
  const [story] = await sql<Story[]>`
    INSERT INTO stories (title)
    VALUES (${title})
    RETURNING id, title, created
  `;
  return story;
}

export async function appendMessage(
  storyId: number,
  role: Role,
  content: string,
  followups: string[] | null = null,
  ended: boolean | null = null,
): Promise<StoredMessage> {
  const [message] = await sql<StoredMessage[]>`
    INSERT INTO messages (story_id, role, content, followups, ended)
    VALUES (${storyId}, ${role}, ${content}, ${followups ? sql.json(followups) : null}, ${ended})
    RETURNING id, role, content, followups, ended
  `;
  return message;
}

export async function getStoryMessages(
  storyId: number,
): Promise<StoredMessage[]> {
  // `id` is a monotonic identity column, so it doubles as insertion order.
  return sql<StoredMessage[]>`
    SELECT id, role, content, followups, ended
    FROM messages
    WHERE story_id = ${storyId}
    ORDER BY id
  `;
}

export async function listStories(): Promise<Story[]> {
  return sql<Story[]>`
    SELECT id, title, created
    FROM stories
    ORDER BY created DESC
  `;
}

export async function updateStoryTitle(
  storyId: number,
  title: string,
): Promise<void> {
  await sql`
    UPDATE stories
    SET title = ${title}
    WHERE id = ${storyId}
  `;
}
