import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import type { Comment } from '../comments/comments.repository';
import type { Thread } from './threads.repository';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  create(@Param('title') title: string, @Body() body: string): Thread {
    return this.threadsService.create(title, body);
  }

  @Get()
  getAll(): Thread[] {
    return this.threadsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Thread {
    const thread = this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post(':id/comments')
  addComment(
    @Param('id') threadId: string,
    @Body() dto: AddCommentDto,
  ): Thread {}
}
