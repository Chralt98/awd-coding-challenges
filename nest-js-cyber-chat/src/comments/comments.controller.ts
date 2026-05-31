import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Get, Delete, Param, NotFoundException } from '@nestjs/common';
import { CommentResponseDto } from './dto/comment-response.dto';
import { toCommentResponseDto } from './mappers/comment-response.mapper';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<CommentResponseDto> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return toCommentResponseDto(comment);
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
