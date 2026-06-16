import { createNewSnippet } from "@/app/actions";

export default function NewSnippetPage() {
  return (
    <form action={createNewSnippet}>
      <input name="title" placeholder="Title" />
      <input name="language" placeholder="Language" />
      <input name="description" placeholder="Description" />
      <input name="code" placeholder="Code" />
      <button type="submit">Create request</button>
    </form>
  );
}
