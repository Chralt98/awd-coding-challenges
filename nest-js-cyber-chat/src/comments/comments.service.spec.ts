import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';
import { vi } from 'vitest';

const mockCommentsRepository = {
  find: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentsRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should return an array of comments for getAll', async () => {
    const testComments = [
      {
        id: 'COMMENT_UUID_1234',
        thread: { id: 'THREAD_UUID_1234' },
        author: 'Alice',
        body: 'This is a comment',
        createdAt: new Date(),
      },
    ];
    mockCommentsRepository.find.mockResolvedValue(testComments);

    const result = await service.getAll();

    expect(mockCommentsRepository.find).toHaveBeenCalledWith({
      relations: { thread: true },
      order: { createdAt: 'DESC' },
    });
    expect(result.at(0)!.author).toBe('Alice');
    expect(result.at(0)!.threadId).toBe('THREAD_UUID_1234');
  });

  it('should return a comment by id for getById', async () => {
    const testComment = {
      id: 'COMMENT_UUID_1234',
      thread: { id: 'THREAD_UUID_1234' },
      author: 'Alice',
      body: 'This is a comment',
      createdAt: new Date(),
    };
    mockCommentsRepository.findOne.mockResolvedValue(testComment);

    const result = await service.getById('COMMENT_UUID_1234');

    expect(mockCommentsRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'COMMENT_UUID_1234' },
      relations: { thread: true },
    });
    expect(result!.id).toBe('COMMENT_UUID_1234');
    expect(result!.threadId).toBe('THREAD_UUID_1234');
  });

  it('should return null if comment not found for getById', async () => {
    mockCommentsRepository.findOne.mockResolvedValue(null);

    const result = await service.getById('NON_EXISTENT_ID');

    expect(mockCommentsRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'NON_EXISTENT_ID' },
      relations: { thread: true },
    });
    expect(result).toBeNull();
  });

  it('should create a comment and return it for add', async () => {
    const threadId = 'THREAD_UUID_1234';
    const author = 'Charlie';
    const body = 'This is a new comment';
    const createdComment = {
      thread: { id: threadId },
      author,
      body,
    };
    const savedComment = {
      id: 'COMMENT_UUID_5678',
      thread: { id: threadId },
      author,
      body,
      createdAt: new Date(),
    };
    mockCommentsRepository.create.mockReturnValue(createdComment);
    mockCommentsRepository.save.mockResolvedValue(savedComment);

    const result = await service.add(threadId, author, body);

    expect(mockCommentsRepository.create).toHaveBeenCalledWith({
      thread: { id: threadId },
      author,
      body,
    });
    expect(mockCommentsRepository.save).toHaveBeenCalledWith(createdComment);
    expect(result.id).toBe('COMMENT_UUID_5678');
    expect(result.threadId).toBe(threadId);
    expect(result.body).toBe(body);
    expect(result.author).toBe(author);
  });

  it('should delete a comment for delete', async () => {
    await service.delete('COMMENT_UUID_1234');

    expect(mockCommentsRepository.delete).toHaveBeenCalledWith(
      'COMMENT_UUID_1234',
    );
  });
});
