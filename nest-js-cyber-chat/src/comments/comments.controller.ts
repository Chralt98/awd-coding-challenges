import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
  ForbiddenException,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { AuthUser } from '../auth/auth.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by its ID' })
  @ApiOkResponse({ description: 'Returns the comment' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
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
  @ApiOperation({ summary: 'Delete a comment by its ID' })
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'You are not allowed to delete this comment',
  })
  @ApiBearerAuth()
  async delete(
    @Request() req: { user: AuthUser },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const comment = await this.commentsService.getById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    if (comment.author !== req.user.username) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    await this.commentsService.deleteBody(id);
  }
}
