"use client";

import { useEffect, useState } from "react";
import { fetchSnippetsByIds } from "@/app/actions";
import type { Snippet } from "@/lib/services/snippetsService";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import useFavoritesStore from "@/store/favoritesStore";

export default function FavoritesListPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setSnippets([]);
      return;
    }
    fetchSnippetsByIds(favoriteIds).then(setSnippets);
  }, [favoriteIds]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <Button nativeButton={false} render={<Link href="/snippets" />}>
          Back to all snippets
        </Button>
      </div>

      {snippets.length === 0 ? (
        <p className="text-muted-foreground">No favorites yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {snippets.map((snippet) => (
            <Card key={snippet.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{snippet.title}</CardTitle>
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {snippet.language}
                  </span>
                </div>
                <CardDescription>{snippet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
                  <code>{snippet.code}</code>
                </pre>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button
                  variant="link"
                  className="px-0"
                  nativeButton={false}
                  render={<Link href={`/snippets/${snippet.id}`} />}
                >
                  View snippet &rarr;
                </Button>
                <FavoriteButton id={String(snippet.id)} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
