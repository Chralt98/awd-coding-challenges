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
): Promise<StoredMessage> {
  const [message] = await sql<StoredMessage[]>`
    INSERT INTO messages (story_id, role, content)
    VALUES (${storyId}, ${role}, ${content})
    RETURNING id, role, content
  `;
  return message;
}

export async function getStoryMessages(
  storyId: number,
): Promise<StoredMessage[]> {
  // `id` is a monotonic identity column, so it doubles as insertion order.
  return sql<StoredMessage[]>`
    SELECT id, role, content
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
