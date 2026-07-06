"use client";

import { useState } from "react";
import { startAdventure } from "../actions";

export default function Adventure() {
  const [storyId, setStoryId] = useState<number | null>(null);
  const [openingPrompt, setOpeningPrompt] = useState("");
  const [starting, setStarting] = useState(false);

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

  function handleOpeningSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO (next step): send `openingPrompt` as the first user message, request
    // the opening beat, and hide this input for the rest of the adventure.
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      {storyId === null ? (
        <>
          <button
            onClick={handleStart}
            disabled={starting}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {starting ? "Starting…" : "Start new adventure"}
          </button>
        </>
      ) : (
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
      )}
    </div>
  );
}
