import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';

@Module({
  providers: [ThreadsService]
})
export class ThreadsModule {}
