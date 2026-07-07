"use client";

import { useEffect, useState } from "react";
import {
  startAdventure,
  listAdventures,
  loadAdventureMessages,
  completeChat,
  saveMessage,
  updateStoryTitle,
  type Message,
} from "../actions";
import type { Story } from "../../lib/stories";
import { deriveTitle } from "../../lib/chat";
import ChatView from "./Chat";

export default function ChatApp() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    listAdventures().then(setStories);
  }, []);

  const activeStory = stories.find((story) => story.id === activeStoryId);
  const lastMessage = messages[messages.length - 1];
  const ended = lastMessage?.role === "assistant" && lastMessage.ended === true;

  async function handleNewAdventure() {
    if (starting) return;
    setStarting(true);
    try {
      const story = await startAdventure();
      setStories((prev) => [story, ...prev]);
      setActiveStoryId(story.id);
      setMessages([]);
    } finally {
      setStarting(false);
    }
  }

  async function handleSelectStory(story: Story) {
    if (pending) return;
    setActiveStoryId(story.id);
    const loaded = await loadAdventureMessages(story.id);
    setMessages(loaded);
  }

  async function handleSend(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending || activeStoryId === null) return;

    const isFirstMessage = messages.length === 0;
    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (isFirstMessage) {
      const title = deriveTitle(trimmed);
      setStories((prev) =>
        prev.map((story) =>
          story.id === activeStoryId ? { ...story, title } : story,
        ),
      );
      void updateStoryTitle(activeStoryId, title);
    }

    setPending(true);
    try {
      const result = await completeChat(updatedMessages);
      const assistantMessage: Message = {
        role: "assistant",
        content: result.story,
        followups: result.options,
        ended: result.ended,
      };
      setMessages([...updatedMessages, assistantMessage]);
      await Promise.all([
        saveMessage(activeStoryId, "user", trimmed),
        saveMessage(
          activeStoryId,
          "assistant",
          result.story,
          result.options,
          result.ended,
        ),
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col gap-2 p-2">
        <button
          onClick={handleNewAdventure}
          disabled={starting}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {starting ? "Starting…" : "+ New adventure"}
        </button>
        <ul className="flex flex-col gap-1 overflow-y-auto">
          {stories.map((story) => (
            <li key={story.id}>
              <button
                onClick={() => handleSelectStory(story)}
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                  story.id === activeStoryId
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {story.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex flex-1 justify-center overflow-y-auto">
        {activeStory ? (
          <ChatView
            messages={messages}
            onSend={handleSend}
            pending={pending}
            ended={ended}
            onNewAdventure={handleNewAdventure}
          />
        ) : (
          <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Start a new adventure or pick one from the sidebar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
