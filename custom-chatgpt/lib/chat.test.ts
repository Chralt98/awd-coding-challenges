import { describe, it, expect } from "vitest";
import {
  createChat,
  deriveTitle,
  NEW_CHAT_TITLE,
  TITLE_MAX_LENGTH,
} from "./chat";

describe("deriveTitle", () => {
  it("uses the message verbatim when it is short", () => {
    expect(deriveTitle("Hello there")).toBe("Hello there");
  });

  it("trims surrounding whitespace", () => {
    expect(deriveTitle("  spaced out  ")).toBe("spaced out");
  });

  it("falls back to the placeholder for empty or whitespace-only input", () => {
    expect(deriveTitle("")).toBe(NEW_CHAT_TITLE);
    expect(deriveTitle("   ")).toBe(NEW_CHAT_TITLE);
  });

  it("keeps a title exactly at the limit unchanged", () => {
    const exact = "a".repeat(TITLE_MAX_LENGTH);
    expect(deriveTitle(exact)).toBe(exact);
  });

  it("truncates and ellipsizes titles over the limit", () => {
    const long = "a".repeat(TITLE_MAX_LENGTH + 5);
    const result = deriveTitle(long);
    expect(result).toBe(`${"a".repeat(TITLE_MAX_LENGTH)}...`);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("createChat", () => {
  it("creates an empty chat with the placeholder title and a unique id", () => {
    const a = createChat();
    const b = createChat();

    expect(a.title).toBe(NEW_CHAT_TITLE);
    expect(a.messages).toEqual([]);
    expect(a.id).toEqual(expect.any(String));
    expect(a.id).not.toBe(b.id);
  });
});
