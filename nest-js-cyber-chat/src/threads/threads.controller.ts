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
import type { Comment } from '../comments/comments.repository';
import type { Thread } from './threads.repository';
import { CreateThreadDto } from './dto/create-thread.dto';
import { AddCommentDto } from '../comments/dto/add-comment.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  create(@Body() dto: CreateThreadDto): Thread {
    return this.threadsService.create(dto.title, dto.body);
  }

  @Get()
  getAll(): Thread[] {
    return this.threadsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Thread & { comments: Comment[] } {
    const thread = this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    const comments = this.threadsService.getCommentsForThread(id);
    return { ...thread, comments };
  }

  @Post(':id/comments')
  addComment(
    @Param('id') threadId: string,
    @Body() dto: AddCommentDto,
  ): Comment {
    const thread = this.threadsService.getById(threadId);
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
  delete(@Param('id') id: string): void {
    const thread = this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    this.threadsService.delete(id);
  }
}
