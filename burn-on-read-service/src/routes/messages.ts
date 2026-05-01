import { Router } from "express";
import { randomBytes } from "node:crypto";
import path from "node:path";
import {
  access,
  constants,
  mkdir,
  writeFile,
  readFile,
  rm,
} from "node:fs/promises";

const MESSAGES_DIR = path.join(process.cwd(), "messages");

const router = Router();

router.get("/created", (req, res) => {
  const messageToken = req.query.messageToken;

  if (typeof messageToken !== "string" || !messageToken) {
    res.redirect("/");
    return;
  }

  res.render("message-created.html", { messageToken });
});

router.get("/:messageToken", async (req, res) => {
  const { messageToken } = req.params;

  if (typeof messageToken !== "string" || !messageToken) {
    res.redirect("/");
    return;
  }

  const messageFile = path.join(MESSAGES_DIR, messageToken + ".txt");
  let message: string;
  try {
    // Read the message file and delete it immediately after reading to ensure it's a one-time access
    message = await readFile(messageFile, { encoding: "utf-8" });
    await rm(messageFile);
  } catch (err) {
    res.status(404).render("message-not-found.html");
    return;
  }

  res.render("message-shown.html", { message });
});

function sanitizeMessage(message: string): string {
  // Basic sanitization to prevent XSS attacks. In a real implementation, consider using a library like DOMPurify for more robust sanitization.
  return message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function generateMessageToken(): string {
  return randomBytes(32).toString("hex");
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureMessagesDirectoryExists(): Promise<void> {
  try {
    await access(MESSAGES_DIR, constants.F_OK);
  } catch {
    await mkdir(MESSAGES_DIR, { recursive: true });
  }
}

async function writeMessageFile(
  filePath: string,
  message: string,
): Promise<void> {
  await ensureMessagesDirectoryExists();
  const exists = await fileExists(filePath);

  if (!exists) {
    await writeFile(filePath, message, { encoding: "utf-8" });
  }
}

router.post("/save", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).render("index.html", {
      error: "Message is required",
    });
    return;
  }
  const sanitizedMessage = sanitizeMessage(message);
  const messageToken = generateMessageToken();
  const messageFile = path.join(MESSAGES_DIR, messageToken + ".txt");
  await writeMessageFile(messageFile, sanitizedMessage);

  res.redirect(
    `/messages/created?messageToken=${encodeURIComponent(messageToken)}`,
  );
});

export default router;
