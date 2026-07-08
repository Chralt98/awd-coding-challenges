import { describe, it, expect, beforeEach, vi } from "vitest";

const { sqlMock } = vi.hoisted(() => ({ sqlMock: vi.fn() }));

vi.mock("./db", () => ({
  default: sqlMock,
}));

import {
  createStory,
  listStories,
  updateStoryTitle,
  deleteStory,
  getStoryMessages,
  appendMessage,
  NotFoundError,
} from "./stories";

function queryText(callIndex = 0): string {
  const [strings] = sqlMock.mock.calls[callIndex];
  return strings.join("?");
}

function queryValues(callIndex = 0): unknown[] {
  const [, ...values] = sqlMock.mock.calls[callIndex];
  return values;
}

beforeEach(() => {
  sqlMock.mockReset();
});

describe("createStory", () => {
  it("inserts a row scoped to the given userId", async () => {
    const row = { id: 1, title: "New adventure", created: new Date(), language: "english" };
    sqlMock.mockResolvedValueOnce([row]);

    const story = await createStory("New adventure", "english", 7);

    expect(story).toEqual(row);
    expect(queryValues()).toContain(7);
  });
});

describe("listStories", () => {
  it("filters by user_id in the query", async () => {
    sqlMock.mockResolvedValueOnce([]);
    await listStories(7);

    expect(queryText()).toMatch(/user_id/);
    expect(queryValues()).toContain(7);
  });

  it("returns [] rather than null for a user with zero stories", async () => {
    sqlMock.mockResolvedValueOnce([]);
    expect(await listStories(7)).toEqual([]);
  });
});

describe("updateStoryTitle", () => {
  it("updates the row when the caller owns the story", async () => {
    sqlMock.mockResolvedValueOnce([{ id: 1 }]);
    await expect(updateStoryTitle(1, "New title", 7)).resolves.toBeUndefined();
    expect(queryText()).toMatch(/user_id/);
    expect(queryValues()).toEqual(expect.arrayContaining([1, "New title", 7]));
  });

  it("throws NotFoundError when a non-owner targets someone else's storyId", async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(updateStoryTitle(1, "New title", 999)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("deleteStory", () => {
  it("deletes the row when the caller owns the story", async () => {
    sqlMock.mockResolvedValueOnce([{ id: 1 }]);
    await expect(deleteStory(1, 7)).resolves.toBeUndefined();
    expect(queryText()).toMatch(/user_id/);
    expect(queryValues()).toEqual(expect.arrayContaining([1, 7]));
  });

  it("throws NotFoundError and deletes nothing when a non-owner attempts the delete", async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(deleteStory(1, 999)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("getStoryMessages", () => {
  it("returns messages for the owning user", async () => {
    const row = { id: 1, role: "user", content: "hi", followups: null, ended: null };
    sqlMock.mockResolvedValueOnce([{ id: 1 }]); // ownership check
    sqlMock.mockResolvedValueOnce([row]); // message fetch
    expect(await getStoryMessages(1, 7)).toEqual([row]);
    expect(queryText(0)).toMatch(/user_id/);
  });

  it("throws NotFoundError rather than leaking another user's messages", async () => {
    sqlMock.mockResolvedValueOnce([]); // ownership check fails
    await expect(getStoryMessages(1, 999)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("appendMessage", () => {
  it("inserts a message when the caller owns the story", async () => {
    const row = { id: 1, role: "user", content: "hi", followups: null, ended: null };
    sqlMock.mockResolvedValueOnce([row]);

    const message = await appendMessage(1, "user", "hi", null, null, 7);

    expect(message).toEqual(row);
    expect(queryText()).toMatch(/user_id/);
  });

  it("throws NotFoundError and inserts nothing for a non-owner storyId", async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(
      appendMessage(1, "user", "hi", null, null, 999),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
