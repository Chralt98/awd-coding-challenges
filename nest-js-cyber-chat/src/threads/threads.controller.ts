import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  NotFoundException,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  async create(@Body() dto: CreateThreadDto): Promise<ThreadResponseDto> {
    return this.threadsService.create(dto);
  }

  @Get()
  async getAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: ThreadResponseDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.threadsService.getAll(pagination);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.getByIdWithComments(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post(':id/comments')
  async addComment(
    @Param('id', ParseUUIDPipe) threadId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const thread = await this.threadsService.getById(threadId);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${threadId} not found`);
    }
    return this.threadsService.addCommentForThread(threadId, dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return this.threadsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    await this.threadsService.delete(id);
  }
}
