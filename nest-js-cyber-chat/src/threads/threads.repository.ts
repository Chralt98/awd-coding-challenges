import { Injectable } from '@nestjs/common';

export type Thread = {
  id: number;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

@Injectable()
export class ThreadsRepository {
  private threads: Map<string, Thread> = new Map();

  getAll(): Map<string, Thread> {
    return this.threads;
  }

  getById(id: string): Thread | undefined {
    return this.threads.get(id);
  }

  create(title: string, body: string): Thread {
    const id = this.threads.size + 1;
    const thread: Thread = {
      id,
      title,
      author,
      body,
      createdAt: Date.now(),
    };
    this.threads.set(id, thread);
  }
}
