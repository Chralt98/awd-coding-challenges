// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignJWT } from "jose";

vi.stubEnv("SESSION_SECRET", "test-secret-do-not-use-in-production");

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookieStore)),
}));

import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUserId,
  SESSION_COOKIE_NAME,
} from "./auth";

describe("hashPassword", () => {
  it("returns a bcrypt hash, not the plaintext", async () => {
    const hash = await hashPassword("password123");
    expect(hash).not.toBe("password123");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("produces a different hash each time due to random salt", async () => {
    const [a, b] = await Promise.all([
      hashPassword("password123"),
      hashPassword("password123"),
    ]);
    expect(a).not.toBe(b);
  });

  it("rejects a password shorter than the minimum length", async () => {
    await expect(hashPassword("1234567")).rejects.toThrow();
  });

  it("accepts a password at the minimum length boundary", async () => {
    await expect(hashPassword("12345678")).resolves.toEqual(
      expect.any(String),
    );
  });
});

describe("verifyPassword", () => {
  it("returns true for the correct password", async () => {
    const hash = await hashPassword("password123");
    expect(await verifyPassword("password123", hash)).toBe(true);
  });

  it("returns false for the wrong password", async () => {
    const hash = await hashPassword("password123");
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("returns false, not a throw, for a malformed hash", async () => {
    await expect(verifyPassword("password123", "not-a-hash")).resolves.toBe(
      false,
    );
  });

  it("is case-sensitive", async () => {
    const hash = await hashPassword("Password1");
    expect(await verifyPassword("password1", hash)).toBe(false);
  });
});

describe("createSessionToken / verifySessionToken", () => {
  it("round-trips to the same userId", async () => {
    const token = await createSessionToken(42);
    expect(await verifySessionToken(token)).toBe(42);
  });

  it("produces different tokens for different userIds", async () => {
    const [a, b] = await Promise.all([
      createSessionToken(1),
      createSessionToken(2),
    ]);
    expect(a).not.toBe(b);
  });

  it("returns null for a tampered token", async () => {
    const token = await createSessionToken(42);
    const tampered = token.slice(0, -2) + (token.at(-2) === "a" ? "b" : "a");
    expect(await verifySessionToken(tampered)).toBeNull();
  });

  it("returns null for an expired token", async () => {
    const secret = new TextEncoder().encode(
      "test-secret-do-not-use-in-production",
    );
    const expired = await new SignJWT({ userId: 42 })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
      .sign(secret);
    expect(await verifySessionToken(expired)).toBeNull();
  });

  it("returns null for an empty or undefined token", async () => {
    expect(await verifySessionToken("")).toBeNull();
    expect(await verifySessionToken(undefined as unknown as string)).toBeNull();
  });

  it("returns null for a token signed with a different secret", async () => {
    const otherSecret = new TextEncoder().encode("a-completely-different-secret");
    const token = await new SignJWT({ userId: 42 })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(otherSecret);
    expect(await verifySessionToken(token)).toBeNull();
  });
});

describe("session cookie helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCurrentUserId returns null when no cookie is set", async () => {
    cookieStore.get.mockReturnValue(undefined);
    expect(await getCurrentUserId()).toBeNull();
  });

  it("getCurrentUserId returns the userId for a valid session cookie", async () => {
    const token = await createSessionToken(42);
    cookieStore.get.mockReturnValue({ name: SESSION_COOKIE_NAME, value: token });
    expect(await getCurrentUserId()).toBe(42);
  });

  it("getCurrentUserId returns null for a tampered cookie value", async () => {
    cookieStore.get.mockReturnValue({
      name: SESSION_COOKIE_NAME,
      value: "garbage",
    });
    expect(await getCurrentUserId()).toBeNull();
  });

  it("setSessionCookie sets an httpOnly, secure cookie with the session token", async () => {
    await setSessionCookie(42);
    expect(cookieStore.set).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      }),
    );
    const [, token] = cookieStore.set.mock.calls[0];
    expect(await verifySessionToken(token)).toBe(42);
  });

  it("clearSessionCookie deletes the session cookie", async () => {
    await clearSessionCookie();
    expect(cookieStore.delete).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
  });
});
