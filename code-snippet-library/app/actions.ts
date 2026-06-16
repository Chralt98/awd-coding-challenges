"use server";

import { createSnippet } from "@/lib/services/snippetsService";
import { revalidatePath } from "next/cache";

export async function createNewSnippet(formData: FormData) {
  const title = formData.get("title") as string;
  const language = formData.get("language") as string;
  const description = formData.get("description") as string;
  const code = formData.get("code") as string;

  await createSnippet(title, language, description, code);
  revalidatePath("/snippets");
}
