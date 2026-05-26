import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Comment | null> {
    return this.commentsRepository.findOne({ where: { id } });
  }

  async add(threadId: string, author: string, body: string): Promise<Comment> {
    const comment = this.commentsRepository.create({
      thread: { id: threadId },
      author,
      body,
    });
    return this.commentsRepository.save(comment);
  }

  async getAllForThread(threadId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { thread: { id: threadId } },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.commentsRepository.delete(id);
  }

  async deleteBody(id: string): Promise<boolean> {
    const comment = await this.getById(id);
    if (!comment) {
      return false;
    }
    comment.body = '[deleted]';
    await this.commentsRepository.save(comment);
    return true;
  }
}
