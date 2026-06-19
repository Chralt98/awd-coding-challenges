"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SnippetsFilter({ snippets }: { snippets: Snippet[] }) {
  const [language, setLanguage] = useState("All");

  const visibleSnippets =
    language === "All"
      ? snippets
      : snippets.filter((snippet) => snippet.language === language);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Snippets</h1>
        <div className="flex items-center gap-3">
          <Select
            value={language}
            onValueChange={(value) => value && setLanguage(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="JavaScript">JavaScript</SelectItem>
              <SelectItem value="CSS">CSS</SelectItem>
              <SelectItem value="TypeScript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
          <Button render={<Link href="/snippets/new" />}>New Snippet</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleSnippets.map((snippet) => (
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
            <CardFooter>
              <Button variant="link" className="px-0" render={<Link href={`/snippets/${snippet.id}`} />}>
                View snippet &rarr;
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
