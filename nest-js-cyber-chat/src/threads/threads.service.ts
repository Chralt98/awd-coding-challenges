import { Injectable } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository';
import { Thread } from './threads.repository';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly threadsRepository: ThreadsRepository,
    private readonly commentsService: CommentsService,
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

  addCommentForThread(threadId: string, author: string, body: string) {
    const thread = this.threadsRepository.getById(threadId);
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    return this.commentsService.add(author, body);
  }
}
