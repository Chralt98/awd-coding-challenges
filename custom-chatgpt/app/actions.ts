"use server";

import openai from "../lib/openai";

const systemPrompt = `You are the game master of an interactive text adventure.
Rules:
- Narrate in the second person ("you"), in vivid but short paragraphs.
- After each story beat, offer the player two or three distinct choices.
- Continue the story based only on the choice the player makes.
- End the adventure when the player reaches a natural conclusion or makes a fatal choice.
- In structured JSON responses, put the current beat in "story", the choices in "options", and set "ended" to true only when the adventure is over.
- When "ended" is true, return an empty "options" array.`;

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  /** Suggested next choices, populated only for assistant messages in JSON mode. */
  followups?: string[];
  /** Whether the adventure has reached an ending. */
  ended?: boolean;
};

export type ChatCompletion = {
  story: string;
  options: string[];
  ended: boolean;
};

const withSystemPrompt = (messages: Message[]) => [
  { role: "system" as const, content: systemPrompt },
  ...messages,
];

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

/** JSON mode: a single structured adventure beat with choices and end state. */
export async function completeChat(
  messages: Message[],
): Promise<ChatCompletion> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: withSystemPrompt(messages),
    temperature: 0.5,
    max_tokens: 300,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "chat_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            story: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            ended: { type: "boolean" },
          },
          required: ["story", "options", "ended"],
          additionalProperties: false,
        },
      },
    },
  });

  const choice = response.choices[0];
  const content = choice.message.content;
  if (!content) {
    return { story: "", options: [], ended: false };
  }
  if (choice.finish_reason === "length") {
    throw new Error(
      "The model response was truncated before completing. Try raising max_tokens.",
    );
  }
  return JSON.parse(content) as ChatCompletion;
}
