import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

type PollState = {
  results: Record<string, number>;
  connected: boolean;
  pollId: string | null;
  joinPoll: (pollId: string) => void;
  vote: (option: string) => void;
};

export const usePollStore = create<PollState>()((set, get) => {
  // Registered once, because the store is created once.
  socket.on("connect", () => {
    set({ connected: true });
    const { pollId } = get();
    if (pollId) socket.emit("joinPoll", pollId); // re-join on every (re)connection
  });
  socket.on("disconnect", () => set({ connected: false }));
  socket.on("results", (results: Record<string, number>) => set({ results }));

  return {
    results: {},
    connected: false,
    pollId: null,

    joinPoll: (pollId) => {
      set({ pollId });
      if (socket.connected) {
        socket.emit("joinPoll", pollId);
      } else {
        socket.connect();
      }
    },

    vote: (option) => socket.emit("vote", { pollId: get().pollId, option }),
  };
});
