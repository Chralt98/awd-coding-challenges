"use client";

import { useState } from "react";
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

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(() => [createChat()]);

  function handleNewChat() {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col gap-2">
        <button onClick={handleNewChat}>+ New chat</button>
        <ul className="flex flex-col gap-1 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
