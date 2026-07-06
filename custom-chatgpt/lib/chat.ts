import type { Message } from "../app/actions";

/** How a chat talks to the model: live plain-text tokens vs. one structured JSON response. */
export type ChatMode = "stream" | "json";

export type Chat = {
  id: string;
  title: string;
  mode: ChatMode;
  messages: Message[];
};

export const NEW_CHAT_TITLE = "New chat";
export const TITLE_MAX_LENGTH = 40;
export const DEFAULT_CHAT_MODE: ChatMode = "stream";

export function createChat(mode: ChatMode = DEFAULT_CHAT_MODE): Chat {
  return {
    id: crypto.randomUUID(),
    title: NEW_CHAT_TITLE,
    mode,
    messages: [],
  };
}

/** Derives a readable sidebar title from a chat's first user message. */
export function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_CHAT_TITLE;
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH)}...`
    : trimmed;
}
