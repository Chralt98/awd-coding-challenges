import { createNewSnippet } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function NewSnippetPage() {
  return (
    <form action={createNewSnippet}>
      <input name="title" placeholder="Title" />
      <input name="language" placeholder="Language" />
      <input name="description" placeholder="Description" />
      <input name="code" placeholder="Code" />
      <Button type="submit">Create request</Button>
    </form>
  );
}
