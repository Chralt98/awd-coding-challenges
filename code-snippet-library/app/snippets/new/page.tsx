import { createSnippet } from "@/lib/services/snippetsService";
import { revalidatePath } from "next/cache";

export async function createNewSnippet(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const language = formData.get("language") as string;
  const description = formData.get("description") as string;
  const code = formData.get("code") as string;

  await createSnippet(title, language, description, code);
  revalidatePath("/snippets");
}

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
