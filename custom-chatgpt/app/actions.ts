"use server";

import openai from "../lib/openai";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamChat(
  messages: Message[],
): Promise<ReadableStream<string>> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
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
