import type { NextFunction, Request, Response } from "express";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { access, constants, writeFile } from "node:fs/promises";

export const LOG_FILE = path.join(process.cwd(), "logs", "logs.txt");

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureLogFile(filePath: string): Promise<void> {
  const exists = await fileExists(filePath);

  if (!exists) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, "", { encoding: "utf-8" });
  }
}

async function addLogMessage(message: string): Promise<void> {
  await appendFile(LOG_FILE, message + "\n", { encoding: "utf-8" });
}

export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", async () => {
    const logEntry = [
      new Date().toISOString(),
      req.method,
      req.ip,
      req.originalUrl,
      res.statusCode,
    ].join(" ");

    await addLogMessage(logEntry);
  });

  next();
}
