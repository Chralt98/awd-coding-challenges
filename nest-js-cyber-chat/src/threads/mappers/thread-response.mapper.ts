import { Thread } from '../threads.entity';
import { ThreadResponseDto } from '../dto/thread-response.dto';

export function toThreadResponseDto(thread: Thread): ThreadResponseDto {
  return {
    id: thread.id,
    title: thread.title,
    body: thread.body,
    createdAt: thread.createdAt,
    author: thread.author,
    comments: (thread.comments ?? []).map((comment) => ({
      id: comment.id,
      threadId: comment.thread.id,
      body: comment.body,
      author: comment.author,
      createdAt: comment.createdAt,
    })),
  };
}
