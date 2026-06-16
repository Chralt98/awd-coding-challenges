import sql from "../db";

export type Snippet = {
  id: number;
  title: string;
  language: string;
  description: string;
  code: string;
};

export async function getAllSnippets(): Promise<Snippet[]> {
  return sql<Snippet[]>`SELECT * FROM snippets`;
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  const [snippets] = await sql<Snippet[]>`
    SELECT * FROM snippets WHERE id = ${id}
  `;
  return snippets ?? null;
}

export async function createSnippet(
  title: string,
  language: string,
  description: string,
  code: string,
): Promise<Snippet> {
  const [created] = await sql<
    Snippet[]
  >`INSERT INTO snippets (title, language, description, code)
    VALUES (${title}, ${language}, ${description}, ${code})
    RETURNING *
  `;
  return created;
}
