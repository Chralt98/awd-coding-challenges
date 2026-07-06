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
  /** Suggested next choices, populated only for assistant messages in JSON mode. */
  followups?: string[];
};

export type ChatCompletion = {
  reply: string;
  followups: string[];
};

const withSystemPrompt = (messages: Message[]) =>
  [{ role: "system" as const, content: systemPrompt }, ...messages];

/** Streaming mode: yields plain-text tokens as the model produces them. */
export async function streamChat(
  messages: Message[],
): Promise<ReadableStream<string>> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: withSystemPrompt(messages),
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

/** JSON mode: a single structured response with a reply and suggested choices. */
export async function completeChat(
  messages: Message[],
): Promise<ChatCompletion> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: withSystemPrompt(messages),
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "chat_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            followups: { type: "array", items: { type: "string" } },
          },
          required: ["reply", "followups"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    return { reply: "", followups: [] };
  }
  return JSON.parse(content) as ChatCompletion;
}
