import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { vi } from 'vitest';
import request from 'supertest';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thread } from './threads.entity';
import { CommentsService } from '../comments/comments.service';

const createdAt = new Date('2026-06-02T10:30:00.000Z');

const createdThread = {
  title: 'Thread 1',
  body: 'This is the body.',
  author: 'Alice',
};

const savedThread = {
  ...createdThread,
  id: 'UUID_1234',
  createdAt,
  comments: [],
};

const mockThreadsRepository = {
  create: vi.fn().mockReturnValue(createdThread),
  save: vi.fn().mockResolvedValue(savedThread),
};

class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'USER_UUID_1234', username: 'Alice' };
    return true;
  }
}

describe('ThreadsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        ThreadsService,
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadsRepository,
        },
        {
          provide: CommentsService,
          useValue: {},
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalGuards(new TestAuthGuard());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockThreadsRepository.create.mockReturnValue(createdThread);
    mockThreadsRepository.save.mockResolvedValue(savedThread);
  });

  it('POST /threads returns 201 Created for a valid body', async () => {
    await request(app.getHttpServer())
      .post('/threads')
      .send({
        title: 'Thread 1',
        body: 'This is the body.',
      })
      .expect(201)
      .expect({
        id: 'UUID_1234',
        title: 'Thread 1',
        body: 'This is the body.',
        author: 'Alice',
        createdAt: createdAt.toISOString(),
        comments: [],
      });

    expect(mockThreadsRepository.create).toHaveBeenCalledWith({
      title: 'Thread 1',
      body: 'This is the body.',
      author: 'Alice',
    });
    expect(mockThreadsRepository.save).toHaveBeenCalledWith(createdThread);
  });

  afterAll(async () => {
    await app.close();
  });
});
