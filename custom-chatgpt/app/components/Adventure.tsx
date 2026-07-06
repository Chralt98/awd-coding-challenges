"use client";

import { useState } from "react";
import {
  startAdventure,
  completeChat,
  saveMessage,
  type Message,
  type ChatCompletion,
} from "../actions";

export default function Adventure() {
  const [storyId, setStoryId] = useState<number | null>(null);
  const [openingPrompt, setOpeningPrompt] = useState("");
  const [starting, setStarting] = useState(false);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beat, setBeat] = useState<ChatCompletion | null>(null);

  async function handleStart() {
    if (starting) return;
    setStarting(true);
    try {
      const result = await startAdventure();
      setStoryId(result.id);
    } finally {
      setStarting(false);
    }
  }

  async function handleOpeningSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const trimmed = openingPrompt.trim();
    if (!trimmed || sending) return;

    setPromptSubmitted(true);
    setSending(true);
    try {
      const userMessage: Message = { role: "user", content: trimmed };
      const result = await completeChat([userMessage]);
      const assistantMessage: Message = {
        role: "assistant",
        content: result.story,
        followups: result.options,
        ended: result.ended,
      };
      setMessages([userMessage, assistantMessage]);
      setBeat(result);
    } finally {
      setSending(false);
    }
  }

  async function handleOptionClick(option: string) {
    if (sending || storyId === null) return;

    setSending(true);
    try {
      const userMessage: Message = { role: "user", content: option };
      const updatedMessages = [...messages, userMessage];
      const result = await completeChat(updatedMessages);
      const assistantMessage: Message = {
        role: "assistant",
        content: result.story,
        followups: result.options,
        ended: result.ended,
      };
      setMessages([...updatedMessages, assistantMessage]);
      setBeat(result);
      await Promise.all([
        saveMessage(storyId, "user", option),
        saveMessage(storyId, "assistant", result.story),
      ]);
    } finally {
      setSending(false);
    }
  }

  async function handleRestart() {
    setMessages([]);
    setBeat(null);
    setOpeningPrompt("");
    setPromptSubmitted(false);
    await handleStart();
  }

  const isEnded = beat !== null && (beat.ended || beat.options.length === 0);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      {storyId === null ? (
        <button
          onClick={handleStart}
          disabled={starting}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {starting ? "Starting…" : "Start new adventure"}
        </button>
      ) : !promptSubmitted ? (
        <form onSubmit={handleOpeningSubmit} className="flex flex-col gap-2">
          <label
            htmlFor="opening-prompt"
            className="text-sm text-zinc-600 dark:text-zinc-400"
          >
            How does your adventure begin?
          </label>
          <input
            id="opening-prompt"
            value={openingPrompt}
            onChange={(event) => setOpeningPrompt(event.target.value)}
            placeholder="You wake in a dim forest clearing…"
            autoFocus
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="rounded-lg border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            {beat ? beat.story : "Generating the opening scene…"}
          </p>
          {beat &&
            (isEnded ? (
              <button
                onClick={handleRestart}
                disabled={starting}
                className="self-start rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {starting ? "Starting…" : "Start new adventure"}
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                {beat.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    disabled={sending}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
