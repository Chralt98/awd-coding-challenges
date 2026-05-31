import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
  ) {}

  async getAll(): Promise<Comment[]> {
    return this.comments.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Comment | null> {
    return this.comments.findOne({
      where: { id },
      relations: { thread: true },
    });
  }

  async add(threadId: string, author: string, body: string): Promise<Comment> {
    const comment = this.comments.create({
      thread: { id: threadId },
      author,
      body,
    });
    return this.comments.save(comment);
  }

  async getAllForThread(threadId: string): Promise<Comment[]> {
    return this.comments.find({
      where: { thread: { id: threadId } },
      relations: { thread: true },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.comments.delete(id);
  }

  async deleteBody(id: string): Promise<boolean> {
    const comment = await this.getById(id);
    if (!comment) {
      return false;
    }
    comment.body = '[deleted]';
    await this.comments.save(comment);
    return true;
  }
}
