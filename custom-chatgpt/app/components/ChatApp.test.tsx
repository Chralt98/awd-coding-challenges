import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../actions", () => ({
  getCurrentUser: vi.fn(),
  listAdventures: vi.fn(),
  startAdventure: vi.fn(),
  loadAdventureMessages: vi.fn(),
  completeChat: vi.fn(),
  saveMessages: vi.fn(),
  updateStoryTitle: vi.fn(),
  deleteAdventure: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
}));

import {
  completeChat,
  getCurrentUser,
  listAdventures,
  loadAdventureMessages,
  loginUser,
  logoutUser,
  saveMessages,
  updateStoryTitle,
} from "../actions";
import ChatApp from "./ChatApp";

const loggedInUser = { id: 1, email: "jane@example.com" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ChatApp, logged-in on mount", () => {
  it("calls both getCurrentUser and listAdventures on mount", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(loggedInUser);
    vi.mocked(listAdventures).mockResolvedValue([]);

    render(<ChatApp />);

    expect(await screen.findByText("jane@example.com")).toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalled();
    expect(listAdventures).toHaveBeenCalled();
  });
});

describe("ChatApp, logged-out on mount", () => {
  it("gates the sidebar behind AuthForm and never calls listAdventures", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    render(<ChatApp />);

    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
    expect(listAdventures).not.toHaveBeenCalled();
  });

  it("re-fetches listAdventures after a successful login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    vi.mocked(loginUser).mockResolvedValue(loggedInUser);
    vi.mocked(listAdventures).mockResolvedValue([]);

    render(<ChatApp />);

    await screen.findByLabelText(/email/i);
    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("jane@example.com")).toBeInTheDocument();
    expect(listAdventures).toHaveBeenCalledTimes(1);
  });
});

describe("ChatApp, logout", () => {
  it("clears session state and gates the sidebar again after logout", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(loggedInUser);
    vi.mocked(listAdventures).mockResolvedValue([]);
    vi.mocked(logoutUser).mockResolvedValue(undefined);

    render(<ChatApp />);

    await userEvent.click(
      await screen.findByRole("button", { name: /jane@example.com/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(logoutUser).toHaveBeenCalled();
    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
  });
});

describe("ChatApp, first message title update", () => {
  it("rolls back the optimistic sidebar title when persisting it fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(loggedInUser);
    vi.mocked(listAdventures).mockResolvedValue([
      {
        id: 1,
        title: "New adventure",
        created: new Date(),
        language: "english",
      },
    ]);
    vi.mocked(loadAdventureMessages).mockResolvedValue([]);
    vi.mocked(updateStoryTitle).mockRejectedValue(
      new Error("Could not save title."),
    );

    render(<ChatApp />);

    await userEvent.click(
      await screen.findByRole("button", { name: "New adventure" }),
    );
    await userEvent.type(
      await screen.findByPlaceholderText("Describe how your story begins…"),
      "A lighthouse keeper finds a brass key",
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText(/Could not save title\./)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New adventure" }),
    ).toBeInTheDocument();
    expect(completeChat).not.toHaveBeenCalled();
    expect(saveMessages).not.toHaveBeenCalled();
  });
});

describe("ChatApp sidebar layout", () => {
  it("pins the UserMenu below a scrollable story list via mt-auto", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(loggedInUser);
    vi.mocked(listAdventures).mockResolvedValue([]);

    render(<ChatApp />);

    const userMenuLabel = await screen.findByText("jane@example.com");
    const pinnedContainer = userMenuLabel.closest(".mt-auto");
    expect(pinnedContainer).not.toBeNull();

    const scrollableList = document.querySelector(".flex-1.overflow-y-auto");
    expect(scrollableList).not.toBeNull();
  });
});
