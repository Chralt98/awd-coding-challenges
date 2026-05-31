import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Get, Delete, Param, NotFoundException } from '@nestjs/common';
import { CommentResponseDto } from './dto/comment-response.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    await this.commentsService.deleteBody(id);
  }
}
