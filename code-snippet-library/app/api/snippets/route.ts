import { getAllSnippets } from "@/lib/services/snippetsService";
import { createSnippet } from "@/lib/services/snippetsService";

export async function GET() {
  const snippets = await getAllSnippets();
  return Response.json(snippets);
}

export async function POST(request: Request) {
  const { title, language, description, code } = await request.json();

  if (
    typeof title !== "string" ||
    typeof language !== "string" ||
    typeof description !== "string" ||
    typeof code !== "string"
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  const newSnippet = {
    title,
    language,
    description,
    code,
  };
  await createSnippet(title, language, description, code);

  return Response.json(newSnippet, { status: 201 });
}
