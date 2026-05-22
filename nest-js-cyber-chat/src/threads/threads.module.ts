import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsRepository } from './threads.repository';
import { ThreadsController } from './threads.controller';

@Module({
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
