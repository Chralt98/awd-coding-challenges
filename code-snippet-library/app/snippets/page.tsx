import { getAllSnippets } from "@/lib/services/snippetsService";
import { SnippetsFilter } from "./SnippetsFilter";

export default async function SnippetsPage() {
  const snippets = await getAllSnippets();
  return <SnippetsFilter snippets={snippets} />;
}
