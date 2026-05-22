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
}
