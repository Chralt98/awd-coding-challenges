import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Comment } from './comments.entity';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
  ) {}

  async getAll(): Promise<CommentResponseDto[]> {
    const comments = await this.comments.find({
      relations: { thread: true },
      order: { createdAt: 'DESC' },
    });
    return comments.map((comment) =>
      plainToInstance(
        CommentResponseDto,
        {
          id: comment.id,
          threadId: comment.thread.id,
          body: comment.body,
          author: comment.author,
          createdAt: comment.createdAt,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getById(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.comments.findOne({
      where: { id },
      relations: { thread: true },
    });
    if (!comment) {
      return null;
    }
    return plainToInstance(
      CommentResponseDto,
      {
        id: comment.id,
        threadId: comment.thread.id,
        body: comment.body,
        author: comment.author,
        createdAt: comment.createdAt,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async add(
    threadId: string,
    author: string,
    body: string,
  ): Promise<CommentResponseDto> {
    const comment = this.comments.create({
      thread: { id: threadId },
      author,
      body,
    });
    const savedComment = await this.comments.save(comment);
    return plainToInstance(
      CommentResponseDto,
      {
        id: savedComment.id,
        threadId,
        body: savedComment.body,
        author: savedComment.author,
        createdAt: savedComment.createdAt,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getAllForThread(threadId: string): Promise<CommentResponseDto[]> {
    const comments = await this.comments.find({
      where: { thread: { id: threadId } },
      relations: { thread: true },
      order: { createdAt: 'DESC' },
    });
    return comments.map((comment) =>
      plainToInstance(
        CommentResponseDto,
        {
          id: comment.id,
          threadId: comment.thread.id,
          body: comment.body,
          author: comment.author,
          createdAt: comment.createdAt,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.comments.delete(id);
  }

  async deleteBody(id: string): Promise<boolean> {
    const commentEntity = await this.comments.findOne({
      where: { id },
      relations: { thread: true },
    });
    if (!commentEntity) {
      return false;
    }
    commentEntity.body = '[deleted]';
    await this.comments.save(commentEntity);
    return true;
  }
}
