import { Comment } from '../comments.entity';
import { CommentResponseDto } from '../dto/comment-response.dto';

export function toCommentResponseDto(comment: Comment): CommentResponseDto {
  return {
    id: comment.id,
    threadId: comment.thread.id,
    body: comment.body,
    author: comment.author,
    createdAt: comment.createdAt,
  };
}
