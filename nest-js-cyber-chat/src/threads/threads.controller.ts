import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  NotFoundException,
  Delete,
  Patch,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { toThreadResponseDto } from './mappers/thread-response.mapper';
import { toCommentResponseDto } from '../comments/mappers/comment-response.mapper';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  async create(@Body() dto: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.create(dto.title, dto.body);
    return toThreadResponseDto(thread);
  }

  @Get()
  async getAll(): Promise<ThreadResponseDto[]> {
    const threads = await this.threadsService.getAll();
    return threads.map((thread) => toThreadResponseDto(thread));
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    const comments = await this.threadsService.getCommentsForThread(id);
    return toThreadResponseDto({ ...thread, comments });
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') threadId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const thread = await this.threadsService.getById(threadId);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${threadId} not found`);
    }
    const comment = await this.threadsService.addCommentForThread(
      threadId,
      dto,
    );
    return toCommentResponseDto(comment);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    const updatedThread = await this.threadsService.update(id, dto);
    const comments = await this.threadsService.getCommentsForThread(id);
    return toThreadResponseDto({ ...updatedThread, comments });
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
