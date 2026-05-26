import { Injectable } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository';
import { Thread } from './threads.repository';
import { CommentsService } from '../comments/comments.service';
import type { Comment } from '../comments/comments.repository';
import { Thread as ThreadEntity } from './threads.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly threadsRepository: ThreadsRepository,
    private readonly commentsService: CommentsService,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
  ) {}

  getAll(): Thread[] {
    return this.threadsRepository.getAll();
  }

  getById(id: string): Thread | undefined {
    return this.threadsRepository.getById(id);
  }

  create(title: string, body: string): Thread {
    return this.threadsRepository.create(title, body);
  }

  addCommentForThread(threadId: string, author: string, body: string): Comment {
    const thread = this.threadsRepository.getById(threadId);
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.add(threadId, author, body);
  }

  getCommentsForThread(threadId: string) {
    const thread = this.threadsRepository.getById(threadId);
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.getAllForThread(threadId);
  }

  delete(id: string): boolean {
    this.commentsService.getAllForThread(id).forEach((comment) => {
      this.commentsService.delete(comment.id.toString());
    });

    return this.threadsRepository.delete(id);
  }
}
