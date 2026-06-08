import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from '../comments/comments.service';
import { Thread } from './threads.entity';
import { ThreadsService } from './threads.service';
import { vi } from 'vitest';

const mockThreadsRepository = {
  findAndCount: vi.fn(),
  findOneBy: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

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
          useValue: mockThreadsRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ThreadsService>(ThreadsService);
  });

  // Test that calling findAndCount returns an array of threads provided by your mock repository.
  it('should return an array of threads', async () => {
    // Arrange: Program the mock to return a specific thread
    const testThreads = [
      {
        id: 'UUID_1234',
        title: 'My Title',
        author: 'Alice',
        body: 'Test thread',
        createdAt: new Date(),
        comments: [],
      },
    ];
    mockThreadsRepository.findAndCount.mockResolvedValue([testThreads, 1]);

    // Act: Call the service method
    const page = 1;
    const limit = 10;
    const pagination = { page, limit };
    const result = await service.getAll(pagination);

    // Assert: Verify the mock was called correctly and the output matches
    expect(mockThreadsRepository.findAndCount).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(result.data.at(0)!.author).toBe('Alice');
  });
});
