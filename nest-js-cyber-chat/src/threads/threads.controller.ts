import { Controller, Param, Body, Post } from '@nestjs/common';
import { ThreadsService } from './threads.service';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  createThread(@Param('title') title: string, @Body() body: string) {}
}
