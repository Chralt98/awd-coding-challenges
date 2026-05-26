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
    private readonly threadsRepository: Repository<Thread>,
  ) {}

  async getAll(): Promise<Thread[]> {
    return this.threadsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Thread | null> {
    return this.threadsRepository.findOneBy({ id });
  }

  async create(title: string, body: string): Promise<Thread> {
    const thread = this.threadsRepository.create({
      title,
      body,
      author: 'Anonymous',
    });
    return this.threadsRepository.save(thread);
  }

  async addCommentForThread(
    threadId: string,
    author: string,
    body: string,
  ): Promise<Comment> {
    const thread = await this.threadsRepository.findOneBy({ id: threadId });
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.add(threadId, author, body);
  }

  async getCommentsForThread(threadId: string) {
    const thread = await this.threadsRepository.findOneBy({ id: threadId });
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.getAllForThread(threadId);
  }

  async delete(id: string): Promise<DeleteResult> {
    const thread = await this.threadsRepository.findOneBy({ id });
    if (!thread) {
      throw new Error(`Thread with id ${id} not found`);
    }
    thread.comments = [];
    await this.threadsRepository.save(thread);
    return this.threadsRepository.delete(id);
  }
}
