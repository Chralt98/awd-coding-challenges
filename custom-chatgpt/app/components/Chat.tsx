"use client";

import { useState } from "react";
import { type Message } from "../actions";

type ChatProps = {
  messages: Message[];
  onSend: (content: string) => void;
  pending?: boolean;
  ended?: boolean;
  onNewAdventure?: () => void;
};

export default function Chat({
  messages,
  onSend,
  pending = false,
  ended = false,
  onNewAdventure,
}: ChatProps) {
  const [input, setInput] = useState("");

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || pending) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <ul className="flex flex-col gap-3">
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1;
          return (
            <li
              key={index}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <strong className="capitalize">{message.role}:</strong>{" "}
              {message.content}
              {isLast &&
                message.followups &&
                message.followups.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.followups.map((followup, followupIndex) => (
                      <button
                        key={followupIndex}
                        type="button"
                        onClick={() => !pending && onSend(followup)}
                        disabled={pending}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        {followup}
                      </button>
                    ))}
                  </div>
                )}
            </li>
          );
        })}
        {pending && (
          <li className="rounded-lg border border-zinc-200 bg-white p-3 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            <strong className="capitalize">Assistant:</strong> Thinking…
          </li>
        )}
      </ul>
      {ended ? (
        <button
          type="button"
          onClick={onNewAdventure}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Start new adventure
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
