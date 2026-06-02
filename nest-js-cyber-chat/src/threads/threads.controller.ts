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
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { AuthUser } from '../auth/auth.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new thread' })
  @ApiCreatedResponse({ description: 'Thread created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(
    @Request() req: { user: AuthUser },
    @Body() dto: CreateThreadDto,
  ): Promise<ThreadResponseDto> {
    return this.threadsService.create(dto, req.user.username);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get a paginated list of threads' })
  @ApiOkResponse({ description: 'Returns a paginated list of threads' })
  async getAll(@Query() pagination: PaginationQueryDto): Promise<{
    data: ThreadResponseDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.threadsService.getAll(pagination);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a thread by its ID, including its comments' })
  @ApiOkResponse({ description: 'Returns the thread with its comments' })
  @ApiNotFoundResponse({ description: 'Thread not found' })
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
  @ApiOperation({ summary: 'Add a comment to a thread' })
  @ApiCreatedResponse({ description: 'Comment added successfully' })
  @ApiNotFoundResponse({ description: 'Thread not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async addComment(
    @Request() req: { user: AuthUser },
    @Param('id', ParseUUIDPipe) threadId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const thread = await this.threadsService.getById(threadId);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${threadId} not found`);
    }
    return this.threadsService.addCommentForThread(
      threadId,
      dto,
      req.user.username,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a thread by its ID' })
  @ApiOkResponse({ description: 'Thread updated successfully' })
  @ApiNotFoundResponse({ description: 'Thread not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'You are not allowed to update this thread',
  })
  async update(
    @Request() req: { user: AuthUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    if (thread.author !== req.user.username) {
      throw new ForbiddenException('You are not allowed to update this thread');
    }
    return this.threadsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a thread by its ID' })
  @ApiNotFoundResponse({ description: 'Thread not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'You are not allowed to delete this thread',
  })
  async delete(
    @Request() req: { user: AuthUser },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const thread = await this.threadsService.getById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    if (thread.author !== req.user.username) {
      throw new ForbiddenException('You are not allowed to delete this thread');
    }
    await this.threadsService.delete(id);
  }
}
