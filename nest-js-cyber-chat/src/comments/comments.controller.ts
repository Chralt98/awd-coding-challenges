import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Get, Delete, Param, NotFoundException } from '@nestjs/common';
import type { Comment } from './comments.repository';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getOne(@Param('id') id: string): Comment {
    const comment = this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    const comment = this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    this.commentsService.deleteBody(id);
  }
}
