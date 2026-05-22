import { Injectable } from '@nestjs/common';

type Thread = {
  id: number;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

@Injectable()
export class ThreadsRepository {
  private threads: Map<string, Thread> = new Map();
}
