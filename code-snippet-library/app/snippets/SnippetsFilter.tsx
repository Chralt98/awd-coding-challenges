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

export function SnippetsFilter({ snippets }: { snippets: Snippet[] }) {
  const [language, setLanguage] = useState("All");

  const visibleSnippets =
    language === "All"
      ? snippets
      : snippets.filter((snippet) => snippet.language === language);

  return (
    <div>
      <Button render={<Link href="/snippets/new" />}>New Snippet</Button>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="All">All</option>
        <option value="JavaScript">JavaScript</option>
        <option value="CSS">CSS</option>
        <option value="TypeScript">TypeScript</option>
      </select>
      <div>
        {visibleSnippets.map((snippet) => (
          <Card key={snippet.id}>
            <CardHeader>
              <div>
                <CardTitle>{snippet.title}</CardTitle>
                <span>{snippet.language}</span>
              </div>
              <CardDescription>{snippet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre>
                <code>{snippet.code}</code>
              </pre>
            </CardContent>
            <CardFooter>
              <Link href={`/snippets/${snippet.id}`}>View snippet →</Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
