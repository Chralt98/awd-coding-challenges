import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import type { Comment } from './comments.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment as CommentEntity } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  getAll(): Map<string, Comment> {
    return this.commentsRepository.getAll();
  }

  getById(id: string): Comment | undefined {
    return this.commentsRepository.getById(id);
  }

  add(threadId: string, author: string, body: string): Comment {
    return this.commentsRepository.add(threadId, author, body);
  }

  getAllForThread(threadId: string): Comment[] {
    return this.commentsRepository.getAllForThread(threadId);
  }

  delete(id: string): boolean {
    return this.commentsRepository.delete(id);
  }

  deleteBody(id: string): boolean {
    return this.commentsRepository.deleteBody(id);
  }
}
