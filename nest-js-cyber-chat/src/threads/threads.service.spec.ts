import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from '../comments/comments.service';
import { Thread } from './threads.entity';
import { ThreadsService } from './threads.service';

describe('ThreadsService', () => {
  let service: ThreadsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: CommentsService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Thread),
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
