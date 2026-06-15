import { getAllSnippets, getSnippetById } from "@/lib/services/snippetsService";
import Link from "next/link";

export async function generateStaticParams() {
  const snippets = await getAllSnippets();
  return snippets.map((snippet) => ({ id: String(snippet.id) }));
}

export default async function SnippetDetailPage({
  params,
}: PageProps<"/snippets/[id]">) {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    throw new Error(`Snippet with id ${id} not found`);
  }

  return (
    <div>
      <h1>Snippet {id}</h1>
      <h2>{snippet.title}</h2>
      <p>{snippet.description}</p>
      <p>Language: {snippet.language}</p>
      <pre>
        <code>{snippet.code}</code>
      </pre>
      <Link href="/snippets">Back to all snippets</Link>
    </div>
  );
}
