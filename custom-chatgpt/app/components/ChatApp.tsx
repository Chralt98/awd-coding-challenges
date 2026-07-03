"use client";

import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { sendChat, type Message } from "../actions";
import ChatView from "./Chat";

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

const NEW_CHAT_TITLE = "New chat";

function createChat(): Chat {
  return {
    id: crypto.randomUUID(),
    title: NEW_CHAT_TITLE,
    messages: [],
  };
}

function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_CHAT_TITLE;
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;
}

export default function ChatApp() {
  const [chats, setChats] = useLocalStorageState<Chat[]>("chats", {
    defaultValue: [createChat()],
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Falls back to the first chat when nothing has been explicitly selected.
  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];

  function updateChat(chatId: string, updater: (chat: Chat) => Chat) {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? updater(chat) : chat)),
    );
  }

  function handleNewChat() {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
  }

  async function handleSend(content: string) {
    const chatId = activeChat.id;
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...activeChat.messages, userMessage];

    updateChat(chatId, (chat) => ({
      ...chat,
      title: chat.messages.length === 0 ? deriveTitle(content) : chat.title,
      messages: updatedMessages,
    }));

    const assistantMessage = await sendChat(updatedMessages);
    updateChat(chatId, (chat) => ({
      ...chat,
      messages: [...updatedMessages, assistantMessage],
    }));
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col gap-2">
        <button onClick={handleNewChat}>+ New chat</button>
        <ul className="flex flex-col gap-1 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                  chat.id === activeChat.id
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex flex-1 justify-center overflow-y-auto">
        <ChatView messages={activeChat.messages} onSend={handleSend} />
      </main>
    </div>
  );
}
