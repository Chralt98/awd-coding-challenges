import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';

@Module({
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
