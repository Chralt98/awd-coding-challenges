import { Injectable } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository';

@Injectable()
export class ThreadsService {
  constructor(private readonly threadsRepository: ThreadsRepository) {}
}
