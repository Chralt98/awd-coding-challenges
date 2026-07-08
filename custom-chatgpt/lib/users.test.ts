import { describe, it, expect, vi, beforeEach } from "vitest";

const { sqlMock } = vi.hoisted(() => ({ sqlMock: vi.fn() }));

vi.mock("./db", () => ({
  default: sqlMock,
}));

import { createUser, getUserByEmail, getUserById, DuplicateEmailError } from "./users";

describe("createUser", () => {
  beforeEach(() => {
    sqlMock.mockReset();
  });

  it("inserts and returns the created user, lowercasing the email", async () => {
    const row = {
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    };
    sqlMock.mockResolvedValueOnce([row]);

    const user = await createUser("Jane@Example.com", "hashed");

    expect(user).toEqual(row);
  });

  it("translates a duplicate-email unique-violation into DuplicateEmailError", async () => {
    sqlMock.mockRejectedValueOnce(
      Object.assign(new Error("duplicate key value"), { code: "23505" }),
    );

    await expect(createUser("jane@example.com", "hashed")).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );
  });

  it("rethrows unrelated database errors unchanged", async () => {
    const dbError = Object.assign(new Error("connection lost"), {
      code: "08006",
    });
    sqlMock.mockRejectedValueOnce(dbError);

    await expect(createUser("jane@example.com", "hashed")).rejects.toBe(dbError);
  });
});

describe("getUserByEmail", () => {
  beforeEach(() => {
    sqlMock.mockReset();
  });

  it("returns the user row for an existing email", async () => {
    const row = {
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    };
    sqlMock.mockResolvedValueOnce([row]);

    expect(await getUserByEmail("jane@example.com")).toEqual(row);
  });

  it("returns null, not undefined, for a non-existent email", async () => {
    sqlMock.mockResolvedValueOnce([]);

    expect(await getUserByEmail("nobody@example.com")).toBeNull();
  });

  it("matches case-insensitively by lowercasing the lookup", async () => {
    sqlMock.mockResolvedValueOnce([]);
    await getUserByEmail("Jane@Example.com");
    const [, ...values] = sqlMock.mock.calls[0];
    expect(values).toContain("jane@example.com");
  });
});

describe("getUserById", () => {
  beforeEach(() => {
    sqlMock.mockReset();
  });

  it("returns the user row for an existing id", async () => {
    const row = {
      id: 1,
      email: "jane@example.com",
      password_hash: "hashed",
      created: new Date(),
    };
    sqlMock.mockResolvedValueOnce([row]);

    expect(await getUserById(1)).toEqual(row);
  });

  it("returns null for a non-existent id", async () => {
    sqlMock.mockResolvedValueOnce([]);

    expect(await getUserById(999)).toBeNull();
  });
});
