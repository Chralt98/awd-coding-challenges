import { Injectable } from '@nestjs/common';

export type Comment = {
  id: number;
  threadId: string;
  author: string;
  body: string;
  createdAt: Date;
};

@Injectable()
export class CommentsRepository {
  private comments: Map<string, Comment> = new Map();

  getAll(): Map<string, Comment> {
    return this.comments;
  }

  getById(id: string): Comment | undefined {
    return this.comments.get(id);
  }

  add(threadId: string, author: string, body: string): Comment {
    const id = this.comments.size + 1;
    const comment: Comment = {
      id,
      threadId,
      author,
      body,
      createdAt: new Date(),
    };
    this.comments.set(id.toString(), comment);
    return comment;
  }

  getAllForThread(threadId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.threadId === threadId,
    );
  }

  delete(id: string): boolean {
    return this.comments.delete(id);
  }
}
