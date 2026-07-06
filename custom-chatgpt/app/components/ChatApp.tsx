"use client";

import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { streamChat, completeChat, type Message } from "../actions";
import {
  type Chat,
  type ChatMode,
  createChat,
  deriveTitle,
  DEFAULT_CHAT_MODE,
} from "../../lib/chat";
import ChatView from "./Chat";

const MODE_LABELS: Record<ChatMode, string> = {
  stream: "Streaming",
  json: "JSON",
};

export default function ChatApp() {
  const [chats, setChats] = useLocalStorageState<Chat[]>("chats", {
    defaultValue: [createChat()],
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newChatMode, setNewChatMode] = useState<ChatMode>(DEFAULT_CHAT_MODE);
  const [pending, setPending] = useState(false);

  // Falls back to the first chat when nothing has been explicitly selected.
  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];

  function updateChat(chatId: string, updater: (chat: Chat) => Chat) {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? updater(chat) : chat)),
    );
  }

  function handleNewChat() {
    const chat = createChat(newChatMode);
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }

  async function handleSend(content: string) {
    if (pending) return;

    const chatId = activeChat.id;
    const mode = activeChat.mode ?? DEFAULT_CHAT_MODE;
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...activeChat.messages, userMessage];

    updateChat(chatId, (chat) => ({
      ...chat,
      title: chat.messages.length === 0 ? deriveTitle(content) : chat.title,
      messages: updatedMessages,
    }));

    setPending(true);
    try {
      if (mode === "json") {
        const { story, options, ended } = await completeChat(updatedMessages);
        const assistantMessage: Message = {
          role: "assistant",
          content: story,
          followups: ended ? [] : options,
          ended,
        };
        updateChat(chatId, (chat) => ({
          ...chat,
          messages: [...updatedMessages, assistantMessage],
        }));
      } else {
        const stream = await streamChat(updatedMessages);
        const reader = stream.getReader();
        let assistantText = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;

          assistantText += value;
          setPending(false);
          const assistantMessage: Message = {
            role: "assistant",
            content: assistantText,
          };
          updateChat(chatId, (chat) => ({
            ...chat,
            messages: [...updatedMessages, assistantMessage],
          }));
        }
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col gap-2 p-2">
        <div className="flex gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            + New chat
          </button>
          <select
            value={newChatMode}
            onChange={(event) => setNewChatMode(event.target.value as ChatMode)}
            aria-label="New chat mode"
            className="rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="stream">{MODE_LABELS.stream}</option>
            <option value="json">{MODE_LABELS.json}</option>
          </select>
        </div>
        <ul className="flex flex-col gap-1 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => setActiveChatId(chat.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  chat.id === activeChat.id
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="truncate">{chat.title}</span>
                <span className="ml-auto shrink-0 rounded bg-zinc-300 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                  {MODE_LABELS[chat.mode ?? DEFAULT_CHAT_MODE]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex flex-1 justify-center overflow-y-auto">
        <ChatView
          messages={activeChat.messages}
          onSend={handleSend}
          pending={pending}
        />
      </main>
    </div>
  );
}
