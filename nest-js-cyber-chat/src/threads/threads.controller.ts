import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import type { Comment } from '../comments/comments.entity';
import type { Thread } from './threads.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  async create(@Body() dto: CreateThreadDto): Promise<Thread> {
    return this.threadsService.create(dto.title, dto.body);
  }

  @Get()
  async getAll(): Promise<Thread[]> {
    return this.threadsService.getAll();
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<Thread & { comments: Comment[] }> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    const comments = await this.threadsService.getCommentsForThread(id);
    return { ...thread, comments };
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') threadId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<Comment> {
    const thread = await this.threadsService.getById(threadId);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${threadId} not found`);
    }
    return this.threadsService.addCommentForThread(
      threadId,
      dto.author,
      dto.body,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    await this.threadsService.delete(id);
  }
}
