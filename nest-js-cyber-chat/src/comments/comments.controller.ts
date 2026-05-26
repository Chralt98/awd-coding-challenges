import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Get, Delete, Param, NotFoundException } from '@nestjs/common';
import type { Comment } from './comments.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Comment> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    await this.commentsService.deleteBody(id);
  }
}
