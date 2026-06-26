import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { io } from "socket.io-client";
import { usePollStore } from "./stores/usePollStore";

const socket = io("http://localhost:3000", { autoConnect: false });

function App() {
  const [count, setCount] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const pollId = "poll1";
  const [connected, setConnected] = useState(socket.connected);

  const resultsFromStore = usePollStore((state) => state.results);
  const connectedFromStore = usePollStore((state) => state.connected);
  const joinPollFromStore = usePollStore((state) => state.joinPoll);
  const voteFromStore = usePollStore((state) => state.vote);

  useEffect(() => {
    joinPollFromStore(pollId);
  }, [joinPollFromStore, pollId]);

  useEffect(() => {
    socket.connect();
    // socket.emit("joinPoll", pollId);

    const onResults = (data: Record<string, number>) => {
      setResults(data);
    };
    socket.on("results", onResults);

    return () => {
      socket.off("results", onResults);
      socket.disconnect();
    };
  }, []);

  const voteWithoutRoom = (option: string) => socket.emit("vote", option);
  const voteWithRoom = (option: string) =>
    socket.emit("voteWithRoom", { pollId, option });

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      socket.emit("joinPoll", pollId);
    };
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [pollId]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <button type="button" onClick={() => voteWithoutRoom("pizza")}>
          Emit vote for pizza without room
        </button>
        <button type="button" onClick={() => voteWithRoom("pasta")}>
          Emit vote for pasta with room
        </button>

        <span>{connected ? "Connected" : "Connecting..."}</span>

        <pre>{JSON.stringify(results, null, 2)}</pre>

        <button type="button" onClick={() => voteFromStore("doner")}>
          Emit vote with store for doner with room
        </button>
        <span>
          {connectedFromStore
            ? "Connected from store"
            : "Connecting from store..."}
        </span>
        <pre>{JSON.stringify(resultsFromStore, null, 2)}</pre>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
