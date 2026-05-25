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

  getAll(): Thread[] {
    return Array.from(this.threads.values());
  }

  getById(id: string): Thread | undefined {
    return this.threads.get(id);
  }

  create(title: string, body: string): Thread {
    const id = this.threads.size + 1;
    const thread: Thread = {
      id,
      title,
      // TODO: Where does the author come from? For now, we'll just use a placeholder.
      author: 'Anonymous',
      body,
      createdAt: new Date(),
    };
    this.threads.set(id.toString(), thread);
    return thread;
  }
}
