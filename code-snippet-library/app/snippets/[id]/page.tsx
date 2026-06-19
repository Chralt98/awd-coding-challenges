import { getAllSnippets, getSnippetById } from "@/lib/services/snippetsService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Button variant="ghost" className="mb-6" render={<Link href="/snippets" />}>
        &larr; Back to all snippets
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{snippet.title}</CardTitle>
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {snippet.language}
            </span>
          </div>
          <CardDescription>{snippet.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
            <code>{snippet.code}</code>
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
