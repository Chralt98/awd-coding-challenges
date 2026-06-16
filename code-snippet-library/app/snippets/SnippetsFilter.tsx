"use client";

import { useState } from "react";
import type { Snippet } from "@/lib/services/snippetsService";
import Link from "next/link";

export function SnippetsFilter({ snippets }: { snippets: Snippet[] }) {
  const [language, setLanguage] = useState("All");

  const visibleSnippets =
    language === "All"
      ? snippets
      : snippets.filter((snippet) => snippet.language === language);

  return (
    <div>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="All">All</option>
        <option value="JavaScript">JavaScript</option>
        <option value="CSS">CSS</option>
        <option value="TypeScript">TypeScript</option>
      </select>
      <ul>
        {visibleSnippets.map((snippet) => (
          <li key={snippet.id}>
            <h2>{snippet.title}</h2>
            <p>{snippet.language}</p>
            <p>{snippet.description}</p>
            <pre>
              <code>{snippet.code}</code>
            </pre>
            <Link href={`/snippets/${snippet.id}`}>
              Go to snippet {snippet.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
