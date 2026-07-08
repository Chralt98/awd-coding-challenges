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

export async function createStory(
  title: string,
  language: Language,
): Promise<Story> {
  const [story] = await sql<Story[]>`
    INSERT INTO stories (title, language)
    VALUES (${title}, ${language})
    RETURNING id, title, created, language
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
    SELECT id, title, created, language
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

export async function deleteStory(storyId: number): Promise<void> {
  await sql`
    DELETE FROM stories
    WHERE id = ${storyId}
  `;
}
