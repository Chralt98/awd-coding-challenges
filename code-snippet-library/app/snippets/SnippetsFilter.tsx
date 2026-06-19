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
    <div>
      <Button nativeButton={false} render={<Link href="/snippets/new" />}>New Snippet</Button>
      <Select
        value={language}
        onValueChange={(value) => value && setLanguage(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="JavaScript">JavaScript</SelectItem>
          <SelectItem value="CSS">CSS</SelectItem>
          <SelectItem value="TypeScript">TypeScript</SelectItem>
        </SelectContent>
      </Select>
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
