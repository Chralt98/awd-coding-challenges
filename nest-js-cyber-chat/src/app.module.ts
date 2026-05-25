import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { ThreadsRepository } from './threads/threads.repository';
import { CommentsRepository } from './comments/comments.repository';

@Module({
  imports: [ThreadsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, ThreadsRepository, CommentsRepository],
})
export class AppModule {}
