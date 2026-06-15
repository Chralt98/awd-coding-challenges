import Link from "next/link";
import { getAllSnippets } from "@/lib/services/snippetsService";

export default function SnippetsPage() {
  const snippets = getAllSnippets();
  return (
    <ul>
      {snippets.map((snippet) => (
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
  );
}
