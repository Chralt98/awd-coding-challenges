"use server";

import openai from "../lib/openai";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUserId,
  MIN_PASSWORD_LENGTH,
} from "../lib/auth";
import {
  createUser,
  getUserByEmail,
  getUserById,
  DuplicateEmailError,
  type User,
} from "../lib/users";
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

export type PublicUser = {
  id: number;
  email: string;
};

function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

export async function registerUser(
  email: string,
  password: string,
): Promise<PublicUser> {
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    );
  }

  const passwordHash = await hashPassword(password);
  let user: User;
  try {
    user = await createUser(email, passwordHash);
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      throw new Error("An account with this email already exists.");
    }
    throw err;
  }

  await setSessionCookie(user.id);
  return toPublicUser(user);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<PublicUser> {
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE);
  }

  await setSessionCookie(user.id);
  return toPublicUser(user);
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getCurrentUserId();
  if (userId === null) return null;
  const user = await getUserById(userId);
  return user ? toPublicUser(user) : null;
}

class UnauthorizedError extends Error {
  constructor() {
    super("You must be logged in to do that.");
    this.name = "UnauthorizedError";
  }
}

async function requireUserId(): Promise<number> {
  const userId = await getCurrentUserId();
  if (userId === null) throw new UnauthorizedError();
  return userId;
}

export async function startAdventure(language: Language): Promise<Story> {
  const userId = await requireUserId();
  return await createStory("New adventure", language, userId);
}

export async function listAdventures(): Promise<Story[]> {
  const userId = await requireUserId();
  return listStories(userId);
}

export async function updateStoryTitle(
  storyId: number,
  title: string,
): Promise<void> {
  const userId = await requireUserId();
  await updateStoryTitleDb(storyId, title, userId);
}

export async function deleteAdventure(storyId: number): Promise<void> {
  const userId = await requireUserId();
  await deleteStory(storyId, userId);
}

export async function loadAdventureMessages(
  storyId: number,
): Promise<Message[]> {
  const userId = await requireUserId();
  const stored = await getStoryMessages(storyId, userId);
  return stored.map(({ role, content, followups, ended }) => ({
    role,
    content,
    followups: followups ?? undefined,
    ended: ended ?? undefined,
  }));
}

/** Persists a user turn and the resulting assistant beat in a single action call. */
export async function saveMessages(
  storyId: number,
  userContent: string,
  completion: ChatCompletion,
): Promise<void> {
  const userId = await requireUserId();
  await appendMessage(storyId, "user", userContent, null, null, userId);
  await appendMessage(
    storyId,
    "assistant",
    completion.story,
    completion.options,
    completion.ended,
    userId,
  );
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
