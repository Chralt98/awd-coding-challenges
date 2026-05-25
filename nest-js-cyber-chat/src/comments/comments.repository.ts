import { Injectable } from '@nestjs/common';

export type Comment = {
  id: number;
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

  add(author: string, body: string): Comment {
    const id = this.comments.size + 1;
    const comment: Comment = {
      id,
      author,
      body,
      createdAt: new Date(),
    };
    this.comments.set(id.toString(), comment);
    return comment;
  }
}
