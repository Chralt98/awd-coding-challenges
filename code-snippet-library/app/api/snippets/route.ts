import { getAllSnippets } from "@/lib/services/snippetsService";

export async function GET() {
  const snippets = await getAllSnippets();
  return Response.json(snippets);
}
