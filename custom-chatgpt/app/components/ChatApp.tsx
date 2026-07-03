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

  return <div className="flex h-screen w-full"></div>;
}
