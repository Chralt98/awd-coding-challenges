import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import type { Comment } from '../comments/comments.entity';
import { Thread } from './threads.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly commentsService: CommentsService,
    @InjectRepository(Thread)
    private readonly threads: Repository<Thread>,
  ) {}

  async getAll(): Promise<Thread[]> {
    return this.threads.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Thread | null> {
    return this.threads.findOneBy({ id });
  }

  async create(title: string, body: string): Promise<Thread> {
    const thread = this.threads.create({
      title,
      body,
      author: 'Anonymous',
    });
    return this.threads.save(thread);
  }

  async addCommentForThread(
    threadId: string,
    author: string,
    body: string,
  ): Promise<Comment> {
    const thread = await this.threads.findOneBy({ id: threadId });
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.add(threadId, author, body);
  }

  async getCommentsForThread(threadId: string) {
    const thread = await this.threads.findOneBy({ id: threadId });
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.getAllForThread(threadId);
  }

  async delete(id: string): Promise<DeleteResult> {
    const thread = await this.threads.findOneBy({ id });
    if (!thread) {
      throw new Error(`Thread with id ${id} not found`);
    }
    thread.comments = [];
    await this.threads.save(thread);
    return this.threads.delete(id);
  }
}
