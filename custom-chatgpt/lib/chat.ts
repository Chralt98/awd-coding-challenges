import type { Message } from "../app/actions";

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export const NEW_CHAT_TITLE = "New chat";
export const TITLE_MAX_LENGTH = 40;

export function createChat(): Chat {
  return {
    id: crypto.randomUUID(),
    title: NEW_CHAT_TITLE,
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
