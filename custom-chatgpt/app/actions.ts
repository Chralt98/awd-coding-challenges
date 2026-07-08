"use server";

import openai from "../lib/openai";
import {
  createStory,
  appendMessage,
  getStoryMessages,
  listStories,
  updateStoryTitle as updateStoryTitleDb,
  deleteStory,
  type Story,
  type Language,
} from "../lib/stories";

export async function startAdventure(language: Language): Promise<Story> {
  return await createStory("New adventure", language);
}

export async function listAdventures(): Promise<Story[]> {
  return listStories();
}

export async function updateStoryTitle(
  storyId: number,
  title: string,
): Promise<void> {
  await updateStoryTitleDb(storyId, title);
}

export async function deleteAdventure(storyId: number): Promise<void> {
  await deleteStory(storyId);
}

export async function loadAdventureMessages(
  storyId: number,
): Promise<Message[]> {
  const stored = await getStoryMessages(storyId);
  return stored.map(({ role, content, followups, ended }) => ({
    role,
    content,
    followups: followups ?? undefined,
    ended: ended ?? undefined,
  }));
}

export async function saveMessage(
  storyId: number,
  role: "user" | "assistant",
  content: string,
  followups?: string[],
  ended?: boolean,
): Promise<void> {
  await appendMessage(storyId, role, content, followups ?? null, ended ?? null);
}

const languageNames: Record<Language, string> = {
  english: "English",
  german: "German",
};

function buildSystemPrompt(language: Language): string {
  return `You are the game master of an interactive text adventure.
Rules:
- Narrate in the second person ("you"), in vivid but short paragraphs.
- After each story beat, offer the player two or three distinct choices.
- Continue the story based only on the choice the player makes.
- End the adventure when the player reaches a natural conclusion or makes a fatal choice.
- In structured JSON responses, put the current beat in "story", the choices in "options", and set "ended" to true only when the adventure is over.
- When "ended" is true, return an empty "options" array.
- Write all narration and choices in ${languageNames[language]}.`;
}

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

const withSystemPrompt = (messages: Message[], language: Language) => [
  { role: "system" as const, content: buildSystemPrompt(language) },
  ...messages,
];

/** Requests a single structured adventure beat with choices and end state. */
export async function completeChat(
  messages: Message[],
  language: Language,
): Promise<ChatCompletion> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: withSystemPrompt(messages, language),
    temperature: 0.5,
    max_tokens: 800,
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
