import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { CommentsModule } from '../comments/comments.module';
import { Thread } from './threads.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [CommentsModule, TypeOrmModule.forFeature([Thread])],
  providers: [ThreadsService],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
