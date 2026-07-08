import sql from "./db";

export type User = {
  id: number;
  email: string;
  password_hash: string;
  created: Date;
};

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`);
    this.name = "DuplicateEmailError";
  }
}

const UNIQUE_VIOLATION = "23505";

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<User> {
  const normalizedEmail = email.toLowerCase();
  try {
    const [user] = await sql<User[]>`
      INSERT INTO users (email, password_hash)
      VALUES (${normalizedEmail}, ${passwordHash})
      RETURNING id, email, password_hash, created
    `;
    return user;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === UNIQUE_VIOLATION) {
      throw new DuplicateEmailError(normalizedEmail);
    }
    throw err;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await sql<User[]>`
    SELECT id, email, password_hash, created
    FROM users
    WHERE email = ${email.toLowerCase()}
  `;
  return user ?? null;
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await sql<User[]>`
    SELECT id, email, password_hash, created
    FROM users
    WHERE id = ${id}
  `;
  return user ?? null;
}
