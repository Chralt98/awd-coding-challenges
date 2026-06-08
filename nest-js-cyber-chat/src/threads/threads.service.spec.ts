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

const mockCommentsService = {
  add: vi.fn(),
};

describe('ThreadsService', () => {
  let service: ThreadsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: CommentsService,
          useValue: mockCommentsService,
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
  it('should return an array of threads for getAll', async () => {
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
    mockThreadsRepository.findAndCount.mockResolvedValue([testThreads]);

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

  it('should return a thread by id for getById', async () => {
    // Arrange: Program the mock to return a specific thread
    const testThread = {
      id: 'UUID_1234',
      title: 'My Title',
      author: 'Alice',
      body: 'Test thread',
      createdAt: new Date(),
      comments: [],
    };
    mockThreadsRepository.findOneBy.mockResolvedValue(testThread);

    // Act: Call the service method
    const result = await service.getById('UUID_1234');

    // Assert: Verify the mock was called correctly and the output matches
    expect(mockThreadsRepository.findOneBy).toHaveBeenCalledWith({
      id: 'UUID_1234',
    });
    expect(result!.author).toBe('Alice');
  });

  it('should return null if thread not found for getById', async () => {
    // Arrange: Program the mock to return null
    mockThreadsRepository.findOneBy.mockResolvedValue(null);

    // Act: Call the service method
    const result = await service.getById('NON_EXISTENT_ID');
    // Assert: Verify the mock was called correctly and the output is null
    expect(mockThreadsRepository.findOneBy).toHaveBeenCalledWith({
      id: 'NON_EXISTENT_ID',
    });
    expect(result).toBeNull();
  });

  it('should return a new thread for create', async () => {
    const createThreadDto = {
      title: 'New Thread',
      body: 'This is a new thread',
    };
    const username = 'Bob';
    mockThreadsRepository.create.mockReturnValue({
      ...createThreadDto,
      username,
    });
    mockThreadsRepository.save.mockResolvedValue({
      ...createThreadDto,
      author: username,
      id: 'UUID_5678',
    });

    const result = await service.create(createThreadDto, username);

    expect(mockThreadsRepository.create).toHaveBeenCalledWith({
      ...createThreadDto,
      author: username,
    });
    expect(mockThreadsRepository.save).toHaveBeenCalledWith({
      ...createThreadDto,
      username,
    });
    expect(result.author).toBe(username);
    expect(result.id).toBe('UUID_5678');
    expect(result.title).toBe(createThreadDto.title);
    expect(result.body).toBe(createThreadDto.body);
  });

  it('should delete a thread for delete', async () => {
    // Arrange: Program the mock to return a specific thread
    const testThread = {
      id: 'UUID_1234',
      title: 'My Title',
      author: 'Alice',
      body: 'Test thread',
      createdAt: new Date(),
      comments: [],
    };
    mockThreadsRepository.findOneBy.mockResolvedValue(testThread);
    mockThreadsRepository.save.mockResolvedValue({
      ...testThread,
    });
    mockThreadsRepository.save.mockResolvedValue({
      ...testThread,
    });

    await service.delete('UUID_1234');

    expect(mockThreadsRepository.delete).toHaveBeenCalledWith('UUID_1234');
  });

  it('should create a Comment and correctly associate it with a Thread ID before saving it to the repository', async () => {
    const threadId = 'UUID_1234';
    const createCommentDto = {
      body: 'This is a comment',
    };
    const username = 'Charlie';

    // Mock the commentsService.add method to return a CommentResponseDto
    const mockCommentResponse = {
      id: 'COMMENT_UUID_5678',
      threadId,
      body: createCommentDto.body,
      author: username,
      createdAt: new Date(),
    };
    mockCommentsService.add.mockResolvedValue(mockCommentResponse);

    const result = await service.addCommentForThread(
      threadId,
      createCommentDto,
      username,
    );

    expect(mockCommentsService.add).toHaveBeenCalledWith(
      threadId,
      username,
      createCommentDto.body,
    );
    expect(result).toEqual(mockCommentResponse);
  });
});
