import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsRepository } from './threads.repository';
import { ThreadsController } from './threads.controller';
import { CommentsModule } from '../comments/comments.module';
@Module({
  imports: [CommentsModule],
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
