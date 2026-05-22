import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsRepository } from './threads.repository';

@Module({
  providers: [ThreadsService, ThreadsRepository],
})
export class ThreadsModule {}
