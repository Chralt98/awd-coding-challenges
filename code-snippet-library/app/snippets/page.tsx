import { getAllSnippets } from "@/lib/services/snippetsService";
import { SnippetsFilter } from "./SnippetsFilter";

export default function SnippetsPage() {
  const snippets = getAllSnippets();
  return <SnippetsFilter snippets={snippets} />;
}
