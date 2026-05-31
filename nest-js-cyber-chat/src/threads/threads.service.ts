import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import type { Comment } from '../comments/comments.entity';
import { Thread } from './threads.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';

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

  async getByIdWithComments(id: string): Promise<Thread | null> {
    return this.threads.findOne({
      where: { id },
      relations: { comments: { thread: true } },
    });
  }

  async create(title: string, body: string): Promise<Thread> {
    const thread = this.threads.create({
      title,
      body,
      author: 'Anonymous',
    });
    return this.threads.save(thread);
  }

  async update(id: string, dto: UpdateThreadDto): Promise<Thread> {
    const thread = await this.threads.findOneBy({ id });
    if (!thread) {
      throw new Error(`Thread with id ${id} not found`);
    }
    thread.title = dto.title ?? thread.title;
    thread.body = dto.body ?? thread.body;
    return this.threads.save(thread);
  }

  async addCommentForThread(
    threadId: string,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const thread = await this.threads.findOneBy({ id: threadId });
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found`);
    }
    const { author, body } = dto;
    return this.commentsService.add(threadId, author, body);
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
