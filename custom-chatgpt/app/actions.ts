"use server";

import openai from "../lib/openai";

const systemPrompt = `You are the game master of an interactive text adventure.
Rules:
- Narrate in the second person ("you"), in vivid but short paragraphs.
- After each story beat, offer the player two or three distinct choices.
- Continue the story based only on the choice the player makes.
- End the adventure when the player reaches a natural conclusion or makes a fatal choice.`;

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamChat(
  messages: Message[],
): Promise<ReadableStream<string>> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const token = chunk.choices[0].delta.content ?? "";
        controller.enqueue(token);
      }
      controller.close();
    },
  });
}
