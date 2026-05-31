import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { Thread } from './threads.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { plainToInstance } from 'class-transformer';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { CreateThreadDto } from './dto/create-thread.dto';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly commentsService: CommentsService,
    @InjectRepository(Thread)
    private readonly threads: Repository<Thread>,
  ) {}

  async getAll(): Promise<ThreadResponseDto[]> {
    const threads = await this.threads.find({
      order: { createdAt: 'DESC' },
    });
    return threads.map((thread) =>
      plainToInstance(ThreadResponseDto, thread, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getById(id: string): Promise<ThreadResponseDto | null> {
    const thread = await this.threads.findOneBy({ id });
    if (!thread) {
      return null;
    }
    return plainToInstance(ThreadResponseDto, thread, {
      excludeExtraneousValues: true,
    });
  }

  async getByIdWithComments(id: string): Promise<ThreadResponseDto | null> {
    const thread = await this.threads.findOne({
      where: { id },
      relations: { comments: { thread: true } },
    });
    if (!thread) {
      return null;
    }
    return plainToInstance(
      ThreadResponseDto,
      {
        ...thread,
        comments: (thread.comments ?? []).map((comment) => ({
          id: comment.id,
          threadId: comment.thread.id,
          body: comment.body,
          author: comment.author,
          createdAt: comment.createdAt,
        })),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async create(dto: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = this.threads.create({
      title: dto.title,
      body: dto.body,
      author: dto.author,
    });
    const savedThread = await this.threads.save(thread);
    return plainToInstance(ThreadResponseDto, savedThread, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: UpdateThreadDto): Promise<ThreadResponseDto> {
    // controller already checks if thread exists
    const thread = (await this.threads.findOneBy({ id }))!;
    thread.title = dto.title ?? thread.title;
    thread.body = dto.body ?? thread.body;
    const savedThread = await this.threads.save(thread);
    return plainToInstance(ThreadResponseDto, savedThread, {
      excludeExtraneousValues: true,
    });
  }

  async addCommentForThread(
    threadId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const { author, body } = dto;
    return this.commentsService.add(threadId, author, body);
  }

  async delete(id: string): Promise<DeleteResult> {
    // controller already checks if thread exists
    const thread = (await this.threads.findOneBy({ id }))!;
    thread.comments = [];
    await this.threads.save(thread);
    return this.threads.delete(id);
  }
}
