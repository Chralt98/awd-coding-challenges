import { getSnippetById } from "@/lib/services/snippetsService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return new Response(`Invalid id: ${id}`, { status: 400 });
  }

  const snippet = await getSnippetById(id);

  if (!snippet) {
    return new Response(`snippet with id ${id} not found`, { status: 404 });
  }

  return Response.json(snippet);
}
