import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/openai", () => ({
  default: { chat: { completions: { create: vi.fn() } } },
}));

vi.mock("../lib/auth", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  getCurrentUserId: vi.fn(),
  MIN_PASSWORD_LENGTH: 8,
}));

vi.mock("../lib/users", () => ({
  createUser: vi.fn(),
  getUserByEmail: vi.fn(),
  getUserById: vi.fn(),
  DuplicateEmailError: class DuplicateEmailError extends Error {},
}));

vi.mock("../lib/stories", () => ({
  createStory: vi.fn(),
  appendMessage: vi.fn(),
  getStoryMessages: vi.fn(),
  listStories: vi.fn(),
  updateStoryTitle: vi.fn(),
  deleteStory: vi.fn(),
  NotFoundError: class NotFoundError extends Error {},
}));

import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUserId,
} from "../lib/auth";
import {
  createUser,
  getUserByEmail,
  getUserById,
  DuplicateEmailError,
} from "../lib/users";
import {
  createStory,
  appendMessage,
  getStoryMessages,
  listStories,
  updateStoryTitle as updateStoryTitleDb,
  deleteStory,
} from "../lib/stories";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  startAdventure,
  listAdventures,
  updateStoryTitle,
  deleteAdventure,
  loadAdventureMessages,
  saveMessages,
} from "./actions";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerUser", () => {
  it("hashes the password, creates the user, sets a session, and returns the public shape", async () => {
    vi.mocked(hashPassword).mockResolvedValue("hashed");
    vi.mocked(createUser).mockResolvedValue({
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    });

    const user = await registerUser("jane@example.com", "password123");

    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(createUser).toHaveBeenCalledWith("jane@example.com", "hashed");
    expect(setSessionCookie).toHaveBeenCalledWith(1);
    expect(user).toEqual({ id: 1, email: "jane@example.com" });
    expect(user).not.toHaveProperty("password_hash");
  });

  it("surfaces a user-facing error on duplicate email and does not set a session", async () => {
    vi.mocked(hashPassword).mockResolvedValue("hashed");
    vi.mocked(createUser).mockRejectedValue(
      new DuplicateEmailError("jane@example.com"),
    );

    await expect(
      registerUser("jane@example.com", "password123"),
    ).rejects.toThrow();
    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it("rejects an invalid email format before hitting the database", async () => {
    await expect(registerUser("not-an-email", "password123")).rejects.toThrow();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("rejects a password below the minimum length before hashing", async () => {
    await expect(registerUser("jane@example.com", "short")).rejects.toThrow();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });
});

describe("loginUser", () => {
  it("sets a session and returns the public shape for correct credentials", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue({
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    });
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const user = await loginUser("jane@example.com", "password123");

    expect(setSessionCookie).toHaveBeenCalledWith(1);
    expect(user).toEqual({ id: 1, email: "jane@example.com" });
  });

  it("rejects a wrong password with a generic error and sets no session", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue({
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    });
    vi.mocked(verifyPassword).mockResolvedValue(false);

    await expect(
      loginUser("jane@example.com", "wrongpassword"),
    ).rejects.toThrow("Invalid email or password");
    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it("rejects a nonexistent email with the identical generic error", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue(null);

    await expect(
      loginUser("nobody@example.com", "password123"),
    ).rejects.toThrow("Invalid email or password");
    expect(setSessionCookie).not.toHaveBeenCalled();
  });
});

describe("logoutUser", () => {
  it("clears the session cookie", async () => {
    await logoutUser();
    expect(clearSessionCookie).toHaveBeenCalled();
  });

  it("is a no-op when already logged out", async () => {
    vi.mocked(clearSessionCookie).mockResolvedValue(undefined);
    await expect(logoutUser()).resolves.toBeUndefined();
  });
});

describe("getCurrentUser", () => {
  it("returns the public shape for a valid session", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(1);
    vi.mocked(getUserById).mockResolvedValue({
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    });

    expect(await getCurrentUser()).toEqual({ id: 1, email: "jane@example.com" });
  });

  it("returns null, not a throw, when there is no session", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });
});

describe("scoped adventure actions require a session", () => {
  it("startAdventure throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(startAdventure("english")).rejects.toThrow();
    expect(createStory).not.toHaveBeenCalled();
  });

  it("listAdventures throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(listAdventures()).rejects.toThrow();
    expect(listStories).not.toHaveBeenCalled();
  });

  it("updateStoryTitle throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(updateStoryTitle(1, "title")).rejects.toThrow();
    expect(updateStoryTitleDb).not.toHaveBeenCalled();
  });

  it("deleteAdventure throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(deleteAdventure(1)).rejects.toThrow();
    expect(deleteStory).not.toHaveBeenCalled();
  });

  it("loadAdventureMessages throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(loadAdventureMessages(1)).rejects.toThrow();
    expect(getStoryMessages).not.toHaveBeenCalled();
  });

  it("saveMessages throws Unauthorized and never touches the DAL when logged out", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    await expect(
      saveMessages(1, "hi", { story: "beat", options: [], ended: false }),
    ).rejects.toThrow();
    expect(appendMessage).not.toHaveBeenCalled();
  });
});

describe("scoped adventure actions happy path", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUserId).mockResolvedValue(7);
  });

  it("startAdventure passes the session's userId to the DAL", async () => {
    vi.mocked(createStory).mockResolvedValue({
      id: 1,
      title: "New adventure",
      created: new Date(),
      language: "english",
    });
    await startAdventure("english");
    expect(createStory).toHaveBeenCalledWith("New adventure", "english", 7);
  });

  it("listAdventures passes the session's userId, never a client-supplied one", async () => {
    vi.mocked(listStories).mockResolvedValue([]);
    await listAdventures();
    expect(listStories).toHaveBeenCalledWith(7);
  });

  it("updateStoryTitle passes storyId, title, and the session's userId", async () => {
    vi.mocked(updateStoryTitleDb).mockResolvedValue(undefined);
    await updateStoryTitle(1, "title");
    expect(updateStoryTitleDb).toHaveBeenCalledWith(1, "title", 7);
  });

  it("deleteAdventure passes storyId and the session's userId", async () => {
    vi.mocked(deleteStory).mockResolvedValue(undefined);
    await deleteAdventure(1);
    expect(deleteStory).toHaveBeenCalledWith(1, 7);
  });

  it("loadAdventureMessages passes storyId and the session's userId", async () => {
    vi.mocked(getStoryMessages).mockResolvedValue([]);
    await loadAdventureMessages(1);
    expect(getStoryMessages).toHaveBeenCalledWith(1, 7);
  });

  it("saveMessages persists both the user and assistant messages in one call", async () => {
    vi.mocked(appendMessage).mockResolvedValue({
      id: 1,
      role: "user",
      content: "hi",
      followups: null,
      ended: null,
    });

    await saveMessages(1, "hi", { story: "beat", options: ["a"], ended: false });

    expect(appendMessage).toHaveBeenCalledTimes(2);
    expect(appendMessage).toHaveBeenNthCalledWith(1, 1, "user", "hi", null, null, 7);
    expect(appendMessage).toHaveBeenNthCalledWith(
      2,
      1,
      "assistant",
      "beat",
      ["a"],
      false,
      7,
    );
  });

  it("propagates the DAL's ownership violation as an error the UI can show", async () => {
    const { NotFoundError } = await import("../lib/stories");
    vi.mocked(updateStoryTitleDb).mockRejectedValue(new NotFoundError());
    await expect(updateStoryTitle(1, "title")).rejects.toThrow();
  });
});
