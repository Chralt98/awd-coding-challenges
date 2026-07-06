"use client";

import { useState } from "react";
import {
  startAdventure,
  completeChat,
  type Message,
  type ChatCompletion,
} from "../actions";

export default function Adventure() {
  const [storyId, setStoryId] = useState<number | null>(null);
  const [openingPrompt, setOpeningPrompt] = useState("");
  const [starting, setStarting] = useState(false);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
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
      setBeat(result);
    } finally {
      setSending(false);
    }
  }

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
        // TODO (next step): render `beat.story` properly and each `beat.options`
        // entry as a button.
        <p className="text-zinc-900 dark:text-zinc-100">
          {sending ? "Generating the opening scene…" : beat?.story}
        </p>
      )}
    </div>
  );
}
